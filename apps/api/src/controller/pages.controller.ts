import { Request, Response, NextFunction } from "express";
import { and, eq, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../config/db";
import { pages, pageSections } from "../db/schema";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { logAudit } from "../lib/audit";

const pageMetaSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers and hyphens"),
  title: z.string().min(1).max(255),
  metaTitle: z.string().max(255).nullable().optional(),
  metaDescription: z.string().nullable().optional(),
});

const createPageSchema = pageMetaSchema;

const sectionInputSchema = z.object({
  type: z.string().min(1).max(100),
  title: z.string().max(255).nullable().optional(),
  isVisible: z.boolean().optional(),
  content: z.record(z.string(), z.unknown()).optional(),
});

const updateSectionSchema = z.object({
  type: z.string().min(1).max(100).optional(),
  title: z.string().max(255).nullable().optional(),
  isVisible: z.boolean().optional(),
  content: z.record(z.string(), z.unknown()).optional(),
});

const reorderSchema = z.object({
  sectionIds: z.array(z.string().uuid()).min(1),
});

// === ADMIN: PAGES ===

export const listPages = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const list = await db.query.pages.findMany({
      orderBy: [desc(pages.updatedAt)],
    });
    const sectionCounts = await db
      .select({ pageId: pageSections.pageId, count: sql<number>`count(*)::int` })
      .from(pageSections)
      .groupBy(pageSections.pageId);
    const countMap = new Map(sectionCounts.map((s: any) => [s.pageId, s.count]));
    return res.status(200).json({
      success: true,
      data: list.map((p: any) => ({ ...p, sectionCount: countMap.get(p.id) || 0 })),
    });
  } catch (error) {
    next(error);
  }
};

export const createPage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = createPageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.format() });
    }
    const existing = await db.query.pages.findFirst({ where: eq(pages.slug, parsed.data.slug) });
    if (existing) {
      return res.status(409).json({ success: false, message: "A page with this slug already exists" });
    }
    const [created] = await db
      .insert(pages)
      .values({ ...parsed.data, metaTitle: parsed.data.metaTitle ?? null, metaDescription: parsed.data.metaDescription ?? null })
      .returning();
    await logAudit(req.admin, "create", "page", created.id, { slug: created.slug });
    return res.status(201).json({ success: true, message: "Page created", data: created });
  } catch (error) {
    next(error);
  }
};

export const getPage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const page = await db.query.pages.findFirst({
      where: eq(pages.id, String(req.params.id)),
    });
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    const sections = await db.query.pageSections.findMany({
      where: eq(pageSections.pageId, page.id),
      orderBy: [sql`sort_order asc`, sql`created_at asc`],
    });
    const hasUnpublishedChanges = sections.some(
      (s: any) => JSON.stringify(s.draftContent ?? {}) !== JSON.stringify(s.publishedContent ?? {})
    );
    return res.status(200).json({
      success: true,
      data: { ...page, sections, hasUnpublishedChanges },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePageMeta = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = pageMetaSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.format() });
    }
    const updated = await db
      .update(pages)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(pages.id, String(req.params.id)))
      .returning();
    if (!updated[0]) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    await logAudit(req.admin, "update", "page", String(req.params.id), parsed.data as any);
    return res.status(200).json({ success: true, message: "Page updated", data: updated[0] });
  } catch (error) {
    next(error);
  }
};

export const deletePage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const existing = await db.query.pages.findFirst({ where: eq(pages.id, String(req.params.id)) });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    await db.delete(pages).where(eq(pages.id, String(req.params.id)));
    await logAudit(req.admin, "delete", "page", String(req.params.id), { slug: existing.slug });
    return res.status(200).json({ success: true, message: "Page deleted" });
  } catch (error) {
    next(error);
  }
};

export const duplicatePage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const source = await db.query.pages.findFirst({ where: eq(pages.id, String(req.params.id)) });
    if (!source) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    const slug = `${source.slug}-copy-${Date.now().toString(36)}`;
    const [newPage] = await db
      .insert(pages)
      .values({
        slug,
        title: `${source.title} (Copy)`,
        metaTitle: source.metaTitle,
        metaDescription: source.metaDescription,
        status: "draft",
      })
      .returning();
    const sections = await db.query.pageSections.findMany({
      where: eq(pageSections.pageId, source.id),
      orderBy: [sql`sort_order asc`, sql`created_at asc`],
    });
    if (sections.length) {
      await db.insert(pageSections).values(
        sections.map((s: any) => ({
          pageId: newPage.id,
          type: s.type,
          title: s.title,
          isVisible: s.isVisible,
          sortOrder: s.sortOrder,
          draftContent: s.draftContent,
          publishedContent: null,
        }))
      );
    }
    await logAudit(req.admin, "duplicate", "page", newPage.id, { sourceId: source.id });
    return res.status(201).json({ success: true, message: "Page duplicated", data: newPage });
  } catch (error) {
    next(error);
  }
};

// === ADMIN: SECTIONS ===

export const addSection = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const page = await db.query.pages.findFirst({ where: eq(pages.id, String(req.params.id)) });
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    const parsed = sectionInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.format() });
    }
    const [{ maxOrder }] = await db
      .select({ maxOrder: sql<number>`coalesce(max(sort_order), 0)` })
      .from(pageSections)
      .where(eq(pageSections.pageId, page.id));
    const [created] = await db
      .insert(pageSections)
      .values({
        pageId: page.id,
        type: parsed.data.type,
        title: parsed.data.title ?? null,
        isVisible: parsed.data.isVisible ?? true,
        sortOrder: (maxOrder || 0) + 1,
        draftContent: parsed.data.content || {},
        publishedContent: null,
      })
      .returning();
    await logAudit(req.admin, "create", "page_section", created.id, { pageId: page.id, type: created.type });
    return res.status(201).json({ success: true, message: "Section added", data: created });
  } catch (error) {
    next(error);
  }
};

export const updateSection = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = updateSectionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.format() });
    }
    const set: Record<string, unknown> = { updatedAt: new Date() };
    if (parsed.data.type !== undefined) set.type = parsed.data.type;
    if (parsed.data.title !== undefined) set.title = parsed.data.title;
    if (parsed.data.isVisible !== undefined) set.isVisible = parsed.data.isVisible;
    if (parsed.data.content !== undefined) set.draftContent = parsed.data.content;
    const updated = await db
      .update(pageSections)
      .set(set)
      .where(eq(pageSections.id, String(req.params.sectionId)))
      .returning();
    if (!updated[0]) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    await logAudit(req.admin, "update", "page_section", String(req.params.sectionId));
    return res.status(200).json({ success: true, message: "Section saved as draft", data: updated[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteSection = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const deleted = await db
      .delete(pageSections)
      .where(eq(pageSections.id, String(req.params.sectionId)))
      .returning();
    if (!deleted[0]) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    await logAudit(req.admin, "delete", "page_section", String(req.params.sectionId));
    return res.status(200).json({ success: true, message: "Section deleted" });
  } catch (error) {
    next(error);
  }
};

export const reorderSections = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.format() });
    }
    for (let i = 0; i < parsed.data.sectionIds.length; i++) {
      await db
        .update(pageSections)
        .set({ sortOrder: i + 1, updatedAt: new Date() })
        .where(eq(pageSections.id, String(parsed.data.sectionIds[i])));
    }
    await logAudit(req.admin, "reorder", "page_section", null, { count: parsed.data.sectionIds.length });
    return res.status(200).json({ success: true, message: "Sections reordered" });
  } catch (error) {
    next(error);
  }
};

// === PUBLISH WORKFLOW ===

export const publishPage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const page = await db.query.pages.findFirst({ where: eq(pages.id, String(req.params.id)) });
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    const sections = await db.query.pageSections.findMany({
      where: eq(pageSections.pageId, page.id),
    });
    // Copy draft content to published content for every section atomically
    for (const section of sections) {
      await db
        .update(pageSections)
        .set({ publishedContent: section.draftContent ?? {}, updatedAt: new Date() })
        .where(eq(pageSections.id, section.id));
    }
    const [published] = await db
      .update(pages)
      .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(pages.id, page.id))
      .returning();
    await logAudit(req.admin, "publish", "page", page.id, { slug: page.slug, sections: sections.length });
    return res.status(200).json({ success: true, message: "Page published", data: published });
  } catch (error) {
    next(error);
  }
};

export const unpublishPage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [updated] = await db
      .update(pages)
      .set({ status: "draft", updatedAt: new Date() })
      .where(eq(pages.id, String(req.params.id)))
      .returning();
    if (!updated) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    await logAudit(req.admin, "unpublish", "page", String(req.params.id));
    return res.status(200).json({ success: true, message: "Page unpublished", data: updated });
  } catch (error) {
    next(error);
  }
};

export const previewPage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const page = await db.query.pages.findFirst({ where: eq(pages.id, String(req.params.id)) });
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    const sections = await db.query.pageSections.findMany({
      where: and(eq(pageSections.pageId, page.id), eq(pageSections.isVisible, true)),
      orderBy: [sql`sort_order asc`, sql`created_at asc`],
    });
    return res.status(200).json({
      success: true,
      data: {
        slug: page.slug,
        title: page.title,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        status: page.status,
        sections: sections.map((s: any) => ({ type: s.type, content: s.draftContent || {} })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// === PUBLIC: PUBLISHED PAGE ===

export const getPublishedPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await db.query.pages.findFirst({
      where: eq(pages.slug, String(req.params.slug)),
    });
    if (!page || page.status !== "published") {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    const sections = await db.query.pageSections.findMany({
      where: and(eq(pageSections.pageId, page.id), eq(pageSections.isVisible, true)),
      orderBy: [sql`sort_order asc`, sql`created_at asc`],
    });
    return res.status(200).json({
      success: true,
      message: "Page fetched successfully",
      data: {
        slug: page.slug,
        title: page.title,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        publishedAt: page.publishedAt,
        sections: sections
          .filter((s: any) => s.publishedContent != null)
          .map((s: any) => ({ type: s.type, content: s.publishedContent })),
      },
    });
  } catch (error) {
    next(error);
  }
};
