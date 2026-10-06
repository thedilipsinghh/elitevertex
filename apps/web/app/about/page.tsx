import { Metadata } from "next";
import { AboutContent } from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About | Elite Vertex",
  description: "Founded on the conviction that spoken language is mastered through psychological safety, active voice mechanics, and deliberate physical practice.",
};

export default function AboutPage() {
  return <AboutContent />;
}
