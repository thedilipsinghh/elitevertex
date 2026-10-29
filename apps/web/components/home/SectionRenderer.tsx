"use client";

import Link from "next/link";
import { useState, useRef, useMemo } from "react";
import type { SectionContent } from "@/lib/cms/sections";
import {
  useGetFaqsQuery,
  useGetTestimonialsQuery,
  useGetGalleryQuery,
} from "@/lib/features/api/apiSlice";
import { galleryItems as fallbackGalleryItems } from "@/data/gallery";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const str = (v: unknown, fallback = ""): string =>
  typeof v === "string" && v.length > 0 ? v : fallback;

const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

// Safely duplicate array items until at least `min` elements are reached without any while loops
const duplicateToMin = <T,>(list: T[], min = 6): T[] => {
  if (!Array.isArray(list) || list.length === 0) return [];
  const times = Math.ceil(min / list.length);
  const result: T[] = [];
  for (let i = 0; i < Math.max(1, times); i++) {
    result.push(...list);
  }
  return result;
};

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80";
const DEFAULT_ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80";

interface RenderProps {
  content: SectionContent;
}

/* ------------------------------- HERO ------------------------------- */
function HeroSection({ content }: RenderProps) {
  return (
    <section className="w-full bg-surface py-space-2xl md:py-space-3xl overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          <div className="lg:col-span-6 flex flex-col items-start">
            <ScrollReveal direction="up" delay={0}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/30 text-amber-900 dark:text-amber-300 font-label-md text-label-md uppercase tracking-widest font-semibold mb-space-xs badge-shimmer">
                <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400 animate-pulse"></span>
                <span>{str(content.tagline, "Spoken English • Communication • Career Skills")}</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={80}>
              <h1 className="font-display text-display text-primary tracking-tight leading-none mb-space-md">
                {str(content.heading, "Speak With Confidence. Go Further.")}
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={160}>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-space-xl leading-relaxed">
                {str(
                  content.subheading,
                  "Build the English, communication skills, and executive confidence you need for classrooms, global careers, and everyday influence."
                )}
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={240}>
              <div className="flex flex-wrap items-center gap-space-sm w-full sm:w-auto">
                <Link
                  className="inline-flex items-center justify-center bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md uppercase tracking-wider px-space-lg py-space-xs rounded-lg transition-all duration-200 btn-press hover-lift shadow-sm"
                  href={str(content.primaryCtaUrl, "/book-counselling")}
                >
                  {str(content.primaryCtaLabel, "Book Free Counselling")}
                </Link>
                <Link
                  className="inline-flex items-center justify-center bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md uppercase tracking-wider px-space-lg py-space-xs rounded-lg border border-outline-variant/60 transition-all duration-200 btn-press hover-lift shadow-xs"
                  href={str(content.secondaryCtaUrl, "/courses")}
                >
                  {str(content.secondaryCtaLabel, "Explore Courses")}
                </Link>
              </div>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-6 w-full">
            <ScrollReveal direction="scale" delay={150}>
              <div className="relative overflow-hidden rounded-2xl bg-surface-container shadow-md hover:shadow-xl transition-all duration-500 aspect-[16/11] img-zoom-parent hover-lift">
                <img
                  alt={str(content.imageAlt, "Learners collaborating actively in executive seminar hall at Elite Vertex")}
                  className="w-full h-full object-cover"
                  src={str(content.image, DEFAULT_HERO_IMAGE)}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ PILLARS ----------------------------- */
const DEFAULT_PILLARS = [
  { label: "Pillar 01", title: "Practical Learning", description: "70% active speaking, zero passive lecturing." },
  { label: "Pillar 02", title: "Expert Trainers", description: "Cambridge-certified linguists & speech mentors." },
  { label: "Pillar 03", title: "Personal Attention", description: "Strictly capped micro-cohorts of 12 peers." },
  { label: "Pillar 04", title: "Career-Focused", description: "Interview panels, GD mastery, and boardroom articulation." },
];

function PillarsSection({ content }: RenderProps) {
  const items = arr<{ label?: string; title?: string; description?: string }>(content.items);
  const pillars = items.length ? items : DEFAULT_PILLARS;
  return (
    <section className="w-full bg-surface-container-lowest py-space-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-lg">
          {pillars.map((p, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 80}>
              <div className="flex flex-col p-4 rounded-xl hover:bg-surface-container-low transition-all duration-300 hover:-translate-y-1">
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-space-3xs font-bold">
                  {str(p.label, `Pillar ${String(i + 1).padStart(2, "0")}`)}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary">{str(p.title)}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-3xs leading-relaxed">{str(p.description)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- ABOUT PREVIEW -------------------------- */
function AboutPreviewSection({ content }: RenderProps) {
  return (
    <section className="w-full bg-surface py-space-3xl overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <ScrollReveal direction="scale" delay={80}>
              <div className="rounded-2xl overflow-hidden bg-surface-container aspect-[4/5] img-zoom-parent hover-lift shadow-md">
                <img
                  alt={str(content.imageAlt, "Academic mentor guiding student presentation in modern learning acoustic pod")}
                  className="w-full h-full object-cover"
                  src={str(content.image, DEFAULT_ABOUT_IMAGE)}
                />
              </div>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col">
            <ScrollReveal direction="up" delay={50}>
              <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold mb-space-2xs">
                {str(content.label, "Pedagogical Framework")}
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-space-md">
                {str(content.heading, "More Than English. We Build Confidence.")}
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={150}>
              <div className="flex flex-col gap-space-sm font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed mb-space-lg">
                <p>
                  {str(
                    content.paragraph1,
                    "Traditional language teaching isolates students inside grammar rules and rote drills. True oratory fluency requires psychological comfort, systematic desensitization to scrutiny, and immediate real-time feedback loops."
                  )}
                </p>
                <p>
                  {str(
                    content.paragraph2,
                    "At Elite Vertex, every participant receives continuous spoken runtime. We deconstruct anxiety, rebuild phonetics, and condition the posture of authority so your internal intellect translates effortlessly outward."
                  )}
                </p>
              </div>
              <div>
                <Link
                  className="inline-flex items-center gap-space-2xs font-label-md text-label-md uppercase tracking-wider text-secondary hover:text-on-secondary-container transition-all group font-bold"
                  href={str(content.linkUrl, "/about")}
                >
                  <span>{str(content.linkLabel, "Discover Elite Vertex")}</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform duration-200">arrow_forward</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- COURSES PREVIEW ------------------------- */
const DEFAULT_COURSES: { title: string; description: string; meta: string; image: string; url?: string; badge?: string }[] = [
  {
    title: "Pre-Foundation & Foundation English",
    description: "Phonetics, word formation, active verbal sparring, sentence syntax, and dissolution of mother tongue inhibition.",
    meta: "6 Weeks • Micro-Cohort",
    badge: "Foundational Track",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
    url: "/courses",
  },
  {
    title: "Elementary English & Daily Fluency",
    description: "Complex sentence construction, spontaneous extempore speech, idioms, and natural rhythm for social and academic dialogue.",
    meta: "8 Weeks • Classroom & Hybrid",
    badge: "Intermediate Track",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    url: "/courses",
  },
  {
    title: "Intermediate English & Career Booster",
    description: "STAR interview technique, boardroom objection handling, corporate presentations, and accent neutralization.",
    meta: "8 Weeks • Career Track",
    badge: "Professional Track",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    url: "/courses",
  },
  {
    title: "Advanced English & Executive Presence",
    description: "Persuasive keynote rhetoric, unscripted media Q&A, diplomatic boardroom influence, and executive storytelling.",
    meta: "10 Weeks • Executive Track",
    badge: "Leadership Track",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    url: "/courses",
  },
];

function CoursesPreviewSection({ content }: RenderProps) {
  const items = arr<{ title?: string; description?: string; meta?: string; image?: string; url?: string; badge?: string }>(content.items);
  const courses = items.length ? items : DEFAULT_COURSES;
  return (
    <section className="w-full bg-surface-container-low py-16 lg:py-20 border-t border-outline-variant transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-400/10 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400"></span>
                <span>{str(content.label, "Curriculum Tracks")}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight">
                {str(content.heading, "Learn Skills That Move You Forward.")}
              </h2>
            </div>
            <Link
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-secondary hover:text-on-secondary-container transition-all shrink-0 group"
              href={str(content.linkUrl, "/courses")}
            >
              <span>{str(content.linkLabel, "View All Courses")}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform duration-200">arrow_forward</span>
            </Link>
          </div>
        </ScrollReveal>

        {/* Card-based grid with img, title, description */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((c, i) => {
            const cardImg =
              c.image ||
              DEFAULT_COURSES[i % DEFAULT_COURSES.length]?.image ||
              "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80";

            return (
              <ScrollReveal key={i} direction="up" delay={i * 90}>
                <Link
                  href={str(c.url, "/courses")}
                  className="group flex flex-col h-full bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-xs hover:shadow-xl hover:border-secondary transition-all hover-lift img-zoom-parent"
                >
                  {/* Course Card Image */}
                  <div className="w-full aspect-[16/10] relative bg-surface-container overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cardImg}
                      alt={str(c.title)}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-surface-container-lowest text-on-surface border border-outline-variant shadow-2xs">
                        {str(c.badge, `Track 0${i + 1}`)}
                      </span>
                    </div>
                  </div>

                  {/* Course Card Body: Title, Description, Meta */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-on-surface group-hover:text-secondary transition-colors line-clamp-2">
                        {str(c.title)}
                      </h3>
                      <p className="text-xs sm:text-sm text-on-surface-variant font-normal leading-relaxed line-clamp-3">
                        {str(c.description)}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between text-xs">
                      <span className="font-semibold text-on-surface-variant uppercase tracking-wider text-[11px]">
                        {str(c.meta, "Cohort Program")}
                      </span>
                      <span className="material-symbols-outlined text-secondary text-[18px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- TESTIMONIALS --------------------------- */
const DEFAULT_TESTIMONIALS = [
  {
    id: "dt-1",
    name: "Aarav Sharma",
    role: "Software Engineer at Global Tech",
    message: "The vocal diagnostics and accent neutralization lab completely redefined my confidence during client presentations!",
    rating: 5,
  },
  {
    id: "dt-2",
    name: "Priya Nair",
    role: "Product Manager at Fintech Innovators",
    message: "From stage fright to keynote presentation: Elite Vertex gave me actionable rhetoric tools that leveled up my career.",
    rating: 5,
  },
  {
    id: "dt-3",
    name: "Dr. Vikramaditya Sen",
    role: "Senior Strategy Analyst",
    message: "The STAR response drills and unscripted mock GDs directly landed me my senior leadership role.",
    rating: 5,
  },
  {
    id: "dt-4",
    name: "Meera Chawla",
    role: "VP of Operations",
    message: "I used to freeze during boardroom negotiations. Dr. Sundaram's cadence coaching gave me absolute command of the room.",
    rating: 5,
  },
];

function TestimonialsSection({ content }: RenderProps) {
  const { data: response, isLoading } = useGetTestimonialsQuery({});
  const apiTestimonials = response?.data || [];
  const list = apiTestimonials.length > 0 ? apiTestimonials : DEFAULT_TESTIMONIALS;

  const trackItems = useMemo(() => {
    return duplicateToMin(list, 6);
  }, [list]);

  return (
    <section className="w-full bg-surface-container-low py-16 lg:py-24 border-t border-outline-variant overflow-hidden transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center mb-10">
        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-400/10 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-400/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5 shadow-2xs">
          <span className="material-symbols-outlined text-[16px]">favorite</span>
          <span>{str(content.badge, "STUDENT LOVE")}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight text-center mb-4">
          {str(content.heading, "Loved By Many Students")}
        </h2>

        <p className="text-on-surface-variant text-sm sm:text-base max-w-xl mx-auto text-center font-normal leading-relaxed">
          {str(
            content.subheading,
            "We're proud to have a community of learners who trust us to help them grow their skills and achieve their goals."
          )}
        </p>
      </div>

      {isLoading && !response ? (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={`test-skel-${i}`}
                className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between gap-6 animate-pulse"
              >
                <div>
                  <div className="w-8 h-8 rounded bg-surface-container mb-3" />
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-container rounded w-full" />
                    <div className="h-4 bg-surface-container rounded w-5/6" />
                    <div className="h-4 bg-surface-container rounded w-2/3" />
                  </div>
                </div>
                <div>
                  <div className="w-full h-px bg-outline-variant my-4" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 bg-surface-container rounded w-24" />
                      <div className="h-3 bg-surface-container rounded w-32" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : trackItems.length > 0 ? (
        /* Infinite Horizontal Marquee moving LEFT */
        <div className="w-full relative overflow-hidden py-4 marquee-group">
          {/* Soft edge fade masks */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 bg-gradient-to-r from-surface-container-low to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 bg-gradient-to-l from-surface-container-low to-transparent z-10" />

          <div className="flex w-fit">
            {/* Track 1 */}
            <div className="flex shrink-0 gap-6 pr-6 animate-marquee-left">
              {trackItems.map((item: any, idx: number) => (
                <div
                  key={`t1-${item.id || idx}-${idx}`}
                  className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between shrink-0 w-[290px] sm:w-[340px] lg:w-[360px] hover:-translate-y-1"
                >
                  <div>
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[36px] font-bold block mb-2 select-none">
                      format_quote
                    </span>
                    <p className="text-on-surface text-sm sm:text-base font-normal leading-relaxed text-left">
                      &quot;{item.message}&quot;
                    </p>
                  </div>
                  <div>
                    <div className="w-full h-px bg-outline-variant my-5"></div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          alt={item.name}
                          className="w-10 h-10 rounded-full object-cover border border-outline-variant shadow-2xs"
                          src={
                            item.avatar ||
                            item.image ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=0b132b&color=fff`
                          }
                        />
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-on-surface text-sm sm:text-base leading-tight">
                            {item.name}
                          </span>
                          <span className="text-xs text-on-surface-variant font-normal mt-0.5">
                            {item.role}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-500 text-sm gap-0.5 shrink-0 select-none">
                        {"★".repeat(item.rating || 5)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Track 2 (Seamless loop replica) */}
            <div className="flex shrink-0 gap-6 pr-6 animate-marquee-left" aria-hidden="true">
              {trackItems.map((item: any, idx: number) => (
                <div
                  key={`t2-${item.id || idx}-${idx}`}
                  className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between shrink-0 w-[290px] sm:w-[340px] lg:w-[360px] hover:-translate-y-1"
                >
                  <div>
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[36px] font-bold block mb-2 select-none">
                      format_quote
                    </span>
                    <p className="text-on-surface text-sm sm:text-base font-normal leading-relaxed text-left">
                      &quot;{item.message}&quot;
                    </p>
                  </div>
                  <div>
                    <div className="w-full h-px bg-outline-variant my-5"></div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          alt={item.name}
                          className="w-10 h-10 rounded-full object-cover border border-outline-variant shadow-2xs"
                          src={
                            item.avatar ||
                            item.image ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=0b132b&color=fff`
                          }
                        />
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-on-surface text-sm sm:text-base leading-tight">
                            {item.name}
                          </span>
                          <span className="text-xs text-on-surface-variant font-normal mt-0.5">
                            {item.role}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-500 text-sm gap-0.5 shrink-0 select-none">
                        {"★".repeat(item.rating || 5)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

/* ------------------------------ GALLERY ----------------------------- */
function GallerySection({ content }: RenderProps) {
  const { data: response, isLoading, error } = useGetGalleryQuery({});
  const apiGallery = response?.data || [];

  const baseGallery = useMemo(() => {
    if (apiGallery.length >= 4) return apiGallery;
    if (apiGallery.length > 0) {
      return [...apiGallery, ...fallbackGalleryItems];
    }
    return fallbackGalleryItems;
  }, [apiGallery]);

  const trackItems = useMemo(() => {
    return duplicateToMin(baseGallery, 6);
  }, [baseGallery]);

  return (
    <section className="w-full bg-surface-container-low/60 py-16 lg:py-24 border-t border-outline-variant overflow-hidden transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center mb-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight text-center mb-4">
          {str(content.heading, "Be A Part Of Our Thriving Community")}
        </h2>
        <p className="text-on-surface-variant text-sm sm:text-base max-w-xl mx-auto text-center font-normal leading-relaxed">
          {str(
            content.subheading,
            "Connect, share, and grow together with thousands of passionate learners across the globe."
          )}
        </p>

        {error && <p className="text-red-500 mt-2 text-sm">Failed to load gallery.</p>}
      </div>

      {isLoading && !response ? (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={`gal-skel-${i}`}
                className="aspect-[16/10] bg-surface-container rounded-2xl animate-pulse border border-outline-variant/40"
              />
            ))}
          </div>
        </div>
      ) : trackItems.length > 0 ? (
        /* Infinite Horizontal Marquee moving RIGHT (Opposite direction to Testimonials) */
        <div className="w-full relative overflow-hidden py-4 marquee-group">
          {/* Soft edge fade masks */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 bg-gradient-to-r from-surface-container-low/90 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-44 bg-gradient-to-l from-surface-container-low/90 to-transparent z-10" />

          <div className="flex w-fit">
            {/* Track 1 */}
            <div className="flex shrink-0 gap-6 pr-6 animate-marquee-right">
              {trackItems.map((item: any, idx: number) => (
                <div
                  key={`g1-${item.id || idx}-${idx}`}
                  className="relative group/card overflow-hidden rounded-2xl shadow-xs hover:shadow-xl transition-all duration-300 shrink-0 w-[280px] sm:w-[340px] lg:w-[380px] aspect-[16/10] cursor-pointer border border-outline-variant hover:-translate-y-1"
                >
                  <img
                    alt={item.title}
                    src={item.image}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-6 transition-opacity">
                    {item.category && (
                      <span className="text-amber-400 text-[11px] font-extrabold uppercase tracking-wider mb-1">
                        {item.category}
                      </span>
                    )}
                    <span className="text-white font-bold text-base sm:text-lg leading-snug drop-shadow-sm">
                      {item.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Track 2 (Seamless loop replica) */}
            <div className="flex shrink-0 gap-6 pr-6 animate-marquee-right" aria-hidden="true">
              {trackItems.map((item: any, idx: number) => (
                <div
                  key={`g2-${item.id || idx}-${idx}`}
                  className="relative group/card overflow-hidden rounded-2xl shadow-xs hover:shadow-xl transition-all duration-300 shrink-0 w-[280px] sm:w-[340px] lg:w-[380px] aspect-[16/10] cursor-pointer border border-outline-variant hover:-translate-y-1"
                >
                  <img
                    alt={item.title}
                    src={item.image}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-6 transition-opacity">
                    {item.category && (
                      <span className="text-amber-400 text-[11px] font-extrabold uppercase tracking-wider mb-1">
                        {item.category}
                      </span>
                    )}
                    <span className="text-white font-bold text-base sm:text-lg leading-snug drop-shadow-sm">
                      {item.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

/* -------------------------- CERTIFICATE / FAQ ----------------------- */
function CertificateFaqSection({ content }: RenderProps) {
  const [openFaqId, setOpenFaqId] = useState<string | number | null>(null);
  const { data: response } = useGetFaqsQuery({});
  const faqsList = response?.data || [];

  return (
    <section className="w-full bg-surface py-16 lg:py-24 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <ScrollReveal direction="up" delay={50}>
              <div className="bg-surface-container-lowest p-6 sm:p-7 rounded-2xl border border-outline-variant shadow-xs flex items-center justify-between gap-4 hover-lift">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0 shadow-2xs">
                    <span className="material-symbols-outlined text-[22px]">verified</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-on-surface">
                      {str(content.certificateCardTitle, "Official Attestation")}
                    </h4>
                    <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                      {str(content.certificateCardText, "Verify any alumni completion credential or serial number online.")}
                    </p>
                  </div>
                </div>
                <Link
                  className="shrink-0 font-semibold text-xs uppercase tracking-wider bg-surface-container hover:bg-surface-container-high text-on-surface px-4 py-2 rounded-xl border border-outline-variant transition-all btn-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                  href={str(content.certificateCardCtaUrl, "/verify-certificate")}
                >
                  {str(content.certificateCardCta, "Verify")}
                </Link>
              </div>
            </ScrollReveal>

            {/* Diagnostic Solid Card (Theme-safe with high contrast) */}
            <ScrollReveal direction="up" delay={150}>
              <div className="bg-[#0B132B] dark:bg-[#111C33] text-white p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-sm flex flex-col gap-3 hover-lift">
                <div className="flex items-center gap-2 text-amber-400">
                  <span className="material-symbols-outlined text-[20px]">record_voice_over</span>
                  <span className="text-xs uppercase tracking-widest font-bold">
                    {str(content.diagnosticLabel, "Speech Diagnostic")}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  {str(content.diagnosticTitle, "Complimentary Speech Baseline Assessment")}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {str(content.diagnosticText, "Evaluate your spoken clarity, pause cadence, and acoustic confidence with our senior academic linguists.")}
                </p>
                <div className="flex items-center gap-2 pt-1 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>{str(content.diagnosticNote, "No obligation required")}</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-6 bg-surface-container-lowest p-6 sm:p-7 rounded-2xl border border-outline-variant shadow-xs flex flex-col justify-between">
            <ScrollReveal direction="up" delay={100}>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
                      {str(content.faqLabel, "Clarifications")}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-on-surface">
                      {str(content.faqTitle, "Common Inquiries")}
                    </h3>
                  </div>
                  <Link
                    className="text-xs font-bold uppercase tracking-wider text-secondary hover:underline transition-colors flex items-center gap-1 group"
                    href={str(content.faqLinkUrl, "/faq")}
                  >
                    <span>{str(content.faqLinkLabel, "View All FAQ")}</span>
                    <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {faqsList.map((item: any) => (
                    <div
                      key={item.id}
                      className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/60 transition-all cursor-pointer hover:border-outline"
                      onClick={() => setOpenFaqId(openFaqId === item.id ? null : item.id)}
                    >
                      <div className="flex items-center justify-between select-none">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-on-surface">{item.question}</h4>
                        <span className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-300 ${openFaqId === item.id ? "rotate-180" : ""}`}>expand_more</span>
                      </div>
                      <div
                        className={`grid transition-all duration-300 ease-out ${
                          openFaqId === item.id ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden text-sm text-on-surface-variant leading-relaxed">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- CTA -------------------------------- */
function CtaSection({ content }: RenderProps) {
  const headingText = str(content.heading, "Your Next Opportunity Starts With Better Communication.");

  return (
    <section className="relative w-full bg-surface-container-low text-on-surface py-16 sm:py-24 border-t border-outline-variant transition-colors duration-200 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            
            {/* Cohort Status Badge with live pulsing beacon */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/30 text-amber-900 dark:text-amber-300 text-xs font-bold tracking-widest uppercase mb-5 shadow-2xs badge-shimmer">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600 dark:bg-amber-400"></span>
              </span>
              <span>{str(content.label, "Admissions Open For Next Cohort")}</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-5 leading-tight uppercase">
              {headingText}
            </h2>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mb-8 leading-relaxed font-normal">
              {str(
                content.subheading,
                "Schedule an in-person or virtual speech evaluation with our academic directors. Discover your baseline fluency score and receive a personalized curriculum path."
              )}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:opacity-95 text-on-primary font-bold text-sm sm:text-base uppercase tracking-wider px-8 py-4 rounded-xl shadow-md transition-all btn-press hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                href={str(content.primaryCtaUrl, "/book-counselling")}
              >
                <span className="material-symbols-outlined text-[20px]">
                  calendar_month
                </span>
                <span>{str(content.primaryCtaLabel, "Book Free Counselling")}</span>
              </Link>

              <Link
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-container-lowest hover:bg-surface-container text-on-surface font-bold text-sm sm:text-base uppercase tracking-wider px-8 py-4 rounded-xl border border-outline-variant transition-all shadow-xs btn-press hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                href={str(content.secondaryCtaUrl, "/contact")}
              >
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                  location_on
                </span>
                <span>{str(content.secondaryCtaLabel, "Visit Campus")}</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="mt-12 pt-8 border-t border-outline-variant w-full max-w-2xl flex flex-wrap items-center justify-center gap-y-3 gap-x-6 sm:gap-x-8 text-xs sm:text-sm text-on-surface-variant font-medium">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[18px]">verified</span>
                <span>Free 30-Min Diagnostic</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[18px]">group</span>
                <span>Micro-Cohorts (12 Peers)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[18px]">school</span>
                <span>Cambridge-Certified Mentors</span>
              </div>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ---------------------------- FALLBACK ------------------------------ */
function UnknownSection({ content }: RenderProps) {
  return (
    <section className="w-full bg-surface py-space-2xl">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
        <pre className="bg-surface-container p-space-md rounded-lg text-body-sm text-on-surface-variant overflow-x-auto">
          {JSON.stringify(content, null, 2)}
        </pre>
      </div>
    </section>
  );
}

export const SECTION_RENDERERS: Record<string, (props: RenderProps) => React.ReactElement> = {
  hero: HeroSection,
  pillars: PillarsSection,
  about_preview: AboutPreviewSection,
  courses_preview: CoursesPreviewSection,
  testimonials: TestimonialsSection,
  gallery: GallerySection,
  certificate_faq: CertificateFaqSection,
  cta: CtaSection,
};

export function SectionRenderer({ type, content }: { type: string; content: SectionContent }) {
  const Component = SECTION_RENDERERS[type] || UnknownSection;
  return <Component content={content} />;
}
