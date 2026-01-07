"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getAnalytics } from "@/actions/analytics";
import { getMoodById, getMoodTrend } from "@/app/lib/moods";
import { format, parseISO } from "date-fns";
import useFetch from "@/hooks/use-fetch";
import MoodAnalyticsSkeleton from "./analytics-loading";
import { useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const timeOptions = [
  { value: "7d", label: "Last 7 Days" },
  { value: "15d", label: "Last 15 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "180d", label: "Last 180 Days" },
  { value: "365d", label: "Last 365 Days" },
];

/**
 * MoodAnalytics Component
 * Visualizes user's mood data over time using charts and summary cards.
 */
const MoodAnalytics = () => {
  const [period, setPeriod] = useState("7d");

  const {
    loading,
    data: analytics,
    fn: fetchAnalytics,
  } = useFetch(getAnalytics);

  const { isLoaded } = useUser();

  useEffect(() => {
    fetchAnalytics(period);
  }, [period, fetchAnalytics]);

  if (loading || !analytics?.data || !isLoaded) {
    return <MoodAnalyticsSkeleton />;
  }

  // Handle case where fetch failed or returns null
  if (!analytics) return null;

  const { timeline, stats } = analytics.data;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="glass-card border border-amber-200/50 p-4 rounded-xl shadow-xl">
          <p className="font-semibold text-amber-900">
            {format(parseISO(label), "MMM d, yyyy")}
          </p>
          <p className="text-orange-600 font-medium">Average Mood: {payload[0].value}</p>
          <p className="text-amber-700/80">Entries: {payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-serif font-bold text-amber-900">Dashboard</h2>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px] glass-card border-amber-200/50 text-amber-900 font-medium">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-card border-amber-200/50 text-amber-900">
            {timeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {analytics.data.entries.length === 0 ? (
        <div className="glass-card p-8 rounded-xl text-center space-y-4 border border-amber-200/40">
          <div className="text-2xl">📝</div>
          <p className="text-amber-800/80">No entries found for this period.</p>
          <Link href="/journal/write" className="text-orange-600 hover:underline font-semibold">
            Start writing your first entry
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card className="glass-card border border-amber-200/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-amber-700">
                  Total Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif font-bold text-amber-900">{stats.totalEntries}</div>
                <p className="text-xs text-orange-600 font-medium mt-1">
                  ~{stats.dailyAverage} entries per day
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border border-amber-200/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-amber-700">
                  Average Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif font-bold text-amber-900">
                  {stats.averageScore}/10
                </div>
                <p className="text-xs text-orange-600 font-medium mt-1">
                  Overall mood score
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border border-amber-200/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-amber-700">
                  Mood Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center gap-2 text-amber-900">
                  {getMoodById(stats.mostFrequentMood)?.emoji}{" "}
                  <span className="font-serif font-medium text-lg ml-1">
                    {getMoodTrend(stats.averageScore)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mood Timeline Chart */}
          <Card className="glass-card border border-amber-200/40">
            <CardHeader>
              <CardTitle className="font-serif text-xl text-amber-900">Mood Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeline}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(217, 119, 6, 0.15)" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(parseISO(date), "MMM d")}
                      stroke="#92400e"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      domain={[0, 10]}
                      stroke="#92400e"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, "auto"]}
                      stroke="#92400e"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      hide
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="averageScore"
                      stroke="#f59e0b"
                      name="Average Mood"
                      strokeWidth={3}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#ea580c' }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="entryCount"
                      stroke="#78350f"
                      name="Number of Entries"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default MoodAnalytics;