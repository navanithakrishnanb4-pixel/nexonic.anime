import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const TITLE = "Nexonic Animation | Hybrid 2D/3D Anime Studio India";
const DESCRIPTION =
  "Nexonic Animation is a next-generation 2D/3D hybrid anime production studio based in Coimbatore, India. Founded by Navanitha Krishnan B, merging AIML engineering with premium animation workflows.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    // Page titles become e.g. "Works | NEXONIC"
    template: "%s | NEXONIC",
  },
  description: DESCRIPTION,
  keywords: [
    "Nexonic Animation",
    "Navanitha Krishnan B",
    "Anime Studio India",
    "Hybrid 2D 3D Animation",
    "Coimbatore Startup",
    "AI Animation",
  ],
  applicationName: SITE_NAME,
  // Favicon, apple-touch icon, Open Graph and Twitter images come from the
  // file conventions in this folder: icon.png, apple-icon.png,
  // opengraph-image.png, twitter-image.png.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

/**
 * Structured data (JSON-LD) so Google can understand who the studio is.
 * Notes on what differs from the first draft: schema.org has no
 * "AnimationStudio" type (Google would ignore it), so this is a plain
 * Organization; url/logo are built from SITE_URL instead of the
 * malformed placeholders; and `sameAs` is omitted until real profile
 * URLs exist (generic linkedin.com / instagram.com homepages would be
 * wrong). Add real ones to `sameAs` when you have them.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: "NEXONIC",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description: DESCRIPTION,
      foundingDate: "2026",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Coimbatore",
        addressCountry: "IN",
      },
      founder: {
        "@type": "Person",
        name: "Navanitha Krishnan B",
        jobTitle: "Founder & CEO",
        alumniOf: {
          "@type": "EducationalOrganization",
          name: "KGiSL Institute of Technology",
        },
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

// "<" is escaped so the JSON can never close the script tag early.
const jsonLdString = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

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
        {/* Figma redesign fonts, additive — used only by pages that have
            been ported so far (see tailwind.config.ts font-display/font-outfit).
            Inter above stays for every not-yet-ported page. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400;1,9..144,600;1,9..144,700&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Plain server-rendered script tag (not next/script): it is in the
            initial HTML, so crawlers read it without running JavaScript. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-outfit text-sm overflow-x-hidden bg-ink-900 text-paper-100">
        {children}
      </body>
    </html>
  );
}
