"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/eliteadmin4393/login") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    // Basic logout logic: delete cookie/token
    document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/eliteadmin4393/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/eliteadmin4393/dashboard", icon: "dashboard" },
    { name: "Courses", path: "/eliteadmin4393/courses", icon: "school" },
    { name: "Gallery", path: "/eliteadmin4393/gallery", icon: "collections" },
    { name: "Testimonials", path: "/eliteadmin4393/testimonials", icon: "reviews" },
    { name: "FAQ", path: "/eliteadmin4393/faq", icon: "help" },
    { name: "Contact Messages", path: "/eliteadmin4393/messages", icon: "mail" },
    { name: "Certificates", path: "/eliteadmin4393/certificates", icon: "verified" },
    { name: "Settings", path: "/eliteadmin4393/settings", icon: "settings" },
  ];

  return (
    <div className="flex h-screen bg-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-low border-r border-outline-variant flex flex-col hidden md:flex shrink-0">
        <div className="p-space-lg flex items-center justify-center border-b border-outline-variant">
          <span className="font-display text-headline-sm text-on-surface">Elite Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-space-md flex flex-col gap-space-3xs px-space-sm">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg font-label-lg transition-colors ${
                pathname.startsWith(item.path)
                  ? "bg-secondary-container text-on-secondary-container font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-space-md border-t border-outline-variant">
          <button
            onClick={handleLogout}
            className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg font-label-lg text-error hover:bg-error-container w-full transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-surface">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-space-md bg-surface-container-low border-b border-outline-variant">
          <span className="font-display text-headline-sm text-on-surface">Elite Admin</span>
          <button onClick={handleLogout} className="text-error">
            <span className="material-symbols-outlined text-[24px]">logout</span>
          </button>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-space-lg md:p-space-2xl">
          {children}
        </div>
      </main>
    </div>
  );
}
