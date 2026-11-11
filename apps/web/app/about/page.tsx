import { Metadata } from "next";
import { AboutContent } from "@/components/about/AboutContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND_NAME, buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `About | ${BRAND_NAME}`,
  description:
    "Learn about Elite Vertex Mairwa, our English teaching methodology, experienced mentors, and spoken English classrooms in Mairwa and Siwan, Bihar.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        id="schema-breadcrumb-about"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <AboutContent />
    </>
  );
}
