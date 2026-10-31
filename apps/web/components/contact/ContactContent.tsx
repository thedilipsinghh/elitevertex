"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useGetWebsiteSettingsQuery,
  useSubmitContactMutation,
  useGetCampusesQuery,
} from "@/lib/features/api/apiSlice";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function ContactContent() {
  const { data: settingsResponse } = useGetWebsiteSettingsQuery({});
  const { data: campusesResponse } = useGetCampusesQuery({});
  const [submitContact, { isLoading: isSubmitting }] = useSubmitContactMutation();

  const siteSettings = settingsResponse?.data || {};
  const campuses: any[] = (campusesResponse?.data || []).filter((c: any) => c.isPublished !== false);

  const phone = siteSettings.phone || "+91 (80) 4920-8800";
  const whatsapp = siteSettings.whatsapp || "+91 98450 12345";
  const email = siteSettings.email || "admissions@elitevertex.edu.in";
  const address = siteSettings.address || "42, Apex Tower, M.G. Road, Bengaluru, Karnataka 560001";
  const workingHours = siteSettings.workingHours || "Mon - Sat: 8:30 AM - 8:00 PM\nSunday: Appointments Only";
  const googleMapsUrl = siteSettings.googleMapsUrl || "https://maps.google.com/?q=Elite+Vertex+Bengaluru";

  const contactTagline = siteSettings.contactTagline || "CONTACT US";
  const contactTitle = siteSettings.contactTitle || "We're Here to Help You Start Your Learning Journey";
  const contactSubtitle = siteSettings.contactSubtitle || "Have questions about our courses or admissions? Get in touch with us. Our academic team will respond to you shortly.";

  const callToActionTitle = siteSettings.callToActionTitle || "Ready to Start Your Future?";
  const callToActionSubtitle = siteSettings.callToActionSubtitle || "Join hundreds of students who are building successful careers with Elite Vertex Institute.";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: "Fluent Spoken English",
    mode: "Classroom / Campus",
    subject: "Admissions Consultation",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setErrorMessage("");

    try {
      await submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        program: formData.program,
        mode: formData.mode,
        subject: formData.subject || "Admissions Consultation",
        message: formData.message.trim() || "Requesting course information and academic counselling callback.",
      }).unwrap();

      setSubmittedEmail(formData.email.trim());
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        program: "Fluent Spoken English",
        mode: "Classroom / Campus",
        subject: "Admissions Consultation",
        message: "",
      });
    } catch (err: any) {
      console.error("Contact Form Submission Error:", err);
      setErrorMessage(
        err?.data?.message || "Unable to send your message at this moment. Please call us directly or try again."
      );
    }
  };

  const mapEmbedUrl =
    googleMapsUrl && googleMapsUrl.includes("maps/embed")
      ? googleMapsUrl
      : `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="w-full flex flex-col font-sans bg-background text-foreground">
      {/* SECTION 1: HERO & CONTACT FORM */}
      <section className="bg-background py-12 lg:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Info & Details */}
          <ScrollReveal direction="up" delay={0} className="z-10 flex flex-col">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/30 text-secondary font-bold tracking-widest text-xs uppercase mb-3 w-fit badge-shimmer">
              <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400 animate-pulse"></span>
              <span>{contactTagline}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
              {contactTitle.includes("Start Your") ? (
                <>
                  {contactTitle.split("Start Your")[0]}
                  <br />
                  <span className="text-secondary">Start Your {contactTitle.split("Start Your")[1]}</span>
                </>
              ) : (
                contactTitle
              )}
            </h1>
            
            <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-lg leading-relaxed font-normal">
              {contactSubtitle}
            </p>

            {/* Quick Contact Info Badges */}
            <div className="flex flex-wrap items-center gap-6 mb-10">
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                className="flex items-center gap-3 hover:opacity-85 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    call
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Call Us</div>
                  <div className="text-xs text-muted-foreground font-medium">{phone}</div>
                </div>
              </a>

              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:opacity-85 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-emerald-600 text-[20px]">
                    chat
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">WhatsApp</div>
                  <div className="text-xs text-muted-foreground font-medium">{whatsapp}</div>
                </div>
              </a>

              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 hover:opacity-85 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-blue-600 text-[20px]">
                    mail
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Email Us</div>
                  <div className="text-xs text-muted-foreground font-medium">{email}</div>
                </div>
              </a>
            </div>

            {/* Feature Highlights Card */}
            <div className="bg-surface-container-low/70 rounded-3xl p-6 sm:p-8 border border-outline-variant/30 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20">
                <span className="material-symbols-outlined text-secondary text-[36px]">
                  school
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 w-full">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">
                    check_circle
                  </span>
                  <span className="text-xs font-semibold text-foreground">24-Hour Lead Response</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">
                    check_circle
                  </span>
                  <span className="text-xs font-semibold text-foreground">1-on-1 Speech Diagnostic</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">
                    check_circle
                  </span>
                  <span className="text-xs font-semibold text-foreground">Admissions Counseling</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">
                    check_circle
                  </span>
                  <span className="text-xs font-semibold text-foreground">Tailored Cohort Matching</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Contact Message Form */}
          <ScrollReveal direction="scale" delay={120} className="w-full id-contact-form" id="contactForm">
            <div className="bg-surface-container-lowest rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-xl border border-outline-variant/30 hover-lift">
              <h3 className="text-xl font-bold text-foreground mb-6">Send Us a Message</h3>

              {errorMessage && (
                <div className="mb-4 bg-error-container text-on-error-container p-4 rounded-xl text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {isSubmitted ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 rounded-2xl p-6 sm:p-8 flex flex-col gap-3">
                  <div className="flex items-center gap-3 font-extrabold text-emerald-800 dark:text-emerald-300 text-lg">
                    <span className="material-symbols-outlined text-[28px] text-emerald-600 dark:text-emerald-400">task_alt</span>
                    <span>Inquiry Received Successfully!</span>
                  </div>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">
                    Thank you for reaching out to <strong>Elite Vertex English Institute</strong>. A confirmation email has been dispatched to <strong>{submittedEmail}</strong>.
                  </p>
                  <div className="p-4 bg-white/70 dark:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                    <strong className="block mb-1 text-emerald-950 dark:text-white uppercase tracking-wider text-[11px]">What Happens Next:</strong>
                    A senior language advisor will review your query and contact you within 24 hours to schedule your complimentary diagnostic speech evaluation.
                  </div>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 underline hover:text-emerald-950 dark:hover:text-white self-start"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Your Full Name <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g. Rahul Sharma"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all placeholder:text-muted-foreground font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Email Address <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="e.g. rahul@example.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all placeholder:text-muted-foreground font-medium"
                      />
                    </div>
                  </div>

                  {/* Phone & Program of Interest */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all placeholder:text-muted-foreground font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Program of Interest
                      </label>
                      <select
                        name="program"
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all font-medium text-foreground cursor-pointer"
                      >
                        <option value="Fluent Spoken English">Fluent Spoken English</option>
                        <option value="Executive Business Communication">Executive Business Communication</option>
                        <option value="Public Speaking & Rhetoric">Public Speaking & Rhetoric</option>
                        <option value="Accent Conditioning & Vocal Dynamics">Accent Conditioning & Vocal Dynamics</option>
                        <option value="IELTS / Academic English Mastery">IELTS / Academic English Mastery</option>
                        <option value="Custom 1-on-1 Executive Coaching">Custom 1-on-1 Executive Coaching</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Learning Mode */}
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Preferred Mode of Training
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Classroom / Campus", "Live Online", "Hybrid Cohort"].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setFormData({ ...formData, mode: m })}
                          className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                            formData.mode === m
                              ? "bg-secondary text-white border-secondary"
                              : "bg-surface-container-low border-outline-variant/40 text-foreground hover:bg-surface-container"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Subject / Inquiry Reason
                    </label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="e.g. Seeking batch timings and fee schedule"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all placeholder:text-muted-foreground font-medium"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Your Message or Questions <span className="text-secondary">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Share your learning goals, current challenges with spoken English, or convenient callback timing..."
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all placeholder:text-muted-foreground font-medium resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-secondary hover:bg-on-secondary-container text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-1 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    )}
                    <span>{isSubmitting ? "Sending Inquiry..." : "Submit Inquiry"}</span>
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground">
                    <span className="material-symbols-outlined text-[16px]">
                      lock
                    </span>
                    <span className="text-xs font-medium">Your data is confidential. We will never share or sell your details.</span>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* SECTION 2: 4 CONTACT DETAILS CARDS GRID */}
      <section className="py-12 lg:py-16 bg-surface-container-low/60 border-y border-outline-variant/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Our Address */}
            <ScrollReveal direction="up" delay={0}>
              <div className="bg-surface-container-lowest p-7 rounded-2xl border border-outline-variant/30 shadow-xs flex items-start gap-4 hover-lift h-full">
                <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20">
                  <span className="material-symbols-outlined text-secondary text-[22px]">
                    location_on
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-1">Our Address</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium whitespace-pre-line">
                    {address}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2: Working Hours */}
            <ScrollReveal direction="up" delay={80}>
              <div className="bg-surface-container-lowest p-7 rounded-2xl border border-outline-variant/30 shadow-xs flex items-start gap-4 hover-lift h-full">
                <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20">
                  <span className="material-symbols-outlined text-secondary text-[22px]">
                    schedule
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-1">Working Hours</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium whitespace-pre-line">
                    {workingHours}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3: Email Us */}
            <ScrollReveal direction="up" delay={160}>
              <div className="bg-surface-container-lowest p-7 rounded-2xl border border-outline-variant/30 shadow-xs flex items-start gap-4 hover-lift h-full">
                <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20">
                  <span className="material-symbols-outlined text-secondary text-[22px]">
                    mail
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-1">Email Us</h3>
                  <a
                    href={`mailto:${email}`}
                    className="text-xs text-muted-foreground hover:text-secondary transition-colors font-medium break-all"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 4: Call Us */}
            <ScrollReveal direction="up" delay={240}>
              <div className="bg-surface-container-lowest p-7 rounded-2xl border border-outline-variant/30 shadow-xs flex items-start gap-4 hover-lift h-full">
                <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20">
                  <span className="material-symbols-outlined text-secondary text-[22px]">
                    call
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-1">Call Us</h3>
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                    className="text-xs text-muted-foreground hover:text-secondary transition-colors font-medium"
                  >
                    {phone}
                  </a>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* SECTION 2.5: CAMPUS LOCATIONS DIRECTORY */}
      {campuses.length > 0 && (
        <section className="py-12 lg:py-16 bg-background border-b border-outline-variant/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col items-center text-center mb-10">
              <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">
                INSTITUTE BRANCHES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Visit Our Campus Locations
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm mt-2 max-w-xl">
                Walk into any of our learning centers for a complimentary diagnostic voice evaluation and personalized batch counseling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campuses.map((c: any, idx: number) => (
                <ScrollReveal key={c.id || idx} direction="up" delay={idx * 80}>
                  <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs hover:shadow-md transition-all hover-lift flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-secondary/10 text-secondary border border-secondary/20">
                          {c.city}
                        </span>
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Admissions Open</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-foreground text-lg mb-2 leading-snug">
                        {c.name}
                      </h3>

                      <p className="text-xs text-muted-foreground leading-relaxed font-medium mb-4">
                        {c.address}
                      </p>

                      <div className="space-y-1.5 pt-3 border-t border-outline-variant/30 text-xs text-muted-foreground">
                        {c.landmark && (
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] text-secondary shrink-0 mt-0.5">near_me</span>
                            <span><strong>Landmark:</strong> {c.landmark}</span>
                          </div>
                        )}
                        {c.metroAccess && (
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] text-secondary shrink-0 mt-0.5">directions_subway</span>
                            <span><strong>Transit:</strong> {c.metroAccess}</span>
                          </div>
                        )}
                        {c.parkingInfo && (
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] text-secondary shrink-0 mt-0.5">local_parking</span>
                            <span>{c.parkingInfo}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-outline-variant/30 flex items-center justify-between">
                      <a
                        href={c.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(c.address + " " + c.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary hover:text-on-secondary-container transition-colors"
                      >
                        <span>Open in Maps</span>
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                      </a>

                      <a
                        href={`https://wa.me/${(whatsapp || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello Elite Vertex, I would like to visit the ${c.name} campus.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800"
                      >
                        <span className="material-symbols-outlined text-[14px]">chat</span>
                        <span>WhatsApp Desk</span>
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: MAP LOCATION & DIRECTIONS */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="w-full h-[420px] bg-surface-container-low rounded-[2rem] overflow-hidden relative border border-outline-variant/30 shadow-md">
            
            {/* Google Map Embed */}
            <iframe
              title="Elite Vertex Campus Location"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full filter contrast-[1.02]"
            ></iframe>

            {/* Floating Location Card Overlay */}
            <div className="absolute top-6 left-6 sm:top-10 sm:left-10 bg-surface-container-lowest/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl border border-outline-variant/40 max-w-[320px] z-10">
              <h3 className="text-xl font-bold text-foreground mb-3">Find Us Here</h3>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed font-medium whitespace-pre-line">
                {address}
              </p>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider w-full bg-primary text-on-primary py-3.5 rounded-xl shadow-md hover:bg-on-surface transition-all"
              >
                <span>Get Directions</span>
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: CALL TO ACTION BANNER */}
      <section className="py-12 lg:py-20 pb-24 bg-surface-container-low/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-secondary/5 rounded-[32px] border border-secondary/20 flex flex-col md:flex-row items-center overflow-hidden shadow-sm">
            
            {/* Visual Icon Column */}
            <div className="w-full md:w-4/12 h-56 md:h-auto min-h-[260px] bg-secondary/10 flex items-center justify-center p-8">
              <div className="w-24 h-24 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-secondary text-[48px]">
                  rocket_launch
                </span>
              </div>
            </div>

            {/* Content Column */}
            <div className="w-full md:w-8/12 p-8 lg:p-14 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
                {callToActionTitle}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-md mx-auto md:mx-0 leading-relaxed font-normal">
                {callToActionSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold text-sm rounded-xl px-8 py-3.5 shadow-md hover:bg-on-secondary-container transition-all hover:-translate-y-0.5"
                >
                  <span>Explore Courses</span>
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>
                <a
                  href="#contactForm"
                  className="inline-flex items-center justify-center gap-2 border border-secondary/30 text-secondary hover:bg-secondary/10 bg-surface-container-lowest font-bold text-sm rounded-xl px-8 py-3.5 shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <span>Talk to an Expert</span>
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
