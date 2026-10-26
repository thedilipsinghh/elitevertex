"use client";

import Link from "next/link";
import { useState } from "react";
import {
  useGetAdminPagesQuery,
  useCreatePageMutation,
  useDeletePageMutation,
  useDuplicatePageMutation,
  usePublishPageMutation,
  useUnpublishPageMutation,
} from "@/lib/features/api/apiSlice";

interface PageRow {
  id: string;
  slug: string;
  title: string;
  status: string;
  sectionCount: number;
  updatedAt: string;
}

export default function AdminPagesPage() {
  const { data: response, isLoading } = useGetAdminPagesQuery(undefined);
  const pages: PageRow[] = response?.data || [];
  const [createPage, { isLoading: creating }] = useCreatePageMutation();
  const [deletePage] = useDeletePageMutation();
  const [duplicatePage] = useDuplicatePageMutation();
  const [publishPage] = usePublishPageMutation();
  const [unpublishPage] = useUnpublishPageMutation();

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const slugify = (v: string) =>
    v
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPage({ title, slug }).unwrap();
      setTitle("");
      setSlug("");
      setShowCreate(false);
    } catch (err: any) {
      alert(err?.data?.message || "Failed to create page");
    }
  };

  const handleDelete = async (page: PageRow) => {
    if (confirm(`Delete page "${page.title}"? This cannot be undone.`)) {
      await deletePage(page.id);
    }
  };

  return (
    <div className="flex flex-col gap-space-xl max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-headline-lg text-on-surface">Pages</h1>
          <p className="text-body-md text-on-surface-variant">
            Build and publish website pages with reusable, reorderable sections.
          </p>
        </div>
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="bg-primary text-on-primary px-space-md py-space-xs rounded-lg font-label-md"
        >
          {showCreate ? "Cancel" : "+ New Page"}
        </button>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant flex flex-col md:flex-row gap-space-md items-end"
        >
          <div className="flex flex-col gap-1 flex-1">
            <label className="font-label-md text-on-surface">Title</label>
            <input
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSlug(slugify(e.target.value));
              }}
              className="bg-surface-container w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              placeholder="e.g. Terms & Conditions"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="font-label-md text-on-surface">Slug (URL)</label>
            <input
              required
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              className="bg-surface-container w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              placeholder="terms-conditions"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="bg-secondary text-on-secondary px-space-lg py-3 rounded-lg font-label-md disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create Page"}
          </button>
        </form>
      )}

      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
        {isLoading ? (
          <p className="text-on-surface-variant">Loading pages...</p>
        ) : pages.length === 0 ? (
          <p className="text-on-surface-variant">No pages yet. Create your first page.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                <th className="p-3">Title</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Sections</th>
                <th className="p-3">Status</th>
                <th className="p-3">Updated</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr
                  key={page.id}
                  className="border-b border-outline-variant/60 hover:bg-surface-container-low transition-colors"
                >
                  <td className="p-3 font-headline-sm text-primary">
                    <Link href={`/eliteadmin4393/pages/${page.id}`} className="hover:underline">
                      {page.title}
                    </Link>
                  </td>
                  <td className="p-3 text-body-sm text-on-surface-variant">/{page.slug}</td>
                  <td className="p-3 text-body-sm text-on-surface-variant">{page.sectionCount}</td>
                  <td className="p-3">
                    <span
                      className={`text-label-sm font-label-sm uppercase px-2 py-1 rounded font-semibold ${
                        page.status === "published"
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {page.status}
                    </span>
                  </td>
                  <td className="p-3 text-body-sm text-on-surface-variant whitespace-nowrap">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <div className="flex gap-3 justify-end">
                      <Link
                        href={`/eliteadmin4393/pages/${page.id}`}
                        className="text-primary font-label-sm hover:underline"
                      >
                        Edit
                      </Link>
                      {page.status === "published" ? (
                        <button
                          onClick={() => unpublishPage(page.id)}
                          className="text-on-surface-variant font-label-sm hover:underline"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          onClick={() => publishPage(page.id)}
                          className="text-secondary font-label-sm hover:underline"
                        >
                          Publish
                        </button>
                      )}
                      <button
                        onClick={() => duplicatePage(page.id)}
                        className="text-on-surface-variant font-label-sm hover:underline"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => handleDelete(page)}
                        className="text-error font-label-sm hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
