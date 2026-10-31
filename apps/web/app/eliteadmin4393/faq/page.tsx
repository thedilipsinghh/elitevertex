"use client";

import { useState } from "react";
import {
  useGetAdminFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} from "@/lib/features/api/apiSlice";

export default function AdminFaqPage() {
  const { data: response, isLoading } = useGetAdminFaqsQuery({});
  const faqs = response?.data || [];
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const resetForm = () => {
    setEditingId(null);
    setQuestion("");
    setAnswer("");
  };

  const handleStartEdit = (faq: any) => {
    setEditingId(faq.id);
    setQuestion(faq.question || "");
    setAnswer(faq.answer || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;

    try {
      if (editingId) {
        await updateFaq({
          id: editingId,
          question: question.trim(),
          answer: answer.trim(),
          isActive: true,
        }).unwrap();
        showToast("✓ FAQ updated successfully!");
      } else {
        await createFaq({
          question: question.trim(),
          answer: answer.trim(),
          isActive: true,
        }).unwrap();
        showToast("✓ New FAQ added successfully!");
      }
      resetForm();
    } catch (err: any) {
      console.error(err);
      showToast(err?.data?.message || "Failed to save FAQ.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      try {
        await deleteFaq(id).unwrap();
        showToast("✓ FAQ deleted.");
        if (editingId === id) resetForm();
      } catch (err: any) {
        showToast("Failed to delete FAQ.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-space-xl max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-headline-lg text-on-surface font-extrabold">FAQ Management</h1>
          <p className="text-body-md text-on-surface-variant">Add, update, and manage frequently asked questions displayed on the homepage and FAQ page.</p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-secondary/15 border border-secondary/30 text-on-surface text-sm font-semibold animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Add / Edit Form */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
        <div className="flex items-center justify-between mb-space-md">
          <h3 className="font-headline-sm text-primary">
            {editingId ? "Edit FAQ" : "Add New FAQ"}
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-semibold">Question *</label>
            <input
              type="text"
              required
              placeholder="e.g. What is the batch size and duration?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-semibold">Answer *</label>
            <textarea
              required
              rows={4}
              placeholder="Enter comprehensive answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm leading-relaxed"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
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
                : "+ Save FAQ"}
            </button>
          </div>
        </form>
      </div>

      {/* FAQ List */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
        <h3 className="font-headline-sm text-primary mb-space-md">Active FAQs ({faqs.length})</h3>
        {isLoading ? (
          <p className="text-on-surface-variant text-sm">Loading FAQs...</p>
        ) : faqs.length === 0 ? (
          <p className="text-on-surface-variant text-sm">No FAQs added yet. Add your first FAQ above!</p>
        ) : (
          <div className="flex flex-col gap-3">
            {faqs.map((item: any) => (
              <div key={item.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <h4 className="font-bold text-base text-primary">{item.question}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{item.answer}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 pt-1">
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
