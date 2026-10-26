import { Request, Response, NextFunction } from "express";
import { and, eq, ilike, or, sql, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "../config/db";
import { media } from "../db/schema";
import { cloudinary } from "../config/cloudinary";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { logAudit } from "../lib/audit";

const updateMediaSchema = z.object({
  alt: z.string().max(500).optional(),
  caption: z.string().max(1000).optional(),
});

export const getMediaLibrary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || "1"), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || "24"), 10) || 24));
    const search = String(req.query.search || "").trim();
    const folder = String(req.query.folder || "").trim();

    const conditions = [];
    if (search) {
      const pattern = `%${search}%`;
      conditions.push(or(ilike(media.alt, pattern), ilike(media.caption, pattern), ilike(media.filename, pattern)));
    }
    if (folder) {
      conditions.push(eq(media.folder, folder));
    }
    const where = conditions.length ? and(...conditions) : undefined;

    const [totalRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(media)
      .where(where);

    const total = totalRow?.count ?? 0;
    const items = await db
      .select()
      .from(media)
      .where(where)
      .orderBy(desc(media.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return res.status(200).json({
      success: true,
      message: "Media fetched successfully",
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMedia = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = updateMediaSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.format() });
    }
    const updated = await db
      .update(media)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(media.id, String(req.params.id)))
      .returning();
    if (!updated[0]) {
      return res.status(404).json({ success: false, message: "Media not found" });
    }
    await logAudit(req.admin, "update", "media", String(req.params.id), parsed.data as any);
    return res.status(200).json({ success: true, message: "Media updated", data: updated[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const existing = await db.query.media.findFirst({ where: eq(media.id, String(req.params.id)) });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Media not found" });
    }

    if (existing.publicId) {
      try {
        await cloudinary.uploader.destroy(existing.publicId);
      } catch (err) {
        console.error("Cloudinary destroy failed:", err);
      }
    }

    await db.delete(media).where(eq(media.id, String(req.params.id)));
    await logAudit(req.admin, "delete", "media", String(req.params.id));
    return res.status(200).json({ success: true, message: "Media deleted" });
  } catch (error) {
    next(error);
  }
};
