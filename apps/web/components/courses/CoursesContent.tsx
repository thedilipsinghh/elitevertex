"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetCoursesQuery } from "@/lib/features/api/apiSlice";

type CourseCategory = "all" | "spoken" | "career" | "advanced";

const EON_VERTEX_COURSES = [
  {
    id: "pfe-1",
    title: "Pre-Foundation English (PFE)",
    category: "spoken",
    badge: "Level 1 — Absolute Beginners",
    code: "PFE-101",
    level: "Beginner",
    duration: "4 Weeks (30 Hours)",
    format: "Classroom / Online",
    shortDescription:
      "Designed for individuals who struggle with basic English word formation and sentence structuring. Overcome initial hesitation and start speaking simple sentences confidently.",
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
    title: "Foundation English (FE)",
    category: "spoken",
    badge: "Level 2 — Basic Speaker",
    code: "FE-201",
    level: "Elementary",
    duration: "6 Weeks (45 Hours)",
    format: "Classroom / Hybrid",
    shortDescription:
      "For learners who can understand basic English but face hesitation, grammar confusion, or lack of vocabulary when speaking in real-time.",
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
    title: "Elementary English (BE)",
    category: "spoken",
    badge: "Level 3 — Intermediate Fluency",
    code: "BE-301",
    level: "Pre-Intermediate",
    duration: "8 Weeks (60 Hours)",
    format: "Classroom / Online",
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
    title: "Intermediate English",
    category: "career",
    badge: "Level 4 — Career Booster",
    code: "IE-401",
    level: "Intermediate",
    duration: "8 Weeks (60 Hours)",
    format: "Campus & Hybrid",
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
    title: "Advanced English (AE) & Executive Presence",
    category: "advanced",
    badge: "Level 5 — Leadership Track",
    code: "AE-501",
    level: "Advanced",
    duration: "10 Weeks (75 Hours)",
    format: "Executive Campus / Hybrid",
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

export function CoursesContent() {
  const [activeCategory, setActiveCategory] = useState<CourseCategory>("all");
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>("pfe-1");
  const [showToast, setShowToast] = useState(false);

  const { data: response, isLoading } = useGetCoursesQuery({});
  const apiCourses = response?.data || [];

  // Use API courses if available and populated, else fallback to EON_VERTEX_COURSES
  const courses = apiCourses.length > 0 ? apiCourses : EON_VERTEX_COURSES;

  const handleDownload = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const toggleAccordion = (id: string) => {
    setExpandedCourseId(expandedCourseId === id ? null : id);
  };

  const getTabClass = (category: CourseCategory) => {
    if (activeCategory === category) {
      return "bg-primary text-on-primary font-semibold shadow-sm";
    }
    return "bg-surface-container hover:bg-surface-container-high text-on-surface font-medium";
  };

  const filteredCourses =
    activeCategory === "all"
      ? courses
      : courses.filter((c: any) => c.category === activeCategory);

  if (isLoading && courses.length === 0) {
    return (
      <div className="w-full flex flex-col gap-8 py-16 max-w-[1280px] mx-auto px-4 animate-pulse">
        <div className="h-[360px] w-full bg-surface-container rounded-2xl"></div>
        <div className="h-48 w-full bg-surface-container rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pt-16 md:pt-20">
      {/* 1. Header Banner */}
      <section className="w-full bg-surface-container-low py-space-xl md:py-space-2xl border-b border-outline-variant/10">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="flex flex-col max-w-3xl">
            <div className="flex items-center gap-space-xs mb-space-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-semibold">
                Comprehensive Spoken English &amp; Skill Modules
              </span>
            </div>
            <h1 className="font-display text-headline-lg md:text-display text-on-surface tracking-tight leading-tight mb-space-xs">
              Structured English Programs for Every Skill Level.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              From absolute foundational grammar (PFE) to executive podium leadership (AE), explore our accredited, step-by-step spoken English modules.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Category Navigation Bar */}
      <section className="w-full bg-surface border-b border-outline-variant/10 sticky top-16 md:top-20 z-40 backdrop-blur-md bg-surface/95">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-xs">
          <div className="flex flex-wrap items-center gap-space-2xs">
            <button
              className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md uppercase tracking-wider transition-all ${getTabClass("all")}`}
              onClick={() => setActiveCategory("all")}
            >
              All Modules ({courses.length})
            </button>
            <button
              className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md uppercase tracking-wider transition-all ${getTabClass("spoken")}`}
              onClick={() => setActiveCategory("spoken")}
            >
              Foundational Tracks (PFE / FE / BE)
            </button>
            <button
              className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md uppercase tracking-wider transition-all ${getTabClass("career")}`}
              onClick={() => setActiveCategory("career")}
            >
              Intermediate &amp; Career
            </button>
            <button
              className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md uppercase tracking-wider transition-all ${getTabClass("advanced")}`}
              onClick={() => setActiveCategory("advanced")}
            >
              Advanced &amp; Executive (AE)
            </button>
          </div>
        </div>
      </section>

      {/* 3. Detailed Course List & Modules */}
      <section className="w-full bg-surface py-space-xl md:py-space-2xl">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="flex flex-col gap-space-md">
            {filteredCourses.map((course: any, idx: number) => {
              const isExpanded = expandedCourseId === course.id;
              return (
                <div
                  key={course.id}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Course Item Header */}
                  <div
                    onClick={() => toggleAccordion(course.id)}
                    className="p-space-md md:p-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md cursor-pointer select-none bg-surface-container-lowest hover:bg-surface-container-low/50 transition-colors"
                  >
                    <div className="flex-1 flex flex-col">
                      <div className="flex flex-wrap items-center gap-space-2xs mb-space-3xs">
                        <span className="px-space-xs py-0.5 bg-secondary/15 text-secondary font-label-sm text-label-sm font-bold uppercase rounded">
                          {course.badge || `Level ${idx + 1}`}
                        </span>
                        {course.code && (
                          <span className="font-mono text-label-sm text-on-surface-variant font-medium">
                            [{course.code}]
                          </span>
                        )}
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                          {course.level}
                        </span>
                      </div>
                      <h2 className="font-headline-md text-headline-sm md:text-headline-md text-on-surface font-semibold">
                        {course.title}
                      </h2>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-space-3xs leading-relaxed max-w-3xl">
                        {course.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-space-md shrink-0 border-t md:border-t-0 border-outline-variant/10 pt-space-xs md:pt-0">
                      <div className="flex flex-col text-left md:text-right">
                        <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">Duration</span>
                        <span className="font-body-md text-body-md font-semibold text-on-surface">
                          {course.duration}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface transition-transform duration-200"
                        aria-label="Toggle Module Syllabus"
                      >
                        <span className="material-symbols-outlined text-[24px]">
                          {isExpanded ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Syllabus Modules */}
                  {isExpanded && (
                    <div className="border-t border-outline-variant/15 bg-surface-container-low/40 p-space-md md:p-space-lg animate-in fade-in duration-200">
                      <div className="flex flex-col gap-space-md">
                        <div className="flex items-center justify-between">
                          <h3 className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">
                            Curriculum &amp; Key Learning Modules
                          </h3>
                          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                            Format: {course.format || "Campus & Online"}
                          </span>
                        </div>

                        {course.modules && course.modules.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xs">
                            {course.modules.map((moduleItem: string, mIdx: number) => (
                              <div
                                key={mIdx}
                                className="flex items-start gap-space-xs bg-surface-container-lowest p-space-xs md:p-space-sm rounded-lg border border-outline-variant/10"
                              >
                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                  {mIdx + 1}
                                </span>
                                <span className="font-body-sm text-body-sm text-on-surface font-medium leading-snug">
                                  {moduleItem}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Interactive practical drills, speech audio labs, roleplays, and formal presentation rubrics.
                          </p>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs border-t border-outline-variant/10 mt-space-xs">
                          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
                            <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                            <span>Includes Certificate of Qualification &amp; Performance Scorecard</span>
                          </div>
                          <div className="flex items-center gap-space-xs">
                            <button
                              type="button"
                              onClick={handleDownload}
                              className="inline-flex items-center gap-space-3xs font-label-md text-label-md uppercase tracking-wider text-on-surface hover:text-secondary px-space-sm py-space-2xs rounded-md border border-outline-variant/30 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[16px]">download</span>
                              <span>Module PDF</span>
                            </button>
                            <Link
                              href="/book-counselling"
                              className="inline-flex items-center justify-center bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md uppercase tracking-wider px-space-md py-space-2xs rounded-md transition-colors font-semibold shadow-sm"
                            >
                              Enquire for Batch
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Diagnostic Assessment & Counselling CTA */}
      <section className="w-full bg-surface-container-high py-space-2xl border-t border-outline-variant/10">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="bg-primary text-on-primary rounded-2xl p-space-lg md:p-space-xl flex flex-col lg:flex-row items-center justify-between gap-space-lg shadow-lg">
            <div className="flex flex-col max-w-2xl">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold mb-space-3xs">
                Free Level Diagnostic
              </span>
              <h3 className="font-headline-lg text-headline-md md:text-headline-lg text-on-primary tracking-tight">
                Not sure which level (PFE to AE) fits your needs?
              </h3>
              <p className="font-body-md text-body-md text-on-primary/80 mt-space-2xs leading-relaxed">
                Take our 15-minute diagnostic speech assessment with our expert language mentors to map out your personalized learning trajectory.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-space-sm shrink-0 w-full lg:w-auto">
              <Link
                className="w-full sm:w-auto inline-flex items-center justify-center bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md uppercase tracking-wider px-space-lg py-space-xs rounded-lg transition-colors font-semibold shadow"
                href="/book-counselling"
              >
                Book Free Level Diagnostic
              </Link>
              <a
                className="w-full sm:w-auto inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-on-primary font-label-md text-label-md uppercase tracking-wider px-space-md py-space-xs rounded-lg transition-colors font-semibold border border-white/20"
                href="tel:+919011099770"
              >
                Call +91 9011099770
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Download Toast Feedback */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-primary text-on-primary px-space-md py-space-xs rounded-xl shadow-2xl z-50 flex items-center gap-space-xs animate-in fade-in slide-in-from-bottom-5 border border-white/20">
          <span className="material-symbols-outlined text-[22px] text-secondary">check_circle</span>
          <span className="font-body-sm text-body-sm font-medium">Syllabus Module PDF dispatched.</span>
        </div>
      )}
    </div>
  );
}
