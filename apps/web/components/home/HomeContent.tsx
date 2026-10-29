"use client";

import { useGetPublicPageQuery } from "@/lib/features/api/apiSlice";
import { SectionRenderer } from "./SectionRenderer";
import type { SectionContent } from "@/lib/cms/sections";

const FALLBACK_SECTIONS: { type: string; content: SectionContent }[] = [
  { type: "hero", content: {} },
  { type: "pillars", content: {} },
  { type: "about_preview", content: {} },
  { type: "courses_preview", content: {} },
  { type: "testimonials", content: {} },
  { type: "gallery", content: {} },
  { type: "certificate_faq", content: {} },
  { type: "cta", content: {} },
];

export function HomeContent() {
  const { data: response, isLoading, isError } = useGetPublicPageQuery("home");
  const page = response?.data;

  // While loading or if the CMS page is unavailable, render the built-in
  // default section layout so the public site never appears broken.
  const sections: { type: string; content: SectionContent }[] =
    page?.sections?.length ? page.sections : FALLBACK_SECTIONS;
  const usingFallback = !page?.sections?.length;

  if (isLoading && !page) {
    return (
      <div className="flex flex-col w-full font-sans bg-background text-foreground animate-pulse">
        {/* Hero Section Skeleton */}
        <section className="w-full bg-surface py-12 md:py-20 border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 flex flex-col items-start gap-4">
                <div className="h-6 w-48 bg-surface-container rounded-full" />
                <div className="h-12 w-full max-w-lg bg-surface-container-high rounded-xl" />
                <div className="h-10 w-3/4 bg-surface-container-high rounded-xl" />
                <div className="space-y-2 w-full max-w-md pt-2">
                  <div className="h-4 w-full bg-surface-container rounded" />
                  <div className="h-4 w-5/6 bg-surface-container rounded" />
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="h-11 w-44 bg-surface-container rounded-lg" />
                  <div className="h-11 w-36 bg-surface-container rounded-lg" />
                </div>
              </div>
              <div className="lg:col-span-6 w-full">
                <div className="aspect-[16/11] w-full rounded-2xl bg-surface-container border border-outline-variant/30" />
              </div>
            </div>
          </div>
        </section>

        {/* Pillars Strip Skeleton */}
        <section className="w-full bg-surface-container-lowest py-8 border-b border-outline-variant/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2 p-4">
                  <div className="h-4 w-16 bg-surface-container rounded" />
                  <div className="h-5 w-32 bg-surface-container rounded" />
                  <div className="h-3 w-full bg-surface-container rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full font-sans bg-background text-foreground">
      {isError && !isLoading && usingFallback && null}
      {sections.map((section, index) => (
        <SectionRenderer key={`${section.type}-${index}`} type={section.type} content={section.content || {}} />
      ))}
    </div>
  );
}
