import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using the NEXONIC website.",
};

/**
 * Deliberately jurisdiction-neutral: no governing-law or venue clause,
 * and no legal-entity name, because neither is known here. Add those
 * (ideally after a lawyer reads this page) before relying on it.
 */
const SECTIONS: LegalSection[] = [
  {
    heading: "Using this site",
    paragraphs: [
      "By using the NEXONIC website you agree to these terms. If you do not agree, please do not use the site.",
    ],
  },
  {
    heading: "Our content",
    paragraphs: [
      "The works, stories, characters, artwork, episodes, journal articles, text, logos and other material on this site belong to NEXONIC or its licensors and are protected by copyright and other laws.",
      "You are welcome to view the site, and to share links to it. You may not copy, reproduce, redistribute, sell or create derivative works from the content without our written permission.",
    ],
  },
  {
    heading: "Acceptable use",
    paragraphs: ["When using the site you agree not to:"],
    items: [
      "attempt to gain unauthorized access to the private admin area, the database or any connected service;",
      "interfere with or disrupt the site, for example through excessive automated requests or malicious code;",
      "scrape or harvest content at scale, or use the site in any way that breaks the law.",
    ],
  },
  {
    heading: "Third-party links and videos",
    paragraphs: [
      "Some pages link to or play material hosted on other services, such as trailers or episodes on video platforms. Those services are not controlled by us and have their own terms and privacy policies.",
    ],
  },
  {
    heading: "Content in development",
    paragraphs: [
      "NEXONIC is an independent studio and its projects are works in progress. Information about works, release plans and availability may change, be corrected, or be removed at any time without notice.",
    ],
  },
  {
    heading: "No warranty and limits on liability",
    paragraphs: [
      "The site and its content are provided \"as is\" and \"as available\", without warranties of any kind, and we do not guarantee that the site will always be available or error-free.",
      "To the extent permitted by law, NEXONIC is not liable for any loss or damage arising from your use of, or inability to use, the site.",
    ],
  },
  {
    heading: "Changes to these terms",
    paragraphs: [
      "We may update these terms from time to time. The date at the top of this page shows when they were last changed, and continued use of the site after a change means you accept the updated terms.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      "Questions about these terms can be sent to the studio using the contact details that will be published on the Studio page.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="These terms set out the basic rules for using the NEXONIC website."
      updated="11 October 2026"
      sections={SECTIONS}
    />
  );
}
