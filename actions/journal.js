"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/prisma";
import { getPixabayImage } from "./public";
import { MOODS, getMoodById } from "@/app/lib/moods";
import { request } from "@arcjet/next";
import aj from "@/lib/arcjet";

/**
 * Creates a new journal entry.
 * Applies rate limiting, fetches a mood image, and clears user drafts.
 * 
 * @param {Object} data - Entry data including title, content, mood, etc.
 * @returns {Promise<Object>} - The created journal entry.
 */
export async function createJournalEntry(data) {
  try {
    const user = await getAuthenticatedUser();

    // Check rate limit
    const req = await request();
    const decision = await aj.protect(req, {
      userId: user.clerkUserId,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: { remaining, resetInSeconds: reset },
        });
        throw new Error("Too many requests. Please try again later.");
      }
      throw new Error("Request blocked");
    }

    const mood = MOODS[data.mood.toUpperCase()];
    if (!mood) throw new Error("Invalid mood selected");

    const moodImageUrl = await getPixabayImage(data.moodQuery);

    const entry = await db.entry.create({
      data: {
        title: data.title,
        content: data.content,
        mood: mood.id,
        moodScore: mood.score,
        moodImageUrl,
        userId: user.id,
        collectionId: data.collectionId || null,
      },
    });

    // Clean up draft after successful creation
    await db.draft.deleteMany({
      where: { userId: user.id },
    });

    revalidatePath("/dashboard");
    return entry;
  } catch (error) {
    console.error("Error creating journal entry:", error.message);
    throw error;
  }
}

/**
 * Retrieves journal entries with optional filtering and pagination.
 * 
 * @param {Object} filters - Filter options (collectionId, etc.).
 * @returns {Promise<Object>} - Object containing success state and data (entries).
 */
export async function getJournalEntries({
  collectionId,
  orderBy = "desc",
} = {}) {
  try {
    const user = await getAuthenticatedUser();

    const where = {
      userId: user.id,
      ...(collectionId === "unorganized"
        ? { collectionId: null }
        : collectionId
          ? { collectionId }
          : {}),
    };

    const entries = await db.entry.findMany({
      where,
      include: {
        collection: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: orderBy },
    });

    // Enhance entries with mood data
    const entriesWithMoodData = entries.map((entry) => ({
      ...entry,
      moodData: getMoodById(entry.mood),
    }));

    return {
      success: true,
      data: { entries: entriesWithMoodData },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Retrieves a single journal entry by ID.
 * 
 * @param {string} id - The ID of the entry.
 * @returns {Promise<Object>} - The journal entry.
 */
export async function getJournalEntry(id) {
  try {
    const user = await getAuthenticatedUser();

    const entry = await db.entry.findUnique({
      where: { id },
    });

    if (!entry || entry.userId !== user.id) {
      throw new Error("Journal entry not found");
    }

    return entry;
  } catch (error) {
    console.error("Error getting journal entry:", error.message);
    throw error;
  }
}

/**
 * Updates an existing journal entry.
 * If the mood changes, fetches a new mood image.
 * 
 * @param {Object} data - Updated entry data.
 * @returns {Promise<Object>} - The updated entry.
 */
export async function updateJournalEntry(data) {
  try {
    const user = await getAuthenticatedUser();

    const existingEntry = await db.entry.findFirst({
      where: {
        userId: user.id,
        id: data.id,
      },
    });

    if (!existingEntry) throw new Error("Journal entry not found");

    const mood = MOODS[data.mood.toUpperCase()];
    if (!mood) throw new Error("Invalid mood selected");

    let moodImageUrl = existingEntry.moodImageUrl;
    if (existingEntry.mood !== mood.id) {
      moodImageUrl = await getPixabayImage(data.moodQuery);
    }

    const updatedEntry = await db.entry.update({
      where: { id: data.id },
      data: {
        title: data.title,
        content: data.content,
        mood: mood.id,
        moodScore: mood.score,
        moodImageUrl,
        collectionId: data.collectionId || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/journal/${data.id}`);
    return updatedEntry;
  } catch (error) {
    console.error("Error updating journal entry:", error.message);
    throw error;
  }
}

/**
 * Deletes a journal entry.
 * 
 * @param {string} id - The ID of the entry to delete.
 * @returns {Promise<Object>} - The deleted entry data.
 */
export async function deleteJournalEntry(id) {
  try {
    const user = await getAuthenticatedUser();

    const entry = await db.entry.findFirst({
      where: {
        userId: user.id,
        id,
      },
    });

    if (!entry) throw new Error("Journal entry not found");

    await db.entry.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    return entry;
  } catch (error) {
    console.error("Error deleting journal entry:", error.message);
    throw error;
  }
}

/**
 * Retrieves the user's current draft.
 * 
 * @returns {Promise<Object>} - Success state and draft data.
 */
export async function getDraft() {
  try {
    const user = await getAuthenticatedUser();

    const draft = await db.draft.findUnique({
      where: { userId: user.id },
    });

    return { success: true, data: draft };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Saves (upserts) the user's current draft.
 * 
 * @param {Object} data - Draft data.
 * @returns {Promise<Object>} - Success state and saved draft.
 */
export async function saveDraft(data) {
  try {
    const user = await getAuthenticatedUser();

    const draft = await db.draft.upsert({
      where: { userId: user.id },
      create: {
        title: data.title,
        content: data.content,
        mood: data.mood,
        userId: user.id,
      },
      update: {
        title: data.title,
        content: data.content,
        mood: data.mood,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: draft };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Helper function to authenticate and retrieve the current user from the database.
 * 
 * @returns {Promise<Object>} - The user object.
 * @throws {Error} - If unauthorized or user not found.
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