"use client";

import { ReactNode } from "react";
import { useGetWebsiteSettingsQuery } from "@/lib/features/api/apiSlice";
import {
  extractSocialHandle,
  formatWhatsAppDisplay,
  formatWhatsAppUrl,
  normalizeSocialUrl,
} from "@/lib/social";

interface SocialItem {
  id: string;
  label: string;
  subtitle: string;
  href: string;
  ariaLabel: string;
  background: string;
  shadowClass: string;
  ringClass: string;
  subtitleColorClass: string;
  icon: ReactNode;
}

const DEFAULT_WHATSAPP_MSG = "Hello Elite Vertex! I would like to inquire about courses and admissions.";

export function VerticalSocialSticky() {
  const { data: response, isLoading } = useGetWebsiteSettingsQuery(
    {},
    { refetchOnFocus: true, refetchOnReconnect: true }
  );

  // Avoid flashing stale/empty UI before initial settings fetch completes
  if (isLoading && !response) return null;

  const settings = response?.data;
  if (!settings || settings.socialStickyEnabled === false) return null;

  const position = (settings.socialStickyPosition || "right").toLowerCase();
  const offset = (settings.socialStickyOffset || "center").toLowerCase();

  const instagramHref =
    settings.socialShowInstagram !== false ? normalizeSocialUrl(settings.instagramUrl, "instagram") : null;
  const facebookHref =
    settings.socialShowFacebook !== false ? normalizeSocialUrl(settings.facebookUrl, "facebook") : null;
  const linkedinHref =
    settings.socialShowLinkedin !== false ? normalizeSocialUrl(settings.linkedinUrl, "linkedin") : null;
  const youtubeHref =
    settings.socialShowYoutube !== false ? normalizeSocialUrl(settings.youtubeUrl, "youtube") : null;
  const whatsappHref =
    settings.socialShowWhatsapp !== false ? formatWhatsAppUrl(settings.whatsapp, DEFAULT_WHATSAPP_MSG) : null;

  const candidates: (SocialItem | null)[] = [
    instagramHref
      ? {
          id: "instagram",
          label: "Instagram",
          subtitle: extractSocialHandle(settings.instagramUrl, "instagram", "Instagram"),
          href: instagramHref,
          ariaLabel: "Visit Elite Vertex on Instagram",
          background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
          shadowClass: "shadow-[0_8px_20px_-3px_rgba(220,39,67,0.45)] hover:shadow-[0_12px_28px_-2px_rgba(220,39,67,0.6)]",
          ringClass: "focus:ring-pink-500/50",
          subtitleColorClass: "text-pink-300",
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-105"
            >
              <rect x="2" y="2" width="20" height="20" rx="5.5" ry="5.5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <circle cx="17.5" cy="6.5" r="1" fill="white" />
            </svg>
          ),
        }
      : null,
    facebookHref
      ? {
          id: "facebook",
          label: "Facebook",
          subtitle: extractSocialHandle(settings.facebookUrl, "facebook", "Official Page"),
          href: facebookHref,
          ariaLabel: "Visit Elite Vertex on Facebook",
          background: "linear-gradient(180deg, #1877F2 0%, #0F62D4 100%)",
          shadowClass: "shadow-[0_8px_20px_-3px_rgba(24,119,242,0.45)] hover:shadow-[0_12px_28px_-2px_rgba(24,119,242,0.65)]",
          ringClass: "focus:ring-blue-500/50",
          subtitleColorClass: "text-blue-300",
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-105"
            >
              <path d="M14 13.5h2.5l1-4H14v-2c0-1.03.44-1.5 1.7-1.5H18V2.3A22 22 0 0 0 15.3 2c-3.1 0-5.3 1.9-5.3 5.4v2.1H7v4h3v8.5h4v-8.5Z" />
            </svg>
          ),
        }
      : null,
    linkedinHref
      ? {
          id: "linkedin",
          label: "LinkedIn",
          subtitle: extractSocialHandle(settings.linkedinUrl, "linkedin", "LinkedIn Profile"),
          href: linkedinHref,
          ariaLabel: "Visit Elite Vertex on LinkedIn",
          background: "linear-gradient(180deg, #0A66C2 0%, #004182 100%)",
          shadowClass: "shadow-[0_8px_20px_-3px_rgba(10,102,194,0.45)] hover:shadow-[0_12px_28px_-2px_rgba(10,102,194,0.65)]",
          ringClass: "focus:ring-sky-500/50",
          subtitleColorClass: "text-sky-300",
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-105"
            >
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.95 0-1.72-.78-1.72-1.73a1.73 1.73 0 0 1 1.72-1.72c.96 0 1.73.77 1.73 1.72 0 .95-.77 1.73-1.73 1.73m1.39 9.74v-8.37H5.07v8.37h2.78Z" />
            </svg>
          ),
        }
      : null,
    youtubeHref
      ? {
          id: "youtube",
          label: "YouTube",
          subtitle: extractSocialHandle(settings.youtubeUrl, "youtube", "YouTube Channel"),
          href: youtubeHref,
          ariaLabel: "Visit Elite Vertex on YouTube",
          background: "linear-gradient(180deg, #FF0000 0%, #CC0000 100%)",
          shadowClass: "shadow-[0_8px_20px_-3px_rgba(255,0,0,0.45)] hover:shadow-[0_12px_28px_-2px_rgba(255,0,0,0.65)]",
          ringClass: "focus:ring-red-500/50",
          subtitleColorClass: "text-red-300",
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-105"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          ),
        }
      : null,
    whatsappHref
      ? {
          id: "whatsapp",
          label: "WhatsApp",
          subtitle: formatWhatsAppDisplay(settings.whatsapp, "Direct Chat"),
          href: whatsappHref,
          ariaLabel: "Chat with Elite Vertex on WhatsApp",
          background: "linear-gradient(180deg, #25D366 0%, #1DA851 100%)",
          shadowClass: "shadow-[0_8px_20px_-3px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_28px_-2px_rgba(37,211,102,0.65)]",
          ringClass: "focus:ring-emerald-500/50",
          subtitleColorClass: "text-emerald-300",
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-105"
            >
              <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5l-1.406 5.156 5.281-1.391c1.469.797 3.125 1.219 4.75 1.219 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.828 14.125c-.25.703-1.422 1.344-1.969 1.438-.516.078-1.172.141-1.891-.094-.453-.141-1.016-.344-1.734-.656-3.031-1.297-5.016-4.375-5.172-4.578-.156-.203-1.234-1.641-1.234-3.125s.781-2.219 1.063-2.516c.281-.297.609-.375.813-.375.203 0 .406 0 .578.016.188.016.438-.078.688.516.25.609.859 2.094.938 2.25.078.156.125.344.016.547-.109.203-.156.344-.313.516-.156.172-.328.391-.469.516-.156.156-.328.328-.141.656.188.328.844 1.391 1.813 2.25 1.25 1.109 2.297 1.453 2.625 1.609.328.156.516.125.703-.094.188-.219.813-.953 1.031-1.281.219-.328.438-.281.734-.172.297.109 1.906.891 2.234 1.047.328.156.547.234.625.375.078.141.078.813-.172 1.516z" />
            </svg>
          ),
        }
      : null,
  ];

  const channels = candidates.filter((item): item is SocialItem => item !== null);
  if (channels.length === 0) return null;

  const horizontalClass = position === "left" ? "left-3 sm:left-5" : "right-3 sm:right-5";

  let verticalClass = "top-1/2 -translate-y-1/2";
  if (offset === "bottom") {
    verticalClass = "bottom-8 sm:bottom-12";
  } else if (offset === "top") {
    verticalClass = "top-28 sm:top-36";
  }

  const isRight = position !== "left";

  return (
    <aside
      aria-label="Online Social Profiles"
      className={`fixed ${horizontalClass} ${verticalClass} z-50 flex flex-col items-center gap-3 select-none pointer-events-auto print:hidden animate-fade-in`}
    >
      {channels.map((channel) => (
        <a
          key={channel.id}
          href={channel.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={channel.ariaLabel}
          className={`group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-2xl p-0.5 transition-all duration-300 hover:scale-110 active:scale-95 ${channel.shadowClass} focus:outline-none focus:ring-2 ${channel.ringClass}`}
          style={{ background: channel.background }}
        >
          <div className="absolute inset-0 rounded-2xl border-t border-white/40 pointer-events-none" />
          {channel.icon}

          <div
            className={`hidden sm:flex items-center gap-1.5 absolute top-1/2 -translate-y-1/2 ${
              isRight ? "right-full mr-3.5" : "left-full ml-3.5"
            } opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white text-xs font-bold shadow-xl border border-slate-700/80 whitespace-nowrap`}
          >
            <div className="flex flex-col text-left leading-tight">
              <span>{channel.label}</span>
              <span className={`text-[10px] ${channel.subtitleColorClass} font-normal`}>{channel.subtitle}</span>
            </div>
            <span
              className={`w-2 h-2 bg-slate-900/95 rotate-45 border-slate-700/80 ${
                isRight
                  ? "border-r border-t -mr-4 ml-1"
                  : "border-l border-b -ml-4 mr-1 order-first"
              }`}
            />
          </div>
        </a>
      ))}
    </aside>
  );
}
