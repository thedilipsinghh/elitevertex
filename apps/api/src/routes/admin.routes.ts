import { Router } from "express";
import { requireAdmin } from "../middleware/auth.middleware";
import * as adminCtrl from "../controller/admin.controller";

const router = Router();

// Protect all admin routes
router.use(requireAdmin);

// CMS: Courses
router.post("/courses", adminCtrl.createCourse);
router.patch("/courses/:id", adminCtrl.updateCourse);
router.delete("/courses/:id", adminCtrl.deleteCourse);

// CMS: Gallery
router.post("/gallery", adminCtrl.createGalleryItem);
router.patch("/gallery/:id", adminCtrl.updateGalleryItem);
router.delete("/gallery/:id", adminCtrl.deleteGalleryItem);

export default router;
