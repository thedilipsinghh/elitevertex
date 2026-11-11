import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND_NAME, buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Privacy Policy | ${BRAND_NAME}`,
  description:
    "Learn how Elite Vertex Mairwa handles and protects student enquiry and admissions records in Mairwa, Siwan, Bihar.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="w-full bg-surface text-on-surface py-16 lg:py-24 transition-colors">
      <JsonLd
        id="schema-breadcrumb-privacy"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ])}
      />
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">
          LEGAL &amp; COMPLIANCE
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-8">
          Privacy Policy
        </h1>
        <div className="flex flex-col gap-6 text-on-surface-variant text-base leading-relaxed">
          <p>
            At {BRAND_NAME}, we are committed to safeguarding the privacy and confidential records of our prospective learners, students, and visitors.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-4">1. Data Collection &amp; Use</h2>
          <p>
            Information provided through our admissions forms, counselling bookings, or certificate verification requests is strictly utilized for educational guidance, batch scheduling, and official certificate records. We do not sell or lease student records to external parties.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-4">2. Practice &amp; Assessment Materials</h2>
          <p>
            Spoken English practice exercises and classroom feedback notes are confidential learning materials reserved for student improvement and instructor guidance.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-4">3. Security Standards</h2>
          <p>
            We follow standard administrative and digital safeguards to protect student enquiries, academic certificates, and personal communications.
          </p>
        </div>
      </div>
    </div>
  );
}
