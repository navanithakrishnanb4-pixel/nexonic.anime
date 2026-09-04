export interface Announcement {
  id: string;
  text: string;
  link: string | null;
  visible: boolean;
  startDate: string | null;
  endDate: string | null;
}

/** No announcements exist yet — always empty. */
export async function getAllAnnouncements(): Promise<Announcement[]> {
  return [];
}
