import { Request, Response, NextFunction } from "express";
import { db } from "../config/db";
import { courses, galleryItems, faqs, testimonials, certificates } from "../db/schema";
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

