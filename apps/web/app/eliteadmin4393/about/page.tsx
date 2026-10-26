"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useGetAdminAboutQuery, useUpdateAboutMutation } from "@/lib/features/api/apiSlice";
import DualImageInput from "@/components/admin/DualImageInput";

interface WhyUsItem {
  icon: string;
  title: string;
  description: string;
}

interface FacilityItem {
  icon: string;
  title: string;
  description: string;
}

const DEFAULT_WHY_US: WhyUsItem[] = [
  { icon: "school", title: "Practical Learning", description: "Learn by doing with hands-on speech drills & live practice." },
  { icon: "record_voice_over", title: "Roleplay Training", description: "Real-world workplace simulations & public stage practice." },
  { icon: "group", title: "Expert Mentors", description: "Learn from experienced speech coaches & linguists." },
  { icon: "groups", title: "Small Batches", description: "Personalized attention and individual vocal diagnostic feedback." },
  { icon: "verified", title: "Verifiable Certificate", description: "Get an ISO 9001:2015 accredited certificate for career growth." },
  { icon: "work", title: "Career Support", description: "Interview preparation, presentation skills, & placement guidance." },
];

const DEFAULT_FACILITIES: FacilityItem[] = [
  { icon: "graphic_eq", title: "Acoustic Pods", description: "Soundproof chambers for speech recording and feedback." },
  { icon: "videocam", title: "HD Playback Labs", description: "Dual-camera video review for posture and body language." },
  { icon: "meeting_room", title: "Executive Studios", description: "Roundtable chambers configured for authentic boardroom practice." },
];

export default function AdminAboutPage() {
  const { data: response, isLoading } = useGetAdminAboutQuery({});
  const [updateAbout, { isLoading: isSaving }] = useUpdateAboutMutation();

  const [activeTab, setActiveTab] = useState<"hero" | "story" | "whyUs" | "facilities" | "cta">("hero");
  const [toastMessage, setToastMessage] = useState("");

  // Native database fields
  const [formData, setFormData] = useState({
    headerTitle: "Empowering Communicators & Future Leaders",
    headerSubtitle: "Learn more about Elite Vertex Institute, our mission, vision, and the expert mentors guiding our students towards executive confidence and oral fluency.",
    paradigmTitle: "Fluency is a physical and psychological habit.",
    paradigmParagraph1: "Traditional language learning treats spoken communication as a silent written test. Classrooms drilled parsing syntax and memorizing grammar rules—leaving professionals articulate on paper, yet hesitant when speaking.",
    paradigmParagraph2: "Elite Vertex was created to change this paradigm. Fluency is not theoretical knowledge; it is vocal muscle conditioning and confidence. Under acoustic guidance, speech hesitation dissolves when students are liberated from fear of judgment.",
    airtimeStat: "70%",
    ratioStat: "1:12",
    paradigmImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
    visionTitle: "Our Vision",
    visionBody: "To be a premier communication institute that empowers individuals with practical fluency, vocal confidence, and executive presence for global career success.",
    missionTitle: "Our Mission",
    missionBody: "To deliver high-impact, practical training through expert mentors, real-world simulations, and personalized feedback to transform speakers into confident leaders.",
  });

  // Extra customizable fields (stored cleanly in paradigmParagraph3)
  const [extraData, setExtraData] = useState({
    headerBadge: "ABOUT ELITE VERTEX",
    purposeLabel: "INSTITUTIONAL PURPOSE",
    purposeTitle: "Our Vision & Mission",
    whyUsLabel: "WHY US",
    whyUsTitle: "Why Choose Elite Vertex?",
    whyUsItems: DEFAULT_WHY_US,
    storyLabel: "01 / ORIGIN & PARADIGM",
    airtimeLabel: "Acoustic Airtime Per Learner",
    ratioLabel: "Strict Cohort Ratio",
    facultyLabel: "02 / LEADERSHIP & FACULTY",
    facultyTitle: "Guided by Experienced Speech Coaches",
    facilities: DEFAULT_FACILITIES,
    ctaBadge: "DIRECT ADMISSIONS PORTAL",
    ctaTitle: "Start Your Journey With Elite Vertex.",
    ctaSubtitle: "Experience an active classroom session and receive a complimentary 20-minute speech assessment with our senior academic linguists.",
    ctaPrimaryLabel: "Book Free Counselling",
    ctaPrimaryUrl: "/book-counselling",
    ctaSecondaryLabel: "Explore Curriculum",
    ctaSecondaryUrl: "/courses",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  useEffect(() => {
    if (response?.data) {
      const d = response.data;
      setFormData({
        headerTitle: d.headerTitle || "Empowering Communicators & Future Leaders",
        headerSubtitle: d.headerSubtitle || "Learn more about Elite Vertex Institute, our mission, vision, and the expert mentors guiding our students towards executive confidence and oral fluency.",
        paradigmTitle: d.paradigmTitle || "Fluency is a physical and psychological habit.",
        paradigmParagraph1: d.paradigmParagraph1 || "Traditional language learning treats spoken communication as a silent written test. Classrooms drilled parsing syntax and memorizing grammar rules—leaving professionals articulate on paper, yet hesitant when speaking.",
        paradigmParagraph2: d.paradigmParagraph2 || "Elite Vertex was created to change this paradigm. Fluency is not theoretical knowledge; it is vocal muscle conditioning and confidence. Under acoustic guidance, speech hesitation dissolves when students are liberated from fear of judgment.",
        airtimeStat: d.airtimeStat || "70%",
        ratioStat: d.ratioStat || "1:12",
        paradigmImage: d.paradigmImage || "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
        visionTitle: d.visionTitle || "Our Vision",
        visionBody: d.visionBody || "To be a premier communication institute that empowers individuals with practical fluency, vocal confidence, and executive presence for global career success.",
        missionTitle: d.missionTitle || "Our Mission",
        missionBody: d.missionBody || "To deliver high-impact, practical training through expert mentors, real-world simulations, and personalized feedback to transform speakers into confident leaders.",
      });

      if (d.paradigmParagraph3 && typeof d.paradigmParagraph3 === "string" && d.paradigmParagraph3.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(d.paradigmParagraph3);
          setExtraData((prev) => ({
            ...prev,
            ...parsed,
            whyUsItems: parsed.whyUsItems?.length ? parsed.whyUsItems : DEFAULT_WHY_US,
            facilities: parsed.facilities?.length ? parsed.facilities : DEFAULT_FACILITIES,
          }));
        } catch {
          // ignore parsing error
        }
      }
    }
  }, [response]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExtraChange = (name: string, value: any) => {
    setExtraData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWhyUsChange = (index: number, field: keyof WhyUsItem, value: string) => {
    setExtraData((prev) => {
      const next = [...prev.whyUsItems];
      const item = next[index];
      if (item) {
        next[index] = { ...item, [field]: value };
      }
      return { ...prev, whyUsItems: next };
    });
  };

  const handleFacilityChange = (index: number, field: keyof FacilityItem, value: string) => {
    setExtraData((prev) => {
      const next = [...prev.facilities];
      const item = next[index];
      if (item) {
        next[index] = { ...item, [field]: value };
      }
      return { ...prev, facilities: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        paradigmParagraph3: JSON.stringify(extraData),
      };

      await updateAbout(payload).unwrap();
      showToast("✓ About Page content published successfully");
    } catch (err: any) {
      alert(err?.data?.message || "Failed to save About Page content.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-symbols-outlined text-4xl animate-spin text-on-surface-variant">refresh</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-16 font-sans">
      
      {/* ── Header Title & Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Institutional Narrative CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            About Page CMS
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Complete editorial control over vision, origin story, airtime metrics, 6 value pillars, facilities, and admissions banner.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/about"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>View Live</span>
          </Link>

          <Link
            href="/eliteadmin4393/mentors"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            <span>Mentors CRM</span>
          </Link>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-on-secondary-container text-on-secondary text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSaving ? "hourglass_top" : "save"}
            </span>
            <span>{isSaving ? "Publishing..." : "Save & Publish"}</span>
          </button>
        </div>
      </div>

      {/* ── Section Navigation Tabs ── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-outline-variant pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === "hero"
              ? "bg-secondary text-on-secondary shadow-2xs"
              : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">flag</span>
          <span>1. Hero &amp; Purpose</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("story")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === "story"
              ? "bg-secondary text-on-secondary shadow-2xs"
              : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">history_edu</span>
          <span>2. Origin &amp; Airtime</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("whyUs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === "whyUs"
              ? "bg-secondary text-on-secondary shadow-2xs"
              : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">verified</span>
          <span>3. 6 Value Pillars</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("facilities")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === "facilities"
              ? "bg-secondary text-on-secondary shadow-2xs"
              : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">meeting_room</span>
          <span>4. Speech Studios</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cta")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === "cta"
              ? "bg-secondary text-on-secondary shadow-2xs"
              : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">campaign</span>
          <span>5. Admissions Banner</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* ── TAB 1: HERO & PURPOSE ── */}
        {activeTab === "hero" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            {/* Hero Header */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant shadow-xs flex flex-col gap-5">
              <div className="border-b border-outline-variant pb-3">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">title</span>
                  <span>Hero Header Section</span>
                </h3>
                <p className="text-xs text-on-surface-variant">Top title and subtitle welcoming visitors to the About page.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Top Tag / Badge</label>
                  <input
                    type="text"
                    value={extraData.headerBadge}
                    onChange={(e) => handleExtraChange("headerBadge", e.target.value)}
                    className="bg-surface-container-low border border-outline-variant px-4 py-2.5 rounded-xl text-sm font-semibold text-on-surface focus:outline-none"
                    placeholder="ABOUT ELITE VERTEX"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Main Heading *</label>
                  <input
                    type="text"
                    name="headerTitle"
                    required
                    value={formData.headerTitle}
                    onChange={handleChange}
                    className="bg-surface-container-low border border-outline-variant px-4 py-2.5 rounded-xl text-base font-bold text-on-surface focus:outline-none"
                    placeholder="Empowering Communicators & Future Leaders"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Subtitle Narrative *</label>
                  <textarea
                    rows={3}
                    name="headerSubtitle"
                    required
                    value={formData.headerSubtitle}
                    onChange={handleChange}
                    className="bg-surface-container-low border border-outline-variant p-4 rounded-xl text-sm text-on-surface leading-relaxed focus:outline-none resize-none"
                    placeholder="Learn more about Elite Vertex Institute..."
                  />
                </div>
              </div>
            </div>

            {/* Vision & Mission Cards */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant shadow-xs flex flex-col gap-5">
              <div className="border-b border-outline-variant pb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">visibility</span>
                    <span>Vision &amp; Mission Statements</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant">Institutional purpose cards shown beneath the hero header.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vision Card */}
                <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Vision Card</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold uppercase text-on-surface-variant">Card Title</label>
                    <input
                      type="text"
                      name="visionTitle"
                      value={formData.visionTitle}
                      onChange={handleChange}
                      className="bg-surface-container border border-outline-variant px-3 py-2 rounded-lg text-sm font-bold text-on-surface focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold uppercase text-on-surface-variant">Body Narrative</label>
                    <textarea
                      rows={4}
                      name="visionBody"
                      value={formData.visionBody}
                      onChange={handleChange}
                      className="bg-surface-container border border-outline-variant p-3 rounded-lg text-xs leading-relaxed text-on-surface focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Mission Card */}
                <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">ads_click</span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Mission Card</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold uppercase text-on-surface-variant">Card Title</label>
                    <input
                      type="text"
                      name="missionTitle"
                      value={formData.missionTitle}
                      onChange={handleChange}
                      className="bg-surface-container border border-outline-variant px-3 py-2 rounded-lg text-sm font-bold text-on-surface focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold uppercase text-on-surface-variant">Body Narrative</label>
                    <textarea
                      rows={4}
                      name="missionBody"
                      value={formData.missionBody}
                      onChange={handleChange}
                      className="bg-surface-container border border-outline-variant p-3 rounded-lg text-xs leading-relaxed text-on-surface focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: ORIGIN & AIRTIME ── */}
        {activeTab === "story" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant shadow-xs flex flex-col gap-5">
              <div className="border-b border-outline-variant pb-3">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">history_edu</span>
                  <span>Origin &amp; Pedagogical Paradigm</span>
                </h3>
                <p className="text-xs text-on-surface-variant">Explain the methodology, speech conditioning, and psychological habit.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Section Tag</label>
                  <input
                    type="text"
                    value={extraData.storyLabel}
                    onChange={(e) => handleExtraChange("storyLabel", e.target.value)}
                    className="bg-surface-container-low border border-outline-variant px-4 py-2.5 rounded-xl text-sm font-semibold text-on-surface focus:outline-none"
                    placeholder="01 / ORIGIN & PARADIGM"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Core Headline *</label>
                  <input
                    type="text"
                    name="paradigmTitle"
                    required
                    value={formData.paradigmTitle}
                    onChange={handleChange}
                    className="bg-surface-container-low border border-outline-variant px-4 py-2.5 rounded-xl text-base font-bold text-on-surface focus:outline-none"
                    placeholder="Fluency is a physical and psychological habit."
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Story Paragraph 1 (The Challenge with Traditional Tests)</label>
                  <textarea
                    rows={3}
                    name="paradigmParagraph1"
                    value={formData.paradigmParagraph1}
                    onChange={handleChange}
                    className="bg-surface-container-low border border-outline-variant p-4 rounded-xl text-sm text-on-surface leading-relaxed focus:outline-none resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Story Paragraph 2 (The Vocal Muscle Solution)</label>
                  <textarea
                    rows={3}
                    name="paradigmParagraph2"
                    value={formData.paradigmParagraph2}
                    onChange={handleChange}
                    className="bg-surface-container-low border border-outline-variant p-4 rounded-xl text-sm text-on-surface leading-relaxed focus:outline-none resize-none"
                  />
                </div>

                {/* Key Metrics Bar */}
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Metric 1: Statistic</label>
                  <input
                    type="text"
                    name="airtimeStat"
                    value={formData.airtimeStat}
                    onChange={handleChange}
                    className="bg-surface-container border border-outline-variant px-3 py-2 rounded-lg text-lg font-extrabold text-primary focus:outline-none"
                    placeholder="70%"
                  />
                  <input
                    type="text"
                    value={extraData.airtimeLabel}
                    onChange={(e) => handleExtraChange("airtimeLabel", e.target.value)}
                    className="bg-surface-container border border-outline-variant px-3 py-1.5 rounded-lg text-xs font-medium text-on-surface-variant focus:outline-none"
                    placeholder="Acoustic Airtime Per Learner"
                  />
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Metric 2: Statistic</label>
                  <input
                    type="text"
                    name="ratioStat"
                    value={formData.ratioStat}
                    onChange={handleChange}
                    className="bg-surface-container border border-outline-variant px-3 py-2 rounded-lg text-lg font-extrabold text-secondary focus:outline-none"
                    placeholder="1:12"
                  />
                  <input
                    type="text"
                    value={extraData.ratioLabel}
                    onChange={(e) => handleExtraChange("ratioLabel", e.target.value)}
                    className="bg-surface-container border border-outline-variant px-3 py-1.5 rounded-lg text-xs font-medium text-on-surface-variant focus:outline-none"
                    placeholder="Strict Cohort Ratio"
                  />
                </div>

                {/* DualImageInput for Workshop Photo */}
                <div className="sm:col-span-2 pt-2">
                  <DualImageInput
                    label="Workshop / Classroom Showcase Media"
                    value={formData.paradigmImage}
                    onChange={(url) => setFormData((prev) => ({ ...prev, paradigmImage: url }))}
                    helpText="Upload a classroom photo from your device or paste an image URL."
                    placeholder="https://images.unsplash.com/... or https://..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: 6 VALUE PILLARS ── */}
        {activeTab === "whyUs" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant shadow-xs flex flex-col gap-5">
              <div className="border-b border-outline-variant pb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
                    <span>The 6 Institutional Value Pillars</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant">Cards shown under the &apos;Why Choose Elite Vertex?&apos; grid.</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleExtraChange("whyUsItems", DEFAULT_WHY_US)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-surface-container hover:bg-surface-container-high text-secondary border border-outline-variant transition-colors"
                >
                  Reset Defaults
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Section Label</label>
                  <input
                    type="text"
                    value={extraData.whyUsLabel}
                    onChange={(e) => handleExtraChange("whyUsLabel", e.target.value)}
                    className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm font-semibold text-on-surface focus:outline-none"
                    placeholder="WHY US"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Section Heading</label>
                  <input
                    type="text"
                    value={extraData.whyUsTitle}
                    onChange={(e) => handleExtraChange("whyUsTitle", e.target.value)}
                    className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm font-bold text-on-surface focus:outline-none"
                    placeholder="Why Choose Elite Vertex?"
                  />
                </div>
              </div>

              {/* 6 Pillars Editor Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {extraData.whyUsItems.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-secondary">
                        Pillar 0{idx + 1}
                      </span>
                      <span className="material-symbols-outlined text-secondary text-[20px]">
                        {item.icon}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">Material Symbol Icon</label>
                      <input
                        type="text"
                        value={item.icon}
                        onChange={(e) => handleWhyUsChange(idx, "icon", e.target.value)}
                        className="bg-surface-container border border-outline-variant px-2.5 py-1.5 rounded-lg text-xs font-mono text-on-surface focus:outline-none"
                        placeholder="school, work, verified, groups"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleWhyUsChange(idx, "title", e.target.value)}
                        className="bg-surface-container border border-outline-variant px-2.5 py-1.5 rounded-lg text-xs font-bold text-on-surface focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">Description</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => handleWhyUsChange(idx, "description", e.target.value)}
                        className="bg-surface-container border border-outline-variant p-2.5 rounded-lg text-xs text-on-surface leading-relaxed focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: SPEECH STUDIOS & LABS ── */}
        {activeTab === "facilities" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant shadow-xs flex flex-col gap-5">
              <div className="border-b border-outline-variant pb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">meeting_room</span>
                    <span>Speech Studios &amp; Campus Facilities</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant">Facility highlights displayed alongside faculty leadership.</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleExtraChange("facilities", DEFAULT_FACILITIES)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-surface-container hover:bg-surface-container-high text-secondary border border-outline-variant transition-colors"
                >
                  Reset Defaults
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {extraData.facilities.map((fac, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-secondary">
                        Facility 0{idx + 1}
                      </span>
                      <span className="material-symbols-outlined text-secondary text-[20px]">
                        {fac.icon}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">Icon</label>
                      <input
                        type="text"
                        value={fac.icon}
                        onChange={(e) => handleFacilityChange(idx, "icon", e.target.value)}
                        className="bg-surface-container border border-outline-variant px-2.5 py-1.5 rounded-lg text-xs font-mono text-on-surface focus:outline-none"
                        placeholder="graphic_eq, videocam, meeting_room"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">Studio Name</label>
                      <input
                        type="text"
                        value={fac.title}
                        onChange={(e) => handleFacilityChange(idx, "title", e.target.value)}
                        className="bg-surface-container border border-outline-variant px-2.5 py-1.5 rounded-lg text-xs font-bold text-on-surface focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">Description</label>
                      <textarea
                        rows={2}
                        value={fac.description}
                        onChange={(e) => handleFacilityChange(idx, "description", e.target.value)}
                        className="bg-surface-container border border-outline-variant p-2.5 rounded-lg text-xs text-on-surface leading-relaxed focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: ADMISSIONS CTA ── */}
        {activeTab === "cta" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant shadow-xs flex flex-col gap-5">
              <div className="border-b border-outline-variant pb-3">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">campaign</span>
                  <span>Admissions Banner CTA</span>
                </h3>
                <p className="text-xs text-on-surface-variant">High-conversion call to action banner displayed at the bottom of the About page.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Top Badge</label>
                  <input
                    type="text"
                    value={extraData.ctaBadge}
                    onChange={(e) => handleExtraChange("ctaBadge", e.target.value)}
                    className="bg-surface-container-low border border-outline-variant px-4 py-2.5 rounded-xl text-sm font-semibold text-on-surface focus:outline-none"
                    placeholder="DIRECT ADMISSIONS PORTAL"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Headline *</label>
                  <input
                    type="text"
                    value={extraData.ctaTitle}
                    onChange={(e) => handleExtraChange("ctaTitle", e.target.value)}
                    className="bg-surface-container-low border border-outline-variant px-4 py-2.5 rounded-xl text-base font-bold text-on-surface focus:outline-none"
                    placeholder="Start Your Journey With Elite Vertex."
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Subtitle Narrative</label>
                  <textarea
                    rows={3}
                    value={extraData.ctaSubtitle}
                    onChange={(e) => handleExtraChange("ctaSubtitle", e.target.value)}
                    className="bg-surface-container-low border border-outline-variant p-4 rounded-xl text-sm text-on-surface leading-relaxed focus:outline-none resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Primary Button Text</label>
                  <input
                    type="text"
                    value={extraData.ctaPrimaryLabel}
                    onChange={(e) => handleExtraChange("ctaPrimaryLabel", e.target.value)}
                    className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm font-semibold text-on-surface focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Primary Button URL</label>
                  <input
                    type="text"
                    value={extraData.ctaPrimaryUrl}
                    onChange={(e) => handleExtraChange("ctaPrimaryUrl", e.target.value)}
                    className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm font-mono text-on-surface focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Secondary Button Text</label>
                  <input
                    type="text"
                    value={extraData.ctaSecondaryLabel}
                    onChange={(e) => handleExtraChange("ctaSecondaryLabel", e.target.value)}
                    className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm font-semibold text-on-surface focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Secondary Button URL</label>
                  <input
                    type="text"
                    value={extraData.ctaSecondaryUrl}
                    onChange={(e) => handleExtraChange("ctaSecondaryUrl", e.target.value)}
                    className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-sm font-mono text-on-surface focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Bottom Save Action ── */}
        <div className="flex items-center justify-between border-t border-outline-variant pt-5">
          <span className="text-xs text-on-surface-variant">
            All updates instantly publish to <span className="font-mono text-secondary">/about</span>.
          </span>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-on-secondary-container text-on-secondary text-xs sm:text-sm font-bold uppercase tracking-wider px-8 py-3 rounded-xl transition-all shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSaving ? "hourglass_top" : "save"}
            </span>
            <span>{isSaving ? "Publishing Changes..." : "Save & Publish All Sections"}</span>
          </button>
        </div>

      </form>

      {/* ── Floating Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-primary text-on-primary px-5 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5 border border-outline-variant">
          <span className="material-symbols-outlined text-[20px] text-amber-400">check_circle</span>
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
