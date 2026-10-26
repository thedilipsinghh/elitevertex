"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { useLazyGetPagePreviewQuery } from "@/lib/features/api/apiSlice";
import { SectionRenderer } from "@/components/home/SectionRenderer";
import type { SectionContent } from "@/lib/cms/sections";

export default function PagePreview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [trigger, { data: response, isLoading }] = useLazyGetPagePreviewQuery();

  useEffect(() => {
    trigger(id);
  }, [id, trigger]);

  const page = response?.data;
  const sections: { type: string; content: SectionContent }[] = page?.sections || [];

  return (
    <div className="flex flex-col gap-space-md">
      <div className="bg-amber-100 border border-amber-300 text-amber-900 px-space-md py-space-sm rounded-lg flex items-center justify-between max-w-4xl mx-auto w-full">
        <span className="font-label-md">
          Previewing draft content (unpublished). Public visitors still see the last published version.
        </span>
        <Link href={`/eliteadmin4393/pages/${id}`} className="font-label-sm underline whitespace-nowrap">
          ← Back to editor
        </Link>
      </div>

      {isLoading ? (
        <p className="text-on-surface-variant max-w-4xl mx-auto w-full">Loading preview...</p>
      ) : sections.length === 0 ? (
        <p className="text-on-surface-variant max-w-4xl mx-auto w-full">This page has no visible sections yet.</p>
      ) : (
        <div className="flex flex-col w-full">
          {sections.map((section, index) => (
            <SectionRenderer key={`${section.type}-${index}`} type={section.type} content={section.content || {}} />
          ))}
        </div>
      )}
    </div>
  );
}
