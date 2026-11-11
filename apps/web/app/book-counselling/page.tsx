import { Metadata } from "next";
import { ContactContent } from "@/components/contact/ContactContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND_NAME, buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Book Free Counselling | ${BRAND_NAME}`,
  description:
    "Book a free Spoken English level evaluation and academic counselling session at Elite Vertex Mairwa in Ghuthani More, Mairwa, Siwan, Bihar.",
  path: "/book-counselling",
});

export default function BookCounsellingPage() {
  return (
    <>
      <JsonLd
        id="schema-breadcrumb-counselling"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Book Free Counselling", path: "/book-counselling" },
        ])}
      />
      <ContactContent />
    </>
  );
}
