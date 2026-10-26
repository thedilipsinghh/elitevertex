"use client";
import Link from "next/link";
import { useGetDashboardStatsQuery } from "@/lib/features/api/apiSlice";

interface AuditEntry {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  actorEmail?: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: response, isLoading } = useGetDashboardStatsQuery(undefined);
  const stats = response?.data;

  const cards = stats
    ? [
        { label: "Pages", value: stats.pages.total, sub: `${stats.pages.published} published · ${stats.pages.draft} draft`, href: "/eliteadmin4393/pages" },
        { label: "Courses", value: stats.courses.total, sub: `${stats.courses.active} active`, href: "/eliteadmin4393/courses" },
        { label: "Media Files", value: stats.media.total, sub: "In library", href: "/eliteadmin4393/media" },
        { label: "Leads", value: stats.messages.total, sub: `${stats.messages.unread} unread`, href: "/eliteadmin4393/messages" },
      ]
    : [];

  const collections = stats
    ? [
        { label: "Testimonials", value: stats.collections.testimonials },
        { label: "FAQs", value: stats.collections.faqs },
        { label: "Mentors", value: stats.collections.mentors },
        { label: "Campuses", value: stats.collections.campuses },
        { label: "Gallery", value: stats.collections.gallery },
      ]
    : [];

  return (
    <div className="flex flex-col gap-space-lg w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-headline-lg text-on-surface">Overview</h1>
        <Link
          href="/eliteadmin4393/pages"
          className="bg-primary text-on-primary px-space-md py-space-xs rounded-lg font-label-md"
        >
          + New Page
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md animate-pulse">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-surface-container rounded-xl"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
            {cards.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant hover:border-primary transition-colors"
              >
                <h3 className="font-label-md text-on-surface-variant uppercase tracking-wider mb-2">{c.label}</h3>
                <p className="font-display text-display text-on-surface">{c.value}</p>
                <p className="text-label-sm text-on-surface-variant mt-1">{c.sub}</p>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
              <h3 className="font-headline-sm text-primary mb-space-sm">Collections</h3>
              <div className="flex flex-col divide-y divide-outline-variant/60">
                {collections.map((c) => (
                  <div key={c.label} className="flex items-center justify-between py-2">
                    <span className="text-body-md text-on-surface">{c.label}</span>
                    <span className="font-display text-headline-sm text-on-surface">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
              <h3 className="font-headline-sm text-primary mb-space-sm">Recent Activity</h3>
              {!stats || stats.recentActivity.length === 0 ? (
                <p className="text-on-surface-variant text-body-sm">No activity recorded yet.</p>
              ) : (
                <ul className="flex flex-col divide-y divide-outline-variant/60">
                  {(stats.recentActivity as AuditEntry[]).map((a) => (
                    <li key={a.id} className="py-2 flex flex-col">
                      <span className="text-body-sm text-on-surface">
                        <span className="font-semibold capitalize">{a.action.replace(/_/g, " ")}</span>{" "}
                        <span className="text-on-surface-variant">on {a.entityType}</span>
                      </span>
                      <span className="text-label-sm text-on-surface-variant">
                        {a.actorEmail || "system"} · {new Date(a.createdAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
