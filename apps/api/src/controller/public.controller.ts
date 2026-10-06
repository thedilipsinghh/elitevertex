import { Request, Response, NextFunction } from "express";
import { db } from "../config/db";
import { sql } from "drizzle-orm";
import { courses, galleryItems, testimonials, faqs, websiteSettings } from "../db/schema";

export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activeCourses = await db.query.courses.findMany({
      where: sql`status = 'active'`,
      orderBy: (courses: any, { asc }: any) => [asc(courses.sortOrder)],
      with: {
        modules: true
      }
    });

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: activeCourses,
    });
  } catch (error) {
    next(error);
  }
};

export const getGallery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gallery = await db.query.galleryItems.findMany({
      where: sql`is_active = true`,
    });

    return res.status(200).json({
      success: true,
      message: "Gallery items fetched successfully",
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

export const getTestimonials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await db.query.testimonials.findMany({
      where: sql`is_active = true`,
    });

    return res.status(200).json({
      success: true,
      message: "Testimonials fetched successfully",
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const getFaqs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await db.query.faqs.findMany({
      where: sql`is_active = true`,
    });

    return res.status(200).json({
      success: true,
      message: "FAQs fetched successfully",
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const getWebsiteSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await db.query.websiteSettings.findFirst();

    return res.status(200).json({
      success: true,
      message: "Website settings fetched successfully",
      data: settings || null,
    });
  } catch (error) {
    next(error);
  }
};

export const getMentors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await db.query.mentors.findMany({
      where: sql`is_published = true`,
    });
    return res.status(200).json({ success: true, data: items });
  } catch (error) { next(error); }
};

export const getAboutPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await db.query.aboutPage.findFirst();
    return res.status(200).json({ success: true, data: page || null });
  } catch (error) { next(error); }
};

export const getCampuses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await db.query.campuses.findMany({
      where: sql`is_published = true`,
    });
    return res.status(200).json({ success: true, data: list });
  } catch (error) { next(error); }
};

