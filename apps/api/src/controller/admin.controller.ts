import { Request, Response, NextFunction } from "express";
import { db } from "../config/db";
import {
  courses,
  courseModules,
  galleryItems,
  faqs,
  testimonials,
  websiteSettings,
  mentors,
  aboutPage,
  campuses,
  contactMessages,
  auditLogs,
} from "../db/schema";
import { sql, desc, ilike, or, and, eq, asc } from "drizzle-orm";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { logAudit } from "../lib/audit";

// === COURSES ===
export const getAdminCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await db.query.courses.findMany({
      orderBy: (courses: any, { asc }: any) => [asc(courses.sortOrder), asc(courses.createdAt)],
      with: {
        modules: {
          orderBy: (m: any, { asc }: any) => [asc(m.displayOrder), asc(m.createdAt)]
        }
      }
    });
    return res.status(200).json({ success: true, data: list });
  } catch (error) { next(error); }
};

export const getAdminCourseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await db.query.courses.findFirst({
      where: sql`id = ${req.params.id}`,
      with: {
        modules: {
          orderBy: (m: any, { asc }: any) => [asc(m.displayOrder), asc(m.createdAt)]
        }
      }
    });
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    return res.status(200).json({ success: true, data: course });
  } catch (error) { next(error); }
};

export const createCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { modules: inputModules, ...courseData } = req.body;
    const newCourse = await db.insert(courses).values(courseData).returning();
    const created = newCourse[0];

    if (created && Array.isArray(inputModules) && inputModules.length > 0) {
      for (let i = 0; i < inputModules.length; i++) {
        const item = inputModules[i];
        const title = typeof item === "string" ? item : item?.title || "";
        const description = typeof item === "string" ? null : item?.description || null;
        if (title.trim()) {
          await db.insert(courseModules).values({
            courseId: created.id,
            title: title.trim(),
            description,
            displayOrder: i + 1,
          });
        }
      }
    }

    await logAudit(req.admin, "create", "course", created?.id);
    return res.status(201).json({ success: true, message: "Course created successfully", data: created });
  } catch (error) { next(error); }
};

export const updateCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { modules: inputModules, ...courseData } = req.body;
    const courseId = String(req.params.id);

    const updated = await db
      .update(courses)
      .set({ ...courseData, updatedAt: new Date() })
      .where(sql`id = ${courseId}`)
      .returning();

    if (Array.isArray(inputModules)) {
      // Sync modules: delete existing and insert updated
      await db.delete(courseModules).where(sql`course_id = ${courseId}`);
      for (let i = 0; i < inputModules.length; i++) {
        const item = inputModules[i];
        const title = typeof item === "string" ? item : item?.title || "";
        const description = typeof item === "string" ? null : item?.description || null;
        if (title.trim()) {
          await db.insert(courseModules).values({
            courseId,
            title: title.trim(),
            description,
            displayOrder: i + 1,
          });
        }
      }
    }

    await logAudit(req.admin, "update", "course", courseId);
    return res.status(200).json({ success: true, message: "Course updated successfully", data: updated[0] });
  } catch (error) { next(error); }
};

export const deleteCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const courseId = String(req.params.id);
    await db.delete(courseModules).where(sql`course_id = ${courseId}`);
    await db.delete(courses).where(sql`id = ${courseId}`);
    await logAudit(req.admin, "delete", "course", courseId);
    return res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) { next(error); }
};

export const seedDefaultCourses = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const INSTITUTIONAL_SEED = [
      {
        slug: "pre-foundation-english",
        title: "Pre-Foundation English (PFE)",
        category: "spoken",
        badge: "Level 1 — Absolute Beginners",
        level: "Beginner (CEFR A1)",
        duration: "4 Weeks (30 Hours)",
        format: "Classroom & Hybrid",
        cohortCap: "12 Scholars Max",
        sortOrder: 1,
        status: "active" as const,
        image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
        shortDescription:
          "Designed for individuals who struggle with basic English word formation and sentence structuring. Overcome initial hesitation, dissolve mother-tongue inhibition, and start speaking simple sentences with confidence.",
        modules: [
          "Basic Alphabetic Phonetics & Sound Production",
          "Essential Daily Sight Words & Vocabulary (500+ Words)",
          "Simple Sentence Construction & Subject-Verb Agreement",
          "Daily Life Greeting & Conversational Drills",
          "Basic Present, Past & Future Tense Usage",
          "Confidence Building & Stage Fear Removal",
        ],
      },
      {
        slug: "foundation-english",
        title: "Foundation English (FE)",
        category: "spoken",
        badge: "Level 2 — Basic Speaker",
        level: "Elementary (CEFR A2)",
        duration: "6 Weeks (45 Hours)",
        format: "Classroom & Hybrid",
        cohortCap: "12 Scholars Max",
        sortOrder: 2,
        status: "active" as const,
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
        shortDescription:
          "For learners who can understand basic English but face hesitation, grammar confusion, or lack of vocabulary when speaking in real-time conversations.",
        modules: [
          "Comprehensive Parts of Speech & Sentence Syntax",
          "Correct Tense Formations & Verb Conjugations",
          "Mother Tongue Influence (MTI) Reduction Drills",
          "Listening Comprehension & Acoustic Mimicry",
          "Pair Sparring & Simulated Dialogue Practice",
          "Basic Telephonic & Everyday Situational English",
        ],
      },
      {
        slug: "elementary-english",
        title: "Elementary English (BE)",
        category: "spoken",
        badge: "Level 3 — Intermediate Fluency",
        level: "Pre-Intermediate (CEFR B1)",
        duration: "8 Weeks (60 Hours)",
        format: "Classroom & Online",
        cohortCap: "12 Scholars Max",
        sortOrder: 3,
        status: "active" as const,
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
        shortDescription:
          "Accelerate fluency, eliminate pauses, and master natural speech flow for informal conversations, group interactions, and academic settings.",
        modules: [
          "Complex & Compound Sentence Construction",
          "Idiomatic Expressions & Common Phrasal Verbs",
          "Extempore Speech & Jamming (Just A Minute) Sessions",
          "Group Discussion (GD) Tactics & Turn-Taking",
          "Fundamental Business Email & Written Communication",
          "Body Language, Eye Contact & Non-Verbal Cues",
        ],
      },
      {
        slug: "intermediate-english",
        title: "Intermediate English & Career Communication",
        category: "career",
        badge: "Level 4 — Career Booster",
        level: "Intermediate (CEFR B2)",
        duration: "8 Weeks (60 Hours)",
        format: "Campus & Hybrid",
        cohortCap: "12 Scholars Max",
        sortOrder: 4,
        status: "active" as const,
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
        shortDescription:
          "Designed for job seekers, college graduates, and corporate executives aiming to excel in job interviews, professional presentations, and client meetings.",
        modules: [
          "Advanced Vocabulary & Professional Jargon",
          "Voice Accent Neutralization & Intonation",
          "Corporate Interview Preparation & STAR Techniques",
          "Presentation Delivery & Slide Pitching",
          "Professional Email Etiquette & Memo Drafting",
          "Debate, Argumentation & Logical Persuasion",
        ],
      },
      {
        slug: "advanced-english-executive-presence",
        title: "Advanced English (AE) & Executive Presence",
        category: "advanced",
        badge: "Level 5 — Leadership Track",
        level: "Advanced (CEFR C1-C2)",
        duration: "10 Weeks (75 Hours)",
        format: "Executive Campus & Hybrid",
        cohortCap: "10 Fellows Max",
        sortOrder: 5,
        status: "active" as const,
        isFeatured: true,
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
        shortDescription:
          "Master high-stakes leadership communication, strategic negotiation, diplomatic speech, and executive presence for managers and business leaders.",
        modules: [
          "Persuasive Rhetoric & High-Stakes Oratory",
          "Executive Storytelling & Audience Engagement",
          "Cross-Cultural Global Communication & Protocol",
          "Crisis Communication & Unscripted Media Q&A",
          "Salary & Business Contract Negotiation Strategies",
          "Frame-by-Frame Video Feedback & Performance Rubrics",
        ],
      },
    ];

    for (const item of INSTITUTIONAL_SEED) {
      const { modules: mods, ...cData } = item;
      const existing = await db.query.courses.findFirst({
        where: sql`slug = ${cData.slug}`,
      });

      let courseId: string;
      if (existing) {
        courseId = existing.id;
        await db.update(courses).set({ ...cData, updatedAt: new Date() }).where(sql`id = ${courseId}`);
      } else {
        const [inserted] = await db.insert(courses).values(cData).returning();
        courseId = inserted.id;
      }

      await db.delete(courseModules).where(sql`course_id = ${courseId}`);
      for (let i = 0; i < mods.length; i++) {
        await db.insert(courseModules).values({
          courseId,
          title: mods[i],
          displayOrder: i + 1,
        });
      }
    }

    await logAudit(req.admin, "seed", "courses", undefined, { count: INSTITUTIONAL_SEED.length });
    return res.status(200).json({ success: true, message: "Institutional courses seeded successfully" });
  } catch (error) { next(error); }
};

// === GALLERY ===
export const createGalleryItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const item = await db.insert(galleryItems).values(req.body).returning();
    await logAudit(req.admin, "create", "gallery_item", item[0]?.id);
    return res.status(201).json({ success: true, message: "Gallery item created", data: item[0] });
  } catch (error) { next(error); }
};

export const updateGalleryItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updated = await db.update(galleryItems).set({ ...req.body, updatedAt: new Date() }).where(sql`id = ${req.params.id}`).returning();
    await logAudit(req.admin, "update", "gallery_item", String(req.params.id));
    return res.status(200).json({ success: true, message: "Gallery item updated", data: updated[0] });
  } catch (error) { next(error); }
};

export const deleteGalleryItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await db.delete(galleryItems).where(sql`id = ${req.params.id}`);
    await logAudit(req.admin, "delete", "gallery_item", String(req.params.id));
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

export const createFaq = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const item = await db.insert(faqs).values(req.body).returning();
    await logAudit(req.admin, "create", "faq", item[0]?.id);
    return res.status(201).json({ success: true, message: "FAQ created", data: item[0] });
  } catch (error) { next(error); }
};

export const updateFaq = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updated = await db.update(faqs).set({ ...req.body, updatedAt: new Date() }).where(sql`id = ${req.params.id}`).returning();
    await logAudit(req.admin, "update", "faq", String(req.params.id));
    return res.status(200).json({ success: true, message: "FAQ updated", data: updated[0] });
  } catch (error) { next(error); }
};

export const deleteFaq = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await db.delete(faqs).where(sql`id = ${req.params.id}`);
    await logAudit(req.admin, "delete", "faq", String(req.params.id));
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

export const createTestimonial = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const item = await db.insert(testimonials).values(req.body).returning();
    await logAudit(req.admin, "create", "testimonial", item[0]?.id);
    return res.status(201).json({ success: true, message: "Review created", data: item[0] });
  } catch (error) { next(error); }
};

export const updateTestimonial = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updated = await db.update(testimonials).set({ ...req.body, updatedAt: new Date() }).where(sql`id = ${req.params.id}`).returning();
    await logAudit(req.admin, "update", "testimonial", String(req.params.id));
    return res.status(200).json({ success: true, message: "Review updated", data: updated[0] });
  } catch (error) { next(error); }
};

export const deleteTestimonial = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await db.delete(testimonials).where(sql`id = ${req.params.id}`);
    await logAudit(req.admin, "delete", "testimonial", String(req.params.id));
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

export const updateWebsiteSettings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const existing = await db.query.websiteSettings.findFirst();
    if (existing) {
      const updated = await db.update(websiteSettings).set({ ...req.body, updatedAt: new Date() }).where(sql`id = ${existing.id}`).returning();
      await logAudit(req.admin, "update", "settings", existing.id);
      return res.status(200).json({ success: true, message: "Settings updated", data: updated[0] });
    } else {
      const created = await db.insert(websiteSettings).values(req.body).returning();
      await logAudit(req.admin, "create", "settings", created[0]?.id);
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

export const createMentor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const item = await db.insert(mentors).values(req.body).returning();
    await logAudit(req.admin, "create", "mentor", item[0]?.id);
    return res.status(201).json({ success: true, message: "Mentor created", data: item[0] });
  } catch (error) { next(error); }
};

export const updateMentor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updated = await db.update(mentors).set({ ...req.body, updatedAt: new Date() }).where(sql`id = ${req.params.id}`).returning();
    await logAudit(req.admin, "update", "mentor", String(req.params.id));
    return res.status(200).json({ success: true, message: "Mentor updated", data: updated[0] });
  } catch (error) { next(error); }
};

export const deleteMentor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await db.delete(mentors).where(sql`id = ${req.params.id}`);
    await logAudit(req.admin, "delete", "mentor", String(req.params.id));
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

export const updateAboutPage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const existing = await db.query.aboutPage.findFirst();
    if (existing) {
      const updated = await db.update(aboutPage).set({ ...req.body, updatedAt: new Date() }).where(sql`id = ${existing.id}`).returning();
      await logAudit(req.admin, "update", "about_page", existing.id);
      return res.status(200).json({ success: true, message: "About Page updated", data: updated[0] });
    } else {
      const created = await db.insert(aboutPage).values(req.body).returning();
      await logAudit(req.admin, "create", "about_page", created[0]?.id);
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

export const createCampus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const item = await db.insert(campuses).values(req.body).returning();
    await logAudit(req.admin, "create", "campus", item[0]?.id);
    return res.status(201).json({ success: true, message: "Campus created", data: item[0] });
  } catch (error) { next(error); }
};

export const updateCampus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updated = await db.update(campuses).set({ ...req.body, updatedAt: new Date() }).where(sql`id = ${req.params.id}`).returning();
    await logAudit(req.admin, "update", "campus", String(req.params.id));
    return res.status(200).json({ success: true, message: "Campus updated", data: updated[0] });
  } catch (error) { next(error); }
};

export const deleteCampus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await db.delete(campuses).where(sql`id = ${req.params.id}`);
    await logAudit(req.admin, "delete", "campus", String(req.params.id));
    return res.status(200).json({ success: true, message: "Campus deleted" });
  } catch (error) { next(error); }
};

// === CONTACT ENQUIRIES / LEADS CRM ===
export const getAdminMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "").trim();
    const conditions = [];
    if (search) {
      const pattern = `%${search}%`;
      conditions.push(
        or(
          ilike(contactMessages.name, pattern),
          ilike(contactMessages.email, pattern),
          ilike(contactMessages.message, pattern),
          ilike(contactMessages.subject, pattern)
        )
      );
    }
    if (status && ["unread", "read", "replied"].includes(status)) {
      conditions.push(sql`status = ${status}`);
    }
    const where = conditions.length ? and(...conditions) : undefined;
    const list = await db.query.contactMessages.findMany({
      where,
      orderBy: (msg: any, { desc }: any) => [desc(msg.createdAt)],
    });
    return res.status(200).json({ success: true, data: list });
  } catch (error) { next(error); }
};

export const updateMessageStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updated = await db.update(contactMessages).set({ status: req.body.status }).where(sql`id = ${req.params.id}`).returning();
    return res.status(200).json({ success: true, message: "Lead status updated", data: updated[0] });
  } catch (error) { next(error); }
};

export const deleteMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await db.delete(contactMessages).where(sql`id = ${req.params.id}`);
    await logAudit(req.admin, "delete", "message", String(req.params.id));
    return res.status(200).json({ success: true, message: "Lead deleted" });
  } catch (error) { next(error); }
};

const csvEscape = (value: unknown) => {
  const str = value == null ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const exportMessagesCsv = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await db.query.contactMessages.findMany({
      orderBy: (msg: any, { desc }: any) => [desc(msg.createdAt)],
    });
    const header = ["id", "createdAt", "name", "email", "phone", "subject", "program", "mode", "message", "status"];
    const rows = list.map((m: any) =>
      [m.id, m.createdAt?.toISOString?.() || m.createdAt, m.name, m.email, m.phone, m.subject, m.program, m.mode, m.message, m.status]
        .map(csvEscape)
        .join(",")
    );
    const csv = [header.join(","), ...rows].join("\r\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="leads-export.csv"`);
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

// === AUDIT LOGS ===
export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(200, Math.max(1, parseInt(String(req.query.limit || "50"), 10) || 50));
    const list = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};
