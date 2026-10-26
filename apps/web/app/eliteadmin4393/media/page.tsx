"use client";

import { useRef, useState } from "react";
import { useGetMediaQuery, useUpdateMediaMutation, useDeleteMediaMutation } from "@/lib/features/api/apiSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface MediaItem {
  id: string;
  url: string;
  filename?: string | null;
  alt?: string | null;
  caption?: string | null;
  folder?: string | null;
  mimeType?: string | null;
  size?: number | null;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const limit = 24;

  const { data: response, isLoading, refetch } = useGetMediaQuery({ page, limit, search });
  const items: MediaItem[] = response?.data || [];
  const meta = response?.meta;

  const [updateMedia] = useUpdateMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [editForm, setEditForm] = useState({ alt: "", caption: "" });

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setMessage("");
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("image", file);
        fd.append("alt", file.name);
        const res = await fetch(`${API_BASE}/admin/upload`, {
          method: "POST",
          credentials: "include",
          body: fd,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || "Upload failed");
        }
      }
      setMessage(`✓ Uploaded ${files.length} file(s).`);
      await refetch();
    } catch (err: any) {
      setMessage(`Upload failed: ${err.message || "unknown error"}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openEdit = (item: MediaItem) => {
    setEditing(item);
    setEditForm({ alt: item.alt || "", caption: item.caption || "" });
  };

  const saveEdit = async () => {
    if (!editing) return;
    await updateMedia({ id: editing.id, ...editForm });
    setEditing(null);
  };

  const handleDelete = async (item: MediaItem) => {
    if (confirm(`Delete "${item.filename || item.alt || "this file"}" permanently?`)) {
      await deleteMedia(item.id);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("✓ URL copied to clipboard.");
    } catch {
      setMessage("Could not copy URL.");
    }
  };

  return (
    <div className="flex flex-col gap-space-xl max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <h1 className="font-display text-headline-lg text-on-surface">Media Library</h1>
          <p className="text-body-md text-on-surface-variant">
            Upload and manage images stored in the cloud. Copy a URL to use it in any section.
          </p>
        </div>
        <div className="flex items-center gap-space-sm">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-primary text-on-primary px-space-lg py-space-xs rounded-lg font-label-md disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "+ Upload Images"}
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-space-sm rounded-lg text-body-sm font-semibold">
          {message}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setSearch(searchInput.trim());
        }}
        className="flex gap-space-sm"
      >
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by filename, alt text or caption..."
          className="flex-1 bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
        />
        <button type="submit" className="bg-surface-container-high text-on-surface px-space-lg rounded-lg font-label-md">
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setPage(1);
            }}
            className="text-on-surface-variant font-label-md px-2"
          >
            Clear
          </button>
        )}
      </form>

      {isLoading ? (
        <p className="text-on-surface-variant">Loading media...</p>
      ) : items.length === 0 ? (
        <p className="text-on-surface-variant">
          {search ? "No media matches your search." : "No media uploaded yet. Upload your first image."}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-space-md">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden shadow-sm flex flex-col"
            >
              <div className="aspect-square bg-surface-container overflow-hidden">
                <img alt={item.alt || item.filename || "media"} src={item.url} className="w-full h-full object-cover" />
              </div>
              <div className="p-space-sm flex flex-col gap-1 flex-1">
                <span className="text-label-sm text-on-surface truncate" title={item.filename || ""}>
                  {item.filename || "untitled"}
                </span>
                <span className="text-label-sm text-on-surface-variant truncate">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-outline-variant/30 px-space-sm py-1.5">
                <button onClick={() => copyUrl(item.url)} className="text-secondary font-label-sm hover:underline">
                  Copy URL
                </button>
                <button onClick={() => openEdit(item)} className="text-on-surface-variant font-label-sm hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(item)} className="text-error font-label-sm hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-space-md">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="bg-surface-container px-space-md py-1.5 rounded-lg font-label-md disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-body-sm text-on-surface-variant">
            Page {meta.page} of {meta.totalPages} · {meta.total} files
          </span>
          <button
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page >= meta.totalPages}
            className="bg-surface-container px-space-md py-1.5 rounded-lg font-label-md disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-space-md z-50">
          <div className="bg-surface-container-lowest rounded-xl p-space-lg w-full max-w-md flex flex-col gap-space-md">
            <h3 className="font-headline-sm text-primary">Edit Media Details</h3>
            <div className="rounded-lg overflow-hidden bg-surface-container aspect-video">
              <img alt={editing.alt || ""} src={editing.url} className="w-full h-full object-cover" />
            </div>
            <label className="flex flex-col gap-1">
              <span className="font-label-md text-on-surface">Alt Text</span>
              <input
                value={editForm.alt}
                onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-label-md text-on-surface">Caption</span>
              <input
                value={editForm.caption}
                onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </label>
            <div className="flex justify-end gap-space-sm">
              <button onClick={() => setEditing(null)} className="text-on-surface-variant font-label-md px-space-md">
                Cancel
              </button>
              <button onClick={saveEdit} className="bg-primary text-on-primary px-space-lg py-space-xs rounded-lg font-label-md">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
