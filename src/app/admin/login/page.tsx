import { LogoMark } from "@/components/brand/Logo";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/admin/auth/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

/**
 * Deliberately outside app/admin/(protected)/ — this route must be
 * reachable by definition when nobody is logged in, so it cannot live
 * behind the same layout that gates everything else. It also renders
 * no AdminSidebar/AdminMobileNav (there's no authenticated session to
 * show admin navigation for yet); just a centered card in the same
 * dark/restrained visual language as the rest of /admin.
 *
 * If someone who is already an authenticated admin lands here, send
 * them straight to the dashboard instead of showing the form again.
 */
export default async function AdminLoginPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role === "admin") {
      redirect("/admin");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-ink-950 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-neon-violet/10 spin-slow pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6">
        <div className="flex items-center gap-2.5">
          <LogoMark size={40} />
          <span className="font-display font-semibold text-paper-50 tracking-wide uppercase">
            Nexonic <span className="text-paper-500 font-normal normal-case">Admin</span>
          </span>
        </div>
        <div className="w-full flex flex-col gap-4 p-7 rounded-2xl border border-white/10 bg-ink-800/50 backdrop-blur-sm">
          <h1 className="font-display font-semibold text-paper-50 text-xl">Sign in</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
