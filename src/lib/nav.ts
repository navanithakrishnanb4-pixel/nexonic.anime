// Single source of truth for nav/footer links. Resolves the inconsistency
// found in the ZIP where the Studio screen had a different link set than
// every other page (Archive/Careers/Contact/Journal/Originals vs the
// Careers/Press Kit/Privacy/Terms set used elsewhere). This is the
// canonical set — change it here only.

export interface NavItem {
  label: string;
  href: string;
  icon: string; // Material Symbols name
}

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Works", href: "/works", icon: "grid_view" },
  { label: "Journal", href: "/journal", icon: "article" },
  { label: "Studio", href: "/studio", icon: "info" },
];

export const footerLegalLinks: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy", icon: "" },
  { label: "Terms of Service", href: "/terms", icon: "" },
];

export const footerCompanyLinks: NavItem[] = [
  { label: "Careers", href: "/careers", icon: "" },
  { label: "Press Kit", href: "/press-kit", icon: "" },
];
