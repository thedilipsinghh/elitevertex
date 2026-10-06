"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetCampusesQuery, useSubmitContactMutation, useGetWebsiteSettingsQuery } from "@/lib/features/api/apiSlice";

export function ContactContent() {
  const { data: campusesResponse } = useGetCampusesQuery({});
  const { data: settingsResponse } = useGetWebsiteSettingsQuery({});
  const [submitContact, { isLoading: isSubmitting }] = useSubmitContactMutation();

  const apiCampuses = campusesResponse?.data || [];
  const siteSettings = settingsResponse?.data || {};

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [program, setProgram] = useState("");
  const [mode, setMode] = useState("campus");
  const [briefNote, setBriefNote] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !emailAddress) return;

    try {
      await submitContact({
        name: fullName,
        email: emailAddress,
        phone: phoneNumber,
        subject: `Admissions Lead: ${program || 'General'} (${mode})`,
        program,
        mode,
        message: briefNote || "Callback requested for course counselling.",
      }).unwrap();

      setIsSubmitted(true);
      setFullName("");
      setPhoneNumber("");
      setEmailAddress("");
      setProgram("");
      setBriefNote("");
    } catch (err) {
      console.error("Enquiry Submission Error:", err);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <section className="w-full max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop pt-space-xl pb-space-lg">
        <div className="flex flex-col max-w-2xl">
          <div className="flex items-center gap-space-2xs text-secondary mb-space-3xs">
            <span className="font-label-sm text-label-sm uppercase tracking-widest font-semibold">Contact Elite Vertex</span>
            <span className="w-8 h-px bg-secondary opacity-40"></span>
          </div>
          <h1 className="font-headline-lg text-headline-lg md:text-display text-primary tracking-tight font-extrabold mb-space-xs">
            Let’s Start Your Journey.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Visit our flagship campuses in Bengaluru and Delhi, or connect directly with our academic admissions desk for structured guidance.
          </p>
        </div>
      </section>
      
      <section className="w-full max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop pb-space-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-2xs">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-bold">Academic Direct Lines</span>
                <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary bg-surface-container-low px-space-2xs py-1 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span> Desk Active
                </span>
              </div>
              <div className="space-y-space-sm">
                <div className="flex items-start gap-space-xs">
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 mt-0.5 text-primary">
                    <span className="material-symbols-outlined text-[20px]">call</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Direct Admissions Line</span>
                    <a className="font-headline-sm text-headline-sm text-primary font-bold hover:text-secondary transition-colors" href="tel:+918049208800">
                      +91 (80) 4920-8800
                    </a>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Toll-free priority switchboard</span>
                  </div>
                </div>
                <div className="flex items-start gap-space-xs">
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 mt-0.5 text-primary">
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">WhatsApp Admissions Direct</span>
                    <a className="font-body-lg text-body-lg font-bold text-on-surface hover:text-secondary transition-colors" href="https://wa.me/919845012345" rel="noopener noreferrer" target="_blank">
                      +91 98450 12345
                    </a>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Instant syllabus &amp; batch schedules</span>
                  </div>
                </div>
                <div className="flex items-start gap-space-xs">
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 mt-0.5 text-primary">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Admissions Office</span>
                    <a className="font-body-md text-body-md font-semibold text-primary hover:text-secondary transition-colors" href="mailto:admissions@elitevertex.edu.in">
                      admissions@elitevertex.edu.in
                    </a>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[22px] shrink-0">schedule</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-semibold">Desk &amp; Campus Hours</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Mon – Sat • 8:30 AM – 8:00 PM<br/>
                    Sunday • Academic consultations by prior appointment only
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary-container text-on-primary rounded-xl p-space-lg shadow-md flex flex-col gap-space-sm">
              <div className="flex items-center gap-space-2xs text-secondary-fixed">
                <span className="material-symbols-outlined text-[22px]">record_voice_over</span>
                <span className="font-label-sm text-label-sm uppercase tracking-widest font-bold">Direct Campus Diagnostic</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-semibold tracking-tight text-surface">
                Walk-in Speaking Appraisal
              </h3>
              <p className="font-body-sm text-body-sm text-on-primary-container leading-relaxed">
                Take a complimentary 20-minute verbal baseline test with a faculty speech coach. Receive instant phonetic feedback and a structured band roadmap.
              </p>
              <div className="flex items-center gap-2 pt-space-3xs text-secondary-fixed font-label-md text-label-md uppercase tracking-wider">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>No reservation required during open hours</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
              {apiCampuses.length > 0 ? (
                apiCampuses.map((item: any, idx: number) => (
                  <div key={item.id} className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold mb-1">Centre 0{idx + 1}</span>
                      <h4 className="font-headline-sm text-headline-sm font-bold text-primary mb-space-3xs">{item.name}</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {item.address}
                      </p>
                    </div>
                    {item.metroAccess && (
                      <div className="mt-space-md pt-space-xs flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[16px] text-primary">directions_subway</span>
                        <span>{item.metroAccess}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold mb-1">Centre 01</span>
                      <h4 className="font-headline-sm text-headline-sm font-bold text-primary mb-space-3xs">Bengaluru</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Ground &amp; 2nd Floor, Apex Tower, M.G. Road, Bengaluru 560001
                      </p>
                    </div>
                    <div className="mt-space-md pt-space-xs flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px] text-primary">directions_subway</span>
                      <span>120m from M.G. Road Metro</span>
                    </div>
                  </div>
                  
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold mb-1">Centre 02</span>
                      <h4 className="font-headline-sm text-headline-sm font-bold text-primary mb-space-3xs">New Delhi</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Statesman House, Barakhamba Road, Connaught Place, New Delhi 110001
                      </p>
                    </div>
                    <div className="mt-space-md pt-space-xs flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px] text-primary">directions_subway</span>
                      <span>Direct Barakhamba Gate 4 Access</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-xl shadow-sm">
              <div className="flex flex-col mb-space-md">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-bold">Academic Registry</span>
                </div>
                <h2 className="font-headline-lg text-headline-md md:text-headline-lg font-bold text-primary tracking-tight">
                  Request an Admissions Callback
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Our academic advisors evaluate your current communication proficiency and suggest targeted course pathways.
                </p>
              </div>
              
              <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold" htmlFor="fullName">
                      Full Name <span className="text-secondary">*</span>
                    </label>
                    <input
                      className="w-full bg-surface-container-low focus:bg-surface-container-lowest px-4 py-3 rounded text-body-md font-body-md text-on-surface placeholder:text-outline-variant outline-none transition-all duration-150 focus:shadow-inner"
                      id="fullName"
                      name="fullName"
                      placeholder="e.g. Dr. Alistair Menon"
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold" htmlFor="phoneNumber">
                      Phone Number <span className="text-secondary">*</span>
                    </label>
                    <input
                      className="w-full bg-surface-container-low focus:bg-surface-container-lowest px-4 py-3 rounded text-body-md font-body-md text-on-surface placeholder:text-outline-variant outline-none transition-all duration-150 focus:shadow-inner"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="+91 90000 00000"
                      required
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold" htmlFor="emailAddress">
                    Email Address <span className="text-secondary">*</span>
                  </label>
                  <input
                    className="w-full bg-surface-container-low focus:bg-surface-container-lowest px-4 py-3 rounded text-body-md font-body-md text-on-surface placeholder:text-outline-variant outline-none transition-all duration-150 focus:shadow-inner"
                    id="emailAddress"
                    name="emailAddress"
                    placeholder="name@organization.com"
                    required
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold" htmlFor="program">
                      Program of Interest <span className="text-secondary">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="w-full appearance-none bg-surface-container-low focus:bg-surface-container-lowest px-4 py-3 pr-10 rounded text-body-md font-body-md text-on-surface outline-none transition-all duration-150 cursor-pointer"
                        id="program"
                        name="program"
                        required
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                      >
                        <option disabled value="">Select curriculum pathway</option>
                        <option value="spoken-english">Spoken English Mastery</option>
                        <option value="interview-skills">Executive Interview &amp; Pitching Skills</option>
                        <option value="personality-dev">Personality &amp; Public Presence</option>
                        <option value="business-english">Business English &amp; Corporate Oratory</option>
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                        expand_more
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold">
                      Preferred Mode <span className="text-secondary">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 h-[48px]">
                      <label className={`flex items-center justify-center gap-2 rounded cursor-pointer transition-all duration-150 px-2 ${mode === 'campus' ? 'bg-primary text-on-primary' : 'bg-surface-container-low'}`}>
                        <input className="sr-only" name="mode" type="radio" value="campus" checked={mode === 'campus'} onChange={() => setMode('campus')}/>
                        <span className="material-symbols-outlined text-[18px]">domain</span>
                        <span className="font-label-md text-label-md uppercase tracking-wider font-semibold">Campus</span>
                      </label>
                      <label className={`flex items-center justify-center gap-2 rounded cursor-pointer transition-all duration-150 px-2 ${mode === 'online' ? 'bg-primary text-on-primary' : 'bg-surface-container-low'}`}>
                        <input className="sr-only" name="mode" type="radio" value="online" checked={mode === 'online'} onChange={() => setMode('online')}/>
                        <span className="material-symbols-outlined text-[18px]">videocam</span>
                        <span className="font-label-md text-label-md uppercase tracking-wider font-semibold">Online Live</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold" htmlFor="briefNote">
                    Brief Note or Current Communication Challenge
                  </label>
                  <textarea
                    className="w-full bg-surface-container-low focus:bg-surface-container-lowest px-4 py-3 rounded text-body-md font-body-md text-on-surface placeholder:text-outline-variant outline-none transition-all duration-150 resize-none focus:shadow-inner"
                    id="briefNote"
                    name="briefNote"
                    placeholder="Share your current focus areas..."
                    rows={4}
                    value={briefNote}
                    onChange={(e) => setBriefNote(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-sm pt-space-xs">
                  <button
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md uppercase tracking-widest px-8 py-3.5 rounded-lg transition-colors duration-150 shadow-sm disabled:opacity-50"
                    type="submit"
                  >
                    <span>{isSubmitting ? "Sending..." : "Send Enquiry"}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                  <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[18px] text-primary">security</span>
                    <span>No spam. Strictly academic alignment.</span>
                  </div>
                </div>
                
                {isSubmitted && (
                  <div className="mt-space-xs p-space-sm bg-surface-container-high rounded-lg flex items-center gap-3 text-on-surface">
                    <span className="material-symbols-outlined text-secondary text-[24px]">task_alt</span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md uppercase tracking-wider font-bold">Enquiry Registered</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">An academic counsellor will reach you via call or WhatsApp within 2 business hours.</span>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
      
      <section className="w-full max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop pb-space-3xl">
        <div className="flex flex-col gap-space-md">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-xs pb-space-2xs">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">Transit &amp; Parking</span>
              <h3 className="font-headline-lg text-headline-md md:text-headline-lg font-bold text-primary tracking-tight">
                Campus Access &amp; Locations
              </h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
              Both facilities are situated directly adjacent to core transit arteries with dedicated multi-level subterranean visitor parking.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="w-full h-64 bg-cover bg-center relative bg-surface-container bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=12.9715987,77.5945627&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C12.9715987,77.5945627&key=YOUR_API_KEY_HERE')]">
                <div className="absolute inset-0 bg-primary/10"></div>
                <div className="absolute top-4 left-4 bg-surface-container-lowest/95 backdrop-blur-none px-3 py-1.5 rounded shadow-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-primary">Bengaluru Flagship</span>
                </div>
                <div className="absolute bottom-4 right-4 bg-primary text-on-primary px-3 py-1 rounded text-label-sm font-label-sm tracking-wider uppercase">
                  Apex Tower
                </div>
              </div>
              <div className="p-space-md flex flex-col gap-space-sm flex-1 justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-headline-sm text-headline-sm font-bold text-primary">M.G. Road Campus</h4>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Karnataka</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Ground &amp; 2nd Floor, Apex Tower, M.G. Road, Bengaluru 560001
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-space-xs pt-space-2xs bg-surface-container-low p-space-sm rounded-lg text-on-surface">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">train</span>
                    <div className="flex flex-col leading-tight">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">M.G. Road Metro</span>
                      <span className="font-body-sm text-[12px] text-on-surface-variant">Purple Line (Exit C)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">local_parking</span>
                    <div className="flex flex-col leading-tight">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">Valet &amp; Basements</span>
                      <span className="font-body-sm text-[12px] text-on-surface-variant">Levels B1 – B3 reserved</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-space-3xs text-on-surface-variant font-body-sm text-body-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-primary">navigation</span>
                    Landmark: Opposite Cauvery Arts Emporium
                  </span>
                  <a className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold hover:underline" href="https://maps.google.com" rel="noopener noreferrer" target="_blank">
                    Get Directions →
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="w-full h-64 bg-cover bg-center relative bg-surface-container bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=28.6293,77.2223&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C28.6293,77.2223&key=YOUR_API_KEY_HERE')]">
                <div className="absolute inset-0 bg-primary/10"></div>
                <div className="absolute top-4 left-4 bg-surface-container-lowest/95 backdrop-blur-none px-3 py-1.5 rounded shadow-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-primary">New Delhi Centre</span>
                </div>
                <div className="absolute bottom-4 right-4 bg-primary text-on-primary px-3 py-1 rounded text-label-sm font-label-sm tracking-wider uppercase">
                  Statesman House
                </div>
              </div>
              <div className="p-space-md flex flex-col gap-space-sm flex-1 justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-headline-sm text-headline-sm font-bold text-primary">Connaught Place Campus</h4>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">NCR</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Statesman House, Barakhamba Road, Connaught Place, New Delhi 110001
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-space-xs pt-space-2xs bg-surface-container-low p-space-sm rounded-lg text-on-surface">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">train</span>
                    <div className="flex flex-col leading-tight">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">Barakhamba Metro</span>
                      <span className="font-body-sm text-[12px] text-on-surface-variant">Blue Line (Gate No. 4)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">local_parking</span>
                    <div className="flex flex-col leading-tight">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">Multi-tier Parking</span>
                      <span className="font-body-sm text-[12px] text-on-surface-variant">Automated campus bay</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-space-3xs text-on-surface-variant font-body-sm text-body-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-primary">navigation</span>
                    Landmark: Radial Junction 2, Inner Circle
                  </span>
                  <a className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold hover:underline" href="https://maps.google.com" rel="noopener noreferrer" target="_blank">
                    Get Directions →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="w-full bg-surface-container-low py-space-2xl">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="bg-surface-container-lowest rounded-xl p-space-lg md:p-space-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-lg text-center md:text-left">
            <div className="flex flex-col max-w-xl">
              <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold mb-space-3xs">
                Institutional Commitment
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight mb-space-2xs">
                We’re Ready to Help You Take the Next Step.
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Speak With Confidence. Rise With Communication.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-space-sm shrink-0">
              <a className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-on-surface text-on-primary font-label-md text-label-md uppercase tracking-wider px-space-lg py-space-xs rounded-lg transition-colors duration-150" href="tel:+918049208800">
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span>Call Admissions</span>
              </a>
              <Link className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md uppercase tracking-wider px-space-lg py-space-xs rounded-lg transition-colors duration-150" href="#contactForm">
                <span>Fill Callback Form</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
