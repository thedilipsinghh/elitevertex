"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetCoursesQuery } from "@/lib/features/api/apiSlice";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

type CourseCategory = "all" | "spoken" | "career" | "advanced";

interface CourseModule {
  id: string;
  slug?: string;
  title: string;
  category: string;
  badge?: string;
  code?: string;
  level?: string;
  duration?: string;
  format?: string;
  cohortCap?: string;
  shortDescription?: string;
  image?: string;
  price?: number;
  isFeatured?: boolean;
  modules?: any[];
}

const COURSE_IMAGES: Record<string, string> = {
  "flagship-comprehensive-masterclass": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
  "basic-spoken-english": "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
  "intermediate-spoken-english": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "advanced-spoken-english": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  "interview-skills": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
  "personality-development": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
  "public-speaking": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
  "business-communication": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
  "voice-accent": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
  "pfe-1": "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
  "fe-2": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
  "be-3": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "ie-4": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
  "ae-5": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
};

const DEFAULT_TRACK_IMAGES: Record<string, string> = {
  flagship: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
  spoken: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
  career: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
  advanced: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
  professional: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
};

const getCourseImage = (course: CourseModule): string => {
  const fallbackFlagship = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80";
  if (course.image && !course.image.includes("googleusercontent.com") && course.image.startsWith("http")) {
    return course.image;
  }
  if (course.slug && COURSE_IMAGES[course.slug]) {
    return COURSE_IMAGES[course.slug] ?? fallbackFlagship;
  }
  if (course.id && COURSE_IMAGES[course.id]) {
    return COURSE_IMAGES[course.id] ?? fallbackFlagship;
  }
  const cat = (course.category || "").toLowerCase();
  return DEFAULT_TRACK_IMAGES[cat] ?? fallbackFlagship;
};

const INSTITUTIONAL_COURSES: CourseModule[] = [
  {
    id: "pfe-1",
    slug: "pre-foundation-english",
    title: "Pre-Foundation English (PFE)",
    category: "spoken",
    badge: "Level 1 — Absolute Beginners",
    code: "PFE-101",
    level: "Beginner (CEFR A1)",
    duration: "4 Weeks (30 Hours)",
    format: "Classroom & Hybrid",
    cohortCap: "12 Scholars Max",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
    shortDescription:
      "Designed for individuals who struggle with basic English word formation and sentence structuring. Overcome initial hesitation, dissolve mother-tongue inhibition, and start speaking simple sentences with confidence.",
    modules: [
      "Basic Alphabetic Phonetics & Sound Production",
      "Essential Daily Sight Words & Vocabulary (500+ Words)",
      "Simple Sentence Construction & Subject-Verb Agreement",
      "Daily Life Greeting & Conversational Drills",
      "Basic Present, Past & Future Tense Usage",
      "Confidence Building & Stage Fear Removal",
    ],
  },
  {
    id: "fe-2",
    slug: "foundation-english",
    title: "Foundation English (FE)",
    category: "spoken",
    badge: "Level 2 — Basic Speaker",
    code: "FE-201",
    level: "Elementary (CEFR A2)",
    duration: "6 Weeks (45 Hours)",
    format: "Classroom & Hybrid",
    cohortCap: "12 Scholars Max",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    shortDescription:
      "For learners who can understand basic English but face hesitation, grammar confusion, or lack of vocabulary when speaking in real-time conversations.",
    modules: [
      "Comprehensive Parts of Speech & Sentence Syntax",
      "Correct Tense Formations & Verb Conjugations",
      "Mother Tongue Influence (MTI) Reduction Drills",
      "Listening Comprehension & Acoustic Mimicry",
      "Pair Sparring & Simulated Dialogue Practice",
      "Basic Telephonic & Everyday Situational English",
    ],
  },
  {
    id: "be-3",
    slug: "elementary-english",
    title: "Elementary English (BE)",
    category: "spoken",
    badge: "Level 3 — Intermediate Fluency",
    code: "BE-301",
    level: "Pre-Intermediate (CEFR B1)",
    duration: "8 Weeks (60 Hours)",
    format: "Classroom & Online",
    cohortCap: "12 Scholars Max",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    shortDescription:
      "Accelerate fluency, eliminate pauses, and master natural speech flow for informal conversations, group interactions, and academic settings.",
    modules: [
      "Complex & Compound Sentence Construction",
      "Idiomatic Expressions & Common Phrasal Verbs",
      "Extempore Speech & Jamming (Just A Minute) Sessions",
      "Group Discussion (GD) Tactics & Turn-Taking",
      "Fundamental Business Email & Written Communication",
      "Body Language, Eye Contact & Non-Verbal Cues",
    ],
  },
  {
    id: "ie-4",
    slug: "intermediate-english",
    title: "Intermediate English & Career Communication",
    category: "career",
    badge: "Level 4 — Career Booster",
    code: "IE-401",
    level: "Intermediate (CEFR B2)",
    duration: "8 Weeks (60 Hours)",
    format: "Campus & Hybrid",
    cohortCap: "12 Scholars Max",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    shortDescription:
      "Designed for job seekers, college graduates, and corporate executives aiming to excel in job interviews, professional presentations, and client meetings.",
    modules: [
      "Advanced Vocabulary & Professional Jargon",
      "Voice Accent Neutralization & Intonation",
      "Corporate Interview Preparation & STAR Techniques",
      "Presentation Delivery & Slide Pitching",
      "Professional Email Etiquette & Memo Drafting",
      "Debate, Argumentation & Logical Persuasion",
    ],
  },
  {
    id: "ae-5",
    slug: "advanced-english-executive-presence",
    title: "Advanced English (AE) & Executive Presence",
    category: "advanced",
    badge: "Level 5 — Leadership Track",
    code: "AE-501",
    level: "Advanced (CEFR C1-C2)",
    duration: "10 Weeks (75 Hours)",
    format: "Executive Campus & Hybrid",
    cohortCap: "10 Fellows Max",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    shortDescription:
      "Master high-stakes leadership communication, strategic negotiation, diplomatic speech, and executive presence for managers and business leaders.",
    modules: [
      "Persuasive Rhetoric & High-Stakes Oratory",
      "Executive Storytelling & Audience Engagement",
      "Cross-Cultural Global Communication & Protocol",
      "Crisis Communication & Unscripted Media Q&A",
      "Salary & Business Contract Negotiation Strategies",
      "Frame-by-Frame Video Feedback & Performance Rubrics",
    ],
  },
];

const getCourseModules = (course: CourseModule): string[] => {
  if (Array.isArray(course.modules) && course.modules.length > 0) {
    const list = course.modules.map((m: any) => (typeof m === "string" ? m : m.title || m.name || String(m)));
    if (list.filter(Boolean).length > 0) return list;
  }

  const titleLower = (course.title || "").toLowerCase();
  const cat = (course.category || "").toLowerCase();

  if (cat === "career" || titleLower.includes("interview") || titleLower.includes("career")) {
    return [
      "Professional Elevator Pitch & STAR Interview Technique",
      "Executive Business Vocabulary & Diplomatic Corporate Lexicon",
      "High-Impact Slides Pitching & Presentation Dynamics",
      "Boardroom Negotiation, Objection Handling & Assertive Rhetoric",
      "Cross-Cultural Global Communication & Accent Neutralization",
      "Simulated Panel Mock Interviews with Video Feedback Review",
    ];
  }

  if (cat === "advanced" || cat === "professional" || cat === "flagship" || titleLower.includes("executive") || titleLower.includes("leadership") || titleLower.includes("masterclass")) {
    return [
      "Persuasive Rhetoric & High-Stakes Podium Oratory",
      "Executive Storytelling, Vocal Modulation & Physical Gravitas",
      "Impromptu Keynote Speaking & Extempore Mastery",
      "Crisis Communication, Media Q&A & Unscripted Dialogue",
      "Boardroom Influence & Stakeholder Consensus Building",
      "Frame-by-Frame Diagnostic Video Review & Metric Scorecard",
    ];
  }

  return [
    "Foundational Grammar Scaffolding Without Rote Jargon",
    "Mother Tongue Influence (MTI) Reduction & Sound Production",
    "Essential Daily Conversational Lexicon (500+ High-Frequency Words)",
    "Active Verbal Sparring & Impromptu Extempore Drills",
    "Pronunciation, Acoustic Cadence & Pitch Modulation",
    "Everyday Situational Dialogue Practice & Stage Fear Removal",
  ];
};

export function CoursesContent() {
  const [activeCategory, setActiveCategory] = useState<CourseCategory>("all");
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const { data: response } = useGetCoursesQuery({});
  const apiCourses = response?.data || [];

  // Merge courses: use API courses if available, fallback to INSTITUTIONAL_COURSES
  const courses: CourseModule[] = apiCourses.length > 0 ? apiCourses : INSTITUTIONAL_COURSES;

  // Auto-expand first item if none is selected
  const currentExpandedId = expandedCourseId === "none" ? null : (expandedCourseId ?? courses[0]?.id ?? null);

  const handleDownload = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const toggleAccordion = (id: string) => {
    setExpandedCourseId(currentExpandedId === id ? "none" : id);
  };

  const filteredCourses = courses.filter((c) => {
    if (activeCategory === "all") return true;
    const cat = (c.category || "").toLowerCase();
    if (activeCategory === "spoken") {
      return cat === "spoken" || cat === "foundation" || c.title.toLowerCase().includes("foundation") || c.title.toLowerCase().includes("spoken");
    }
    if (activeCategory === "career") {
      return cat === "career" || c.title.toLowerCase().includes("interview") || c.title.toLowerCase().includes("career");
    }
    if (activeCategory === "advanced") {
      return cat === "advanced" || cat === "professional" || cat === "flagship" || c.title.toLowerCase().includes("executive") || c.title.toLowerCase().includes("advanced") || c.title.toLowerCase().includes("masterclass");
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full bg-surface text-on-surface min-h-screen transition-colors">
      
      {/* ── 1. Hero Banner ── */}
      <section className="w-full bg-surface-container-lowest border-b border-outline-variant py-12 md:py-20 transition-colors overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={0}>
            <div className="flex flex-col max-w-3xl gap-4">
              
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/30 text-amber-900 dark:text-amber-300 text-xs font-bold tracking-widest uppercase w-fit shadow-2xs badge-shimmer">
                <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400 animate-pulse"></span>
                <span>Comprehensive Spoken English Curriculum</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
                Structured English Programs For Every Skill Level.
              </h1>

              <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed font-normal">
                From absolute foundational grammar (PFE) to executive boardroom presence (AE) — explore our accredited, step-by-step spoken English modules with 70% active speaking time.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/book-counselling"
                  className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-on-secondary-container text-on-secondary text-xs sm:text-sm font-bold uppercase tracking-wider px-6 sm:px-7 py-3.5 rounded-xl transition-all shadow-sm btn-press hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  <span>Book Free Counselling</span>
                </Link>
                <a
                  href="tel:+918049208800"
                  className="inline-flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs sm:text-sm font-bold uppercase tracking-wider px-6 sm:px-7 py-3.5 rounded-xl transition-all border border-outline-variant shadow-xs btn-press hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>Admissions: +91 (80) 4920-8800</span>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 2. Category Navigation Bar ── */}
      <section className="w-full bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant sticky top-16 md:top-20 z-40">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${
                activeCategory === "all"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              All Programs ({courses.length})
            </button>
            <button
              onClick={() => setActiveCategory("spoken")}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${
                activeCategory === "spoken"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              Foundational Tracks (PFE / FE / BE)
            </button>
            <button
              onClick={() => setActiveCategory("career")}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${
                activeCategory === "career"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              Career &amp; Interview (IE)
            </button>
            <button
              onClick={() => setActiveCategory("advanced")}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${
                activeCategory === "advanced"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              Leadership &amp; Executive (AE)
            </button>
          </div>
        </div>
      </section>

      {/* ── 3. Course Modules List ── */}
      <section className="w-full py-12 md:py-16 bg-surface">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col gap-8">
            {filteredCourses.map((course, cIdx) => {
              const isExpanded = currentExpandedId === course.id;
              const moduleItems = getCourseModules(course);
              const courseImg = getCourseImage(course);
              const fallbackTrackImg: string =
                (course.category ? DEFAULT_TRACK_IMAGES[course.category.toLowerCase()] : undefined) ??
                DEFAULT_TRACK_IMAGES.flagship ??
                "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80";

              return (
                <ScrollReveal key={course.id} direction="up" delay={cIdx * 70}>
                  <div
                    className={`bg-surface-container-lowest rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col hover-lift ${
                      isExpanded
                        ? "border-secondary/70 ring-1 ring-secondary/20 shadow-md"
                        : "border-outline-variant shadow-xs hover:shadow-xl"
                    }`}
                  >
                  {/* Top / Main Card Content: Image + Details */}
                  <div className="flex flex-col lg:flex-row">
                    
                    {/* 1. Course Image Card Header */}
                    <div className="lg:w-[340px] xl:w-[380px] shrink-0 relative bg-surface-container overflow-hidden min-h-[220px] lg:min-h-[280px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={courseImg}
                        alt={course.title}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== fallbackTrackImg) {
                            target.src = fallbackTrackImg;
                          }
                        }}
                        className="w-full h-56 lg:h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      
                      {/* Category Badge Pill Overlay */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-surface-container-lowest/95 backdrop-blur-sm text-on-surface border border-outline-variant shadow-2xs">
                          {course.badge || `${course.category.toUpperCase()} TRACK`}
                        </span>
                      </div>

                      {course.level && (
                        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
                          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-primary/95 backdrop-blur-sm text-on-primary shadow-xs">
                            {course.level}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 2. Course Details: Title, Description, Specs & Actions */}
                    <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between gap-5">
                      <div className="flex flex-col gap-3">
                        
                        {/* Track Code & Duration Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/60 pb-2">
                          <div className="flex items-center gap-2">
                            {course.code && (
                              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant border border-outline-variant/60">
                                {course.code}
                              </span>
                            )}
                            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                              {course.category} Track
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant">
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                              {course.duration || "6–8 Weeks"}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-secondary">groups</span>
                              {course.cohortCap || "12 Scholars"}
                            </span>
                          </div>
                        </div>

                        {/* Course Title */}
                        <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-snug">
                          {course.title}
                        </h2>

                        {/* Course Short Description */}
                        <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed font-normal">
                          {course.shortDescription}
                        </p>

                        {/* Specifications Pills */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-surface-container text-on-surface border border-outline-variant/60">
                            <span className="material-symbols-outlined text-[15px] text-secondary">apartment</span>
                            {course.format || "Classroom & Hybrid"}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-surface-container text-on-surface border border-outline-variant/60">
                            <span className="material-symbols-outlined text-[15px] text-secondary">format_list_numbered</span>
                            {moduleItems.length} Curriculum Modules
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-surface-container text-on-surface border border-outline-variant/60">
                            <span className="material-symbols-outlined text-[15px] text-secondary">verified</span>
                            CEFR Accredited
                          </span>
                        </div>
                      </div>

                      {/* Card Action Buttons Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-outline-variant">
                        <button
                          type="button"
                          onClick={() => toggleAccordion(course.id)}
                          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border ${
                            isExpanded
                              ? "bg-secondary/15 hover:bg-secondary/25 text-secondary border-secondary/40 font-bold"
                              : "bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {isExpanded ? "expand_less" : "menu_book"}
                          </span>
                          <span>{isExpanded ? "Hide Curriculum Modules" : `Explore Syllabus (${moduleItems.length} Modules)`}</span>
                        </button>

                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={handleDownload}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-outline-variant transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            <span>Brochure</span>
                          </button>

                          <Link
                            href={`/book-counselling?course=${encodeURIComponent(course.title)}`}
                            className="inline-flex items-center gap-1.5 bg-secondary hover:bg-on-secondary-container text-on-secondary text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors shadow-2xs"
                          >
                            <span>Enroll in Cohort</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Expanded Syllabus Section */}
                  {isExpanded && (
                    <div className="border-t border-outline-variant bg-surface-container-low/60 p-6 sm:p-8 animate-in fade-in duration-200">
                      <div className="flex flex-col gap-6">
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-primary">
                            Curriculum &amp; Key Learning Modules
                          </h3>
                          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                            Format: {course.format || "Campus & Hybrid"} • {course.cohortCap || "Strict Cohort Ratio (1:12)"}
                          </span>
                        </div>

                        {/* Modules Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {moduleItems.map((moduleItem, mIdx) => (
                            <div
                              key={mIdx}
                              className="flex items-start gap-3 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 shadow-2xs"
                            >
                              <span className="w-6 h-6 rounded-full bg-secondary/15 text-secondary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-secondary/25">
                                {mIdx + 1}
                              </span>
                              <span className="text-sm text-on-surface font-medium leading-relaxed">
                                {moduleItem}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Action Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-outline-variant mt-2">
                          <div className="flex items-center gap-2 text-on-surface-variant text-xs sm:text-sm font-medium">
                            <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
                            <span>Includes ISO 9001:2015 Accredited Completion Diploma &amp; Audio Scorecard</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={handleDownload}
                              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface hover:text-secondary px-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                            >
                              <span className="material-symbols-outlined text-[16px]">download</span>
                              <span>Syllabus PDF</span>
                            </button>

                            <Link
                              href={`/book-counselling?course=${encodeURIComponent(course.title)}`}
                              className="inline-flex items-center justify-center gap-1.5 bg-secondary hover:bg-on-secondary-container text-on-secondary text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                            >
                              <span>Enquire for Batch</span>
                              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </Link>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
            })}
          </div>

        </div>
      </section>

      {/* ── 4. Institutional Pedagogical Pillars ── */}
      <section className="w-full bg-surface-container-low border-t border-outline-variant py-12 md:py-16 transition-colors">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col gap-2">
              <span className="material-symbols-outlined text-[30px] text-secondary">groups</span>
              <h3 className="font-bold text-on-surface text-base uppercase tracking-wide">Micro-Cohorts (12 Peers)</h3>
              <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed font-normal">
                Strict batch ceilings ensure every scholar receives continuous stage airtime and personalized phonetic guidance.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="material-symbols-outlined text-[30px] text-secondary">record_voice_over</span>
              <h3 className="font-bold text-on-surface text-base uppercase tracking-wide">70% Speaking Runtime</h3>
              <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed font-normal">
                Active speech drills, unscripted rebuttal sparring, and zero passive lecturing in lecture halls.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="material-symbols-outlined text-[30px] text-secondary">graphic_eq</span>
              <h3 className="font-bold text-on-surface text-base uppercase tracking-wide">Acoustic Audio Labs</h3>
              <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed font-normal">
                Soundproof chambers and high-fidelity video review pods for forensic cadence and posture conditioning.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="material-symbols-outlined text-[30px] text-secondary">workspace_premium</span>
              <h3 className="font-bold text-on-surface text-base uppercase tracking-wide">British Council Mentors</h3>
              <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed font-normal">
                Cambridge-certified linguists and speech coaches with over two decades of corporate leadership training.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Diagnostic CTA Banner (Solid Color, No Gradients) ── */}
      <section className="w-full bg-[#0B132B] dark:bg-[#111C33] text-white py-14 md:py-20 border-t border-slate-800 transition-colors">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            
            <div className="flex flex-col gap-3 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs uppercase tracking-widest font-bold self-center lg:self-start">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Free Speech Diagnostic Assessment</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Not sure which level (PFE to AE) fits you?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Take our complimentary 20-minute verbal diagnostic with our senior academic linguists. Receive an empirical CEFR benchmark score and personalized syllabus path.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3.5 shrink-0 w-full lg:w-auto">
              <Link
                href="/book-counselling"
                className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-on-secondary-container text-on-secondary text-sm font-bold uppercase tracking-wider px-8 py-4 rounded-xl transition-colors shadow-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              >
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                <span>Book Free Assessment</span>
              </Link>
              <a
                href="tel:+918049208800"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold uppercase tracking-wider px-8 py-4 rounded-xl transition-colors border border-white/20 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
                <span>Call Registry</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Download Toast Feedback */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-primary text-on-primary px-5 py-3.5 rounded-xl shadow-xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 border border-outline-variant">
          <span className="material-symbols-outlined text-[22px] text-amber-400">check_circle</span>
          <span className="text-xs sm:text-sm font-semibold">Curriculum Syllabus Module PDF dispatched.</span>
        </div>
      )}
    </div>
  );
}
