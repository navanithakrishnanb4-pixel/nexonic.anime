import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How the NEXONIC website handles visitor information.",
};

/**
 * Written from what the site actually does (verified in the codebase):
 * no analytics or tracking scripts, no visitor accounts, no forms that
 * collect visitor data, all database writes are admin-only. If any of
 * that changes (analytics, a newsletter, comments, accounts), this
 * page must be updated at the same time.
 */
const SECTIONS: LegalSection[] = [
  {
    heading: "What this site collects",
    paragraphs: [
      "NEXONIC is a small independent animation studio, and this website is designed to collect as little about you as possible. There are no visitor accounts, no sign-up or contact forms, no newsletter, and no comments.",
      "When you visit, our hosting provider automatically receives standard technical information needed to serve the pages, such as your IP address, browser type, device type and the pages you request. This is ordinary server logging used to run and secure the site.",
      "If you use the search page, your search text is sent to the server to find matching works and journal posts. We do not store your searches or build profiles from them.",
    ],
  },
  {
    heading: "Cookies",
    paragraphs: [
      "The public website does not use advertising, analytics or tracking cookies.",
      "The only cookie used is an authentication session cookie, which is set only when a studio administrator signs in to the private admin area. Ordinary visitors never receive it.",
    ],
  },
  {
    heading: "Services that process data for us",
    items: [
      "Hosting: the site is served by a hosting provider, which processes the technical information described above.",
      "Database, storage and sign-in: content such as works, episodes and journal posts, and the uploaded images used on this site, are stored with Supabase. Administrator sign-in is also handled there.",
      "Fonts: this site loads its typefaces from Google Fonts. When a page loads, your browser requests the font files from Google, which receives your IP address as part of that request.",
      "Videos: where a work links to or plays a trailer or episode hosted elsewhere (for example on YouTube), that service's own privacy policy applies once you play or follow the link.",
    ],
  },
  {
    heading: "What we do not do",
    items: [
      "We do not sell your information.",
      "We do not run advertising or behavioral tracking on this site.",
      "We do not knowingly collect personal information from children.",
    ],
  },
  {
    heading: "Your choices",
    paragraphs: [
      "Because we hold no accounts or profiles for visitors, there is generally no personal information of yours for us to access, correct or delete beyond routine server logs kept by our hosting provider. If you have a question or request about your information, contact the studio using the details that will be published on the Studio page.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "If the way this site handles information changes, for example if analytics, accounts or a newsletter are added, this page will be updated and the date above changed.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This policy explains, in plain language, what the NEXONIC website does and does not do with information about its visitors."
      updated="11 October 2026"
      sections={SECTIONS}
    />
  );
}
