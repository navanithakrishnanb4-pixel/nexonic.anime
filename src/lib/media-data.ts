export interface MediaAsset {
  id: string;
  fileName: string;
  url: string;
  altText: string | null;
  mediaType: string;
}

/** No Supabase Storage integration yet — always empty. */
export async function getAllMedia(): Promise<MediaAsset[]> {
  return [];
}
