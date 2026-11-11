import { Metadata } from "next";
import { GalleryContent } from "@/components/gallery/GalleryContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND_NAME, buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Gallery | ${BRAND_NAME}`,
  description:
    "View classrooms, spoken English practice sessions, stage presentations, and student activities at Elite Vertex Mairwa in Siwan, Bihar.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        id="schema-breadcrumb-gallery"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />
      <GalleryContent />
    </>
  );
}
