"use client";

import { useState } from "react";
import { useGetAdminFaqsQuery, useCreateFaqMutation, useDeleteFaqMutation } from "@/lib/features/api/apiSlice";

export default function AdminFaqPage() {
  const { data: response, isLoading } = useGetAdminFaqsQuery({});
  const faqs = response?.data || [];
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;

    try {
      await createFaq({
        question,
        answer,
        isActive: true,
      }).unwrap();

      setQuestion("");
      setAnswer("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      await deleteFaq(id);
    }
  };

  return (
    <div className="flex flex-col gap-space-xl max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-headline-lg text-on-surface">FAQ Management</h1>
          <p className="text-body-md text-on-surface-variant">Add and manage questions displayed on the homepage and FAQ page.</p>
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
        <h3 className="font-headline-sm text-primary mb-space-md">Add New FAQ</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Question *</label>
            <input
              type="text"
              required
              placeholder="e.g. What is the batch size and duration?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Answer *</label>
            <textarea
              required
              rows={3}
              placeholder="Enter comprehensive answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isCreating}
              className="bg-primary text-on-primary font-label-md px-space-xl py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isCreating ? "Saving..." : "+ Save FAQ"}
            </button>
          </div>
        </form>
      </div>

      {/* FAQ List */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
        <h3 className="font-headline-sm text-primary mb-space-md">Active FAQs ({faqs.length})</h3>
        {isLoading ? (
          <p className="text-on-surface-variant">Loading FAQs...</p>
        ) : faqs.length === 0 ? (
          <p className="text-on-surface-variant">No FAQs added yet. Add your first FAQ above!</p>
        ) : (
          <div className="flex flex-col gap-space-sm">
            {faqs.map((item: any) => (
              <div key={item.id} className="bg-surface-container-low p-space-md rounded-lg flex items-start justify-between gap-space-md">
                <div className="flex flex-col gap-1">
                  <h4 className="font-headline-sm text-primary">{item.question}</h4>
                  <p className="font-body-sm text-on-surface-variant leading-relaxed">{item.answer}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-error font-label-sm shrink-0 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
