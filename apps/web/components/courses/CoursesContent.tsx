"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetCoursesQuery } from "@/lib/features/api/apiSlice";

type CourseCategory = "all" | "spoken" | "career" | "professional" | "flagship";

const FALLBACK_COURSES = [
  {
    id: "1",
    slug: "spoken-english-mastery",
    title: "Spoken English Mastery",
    category: "spoken",
    badge: "Foundation",
    level: "Beginner",
    shortDescription: "Foundation to executive fluency, structural grammar, accent conditioning, and daily verbal sparring.",
    duration: "8 Weeks",
    format: "In-Campus",
    sortOrder: 1,
    status: "active",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
    price: null,
    isFeatured: true,
  },
  {
    id: "2",
    slug: "interview-skills-group-discussion",
    title: "Interview Skills & Group Discussion",
    category: "career",
    badge: "Placement Prep",
    level: "Intermediate",
    shortDescription: "Behavioral frameworks (STAR method), high-pressure panel simulations, case extempore, and rapid rebuttals.",
    duration: "4 Weeks",
    format: "Cohort-Based",
    sortOrder: 2,
    status: "active",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
    price: null,
    isFeatured: false,
  },
  {
    id: "3",
    slug: "personality-development-public-speaking",
    title: "Personality Development & Public Speaking",
    category: "professional",
    badge: "Executive",
    level: "Advanced",
    shortDescription: "Stage presence, vocal diaphragmatic modulation, kinesics, physical anchoring, and emotional resonance.",
    duration: "6 Weeks",
    format: "Studio Lab",
    sortOrder: 3,
    status: "active",
    image: "https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&q=80&w=800",
    price: null,
    isFeatured: false,
  },
  {
    id: "4",
    slug: "professional-executive-communication",
    title: "Professional & Executive Communication",
    category: "professional",
    badge: "Leadership",
    level: "Advanced",
    shortDescription: "Boardroom presentations, executive brevity, persuasive corporate correspondence, and diplomatic dissent.",
    duration: "6 Weeks",
    format: "Executive Weekend",
    sortOrder: 4,
    status: "active",
    image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&q=80&w=800",
    price: null,
    isFeatured: false,
  },
];

const CATEGORY_TABS: { key: CourseCategory; label: string }[] = [
  { key: "all", label: "All Courses" },
  { key: "spoken", label: "Spoken English" },
  { key: "career", label: "Career & Interview" },
  { key: "professional", label: "Professional" },
  { key: "flagship", label: "Flagship" },
];

function formatNumber(n: number) {
  return String(n).padStart(2, "0");
}

export function CoursesContent() {
  const [activeCategory, setActiveCategory] = useState<CourseCategory>("all");

  const { data: response, isLoading } = useGetCoursesQuery({});
  const apiCourses = response?.data || [];
  const courses = apiCourses.length > 0 ? apiCourses : FALLBACK_COURSES;

  const filteredCourses =
    activeCategory === "all"
      ? courses
      : courses.filter((c: any) => c.category === activeCategory);

  return (
    <div className="flex flex-col w-full pt-16 md:pt-20 bg-[#f5f4f0] min-h-screen">

      {/* ── Hero Banner ── */}
      <section className="w-full bg-white border-b border-gray-100 py-14 md:py-20">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">
          <div className="flex flex-col max-w-3xl gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c0392b]" />
              <span className="text-xs uppercase tracking-[0.18em] font-bold text-gray-500">
                Practical · Outcome-Driven · Expert-Led
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              Programs Built for<br />
              <span className="text-[#c0392b]">Real-World Results.</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
              From foundational spoken English to executive communication — every course is structured around speaking, not memorising.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#c0392b] hover:bg-[#a93226] text-white text-sm font-bold uppercase tracking-widest px-7 py-3 rounded-lg transition-colors shadow-sm"
              >
                Book Free Counselling
              </Link>
              <a
                href="tel:+919011099770"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 text-sm font-bold uppercase tracking-widest px-7 py-3 rounded-lg transition-colors border border-gray-200 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                +91 9011099770
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky Category Filter ── */}
      <section className="w-full bg-white border-b border-gray-100 sticky top-16 md:top-20 z-40">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none" style={{ scrollbarWidth: "none" }}>
            {CATEGORY_TABS.map((tab) => {
              const count = tab.key === "all"
                ? courses.length
                : courses.filter((c: any) => c.category === tab.key).length;
              const isActive = activeCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategory(tab.key)}
                  className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-150 ${
                    isActive
                      ? "bg-gray-900 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label} {count > 0 && <span className={`ml-1 ${isActive ? "opacity-60" : "opacity-50"}`}>({count})</span>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Course Cards Grid ── */}
      <section className="w-full py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">

          {isLoading && apiCourses.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-sm">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-6 flex flex-col gap-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-full" />
                    <div className="h-4 bg-gray-100 rounded w-5/6" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <span className="material-symbols-outlined text-[56px] text-gray-300">school</span>
              <h3 className="text-xl font-bold text-gray-700">No courses in this category yet</h3>
              <p className="text-gray-400 text-sm max-w-xs">Check back soon — the admin is adding courses regularly.</p>
              <button
                onClick={() => setActiveCategory("all")}
                className="mt-2 text-sm font-bold text-[#c0392b] underline underline-offset-2"
              >
                View all courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCourses.map((course: any, idx: number) => (
                <CourseCard key={course.id} course={course} index={idx} />
              ))}
            </div>
          )}

          {/* Results count */}
          {!isLoading && filteredCourses.length > 0 && (
            <p className="text-xs text-gray-400 font-medium mt-8 text-center uppercase tracking-widest">
              Showing {filteredCourses.length} of {courses.length} programs
            </p>
          )}
        </div>
      </section>

      {/* ── Why Elite Vertex Strip ── */}
      <section className="w-full bg-white border-t border-gray-100 py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: "groups", label: "Micro-Cohorts", desc: "Max 12 learners per batch for personal attention" },
              { icon: "record_voice_over", label: "70% Speaking", desc: "Active drills, zero passive lecturing" },
              { icon: "verified", label: "Certified", desc: "Accredited completion credentials" },
              { icon: "workspace_premium", label: "Expert Trainers", desc: "Cambridge-certified linguists & mentors" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-2">
                <span className="material-symbols-outlined text-[28px] text-[#c0392b]">{item.icon}</span>
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">{item.label}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="w-full bg-gray-900 py-14 md:py-20">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex flex-col gap-3 max-w-2xl text-center lg:text-left">
              <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#c0392b]">Free Level Diagnostic</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Not sure which program fits you?
              </h2>
              <p className="text-gray-400 text-base leading-relaxed">
                Take our 15-minute diagnostic speech assessment. Our mentors will map out your exact learning path.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full lg:w-auto">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-[#c0392b] hover:bg-[#a93226] text-white text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-lg transition-colors shadow-sm whitespace-nowrap"
              >
                Book Free Assessment
              </Link>
              <a
                href="tel:+919011099770"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-lg transition-colors border border-white/10 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Individual Course Card ────────────────────────────────────────────────────
function CourseCard({ course, index }: { course: any; index: number }) {
  const num = formatNumber(index + 1);

  // Fallback image by category
  const FALLBACK_IMAGES: Record<string, string> = {
    spoken: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
    career: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
    professional: "https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&q=80&w=800",
    flagship: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&q=80&w=800",
  };
  const imageSrc = course.image || FALLBACK_IMAGES[course.category] || FALLBACK_IMAGES.spoken;

  const href = course.slug ? `/courses/${course.slug}` : "/courses";

  return (
    <Link
      href={href}
      className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer border-2 ${
        course.isFeatured ? "border-[#c0392b]" : "border-transparent hover:border-gray-200"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGES[course.category] || FALLBACK_IMAGES.spoken;
          }}
        />
        {/* Number Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm">
          {num}
        </div>
        {/* Featured Tag */}
        {course.isFeatured && (
          <div className="absolute top-4 right-4 bg-[#c0392b] text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-sm">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-3">
        {/* Badge */}
        {course.badge && (
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#c0392b]">
            {course.badge}
          </span>
        )}

        {/* Title */}
        <h2 className="font-extrabold text-gray-900 text-[1.05rem] leading-tight tracking-tight group-hover:text-[#c0392b] transition-colors">
          {course.title}
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
          {course.shortDescription}
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 mt-1" />

        {/* Duration & Format */}
        <div className="flex items-center gap-1 text-gray-500 text-xs font-bold uppercase tracking-wider">
          {course.duration && <span>{course.duration}</span>}
          {course.duration && course.format && <span className="text-gray-300">•</span>}
          {course.format && <span>{course.format}</span>}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-1.5 text-[#c0392b] text-xs font-black uppercase tracking-[0.15em] group-hover:gap-2.5 transition-all">
          SEE COURSE
          <span className="text-[16px]">↗</span>
        </div>
      </div>
    </Link>
  );
}
