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
    socialStickyEnabled: true,
    socialStickyPosition: "right",
    socialStickyOffset: "center",
    socialShowInstagram: true,
    socialShowFacebook: true,
    socialShowWhatsapp: true,
    linkedinUrl: "",
    youtubeUrl: "",
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
        socialStickyEnabled: response.data.socialStickyEnabled !== false,
        socialStickyPosition: response.data.socialStickyPosition || "right",
        socialStickyOffset: response.data.socialStickyOffset || "center",
        socialShowInstagram: response.data.socialShowInstagram !== false,
        socialShowFacebook: response.data.socialShowFacebook !== false,
        socialShowWhatsapp: response.data.socialShowWhatsapp !== false,
        linkedinUrl: response.data.linkedinUrl || "",
        youtubeUrl: response.data.youtubeUrl || "",
      });
    }
  }, [response]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setFormData({ ...formData, [target.name]: value });
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

        {/* VERTICAL FLOATING SOCIAL BAR CMS CONTROL */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-space-md">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <div className="flex items-center gap-2 text-secondary font-bold text-lg">
              <span className="material-symbols-outlined text-[24px]">share</span>
              <h3>Vertical Floating Social Bar (Online Profiles)</h3>
            </div>
            <span className="text-xs uppercase tracking-wider bg-secondary/10 text-secondary px-3 py-1 rounded-full font-bold">
              Sticky Screen Widget
            </span>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            Configure the 3D squircle online profile icons (Instagram, Facebook, WhatsApp) that float persistently on the page. You can adjust screen position (right vs left), vertical offset, and destination URLs.
          </p>

          {/* Master Enable & Position Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md p-4 bg-surface-container-low rounded-xl border border-outline-variant/40">
            <div className="flex flex-col gap-2 justify-center">
              <label className="font-label-md text-on-surface font-bold flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="socialStickyEnabled"
                  checked={formData.socialStickyEnabled}
                  onChange={handleChange}
                  className="w-4 h-4 text-secondary rounded focus:ring-secondary cursor-pointer"
                />
                <span>Enable Floating Social Bar</span>
              </label>
              <span className="text-[11px] text-on-surface-variant">
                Displays the vertical sticky online profile widget on all public pages.
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface font-semibold">
                Screen Side Position
              </label>
              <select
                name="socialStickyPosition"
                value={formData.socialStickyPosition}
                onChange={handleChange}
                disabled={!formData.socialStickyEnabled}
                className="bg-surface-container p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm cursor-pointer disabled:opacity-50"
              >
                <option value="right">Right Side (Standard)</option>
                <option value="left">Left Side</option>
              </select>
              <span className="text-[11px] text-on-surface-variant">
                Which edge of the browser window to pin to.
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface font-semibold">
                Vertical Placement
              </label>
              <select
                name="socialStickyOffset"
                value={formData.socialStickyOffset}
                onChange={handleChange}
                disabled={!formData.socialStickyEnabled}
                className="bg-surface-container p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm cursor-pointer disabled:opacity-50"
              >
                <option value="center">Center / Middle of Screen (Recommended)</option>
                <option value="bottom">Bottom (Lower Third)</option>
                <option value="top">Top (Below Header)</option>
              </select>
              <span className="text-[11px] text-on-surface-variant">
                Vertical height alignment on desktop and mobile.
              </span>
            </div>
          </div>

          {/* Social Channels & URLs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            
            {/* Instagram */}
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center p-1 text-white shadow-xs"
                    style={{ background: "linear-gradient(45deg, #f09433, #dc2743, #bc1888)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="font-bold text-xs text-on-surface">Instagram Profile</span>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-on-surface-variant cursor-pointer">
                  <input
                    type="checkbox"
                    name="socialShowInstagram"
                    checked={formData.socialShowInstagram}
                    onChange={handleChange}
                    className="w-3.5 h-3.5 text-secondary rounded cursor-pointer"
                  />
                  <span>Active</span>
                </label>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant">Profile URL</label>
                <input
                  type="text"
                  name="instagramUrl"
                  placeholder="https://www.instagram.com/elitevertex"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  className="bg-surface-container p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-xs"
                />
              </div>
            </div>

            {/* Facebook */}
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center p-1 text-white shadow-xs"
                    style={{ background: "linear-gradient(180deg, #1877F2, #0F62D4)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03.44-1.5 1.7-1.5H18V2.3A22 22 0 0 0 15.3 2c-3.1 0-5.3 1.9-5.3 5.4v2.1H7v4h3v8.5h4v-8.5Z" />
                    </svg>
                  </div>
                  <span className="font-bold text-xs text-on-surface">Facebook Page</span>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-on-surface-variant cursor-pointer">
                  <input
                    type="checkbox"
                    name="socialShowFacebook"
                    checked={formData.socialShowFacebook}
                    onChange={handleChange}
                    className="w-3.5 h-3.5 text-secondary rounded cursor-pointer"
                  />
                  <span>Active</span>
                </label>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant">Page URL</label>
                <input
                  type="text"
                  name="facebookUrl"
                  placeholder="https://www.facebook.com/elitevertex"
                  value={formData.facebookUrl}
                  onChange={handleChange}
                  className="bg-surface-container p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-xs"
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center p-1 text-white shadow-xs"
                  style={{ background: "#0077B5" }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.95 0-1.72-.78-1.72-1.73a1.73 1.73 0 0 1 1.72-1.72c.96 0 1.73.77 1.73 1.72 0 .95-.77 1.73-1.73 1.73m1.39 9.74v-8.37H5.07v8.37h2.78Z" />
                  </svg>
                </div>
                <span className="font-bold text-xs text-on-surface">LinkedIn Profile</span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant">LinkedIn URL</label>
                <input
                  type="text"
                  name="linkedinUrl"
                  placeholder="https://www.linkedin.com/company/elitevertex"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  className="bg-surface-container p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-xs"
                />
              </div>
            </div>

            {/* YouTube */}
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center p-1 text-white shadow-xs"
                  style={{ background: "#FF0000" }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <span className="font-bold text-xs text-on-surface">YouTube Channel</span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant">Channel URL</label>
                <input
                  type="text"
                  name="youtubeUrl"
                  placeholder="https://www.youtube.com/@elitevertex"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
                  className="bg-surface-container p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-xs"
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center p-1 text-white shadow-xs"
                    style={{ background: "linear-gradient(180deg, #25D366, #1DA851)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Z" />
                    </svg>
                  </div>
                  <span className="font-bold text-xs text-on-surface">WhatsApp Chat</span>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-on-surface-variant cursor-pointer">
                  <input
                    type="checkbox"
                    name="socialShowWhatsapp"
                    checked={formData.socialShowWhatsapp}
                    onChange={handleChange}
                    className="w-3.5 h-3.5 text-secondary rounded cursor-pointer"
                  />
                  <span>Active</span>
                </label>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant">Phone / Direct Link</label>
                <input
                  type="text"
                  name="whatsapp"
                  placeholder="+91 (80) 4920-8800 or https://wa.me/..."
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="bg-surface-container p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-xs"
                />
              </div>
            </div>

          </div>

          {/* Live Preview Box */}
          <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-on-surface">Live Visual Widget Preview</span>
              <span className="text-[11px] text-on-surface-variant">
                Rendered on {formData.socialStickyPosition === "left" ? "Left Edge" : "Right Edge"} • Placement: {formData.socialStickyOffset}
              </span>
            </div>

            <div className="flex items-center gap-2 p-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs">
              {formData.socialShowInstagram && (
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md transition-transform hover:scale-110"
                  style={{ background: "linear-gradient(45deg, #f09433, #dc2743, #bc1888)" }}
                  title="Instagram Squircle"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                  </svg>
                </div>
              )}

              {formData.socialShowFacebook && (
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md transition-transform hover:scale-110"
                  style={{ background: "linear-gradient(180deg, #1877F2, #0F62D4)" }}
                  title="Facebook Squircle"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03.44-1.5 1.7-1.5H18V2.3A22 22 0 0 0 15.3 2c-3.1 0-5.3 1.9-5.3 5.4v2.1H7v4h3v8.5h4v-8.5Z" />
                  </svg>
                </div>
              )}

              {formData.socialShowWhatsapp && (
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md transition-transform hover:scale-110"
                  style={{ background: "linear-gradient(180deg, #25D366, #1DA851)" }}
                  title="WhatsApp Squircle"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Z" />
                  </svg>
                </div>
              )}

              {!formData.socialStickyEnabled && (
                <span className="text-[11px] font-bold text-red-500 px-2">Widget Disabled</span>
              )}
            </div>
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
