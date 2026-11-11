"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  useGetAdminPagesQuery,
  useGetAdminPageQuery,
  useUpdateSectionMutation,
  usePublishPageMutation,
  useCreatePageMutation,
  useAddSectionMutation,
} from "@/lib/features/api/apiSlice";
import DualImageInput from "@/components/admin/DualImageInput";
import { DEFAULT_STATS_CONTENT, StatsSection, type StatItem } from "@/components/home/StatsSection";
import { parseCounterValue } from "@/components/ui/AnimatedCounter";

export default function AdminHomePageCms() {
  const { data: pagesResponse, isLoading: loadingPages } = useGetAdminPagesQuery(undefined);
  const pages = pagesResponse?.data || [];
  const homePageSummary = pages.find((p: any) => p.slug === "home");

  const [createPage] = useCreatePageMutation();
  const [addSection] = useAddSectionMutation();
  const [updateSection] = useUpdateSectionMutation();
  const [publishPage, { isLoading: isPublishing }] = usePublishPageMutation();

  const homePageId = homePageSummary?.id;
  const { data: pageDetailsResponse, isLoading: loadingPageDetails } = useGetAdminPageQuery(
    homePageId,
    { skip: !homePageId }
  );

  const page = pageDetailsResponse?.data;
  const sections = useMemo(() => page?.sections || [], [page]);

  // Section contents state mapped by section type
  const [hero, setHero] = useState<any>({
    tagline: "Spoken English • Communication • Career Skills",
    heading: "Speak With Confidence. Go Further.",
    subheading: "Build the English, communication skills, and executive confidence you need for classrooms, global careers, and everyday influence.",
    primaryCtaLabel: "Book Free Counselling",
    primaryCtaUrl: "/book-counselling",
    secondaryCtaLabel: "Explore Courses",
    secondaryCtaUrl: "/courses",
    image: "",
  });

  const [pillars, setPillars] = useState<any[]>([
    { label: "Pillar 01", title: "Practical Learning", description: "70% active speaking, zero passive lecturing." },
    { label: "Pillar 02", title: "Expert Trainers", description: "Cambridge-certified linguists & speech mentors." },
    { label: "Pillar 03", title: "Personal Attention", description: "Strictly capped micro-cohorts of 12 peers." },
    { label: "Pillar 04", title: "Career-Focused", description: "Interview panels, GD mastery, and boardroom articulation." },
  ]);

  const [stats, setStats] = useState<{
    enabled: boolean;
    badge: string;
    heading: string;
    subheading: string;
    items: StatItem[];
  }>({
    enabled: true,
    badge: DEFAULT_STATS_CONTENT.badge,
    heading: DEFAULT_STATS_CONTENT.heading,
    subheading: DEFAULT_STATS_CONTENT.subheading,
    items: DEFAULT_STATS_CONTENT.items.map((item) => ({ ...item })),
  });
  const [previewReplayKey, setPreviewReplayKey] = useState(0);

  const [aboutPreview, setAboutPreview] = useState<any>({
    label: "Pedagogical Framework",
    heading: "More Than English. We Build Confidence.",
    paragraph1: "Traditional language teaching isolates students inside grammar rules and rote drills. True oratory fluency requires psychological comfort, systematic desensitization to scrutiny, and immediate real-time feedback loops.",
    paragraph2: "At Elite Vertex, every participant receives continuous spoken runtime. We deconstruct anxiety, rebuild phonetics, and condition the posture of authority so your internal intellect translates effortlessly outward.",
    linkLabel: "Discover Elite Vertex",
    linkUrl: "/about",
    image: "",
  });

  const [coursesPreview, setCoursesPreview] = useState<any>({
    label: "Curriculum Tracks",
    heading: "Learn Skills That Move You Forward.",
    linkLabel: "View All Courses",
    linkUrl: "/courses",
  });

  const [diagnosticFaq, setDiagnosticFaq] = useState<any>({
    certificateCardTitle: "Official Attestation",
    certificateCardText: "Verify any alumni completion credential or serial number online.",
    certificateCardCta: "Verify",
    certificateCardCtaUrl: "/verify-certificate",
    diagnosticLabel: "Speech Diagnostic",
    diagnosticTitle: "Complimentary Speech Baseline Assessment",
    diagnosticText: "Evaluate your spoken clarity, pause cadence, and acoustic confidence with our senior academic linguists.",
    diagnosticNote: "No obligation required",
    faqLabel: "Clarifications",
    faqTitle: "Common Inquiries",
    faqLinkLabel: "View All FAQ",
    faqLinkUrl: "/faq",
  });

  const [cta, setCta] = useState<any>({
    label: "Admissions Open For Next Cohort",
    heading: "Your Next Opportunity Starts With Better Communication.",
    subheading: "Schedule an in-person or virtual speech evaluation with our academic directors. Discover your baseline fluency score and receive a personalized curriculum path.",
    primaryCtaLabel: "Book Free Counselling",
    primaryCtaUrl: "/book-counselling",
    secondaryCtaLabel: "Visit Campus",
    secondaryCtaUrl: "/contact",
  });

  const [activeTab, setActiveTab] = useState<"hero" | "pillars" | "stats" | "about" | "courses" | "diagnostic" | "cta">("hero");
  const [toastMessage, setToastMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Populate state when page sections load
  useEffect(() => {
    if (sections.length > 0) {
      for (const s of sections) {
        const content = s.draftContent || s.publishedContent || {};
        if (s.type === "hero") setHero((prev: any) => ({ ...prev, ...content }));
        if (s.type === "pillars" && Array.isArray(content.items) && content.items.length > 0) {
          setPillars(content.items);
        }
        if (s.type === "stats") {
          setStats({
            enabled: s.isVisible !== false && content.enabled !== false,
            badge: content.badge || DEFAULT_STATS_CONTENT.badge,
            heading: content.heading || DEFAULT_STATS_CONTENT.heading,
            subheading: content.subheading || DEFAULT_STATS_CONTENT.subheading,
            items:
              Array.isArray(content.items) && content.items.length > 0
                ? content.items
                : DEFAULT_STATS_CONTENT.items.map((item) => ({ ...item })),
          });
        }
        if (s.type === "about_preview") setAboutPreview((prev: any) => ({ ...prev, ...content }));
        if (s.type === "courses_preview") setCoursesPreview((prev: any) => ({ ...prev, ...content }));
        if (s.type === "certificate_faq") setDiagnosticFaq((prev: any) => ({ ...prev, ...content }));
        if (s.type === "cta") setCta((prev: any) => ({ ...prev, ...content }));
      }
    }
  }, [sections]);

  // Helper to ensure home page exists in CMS
  const ensureHomePage = async () => {
    if (!homePageId) {
      const created = await createPage({
        title: "Home",
        slug: "home",
        metaTitle: "Elite Vertex | Premier English & Public Speaking Institute",
        metaDescription: "Build the English, communication skills, and executive confidence you need.",
      }).unwrap();
      return created.data?.id;
    }
    return homePageId;
  };

  const handleSaveAndPublish = async () => {
    setIsSaving(true);
    try {
      const pageId = await ensureHomePage();

      // Find section IDs by type or create if missing
      const sectionMap: Record<string, any> = {};
      for (const s of sections) {
        sectionMap[s.type] = s.id;
      }

      const updates: { type: string; content: any; isVisible?: boolean }[] = [
        { type: "hero", content: hero },
        { type: "pillars", content: { items: pillars } },
        { type: "stats", content: stats, isVisible: stats.enabled !== false },
        { type: "about_preview", content: aboutPreview },
        { type: "courses_preview", content: coursesPreview },
        { type: "certificate_faq", content: diagnosticFaq },
        { type: "cta", content: cta },
      ];

      for (const item of updates) {
        const existingSectionId = sectionMap[item.type];
        const visibilityPatch = item.isVisible !== undefined ? { isVisible: item.isVisible } : {};
        if (existingSectionId) {
          await updateSection({ sectionId: existingSectionId, content: item.content, ...visibilityPatch }).unwrap();
        } else {
          await addSection({ pageId, type: item.type, content: item.content, ...visibilityPatch }).unwrap();
        }
      }

      // Publish the page to make changes live
      await publishPage(pageId).unwrap();
      showToast("✓ Home Page CMS saved & published live to website!");
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || "Failed to save and publish home page.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePillarChange = (index: number, field: string, val: string) => {
    setPillars((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleStatChange = (index: number, field: keyof StatItem, val: string) => {
    setStats((prev) => {
      const next = [...prev.items];
      next[index] = { ...next[index], [field]: val };
      return { ...prev, items: next };
    });
  };

  const handleAddStat = () => {
    setStats((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          value: "100+",
          label: "New Milestone",
          detail: "Short description of student achievement or outcome.",
          icon: "verified",
          accent: "amber",
        },
      ],
    }));
  };

  const handleRemoveStat = (index: number) => {
    setStats((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handleMoveStat = (index: number, dir: -1 | 1) => {
    setStats((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.items.length) return prev;
      const next = [...prev.items];
      const [moved] = next.splice(index, 1);
      if (moved) next.splice(target, 0, moved);
      return { ...prev, items: next };
    });
  };

  if (loadingPages || (homePageId && loadingPageDetails)) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
          <span className="text-sm font-semibold">Loading Home Page CMS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/30 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400"></span>
            <span>Live Section Editor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">Home Page CMS</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Direct visual control over all homepage sections, headings, call-to-actions, and messaging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            <span>View Live Site</span>
          </a>

          <button
            type="button"
            onClick={handleSaveAndPublish}
            disabled={isSaving || isPublishing}
            className="inline-flex items-center gap-2 bg-primary hover:opacity-90 text-on-primary px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-opacity shadow-xs disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">publish</span>
            <span>{isSaving || isPublishing ? "Publishing..." : "Save & Publish Live"}</span>
          </button>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-outline-variant" style={{ scrollbarWidth: "none" }}>
        {[
          { key: "hero", label: "Hero Banner", icon: "view_carousel" },
          { key: "pillars", label: "Pedagogical Pillars", icon: "view_column" },
          { key: "stats", label: "Impact Counters", icon: "analytics" },
          { key: "about", label: "About Preview", icon: "auto_stories" },
          { key: "courses", label: "Courses Preview", icon: "school" },
          { key: "diagnostic", label: "Diagnostic & Attestation", icon: "verified" },
          { key: "cta", label: "Admissions CTA", icon: "campaign" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-on-primary shadow-xs"
                : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-outline-variant/60"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant shadow-xs">
        
        {/* 1. HERO SECTION CMS */}
        {activeTab === "hero" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="border-b border-outline-variant pb-3">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">view_carousel</span>
                <span>Hero Section Content</span>
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Primary impression banner at top of homepage.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Top Tagline Badge</label>
                <input
                  type="text"
                  value={hero.tagline || ""}
                  onChange={(e) => setHero({ ...hero, tagline: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2.5 rounded-xl text-sm font-semibold text-on-surface focus:outline-none"
                  placeholder="e.g. Spoken English • Communication • Career Skills"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Hero Main Headline (H1)</label>
                <input
                  type="text"
                  value={hero.heading || ""}
                  onChange={(e) => setHero({ ...hero, heading: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-3 rounded-xl text-base font-extrabold text-on-surface focus:outline-none"
                  placeholder="e.g. Speak With Confidence. Go Further."
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Subheading Narrative</label>
                <textarea
                  rows={3}
                  value={hero.subheading || ""}
                  onChange={(e) => setHero({ ...hero, subheading: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant p-4 rounded-xl text-sm text-on-surface leading-relaxed focus:outline-none resize-none"
                  placeholder="Supporting value proposition paragraph..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Primary Button Label</label>
                <input
                  type="text"
                  value={hero.primaryCtaLabel || ""}
                  onChange={(e) => setHero({ ...hero, primaryCtaLabel: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm text-on-surface focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Primary Button URL</label>
                <input
                  type="text"
                  value={hero.primaryCtaUrl || ""}
                  onChange={(e) => setHero({ ...hero, primaryCtaUrl: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm font-mono text-on-surface focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Secondary Button Label</label>
                <input
                  type="text"
                  value={hero.secondaryCtaLabel || ""}
                  onChange={(e) => setHero({ ...hero, secondaryCtaLabel: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm text-on-surface focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Secondary Button URL</label>
                <input
                  type="text"
                  value={hero.secondaryCtaUrl || ""}
                  onChange={(e) => setHero({ ...hero, secondaryCtaUrl: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm font-mono text-on-surface focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <DualImageInput
                  label="Hero Media Banner"
                  value={hero.image || ""}
                  onChange={(url) => setHero({ ...hero, image: url })}
                  helpText="Upload a hero image from device or paste an image link."
                  placeholder="https://images.unsplash.com/... or https://..."
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. PILLARS SECTION CMS */}
        {activeTab === "pillars" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="border-b border-outline-variant pb-3">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">view_column</span>
                <span>The 4 Pedagogical Pillars</span>
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Trust highlights displayed directly beneath the hero.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((p, i) => (
                <div key={i} className="bg-surface-container-low p-5 rounded-xl border border-outline-variant flex flex-col gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Pillar 0{i + 1}
                  </span>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Pillar Title</label>
                    <input
                      type="text"
                      value={p.title || ""}
                      onChange={(e) => handlePillarChange(i, "title", e.target.value)}
                      className="bg-surface-container-lowest border border-outline-variant px-3 py-2 rounded-lg text-sm font-bold text-on-surface focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Pillar Description</label>
                    <textarea
                      rows={2}
                      value={p.description || ""}
                      onChange={(e) => handlePillarChange(i, "description", e.target.value)}
                      className="bg-surface-container-lowest border border-outline-variant p-3 rounded-lg text-xs text-on-surface leading-relaxed focus:outline-none resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2B. IMPACT COUNTERS / ANIMATED STATS CMS */}
        {activeTab === "stats" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
              <div>
                <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[22px]">analytics</span>
                  <span>Animated Impact Counters</span>
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Control animated milestone counters, labels, supporting details, icons, and visibility on the homepage.
                </p>
              </div>

              <label className="inline-flex items-center gap-2.5 bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-xs font-bold text-on-surface cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={stats.enabled !== false}
                  onChange={(e) => setStats({ ...stats, enabled: e.target.checked })}
                  className="w-4 h-4 text-secondary rounded cursor-pointer"
                />
                <span>Show Section on Homepage</span>
              </label>
            </div>

            {/* Section Header Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Eyebrow Badge</label>
                <input
                  type="text"
                  value={stats.badge || ""}
                  onChange={(e) => setStats({ ...stats, badge: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2.5 rounded-xl text-sm font-semibold text-on-surface focus:outline-none"
                  placeholder="OUR MILESTONES"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Section Heading</label>
                <input
                  type="text"
                  value={stats.heading || ""}
                  onChange={(e) => setStats({ ...stats, heading: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2.5 rounded-xl text-sm font-bold text-on-surface focus:outline-none"
                  placeholder="Proven Results That Speak For Themselves"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Section Subheading</label>
                <textarea
                  rows={2}
                  value={stats.subheading || ""}
                  onChange={(e) => setStats({ ...stats, subheading: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant p-3.5 rounded-xl text-sm text-on-surface leading-relaxed focus:outline-none resize-none"
                  placeholder="Short overview above the milestone cards..."
                />
              </div>
            </div>

            {/* Stat Cards List Editor */}
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/60">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Milestone Cards ({stats.items.length})</h3>
                <p className="text-[11px] text-on-surface-variant">
                  Supports formats like <span className="font-mono">370+</span>, <span className="font-mono">95%</span>, <span className="font-mono">1,200+</span>, or <span className="font-mono">4.9★</span>.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddStat}
                className="inline-flex items-center gap-1.5 bg-secondary text-on-secondary px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-on-secondary-container transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add Counter</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {stats.items.map((item, idx) => {
                const parsed = parseCounterValue(item.value);
                return (
                  <div
                    key={idx}
                    className="bg-surface-container-low p-5 rounded-xl border border-outline-variant flex flex-col gap-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                          <span className="material-symbols-outlined text-[18px]">
                            {item.icon || "verified"}
                          </span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                          Counter 0{idx + 1}
                        </span>
                        {parsed.isNumeric && (
                          <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            Counts 0 → {parsed.raw}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveStat(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 rounded-md text-on-surface-variant hover:text-primary disabled:opacity-30"
                          title="Move Left / Up"
                        >
                          <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveStat(idx, 1)}
                          disabled={idx === stats.items.length - 1}
                          className="p-1 rounded-md text-on-surface-variant hover:text-primary disabled:opacity-30"
                          title="Move Right / Down"
                        >
                          <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveStat(idx)}
                          disabled={stats.items.length <= 1}
                          className="p-1 rounded-md text-red-600 hover:bg-red-500/10 disabled:opacity-30"
                          title="Delete Counter"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                          Counter Value *
                        </label>
                        <input
                          type="text"
                          value={item.value || ""}
                          onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                          placeholder="370+"
                          className="bg-surface-container-lowest border border-outline-variant px-3 py-2 rounded-lg text-sm font-extrabold text-on-surface focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                          Title / Label *
                        </label>
                        <input
                          type="text"
                          value={item.label || ""}
                          onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                          placeholder="Students Trained"
                          className="bg-surface-container-lowest border border-outline-variant px-3 py-2 rounded-lg text-sm font-bold text-on-surface focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                          Icon (Material Symbol)
                        </label>
                        <input
                          type="text"
                          value={item.icon || ""}
                          onChange={(e) => handleStatChange(idx, "icon", e.target.value)}
                          placeholder="groups"
                          className="bg-surface-container-lowest border border-outline-variant px-3 py-2 rounded-lg text-xs font-mono text-on-surface focus:outline-none"
                        />
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {["groups", "psychology", "workspace_premium", "trending_up", "school", "verified"].map(
                            (preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => handleStatChange(idx, "icon", preset)}
                                className={`p-1 rounded border text-[14px] transition-colors ${
                                  item.icon === preset
                                    ? "bg-secondary text-on-secondary border-secondary"
                                    : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/70 hover:text-on-surface"
                                }`}
                                title={preset}
                              >
                                <span className="material-symbols-outlined text-[15px]">{preset}</span>
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                          Accent Theme
                        </label>
                        <select
                          value={item.accent || "amber"}
                          onChange={(e) => handleStatChange(idx, "accent", e.target.value)}
                          className="bg-surface-container-lowest border border-outline-variant px-3 py-2 rounded-lg text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
                        >
                          <option value="amber">Amber Gold</option>
                          <option value="blue">Royal Blue</option>
                          <option value="emerald">Emerald Green</option>
                          <option value="indigo">Indigo Violet</option>
                          <option value="rose">Crimson Rose</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                        Supporting Detail Description
                      </label>
                      <textarea
                        rows={2}
                        value={item.detail || ""}
                        onChange={(e) => handleStatChange(idx, "detail", e.target.value)}
                        placeholder="Short detail explaining this milestone..."
                        className="bg-surface-container-lowest border border-outline-variant p-3 rounded-lg text-xs text-on-surface leading-relaxed focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Animation Preview */}
            <div className="border border-outline-variant rounded-2xl overflow-hidden bg-surface">
              <div className="flex items-center justify-between px-4 py-3 bg-surface-container border-b border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">play_circle</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface">
                    Live Animated Preview
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewReplayKey((k) => k + 1)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant text-xs font-bold text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">replay</span>
                  <span>Replay Count Animation</span>
                </button>
              </div>
              {stats.enabled === false ? (
                <div className="p-8 text-center text-xs font-semibold text-on-surface-variant">
                  Section is currently hidden on the homepage. Enable the toggle above to render it live.
                </div>
              ) : (
                <StatsSection content={stats} replayKey={previewReplayKey} />
              )}
            </div>
          </div>
        )}

        {/* 3. ABOUT PREVIEW CMS */}
        {activeTab === "about" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="border-b border-outline-variant pb-3">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">auto_stories</span>
                <span>About Elite Vertex Preview</span>
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Section highlighting pedagogical methodology and confidence building.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Framework Badge Label</label>
                <input
                  type="text"
                  value={aboutPreview.label || ""}
                  onChange={(e) => setAboutPreview({ ...aboutPreview, label: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm font-semibold text-on-surface focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Section Heading</label>
                <input
                  type="text"
                  value={aboutPreview.heading || ""}
                  onChange={(e) => setAboutPreview({ ...aboutPreview, heading: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2.5 rounded-xl text-base font-bold text-on-surface focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Paragraph 1 (The Problem with Traditional Rote Learning)</label>
                <textarea
                  rows={3}
                  value={aboutPreview.paragraph1 || ""}
                  onChange={(e) => setAboutPreview({ ...aboutPreview, paragraph1: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant p-4 rounded-xl text-sm text-on-surface leading-relaxed focus:outline-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Paragraph 2 (The Elite Vertex Solution)</label>
                <textarea
                  rows={3}
                  value={aboutPreview.paragraph2 || ""}
                  onChange={(e) => setAboutPreview({ ...aboutPreview, paragraph2: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant p-4 rounded-xl text-sm text-on-surface leading-relaxed focus:outline-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Link Label</label>
                <input
                  type="text"
                  value={aboutPreview.linkLabel || ""}
                  onChange={(e) => setAboutPreview({ ...aboutPreview, linkLabel: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm text-on-surface focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Link URL</label>
                <input
                  type="text"
                  value={aboutPreview.linkUrl || ""}
                  onChange={(e) => setAboutPreview({ ...aboutPreview, linkUrl: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm font-mono text-on-surface focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <DualImageInput
                  label="Framework Showcase Image"
                  value={aboutPreview.image || ""}
                  onChange={(url) => setAboutPreview({ ...aboutPreview, image: url })}
                  helpText="Upload a classroom/methodology photo or paste an external image link."
                  placeholder="https://images.unsplash.com/... or https://..."
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. COURSES PREVIEW CMS */}
        {activeTab === "courses" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="border-b border-outline-variant pb-3">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">school</span>
                <span>Courses Preview Header</span>
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Control the heading and links above the homepage course curriculum tracks.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Track Label</label>
                <input
                  type="text"
                  value={coursesPreview.label || ""}
                  onChange={(e) => setCoursesPreview({ ...coursesPreview, label: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm font-semibold text-on-surface focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Section Heading</label>
                <input
                  type="text"
                  value={coursesPreview.heading || ""}
                  onChange={(e) => setCoursesPreview({ ...coursesPreview, heading: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2.5 rounded-xl text-base font-bold text-on-surface focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">All Courses Link Label</label>
                <input
                  type="text"
                  value={coursesPreview.linkLabel || ""}
                  onChange={(e) => setCoursesPreview({ ...coursesPreview, linkLabel: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm text-on-surface focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">All Courses Link URL</label>
                <input
                  type="text"
                  value={coursesPreview.linkUrl || ""}
                  onChange={(e) => setCoursesPreview({ ...coursesPreview, linkUrl: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm font-mono text-on-surface focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. DIAGNOSTIC & ATTESTATION CMS */}
        {activeTab === "diagnostic" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="border-b border-outline-variant pb-3">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
                <span>Diagnostic Baseline &amp; Certificate Attestation</span>
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Dual feature cards beside the homepage FAQ accordion.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Diagnostic Card */}
              <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Diagnostic Speech Assessment Card
                </span>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Card Title</label>
                  <input
                    type="text"
                    value={diagnosticFaq.diagnosticTitle || ""}
                    onChange={(e) => setDiagnosticFaq({ ...diagnosticFaq, diagnosticTitle: e.target.value })}
                    className="bg-surface-container-lowest border border-outline-variant px-3 py-2 rounded-lg text-sm font-bold text-on-surface focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Description Text</label>
                  <textarea
                    rows={3}
                    value={diagnosticFaq.diagnosticText || ""}
                    onChange={(e) => setDiagnosticFaq({ ...diagnosticFaq, diagnosticText: e.target.value })}
                    className="bg-surface-container-lowest border border-outline-variant p-3 rounded-lg text-xs text-on-surface leading-relaxed focus:outline-none resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Diagnostic Note Badge</label>
                  <input
                    type="text"
                    value={diagnosticFaq.diagnosticNote || ""}
                    onChange={(e) => setDiagnosticFaq({ ...diagnosticFaq, diagnosticNote: e.target.value })}
                    className="bg-surface-container-lowest border border-outline-variant px-3 py-2 rounded-lg text-xs font-semibold text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              {/* Certificate Verification Card */}
              <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Official Attestation Verification Card
                </span>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Card Title</label>
                  <input
                    type="text"
                    value={diagnosticFaq.certificateCardTitle || ""}
                    onChange={(e) => setDiagnosticFaq({ ...diagnosticFaq, certificateCardTitle: e.target.value })}
                    className="bg-surface-container-lowest border border-outline-variant px-3 py-2 rounded-lg text-sm font-bold text-on-surface focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Description Text</label>
                  <textarea
                    rows={3}
                    value={diagnosticFaq.certificateCardText || ""}
                    onChange={(e) => setDiagnosticFaq({ ...diagnosticFaq, certificateCardText: e.target.value })}
                    className="bg-surface-container-lowest border border-outline-variant p-3 rounded-lg text-xs text-on-surface leading-relaxed focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">CTA Label</label>
                    <input
                      type="text"
                      value={diagnosticFaq.certificateCardCta || ""}
                      onChange={(e) => setDiagnosticFaq({ ...diagnosticFaq, certificateCardCta: e.target.value })}
                      className="bg-surface-container-lowest border border-outline-variant px-3 py-2 rounded-lg text-xs text-on-surface focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">CTA Link URL</label>
                    <input
                      type="text"
                      value={diagnosticFaq.certificateCardCtaUrl || ""}
                      onChange={(e) => setDiagnosticFaq({ ...diagnosticFaq, certificateCardCtaUrl: e.target.value })}
                      className="bg-surface-container-lowest border border-outline-variant px-3 py-2 rounded-lg text-xs font-mono text-on-surface focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. ADMISSIONS CTA CMS */}
        {activeTab === "cta" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="border-b border-outline-variant pb-3">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">campaign</span>
                <span>Final Admissions Call to Action Banner</span>
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">High-conversion bottom banner driving counselling bookings.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Cohort Badge Text</label>
                <input
                  type="text"
                  value={cta.label || ""}
                  onChange={(e) => setCta({ ...cta, label: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm font-semibold text-on-surface focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Banner Headline (H2)</label>
                <input
                  type="text"
                  value={cta.heading || ""}
                  onChange={(e) => setCta({ ...cta, heading: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-3 rounded-xl text-base font-extrabold text-on-surface focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Subheading Text</label>
                <textarea
                  rows={3}
                  value={cta.subheading || ""}
                  onChange={(e) => setCta({ ...cta, subheading: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant p-4 rounded-xl text-sm text-on-surface leading-relaxed focus:outline-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Primary Button Label</label>
                <input
                  type="text"
                  value={cta.primaryCtaLabel || ""}
                  onChange={(e) => setCta({ ...cta, primaryCtaLabel: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm text-on-surface focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Primary Button URL</label>
                <input
                  type="text"
                  value={cta.primaryCtaUrl || ""}
                  onChange={(e) => setCta({ ...cta, primaryCtaUrl: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm font-mono text-on-surface focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Secondary Button Label</label>
                <input
                  type="text"
                  value={cta.secondaryCtaLabel || ""}
                  onChange={(e) => setCta({ ...cta, secondaryCtaLabel: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm text-on-surface focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Secondary Button URL</label>
                <input
                  type="text"
                  value={cta.secondaryCtaUrl || ""}
                  onChange={(e) => setCta({ ...cta, secondaryCtaUrl: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm font-mono text-on-surface focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Floating Save Bar */}
      <div className="sticky bottom-6 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-xl flex items-center justify-between gap-4 z-40">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-on-surface-variant font-medium">
          <span className="material-symbols-outlined text-secondary text-[20px]">info</span>
          <span>Click &apos;Save &amp; Publish Live&apos; to instantly push your edits to the homepage.</span>
        </div>

        <button
          type="button"
          onClick={handleSaveAndPublish}
          disabled={isSaving || isPublishing}
          className="inline-flex items-center gap-2 bg-primary hover:opacity-90 text-on-primary px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-opacity shadow-xs disabled:opacity-50 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">publish</span>
          <span>{isSaving || isPublishing ? "Publishing..." : "Save & Publish Live"}</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 bg-primary text-on-primary px-5 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5 border border-outline-variant">
          <span className="material-symbols-outlined text-[20px] text-amber-400">check_circle</span>
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
