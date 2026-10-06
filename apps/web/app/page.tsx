import { Metadata } from "next";
import { HomeContent } from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "Elite Vertex | Institute of Communication",
  description: "Build the English, communication skills, and executive confidence you need for classrooms, global careers, and everyday influence.",
};

export default function HomePage() {
  return <HomeContent />;
}
