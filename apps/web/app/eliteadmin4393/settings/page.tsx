"use client";

import { useState, useEffect } from "react";
import { useGetAdminSettingsQuery, useUpdateSettingsMutation } from "@/lib/features/api/apiSlice";

export default function AdminSettingsPage() {
  const { data: response, isLoading } = useGetAdminSettingsQuery({});
  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();

  const [formData, setFormData] = useState({
    instituteName: "",
    heroTagline: "",
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    callToActionTitle: "",
    callToActionSubtitle: "",
    phone: "",
    email: "",
    address: "",
    facebookUrl: "",
    instagramUrl: "",
    footerText: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (response?.data) {
      setFormData({
        instituteName: response.data.instituteName || "",
        heroTagline: response.data.heroTagline || "",
        heroTitle: response.data.heroTitle || "",
        heroSubtitle: response.data.heroSubtitle || "",
        heroImage: response.data.heroImage || "",
        callToActionTitle: response.data.callToActionTitle || "",
        callToActionSubtitle: response.data.callToActionSubtitle || "",
        phone: response.data.phone || "",
        email: response.data.email || "",
        address: response.data.address || "",
        facebookUrl: response.data.facebookUrl || "",
        instagramUrl: response.data.instagramUrl || "",
        footerText: response.data.footerText || "",
      });
    }
  }, [response]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await updateSettings(formData).unwrap();
      setMessage("✓ Homepage & Institute Settings saved successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save settings.");
    }
  };

  if (isLoading) return <p className="text-on-surface-variant">Loading settings CRM...</p>;

  return (
    <div className="flex flex-col gap-space-xl max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface">Homepage & Site Settings CRM</h1>
        <p className="text-body-md text-on-surface-variant">Manage all hero copy, institute contact info, banner headlines, and social links directly.</p>
      </div>

      {message && (
        <div className="bg-secondary-container text-on-secondary-container p-4 rounded-xl font-label-md font-semibold">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-space-xl">
        {/* HERO SECTION CRM */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-space-md">
          <h3 className="font-headline-sm text-primary border-b border-outline-variant pb-2">Hero Banner Control</h3>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Tagline Banner</label>
            <input
              type="text"
              name="heroTagline"
              placeholder="e.g. Spoken English • Communication • Career Skills"
              value={formData.heroTagline}
              onChange={handleChange}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Hero Headline *</label>
            <input
              type="text"
              name="heroTitle"
              placeholder="e.g. Speak With Confidence. Go Further."
              value={formData.heroTitle}
              onChange={handleChange}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Hero Subtitle</label>
            <textarea
              rows={2}
              name="heroSubtitle"
              placeholder="e.g. Build the English, communication skills, and executive confidence..."
              value={formData.heroSubtitle}
              onChange={handleChange}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Hero Image URL</label>
            <input
              type="text"
              name="heroImage"
              placeholder="https://..."
              value={formData.heroImage}
              onChange={handleChange}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
        </div>

        {/* CALL TO ACTION SECTION CRM */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-space-md">
          <h3 className="font-headline-sm text-primary border-b border-outline-variant pb-2">Bottom CTA Section Control</h3>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">CTA Title</label>
            <input
              type="text"
              name="callToActionTitle"
              placeholder="e.g. Your Next Opportunity Starts With Better Communication."
              value={formData.callToActionTitle}
              onChange={handleChange}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">CTA Subtitle</label>
            <textarea
              rows={2}
              name="callToActionSubtitle"
              placeholder="e.g. Schedule an in-person or virtual speech evaluation..."
              value={formData.callToActionSubtitle}
              onChange={handleChange}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
        </div>

        {/* INSTITUTE CONTACT & FOOTER CRM */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-space-md">
          <h3 className="font-headline-sm text-primary border-b border-outline-variant pb-2">Institute & Contact Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface">Institute Name</label>
              <input
                type="text"
                name="instituteName"
                placeholder="Elite Vertex"
                value={formData.instituteName}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface">Contact Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface">Contact Email</label>
              <input
                type="email"
                name="email"
                placeholder="admissions@elitevertex.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface">Instagram URL</label>
              <input
                type="text"
                name="instagramUrl"
                placeholder="https://instagram.com/..."
                value={formData.instagramUrl}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="font-label-md text-on-surface">Campus Address</label>
              <textarea
                rows={2}
                name="address"
                placeholder="Campus address..."
                value={formData.address}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary text-on-primary font-label-lg px-space-2xl py-4 rounded-xl hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50"
          >
            {isSaving ? "Saving Settings..." : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
