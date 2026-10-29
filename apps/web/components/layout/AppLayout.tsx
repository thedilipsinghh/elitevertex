"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VerticalSocialSticky } from "@/components/ui/VerticalSocialSticky";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/eliteadmin4393");

  if (isAdmin) {
    return <main className="w-full min-h-screen bg-surface">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <div className="hidden sm:block"><VerticalSocialSticky /></div>
      <main className="w-full pt-16 md:pt-20 bg-surface min-h-[calc(100vh-20rem)] transition-colors duration-150">
        {children}
      </main>
      <Footer />
    </>
  );
}
