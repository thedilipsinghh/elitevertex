import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Elite Vertex",
  description: "Terms and conditions governing course enrollments, cohort attendance, and certification at Elite Vertex.",
};

export default function TermsPage() {
  return (
    <div className="w-full bg-surface text-on-surface py-16 lg:py-24 transition-colors">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">
          LEGAL &amp; COMPLIANCE
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-8">
          Terms of Service
        </h1>
        <div className="flex flex-col gap-6 text-on-surface-variant text-base leading-relaxed">
          <p>
            Welcome to Elite Vertex Institute of Communication. By accessing our educational portals, enrolling in coursework, or scheduling consultations, you agree to these institutional terms.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-4">1. Enrollment &amp; Attendance</h2>
          <p>
            To preserve our strict 1:12 cohort ratio and ensure equal speech airtime, students are expected to maintain minimum attendance thresholds. Schedule transitions between weekday and weekend batches must be formally requested via the academic registrar.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-4">2. Certification &amp; Attestation</h2>
          <p>
            The Elite Vertex Diploma is awarded exclusively to candidates who complete mandatory active speech evaluations and CEFR benchmarking criteria. Certificates contain verified serial hashes verifiable on our public ledger.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-4">3. Academic Conduct</h2>
          <p>
            Elite Vertex fosters a constructive, respectful environment for spoken practice. Discrimination, recording cohort peers without explicit consent, or disruptive behavior is strictly prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
