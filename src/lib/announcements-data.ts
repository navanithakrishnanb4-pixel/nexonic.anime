import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AnnouncementRow } from "@/lib/supabase/types";

export interface Announcement {
  id: string;
  message: string;
  linkUrl: string | null;
  linkLabel: string | null;
  visible: boolean;
  startsAt: string | null;
  endsAt: string | null;
}

function mapAnnouncementRow(row: AnnouncementRow): Announcement {
  return {
    id: row.id,
    message: row.message,
    linkUrl: row.link_url,
    linkLabel: row.link_label,
    visible: row.visible,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
  };
}

/** Every announcement, any visibility/date range — the admin list. Subject to admin-only RLS. */
export async function getAllAnnouncements(): Promise<Announcement[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("starts_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("[announcements-data] getAllAnnouncements failed:", error.message);
    return [];
  }
  if (!data) return [];

  return (data as AnnouncementRow[]).map(mapAnnouncementRow);
}

/**
 * Public-facing: visible=true AND (no starts_at or it's already passed)
 * AND (no ends_at or it hasn't passed yet). Not wired to a banner
 * component in this pass — see the final report — but this is the one
 * function any future public banner should call, so the visibility/
 * time policy lives in exactly one place.
 */
export async function getActiveAnnouncements(): Promise<Announcement[]> {
  const all = await getAllAnnouncements();
  const now = Date.now();

  return all.filter((a) => {
    if (!a.visible) return false;
    if (a.startsAt && new Date(a.startsAt).getTime() > now) return false;
    if (a.endsAt && new Date(a.endsAt).getTime() < now) return false;
    return true;
  });
}
