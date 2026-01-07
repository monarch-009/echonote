import Link from "next/link";
import { Suspense } from "react";
import Loading from "./loading";

/**
 * CollectionLayout
 * Layout wrapper for collection pages.
 * Includes a back link to the dashboard and global loading suspense.
 */
export default function CollectionLayout({ children }) {
  return (
    <div className="px-4 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Back to Dashboard
        </Link>
      </div>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  );
}