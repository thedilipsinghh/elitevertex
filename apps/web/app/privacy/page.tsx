import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Elite Vertex",
  description: "Learn how Elite Vertex Institute handles and protects your student and admissions data.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full bg-surface text-on-surface py-16 lg:py-24 transition-colors">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">
          LEGAL &amp; COMPLIANCE
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-8">
          Privacy Policy
        </h1>
        <div className="flex flex-col gap-6 text-on-surface-variant text-base leading-relaxed">
          <p>
            At Elite Vertex Institute of Communication, we are committed to safeguarding the privacy and confidential records of our prospective learners, alumni, and campus visitors.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-4">1. Data Collection &amp; Use</h2>
          <p>
            Information provided through our admissions forms, speech assessment bookings, or certification verifications is strictly utilized for educational counseling, cohort scheduling, and official diploma attestations. We do not sell or lease student records to external parties.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-4">2. Assessment Recordings</h2>
          <p>
            Speech diagnostic audio and video recordings collected during practice sessions in our Acoustic Labs are confidential learning materials reserved for student feedback loops and mentor evaluation.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-4">3. Security Standards</h2>
          <p>
            We implement industry-standard encryption protocols aligned with ISO 9001:2015 institutional security standards to protect academic transcripts and personal communications.
          </p>
        </div>
      </div>
    </div>
  );
}
