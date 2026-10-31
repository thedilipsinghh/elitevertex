"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetPublicNavigationQuery, useGetWebsiteSettingsQuery } from "@/lib/features/api/apiSlice";

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
  const whatsappNumber = (settings.whatsapp || "+91 98450 12345").replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 bg-surface-container-lowest border-b border-outline-variant ${isScrolled ? "shadow-sm py-1" : "py-0"
        }`}
    >
      <div className="h-16 md:h-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all duration-200">

        {/* Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center" aria-label="Elite Vertex Home">
            <div className="flex items-center dark:bg-white dark:rounded-lg dark:p-1.5 transition-all">
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
                    <span className="material-symbols-outlined text-[48px]">expand_more</span>
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
                className={`font-semibold text-xs uppercase tracking-wider py-2 nav-link-anim transition-colors duration-200 ${active
                  ? "text-primary font-bold active-link"
                  : "text-on-surface-variant hover:text-primary"
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons, Theme Toggle & Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* WhatsApp Action Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#007a55] hover:bg-[#006747] text-white font-semibold text-xs sm:text-sm px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-200 shadow-xs hover:shadow-md active:scale-95 cursor-pointer select-none btn-press hover-lift"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <svg
              className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.5 4C2.5 2.62 3.62 1.5 5 1.5H19C20.38 1.5 21.5 2.62 21.5 4V15C21.5 16.38 20.38 17.5 19 17.5H5.8L2.5 21V4ZM5.5 5.5H18.5V7.5H5.5V5.5ZM5.5 9H18.5V11H5.5V9ZM5.5 12.5H14V14.5H5.5V12.5Z"
                fill="white"
              />
            </svg>
            <span className="tracking-wide">WhatsApp</span>
          </a>

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
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#007a55] hover:bg-[#006747] text-white font-semibold text-sm px-4 py-2.5 rounded-full transition-colors shadow-xs"
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.5 4C2.5 2.62 3.62 1.5 5 1.5H19C20.38 1.5 21.5 2.62 21.5 4V15C21.5 16.38 20.38 17.5 19 17.5H5.8L2.5 21V4ZM5.5 5.5H18.5V7.5H5.5V5.5ZM5.5 9H18.5V11H5.5V9ZM5.5 12.5H14V14.5H5.5V12.5Z"
                    fill="white"
                  />
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </nav>
        </div >
      )
      }
    </header >
  );
}
