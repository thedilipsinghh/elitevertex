"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "About", href: "/about" },
    { name: "Verify Certificate", href: "/verify-certificate" },
    { name: "Contact", href: "/contact" },
  ];

  const isLinkActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname === path || (pathname?.startsWith(path) ?? false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-surface-container-lowest/98 backdrop-blur-md shadow-md border-b border-outline-variant/10 py-1"
          : "bg-surface-container-lowest/90 backdrop-blur-sm shadow-[0_1px_8px_rgba(0,0,0,0.04)] py-0"
      }`}
    >
      <div className="h-16 md:h-20 max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop flex items-center justify-between gap-space-md transition-all duration-300">
        {/* Brand / Logo */}
        <div className="flex items-center gap-space-xs shrink-0">
          <Link href="/" className="flex items-center gap-space-xs">
            <img
              alt="Elite Vertex Brand Logo"
              className="h-10 md:h-12 w-auto object-contain transition-all duration-300"
              src="/logo.png"
            />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-space-lg">
          {navItems.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-label-md text-label-md uppercase tracking-wider transition-all duration-200 py-space-2xs relative ${
                  active
                    ? "text-primary font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-full"
                    : "text-on-surface-variant hover:text-primary font-medium"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons & Mobile Toggle */}
        <div className="flex items-center gap-space-sm shrink-0">
          <Link
            href="/book-counselling"
            className="hidden sm:inline-flex items-center justify-center bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md uppercase tracking-wider px-space-md py-space-xs rounded-lg transition-colors duration-150 shadow-sm"
          >
            Book Free Counselling
          </Link>

          <Link
            href="/login"
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
            title="Account Login"
          >
            <span className="material-symbols-outlined text-on-primary text-[20px]">
              person
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
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
        <div className="lg:hidden bg-surface-container-lowest border-b border-outline-variant/20 px-gutter-mobile py-space-md shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-space-xs">
            {navItems.map((item) => {
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-space-sm py-space-xs rounded-md text-body-md font-label-md uppercase tracking-wider transition-colors ${
                    active
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-space-xs mt-space-xs border-t border-outline-variant/20 sm:hidden">
              <Link
                href="/book-counselling"
                className="w-full flex items-center justify-center bg-secondary text-on-secondary font-label-md text-label-md uppercase tracking-wider px-space-md py-space-xs rounded-lg transition-colors"
              >
                Book Free Counselling
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
