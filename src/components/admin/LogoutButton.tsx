"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/ui/Icon";

interface LogoutButtonProps {
  className?: string;
}

/**
 * Calls Supabase Auth's real signOut() — this clears the actual
 * session (both the client-side auth state and, via the SSR cookie
 * helpers, the cookie middleware reads), not a fake "logged out" UI
 * flag. router.refresh() forces the next server render to re-run the
 * (protected) layout's auth check, which is what actually sends the
 * user to /admin/login — the router.push is a fast path so the UI
 * doesn't wait on that round trip.
 */
export function LogoutButton({ className = "" }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center gap-sm px-sm py-xs rounded-lg font-outfit text-sm text-paper-500 hover:text-paper-100 hover:bg-ink-800 transition-colors duration-200 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-violet ${className}`}
    >
      <Icon name="logout" size={20} />
      {loading ? "Signing out…" : "Log out"}
    </button>
  );
}
