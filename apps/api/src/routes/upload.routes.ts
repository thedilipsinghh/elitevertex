import { Router, Request, Response } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { AuthenticatedRequest, requireAdmin } from "../middleware/auth.middleware";
import { cloudinary } from "../config/cloudinary";
import { db } from "../config/db";
import { media } from "../db/schema";
import { logAudit } from "../lib/audit";

const router = Router();

const ALLOWED_FORMATS = ["jpg", "png", "jpeg", "webp", "gif", "svg"];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "elitevertax/media",
    allowed_formats: ALLOWED_FORMATS,
  } as any,
});

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
});

router.post("/", requireAdmin, upload.single("image"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }

    const file = req.file as any;
    const folder = String(req.body?.folder || "elitevertax/media");

    const [record] = await db
      .insert(media)
      .values({
        url: file.path,
        publicId: file.filename || file.public_id || null,
        filename: file.originalname || null,
        mimeType: file.mimetype || null,
        size: file.size || null,
        width: file.width || null,
        height: file.height || null,
        alt: String(req.body?.alt || file.originalname || ""),
        caption: req.body?.caption ? String(req.body.caption) : null,
        folder,
      })
      .returning();

    await logAudit(req.admin, "upload", "media", record?.id, { filename: file.originalname });

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: file.path,
        ...(record || {}),
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ success: false, message: "Image upload failed" });
  }
});

export default router;
