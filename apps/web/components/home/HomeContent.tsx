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

  return (
    <div className="flex flex-col w-full font-sans bg-background text-foreground">
      {isError && !isLoading && usingFallback && null}
      {sections.map((section, index) => (
        <SectionRenderer key={`${section.type}-${index}`} type={section.type} content={section.content || {}} />
      ))}
    </div>
  );
}
