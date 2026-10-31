"use client";

import { useState } from "react";
import {
  useGetAdminGalleryQuery,
  useCreateGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
} from "@/lib/features/api/apiSlice";
import DualImageInput from "@/components/admin/DualImageInput";

const CATEGORY_PRESETS = [
  "Campus Life",
  "Classroom",
  "Workshops",
  "Campus Event",
  "Debate & Speech",
  "Graduation",
  "Student Milestones",
];

export default function AdminGalleryPage() {
  const { data: response, isLoading } = useGetAdminGalleryQuery({});
  const [createGalleryItem, { isLoading: isCreating }] = useCreateGalleryItemMutation();
  const [updateGalleryItem, { isLoading: isUpdating }] = useUpdateGalleryItemMutation();
  const [deleteGalleryItem] = useDeleteGalleryItemMutation();

  const galleryItems = response?.data || [];

  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Campus Life",
    description: "",
    image: "",
  });

  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      title: "",
      category: "Campus Life",
      description: "",
      image: "",
    });
  };

  const handleStartEdit = (item: any) => {
    setEditId(item.id);
    setFormData({
      title: item.title || "",
      category: item.category || "Campus Life",
      description: item.description || "",
      image: item.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image.trim()) {
      showToast("❌ Please provide a Title and an Image URL.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      category: formData.category.trim() || "Campus Life",
      description: formData.description.trim() || null,
      image: formData.image.trim(),
      isActive: true,
    };

    try {
      if (editId) {
        await updateGalleryItem({ id: editId, ...payload }).unwrap();
        showToast("✓ Gallery item updated successfully!");
      } else {
        await createGalleryItem(payload).unwrap();
        showToast("✓ Gallery photo added successfully!");
      }
      resetForm();
    } catch (err: any) {
      console.error(err);
      showToast("❌ Failed to save gallery item: " + (err?.data?.message || err?.message || "Server error"));
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}" from the gallery?`)) {
      try {
        await deleteGalleryItem(id).unwrap();
        showToast("✓ Gallery item deleted!");
        if (editId === id) resetForm();
      } catch (err: any) {
        console.error(err);
        showToast("❌ Failed to delete item: " + (err?.data?.message || err?.message || "Server error"));
      }
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <div className="flex flex-col gap-space-xl max-w-6xl mx-auto pb-16 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-secondary text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 font-semibold text-sm border border-secondary animate-fade-in">
          <span className="material-symbols-outlined text-[20px]">
            {toastMessage.includes("✓") ? "check_circle" : "error"}
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-on-surface font-extrabold">Community Gallery CMS</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Manage documentary photos, workshop moments, graduation ceremonies, and student highlights displayed on the public Gallery page and Homepage marquee.
        </p>
      </div>

      {/* CREATE / EDIT GALLERY ITEM FORM */}
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">
              {editId ? "photo_library" : "add_photo_alternate"}
            </span>
            <h3 className="text-lg font-bold text-primary">
              {editId ? "Edit Gallery Item" : "Add New Gallery Item"}
            </h3>
          </div>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Title / Caption *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Acoustic Rhetoric Lab Session, Graduation Ceremony"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-sm text-on-surface"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Category *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Campus Life, Workshops, Classroom"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-sm text-on-surface mb-1.5"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_PRESETS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-colors ${
                    formData.category === cat
                      ? "bg-secondary text-white border-secondary"
                      : "bg-surface-container border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Description / Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Students practicing real-time speech cadence and vocal modulation."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-sm text-on-surface"
            />
          </div>
        </div>

        <div className="pt-2">
          <DualImageInput
            label="Gallery Photo Media"
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            required
            helpText="Upload an image from your device or paste an image link."
            placeholder="https://images.unsplash.com/... or https://..."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/40">
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-surface-container hover:bg-surface-container-high text-on-surface px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="bg-secondary hover:bg-on-secondary-container text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              {editId ? "save" : "add_photo_alternate"}
            </span>
            <span>{isSaving ? "Saving..." : editId ? "Update Gallery Photo" : "+ Add to Gallery"}</span>
          </button>
        </div>
      </form>

      {/* GALLERY ITEMS GRID */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <h3 className="text-xl font-bold text-foreground">
            Current Community Gallery ({galleryItems.length})
          </h3>
          <span className="text-xs text-on-surface-variant font-medium">
            Live on /gallery and Homepage Marquee
          </span>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading gallery items...</p>
        ) : galleryItems.length === 0 ? (
          <p className="text-muted-foreground text-sm">No gallery items added yet. Add your first photo above!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryItems.map((item: any) => (
              <div
                key={item.id}
                className={`bg-surface-container-lowest border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group transition-all ${
                  editId === item.id ? "border-secondary ring-2 ring-secondary/20 shadow-md" : "border-outline-variant/40"
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-container">
                  <img
                    alt={item.title}
                    src={item.image}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-sm leading-tight drop-shadow-sm line-clamp-2">
                      {item.title}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container text-secondary">
                      {item.category || "Community"}
                    </span>
                    <span className="text-[10px] font-mono text-on-surface-variant">
                      {item.id.slice(0, 6)}...
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="p-3 border-t border-outline-variant/30 bg-surface-container-low flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.title)}
                    className="text-red-600 hover:text-red-800 text-xs font-bold uppercase tracking-wider transition-colors p-1 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
