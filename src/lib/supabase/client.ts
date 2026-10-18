import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use inside Client Components. Not used anywhere
 * yet in this step (all current data reads happen server-side), but
 * the architecture needs this half to exist for future authenticated
 * client-side interactions (e.g. an admin login form). Always uses the
 * publishable/anon key — never the service-role key, which must never
 * reach the browser.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
