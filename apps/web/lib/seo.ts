import type { Metadata } from "next";
import { normalizeSocialUrl } from "@/lib/social";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.elitevertex.in").replace(/\/+$/, "");
export const HOMEPAGE_URL = `${SITE_URL}/`;
export const BRAND_NAME = "Elite Vertex Mairwa";
export const ALTERNATE_BRAND_NAME = "Elite Vertex";
export const OFFICIAL_LOGO_PATH = "/logo.png";
export const DEFAULT_OG_IMAGE_PATH = "/og-image.png";

export const HOMEPAGE_TITLE = "Elite Vertex | Best English Classes in Mairwa Siwan Bihar";
export const HOMEPAGE_DESCRIPTION =
  "Top-rated English academy in Mairwa, Siwan, Bihar. Spoken English, grammar & communication classes for classrooms and global careers with expert mentoring.";
export const HOMEPAGE_OG_TITLE = "Elite Vertex | Best English Classes in Mairwa Siwan Bihar";

export const AUTHENTIC_CONTACT = {
  phoneDisplay: "+91 94045 65624",
  phoneSchema: "+91-9404565624",
  email: "info@elitevertax.com",
  mairwaAddress: "Apex Tower, Ghuthani More, Railway Station Road, Mairwa, Siwan, Bihar, India",
  siwanAddress: "Shastri Nagar Registry Kachari, Ground Floor 2 Plaza, Near Gandhi Maidan, Siwan, Bihar, India",
  defaultSocials: [
    "https://facebook.com/elitevertexmairwa",
    "https://instagram.com/elitevertexmairwa",
  ],
} as const;

export interface PublicWebsiteSettings {
  instituteName?: string | null;
  institute_name?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  googleMapsUrl?: string | null;
  google_maps_url?: string | null;
  facebookUrl?: string | null;
  facebook_url?: string | null;
  instagramUrl?: string | null;
  instagram_url?: string | null;
  linkedinUrl?: string | null;
  linkedin_url?: string | null;
  youtubeUrl?: string | null;
  youtube_url?: string | null;
  socialShowFacebook?: boolean | null;
  social_show_facebook?: boolean | null;
  socialShowInstagram?: boolean | null;
  social_show_instagram?: boolean | null;
  socialShowLinkedin?: boolean | null;
  social_show_linkedin?: boolean | null;
  socialShowYoutube?: boolean | null;
  social_show_youtube?: boolean | null;
}

export interface PublicCampus {
  id?: string;
  city?: string | null;
  name?: string | null;
  address?: string | null;
  landmark?: string | null;
  metroAccess?: string | null;
  metro_access?: string | null;
  isPublished?: boolean | null;
}

export interface PublicFaqItem {
  id?: string;
  question: string;
  answer: string;
  category?: string | null;
}

export interface PublicCourseItem {
  id?: string;
  slug?: string;
  title?: string;
  shortDesc?: string;
  short_desc?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface PublishedPageData {
  slug: string;
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  publishedAt?: string | null;
  sections?: Array<{
    type: string;
    content: Record<string, unknown>;
  }>;
}

/**
 * Resolves a route path against the primary production origin without producing double slashes.
 */
export function canonicalUrl(path = "/"): string {
  if (!path || path === "/") {
    return HOMEPAGE_URL;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

/**
 * Builds consistent Next.js Metadata across routes with canonical links and social cards.
 */
export function buildPageMetadata(options: {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = canonicalUrl(options.path);
  const ogTitle = options.ogTitle || options.title;
  const ogDescription = options.ogDescription || options.description;

  return {
    title: options.title,
    description: options.description,
    ...(options.keywords?.length ? { keywords: options.keywords } : {}),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url,
      siteName: BRAND_NAME,
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: canonicalUrl(DEFAULT_OG_IMAGE_PATH),
          width: 1200,
          height: 630,
          alt: `${BRAND_NAME} — English Classes in Mairwa, Siwan, Bihar`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [canonicalUrl(DEFAULT_OG_IMAGE_PATH)],
    },
    ...(options.noIndex
      ? {
        robots: {
          index: false,
          follow: false,
        },
      }
      : {}),
  };
}

function getServerApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  return process.env.NODE_ENV === "production"
    ? "https://elitevertex-api.vercel.app/api/v1"
    : "http://localhost:5000/api/v1";
}

/**
 * Safely fetches public API data on the server with a bounded timeout so SSR never fails offline.
 */
export async function fetchPublicApi<T>(endpoint: string, revalidateSeconds = 300): Promise<T | null> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const baseUrl = getServerApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}${cleanEndpoint}`, {
      signal: AbortSignal.timeout(2000),
      next: { revalidate: revalidateSeconds },
    });
    if (!response.ok) return null;
    const json = (await response.json()) as { success?: boolean; data?: T };
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchHomepageSeoBundle(): Promise<{
  page: PublishedPageData | null;
  settings: PublicWebsiteSettings | null;
  campuses: PublicCampus[];
  faqs: PublicFaqItem[];
}> {
  const [page, settings, campuses, faqs] = await Promise.all([
    fetchPublicApi<PublishedPageData>("/pages/home", 300),
    fetchPublicApi<PublicWebsiteSettings>("/website-settings", 300),
    fetchPublicApi<PublicCampus[]>("/campuses", 300),
    fetchPublicApi<PublicFaqItem[]>("/faqs", 300),
  ]);

  return {
    page,
    settings,
    campuses: Array.isArray(campuses) ? campuses : [],
    faqs: Array.isArray(faqs) ? faqs : [],
  };
}

function formatSchemaPhone(rawPhone?: string | null): string {
  const digits = (rawPhone || "").replace(/\D/g, "");
  if (digits.length === 10) return `+91-${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+91-${digits.slice(2)}`;
  if (digits.length >= 8) return `+${digits}`;
  return AUTHENTIC_CONTACT.phoneSchema;
}

function collectVerifiedSocialUrls(settings?: PublicWebsiteSettings | null): string[] {
  if (!settings) {
    return [...AUTHENTIC_CONTACT.defaultSocials];
  }

  const urls: string[] = [];
  const showFacebook = settings.socialShowFacebook ?? settings.social_show_facebook;
  const facebookUrl = settings.facebookUrl ?? settings.facebook_url;
  if (showFacebook !== false) {
    const fb = normalizeSocialUrl(facebookUrl, "facebook");
    if (fb) urls.push(fb);
  }

  const showInstagram = settings.socialShowInstagram ?? settings.social_show_instagram;
  const instagramUrl = settings.instagramUrl ?? settings.instagram_url;
  if (showInstagram !== false) {
    const ig = normalizeSocialUrl(instagramUrl, "instagram");
    if (ig) urls.push(ig);
  }

  const showLinkedin = settings.socialShowLinkedin ?? settings.social_show_linkedin;
  const linkedinUrl = settings.linkedinUrl ?? settings.linkedin_url;
  if (showLinkedin === true) {
    const li = normalizeSocialUrl(linkedinUrl, "linkedin");
    if (li) urls.push(li);
  }

  const showYoutube = settings.socialShowYoutube ?? settings.social_show_youtube;
  const youtubeUrl = settings.youtubeUrl ?? settings.youtube_url;
  if (showYoutube === true) {
    const yt = normalizeSocialUrl(youtubeUrl, "youtube");
    if (yt) urls.push(yt);
  }

  return urls.length > 0 ? urls : [...AUTHENTIC_CONTACT.defaultSocials];
}

/**
 * Generates Google's WebSite structured data for homepage Site Name selection.
 */
export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${HOMEPAGE_URL}#website`,
    name: BRAND_NAME,
    alternateName: [ALTERNATE_BRAND_NAME, "Elite Vertex Mairwa Siwan"],
    url: HOMEPAGE_URL,
    inLanguage: "en-IN",
    publisher: {
      "@id": `${HOMEPAGE_URL}#organization`,
    },
  };
}

/**
 * Generates EducationalOrganization structured data using only verified institute details.
 */
export function buildEducationalOrganizationJsonLd(
  settings?: PublicWebsiteSettings | null,
  campuses?: PublicCampus[]
) {
  const publishedCampuses = (campuses || []).filter((c) => c.isPublished !== false);
  const mairwaCampus = publishedCampuses.find((c) =>
    `${c.city || ""} ${c.name || ""} ${c.address || ""}`.toLowerCase().includes("mairwa")
  );
  const streetParts = [mairwaCampus?.address?.trim(), mairwaCampus?.name?.trim()]
    .filter((part, idx, arr): part is string => Boolean(part) && arr.indexOf(part) === idx);
  const streetAddress =
    streetParts.length > 0
      ? streetParts.join(", ")
      : settings?.address?.trim() || "Apex Tower, Ghuthani More, Railway Station Road, Mairwa";

  const areaServed = [
    { "@type": "City", name: "Mairwa" },
    { "@type": "AdministrativeArea", name: "Siwan" },
    { "@type": "State", name: "Bihar" },
  ];

  const sameAs = collectVerifiedSocialUrls(settings);

  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${HOMEPAGE_URL}#organization`,
    name: BRAND_NAME,
    alternateName: ALTERNATE_BRAND_NAME,
    url: HOMEPAGE_URL,
    logo: {
      "@type": "ImageObject",
      url: canonicalUrl(OFFICIAL_LOGO_PATH),
    },
    image: canonicalUrl(DEFAULT_OG_IMAGE_PATH),
    description: HOMEPAGE_DESCRIPTION,
    telephone: formatSchemaPhone(settings?.phone || settings?.whatsapp),
    email: settings?.email?.trim() || AUTHENTIC_CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality: "Mairwa",
      addressRegion: "Bihar",
      addressCountry: "IN",
    },
    areaServed,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function buildFaqJsonLd(items: Array<{ question: string; answer: string }>) {
  const validItems = items.filter((item) => item.question?.trim() && item.answer?.trim());
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: validItems.map((item) => ({
      "@type": "Question",
      name: item.question.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.trim(),
      },
    })),
  };
}

export const MAIRWA_HOMEPAGE_FAQS: Array<{ question: string; answer: string }> = [
  {
    question: "Where is Elite Vertex Mairwa located?",
    answer:
      "Elite Vertex Mairwa conducts offline English classes at Apex Tower, Ghuthani More, Railway Station Road, Mairwa, Siwan, Bihar, with another centre at Shastri Nagar Registry Kachari, Near Gandhi Maidan in Siwan.",
  },
  {
    question: "Can beginners join English classes in Mairwa without prior speaking practice?",
    answer:
      "Yes. Basic English classes at Elite Vertex Mairwa start with sentence formation, everyday vocabulary, listening comprehension, and simple spoken exercises designed for Hindi-medium and first-time English learners.",
  },
  {
    question: "Does Elite Vertex Mairwa teach both Spoken English and English Grammar?",
    answer:
      "Yes. Classes combine practical English grammar rules with daily conversation practice so students understand why sentences are structured a certain way and use them naturally while speaking.",
  },
  {
    question: "How does practical English speaking training improve confidence?",
    answer:
      "Students practice guided dialogue, pronunciation feedback, group discussions, and stage presentations in small cohorts so speaking English feels comfortable in classrooms, interviews, and daily life.",
  },
  {
    question: "How can students contact Elite Vertex Mairwa for counselling or batch details?",
    answer:
      "Students and parents in Mairwa and across Siwan district can visit the Ghuthani More centre, call +91 94045 65624, write to info@elitevertax.com, or book a counselling session on our Contact page.",
  },
];
