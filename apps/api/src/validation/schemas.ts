import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.format(),
      });
    }
    req.body = parsed.data;
    next();
  };

export const courseSchema = z.object({
  slug: z.string().min(1).max(255),
  title: z.string().min(1).max(255),
  shortDescription: z.string().min(1),
  fullDescription: z.string().nullable().optional(),
  image: z.string().max(2000).nullable().optional(),
  price: z.number().int().nullable().optional(),
  duration: z.string().max(100).nullable().optional(),
  level: z.string().max(100).nullable().optional(),
  category: z.string().min(1).max(100),
  badge: z.string().max(100).nullable().optional(),
  isFeatured: z.boolean().optional(),
  format: z.string().max(100).nullable().optional(),
  cohortCap: z.string().max(100).nullable().optional(),
  sortOrder: z.number().int().optional(),
  status: z.enum(["active", "draft"]).optional(),
  modules: z.array(z.union([z.string(), z.object({ title: z.string(), description: z.string().optional() })])).optional(),
});

export const gallerySchema = z.object({
  category: z.string().min(1).max(255),
  title: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  image: z.string().min(1).max(2000),
  tag: z.string().max(255).nullable().optional(),
  location: z.string().max(255).nullable().optional(),
  subLocation: z.string().max(255).nullable().optional(),
  gridSpan: z.string().max(100).nullable().optional(),
  aspectRatio: z.string().max(100).nullable().optional(),
  tagClass: z.string().max(255).nullable().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const testimonialSchema = z.object({
  name: z.string().min(1).max(255),
  role: z.string().max(255).nullable().optional(),
  message: z.string().min(1),
  image: z.string().max(2000).nullable().optional(),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const mentorSchema = z.object({
  name: z.string().min(1).max(255),
  designation: z.string().min(1).max(255),
  bio: z.string().min(1),
  quote: z.string().nullable().optional(),
  profileImage: z.string().max(2000).nullable().optional(),
  experience: z.string().max(100).nullable().optional(),
  specialization: z.string().max(255).nullable().optional(),
  accreditation: z.string().max(255).nullable().optional(),
  linkedin: z.string().max(255).nullable().optional(),
  displayOrder: z.number().int().optional(),
  isPublished: z.boolean().optional(),
});

export const campusSchema = z.object({
  city: z.string().min(1).max(100),
  name: z.string().min(1).max(255),
  address: z.string().min(1),
  landmark: z.string().nullable().optional(),
  metroAccess: z.string().nullable().optional(),
  parkingInfo: z.string().nullable().optional(),
  mapUrl: z.string().max(2000).nullable().optional(),
  isPublished: z.boolean().optional(),
});

export const settingsSchema = z.object({
  instituteName: z.string().max(255).nullable().optional(),
  heroTagline: z.string().nullable().optional(),
  heroTitle: z.string().nullable().optional(),
  heroSubtitle: z.string().nullable().optional(),
  heroImage: z.string().max(2000).nullable().optional(),
  callToActionTitle: z.string().nullable().optional(),
  callToActionSubtitle: z.string().nullable().optional(),
  phone: z.string().max(100).nullable().optional(),
  whatsapp: z.string().max(100).nullable().optional(),
  email: z.string().max(255).nullable().optional(),
  address: z.string().nullable().optional(),
  workingHours: z.string().nullable().optional(),
  googleMapsUrl: z.string().max(2000).nullable().optional(),
  facebookUrl: z.string().max(2000).nullable().optional(),
  instagramUrl: z.string().max(2000).nullable().optional(),
  linkedinUrl: z.string().max(2000).nullable().optional(),
  youtubeUrl: z.string().max(2000).nullable().optional(),
  footerText: z.string().nullable().optional(),
  contactTitle: z.string().nullable().optional(),
  contactSubtitle: z.string().nullable().optional(),
  contactTagline: z.string().nullable().optional(),
  logoUrl: z.string().max(2000).nullable().optional(),
  faviconUrl: z.string().max(2000).nullable().optional(),
  announcementEnabled: z.boolean().optional(),
  announcementText: z.string().nullable().optional(),
  announcementLink: z.string().max(2000).nullable().optional(),
  seoMetaTitle: z.string().max(255).nullable().optional(),
  seoMetaDescription: z.string().nullable().optional(),
  certSig1Name: z.string().max(255).nullable().optional(),
  certSig1Title: z.string().max(255).nullable().optional(),
  certSig1Sign: z.string().nullable().optional(),
  certSig2Name: z.string().max(255).nullable().optional(),
  certSig2Title: z.string().max(255).nullable().optional(),
  certSig2Sign: z.string().nullable().optional(),
});

export const aboutSchema = z.object({
  headerTitle: z.string().nullable().optional(),
  headerSubtitle: z.string().nullable().optional(),
  paradigmTitle: z.string().nullable().optional(),
  paradigmParagraph1: z.string().nullable().optional(),
  paradigmParagraph2: z.string().nullable().optional(),
  paradigmParagraph3: z.string().nullable().optional(),
  airtimeStat: z.string().max(50).nullable().optional(),
  ratioStat: z.string().max(50).nullable().optional(),
  paradigmImage: z.string().max(2000).nullable().optional(),
  visionTitle: z.string().nullable().optional(),
  visionBody: z.string().nullable().optional(),
  missionTitle: z.string().nullable().optional(),
  missionBody: z.string().nullable().optional(),
});

export const messageStatusSchema = z.object({
  status: z.enum(["unread", "read", "replied"]),
});

export const certificateSchema = z.object({
  studentName: z.string().min(1, "Student name is required").max(255),
  certificateNumber: z.string().min(1, "Certificate number is required").max(255),
  courseName: z.string().min(1, "Course name is required").max(255),
  issueDate: z.string().min(1, "Issue date is required"),
  grade: z.string().max(100).nullable().optional(),
  customNote: z.string().nullable().optional(),
  status: z.enum(["valid", "revoked"]).optional(),
});

