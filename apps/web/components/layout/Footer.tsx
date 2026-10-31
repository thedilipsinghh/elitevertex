"use client";

import Link from "next/link";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  useGetPublicNavigationQuery,
  useGetWebsiteSettingsQuery,
  useGetCampusesQuery,
} from "@/lib/features/api/apiSlice";

interface NavNode {
  id: string;
  label: string;
  url: string;
  openInNewTab?: boolean;
  children?: NavNode[];
}

const FALLBACK_FOOTER: { name: string; href: string }[] = [
  { name: "Home", href: "/" },
  { name: "Courses & Curriculum", href: "/courses" },
  { name: "About the Institute", href: "/about" },
  { name: "Campus Gallery", href: "/gallery" },
  { name: "Verify Credential", href: "/verify-certificate" },
  { name: "FAQ & Help", href: "/faq" },
  { name: "Contact & Visit", href: "/contact" },
];

export function Footer() {
  const { data: navResponse } = useGetPublicNavigationQuery("footer");
  const { data: settingsResponse } = useGetWebsiteSettingsQuery({});
  const { data: campusesResponse } = useGetCampusesQuery({});
  const settings = settingsResponse?.data || {};

  const campuses: any[] = (campusesResponse?.data || []).filter((c: any) => c.isPublished !== false);
  const activeCampuses = campuses.length > 0 ? campuses : [
    { name: "Mairwa Campus", address: "Apex Tower, Ghuthani More, Mairwa, Siwan, Bihar" },
    { name: "Siwan Centre", address: "Ground Floor, Plaza 2, Shastri Nagar Registry Kachari, Siwan" }
  ];

  const cmsNodes: NavNode[] = navResponse?.data || [];
  const navItems =
    cmsNodes.length > 0
      ? cmsNodes.map((n) => ({ name: n.label, href: n.url }))
      : FALLBACK_FOOTER;

  const helplineNumber = settings.phone || settings.whatsapp || "+91 72194 47712";
  const rawHelpline = helplineNumber.replace(/[^0-9+]/g, "");

  return (
    <footer className="w-full bg-slate-100 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200 relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-200 dark:border-slate-800">
          
          {/* Brand & Overview Column */}
          <div className="md:col-span-4 flex flex-col gap-4 sm:gap-5">
            <Link 
              href="/" 
              className="inline-block bg-white rounded-xl px-4 py-2.5 shadow-xs border border-slate-200 dark:border-slate-700 w-fit group transition-all"
              aria-label="Elite Vertex Home"
            >
              <img
                alt="Elite Vertex Brand Logo"
                className="h-8 md:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                src={settings.logoUrl || "/logo.png"}
              />
            </Link>
            
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
              Speak With Confidence. Rise With Communication. Premier institute for Spoken English, Public Speaking, and Executive Career Communication.
            </p>

            <div className="flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/20 px-3.5 py-1.5 rounded-full w-fit shadow-2xs">
              <span className="material-symbols-outlined text-[16px] text-amber-600 dark:text-amber-400">
                verified
              </span>
              <span>ISO 9001:2015 Accredited Pedagogical Standards</span>
            </div>

            {/* Social Channels Strip (Persistent on all screens) */}
            <div className="flex items-center gap-2.5 pt-2">
              {settings.socialShowInstagram !== false && (
                <a
                  href={settings.instagramUrl || "https://www.instagram.com/elitevertex"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Elite Vertex Instagram"
                  className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all shadow-2xs"
                >
                  <FaInstagram className="text-sm" />
                </a>
              )}
              {settings.socialShowFacebook !== false && (
                <a
                  href={settings.facebookUrl || "https://www.facebook.com/elitevertex"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Elite Vertex Facebook"
                  className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
                >
                  <FaFacebookF className="text-xs" />
                </a>
              )}
              {settings.socialShowWhatsapp !== false && (
                <a
                  href={(() => {
                    const raw = settings.whatsapp || settings.phone || "+917219447712";
                    return raw.startsWith("http") ? raw : `https://wa.me/${raw.replace(/[^0-9]/g, "")}`;
                  })()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Elite Vertex WhatsApp"
                  className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-2xs"
                >
                  <FaWhatsapp className="text-sm" />
                </a>
              )}
              {settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Elite Vertex LinkedIn"
                  className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 flex items-center justify-center hover:bg-sky-600 hover:text-white transition-all shadow-2xs"
                >
                  <FaLinkedinIn className="text-xs" />
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Elite Vertex YouTube"
                  className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-2xs"
                >
                  <FaYoutube className="text-sm" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Navigation Column */}
          <div className="md:col-span-2 flex flex-col gap-3 sm:gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              Navigation
            </span>
            <div className="flex flex-col gap-2.5 text-sm text-slate-600 dark:text-slate-400">
              {navItems.map((item) => (
                <Link
                  key={`${item.href}-${item.name}`}
                  href={item.href}
                  className="hover:text-slate-900 dark:hover:text-white hover:translate-x-1 transition-all duration-150 w-fit flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-amber-600 dark:group-hover:bg-amber-400 transition-colors" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Programs Column */}
          <div className="md:col-span-3 flex flex-col gap-3 sm:gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              Popular Programs
            </span>
            <div className="flex flex-col gap-2.5 text-sm text-slate-600 dark:text-slate-400">
              <Link href="/courses#spoken-english" className="hover:text-slate-900 dark:hover:text-white hover:translate-x-1 transition-all duration-150 w-fit flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-amber-600 dark:group-hover:bg-amber-400 transition-colors" />
                Fluent Spoken English
              </Link>
              <Link href="/courses#public-speaking" className="hover:text-slate-900 dark:hover:text-white hover:translate-x-1 transition-all duration-150 w-fit flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-amber-600 dark:group-hover:bg-amber-400 transition-colors" />
                Public Speaking Mastery
              </Link>
              <Link href="/courses#executive-comm" className="hover:text-slate-900 dark:hover:text-white hover:translate-x-1 transition-all duration-150 w-fit flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-amber-600 dark:group-hover:bg-amber-400 transition-colors" />
                Executive Business Communication
              </Link>
              <Link href="/courses#personality-dev" className="hover:text-slate-900 dark:hover:text-white hover:translate-x-1 transition-all duration-150 w-fit flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-amber-600 dark:group-hover:bg-amber-400 transition-colors" />
                Personality &amp; Confidence Building
              </Link>
              <Link href="/courses#interview-prep" className="hover:text-slate-900 dark:hover:text-white hover:translate-x-1 transition-all duration-150 w-fit flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-amber-600 dark:group-hover:bg-amber-400 transition-colors" />
                Corporate Interview Preparation
              </Link>
            </div>
          </div>

          {/* Contact & Admissions Column */}
          <div className="md:col-span-3 flex flex-col gap-3 sm:gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              Campuses &amp; Hotline
            </span>
            <div className="flex flex-col gap-3 text-xs text-slate-600 dark:text-slate-300">
              {activeCampuses.slice(0, 3).map((c: any, i: number) => (
                <div key={c.id || i} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/20 flex items-center justify-center shrink-0 mt-0.5 text-amber-700 dark:text-amber-400">
                    <span className="material-symbols-outlined text-[16px]">
                      location_on
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block text-sm">{c.name}</span>
                    <span className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{c.address}</span>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block mb-1.5">
                  Admissions Hotline
                </span>
                <a
                  href={`tel:${rawHelpline}`}
                  className="inline-flex items-center gap-2.5 text-sm sm:text-base font-bold text-amber-900 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-300 transition-all bg-amber-100 dark:bg-amber-400/10 hover:bg-amber-200 dark:hover:bg-amber-400/20 px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-400/30 shadow-xs hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[18px] text-amber-700 dark:text-amber-400">
                    call
                  </span>
                  {helplineNumber}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Elite Vertex Institute of Communication. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-0.5 bg-white dark:bg-slate-900/60 shadow-2xs">
              <ThemeToggle showLabel className="text-xs py-1 px-1.5 hover:bg-transparent" />
            </div>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</Link>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer">
              Back to Top
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
            </button>
          </div>
        </div>
</div>

  



      
    </footer>
  );
}
