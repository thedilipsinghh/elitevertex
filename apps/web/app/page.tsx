import { Metadata } from "next";
import { HomeContent } from "@/components/home/HomeContent";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  HOMEPAGE_DESCRIPTION,
  HOMEPAGE_TITLE,
  buildEducationalOrganizationJsonLd,
  buildPageMetadata,
  buildWebSiteJsonLd,
  fetchHomepageSeoBundle,
} from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await fetchHomepageSeoBundle();
  const title = page?.metaTitle?.trim() || HOMEPAGE_TITLE;
  const description = page?.metaDescription?.trim() || HOMEPAGE_DESCRIPTION;

  return buildPageMetadata({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    path: "/",
    keywords: [
      "Elite Vertex Mairwa",
      "Best English Classes in Mairwa",
      "English Classes in Mairwa Siwan Bihar",
      "Spoken English Classes in Mairwa",
      "English Speaking Institute Mairwa",
      "Elite Vertex",
    ],
  });
}

export default async function HomePage() {
  const { page, settings, campuses } = await fetchHomepageSeoBundle();

  return (
    <>
      <JsonLd id="schema-website" data={buildWebSiteJsonLd()} />
      <JsonLd
        id="schema-organization"
        data={buildEducationalOrganizationJsonLd(settings, campuses)}
      />
      <HomeContent initialPage={page} />
    </>
  );
}
