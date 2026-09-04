export interface AdminNavItem {
  label: string;
  href: string;
  icon: string;
}

export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Works", href: "/admin/works", icon: "movie" },
  { label: "Episodes", href: "/admin/episodes", icon: "video_library" },
  { label: "Journal", href: "/admin/journal", icon: "article" },
  { label: "Media", href: "/admin/media", icon: "perm_media" },
  { label: "Homepage", href: "/admin/homepage", icon: "home" },
  { label: "Announcements", href: "/admin/announcements", icon: "campaign" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];
