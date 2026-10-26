/**
 * Shared section definitions for the CMS and the public site renderer.
 * `type` values match what is seeded into `page_sections.type`.
 */

export interface SectionContent {
  [key: string]: unknown;
}

export interface PageSectionDTO {
  type: string;
  content: SectionContent;
}

export interface PublicPageResponse {
  slug: string;
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  publishedAt?: string | null;
  sections: PageSectionDTO[];
}

export interface PillarItem {
  label?: string;
  title?: string;
  description?: string;
}

export interface CoursePreviewItem {
  title?: string;
  description?: string;
  meta?: string;
  url?: string;
}

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "image" | "number" | "list" | "boolean";
  itemFields?: FieldDef[];
}

export interface SectionTypeDef {
  type: string;
  label: string;
  description: string;
  fields: FieldDef[];
}

export const SECTION_TYPES: SectionTypeDef[] = [
  {
    type: "hero",
    label: "Hero Banner",
    description: "Top-of-page headline, tagline, subtitle and primary CTAs.",
    fields: [
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "subheading", label: "Subheading", type: "textarea" },
      { key: "image", label: "Image URL", type: "image" },
      { key: "imageAlt", label: "Image Alt Text", type: "text" },
      { key: "primaryCtaLabel", label: "Primary CTA Label", type: "text" },
      { key: "primaryCtaUrl", label: "Primary CTA URL", type: "url" },
      { key: "secondaryCtaLabel", label: "Secondary CTA Label", type: "text" },
      { key: "secondaryCtaUrl", label: "Secondary CTA URL", type: "url" },
    ],
  },
  {
    type: "pillars",
    label: "Pillars / Trust Strip",
    description: "Grid of trust pillars or value propositions.",
    fields: [
      {
        key: "items",
        label: "Pillars",
        type: "list",
        itemFields: [
          { key: "label", label: "Label", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
    ],
  },
  {
    type: "about_preview",
    label: "About Preview",
    description: "Image plus narrative paragraphs and a CTA link.",
    fields: [
      { key: "label", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "paragraph1", label: "Paragraph 1", type: "textarea" },
      { key: "paragraph2", label: "Paragraph 2", type: "textarea" },
      { key: "image", label: "Image URL", type: "image" },
      { key: "imageAlt", label: "Image Alt Text", type: "text" },
      { key: "linkLabel", label: "Link Label", type: "text" },
      { key: "linkUrl", label: "Link URL", type: "url" },
    ],
  },
  {
    type: "courses_preview",
    label: "Courses Preview",
    description: "List of course highlights with a link to the full catalogue.",
    fields: [
      { key: "label", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "linkLabel", label: "Link Label", type: "text" },
      { key: "linkUrl", label: "Link URL", type: "url" },
      {
        key: "items",
        label: "Courses",
        type: "list",
        itemFields: [
          { key: "title", label: "Title", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "meta", label: "Meta (duration • mode)", type: "text" },
          { key: "url", label: "URL", type: "url" },
        ],
      },
    ],
  },
  {
    type: "testimonials",
    label: "Testimonials",
    description: "Badge, heading and subtitle above the testimonials slider.",
    fields: [
      { key: "badge", label: "Badge", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "subheading", label: "Subheading", type: "textarea" },
    ],
  },
  {
    type: "gallery",
    label: "Gallery",
    description: "Heading and subtitle above the gallery slider.",
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "subheading", label: "Subheading", type: "textarea" },
    ],
  },
  {
    type: "certificate_faq",
    label: "Certificate & FAQ",
    description: "Certificate verification card, diagnostic card and FAQ block.",
    fields: [
      { key: "certificateCardTitle", label: "Certificate Card Title", type: "text" },
      { key: "certificateCardText", label: "Certificate Card Text", type: "textarea" },
      { key: "certificateCardCta", label: "Certificate Card CTA", type: "text" },
      { key: "certificateCardCtaUrl", label: "Certificate Card CTA URL", type: "url" },
      { key: "diagnosticLabel", label: "Diagnostic Label", type: "text" },
      { key: "diagnosticTitle", label: "Diagnostic Title", type: "text" },
      { key: "diagnosticText", label: "Diagnostic Text", type: "textarea" },
      { key: "diagnosticNote", label: "Diagnostic Note", type: "text" },
      { key: "faqLabel", label: "FAQ Label", type: "text" },
      { key: "faqTitle", label: "FAQ Title", type: "text" },
      { key: "faqLinkLabel", label: "FAQ Link Label", type: "text" },
      { key: "faqLinkUrl", label: "FAQ Link URL", type: "url" },
    ],
  },
  {
    type: "cta",
    label: "Final CTA",
    description: "Closing call-to-action band with two buttons.",
    fields: [
      { key: "label", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "subheading", label: "Subheading", type: "textarea" },
      { key: "primaryCtaLabel", label: "Primary CTA Label", type: "text" },
      { key: "primaryCtaUrl", label: "Primary CTA URL", type: "url" },
      { key: "secondaryCtaLabel", label: "Secondary CTA Label", type: "text" },
      { key: "secondaryCtaUrl", label: "Secondary CTA URL", type: "url" },
    ],
  },
];

export const getSectionTypeDef = (type: string): SectionTypeDef | undefined =>
  SECTION_TYPES.find((s) => s.type === type);

export const emptyContentForType = (type: string): SectionContent => {
  const def = getSectionTypeDef(type);
  if (!def) return {};
  const content: SectionContent = {};
  for (const field of def.fields) {
    if (field.type === "list") content[field.key] = [];
    else if (field.type === "boolean") content[field.key] = false;
    else content[field.key] = "";
  }
  return content;
};
