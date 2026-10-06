"use client";

import { useState } from "react";
import Link from "next/link";

type Status = "idle" | "valid" | "invalid";

export function VerifyCertificateContent() {
  const [certId, setCertId] = useState("EV-2025-ENG-8492");
  const [status, setStatus] = useState<Status>("idle");
  const [verifiedId, setVerifiedId] = useState("");

  const verifyCertificate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = certId.trim().toUpperCase();

    if (query === "EV-2025-ENG-8492") {
      setStatus("valid");
      setVerifiedId(query);
    } else {
      setStatus("invalid");
    }
  };

  const loadDemo = (id: string) => {
    setCertId(id);
    const query = id.trim().toUpperCase();
    if (query === "EV-2025-ENG-8492") {
      setStatus("valid");
      setVerifiedId(query);
    } else {
      setStatus("invalid");
    }
  };

  const resetSearch = () => {
    setCertId("");
    setStatus("idle");
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <section className="w-full bg-surface py-space-xl md:py-space-3xl">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-space-2xs">CERTIFICATE VERIFICATION</span>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-space-xs">Verify an Elite Vertex Certificate.</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">Enter the credential ID printed on physical transcripts and digital completion records to verify official attestation.</p>
          </div>
          <div className="mt-space-xl max-w-xl mx-auto">
            <div className="bg-surface-container-lowest p-space-md md:p-space-lg shadow-sm rounded-lg flex flex-col gap-space-md">
              <form className="flex flex-col gap-space-sm" onSubmit={verifyCertificate}>
                <div className="flex flex-col gap-space-3xs text-left">
                  <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant" htmlFor="certIdInput">Certificate Credential ID</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-space-sm text-on-surface-variant text-[20px] pointer-events-none">pin</span>
                    <input
                      className="w-full pl-11 pr-space-sm py-space-xs bg-surface-container-lowest font-body-md text-body-md text-on-surface rounded focus:outline-none focus:bg-surface-container-low transition-colors"
                      id="certIdInput"
                      placeholder="e.g., EV-2025-ENG-8492"
                      required
                      type="text"
                      value={certId}
                      onChange={(e) => setCertId(e.target.value)}
                    />
                  </div>
                </div>
                <button className="w-full bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md uppercase tracking-wider py-space-xs px-space-md rounded transition-colors duration-150 flex items-center justify-center gap-space-2xs shadow-sm" type="submit">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Verify Certificate</span>
                </button>
              </form>
              <div className="pt-space-2xs flex flex-wrap items-center justify-center gap-space-xs text-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Demo Presets:</span>
                <button className="font-label-sm text-label-sm text-primary hover:text-secondary underline decoration-outline-variant underline-offset-4" onClick={() => loadDemo("EV-2025-ENG-8492")} type="button">
                  Try Valid ID (EV-2025-ENG-8492)
                </button>
                <span className="text-outline-variant">•</span>
                <button className="font-label-sm text-label-sm text-on-surface-variant hover:text-error underline decoration-outline-variant underline-offset-4" onClick={() => loadDemo("EV-UNKNOWN-0000")} type="button">
                  Try Invalid ID
                </button>
              </div>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto mt-space-xl transition-all duration-200">
            {status === "valid" && (
              <div className="bg-surface-container-lowest rounded-lg p-space-lg md:p-space-xl shadow-sm flex flex-col gap-space-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm bg-surface-container-low p-space-md rounded">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
                    <div>
                      <p className="font-label-md text-label-md uppercase tracking-wider text-primary">Certificate Verified &amp; Active</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">Validated via Academic Registrar Central Log</p>
                    </div>
                  </div>
                  <span className="inline-flex self-start sm:self-auto items-center px-space-xs py-space-3xs rounded font-label-sm text-label-sm bg-surface-container-highest text-on-surface tracking-wider uppercase">
                    Attestation #8492-C1
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-space-md gap-x-space-lg text-left">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Student Name</span>
                    <span className="font-headline-sm text-headline-sm text-primary mt-space-3xs font-semibold">Aditi Sharma</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Certificate ID</span>
                    <span className="font-body-md text-body-md text-primary mt-space-3xs font-mono font-medium">{verifiedId}</span>
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Qualification Conferred</span>
                    <span className="font-body-lg text-body-lg text-primary mt-space-3xs font-medium">Advanced Spoken English &amp; Executive Communication</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">CEFR Attainment</span>
                    <div className="flex items-center gap-space-2xs mt-space-3xs">
                      <span className="font-body-md text-body-md text-primary font-bold">CEFR C1</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">(Effective Operational Fluency)</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Campus &amp; Issue Date</span>
                    <span className="font-body-md text-body-md text-primary mt-space-3xs">Bengaluru Flagship • 14 Nov 2025</span>
                  </div>
                  <div className="flex flex-col md:col-span-2 pt-space-xs bg-surface-container-lowest">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Institutional Signatory</span>
                    <span className="font-body-md text-body-md text-on-surface mt-space-3xs">Dr. Meenakshi Sundaram, Ph.D.</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Chief Linguist &amp; Academic Dean</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-space-sm pt-space-sm">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-space-2xs bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-wider px-space-md py-space-xs rounded transition-colors" onClick={() => alert("Transcript download initiated.")} type="button">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    <span>Download Official Transcript (PDF)</span>
                  </button>
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-space-2xs bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md uppercase tracking-wider px-space-md py-space-xs rounded transition-colors" onClick={handlePrint} type="button">
                    <span className="material-symbols-outlined text-[18px]">print</span>
                    <span>Print Attestation Record</span>
                  </button>
                </div>
              </div>
            )}

            {status === "invalid" && (
              <div className="bg-surface-container-lowest rounded-lg p-space-lg md:p-space-xl shadow-sm text-center flex flex-col items-center gap-space-md">
                <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[24px]">cancel</span>
                </div>
                <div className="flex flex-col gap-space-3xs max-w-md">
                  <h3 className="font-headline-sm text-headline-sm text-primary">Certificate Not Found</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    The certificate ID could not be found in the Elite Vertex Academic Registry. Please check the credential code printed on the physical parchment or transcript and try again.
                  </p>
                </div>
                <button className="inline-flex items-center justify-center gap-space-2xs bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-wider px-space-md py-space-xs rounded transition-colors" onClick={resetSearch} type="button">
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                  <span>Search Again</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="w-full bg-surface-container-low py-space-2xl">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="max-w-3xl mb-space-lg">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">INSTITUTIONAL INTEGRITY</span>
            <h2 className="font-headline-md text-headline-md text-primary mt-space-3xs">Why Credential Verification Matters</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
              Elite Vertex maintains an unbroken chain of custody for all academic attestations, upholding standards recognized by executive recruitment committees nationwide.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            <div className="bg-surface-container-lowest p-space-md rounded-lg flex flex-col gap-space-2xs shadow-sm">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">01</span>
              <h3 className="font-headline-sm text-headline-sm text-primary">Direct Employer Verification</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Corporate talent acquisition teams, international universities, and HR panels can independently authenticate verbal fluency scores in seconds without physical paperwork delays.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-space-md rounded-lg flex flex-col gap-space-2xs shadow-sm">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">02</span>
              <h3 className="font-headline-sm text-headline-sm text-primary">CEFR Rigor &amp; True Speech</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Every attestation reflects verified phonetic mastery, improvised debate, and presentation performance assessed under strict CEFR frameworks—never passive lecture attendance.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-space-md rounded-lg flex flex-col gap-space-2xs shadow-sm">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">03</span>
              <h3 className="font-headline-sm text-headline-sm text-primary">Tamper-Proof Registry</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                All awarded serials correspond to immutable archive records logged at time of conferral, preventing document forgery, credential inflation, or unauthorized issuance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-surface py-space-xl">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="flex flex-col gap-space-3xs text-left max-w-xl">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Academic Registrar Office</span>
              <h4 className="font-headline-sm text-headline-sm text-primary">Need an Archive Transcript Prior to 2020?</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Physical records prior to digital ingestion can be manually retrieved by providing your student roll number and batch year directly to admissions.
              </p>
            </div>
            <div className="flex items-center gap-space-sm shrink-0">
              <Link className="inline-flex items-center justify-center bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-wider px-space-md py-space-xs rounded transition-colors" href="/contact">
                Contact Academic Office
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
