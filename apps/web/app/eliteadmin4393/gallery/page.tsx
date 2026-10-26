"use client";

import { useState } from "react";
import {
  useGetAdminGalleryQuery,
  useCreateGalleryItemMutation,
  useDeleteGalleryItemMutation,
} from "@/lib/features/api/apiSlice";
import DualImageInput from "@/components/admin/DualImageInput";

export default function AdminGalleryPage() {
  const { data: response, isLoading } = useGetAdminGalleryQuery({});
  const [createGalleryItem, { isLoading: isCreating }] = useCreateGalleryItemMutation();
  const [deleteGalleryItem] = useDeleteGalleryItemMutation();

  const galleryItems = response?.data || [];

  const [formData, setFormData] = useState({
    title: "",
    category: "Campus Event",
    image: "",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image) return;

    try {
      await createGalleryItem(formData).unwrap();
      setMessage("✓ Gallery item created successfully!");
      setFormData({ title: "", category: "Campus Event", image: "" });
    } catch (err) {
      console.error(err);
      setMessage("Failed to create gallery item.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this gallery item?")) {
      try {
        await deleteGalleryItem(id).unwrap();
        setMessage("✓ Gallery item deleted!");
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-space-xl max-w-6xl mx-auto pb-12 font-sans">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface font-extrabold">Community Gallery CMS</h1>
        <p className="text-body-md text-on-surface-variant">Manage images, workshops, graduation events, and student community highlights for the home page slider.</p>
      </div>

      {message && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-4 rounded-xl font-bold text-sm">
          {message}
        </div>
      )}

      {/* CREATE NEW GALLERY ITEM FORM */}
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-4">
        <h3 className="text-lg font-bold text-primary border-b border-outline-variant pb-2">Add New Gallery Item</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider">Title / Label *</label>
            <input
              type="text"
              required
              placeholder="e.g. Live Peer Review, Graduation Ceremony"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-sm text-on-surface"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider">Category</label>
            <input
              type="text"
              placeholder="e.g. Workshop, Hackathon, Campus Event"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isCreating}
            className="bg-secondary hover:bg-on-secondary-container text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            {isCreating ? "Adding Item..." : "+ Add to Gallery"}
          </button>
        </div>
      </form>

      {/* GALLERY ITEMS GRID */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold text-foreground">Current Community Gallery ({galleryItems.length})</h3>

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading gallery items...</p>
        ) : galleryItems.length === 0 ? (
          <p className="text-muted-foreground text-sm">No gallery items added yet. Add one above!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryItems.map((item: any) => (
              <div key={item.id} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group">
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-container">
                  <img
                    alt={item.title}
                    src={item.image}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-sm leading-tight drop-shadow-sm">{item.title}</span>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between border-t border-outline-variant/30 bg-surface-container-lowest">
                  <span className="text-xs text-muted-foreground font-medium">{item.category || "Community"}</span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800 text-xs font-bold uppercase tracking-wider transition-colors p-1"
                  >
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
