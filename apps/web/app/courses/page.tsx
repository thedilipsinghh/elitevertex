import { Metadata } from "next";
import { CoursesContent } from "@/components/courses/CoursesContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND_NAME, buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Courses | ${BRAND_NAME}`,
  description:
    "Explore Spoken English, English Grammar, Public Speaking, and career communication courses at Elite Vertex Mairwa in Siwan, Bihar.",
  path: "/courses",
});

export default function CoursesPage() {
  return (
    <>
      <JsonLd
        id="schema-breadcrumb-courses"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Courses", path: "/courses" },
        ])}
      />
      <CoursesContent />
    </>
  );
}
