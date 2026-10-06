"use client";

import { useState } from "react";
import { useGetAdminMentorsQuery, useCreateMentorMutation, useDeleteMentorMutation } from "@/lib/features/api/apiSlice";

export default function AdminMentorsPage() {
  const { data: response, isLoading } = useGetAdminMentorsQuery({});
  const mentors = response?.data || [];
  const [createMentor, { isLoading: isCreating }] = useCreateMentorMutation();
  const [deleteMentor] = useDeleteMentorMutation();

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [bio, setBio] = useState("");
  const [quote, setQuote] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [experience, setExperience] = useState("");
  const [accreditation, setAccreditation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !designation || !bio) return;

    try {
      await createMentor({
        name,
        designation,
        bio,
        quote,
        profileImage,
        experience,
        accreditation,
        isPublished: true,
      }).unwrap();

      setName("");
      setDesignation("");
      setBio("");
      setQuote("");
      setProfileImage("");
      setExperience("");
      setAccreditation("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this mentor profile?")) {
      await deleteMentor(id);
    }
  };

  return (
    <div className="flex flex-col gap-space-xl max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface">Mentors & Faculty CRM</h1>
        <p className="text-body-md text-on-surface-variant">Manage academic directors, speech linguists, and faculty profiles displayed on the About and Home pages.</p>
      </div>

      {/* Create Form */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
        <h3 className="font-headline-sm text-primary mb-space-md">Add New Mentor</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Faculty Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Meenakshi Sundaram"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Designation / Role *</label>
            <input
              type="text"
              required
              placeholder="e.g. Chief Linguist & Academic Dean"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Accreditation Badge</label>
            <input
              type="text"
              placeholder="e.g. British Council Accredited Fellow"
              value={accreditation}
              onChange={(e) => setAccreditation(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Experience Tag</label>
            <input
              type="text"
              placeholder="e.g. 22+ Years Forensic Linguistics"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-label-md text-on-surface">Featured Quote</label>
            <input
              type="text"
              placeholder='e.g. "We do not teach you to impersonate a native speaker. We coach you to speak with clarity."'
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-label-md text-on-surface">Profile Image URL</label>
            <input
              type="text"
              placeholder="https://..."
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-label-md text-on-surface">Full Academic Bio *</label>
            <textarea
              required
              rows={3}
              placeholder="Enter comprehensive faculty background and research credentials..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isCreating}
              className="bg-primary text-on-primary font-label-md px-space-xl py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isCreating ? "Saving..." : "+ Add Faculty Member"}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
        <h3 className="font-headline-sm text-primary mb-space-md">Faculty Profiles ({mentors.length})</h3>
        {isLoading ? (
          <p className="text-on-surface-variant">Loading mentors...</p>
        ) : mentors.length === 0 ? (
          <p className="text-on-surface-variant">No mentors added yet. Add your first faculty profile above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {mentors.map((item: any) => (
              <div key={item.id} className="bg-surface-container-low p-space-md rounded-lg flex items-start gap-space-md">
                {item.profileImage && (
                  <img src={item.profileImage} alt={item.name} className="w-16 h-20 object-cover rounded-lg shrink-0" />
                )}
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-headline-sm text-primary">{item.name}</h4>
                    <span className="font-label-sm text-secondary font-semibold block">{item.designation}</span>
                    <p className="font-body-sm text-on-surface-variant mt-1 line-clamp-2">{item.bio}</p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-outline-variant flex justify-end">
                    <button onClick={() => handleDelete(item.id)} className="text-error font-label-sm hover:underline">
                      Delete Profile
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
