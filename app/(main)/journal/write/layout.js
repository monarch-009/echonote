import Link from "next/link";
import { Suspense } from "react";
import { BarLoader } from "react-spinners";

/**
 * WriteLayout
 * Layout wrapper for the journal writing page.
 * Includes explicit back button.
 */
export default function WriteLayout({ children }) {
  return (
    <div className="px-4 py-8">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-primary cursor-pointer"
        >
          ← Back to Dashboard
        </Link>
      </div>
      <Suspense fallback={<BarLoader color="#D9C5B2" width={"100%"} />}>
        {children}
      </Suspense>
    </div>
  );
}