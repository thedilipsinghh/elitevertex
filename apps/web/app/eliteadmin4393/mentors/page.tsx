"use client";

import { useState } from "react";
import {
  useGetAdminMentorsQuery,
  useCreateMentorMutation,
  useUpdateMentorMutation,
  useDeleteMentorMutation,
} from "@/lib/features/api/apiSlice";
import DualImageInput from "@/components/admin/DualImageInput";

export default function AdminMentorsPage() {
  const { data: response, isLoading } = useGetAdminMentorsQuery({});
  const mentors = response?.data || [];
  const [createMentor, { isLoading: isCreating }] = useCreateMentorMutation();
  const [updateMentor, { isLoading: isUpdating }] = useUpdateMentorMutation();
  const [deleteMentor] = useDeleteMentorMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [bio, setBio] = useState("");
  const [quote, setQuote] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [experience, setExperience] = useState("");
  const [accreditation, setAccreditation] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDesignation("");
    setBio("");
    setQuote("");
    setProfileImage("");
    setExperience("");
    setAccreditation("");
  };

  const handleStartEdit = (mentor: any) => {
    setEditingId(mentor.id);
    setName(mentor.name || "");
    setDesignation(mentor.designation || "");
    setBio(mentor.bio || "");
    setQuote(mentor.quote || "");
    setProfileImage(mentor.profileImage || "");
    setExperience(mentor.experience || "");
    setAccreditation(mentor.accreditation || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !designation || !bio) return;

    try {
      if (editingId) {
        await updateMentor({
          id: editingId,
          name: name.trim(),
          designation: designation.trim(),
          bio: bio.trim(),
          quote: quote.trim(),
          profileImage,
          experience: experience.trim(),
          accreditation: accreditation.trim(),
          isPublished: true,
        }).unwrap();
        showToast("✓ Faculty profile updated successfully!");
      } else {
        await createMentor({
          name: name.trim(),
          designation: designation.trim(),
          bio: bio.trim(),
          quote: quote.trim(),
          profileImage,
          experience: experience.trim(),
          accreditation: accreditation.trim(),
          isPublished: true,
        }).unwrap();
        showToast("✓ New faculty profile added successfully!");
      }
      resetForm();
    } catch (err: any) {
      console.error(err);
      showToast(err?.data?.message || "Failed to save mentor profile.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this mentor profile?")) {
      try {
        await deleteMentor(id).unwrap();
        showToast("✓ Mentor deleted.");
        if (editingId === id) resetForm();
      } catch (err: any) {
        showToast("Failed to delete mentor.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-space-xl max-w-5xl mx-auto pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-headline-lg text-on-surface font-extrabold">Mentors & Faculty CRM</h1>
        <p className="text-body-md text-on-surface-variant">Manage academic directors, speech linguists, and faculty profiles displayed on the About and Home pages.</p>
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
            {editingId ? "Edit Faculty Profile" : "Add New Mentor"}
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
            <label className="font-label-md text-on-surface font-semibold">Faculty Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Meenakshi Sundaram"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-semibold">Designation / Role *</label>
            <input
              type="text"
              required
              placeholder="e.g. Chief Linguist & Academic Dean"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-semibold">Accreditation Badge</label>
            <input
              type="text"
              placeholder="e.g. British Council Accredited Fellow"
              value={accreditation}
              onChange={(e) => setAccreditation(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-semibold">Experience Tag</label>
            <input
              type="text"
              placeholder="e.g. 22+ Years Forensic Linguistics"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-label-md text-on-surface font-semibold">Featured Quote</label>
            <input
              type="text"
              placeholder='e.g. "We do not teach you to impersonate a native speaker. We coach you to speak with clarity."'
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <DualImageInput
              label="Mentor Profile Photo"
              value={profileImage}
              onChange={(url) => setProfileImage(url)}
              helpText="Upload faculty portrait from device or paste an image link."
              placeholder="https://images.unsplash.com/... or https://..."
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-label-md text-on-surface font-semibold">Full Academic Bio *</label>
            <textarea
              required
              rows={3}
              placeholder="Enter comprehensive faculty background and research credentials..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm leading-relaxed"
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
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
                : "+ Add Faculty Member"}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
        <h3 className="font-headline-sm text-primary mb-space-md">Faculty Profiles ({mentors.length})</h3>
        {isLoading ? (
          <p className="text-on-surface-variant text-sm">Loading mentors...</p>
        ) : mentors.length === 0 ? (
          <p className="text-on-surface-variant text-sm">No mentors added yet. Add your first faculty profile above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {mentors.map((item: any) => (
              <div key={item.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 flex items-start gap-4">
                {item.profileImage && (
                  <img src={item.profileImage} alt={item.name} className="w-16 h-20 object-cover rounded-lg shrink-0 border border-outline-variant/40" />
                )}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <h4 className="font-bold text-base text-primary truncate">{item.name}</h4>
                    <span className="text-xs text-secondary font-semibold block">{item.designation}</span>
                    <p className="text-xs text-on-surface-variant mt-1.5 line-clamp-2 leading-relaxed">{item.bio}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-outline-variant/60 flex items-center justify-end gap-3">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
