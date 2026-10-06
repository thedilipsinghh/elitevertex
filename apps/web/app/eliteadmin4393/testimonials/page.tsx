"use client";

import { useState } from "react";
import { useGetAdminTestimonialsQuery, useCreateTestimonialMutation, useDeleteTestimonialMutation } from "@/lib/features/api/apiSlice";

export default function AdminTestimonialsPage() {
  const { data: response, isLoading } = useGetAdminTestimonialsQuery({});
  const testimonials = response?.data || [];
  const [createTestimonial, { isLoading: isCreating }] = useCreateTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("5");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    try {
      await createTestimonial({
        name,
        role: role || "Student / Alumni",
        message,
        rating: parseInt(rating, 10),
        isActive: true,
      }).unwrap();

      setName("");
      setRole("");
      setMessage("");
      setRating("5");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      await deleteTestimonial(id);
    }
  };

  return (
    <div className="flex flex-col gap-space-xl max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-headline-lg text-on-surface">Testimonials & Reviews</h1>
          <p className="text-body-md text-on-surface-variant">Manage learner reviews displayed dynamically on the homepage.</p>
        </div>
      </div>

      {/* Create Form */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
        <h3 className="font-headline-sm text-primary mb-space-md">Add New Review</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Student Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Role / Course *</label>
            <input
              type="text"
              placeholder="e.g. Spoken English Alumni"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-label-md text-on-surface">Review / Feedback *</label>
            <textarea
              required
              rows={3}
              placeholder="Enter student review details..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex items-center gap-space-md md:col-span-2">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface">Rating (1 to 5 stars)</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="self-end bg-primary text-on-primary font-label-md px-space-xl py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isCreating ? "Saving..." : "+ Save Review"}
            </button>
          </div>
        </form>
      </div>

      {/* Review List */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
        <h3 className="font-headline-sm text-primary mb-space-md">Live Reviews ({testimonials.length})</h3>
        {isLoading ? (
          <p className="text-on-surface-variant">Loading reviews...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-on-surface-variant">No reviews added yet. Add your first review above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {testimonials.map((item: any) => (
              <div key={item.id} className="bg-surface-container-low p-space-md rounded-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-headline-sm text-primary">{item.name}</h4>
                    <span className="text-secondary font-bold">{"★".repeat(item.rating || 5)}</span>
                  </div>
                  <span className="font-label-sm text-on-surface-variant block mb-2">{item.role}</span>
                  <p className="font-body-sm text-on-surface-variant leading-relaxed">"{item.message}"</p>
                </div>
                <div className="mt-space-md pt-space-xs border-t border-outline-variant flex justify-end">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-error font-label-sm hover:underline"
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
