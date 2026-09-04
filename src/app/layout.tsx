import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NEXONIC Animation Studio",
    template: "%s | NEXONIC",
  },
  description:
    "NEXONIC is an independent animation studio building original stories and technology.",
};

/**
 * Root layout, deliberately minimal as of Step 17.
 *
 * Previously this rendered TopAppBar/BottomNavBar/Footer/PageTransition
 * directly, which was correct while the only routes were public pages.
 * Step 17 adds /admin, which must NEVER show the public site's nav —
 * per the architecture rule that "the public website must never expose
 * Admin navigation" (and the inverse: admin shouldn't show a consumer
 * bottom-tab-bar or public footer either). So the public chrome moved
 * to `app/(site)/layout.tsx`, and `/admin` gets its own chrome in
 * `app/admin/layout.tsx`. This file now only owns what's truly global:
 * html/body shell, fonts, and metadata defaults.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-body-md text-body-md overflow-x-hidden bg-background text-on-background">
        {children}
      </body>
    </html>
  );
}
