"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  useGetAdminPageQuery,
  useUpdatePageMetaMutation,
  useAddSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useReorderSectionsMutation,
  usePublishPageMutation,
  useUnpublishPageMutation,
} from "@/lib/features/api/apiSlice";
import {
  SECTION_TYPES,
  emptyContentForType,
  getSectionTypeDef,
  type FieldDef,
  type SectionContent,
} from "@/lib/cms/sections";

interface SectionRow {
  id: string;
  type: string;
  title?: string | null;
  isVisible: boolean;
  sortOrder: number;
  draftContent: SectionContent | null;
  publishedContent: SectionContent | null;
}

export default function PageEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: response, isLoading } = useGetAdminPageQuery(id);
  const page = response?.data;

  const [updateMeta] = useUpdatePageMetaMutation();
  const [addSection] = useAddSectionMutation();
  const [updateSection] = useUpdateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();
  const [reorderSections] = useReorderSectionsMutation();
  const [publishPage] = usePublishPageMutation();
  const [unpublishPage] = useUnpublishPageMutation();

  const [meta, setMeta] = useState({ title: "", slug: "", metaTitle: "", metaDescription: "" });
  const [localContent, setLocalContent] = useState<Record<string, SectionContent>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [savingMeta, setSavingMeta] = useState(false);
  const [dirtySections, setDirtySections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (page) {
      setMeta({
        title: page.title || "",
        slug: page.slug || "",
        metaTitle: page.metaTitle || "",
        metaDescription: page.metaDescription || "",
      });
      const map: Record<string, SectionContent> = {};
      for (const s of page.sections as SectionRow[]) {
        map[s.id] = { ...(s.draftContent || {}) };
      }
      setLocalContent(map);
      setDirtySections(new Set());
    }
  }, [page]);

  const sections = useMemo<SectionRow[]>(() => (page?.sections as SectionRow[]) || [], [page]);

  const saveMeta = async () => {
    setSavingMeta(true);
    try {
      await updateMeta({ id, ...meta }).unwrap();
    } catch (err: any) {
      alert(err?.data?.message || "Failed to save page settings");
    } finally {
      setSavingMeta(false);
    }
  };

  const patchSection = async (sectionId: string, body: Record<string, unknown>) => {
    try {
      await updateSection({ sectionId, ...body }).unwrap();
    } catch (err: any) {
      alert(err?.data?.message || "Failed to save section");
    }
  };

  const setField = (sectionId: string, key: string, value: unknown) => {
    setLocalContent((prev) => ({ ...prev, [sectionId]: { ...prev[sectionId], [key]: value } }));
    setDirtySections((prev) => new Set(prev).add(sectionId));
  };

  const saveSection = async (sectionId: string) => {
    await patchSection(sectionId, { content: localContent[sectionId] || {} });
    setDirtySections((prev) => {
      const next = new Set(prev);
      next.delete(sectionId);
      return next;
    });
  };

  const moveSection = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const a = next[index];
    const b = next[target];
    if (!a || !b) return;
    next[index] = b;
    next[target] = a;
    await reorderSections(next.map((s) => s.id));
  };

  const handleAdd = async (type: string) => {
    await addSection({ pageId: id, type, content: emptyContentForType(type) });
    setShowAdd(false);
  };

  const handleDeleteSection = async (section: SectionRow) => {
    if (confirm(`Delete the "${section.title || section.type}" section?`)) {
      await deleteSection(section.id);
    }
  };

  if (isLoading) return <p className="text-on-surface-variant">Loading page...</p>;
  if (!page) return <p className="text-error">Page not found.</p>;

  return (
    <div className="flex flex-col gap-space-xl max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-space-md flex-wrap">
        <div>
          <Link href="/eliteadmin4393/pages" className="text-label-sm text-on-surface-variant hover:underline">
            ← Back to Pages
          </Link>
          <h1 className="font-display text-headline-lg text-on-surface">{page.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-label-sm font-label-sm uppercase px-2 py-0.5 rounded font-semibold ${
                page.status === "published"
                  ? "bg-secondary-container text-on-secondary-container"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {page.status}
            </span>
            {page.hasUnpublishedChanges && (
              <span className="text-label-sm text-amber-600 font-semibold">Unpublished changes</span>
            )}
          </div>
        </div>
        <div className="flex gap-space-sm">
          <Link
            href={`/eliteadmin4393/pages/${id}/preview`}
            target="_blank"
            className="bg-surface-container text-on-surface px-space-md py-space-xs rounded-lg font-label-md hover:bg-surface-container-high transition-colors"
          >
            Preview
          </Link>
          {page.status === "published" ? (
            <button
              onClick={() => unpublishPage(id)}
              className="bg-surface-container text-on-surface px-space-md py-space-xs rounded-lg font-label-md hover:bg-surface-container-high transition-colors"
            >
              Unpublish
            </button>
          ) : (
            <button
              onClick={() => publishPage(id)}
              className="bg-secondary text-on-secondary px-space-md py-space-xs rounded-lg font-label-md"
            >
              Publish
            </button>
          )}
        </div>
      </div>

      {/* Page settings */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-space-md">
        <h3 className="font-headline-sm text-primary">Page Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <label className="flex flex-col gap-1">
            <span className="font-label-md text-on-surface">Title</span>
            <input
              value={meta.title}
              onChange={(e) => setMeta({ ...meta, title: e.target.value })}
              className="bg-surface-container w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-label-md text-on-surface">Slug</span>
            <input
              value={meta.slug}
              onChange={(e) => setMeta({ ...meta, slug: e.target.value })}
              className="bg-surface-container w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </label>
          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="font-label-md text-on-surface">SEO Meta Title</span>
            <input
              value={meta.metaTitle}
              onChange={(e) => setMeta({ ...meta, metaTitle: e.target.value })}
              className="bg-surface-container w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </label>
          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="font-label-md text-on-surface">SEO Meta Description</span>
            <textarea
              value={meta.metaDescription}
              onChange={(e) => setMeta({ ...meta, metaDescription: e.target.value })}
              className="bg-surface-container w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface min-h-[80px]"
            />
          </label>
        </div>
        <div>
          <button
            onClick={saveMeta}
            disabled={savingMeta}
            className="bg-primary text-on-primary px-space-lg py-space-xs rounded-lg font-label-md disabled:opacity-60"
          >
            {savingMeta ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="flex items-center justify-between">
        <h3 className="font-headline-sm text-primary">Sections ({sections.length})</h3>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="bg-primary text-on-primary px-space-md py-space-xs rounded-lg font-label-md"
        >
          {showAdd ? "Cancel" : "+ Add Section"}
        </button>
      </div>

      {showAdd && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant">
          {SECTION_TYPES.map((t) => (
            <button
              key={t.type}
              onClick={() => handleAdd(t.type)}
              className="text-left p-space-md rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-colors"
            >
              <span className="font-label-lg text-on-surface block">{t.label}</span>
              <span className="text-label-sm text-on-surface-variant">{t.description}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-space-md">
        {sections.map((section, index) => {
          const def = getSectionTypeDef(section.type);
          const content = localContent[section.id] || {};
          const isDirty = dirtySections.has(section.id);
          return (
            <div
              key={section.id}
              className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden"
            >
              <div className="flex items-center justify-between gap-space-sm p-space-md bg-surface-container-low border-b border-outline-variant">
                <div className="flex items-center gap-space-sm min-w-0">
                  <span className="font-headline-sm text-primary truncate">
                    {section.title || def?.label || section.type}
                  </span>
                  <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">
                    {section.type}
                  </span>
                  {!section.isVisible && (
                    <span className="text-label-sm text-amber-600 font-semibold">hidden</span>
                  )}
                </div>
                <div className="flex items-center gap-space-sm shrink-0">
                  <button
                    onClick={() => moveSection(index, -1)}
                    disabled={index === 0}
                    className="text-on-surface-variant hover:text-primary disabled:opacity-30"
                    title="Move up"
                  >
                    <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
                  </button>
                  <button
                    onClick={() => moveSection(index, 1)}
                    disabled={index === sections.length - 1}
                    className="text-on-surface-variant hover:text-primary disabled:opacity-30"
                    title="Move down"
                  >
                    <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
                  </button>
                  <button
                    onClick={() => patchSection(section.id, { isVisible: !section.isVisible })}
                    className="text-on-surface-variant hover:text-primary"
                    title={section.isVisible ? "Hide section" : "Show section"}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {section.isVisible ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section)}
                    className="text-error hover:opacity-80"
                    title="Delete section"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>

              <div className="p-space-md flex flex-col gap-space-sm">
                {def ? (
                  def.fields.map((field) => (
                    <FieldEditor
                      key={field.key}
                      field={field}
                      value={content[field.key]}
                      onChange={(v) => setField(section.id, field.key, v)}
                    />
                  ))
                ) : (
                  <label className="flex flex-col gap-1">
                    <span className="font-label-md text-on-surface">
                      Content (JSON) — unknown section type
                    </span>
                    <textarea
                      value={JSON.stringify(content, null, 2)}
                      onChange={(e) => {
                        try {
                          setField(section.id, "__raw", JSON.parse(e.target.value));
                        } catch {
                          /* ignore invalid JSON while typing */
                        }
                      }}
                      className="bg-surface-container w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface font-mono text-sm min-h-[160px]"
                    />
                  </label>
                )}
              </div>

              <div className="px-space-md pb-space-md">
                <button
                  onClick={() => saveSection(section.id)}
                  disabled={!isDirty}
                  className={`px-space-lg py-space-xs rounded-lg font-label-md transition-colors ${
                    isDirty
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface-container text-on-surface-variant cursor-default"
                  }`}
                >
                  {isDirty ? "Save Draft" : "Saved"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (field.type === "list") {
    const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
    return (
      <div className="flex flex-col gap-space-sm border border-outline-variant/60 rounded-lg p-space-md">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-on-surface">{field.label}</span>
          <button
            onClick={() => onChange([...items, {}])}
            className="text-secondary font-label-sm hover:underline"
          >
            + Add item
          </button>
        </div>
        {items.length === 0 && (
          <p className="text-label-sm text-on-surface-variant">No items yet.</p>
        )}
        {items.map((item, i) => (
          <div key={i} className="border border-outline-variant/40 rounded-lg p-space-sm flex flex-col gap-2 bg-surface-container-low/40">
            <div className="flex justify-end">
              <button
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="text-error font-label-sm hover:underline"
              >
                Remove
              </button>
            </div>
            {field.itemFields?.map((sub) => (
              <FieldEditor
                key={sub.key}
                field={sub}
                value={item[sub.key]}
                onChange={(v) => {
                  const next = [...items];
                  next[i] = { ...next[i], [sub.key]: v };
                  onChange(next);
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  const label = <span className="font-label-md text-on-surface">{field.label}</span>;

  if (field.type === "textarea") {
    return (
      <label className="flex flex-col gap-1">
        {label}
        <textarea
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className="bg-surface-container w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface min-h-[70px]"
        />
      </label>
    );
  }

  return (
    <label className="flex flex-col gap-1">
      {label}
      <input
        type={field.type === "url" || field.type === "image" ? "text" : "text"}
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        className="bg-surface-container w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
      />
    </label>
  );
}
