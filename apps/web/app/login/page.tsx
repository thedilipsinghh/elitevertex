import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRAND_NAME, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Login | ${BRAND_NAME}`,
  description: `Restricted access page for ${BRAND_NAME}.`,
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  notFound();
}
