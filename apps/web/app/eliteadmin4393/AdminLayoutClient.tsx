// "use client"
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Metadata } from "next";
import { useLogoutMutation, useGetMeQuery } from "@/lib/features/api/apiSlice";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: me } = useGetMeQuery(undefined, { skip: pathname === "/eliteadmin4393/login" });
  const [logout] = useLogoutMutation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname === "/eliteadmin4393/login") {
    return <>{children}</>;
  }

  const currentUser = me?.data as { name?: string; email?: string; role?: string } | undefined;

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
    } catch {
      // ignore network errors; still clear local state
    }
    router.push("/eliteadmin4393/login");
  };

  const menuGroups = [
    {
      group: "Overview",
      items: [
        { name: "Dashboard", path: "/eliteadmin4393/dashboard", icon: "dashboard" },
      ],
    },
    {
      group: "Website Pages (CMS)",
      items: [
        { name: "Home Page", path: "/eliteadmin4393/home", icon: "home", badge: "Live" },
        { name: "Courses & Syllabus", path: "/eliteadmin4393/courses", icon: "school" },
        { name: "About Page", path: "/eliteadmin4393/about", icon: "info" },
        { name: "Certificates Registry", path: "/eliteadmin4393/certificates", icon: "workspace_premium" },
        { name: "Contact & Helplines", path: "/eliteadmin4393/contact", icon: "contact_support" },
      ],
    },
    {
      group: "Content & Assets",
      items: [
        { name: "Mentors & Faculty", path: "/eliteadmin4393/mentors", icon: "person" },
        { name: "Testimonials / Reviews", path: "/eliteadmin4393/testimonials", icon: "reviews" },
        { name: "FAQ Library", path: "/eliteadmin4393/faq", icon: "help" },
        { name: "Photo Gallery", path: "/eliteadmin4393/gallery", icon: "collections" },
        { name: "Campus Locations", path: "/eliteadmin4393/campuses", icon: "location_city" },
        { name: "Custom Pages", path: "/eliteadmin4393/pages", icon: "description" },
        { name: "Navigation Menus", path: "/eliteadmin4393/navigation", icon: "menu" },
        { name: "Media Storage", path: "/eliteadmin4393/media", icon: "perm_media" },
      ],
    },
    {
      group: "Inquiries & Operations",
      items: [
        { name: "Student Leads", path: "/eliteadmin4393/messages", icon: "contact_mail" },
        { name: "Global Settings", path: "/eliteadmin4393/settings", icon: "settings" },
        { name: "Admin Users", path: "/eliteadmin4393/users", icon: "group" },
      ],
    },
  ];

  const renderNavLinks = () => (
    <div className="flex flex-col gap-5 py-3">
      {menuGroups.map((group) => (
        <div key={group.group} className="flex flex-col gap-1">
          <span className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/70">{group.group}</span>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-on-primary shadow-xs font-bold"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] shrink-0">{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-surface-container-low border-r border-outline-variant flex flex-col hidden lg:flex shrink-0">
        {/* Brand Header */}
        <div className="p-4 border-b border-outline-variant flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-xs">EV</div>
              <span className="font-extrabold text-base tracking-tight text-on-surface">Elite Admin</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">CMS v2</span>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors"
          >
            <span>View Public Website</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        </div>
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin">
          {renderNavLinks()}
        </nav>
        {/* Admin Footer */}
        <div className="p-3 border-t border-outline-variant flex flex-col gap-2 bg-surface-container-low">
          {currentUser && (
            <div className="px-2 py-1.5 rounded-lg bg-surface-container border border-outline-variant/60 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {currentUser.name ? currentUser.name[0] : "A"}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-xs font-bold text-on-surface truncate">{currentUser.name || "Administrator"}</p>
                <p className="text-[10px] text-on-surface-variant truncate capitalize">{currentUser.role || "admin"}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors w-full cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-72 max-w-[85%] bg-surface-container-low h-full flex flex-col shadow-2xl z-10 border-r border-outline-variant">
            <div className="p-4 border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-xs">EV</div>
                <span className="font-extrabold text-base tracking-tight text-on-surface">Elite Admin</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-3 border-b border-outline-variant">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors"
              >
                <span>View Public Website</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin">
              {renderNavLinks()}
            </nav>
            <div className="p-3 border-t border-outline-variant">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors w-full cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-surface">
        {/* Top Header on Mobile and Tablet */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-surface-container-low border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container border border-outline-variant"
              aria-label="Open Admin Menu"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <span className="font-extrabold text-sm tracking-tight text-on-surface">Elite Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-surface-container"
              title="Open Public Site"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              <span className="hidden sm:inline">Website</span>
            </a>
            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-500/10"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
