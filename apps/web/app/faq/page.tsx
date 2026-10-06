import { Metadata } from "next";
import { FaqContent } from "@/components/faq/FaqContent";

export const metadata: Metadata = {
  title: "FAQ | Elite Vertex",
  description: "Clear answers regarding course curriculum, admissions diagnostics, batch timings, and institutional certification standards.",
};

export default function FaqPage() {
  return <FaqContent />;
}
