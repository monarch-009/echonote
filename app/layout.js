import Header from "@/components/header";
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";
import { aj } from "@/lib/arcjet-shield";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "Echo Note",
  description: "Journal your thoughts with Echo Note",
};

/**
 * RootLayout
 * The top-level layout that wraps all pages.
 * Includes global providers (Clerk), fonts (Inter, Playfair), header, background, and footer.
 */
export default async function RootLayout({ children }) {
  let decision;
  try {
    decision = await aj.protect();
  } catch (error) {
    // Arcjet protection attempts to read request headers, which aren't available during
    // Next.js static build generation. This is expected behavior for static pages.
    // We strictly ignore this specific error to avoid noisy build logs.
    if (error?.message?.includes('headers')) {
      decision = { isDenied: () => false };
    } else {
      console.error("Arcjet protection failed:", error);
      decision = { isDenied: () => false };
    }
  }

  if (decision.isDenied()) {
    return (
      <html lang="en">
        <body>
          <h1>Access Denied</h1>
          <p>We verified you are a bot/automated script.</p>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} ${playfair.variable} font-sans text-foreground antialiased selection:bg-primary/30`}
        >
          {/* Background Image Layer */}
          <div className="fixed inset-0 z-[-1] overflow-hidden">
            <Image
              src="/bg.jpg"
              alt="background"
              fill
              className="object-cover opacity-40"
              priority
            />
            {/* Light Cream Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-50/90 via-orange-50/85 to-amber-50/90" />

            {/* Warm Ambient Light Blends */}
            <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-orange-300/20 blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-amber-200/25 blur-[150px] pointer-events-none" />
            <div className="absolute top-[40%] right-[-5%] h-[400px] w-[400px] rounded-full bg-red-200/15 blur-[120px] pointer-events-none" />
          </div>

          {/* Content Layer */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />

            {/* Main Content Area */}
            <main className="flex-grow">{children}</main>

            <Toaster richColors />

            <footer className="bg-gradient-to-r from-amber-900/95 via-orange-900/95 to-amber-900/95 backdrop-blur-md py-12 mt-12 border-t border-amber-700/30 shadow-lg">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-base text-amber-100/90 font-semibold tracking-wide">
                  © 2025 EchoNote. Designed for Reflection.
                </p>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
