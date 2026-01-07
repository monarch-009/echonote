"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/prisma";

/**
 * Retrieves analytics data for a user based on a specified time period.
 * 
 * @param {string} period - The time period for analytics (e.g., "7d", "15d", "30d", "60d", "180d", "365d"). Defaults to "30d".
 * @returns {Promise<Object>} - The analytics data including timeline, stats, and raw entries.
 * @throws {Error} - Throws an error if the user is unauthorized or not found.
 */

export async function getAnalytics(period = "30d") {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const startDate = getStartDateForPeriod(period);

    // Get entries for the period
    const entries = await db.entry.findMany({
        where: {
            userId: user.id,
            createdAt: {
                gte: startDate,
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    // Process entries for analytics
    const { moodData, overallStats } = processAnalyticsData(entries, period);

    return {
        success: true,
        data: {
            timeline: moodData,
            stats: overallStats,
            entries,
        },
    };
}

/**
 * Helper function to calculate the start date based on the period string.
 * Parses the number of days from the period string (e.g., "7d" -> 7).
 * 
 * @param {string} period - The period string (e.g., "7d", "30d").
 * @returns {Date} - The calculated start date.
 */
function getStartDateForPeriod(period) {
    const startDate = new Date();
    const days = parseInt(period.replace("d", ""), 10) || 30; // Default to 30 if parsing fails
    startDate.setDate(startDate.getDate() - days);
    return startDate;
}

/**
 * Helper function to process entries and calculate analytics/stats.
 * Agregates mood data by date and calculates overall statistics.
 * 
 * @param {Array} entries - The list of journal entries.
 * @param {string} period - The period string.
 * @returns {Object} - An object containing processed moodData and overallStats.
 */
function processAnalyticsData(entries, period) {
    // Aggregate data by date
    const moodDataMap = entries.reduce((acc, entry) => {
        const date = entry.createdAt.toISOString().split("T")[0];
        if (!acc[date]) {
            acc[date] = {
                totalScore: 0,
                count: 0,
                entries: [],
            };
        }
        acc[date].totalScore += entry.moodScore;
        acc[date].count += 1;
        acc[date].entries.push(entry);
        return acc;
    }, {});

    // Format data for charts
    const moodData = Object.entries(moodDataMap).map(([date, data]) => ({
        date,
        averageScore: Number((data.totalScore / data.count).toFixed(1)),
        entryCount: data.count,
    }));

    // Calculate overall statistics
    const totalEntries = entries.length;
    const days = parseInt(period.replace("d", ""), 10) || 30;

    const averageScore = totalEntries > 0
        ? Number((entries.reduce((acc, entry) => acc + entry.moodScore, 0) / totalEntries).toFixed(1))
        : 0;

    const moodCounts = entries.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
    }, {});

    const mostFrequentMood = Object.entries(moodCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0];

    const dailyAverage = Number((totalEntries / days).toFixed(1));

    const overallStats = {
        totalEntries,
        averageScore,
        mostFrequentMood,
        dailyAverage,
    };

    return { moodData, overallStats };
}