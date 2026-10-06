import { Metadata } from "next";
import { VerifyCertificateContent } from "@/components/verify-certificate/VerifyCertificateContent";

export const metadata: Metadata = {
  title: "Verify Certificate | Elite Vertex",
  description: "Verify an Elite Vertex Certificate. Enter the credential ID printed on physical transcripts and digital completion records to verify official attestation.",
};

export default function VerifyCertificatePage() {
  return <VerifyCertificateContent />;
}
