import { Suspense } from "react";
import { Metadata } from "next";
import { VerifyCertificateContent } from "@/components/verify-certificate/VerifyCertificateContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND_NAME, buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Verify Certificate | ${BRAND_NAME}`,
  description:
    "Verify official English course completion certificates issued by Elite Vertex Mairwa, Siwan, Bihar using the student credential verification number.",
  path: "/verify-certificate",
});

export default function VerifyCertificatePage() {
  return (
    <>
      <JsonLd
        id="schema-breadcrumb-verify"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Verify Certificate", path: "/verify-certificate" },
        ])}
      />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>}>
        <VerifyCertificateContent />
      </Suspense>
    </>
  );
}
