"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLazyVerifyCertificateQuery, useGetWebsiteSettingsQuery } from "@/lib/features/api/apiSlice";
import { CertificateTemplate, CertificateData, downloadCertificateImage } from "@/components/certificate/CertificateTemplate";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function VerifyCertificateContent() {
  const searchParams = useSearchParams();
  const urlId = searchParams?.get("id") || "";

  const { data: settingsResponse, isLoading: isSettingsLoading } = useGetWebsiteSettingsQuery({});
  const settings = settingsResponse?.data || {};

  const showcaseEnabled = settings.certShowcaseEnabled !== false;
  const showcaseTitle = settings.certShowcaseTitle || "Official Institutional Attestation";
  const showcaseSubtitle = settings.certShowcaseSubtitle || "Tamper-proof verifiable credentials backed by central academic registrar ledger.";
  const showcaseBadge = settings.certShowcaseBadgeText || "OFFICIAL SPECIMEN";
  const showcaseStudent = settings.certShowcaseStudentName || "Aditi Sharma";
  const showcaseCourse = settings.certShowcaseCourseName || "Executive Spoken English & Global Communication";
  const showcaseNumber = settings.certShowcaseCertNumber || "EV-2025-ENG-8492";
  const showcaseDate = settings.certShowcaseIssueDate || "14 Nov 2025";
  const showcaseGrade = settings.certShowcaseGrade || "Distinction (CEFR C1)";

  const showcaseCertData: CertificateData = {
    certificateNumber: showcaseNumber,
    studentName: showcaseStudent,
    courseName: showcaseCourse,
    issueDate: showcaseDate,
    grade: showcaseGrade,
    status: "valid",
    signatory1: {
      name: settings.certSig1Name || "Dr. Aris Thorne",
      title: settings.certSig1Title || "Authorized Signatory",
      signUrl: settings.certSig1Sign || "",
    },
    signatory2: {
      name: settings.certSig2Name || "Prof. Marcus Vance",
      title: settings.certSig2Title || "Director / Principal",
      signUrl: settings.certSig2Sign || "",
    },
  };

  const [certId, setCertId] = useState(urlId || showcaseNumber);
  const [triggerVerify, { isLoading }] = useLazyVerifyCertificateQuery();

  const [hasSearched, setHasSearched] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [certData, setCertData] = useState<CertificateData | null>(null);
  const [searchedId, setSearchedId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);

  const loading = isVerifying || isLoading;

  const executeVerification = async (targetId: string) => {
    const query = targetId.trim().toUpperCase();
    if (!query) return;

    setHasSearched(true);
    setSearchedId(query);
    setCertData(null); // Clear previous certificate immediately
    setIsVerifying(true);

    // Smooth scroll to result section
    setTimeout(() => {
      const el = document.getElementById("verification-result");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
    setCertData(null); // Clear previous certificate immediately
    setIsVerifying(true);

    try {
      const res = await triggerVerify(query, true).unwrap();
      if (res?.data) {
        setCertData({
          studentName: res.data.studentName,
          certificateNumber: res.data.certificateNumber,
          courseName: res.data.courseName,
          issueDate: res.data.issueDate,
          grade: res.data.grade,
          customNote: res.data.customNote,
          status: res.data.status,
          signatory1: res.data.signatory1,
          signatory2: res.data.signatory2,
        });
      } else {
        setCertData(null);
      }
    } catch {
      setCertData(null);
    } finally {
      setIsVerifying(false);
    }
  };

  // If URL has ?id=..., auto trigger verification on load
  useEffect(() => {
    if (urlId) {
      setCertId(urlId);
      executeVerification(urlId);
    }
  }, [urlId]);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeVerification(certId);
  };

  const loadDemo = (id: string) => {
    setCertId(id);
    executeVerification(id);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const activeNumber = certData?.certificateNumber || certId.trim().toUpperCase();
      const shareUrl = `${window.location.origin}/verify-certificate?id=${encodeURIComponent(activeNumber)}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="flex flex-col w-full font-sans bg-background text-foreground">
      {/* Print-specific style override */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-certificate-container,
          #printable-certificate-container * {
            visibility: visible;
          }
          #printable-certificate-container {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 0;
            background: white;
            z-index: 99999;
          }
          @page {
            size: landscape;
            margin: 0;
          }
        }
      `}</style>

      {/* SECTION 1: SEARCH HEADER & SHOWCASE HERO */}
      <section className="w-full bg-background py-12 md:py-20 border-b border-outline-variant/30 print:hidden relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="pointer-events-none absolute top-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-secondary/5 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-amber-500/5 blur-[120px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {showcaseEnabled ? (
            /* SPLIT HERO: LEFT FORM & RIGHT SPECIMEN PARCHMENT */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* LEFT COLUMN: TITLE, BADGE, SEARCH FORM */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <ScrollReveal direction="up">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-bold text-xs uppercase tracking-widest mb-3.5">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>ACADEMIC REGISTRY &bull; ISO 9001:2015</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                    {showcaseTitle}
                  </h1>

                  <p className="text-muted-foreground text-sm sm:text-base mt-3 leading-relaxed">
                    {showcaseSubtitle}
                  </p>
                </ScrollReveal>

                {/* The Search Form */}
                <ScrollReveal direction="up" delay={100}>
                  <div className="bg-surface-container-lowest p-6 sm:p-7 rounded-2xl shadow-xl border border-outline-variant/40 flex flex-col gap-4">
                    <form onSubmit={handleVerify} className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="certIdInput"
                          className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                        >
                          Certificate Credential ID
                        </label>
                        <span className="text-[11px] text-secondary font-semibold">
                          Case-Insensitive
                        </span>
                      </div>

                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-secondary text-[22px] pointer-events-none">
                          pin
                        </span>
                        <input
                          id="certIdInput"
                          type="text"
                          required
                          placeholder="e.g., EV-2025-ENG-8492"
                          value={certId}
                          onChange={(e) => setCertId(e.target.value.toUpperCase())}
                          className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low font-mono font-bold text-foreground text-sm sm:text-base rounded-xl border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all uppercase placeholder:normal-case placeholder:font-sans"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-secondary hover:bg-on-secondary-container text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-1 btn-press"
                      >
                        {loading ? (
                          <svg className="animate-spin h-5 w-5 text-white mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                          </svg>
                        ) : (
                          <span className="material-symbols-outlined text-[20px]">verified_user</span>
                        )}
                        <span>{loading ? "Verifying Registry..." : "Verify Certificate"}</span>
                      </button>
                    </form>

                    {/* Quick Demo Presets */}
                    <div className="pt-2 flex flex-wrap items-center justify-start gap-2 text-xs text-muted-foreground border-t border-outline-variant/30">
                      <span className="font-bold uppercase tracking-wider text-[11px]">Quick Try:</span>
                      <button
                        type="button"
                        onClick={() => loadDemo(showcaseNumber)}
                        className="font-mono text-secondary hover:underline font-bold transition-transform active:scale-95"
                      >
                        {showcaseNumber}
                      </button>
                      <span>&bull;</span>
                      <button
                        type="button"
                        onClick={() => loadDemo("EV-2026-ENG-9014")}
                        className="font-mono text-secondary hover:underline font-bold transition-transform active:scale-95"
                      >
                        EV-2026-ENG-9014
                      </button>
                      <span>&bull;</span>
                      <button
                        type="button"
                        onClick={() => loadDemo("EV-INVALID-0000")}
                        className="text-error hover:underline transition-transform active:scale-95"
                      >
                        Invalid ID Demo
                      </button>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Trust Highlights Row */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-foreground text-xs">
                      <span className="material-symbols-outlined text-emerald-500 text-[16px]">verified</span>
                      <span>Attested</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground leading-tight">ISO 9001:2015</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-foreground text-xs">
                      <span className="material-symbols-outlined text-secondary text-[16px]">fingerprint</span>
                      <span>Tamper-Proof</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground leading-tight">Cryptographic Ledger</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-foreground text-xs">
                      <span className="material-symbols-outlined text-primary text-[16px]">public</span>
                      <span>Global Proof</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground leading-tight">Employer Accepted</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: SHOWCASE CERTIFICATE PARCHMENT */}
              <ScrollReveal direction="up" delay={150} className="lg:col-span-6 flex flex-col gap-3.5">
                <div className="relative group rounded-3xl p-3 sm:p-4 bg-gradient-to-br from-amber-500/10 via-secondary/5 to-primary/10 border border-secondary/25 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col gap-3">
                  
                  {/* Floating Header Badge */}
                  <div className="flex items-center justify-between px-1 text-xs">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-white font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{showcaseBadge}</span>
                    </div>

                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                      <span className="material-symbols-outlined text-[16px] text-emerald-500">verified</span>
                      <span>OFFICIAL ACADEMIC CREDENTIAL</span>
                    </div>
                  </div>

                  {/* High-Resolution Certificate Parchment Card */}
                  <div
                    onClick={() => setInspectModalOpen(true)}
                    className="relative cursor-pointer rounded-2xl overflow-hidden shadow-lg border border-outline-variant/60 transition-transform duration-300 group-hover:scale-[1.01] bg-white"
                    title="Click to inspect high-resolution parchment"
                  >
                    <CertificateTemplate data={showcaseCertData} className="w-full h-auto" />
                    
                    {/* Hover Inspection Overlay */}
                    <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-2xs">
                      <div className="px-4 py-2 rounded-xl bg-surface/95 text-foreground text-xs font-bold shadow-xl flex items-center gap-2 border border-outline-variant/60">
                        <span className="material-symbols-outlined text-[18px] text-secondary">zoom_in</span>
                        <span>Click to Inspect High-Res Parchment</span>
                      </div>
                    </div>
                  </div>

                  {/* Specimen Credentials Footer Strip */}
                  <div className="pt-2 border-t border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 font-bold text-foreground truncate">
                        <span className="truncate">{showcaseStudent}</span>
                        <span className="text-muted-foreground font-normal">&bull;</span>
                        <span className="font-mono text-secondary text-[11px] font-bold shrink-0">{showcaseNumber}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground truncate">{showcaseCourse}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setCertId(showcaseNumber);
                          executeVerification(showcaseNumber);
                        }}
                        className="px-3.5 py-1.5 bg-secondary hover:bg-on-secondary-container text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 btn-press"
                      >
                        <span className="material-symbols-outlined text-[15px]">verified</span>
                        <span>Verify This Specimen</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setInspectModalOpen(true)}
                        className="px-3 py-1.5 bg-surface-container-low hover:bg-surface-container text-foreground font-semibold text-xs rounded-lg border border-outline-variant/40 transition-colors flex items-center gap-1 btn-press"
                        title="Inspect High-Resolution Parchment"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        <span className="hidden sm:inline">Inspect</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Micro Security Badges */}
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-muted-foreground">
                  <div className="p-2 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[15px]">military_tech</span>
                    <span>Gold Foil Seal</span>
                  </div>
                  <div className="p-2 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[15px]">qr_code_2</span>
                    <span>QR Verification</span>
                  </div>
                  <div className="p-2 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[15px]">school</span>
                    <span>CEFR Attested</span>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          ) : (
            /* CENTERED FALLBACK HERO WHEN SHOWCASE IS DISABLED BY ADMIN */
            <div>
              <ScrollReveal direction="up" className="max-w-3xl mx-auto text-center flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-bold text-xs uppercase tracking-widest mb-3">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>ACADEMIC REGISTRY &bull; ISO 9001:2015</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                  Verify an Elite Vertex Certificate
                </h1>
                
                <p className="text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
                  Enter the official credential ID printed on physical parchments or digital completion records to verify authentic institutional attestation.
                </p>
              </ScrollReveal>

              {/* Centered Search Box */}
              <ScrollReveal direction="scale" delay={120} className="mt-8 max-w-xl mx-auto">
                <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-xl border border-outline-variant/30 flex flex-col gap-4 hover-lift">
                  <form onSubmit={handleVerify} className="flex flex-col gap-3">
                    <label
                      htmlFor="certIdInputCentered"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-left"
                    >
                      Certificate Credential ID
                    </label>
                    
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-secondary text-[22px] pointer-events-none">
                        pin
                      </span>
                      <input
                        id="certIdInputCentered"
                        type="text"
                        required
                        placeholder="e.g., EV-2025-ENG-8492"
                        value={certId}
                        onChange={(e) => setCertId(e.target.value.toUpperCase())}
                        className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low font-mono font-bold text-foreground text-sm sm:text-base rounded-xl border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all uppercase placeholder:normal-case placeholder:font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-secondary hover:bg-on-secondary-container text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-1 btn-press"
                    >
                      {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                      ) : (
                        <span className="material-symbols-outlined text-[20px]">verified_user</span>
                      )}
                      <span>{loading ? "Verifying Registry..." : "Verify Certificate"}</span>
                    </button>
                  </form>

                  {/* Quick Demo Presets */}
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground border-t border-outline-variant/30">
                    <span className="font-bold uppercase tracking-wider text-[11px]">Quick Try:</span>
                    <button
                      type="button"
                      onClick={() => loadDemo("EV-2025-ENG-8492")}
                      className="font-mono text-secondary hover:underline font-bold transition-transform active:scale-95"
                    >
                      EV-2025-ENG-8492
                    </button>
                    <span>&bull;</span>
                    <button
                      type="button"
                      onClick={() => loadDemo("EV-2026-ENG-9014")}
                      className="font-mono text-secondary hover:underline font-bold transition-transform active:scale-95"
                    >
                      EV-2026-ENG-9014
                    </button>
                    <span>&bull;</span>
                    <button
                      type="button"
                      onClick={() => loadDemo("EV-INVALID-0000")}
                      className="text-error hover:underline transition-transform active:scale-95"
                    >
                      Invalid ID Demo
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: VERIFICATION RESULT */}
      {hasSearched && (
        <section id="verification-result" className="w-full py-12 lg:py-16 bg-surface-container-low/50 print:bg-white print:p-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* SUCCESS STATE */}
            {certData && (
              <div className="flex flex-col gap-8 max-w-5xl mx-auto animate-fade-in-up">
                
                {/* Attestation Status Banner */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-emerald-300 dark:border-emerald-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden hover-lift">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-emerald-600 text-[26px]">
                        verified
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-extrabold text-foreground">
                          Official Certificate Verified &amp; Active
                        </h2>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                          certData.status === "valid"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : "bg-red-50 text-red-800 border-red-300"
                        }`}>
                          {certData.status === "valid" ? "Verified Valid" : "Revoked"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Authenticated via Central Academic Registrar Ledger &bull; Credential #{certData.certificateNumber}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2.5 bg-surface-container-low hover:bg-surface-container text-foreground text-xs font-bold rounded-xl border border-outline-variant/40 transition-colors flex items-center gap-1.5 btn-press"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {copiedLink ? "check" : "share"}
                      </span>
                      <span>{copiedLink ? "Link Copied!" : "Share Link"}</span>
                    </button>

                    <button
                      onClick={() =>
                        downloadCertificateImage(
                          certData,
                          `Elite_Vertex_Certificate_${certData.certificateNumber}.png`
                        )
                      }
                      className="px-4 py-2.5 bg-surface-container-low hover:bg-surface-container text-foreground text-xs font-bold rounded-xl border border-outline-variant/40 transition-colors flex items-center gap-1.5 btn-press"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      <span>Download High-Res</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="px-5 py-2.5 bg-secondary hover:bg-on-secondary-container text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 btn-press"
                    >
                      <span className="material-symbols-outlined text-[16px]">print</span>
                      <span>Print PDF</span>
                    </button>
                  </div>
                </div>

                {/* THE CANVA CERTIFICATE PARCHMENT */}
                <div
                  id="printable-certificate-container"
                  className="flex justify-center w-full overflow-hidden p-2 sm:p-4 bg-slate-900/5 dark:bg-black/30 rounded-3xl border border-outline-variant/40"
                >
                  <CertificateTemplate data={certData} />
                </div>

                {/* DETAILED ATTESTATION RECORD CARD */}
                <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/40 shadow-sm print:hidden hover-lift">
                  <div className="border-b border-outline-variant/30 pb-3 mb-5 flex items-center justify-between">
                    <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">
                      Academic Registry Attestation Record
                    </h3>
                    <span className="text-xs font-mono font-bold text-secondary">
                      {certData.certificateNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Student Full Name
                      </span>
                      <span className="font-extrabold text-foreground text-base">
                        {certData.studentName}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Qualification Conferred
                      </span>
                      <span className="font-semibold text-secondary">
                        {certData.courseName}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Issue Date
                      </span>
                      <span className="font-medium text-foreground">
                        {certData.issueDate}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Performance Attainment
                      </span>
                      <span className="font-bold text-foreground">
                        {certData.grade || "Distinction"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[18px]">
                        verified
                      </span>
                      <span>Attested by {certData.signatory1?.name || "Authorized Signatory"} &amp; {certData.signatory2?.name || "Director / Principal"}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePrint}
                        className="text-secondary font-bold hover:underline flex items-center gap-1 btn-press"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        Download PDF Transcript
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* LOADING SPINNER */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="w-12 h-12 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin" />
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-extrabold text-foreground">
                    Querying Central Academic Ledger...
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    Searching for credential &ldquo;{searchedId || certId}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* ERROR / NOT FOUND STATE */}
            {!loading && !certData && (
              <div className="max-w-xl mx-auto bg-surface-container-lowest p-8 sm:p-10 rounded-3xl border border-red-300 dark:border-red-900/50 shadow-md text-center flex flex-col items-center gap-4 animate-fade-in-up hover-lift">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[32px]">cancel</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="text-xl font-extrabold text-foreground">
                    Certificate Not Found in Registry
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    No active completion credential was found matching &quot;{searchedId || certId}&quot;. Please verify the serial number printed on your physical parchment or transcript.
                  </p>
                </div>

                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 text-xs text-muted-foreground text-left w-full flex flex-col gap-1.5">
                  <strong className="text-foreground uppercase tracking-wider text-[11px]">Verification Tips:</strong>
                  <span>&bull; Certificate codes typically follow the format: <strong>EV-YYYY-ENG-XXXX</strong></span>
                  <span>&bull; Serial numbers are case-insensitive, but ensure no trailing spaces or misread digits.</span>
                  <span>&bull; If your certificate was issued prior to 2020, please contact the academic office.</span>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => {
                      setCertId("");
                      setHasSearched(false);
                      setCertData(null);
                      setSearchedId("");
                    }}
                    className="px-6 py-2.5 bg-secondary text-white font-bold text-xs rounded-xl shadow-md hover:bg-on-secondary-container transition-all btn-press"
                  >
                    Search Again
                  </button>

                  <Link
                    href="/contact"
                    className="px-5 py-2.5 bg-surface-container-low text-foreground border border-outline-variant font-semibold text-xs rounded-xl hover:bg-surface-container transition-colors btn-press"
                  >
                    Contact Registrar
                  </Link>
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* SECTION 3: INSTITUTIONAL INTEGRITY INFO */}
      <section className="w-full bg-surface-container-low/60 py-16 border-t border-outline-variant/20 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary block mb-2">
              INSTITUTIONAL INTEGRITY &bull; ISO 9001:2015
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Why Credential Verification Matters
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-2 leading-relaxed">
              Elite Vertex maintains an unbroken chain of custody for all academic attestations, upholding pedagogical standards recognized by executive recruitment panels nationwide.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal direction="up" delay={0}>
              <div className="bg-surface-container-lowest p-7 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col gap-3 hover-lift h-full">
                <span className="text-xs font-extrabold text-secondary tracking-widest uppercase">
                  01 / RECRUITER VERIFICATION
                </span>
                <h3 className="text-base font-bold text-foreground">
                  Direct Corporate Employer Verification
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Corporate talent acquisition teams, international universities, and HR panels can independently authenticate verbal fluency scores in seconds without physical paperwork delays.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={100}>
              <div className="bg-surface-container-lowest p-7 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col gap-3 hover-lift h-full">
                <span className="text-xs font-extrabold text-secondary tracking-widest uppercase">
                  02 / CEFR RIGOR
                </span>
                <h3 className="text-base font-bold text-foreground">
                  CEFR Rigor &amp; True Oral Proficiency
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every attestation reflects verified phonetic mastery, improvised debate, and executive presentation assessed under strict CEFR frameworks—never passive lecture attendance.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <div className="bg-surface-container-lowest p-7 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col gap-3 hover-lift h-full">
                <span className="text-xs font-extrabold text-secondary tracking-widest uppercase">
                  03 / CENTRAL LEDGER
                </span>
                <h3 className="text-base font-bold text-foreground">
                  Tamper-Proof Central Registry
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All awarded serials correspond to immutable archive records logged at time of conferral, preventing document forgery, credential inflation, or unauthorized issuance.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 4: CALL TO ACTION BANNER */}
      <section className="w-full bg-background py-14 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="bg-surface-container-lowest p-8 sm:p-10 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover-lift">
              <div className="flex flex-col gap-1.5 text-left max-w-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Academic Registrar Office
                </span>
                <h4 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  Need an Archive Transcript Prior to 2020?
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Physical records prior to digital ingestion can be manually retrieved by providing your student roll number and batch year directly to admissions.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/contact"
                  className="px-6 py-3.5 bg-secondary text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-on-secondary-container transition-all btn-press"
                >
                  Contact Academic Office
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* INSPECT MODAL FOR SPECIMEN PARCHMENT */}
      {inspectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in print:hidden">
          <div className="bg-surface rounded-3xl max-w-4xl w-full p-4 sm:p-6 border border-outline-variant shadow-2xl flex flex-col gap-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
                <div>
                  <h3 className="font-extrabold text-foreground text-sm sm:text-base">
                    {showcaseTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Credential #{showcaseNumber} &bull; Conferred to {showcaseStudent}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectModalOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-surface-container transition-colors"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <div className="flex justify-center p-2 sm:p-4 bg-slate-900/5 dark:bg-black/40 rounded-2xl border border-outline-variant/40 overflow-hidden">
              <CertificateTemplate data={showcaseCertData} className="w-full h-auto" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="material-symbols-outlined text-emerald-500 text-[18px]">lock</span>
                <span>ISO 9001:2015 compliant tamper-proof digital attestation specimen.</span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setInspectModalOpen(false);
                    setCertId(showcaseNumber);
                    executeVerification(showcaseNumber);
                  }}
                  className="px-5 py-2.5 bg-secondary hover:bg-on-secondary-container text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 btn-press"
                >
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Verify in Ledger</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectModalOpen(false)}
                  className="px-4 py-2.5 bg-surface-container-low text-foreground border border-outline-variant text-xs font-semibold rounded-xl hover:bg-surface-container transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
