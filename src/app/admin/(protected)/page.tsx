import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { getAllWorks } from "@/lib/works-data";
import { getAllJournalPosts } from "@/lib/journal-data";
import { getAllEpisodes } from "@/lib/episodes-data";
import { getAllMedia } from "@/lib/media-data";
import { getAllAnnouncements } from "@/lib/announcements-data";

const QUICK_ACTIONS = [
  { label: "New Work", href: "/admin/works/new", icon: "add_circle", accent: "text-neon-violet-soft bg-neon-violet/10 border-neon-violet/15" },
  { label: "New Episode", href: "/admin/episodes/new", icon: "add_circle", accent: "text-neon-cyan bg-neon-cyan/10 border-neon-cyan/15" },
  { label: "New Post", href: "/admin/journal/new", icon: "add_circle", accent: "text-neon-pink bg-neon-pink/10 border-neon-pink/15" },
  { label: "Upload Media", href: "/admin/media", icon: "upload", accent: "text-neon-blue bg-neon-blue/10 border-neon-blue/15" },
];

/**
 * Ported to the Figma dashboard layout. The Figma reference's
 * "Recent Activity" feed (fabricated timestamped entries) has no
 * backing table in the real schema. Rather than invent one or fake
 * entries, this keeps the honest "No recent activity" state from the
 * pre-redesign dashboard, just restyled. A real activity log would
 * need a new table and is out of scope for a visual port.
 */
export default async function AdminDashboardPage() {
  const [works, episodes, journalPosts, media, announcements] = await Promise.all([
    getAllWorks(),
    getAllEpisodes(),
    getAllJournalPosts(),
    getAllMedia(),
    getAllAnnouncements(),
  ]);

  const ongoingCount = works.filter((w) => w.status === "ongoing").length;
  const featuredPostCount = journalPosts.filter((p) => p.featured).length;

  return (
    <div>
      <div className="mb-8">
        <p className="font-outfit text-paper-500 text-xs mb-1">
          {new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="font-display text-2xl font-semibold text-paper-50">Studio Dashboard</h1>
        <p className="font-outfit text-paper-500 text-sm mt-1">Nexonic Animation · Control Center</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {QUICK_ACTIONS.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className={`flex items-center gap-2.5 p-4 rounded-2xl border bg-ink-800/40 hover:opacity-80 active:scale-95 transition-all ${a.accent}`}
          >
            <Icon name={a.icon} size={18} />
            <span className="font-outfit text-sm font-semibold">{a.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AdminStatCard
          label="Works"
          count={works.length}
          href="/admin/works"
          sub={`${ongoingCount} ongoing`}
          accentClass="text-neon-violet-soft"
        />
        <AdminStatCard
          label="Episodes"
          count={episodes.length}
          href="/admin/episodes"
          sub="across all series"
          accentClass="text-neon-cyan"
        />
        <AdminStatCard
          label="Journal Posts"
          count={journalPosts.length}
          href="/admin/journal"
          sub={`${featuredPostCount} featured`}
          accentClass="text-neon-pink"
        />
        <AdminStatCard
          label="Media Assets"
          count={media.length}
          href="/admin/media"
          sub="in library"
          accentClass="text-neon-blue"
        />
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-ink-800/40 rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-display font-semibold text-paper-50 text-base">Works</h2>
            <Link href="/admin/works" className="font-outfit text-xs text-paper-500 hover:text-paper-200 transition-colors">
              View all →
            </Link>
          </div>
          {works.length === 0 ? (
            <p className="font-outfit text-paper-500 text-sm px-5 py-8 text-center">
              No works yet. Create the first one to get started.
            </p>
          ) : (
            <div className="divide-y divide-white/5">
              {works.slice(0, 6).map((w) => (
                <Link
                  key={w.id}
                  href={`/admin/works/${w.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors"
                >
                  <span className="font-outfit text-paper-200 text-sm">{w.title}</span>
                  <span className="font-outfit text-paper-500 text-xs uppercase">{w.status.replace(/_/g, " ")}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-ink-800/40 rounded-2xl border border-white/5 p-5">
          <h2 className="font-display font-semibold text-paper-50 text-base mb-1">Recent Activity</h2>
          <p className="font-outfit text-paper-500 text-sm">No recent activity.</p>
          <p className="font-outfit text-paper-500 text-xs mt-3">
            Announcements: {announcements.length}
          </p>
        </div>
      </div>
    </div>
  );
}
