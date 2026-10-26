import { Suspense } from "react";
import { Metadata } from "next";
import { VerifyCertificateContent } from "@/components/verify-certificate/VerifyCertificateContent";

export const metadata: Metadata = {
  title: "Verify Certificate | Elite Vertex",
  description: "Verify an Elite Vertex Certificate. Enter the credential ID printed on physical transcripts and digital completion records to verify official attestation.",
};

export default function VerifyCertificatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>}>
      <VerifyCertificateContent />
    </Suspense>
  );
}
