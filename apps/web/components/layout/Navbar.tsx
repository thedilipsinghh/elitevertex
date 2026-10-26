"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetPublicNavigationQuery, useGetWebsiteSettingsQuery } from "@/lib/features/api/apiSlice";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface NavNode {
  id: string;
  label: string;
  url: string;
  openInNewTab?: boolean;
  children?: NavNode[];
}

const FALLBACK_NAV: { name: string; href: string }[] = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "About", href: "/about" },
  { name: "Verify Certificate", href: "/verify-certificate" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: navResponse } = useGetPublicNavigationQuery("header");
  const { data: settingsResponse } = useGetWebsiteSettingsQuery({});
  const settings = settingsResponse?.data || {};

  const cmsNodes: NavNode[] = navResponse?.data || [];
  const navItems =
    cmsNodes.length > 0
      ? cmsNodes.map((n) => ({ name: n.label, href: n.url, children: n.children || [] }))
      : FALLBACK_NAV;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isLinkActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname === path || (pathname?.startsWith(path) ?? false);
  };

  const logoSrc = settings.logoUrl || "/logo.png";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 ${isScrolled
        ? "bg-surface-container-lowest/95 backdrop-blur-md shadow-sm border-b border-outline-variant py-1"
        : "bg-surface-container-lowest/90 backdrop-blur-sm border-b border-outline-variant/40 py-0"
        }`}
    >
      <div className="h-16 md:h-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all duration-200">

        {/* Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center" aria-label="Elite Vertex Home">
            <div className="bg-white rounded-lg p-1.5 shadow-xs border border-slate-200/80 dark:border-slate-700">
              <img
                alt="Elite Vertex Brand Logo"
                className="h-8 md:h-10 w-auto object-contain transition-all"
                src={logoSrc}
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navItems.map((item) => {
            const active = isLinkActive(item.href);
            const children = (item as { children?: NavNode[] }).children || [];
            if (children.length > 0) {
              return (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    className={`font-semibold text-xs uppercase tracking-wider transition-colors py-2 flex items-center gap-1 ${active
                      ? "text-primary font-bold"
                      : "text-on-surface-variant hover:text-primary"
                      }`}
                  >
                    {item.name}
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </Link>
                  <div className="absolute left-0 top-full pt-2 hidden group-hover:block">
                    <div className="bg-surface-container-lowest rounded-lg shadow-lg border border-outline-variant min-w-[200px] py-2">
                      {children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.url}
                          target={child.openInNewTab ? "_blank" : undefined}
                          rel={child.openInNewTab ? "noreferrer" : undefined}
                          className="block px-4 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-semibold text-xs uppercase tracking-wider transition-colors py-2 relative ${active
                  ? "text-primary font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-full"
                  : "text-on-surface-variant hover:text-primary"
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons, Theme Toggle & Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/book-counselling"
            className="hidden sm:inline-flex items-center justify-center bg-secondary hover:bg-on-secondary-container text-on-secondary font-semibold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors shadow-xs"
          >
            Book Free Counselling
          </Link>

          {/* Theme Toggle (Desktop) */}
          <ThemeToggle className="w-10 h-10" />

          {/* Login Action */}
          <Link
            href="/login"
            className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
            title="Account Login"
            aria-label="Account Login"
          >
            <span className="material-symbols-outlined text-[20px]">
              person
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="material-symbols-outlined text-[26px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-b border-outline-variant px-4 py-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isLinkActive(item.href);
              const children = (item as { children?: NavNode[] }).children || [];
              return (
                <div key={item.href} className="flex flex-col">
                  <Link
                    href={item.href}
                    className={`px-3 py-2.5 rounded-md text-sm font-semibold uppercase tracking-wider transition-colors ${active
                      ? "bg-surface-container text-primary font-bold"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                      }`}
                  >
                    {item.name}
                  </Link>
                  {children.length > 0 && (
                    <div className="flex flex-col pl-4 mt-1 border-l border-outline-variant">
                      {children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.url}
                          className="px-3 py-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-3 mt-2 border-t border-outline-variant flex flex-col gap-2">
              <ThemeToggle showLabel className="w-full justify-start py-2.5 px-3" />
              <Link
                href="/book-counselling"
                className="w-full flex items-center justify-center bg-secondary text-on-secondary font-semibold text-xs uppercase tracking-wider px-4 py-3 rounded-lg transition-colors sm:hidden"
              >
                Book Free Counselling
              </Link>
            </div>
          </nav>
        </div >
      )
      }
    </header >
  );
}
