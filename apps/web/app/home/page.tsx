import { Metadata } from "next";
import { HomeContent } from "@/components/home/HomeContent";
import {
  HOMEPAGE_DESCRIPTION,
  HOMEPAGE_OG_TITLE,
  HOMEPAGE_TITLE,
  buildPageMetadata,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: HOMEPAGE_TITLE,
  description: HOMEPAGE_DESCRIPTION,
  ogTitle: HOMEPAGE_OG_TITLE,
  path: "/",
  noIndex: true,
});

export default function HomeAliasPage() {
  return <HomeContent />;
}
