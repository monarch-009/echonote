import React from "react";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { format } from "date-fns";

/**
 * EntryCard Component
 * Displays a summary of a journal entry including title, mood, content preview, and date.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.entry - The journal entry object.
 */
const EntryCard = ({ entry }) => {
  return (
    <Link href={`/journal/${entry.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{entry.moodData?.emoji || "😐"}</span>
                <h3 className="font-semibold text-lg">{entry.title}</h3>
              </div>

              {/* Content preview with HTML rendering */}
              <div
                className="text-muted-foreground line-clamp-2"
                dangerouslySetInnerHTML={{ __html: entry.content }}
              />
            </div>

            {/* Formatted date */}
            <time className="text-sm text-muted-foreground">
              {format(new Date(entry.createdAt), "MMM d, yyyy")}
            </time>
          </div>

          {/* Collection tag if applicable */}
          {entry.collection && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded">
                {entry.collection.name}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default EntryCard;