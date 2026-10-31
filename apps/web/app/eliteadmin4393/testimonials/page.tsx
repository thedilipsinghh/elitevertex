"use client";

import { useState } from "react";
import {
  useGetAdminTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} from "@/lib/features/api/apiSlice";

export default function AdminTestimonialsPage() {
  const { data: response, isLoading } = useGetAdminTestimonialsQuery({});
  const testimonials = response?.data || [];
  const [createTestimonial, { isLoading: isCreating }] = useCreateTestimonialMutation();
  const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("5");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setRole("");
    setMessage("");
    setRating("5");
  };

  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name || "");
    setRole(item.role || "");
    setMessage(item.message || "");
    setRating(String(item.rating || 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    try {
      if (editingId) {
        await updateTestimonial({
          id: editingId,
          name: name.trim(),
          role: role.trim() || "Student / Alumni",
          message: message.trim(),
          rating: parseInt(rating, 10),
          isActive: true,
        }).unwrap();
        showToast("✓ Review updated successfully!");
      } else {
        await createTestimonial({
          name: name.trim(),
          role: role.trim() || "Student / Alumni",
          message: message.trim(),
          rating: parseInt(rating, 10),
          isActive: true,
        }).unwrap();
        showToast("✓ New review added successfully!");
      }
      resetForm();
    } catch (err: any) {
      console.error(err);
      showToast(err?.data?.message || "Failed to save review.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteTestimonial(id).unwrap();
        showToast("✓ Review deleted.");
        if (editingId === id) resetForm();
      } catch (err: any) {
        showToast("Failed to delete review.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-space-xl max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-headline-lg text-on-surface font-extrabold">Testimonials & Reviews</h1>
          <p className="text-body-md text-on-surface-variant">Manage learner reviews displayed dynamically on the homepage marquee.</p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-secondary/15 border border-secondary/30 text-on-surface text-sm font-semibold animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Create / Edit Form */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
        <div className="flex items-center justify-between mb-space-md">
          <h3 className="font-headline-sm text-primary">
            {editingId ? "Edit Review" : "Add New Review"}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-bold text-on-surface-variant hover:text-primary uppercase tracking-wider bg-surface-container px-3 py-1.5 rounded-lg"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-semibold">Student Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-semibold">Role / Course *</label>
            <input
              type="text"
              placeholder="e.g. Spoken English Alumni"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-label-md text-on-surface font-semibold">Review / Feedback *</label>
            <textarea
              required
              rows={3}
              placeholder="Enter student review details..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm leading-relaxed"
            />
          </div>
          <div className="flex items-center justify-between md:col-span-2 pt-2">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface font-semibold">Rating (1 to 5 stars)</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="bg-surface-container p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm cursor-pointer"
              >
                <option value="5">5 Stars (Excellent)</option>
                <option value="4">4 Stars (Very Good)</option>
                <option value="3">3 Stars (Good)</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all disabled:opacity-50 shadow-xs"
              >
                {isCreating || isUpdating
                  ? "Saving..."
                  : editingId
                  ? "✓ Save Changes"
                  : "+ Save Review"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Review List */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
        <h3 className="font-headline-sm text-primary mb-space-md">Live Reviews ({testimonials.length})</h3>
        {isLoading ? (
          <p className="text-on-surface-variant text-sm">Loading reviews...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-on-surface-variant text-sm">No reviews added yet. Add your first review above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {testimonials.map((item: any) => (
              <div key={item.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-base text-primary">{item.name}</h4>
                    <span className="text-amber-500 font-bold select-none text-sm">{"★".repeat(item.rating || 5)}</span>
                  </div>
                  <span className="text-xs text-secondary font-semibold block mb-2">{item.role}</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed italic">&quot;{item.message}&quot;</p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="text-secondary hover:underline text-xs font-bold uppercase tracking-wider"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-error hover:underline text-xs font-bold uppercase tracking-wider"
                  >
                    Delete Review
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
