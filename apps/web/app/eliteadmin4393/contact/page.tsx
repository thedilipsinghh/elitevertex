"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useGetAdminSettingsQuery, useUpdateSettingsMutation } from "@/lib/features/api/apiSlice";

export default function AdminContactCmsPage() {
  const { data: response, isLoading } = useGetAdminSettingsQuery({});
  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();

  const [activeTab, setActiveTab] = useState<"hero" | "channels" | "map" | "cta">("hero");
  const [toastMessage, setToastMessage] = useState("");

  const [formData, setFormData] = useState({
    // Header
    contactTagline: "CONTACT US",
    contactTitle: "We're Here to Help You Start Your Learning Journey",
    contactSubtitle: "Have questions about our courses or admissions? Get in touch with us. Our academic team will respond to you shortly.",
    // Channels
    phone: "+91 (80) 4920-8800",
    whatsapp: "+91 98450 12345",
    email: "admissions@elitevertex.edu.in",
    address: "42, Apex Tower, M.G. Road, Bengaluru, Karnataka 560001",
    workingHours: "Mon - Sat: 8:30 AM - 8:00 PM\nSunday: Appointments Only",
    // Map
    googleMapsUrl: "https://maps.google.com/?q=Elite+Vertex+Bengaluru",
    // CTA Banner
    callToActionTitle: "Ready to Start Your Future?",
    callToActionSubtitle: "Join hundreds of students who are building successful careers with Elite Vertex Institute.",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  useEffect(() => {
    if (response?.data) {
      const d = response.data;
      setFormData({
        contactTagline: d.contactTagline || "CONTACT US",
        contactTitle: d.contactTitle || "We're Here to Help You Start Your Learning Journey",
        contactSubtitle: d.contactSubtitle || "Have questions about our courses or admissions? Get in touch with us. Our academic team will respond to you shortly.",
        phone: d.phone || "+91 (80) 4920-8800",
        whatsapp: d.whatsapp || "+91 98450 12345",
        email: d.email || "admissions@elitevertex.edu.in",
        address: d.address || "42, Apex Tower, M.G. Road, Bengaluru, Karnataka 560001",
        workingHours: d.workingHours || "Mon - Sat: 8:30 AM - 8:00 PM\nSunday: Appointments Only",
        googleMapsUrl: d.googleMapsUrl || "https://maps.google.com/?q=Elite+Vertex+Bengaluru",
        callToActionTitle: d.callToActionTitle || "Ready to Start Your Future?",
        callToActionSubtitle: d.callToActionSubtitle || "Join hundreds of students who are building successful careers with Elite Vertex Institute.",
      });
    }
  }, [response]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await updateSettings(formData).unwrap();
      showToast("✓ Contact Page CMS updated and published successfully!");
    } catch (err: any) {
      console.error("Save Error:", err);
      showToast("❌ Failed to save contact settings: " + (err?.data?.message || err.message));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-body-sm text-on-surface-variant font-medium">Loading Contact Page CMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-16 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-secondary text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 font-semibold text-sm border border-secondary">
          <span className="material-symbols-outlined text-[20px]">
            {toastMessage.includes("✓") ? "check_circle" : "error"}
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[28px]">contact_support</span>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface">
              Contact Page CMS Control
            </h1>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            Control all public contact messaging, admissions hotlines, campus address, working hours, interactive map, and response SLA.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/contact"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            Preview Public Page
          </Link>

          <Link
            href="/eliteadmin4393/messages"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">inbox</span>
            View Received Leads
          </Link>

          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-secondary text-white hover:bg-on-secondary-container transition-all text-sm font-bold shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSaving ? "hourglass_empty" : "save"}
            </span>
            <span>{isSaving ? "Publishing..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
            activeTab === "hero"
              ? "bg-secondary text-white"
              : "text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">title</span>
          Hero & Header
        </button>

        <button
          onClick={() => setActiveTab("channels")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
            activeTab === "channels"
              ? "bg-secondary text-white"
              : "text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
          Direct Channels & Campus
        </button>

        <button
          onClick={() => setActiveTab("map")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
            activeTab === "map"
              ? "bg-secondary text-white"
              : "text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">map</span>
          Campus Map & Directions
        </button>

        <button
          onClick={() => setActiveTab("cta")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
            activeTab === "cta"
              ? "bg-secondary text-white"
              : "text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">call_to_action</span>
          Bottom CTA Banner
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 sm:p-8 shadow-sm">
        
        {/* TAB 1: HERO & HEADER */}
        {activeTab === "hero" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold text-on-surface">Hero Section & Headline Copy</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Configure the top announcement badge, primary heading, and narrative shown on the contact page.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Top Tagline Badge
                </label>
                <input
                  type="text"
                  value={formData.contactTagline}
                  onChange={(e) => handleInputChange("contactTagline", e.target.value)}
                  placeholder="e.g. CONTACT US"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-medium focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Main Headline Title
                </label>
                <input
                  type="text"
                  value={formData.contactTitle}
                  onChange={(e) => handleInputChange("contactTitle", e.target.value)}
                  placeholder="e.g. We're Here to Help You Start Your Learning Journey"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-medium focus:outline-none focus:border-secondary"
                />
                <p className="text-[11px] text-on-surface-variant mt-1.5">
                  Tip: Use &quot;Start Your&quot; in the title to automatically style the second half with your brand accent color.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Subtitle Narrative Description
                </label>
                <textarea
                  rows={3}
                  value={formData.contactSubtitle}
                  onChange={(e) => handleInputChange("contactSubtitle", e.target.value)}
                  placeholder="e.g. Have questions about our courses or admissions? Get in touch with us..."
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-medium focus:outline-none focus:border-secondary resize-none"
                />
              </div>
            </div>

            {/* Live Header Preview Card */}
            <div className="mt-4 p-6 bg-surface-container-low rounded-xl border border-outline-variant">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-3">
                Live Public Preview:
              </span>
              <div className="p-6 bg-surface rounded-xl border border-outline-variant">
                <span className="text-xs font-bold tracking-widest text-secondary uppercase block mb-2">
                  {formData.contactTagline || "CONTACT US"}
                </span>
                <h3 className="text-2xl font-extrabold text-on-surface mb-3">
                  {formData.contactTitle || "We're Here to Help You"}
                </h3>
                <p className="text-sm text-on-surface-variant max-w-xl">
                  {formData.contactSubtitle || "Subtitle description appears here."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIRECT CHANNELS & CAMPUS DETAILS */}
        {activeTab === "channels" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold text-on-surface">Direct Contact Channels & Campus Address</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Update public telephone numbers, WhatsApp desk, admissions email, and physical campus location.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  📞 Admissions Hotline / Telephone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+91 (80) 4920-8800"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-medium focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  💬 Official WhatsApp Hotline
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-medium focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  ✉️ Admissions & Inquiries Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="admissions@elitevertex.edu.in"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-medium focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  🕒 Working & Counseling Hours
                </label>
                <textarea
                  rows={2}
                  value={formData.workingHours}
                  onChange={(e) => handleInputChange("workingHours", e.target.value)}
                  placeholder="Mon - Sat: 8:30 AM - 8:00 PM&#10;Sunday: Appointments Only"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-medium focus:outline-none focus:border-secondary resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  📍 Physical Campus Address
                </label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="42, Apex Tower, M.G. Road, Bengaluru, Karnataka 560001"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-medium focus:outline-none focus:border-secondary resize-none"
                />
              </div>
            </div>

            {/* Visual Channel Badges Preview */}
            <div className="mt-4 p-6 bg-surface-container-low rounded-xl border border-outline-variant">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-3">
                Live Channels Preview:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface p-4 rounded-xl border border-outline-variant">
                  <div className="font-bold text-xs text-on-surface mb-1">Our Address</div>
                  <div className="text-xs text-on-surface-variant whitespace-pre-line">{formData.address}</div>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-outline-variant">
                  <div className="font-bold text-xs text-on-surface mb-1">Working Hours</div>
                  <div className="text-xs text-on-surface-variant whitespace-pre-line">{formData.workingHours}</div>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-outline-variant">
                  <div className="font-bold text-xs text-on-surface mb-1">Email Us</div>
                  <div className="text-xs text-secondary font-medium">{formData.email}</div>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-outline-variant">
                  <div className="font-bold text-xs text-on-surface mb-1">Call Us</div>
                  <div className="text-xs text-secondary font-medium">{formData.phone}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CAMPUS MAP & DIRECTIONS */}
        {activeTab === "map" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold text-on-surface">Campus Map & Directions Control</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Set the destination URL for the &quot;Get Directions&quot; button and specify the embed location.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Google Maps URL / Directions Link
                </label>
                <input
                  type="text"
                  value={formData.googleMapsUrl}
                  onChange={(e) => handleInputChange("googleMapsUrl", e.target.value)}
                  placeholder="https://maps.google.com/?q=Elite+Vertex+Bengaluru"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-medium focus:outline-none focus:border-secondary"
                />
                <p className="text-[11px] text-on-surface-variant mt-1.5">
                  When visitors click &quot;Get Directions&quot; on the public contact page, they will be redirected to this Google Maps destination.
                </p>
              </div>

              <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant flex flex-col gap-3">
                <div className="flex items-center gap-2 font-bold text-sm text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[20px]">info</span>
                  <span>Automated Map Geolocation</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  The embedded Google Map on the public contact page automatically pins the exact location specified in your <strong>Physical Campus Address</strong>. When you change the address in the Direct Channels tab, the map instantly synchronizes!
                </p>
                <div className="text-xs font-bold text-secondary">
                  Current Map Pin: {formData.address || "Elite Vertex Campus, Bengaluru"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BOTTOM CTA BANNER */}
        {activeTab === "cta" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold text-on-surface">Bottom Call-to-Action Banner</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Customize the conversion banner displayed at the bottom of the contact page.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Banner Headline
                </label>
                <input
                  type="text"
                  value={formData.callToActionTitle}
                  onChange={(e) => handleInputChange("callToActionTitle", e.target.value)}
                  placeholder="Ready to Start Your Future?"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-medium focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Banner Subtitle
                </label>
                <textarea
                  rows={2}
                  value={formData.callToActionSubtitle}
                  onChange={(e) => handleInputChange("callToActionSubtitle", e.target.value)}
                  placeholder="Join hundreds of students who are building successful careers with Elite Vertex Institute."
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-medium focus:outline-none focus:border-secondary resize-none"
                />
              </div>
            </div>

            {/* Live CTA Preview */}
            <div className="mt-4 p-6 bg-surface-container-low rounded-xl border border-outline-variant">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-3">
                Live Banner Preview:
              </span>
              <div className="p-8 bg-surface rounded-2xl border border-secondary/30 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-xl font-extrabold text-on-surface mb-2">
                    {formData.callToActionTitle}
                  </h4>
                  <p className="text-sm text-on-surface-variant">
                    {formData.callToActionSubtitle}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="px-5 py-2.5 bg-secondary text-white font-bold text-xs rounded-xl">
                    Explore Courses
                  </div>
                  <div className="px-5 py-2.5 border border-secondary text-secondary font-bold text-xs rounded-xl">
                    Talk to an Expert
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Action */}
        <div className="mt-8 pt-6 border-t border-outline-variant flex items-center justify-between">
          <p className="text-xs text-on-surface-variant">
            Changes apply instantly to the public contact page and enquiry routing.
          </p>

          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-secondary text-white hover:bg-on-secondary-container transition-all text-sm font-bold shadow-md disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isSaving ? "hourglass_empty" : "save"}
            </span>
            <span>{isSaving ? "Publishing Settings..." : "Save Contact CMS"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
