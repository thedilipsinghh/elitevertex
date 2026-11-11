import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND_NAME, buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Terms of Service | ${BRAND_NAME}`,
  description:
    "Terms and conditions governing English course enrollments, batch attendance, and certificate verification at Elite Vertex Mairwa.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="w-full bg-surface text-on-surface py-16 lg:py-24 transition-colors">
      <JsonLd
        id="schema-breadcrumb-terms"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Terms of Service", path: "/terms" },
        ])}
      />
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">
          LEGAL &amp; COMPLIANCE
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-8">
          Terms of Service
        </h1>
        <div className="flex flex-col gap-6 text-on-surface-variant text-base leading-relaxed">
          <p>
            Welcome to {BRAND_NAME}. By accessing our website, enrolling in English coursework, or scheduling consultations, you agree to these institutional terms.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-4">1. Enrollment &amp; Attendance</h2>
          <p>
            To preserve productive batch sizes and regular speaking practice, students are expected to maintain consistent attendance. Requests for batch schedule changes are handled by our institute coordination desk.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-4">2. Certification &amp; Verification</h2>
          <p>
            Completion certificates issued by {BRAND_NAME} are awarded to students who finish their enrolled coursework and evaluations. Authentic certificates carry serial credentials verifiable on our verification page.
          </p>
          <h2 className="text-xl font-bold text-on-surface mt-4">3. Academic Conduct</h2>
          <p>
            {BRAND_NAME} maintains a respectful, supportive learning environment for spoken English practice. Discrimination, recording cohort peers without consent, or disruptive behavior is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
