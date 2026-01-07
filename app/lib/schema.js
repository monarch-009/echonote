import { z } from "zod";

/**
 * Zod schema for validating journal entry data.
 * Used in forms and server actions.
 */
export const journalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  mood: z.string().min(1, "Mood is required"),
  collectionId: z.string().optional(),
});

/**
 * Zod schema for validating collection data.
 */
export const collectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});