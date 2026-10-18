import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

/**
 * Every route under this (protected) group — the dashboard, Works,
 * Episodes, Journal, Media, Homepage, Announcements, Settings — passes
 * through this layout, which is where the real gate lives.
 *
 * TWO CHECKS, ON PURPOSE, IN THIS ORDER:
 *
 * 1. `supabase.auth.getUser()` — is anyone logged in at all? This is
 *    the same check middleware already did to redirect unauthenticated
 *    requests to /admin/login before they even got here. Repeating it
 *    here is not redundant: middleware protects the page transition,
 *    but this layout is what actually renders on the server for this
 *    request, and it must not trust that middleware definitely ran
 *    correctly for every possible way this route could be reached.
 *
 * 2. A direct read of `public.profiles` for this user's `role`. Being
 *    authenticated is not being authorized — a real Supabase Auth user
 *    who is NOT the studio's admin (e.g. a future customer-facing
 *    account, if one is ever added) must still be refused here. This
 *    is the one place that decides "is this specific person an admin,"
 *    matching the Phase 18 RLS strategy's single-admin-role model.
 *
 * Neither check is a `hidden` UI element — both run server-side before
 * any admin markup is returned, so there is nothing for a browser to
 * bypass by disabling JavaScript or editing DOM state.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  // Fail closed: a lookup error or a missing/non-admin profile is
  // treated identically to "not authorized." No database detail (the
  // error message, the query, the table name) is ever shown — the
  // person just lands back at the login screen.
  if (error || !profile || profile.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-ink-950 text-paper-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminMobileNav />
        <main className="flex-grow p-margin-mobile md:p-lg max-w-6xl w-full">{children}</main>
      </div>
    </div>
  );
}
