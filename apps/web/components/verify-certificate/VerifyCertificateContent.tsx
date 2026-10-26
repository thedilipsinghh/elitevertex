"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLazyVerifyCertificateQuery } from "@/lib/features/api/apiSlice";
import { CertificateTemplate, CertificateData, downloadCertificateImage } from "@/components/certificate/CertificateTemplate";

export function VerifyCertificateContent() {
  const searchParams = useSearchParams();
  const urlId = searchParams?.get("id") || "";

  const [certId, setCertId] = useState(urlId || "EV-2025-ENG-8492");
  const [triggerVerify, { data: verifyResponse, isLoading, isError, error }] = useLazyVerifyCertificateQuery();

  const [hasSearched, setHasSearched] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // If URL has ?id=..., auto trigger verification on load
  useEffect(() => {
    if (urlId) {
      setCertId(urlId);
      triggerVerify(urlId.trim());
      setHasSearched(true);
    }
  }, [urlId, triggerVerify]);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = certId.trim();
    if (!query) return;

    setHasSearched(true);
    triggerVerify(query);
  };

  const loadDemo = (id: string) => {
    setCertId(id);
    setHasSearched(true);
    triggerVerify(id);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/verify-certificate?id=${encodeURIComponent(certId.trim().toUpperCase())}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const certData: CertificateData | null = verifyResponse?.data
    ? {
        studentName: verifyResponse.data.studentName,
        certificateNumber: verifyResponse.data.certificateNumber,
        courseName: verifyResponse.data.courseName,
        issueDate: verifyResponse.data.issueDate,
        grade: verifyResponse.data.grade,
        customNote: verifyResponse.data.customNote,
        status: verifyResponse.data.status,
        signatory1: verifyResponse.data.signatory1,
        signatory2: verifyResponse.data.signatory2,
      }
    : null;

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

      {/* SECTION 1: SEARCH HEADER & INPUT */}
      <section className="w-full bg-background py-12 md:py-20 border-b border-outline-variant/30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
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
          </div>

          {/* Search Box */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-xl border border-outline-variant/30 flex flex-col gap-4">
              <form onSubmit={handleVerify} className="flex flex-col gap-3">
                <label
                  htmlFor="certIdInput"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-left"
                >
                  Certificate Credential ID
                </label>
                
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
                  disabled={isLoading}
                  className="w-full py-4 bg-secondary hover:bg-on-secondary-container text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  )}
                  <span>{isLoading ? "Verifying Registry..." : "Verify Certificate"}</span>
                </button>
              </form>

              {/* Quick Demo Presets */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground border-t border-outline-variant/30">
                <span className="font-bold uppercase tracking-wider text-[11px]">Quick Try:</span>
                <button
                  type="button"
                  onClick={() => loadDemo("EV-2025-ENG-8492")}
                  className="font-mono text-secondary hover:underline font-bold"
                >
                  EV-2025-ENG-8492
                </button>
                <span>&bull;</span>
                <button
                  type="button"
                  onClick={() => loadDemo("EV-2026-ENG-9014")}
                  className="font-mono text-secondary hover:underline font-bold"
                >
                  EV-2026-ENG-9014
                </button>
                <span>&bull;</span>
                <button
                  type="button"
                  onClick={() => loadDemo("EV-INVALID-0000")}
                  className="text-error hover:underline"
                >
                  Invalid ID Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: VERIFICATION RESULT */}
      {hasSearched && (
        <section className="w-full py-12 lg:py-16 bg-surface-container-low/50 print:bg-white print:p-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* SUCCESS STATE */}
            {certData && (
              <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                
                {/* Attestation Status Banner */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-emerald-300 dark:border-emerald-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
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
                      className="px-4 py-2.5 bg-surface-container-low hover:bg-surface-container text-foreground text-xs font-bold rounded-xl border border-outline-variant/40 transition-colors flex items-center gap-1.5"
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
                      className="px-4 py-2.5 bg-surface-container-low hover:bg-surface-container text-foreground text-xs font-bold rounded-xl border border-outline-variant/40 transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      <span>Download High-Res</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="px-5 py-2.5 bg-secondary hover:bg-on-secondary-container text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
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
                <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/40 shadow-sm print:hidden">
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
                        className="text-secondary font-bold hover:underline flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        Download PDF Transcript
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ERROR / NOT FOUND STATE */}
            {!isLoading && (isError || (!certData && hasSearched)) && (
              <div className="max-w-xl mx-auto bg-surface-container-lowest p-8 sm:p-10 rounded-3xl border border-red-300 dark:border-red-900/50 shadow-md text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[32px]">cancel</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="text-xl font-extrabold text-foreground">
                    Certificate Not Found in Registry
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    No active completion credential was found matching &quot;{certId}&quot;. Please verify the serial number printed on your physical parchment or transcript.
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
                    }}
                    className="px-6 py-2.5 bg-secondary text-white font-bold text-xs rounded-xl shadow-md hover:bg-on-secondary-container transition-all"
                  >
                    Search Again
                  </button>

                  <Link
                    href="/contact"
                    className="px-5 py-2.5 bg-surface-container-low text-foreground border border-outline-variant font-semibold text-xs rounded-xl hover:bg-surface-container transition-colors"
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
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary block mb-2">
              INSTITUTIONAL INTEGRITY &bull; ISO 9001:2015
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Why Credential Verification Matters
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-2 leading-relaxed">
              Elite Vertex maintains an unbroken chain of custody for all academic attestations, upholding pedagogical standards recognized by executive recruitment panels nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest p-7 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col gap-3">
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

            <div className="bg-surface-container-lowest p-7 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col gap-3">
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

            <div className="bg-surface-container-lowest p-7 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col gap-3">
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
          </div>
        </div>
      </section>

      {/* SECTION 4: CALL TO ACTION BANNER */}
      <section className="w-full bg-background py-14 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface-container-lowest p-8 sm:p-10 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
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
                className="px-6 py-3.5 bg-secondary text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-on-secondary-container transition-all"
              >
                Contact Academic Office
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
