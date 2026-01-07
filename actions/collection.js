"use server";

import aj from "@/lib/arcjet";
import db from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Creates a new collection for the authenticated user.
 * Applies rate limiting using ArcJet.
 * 
 * @param {Object} data - The collection data.
 * @param {string} data.name - The name of the collection.
 * @param {string} data.description - The description of the collection (optional).
 * @returns {Promise<Object>} - The created collection object.
 * @throws {Error} - Throws error if unauthorized, rate limited, or creation fails.
 */
export async function createCollection(data) {
  try {
    const user = await getAuthenticatedUser();

    // Get request data for ArcJet
    const req = await request();

    // Check rate limit
    const decision = await aj.protect(req, {
      userId: user.clerkUserId, // Use Clerk User ID for rate limiting
      requested: 1, // Specify how many tokens to consume
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Request blocked");
    }

    const collection = await db.collection.create({
      data: {
        name: data.name,
        description: data.description,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return collection;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Retrieves all collections for the authenticated user.
 * Ordered by creation date in descending order.
 * 
 * @returns {Promise<Array>} - List of user's collections.
 * @throws {Error} - Throws if unauthorized or user not found.
 */
export async function getCollections() {
  const user = await getAuthenticatedUser();

  const collections = await db.collection.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return collections;
}

/**
 * Retrieves a single collection by ID.
 * Verifies that the collection belongs to the authenticated user.
 * 
 * @param {string} collectionId - The ID of the collection to fetch.
 * @returns {Promise<Object|null>} - The collection object or null if not found/unauthorized.
 */
export async function getCollection(collectionId) {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const collection = await db.collection.findUnique({
    where: { id: collectionId },
  });

  if (!collection || collection.userId !== user.id) {
    return null;
  }

  return collection;
}

/**
 * Deletes a collection or clears the "unorganized" pseudo-collection.
 * If deleting a real collection, cascade deletes associated entries (database handled).
 * If "unorganized", deletes all entries with null collectionId.
 * 
 * @param {string} id - The ID of the collection to delete, or "unorganized".
 * @returns {Promise<boolean>} - True if deletion was successful.
 * @throws {Error} - Throws if unauthorized, collection not found, or deletion fails.
 */
export async function deleteCollection(id) {
  try {
    const user = await getAuthenticatedUser();

    if (id === "unorganized") {
      await db.entry.deleteMany({
        where: {
          userId: user.id,
          collectionId: null,
        },
      });
      revalidatePath("/dashboard");
      return true;
    }

    // Check if collection exists and belongs to user
    const collection = await db.collection.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!collection) throw new Error("Collection not found");

    // Delete the collection
    await db.collection.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Helper function to authenticate and retrieve the current user from the database.
 * 
 * @returns {Promise<Object>} - The user object from the database.
 * @throws {Error} - Throws "Unauthorized" or "User not found".
 */
async function getAuthenticatedUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return user;
}