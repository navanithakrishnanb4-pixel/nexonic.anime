import type { Metadata } from "next";
import "./globals.css";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/motion/PageTransition";

export const metadata: Metadata = {
  title: {
    default: "NEXONIC Animation Studio",
    template: "%s | NEXONIC",
  },
  description:
    "NEXONIC is an independent animation studio building original stories and technology.",
};

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
      <body className="min-h-screen flex flex-col font-body-md text-body-md overflow-x-hidden pt-16 pb-16 md:pb-0">
        <a href="#main-content" className="sr-only sr-only-focusable">
          Skip to content
        </a>
        <TopAppBar />
        <main id="main-content" className="flex-grow flex flex-col">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <BottomNavBar />
      </body>
    </html>
  );
}
