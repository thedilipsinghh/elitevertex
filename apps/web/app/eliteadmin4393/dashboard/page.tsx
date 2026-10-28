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

  const cmsPages = [
    {
      title: "Home Page CMS",
      description: "Hero banner, 4 pedagogical pillars, about preview, courses showcase, speech assessment & admissions CTA.",
      path: "/eliteadmin4393/home",
      icon: "home",
      color: "from-blue-600 to-indigo-700",
      badge: "Homepage",
      liveUrl: "/",
    },
    {
      title: "Courses & Syllabus",
      description: "Full institutional programs, beginner to executive tracks, cohort caps, pricing, and interactive syllabus modules.",
      path: "/eliteadmin4393/courses",
      icon: "school",
      color: "from-amber-600 to-orange-700",
      badge: `${stats?.courses?.total ?? 5} Courses`,
      liveUrl: "/courses",
    },
    {
      title: "About Page CMS",
      description: "Institutional paradigm story, acoustic airtime stats, 6 Why Choose Us cards, training labs, and vision/mission.",
      path: "/eliteadmin4393/about",
      icon: "info",
      color: "from-emerald-600 to-teal-700",
      badge: "Institute",
      liveUrl: "/about",
    },
    {
      title: "Certificates Registry",
      description: "Issue accredited completion credentials, generate verifiable serial numbers, manage signatures and seals.",
      path: "/eliteadmin4393/certificates",
      icon: "workspace_premium",
      color: "from-purple-600 to-pink-700",
      badge: "Verification",
      liveUrl: "/verify-certificate",
    },
    {
      title: "Contact & Helplines",
      description: "Direct admissions telephone, official WhatsApp helpline, campus addresses, working hours, and Google Maps embed.",
      path: "/eliteadmin4393/contact",
      icon: "contact_support",
      color: "from-cyan-600 to-blue-700",
      badge: "Helplines",
      liveUrl: "/contact",
    },
  ];

  const statCards = stats
    ? [
        { label: "Active Courses", value: stats.courses.active, sub: `${stats.courses.total} total programs`, href: "/eliteadmin4393/courses", icon: "school" },
        { label: "Student Inquiries", value: stats.messages.total, sub: `${stats.messages.unread} unread leads`, href: "/eliteadmin4393/messages", icon: "contact_mail" },
        { label: "Faculty & Mentors", value: stats.collections.mentors, sub: "Certified speech coaches", href: "/eliteadmin4393/mentors", icon: "person" },
        { label: "Published Pages", value: stats.pages.published, sub: `${stats.pages.total} total pages`, href: "/eliteadmin4393/pages", icon: "description" },
      ]
    : [];

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12 font-sans">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>CMS Admin Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Elite Vertex Management
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Complete administrative control over all public pages, dynamic curriculum, certificates, and student inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
          >
            <span>Live Website</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>

          <Link
            href="/eliteadmin4393/certificates"
            className="inline-flex items-center gap-2 bg-primary hover:opacity-90 text-on-primary px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-opacity shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Issue Certificate</span>
          </Link>
        </div>
      </div>

      {/* Key Metric Highlights */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-surface-container rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-outline-variant hover:border-primary/50 transition-all hover:-translate-y-0.5 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  {c.label}
                </span>
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors">
                  {c.icon}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-3xl font-extrabold text-on-surface tracking-tight">{c.value}</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5 font-medium">{c.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Section 1: Public Pages CMS Hub */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[24px]">web</span>
              <span>Public Website Pages CMS Control</span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Click any section below to update live content, hero messaging, curriculum, certificates, or contact details.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cmsPages.map((page) => (
            <div
              key={page.title}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-5 group hover:border-secondary/60"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">{page.icon}</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/60">
                    {page.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-on-surface group-hover:text-secondary transition-colors">
                  {page.title}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-1.5">
                  {page.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-outline-variant/60 flex items-center justify-between gap-2">
                <a
                  href={page.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-on-surface-variant hover:text-primary flex items-center gap-1 font-semibold"
                  title="Open live page in new tab"
                >
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  <span>View Live</span>
                </a>

                <Link
                  href={page.path}
                  className="inline-flex items-center gap-1.5 bg-primary hover:opacity-90 text-on-primary px-3.5 py-1.5 rounded-lg text-xs font-bold transition-opacity"
                >
                  <span>Edit CMS</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Supporting Content & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Additional Collections */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-on-surface mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">collections_bookmark</span>
              <span>Content Libraries</span>
            </h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Supporting elements distributed across website components.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Mentors", href: "/eliteadmin4393/mentors", count: stats?.collections?.mentors ?? 2, icon: "person" },
                { label: "Reviews", href: "/eliteadmin4393/testimonials", count: stats?.collections?.testimonials ?? 4, icon: "reviews" },
                { label: "FAQs", href: "/eliteadmin4393/faq", count: stats?.collections?.faqs ?? 2, icon: "help" },
                { label: "Campuses", href: "/eliteadmin4393/campuses", count: stats?.collections?.campuses ?? 2, icon: "location_city" },
                { label: "Gallery", href: "/eliteadmin4393/gallery", count: stats?.collections?.gallery ?? 6, icon: "collections" },
                { label: "Navigation", href: "/eliteadmin4393/navigation", count: "Header/Footer", icon: "menu" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 transition-colors flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span className="text-xs font-bold text-primary">{item.count}</span>
                  </div>
                  <span className="text-xs font-semibold text-on-surface mt-1">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant/60 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">Global Site Settings</span>
            <Link
              href="/eliteadmin4393/settings"
              className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
            >
              <span>Manage Settings</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Recent Audit Log */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">history</span>
                <span>Recent System Activity</span>
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Real-time log of CMS changes and admin actions.</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
              Live Log
            </span>
          </div>

          {!stats || !stats.recentActivity || stats.recentActivity.length === 0 ? (
            <div className="py-8 text-center text-on-surface-variant text-xs">
              No recent activity recorded yet.
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-outline-variant/50 max-h-[260px] overflow-y-auto scrollbar-thin">
              {(stats.recentActivity as AuditEntry[]).slice(0, 5).map((a) => (
                <li key={a.id} className="py-2.5 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-on-surface capitalize">
                      {a.action.replace(/_/g, " ")}{" "}
                      <span className="font-normal text-on-surface-variant">({a.entityType})</span>
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-mono">
                      {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant truncate">
                    by {a.actorEmail || "Administrator"} · {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
