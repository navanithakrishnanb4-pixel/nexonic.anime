"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface AnnouncementFormState {
  error: string | null;
}

function parseAnnouncementFormData(formData: FormData) {
  return {
    message: String(formData.get("message") ?? "").trim(),
    link_url: (formData.get("linkUrl") as string) || null,
    link_label: (formData.get("linkLabel") as string) || null,
    visible: formData.get("visible") === "on",
    starts_at: (formData.get("startsAt") as string) || null,
    ends_at: (formData.get("endsAt") as string) || null,
  };
}

function validate(values: ReturnType<typeof parseAnnouncementFormData>): string | null {
  if (!values.message) return "Message is required.";
  if (values.starts_at && values.ends_at && values.starts_at > values.ends_at) {
    return "Start date must be before end date.";
  }
  return null;
}

export async function createAnnouncementAction(
  _prevState: AnnouncementFormState,
  formData: FormData
): Promise<AnnouncementFormState> {
  const values = parseAnnouncementFormData(formData);
  const validationError = validate(values);
  if (validationError) return { error: validationError };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("announcements").insert(values);

  if (error) {
    console.error("[announcements-actions] createAnnouncementAction failed:", error.message);
    return { error: "Something went wrong saving this announcement. Please try again." };
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/");
  return { error: null };
}

export async function updateAnnouncementAction(
  id: string,
  _prevState: AnnouncementFormState,
  formData: FormData
): Promise<AnnouncementFormState> {
  const values = parseAnnouncementFormData(formData);
  const validationError = validate(values);
  if (validationError) return { error: validationError };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("announcements").update(values).eq("id", id);

  if (error) {
    console.error("[announcements-actions] updateAnnouncementAction failed:", error.message);
    return { error: "Something went wrong saving this announcement. Please try again." };
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/");
  return { error: null };
}

export async function deleteAnnouncementAction(id: string): Promise<{ error: string | null }> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);

  if (error) {
    console.error("[announcements-actions] deleteAnnouncementAction failed:", error.message);
    return { error: "Something went wrong deleting this announcement. Please try again." };
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/");
  return { error: null };
}
