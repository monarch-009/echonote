"use server";

import { revalidateTag, unstable_cache } from "next/cache";

/**
 * Fetches an image URL from Pixabay based on a search query.
 * specifically filters for illustrations in the 'feelings' category
 * having a minimum resolution of 1280x720.
 * 
 * @param {string} query - The search term for the image (e.g., "happy", "sad").
 * @returns {Promise<string|null>} - The URL of the finding image or null if not found/error.
 */
export async function getPixabayImage(query) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const res = await fetch(
      `https://pixabay.com/api/?q=${encodedQuery}&key=${process.env.PIXABAY_API_KEY}&min_width=1280&min_height=720&image_type=illustration&category=feelings`
    );
    const data = await res.json();
    return data.hits[0]?.largeImageURL || null;
  } catch (error) {
    console.error("Pixabay API Error:", error);
    return null;
  }
}

/**
 * Fetches a daily prompt (advice) from an external API.
 * Caches the result for 24 hours (86400 seconds) to provide a consistent daily prompt.
 * 
 * @returns {Promise<Object>} - Object containing success status and the prompt data.
 */
export const getDailyPrompt = unstable_cache(
  async () => {
    try {
      const res = await fetch("https://api.adviceslip.com/advice", {
        cache: "no-store",
      });
      const data = await res.json();
      return {
        success: true,
        data: data.slip.advice,
      };
    } catch (error) {
      return {
        success: false,
        data: "What's on your mind today?",
      };
    }
  },
  ["daily-prompt"], // Cache key
  {
    revalidate: 86400, // Revalidate every 24 hours
    tags: ["daily-prompt"],
  }
);

/**
 * Manually revalidates the daily prompt cache.
 * Useful for testing or admin actions to force a new prompt.
 */
export async function revalidateDailyPrompt() {
  revalidateTag("daily-prompt");
}
