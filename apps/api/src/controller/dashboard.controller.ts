import { Response, NextFunction } from "express";
import { sql, desc } from "drizzle-orm";
import { db } from "../config/db";
import {
  courses,
  pages,
  media,
  contactMessages,
  testimonials,
  faqs,
  mentors,
  campuses,
  galleryItems,
  auditLogs,
} from "../db/schema";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const count = async (table: any, where?: any) => {
      const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(table).where(where);
      return row?.count ?? 0;
    };

    const [
      coursesTotal,
      coursesActive,
      coursesDraft,
      pagesTotal,
      pagesPublished,
      pagesDraft,
      mediaTotal,
      messagesUnread,
      messagesTotal,
      testimonialsTotal,
      faqsTotal,
      mentorsTotal,
      campusesTotal,
      galleryTotal,
    ] = await Promise.all([
      count(courses),
      count(courses, sql`status = 'active'`),
      count(courses, sql`status = 'draft'`),
      count(pages),
      count(pages, sql`status = 'published'`),
      count(pages, sql`status = 'draft'`),
      count(media),
      count(contactMessages, sql`status = 'unread'`),
      count(contactMessages),
      count(testimonials),
      count(faqs),
      count(mentors),
      count(campuses),
      count(galleryItems),
    ]);

    const recentActivity = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(10);

    return res.status(200).json({
      success: true,
      data: {
        courses: { total: coursesTotal, active: coursesActive, draft: coursesDraft },
        pages: { total: pagesTotal, published: pagesPublished, draft: pagesDraft },
        media: { total: mediaTotal },
        messages: { total: messagesTotal, unread: messagesUnread },
        collections: {
          testimonials: testimonialsTotal,
          faqs: faqsTotal,
          mentors: mentorsTotal,
          campuses: campusesTotal,
          gallery: galleryTotal,
        },
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};
