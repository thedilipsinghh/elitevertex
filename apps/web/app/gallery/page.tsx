import { Metadata } from "next";
import { GalleryContent } from "@/components/gallery/GalleryContent";

export const metadata: Metadata = {
  title: "Gallery | Elite Vertex",
  description: "Unfiltered glimpses into our acoustic speech laboratories, intellectual round-tables, high-stakes debate symposiums, and student milestones.",
};

export default function GalleryPage() {
  return <GalleryContent />;
}
