"use client";

import { useGetWebsiteSettingsQuery } from "@/lib/features/api/apiSlice";
import { useState } from "react";

export function VerticalSocialSticky() {
  const { data: response } = useGetWebsiteSettingsQuery({});
  const settings = response?.data || {};

  // Admin controls
  const isEnabled = settings.socialStickyEnabled !== false; // default true
  const position = (settings.socialStickyPosition || "right").toLowerCase(); // "right" | "left"
  const offset = (settings.socialStickyOffset || "center").toLowerCase(); // "center" | "bottom" | "top"

  const showInstagram = settings.socialShowInstagram !== false;
  const showFacebook = settings.socialShowFacebook !== false;
  const showWhatsapp = settings.socialShowWhatsapp !== false;

  const instagramUrl = settings.instagramUrl || "https://www.instagram.com/elitevertex";
  const facebookUrl = settings.facebookUrl || "https://www.facebook.com/elitevertex";
  
  // Format WhatsApp Link
  const rawPhone = settings.whatsapp || "+918049208800";
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
  const defaultWhatsappMsg = encodeURIComponent("Hello Elite Vertex! I would like to inquire about courses and admissions.");
  const whatsappUrl = rawPhone.startsWith("http")
    ? rawPhone
    : `https://wa.me/${cleanPhone}?text=${defaultWhatsappMsg}`;

  // If disabled or all icons hidden, do not render
  if (!isEnabled) return null;
  if (!showInstagram && !showFacebook && !showWhatsapp) return null;

  // Position classes
  const horizontalClass = position === "left" ? "left-3 sm:left-5" : "right-3 sm:right-5";
  
  let verticalClass = "top-1/2 -translate-y-1/2";
  if (offset === "bottom") {
    verticalClass = "bottom-8 sm:bottom-12";
  } else if (offset === "top") {
    verticalClass = "top-28 sm:top-36";
  }

  // Tooltip position (flies towards page center)
  const isRight = position !== "left";

  return (
    <aside
      aria-label="Online Social Profiles"
      className={`fixed ${horizontalClass} ${verticalClass} z-50 flex flex-col items-center gap-3 select-none pointer-events-auto print:hidden animate-fade-in`}
    >
      {/* ── 1. INSTAGRAM SQUIRCLE ── */}
      {showInstagram && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Elite Vertex on Instagram"
          className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-2xl p-0.5 transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_8px_20px_-3px_rgba(220,39,67,0.45)] hover:shadow-[0_12px_28px_-2px_rgba(220,39,67,0.6)] focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          style={{
            background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
          }}
        >
          {/* Subtle glossy top highlight */}
          <div className="absolute inset-0 rounded-2xl border-t border-white/40 pointer-events-none" />

          {/* Instagram Camera Icon SVG */}
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

          {/* Tooltip Label */}
          <div
            className={`absolute ${
              isRight ? "right-full mr-3.5" : "left-full ml-3.5"
            } top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 dark:bg-black/90 backdrop-blur-md text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200`}
          >
            <span>Instagram</span>
            <span className="text-[10px] text-pink-300 font-normal">@elitevertex</span>
            {/* Tooltip Arrow */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 ${
                isRight ? "left-full border-l-slate-900/90 dark:border-l-black/90" : "right-full border-r-slate-900/90 dark:border-r-black/90"
              } border-y-4 border-y-transparent ${
                isRight ? "border-l-4" : "border-r-4"
              }`}
            />
          </div>
        </a>
      )}

      {/* ── 2. FACEBOOK SQUIRCLE ── */}
      {showFacebook && (
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Elite Vertex on Facebook"
          className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-2xl p-0.5 transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_8px_20px_-3px_rgba(24,119,242,0.45)] hover:shadow-[0_12px_28px_-2px_rgba(24,119,242,0.6)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          style={{
            background: "linear-gradient(180deg, #1877F2 0%, #0F62D4 100%)",
          }}
        >
          {/* Subtle glossy top highlight */}
          <div className="absolute inset-0 rounded-2xl border-t border-white/40 pointer-events-none" />

          {/* Facebook 'f' Icon SVG */}
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-105"
          >
            <path d="M14 13.5h2.5l1-4H14v-2c0-1.03.44-1.5 1.7-1.5H18V2.3A22 22 0 0 0 15.3 2c-3.1 0-5.3 1.9-5.3 5.4v2.1H7v4h3v8.5h4v-8.5Z" />
          </svg>

          {/* Tooltip Label */}
          <div
            className={`absolute ${
              isRight ? "right-full mr-3.5" : "left-full ml-3.5"
            } top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 dark:bg-black/90 backdrop-blur-md text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200`}
          >
            <span>Facebook</span>
            <span className="text-[10px] text-blue-300 font-normal">Official Page</span>
            {/* Tooltip Arrow */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 ${
                isRight ? "left-full border-l-slate-900/90 dark:border-l-black/90" : "right-full border-r-slate-900/90 dark:border-r-black/90"
              } border-y-4 border-y-transparent ${
                isRight ? "border-l-4" : "border-r-4"
              }`}
            />
          </div>
        </a>
      )}

      {/* ── 3. WHATSAPP SQUIRCLE ── */}
      {showWhatsapp && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Elite Vertex on WhatsApp"
          className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-2xl p-0.5 transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_8px_20px_-3px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_28px_-2px_rgba(37,211,102,0.6)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          style={{
            background: "linear-gradient(180deg, #25D366 0%, #1DA851 100%)",
          }}
        >
          {/* Subtle glossy top highlight */}
          <div className="absolute inset-0 rounded-2xl border-t border-white/40 pointer-events-none" />

          {/* WhatsApp Chat Bubble Icon SVG */}
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-105"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>

          {/* Tooltip Label */}
          <div
            className={`absolute ${
              isRight ? "right-full mr-3.5" : "left-full ml-3.5"
            } top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 dark:bg-black/90 backdrop-blur-md text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200`}
          >
            <span>WhatsApp</span>
            <span className="text-[10px] text-emerald-300 font-normal">Direct Helpline</span>
            {/* Tooltip Arrow */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 ${
                isRight ? "left-full border-l-slate-900/90 dark:border-l-black/90" : "right-full border-r-slate-900/90 dark:border-r-black/90"
              } border-y-4 border-y-transparent ${
                isRight ? "border-l-4" : "border-r-4"
              }`}
            />
          </div>
        </a>
      )}
    </aside>
  );
}
