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
    whatsapp: "",
    email: "",
    address: "",
    workingHours: "",
    googleMapsUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    footerText: "",
    contactTagline: "",
    contactTitle: "",
    contactSubtitle: "",
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
        whatsapp: response.data.whatsapp || "",
        email: response.data.email || "",
        address: response.data.address || "",
        workingHours: response.data.workingHours || "",
        googleMapsUrl: response.data.googleMapsUrl || "",
        facebookUrl: response.data.facebookUrl || "",
        instagramUrl: response.data.instagramUrl || "",
        footerText: response.data.footerText || "",
        contactTagline: response.data.contactTagline || "",
        contactTitle: response.data.contactTitle || "",
        contactSubtitle: response.data.contactSubtitle || "",
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
      setMessage("✓ Website & Contact Page CMS Settings saved successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save settings.");
    }
  };

  if (isLoading) return <p className="text-on-surface-variant">Loading settings CMS...</p>;

  return (
    <div className="flex flex-col gap-space-xl max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface font-extrabold">Website & Contact Page CMS</h1>
        <p className="text-body-md text-on-surface-variant">Manage all hero copy, contact page content, hotline numbers, working hours, and map links directly.</p>
      </div>

      {message && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-4 rounded-xl font-label-md font-bold">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-space-xl">
        
        {/* CONTACT PAGE CMS CONTROL */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-space-md">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <div className="flex items-center gap-2 text-secondary font-bold text-lg">
              <span className="material-symbols-outlined text-[24px]">contact_support</span>
              <h3>Contact Page Template Control</h3>
            </div>
            <span className="text-xs uppercase tracking-wider bg-secondary/10 text-secondary px-3 py-1 rounded-full font-bold">
              Live Contact CMS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface font-semibold">Contact Kicker / Badge</label>
              <input
                type="text"
                name="contactTagline"
                placeholder="e.g. CONTACT US"
                value={formData.contactTagline}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface font-semibold">Contact Main Headline</label>
              <input
                type="text"
                name="contactTitle"
                placeholder="e.g. We're Here to Help You Start Your Learning Journey"
                value={formData.contactTitle}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="font-label-md text-on-surface font-semibold">Contact Page Subtitle</label>
              <textarea
                rows={2}
                name="contactSubtitle"
                placeholder="e.g. Have questions about our courses or admissions? Get in touch with us..."
                value={formData.contactSubtitle}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
              />
            </div>
          </div>
        </div>

        {/* CONTACT NUMBERS, ADDRESS & HOURS CRM */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-space-md">
          <div className="flex items-center gap-2 text-primary border-b border-outline-variant pb-3 font-bold text-lg">
            <span className="material-symbols-outlined text-[24px]">call</span>
            <h3>Contact Details & Working Hours</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface font-semibold">Phone Helpline *</label>
              <input
                type="text"
                name="phone"
                placeholder="+91 (80) 4920-8800"
                value={formData.phone}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface font-semibold">WhatsApp Helpline *</label>
              <input
                type="text"
                name="whatsapp"
                placeholder="+91 98450 12345"
                value={formData.whatsapp}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface font-semibold">Contact Email *</label>
              <input
                type="email"
                name="email"
                placeholder="admissions@elitevertex.edu.in"
                value={formData.email}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface text-sm"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="font-label-md text-on-surface font-semibold">Campus Address</label>
              <textarea
                rows={2}
                name="address"
                placeholder="42, Apex Tower, M.G. Road, Bengaluru 560001"
                value={formData.address}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface font-semibold">Working Hours</label>
              <textarea
                rows={2}
                name="workingHours"
                placeholder="Mon - Sat: 8:30 AM - 8:00 PM&#10;Sunday: Appointments Only"
                value={formData.workingHours}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface text-sm"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-3">
              <label className="font-label-md text-on-surface font-semibold">Google Maps Directions Link</label>
              <input
                type="text"
                name="googleMapsUrl"
                placeholder="https://maps.google.com/?q=..."
                value={formData.googleMapsUrl}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface text-sm"
              />
            </div>
          </div>
        </div>

        {/* HERO BANNER SECTION CRM */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-space-md">
          <h3 className="font-headline-sm text-primary border-b border-outline-variant pb-2 font-bold">Homepage Hero Banner Control</h3>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-semibold">Tagline Banner</label>
            <input
              type="text"
              name="heroTagline"
              placeholder="e.g. Spoken English • Communication • Career Skills"
              value={formData.heroTagline}
              onChange={handleChange}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-semibold">Hero Headline *</label>
            <input
              type="text"
              name="heroTitle"
              placeholder="e.g. Speak With Confidence. Go Further."
              value={formData.heroTitle}
              onChange={handleChange}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-semibold">Hero Subtitle</label>
            <textarea
              rows={2}
              name="heroSubtitle"
              placeholder="e.g. Build the English, communication skills, and executive confidence..."
              value={formData.heroSubtitle}
              onChange={handleChange}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-secondary text-white font-label-lg px-space-2xl py-4 rounded-xl hover:bg-on-secondary-container transition-colors shadow-md disabled:opacity-50 font-bold"
          >
            {isSaving ? "Saving CMS Changes..." : "Save All CMS Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
