import { getJournalEntries } from "@/actions/journal";
import { getCollection } from "@/actions/collection";
import { JournalFilters } from "./_components/journal-filters";
import DeleteCollectionDialog from "./_components/delete-collection";

/**
 * CollectionPage
 * Displays journal entries belonging to a specific collection (or "unorganized").
 * 
 * @param {Object} props - Page props.
 * @param {Object} props.params - Route parameters containing collectionId.
 */
export default async function CollectionPage({ params }) {
  const { collectionId } = await params;
  const entries = await getJournalEntries({ collectionId });

  // Handle "unorganized" pseudo-collection or fetch real collection details
  const collection =
    collectionId === "unorganized"
      ? {
        name: "Unorganized or Empty Entries",
        id: "unorganized",
      }
      : await getCollection(collectionId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold gradient-title">
            {collectionId === "unorganized"
              ? "Unorganized Entries"
              : collection?.name || "Collection"}
          </h1>

          {/* Allow deletion only if it's a real collection */}
          {collection && (
            <DeleteCollectionDialog
              collection={collection}
              entriesCount={entries.data.entries.length}
            />
          )}
        </div>
        {collection?.description && (
          <h2 className="font-extralight pl-1">{collection?.description}</h2>
        )}
      </div>

      {/* Client-side Filters Component */}
      <JournalFilters entries={entries.data.entries} />
    </div>
  );
}