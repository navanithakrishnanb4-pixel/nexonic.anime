import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

/**
 * Layout for everything under /admin. No TopAppBar, no BottomNavBar,
 * no public Footer, no PageTransition — this is deliberately a
 * different, more functional chrome (sidebar on desktop, top bar +
 * drawer on mobile), matching the brief's instruction that admin
 * should be "restrained" rather than sharing the cinematic public
 * shell. Auth is not implemented yet (Step 17 is frontend-only) — this
 * layout does not gate access; that's explicitly a later phase.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-on-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminMobileNav />
        <main className="flex-grow p-margin-mobile md:p-lg max-w-6xl w-full">{children}</main>
      </div>
    </div>
  );
}
