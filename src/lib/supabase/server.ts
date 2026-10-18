import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Server-side Supabase client. Used by every data seam in lib/*-data.ts
 * that reads from the database — this is the ONLY client those files
 * should import. It authenticates with the publishable/anon key, same
 * as the browser client; there is no service-role usage anywhere in
 * this codebase, and there must not be one added casually later.
 *
 * Reads/writes the Supabase auth cookie via next/headers so that when
 * admin login is implemented (a later phase), authenticated server
 * reads work by calling this same function — nothing about the data
 * seams needs to change, only the RLS policies' behavior for a logged
 * -in session.
 *
 * Must only be called from a Server Component, Route Handler, or
 * Server Action (next/headers' cookies() throws outside that context).
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Called from a Server Component render, where cookies
            // can't be mutated. Safe to ignore here — session refresh
            // will be handled by middleware once auth is implemented.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Same as above.
          }
        },
      },
    }
  );
}
