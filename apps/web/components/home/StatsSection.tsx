"use client";

import { useState, useCallback } from "react";
import type { SectionContent } from "@/lib/cms/sections";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AnimatedCounter, parseCounterValue } from "@/components/ui/AnimatedCounter";

export interface StatItem {
  value?: string;
  label?: string;
  detail?: string;
  icon?: string;
  accent?: string;
}

export const DEFAULT_STATS_CONTENT = {
  enabled: true,
  badge: "OUR MILESTONES",
  heading: "Proven Results That Speak For Themselves",
  subheading:
    "Real student outcomes built through intensive spoken practice, dedicated mentorship, and career-focused training.",
  items: [
    {
      value: "370+",
      label: "Students Trained",
      detail: "Confident communicators coached across spoken English, fluency, and executive speaking.",
      icon: "groups",
      accent: "amber",
    },
    {
      value: "50+",
      label: "Expert Mentors",
      detail: "Dedicated language coaches, phonetic trainers, and mock-interview specialists.",
      icon: "psychology",
      accent: "blue",
    },
    {
      value: "100+",
      label: "Courses Completed",
      detail: "Structured cohorts delivered across PFE, daily fluency, GD panels, and leadership tracks.",
      icon: "workspace_premium",
      accent: "emerald",
    },
    {
      value: "95%",
      label: "Placement Assistance",
      detail: "Dedicated resume clinics, mock interview boards, and career communication mentoring.",
      icon: "trending_up",
      accent: "indigo",
    },
  ] as StatItem[],
};

interface AccentStyle {
  topBar: string;
  glow: string;
  iconBox: string;
  numberText: string;
  barFill: string;
  borderHover: string;
}

const ACCENT_MAP: Record<string, AccentStyle> = {
  amber: {
    topBar: "from-amber-500 via-orange-500 to-amber-400",
    glow: "bg-amber-500/20",
    iconBox: "bg-amber-500/12 text-amber-700 dark:text-amber-300 border-amber-500/25",
    numberText: "text-amber-600 dark:text-amber-400",
    barFill: "from-amber-500 to-orange-500",
    borderHover: "hover:border-amber-400/70 dark:hover:border-amber-500/50",
  },
  blue: {
    topBar: "from-sky-500 via-blue-600 to-cyan-500",
    glow: "bg-blue-500/20",
    iconBox: "bg-blue-500/12 text-blue-700 dark:text-blue-300 border-blue-500/25",
    numberText: "text-blue-600 dark:text-blue-400",
    barFill: "from-sky-500 to-blue-600",
    borderHover: "hover:border-blue-400/70 dark:hover:border-blue-500/50",
  },
  emerald: {
    topBar: "from-emerald-500 via-teal-500 to-green-400",
    glow: "bg-emerald-500/20",
    iconBox: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
    numberText: "text-emerald-600 dark:text-emerald-400",
    barFill: "from-emerald-500 to-teal-500",
    borderHover: "hover:border-emerald-400/70 dark:hover:border-emerald-500/50",
  },
  indigo: {
    topBar: "from-indigo-500 via-violet-500 to-purple-500",
    glow: "bg-indigo-500/20",
    iconBox: "bg-indigo-500/12 text-indigo-700 dark:text-indigo-300 border-indigo-500/25",
    numberText: "text-indigo-600 dark:text-indigo-400",
    barFill: "from-indigo-500 to-violet-500",
    borderHover: "hover:border-indigo-400/70 dark:hover:border-indigo-500/50",
  },
  rose: {
    topBar: "from-rose-500 via-pink-500 to-rose-400",
    glow: "bg-rose-500/20",
    iconBox: "bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/25",
    numberText: "text-rose-600 dark:text-rose-400",
    barFill: "from-rose-500 to-pink-500",
    borderHover: "hover:border-rose-400/70 dark:hover:border-rose-500/50",
  },
};

const FALLBACK_ACCENTS = ["amber", "blue", "emerald", "indigo", "rose"] as const;

const str = (v: unknown, fallback = ""): string =>
  typeof v === "string" && v.trim().length > 0 ? v.trim() : fallback;

function StatCard({
  item,
  index,
  replayKey,
}: {
  item: StatItem;
  index: number;
  replayKey: number;
}) {
  const [activated, setActivated] = useState(false);
  const handleStart = useCallback(() => setActivated(true), []);

  const accentKey =
    item.accent && ACCENT_MAP[item.accent]
      ? item.accent
      : FALLBACK_ACCENTS[index % FALLBACK_ACCENTS.length]!;
  const style = ACCENT_MAP[accentKey] ?? ACCENT_MAP.amber!;

  const rawValue = str(item.value, "0+");
  const parsed = parseCounterValue(rawValue);
  const barWidth =
    parsed.isNumeric && parsed.suffix.includes("%")
      ? `${Math.max(10, Math.min(100, parsed.target))}%`
      : "100%";

  return (
    <ScrollReveal direction="up" delay={index * 95}>
      <article
        className={`group relative h-full overflow-hidden rounded-2xl bg-surface-container-lowest border border-outline-variant ${style.borderHover} p-6 sm:p-7 shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_18px_36px_-12px_rgba(15,23,42,0.12)] dark:hover:shadow-[0_18px_36px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between`}
      >
        {/* Top gradient accent hairline */}
        <div
          className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${style.topBar} opacity-85 group-hover:opacity-100 transition-opacity duration-300`}
        />

        {/* Ambient radial hover glow */}
        <div
          className={`pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${style.glow}`}
        />

        <div>
          {/* Icon Pill + Editorial Sequence Index */}
          <div className="flex items-center justify-between mb-5">
            <div
              className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${style.iconBox}`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {str(item.icon, "verified")}
              </span>
            </div>

            <span className="font-label-sm text-label-sm tracking-widest text-on-surface-variant/60 tabular-nums select-none">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Animated Count Value */}
          <div className="mb-2">
            <AnimatedCounter
              value={rawValue}
              duration={1550}
              delay={index * 110}
              replayKey={replayKey}
              onStart={handleStart}
              className={`font-display text-display-mobile sm:text-[2.625rem] font-extrabold tracking-tight tabular-nums leading-none inline-block ${style.numberText}`}
            />
          </div>

          {/* Label */}
          <h3 className="font-headline-sm text-headline-sm text-primary mb-2">
            {str(item.label, "Key Milestone")}
          </h3>

          {/* Detailed Subtext */}
          {str(item.detail) && (
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {str(item.detail)}
            </p>
          )}
        </div>

        {/* Synchronized animated bottom meter */}
        <div className="mt-6 pt-2">
          <div className="h-1.5 w-full rounded-full bg-surface-container overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${style.barFill} transition-all ease-out`}
              style={{
                width: activated ? barWidth : "0%",
                transitionDuration: "1550ms",
                transitionDelay: `${index * 110}ms`,
              }}
            />
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}

export function StatsSection({
  content,
  replayKey = 0,
}: {
  content: SectionContent;
  replayKey?: number;
}) {
  if (content.enabled === false) return null;

  const rawItems = Array.isArray(content.items) ? (content.items as StatItem[]) : [];
  const validItems = rawItems.filter((item) => str(item.value) || str(item.label));
  const items = validItems.length > 0 ? validItems : DEFAULT_STATS_CONTENT.items;

  const gridColsClass =
    items.length === 1
      ? "grid-cols-1 max-w-md mx-auto"
      : items.length === 2
      ? "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto"
      : items.length === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="relative w-full bg-surface-container-low py-space-2xl md:py-space-3xl border-y border-outline-variant transition-colors overflow-hidden">
      {/* Subtle decorative backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-72 h-72 rounded-full bg-secondary/5 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto text-center mb-space-xl flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/30 text-amber-900 dark:text-amber-300 font-label-md text-label-md uppercase tracking-widest font-bold mb-space-xs shadow-sm badge-shimmer">
              <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400 animate-pulse" />
              <span>{str(content.badge, DEFAULT_STATS_CONTENT.badge)}</span>
            </div>

            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight text-balance mb-space-2xs">
              {str(content.heading, DEFAULT_STATS_CONTENT.heading)}
            </h2>

            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed max-w-2xl">
              {str(content.subheading, DEFAULT_STATS_CONTENT.subheading)}
            </p>
          </div>
        </ScrollReveal>

        <div className={`grid ${gridColsClass} gap-5 sm:gap-6`}>
          {items.map((item, idx) => (
            <StatCard
              key={`${idx}-${str(item.label)}-${replayKey}`}
              item={item}
              index={idx}
              replayKey={replayKey}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

