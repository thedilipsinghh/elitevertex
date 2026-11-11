import { Metadata } from "next";
import { FaqContent } from "@/components/faq/FaqContent";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  BRAND_NAME,
  MAIRWA_HOMEPAGE_FAQS,
  PublicFaqItem,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildPageMetadata,
  fetchPublicApi,
} from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: `FAQ | ${BRAND_NAME}`,
  description:
    "Answers to common questions about English classes, Spoken English batches, grammar training, timings, and admissions at Elite Vertex Mairwa, Siwan, Bihar.",
  path: "/faq",
});

export default async function FaqPage() {
  const faqs = await fetchPublicApi<PublicFaqItem[]>("/faqs", 300);
  const faqItems = Array.isArray(faqs) && faqs.length > 0 ? faqs : MAIRWA_HOMEPAGE_FAQS;

  return (
    <>
      <JsonLd
        id="schema-breadcrumb-faq"
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
      <JsonLd id="schema-faq" data={buildFaqJsonLd(faqItems)} />
      <FaqContent />
    </>
  );
}
