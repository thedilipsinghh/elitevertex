import { Request, Response, NextFunction } from "express";
import { db } from "../config/db";
import { courses, galleryItems, faqs, testimonials, certificates, websiteSettings, mentors, aboutPage, campuses, contactMessages } from "../db/schema";
import { sql } from "drizzle-orm";

// === COURSES ===
export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newCourse = await db.insert(courses).values(req.body).returning();
    return res.status(201).json({ success: true, message: "Course created", data: newCourse[0] });
  } catch (error) { next(error); }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await db.update(courses).set(req.body).where(sql`id = ${req.params.id}`).returning();
    return res.status(200).json({ success: true, message: "Course updated", data: updated[0] });
  } catch (error) { next(error); }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await db.delete(courses).where(sql`id = ${req.params.id}`);
    return res.status(200).json({ success: true, message: "Course deleted" });
  } catch (error) { next(error); }
};

// === GALLERY ===
export const createGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await db.insert(galleryItems).values(req.body).returning();
    return res.status(201).json({ success: true, message: "Gallery item created", data: item[0] });
  } catch (error) { next(error); }
};

export const updateGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await db.update(galleryItems).set(req.body).where(sql`id = ${req.params.id}`).returning();
    return res.status(200).json({ success: true, message: "Gallery item updated", data: updated[0] });
  } catch (error) { next(error); }
};

export const deleteGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await db.delete(galleryItems).where(sql`id = ${req.params.id}`);
    return res.status(200).json({ success: true, message: "Gallery item deleted" });
  } catch (error) { next(error); }
};

// === FAQS ===
export const getAdminFaqs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await db.query.faqs.findMany();
    return res.status(200).json({ success: true, data: items });
  } catch (error) { next(error); }
};

export const createFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await db.insert(faqs).values(req.body).returning();
    return res.status(201).json({ success: true, message: "FAQ created", data: item[0] });
  } catch (error) { next(error); }
};

export const updateFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await db.update(faqs).set(req.body).where(sql`id = ${req.params.id}`).returning();
    return res.status(200).json({ success: true, message: "FAQ updated", data: updated[0] });
  } catch (error) { next(error); }
};

export const deleteFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await db.delete(faqs).where(sql`id = ${req.params.id}`);
    return res.status(200).json({ success: true, message: "FAQ deleted" });
  } catch (error) { next(error); }
};

// === TESTIMONIALS (REVIEWS) ===
export const getAdminTestimonials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await db.query.testimonials.findMany();
    return res.status(200).json({ success: true, data: items });
  } catch (error) { next(error); }
};

export const createTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await db.insert(testimonials).values(req.body).returning();
    return res.status(201).json({ success: true, message: "Review created", data: item[0] });
  } catch (error) { next(error); }
};

export const updateTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await db.update(testimonials).set(req.body).where(sql`id = ${req.params.id}`).returning();
    return res.status(200).json({ success: true, message: "Review updated", data: updated[0] });
  } catch (error) { next(error); }
};

export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await db.delete(testimonials).where(sql`id = ${req.params.id}`);
    return res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) { next(error); }
};

// === WEBSITE SETTINGS / HOME CRM ===
export const getAdminWebsiteSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await db.query.websiteSettings.findFirst();
    return res.status(200).json({ success: true, data: settings || null });
  } catch (error) { next(error); }
};

export const updateWebsiteSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await db.query.websiteSettings.findFirst();
    if (existing) {
      const updated = await db.update(websiteSettings).set(req.body).where(sql`id = ${existing.id}`).returning();
      return res.status(200).json({ success: true, message: "Settings updated", data: updated[0] });
    } else {
      const created = await db.insert(websiteSettings).values(req.body).returning();
      return res.status(201).json({ success: true, message: "Settings created", data: created[0] });
    }
  } catch (error) { next(error); }
};

// === MENTORS CRM ===
export const getAdminMentors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await db.query.mentors.findMany();
    return res.status(200).json({ success: true, data: list });
  } catch (error) { next(error); }
};

export const createMentor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await db.insert(mentors).values(req.body).returning();
    return res.status(201).json({ success: true, message: "Mentor created", data: item[0] });
  } catch (error) { next(error); }
};

export const updateMentor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await db.update(mentors).set(req.body).where(sql`id = ${req.params.id}`).returning();
    return res.status(200).json({ success: true, message: "Mentor updated", data: updated[0] });
  } catch (error) { next(error); }
};

export const deleteMentor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await db.delete(mentors).where(sql`id = ${req.params.id}`);
    return res.status(200).json({ success: true, message: "Mentor deleted" });
  } catch (error) { next(error); }
};

// === ABOUT PAGE CRM ===
export const getAdminAboutPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await db.query.aboutPage.findFirst();
    return res.status(200).json({ success: true, data: page || null });
  } catch (error) { next(error); }
};

export const updateAboutPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await db.query.aboutPage.findFirst();
    if (existing) {
      const updated = await db.update(aboutPage).set(req.body).where(sql`id = ${existing.id}`).returning();
      return res.status(200).json({ success: true, message: "About Page updated", data: updated[0] });
    } else {
      const created = await db.insert(aboutPage).values(req.body).returning();
      return res.status(201).json({ success: true, message: "About Page created", data: created[0] });
    }
  } catch (error) { next(error); }
};

// === CAMPUSES CRM ===
export const getAdminCampuses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await db.query.campuses.findMany();
    return res.status(200).json({ success: true, data: list });
  } catch (error) { next(error); }
};

export const createCampus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await db.insert(campuses).values(req.body).returning();
    return res.status(201).json({ success: true, message: "Campus created", data: item[0] });
  } catch (error) { next(error); }
};

export const updateCampus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await db.update(campuses).set(req.body).where(sql`id = ${req.params.id}`).returning();
    return res.status(200).json({ success: true, message: "Campus updated", data: updated[0] });
  } catch (error) { next(error); }
};

export const deleteCampus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await db.delete(campuses).where(sql`id = ${req.params.id}`);
    return res.status(200).json({ success: true, message: "Campus deleted" });
  } catch (error) { next(error); }
};

// === CONTACT ENQUIRIES / LEADS CRM ===
export const getAdminMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await db.query.contactMessages.findMany({
      orderBy: (msg: any, { desc }: any) => [desc(msg.createdAt)],
    });
    return res.status(200).json({ success: true, data: list });
  } catch (error) { next(error); }
};

export const updateMessageStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await db.update(contactMessages).set({ status: req.body.status }).where(sql`id = ${req.params.id}`).returning();
    return res.status(200).json({ success: true, message: "Lead status updated", data: updated[0] });
  } catch (error) { next(error); }
};

export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await db.delete(contactMessages).where(sql`id = ${req.params.id}`);
    return res.status(200).json({ success: true, message: "Lead deleted" });
  } catch (error) { next(error); }
};



