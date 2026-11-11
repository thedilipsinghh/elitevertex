import { Metadata } from "next";
import { ContactContent } from "@/components/contact/ContactContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND_NAME, buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Contact | ${BRAND_NAME}`,
  description:
    "Visit Elite Vertex Mairwa at Apex Tower, Ghuthani More, Mairwa or our Siwan centre, call admissions, or submit an online enquiry for English classes.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        id="schema-breadcrumb-contact"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <ContactContent />
    </>
  );
}
