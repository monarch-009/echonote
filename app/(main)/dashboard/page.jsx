import { getCollections } from "@/actions/collection";
import { getJournalEntries } from "@/actions/journal";
import MoodAnalytics from "./_components/mood-analytics";
import Collections from "./_components/collections";

/**
 * Dashboard Page
 * The main user dashboard view.
 * Fetches collections and journal entries server-side to populate the view.
 */
const Dashboard = async () => {
  const collections = await getCollections();
  const entriesData = await getJournalEntries();

  // Organize entries by collection ID for quick access
  const entriesByCollection =
    entriesData?.data?.entries?.reduce((acc, entry) => {
      const collectionId = entry.collectionId || "unorganized";
      if (!acc[collectionId]) {
        acc[collectionId] = [];
      }
      acc[collectionId].push(entry);
      return acc;
    }, {}) || {};

  return (
    <div className="px-4 py-8 space-y-8">
      {/* Analytics Section */}
      <section className="space-y-4">
        <MoodAnalytics />
      </section>

      {/* Collections Grid */}
      <Collections
        collections={collections}
        entriesByCollection={entriesByCollection}
      />
    </div>
  );
};

export default Dashboard;