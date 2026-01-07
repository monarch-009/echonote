"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Plus } from "lucide-react";
import { getMoodById } from "@/app/lib/moods";

const colorSchemes = {
  unorganized: {
    bg: "bg-amber-900/20 hover:bg-amber-900/30",
    tab: "bg-amber-900/30",
  },
  collection: {
    bg: "glass-card hover:bg-black/40",
    tab: "bg-white/10 group-hover:bg-white/20",
  },
  createCollection: {
    bg: "bg-transparent border-2 border-dashed border-white/20 hover:border-primary/50",
    tab: "bg-transparent", // No tab for create
  },
};

const FolderTab = ({ colorClass }) => (
  <div
    className={`absolute inset-x-8 -top-2 h-3 rounded-t-xl transform -skew-x-[15deg] transition-all duration-300 ${colorClass} backdrop-blur-md border-t border-x border-white/10`}
  />
);

const EntryPreview = ({ entry }) => (
  <div className="bg-black/20 p-3 rounded-lg text-sm truncate border border-white/5 transition-colors hover:bg-white/5 font-light">
    <span className="mr-2 opacity-80">{getMoodById(entry.mood)?.emoji}</span>
    <span className="text-foreground/90">{entry.title}</span>
  </div>
);

/**
 * CollectionPreview Component
 * Renders a clickable card representing a collection folder.
 * Supports "Create New", "Unorganized", and regular collections.
 */
const CollectionPreview = ({
  id,
  name,
  entries = [],
  isUnorganized = false,
  isCreateNew = false,
  onCreateNew,
}) => {
  if (isCreateNew) {
    return (
      <button
        onClick={onCreateNew}
        className="group relative h-[240px] cursor-pointer block w-full text-left"
      >
        <div
          className={`relative h-full rounded-2xl p-8 transition-all duration-300 flex flex-col items-center justify-center gap-6 ${colorSchemes["createCollection"].bg} hover:bg-white/[0.02]`}
        >
          <div className="h-16 w-16 rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center border border-white/10 group-hover:border-primary/30">
            <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          </div>
          <p className="text-muted-foreground font-medium group-hover:text-primary transition-colors">Create New Collection</p>
        </div>
      </button>
    );
  }

  return (
    <Link
      href={`/collection/${isUnorganized ? "unorganized" : id}`}
      className="group relative block h-[240px]"
    >
      <FolderTab
        colorClass={
          isUnorganized ? colorSchemes.unorganized.tab : colorSchemes.collection.tab
        }
      />
      <div
        className={`relative h-full rounded-2xl p-6 transition-all duration-300 flex flex-col backdrop-blur-md border border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-1 ${isUnorganized ? colorSchemes.unorganized.bg : colorSchemes.collection.bg
          }`}
      >
        <div className="flex items-center gap-4 mb-6">
          <span className="text-3xl filter drop-shadow-md">{isUnorganized ? "📂" : "📁"}</span>
          <h3 className="text-xl font-serif font-semibold truncate text-foreground tracking-wide">{name}</h3>
        </div>
        <div className="space-y-4 flex-grow flex flex-col">
          <div className="flex justify-between text-xs uppercase tracking-wider text-muted-foreground font-medium">
            <span>{entries.length} entries</span>
            {entries.length > 0 && (
              <span>
                {formatDistanceToNow(new Date(entries[0].createdAt), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>
          <div className="space-y-3 mt-auto">
            {entries.length > 0 ? (
              entries
                .slice(0, 2)
                .map((entry) => <EntryPreview key={entry.id} entry={entry} />)
            ) : (
              <p className="text-sm text-muted-foreground/50 italic pl-1">No entries yet</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CollectionPreview;