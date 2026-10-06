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
