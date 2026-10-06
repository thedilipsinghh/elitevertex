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

// CMS: FAQs
router.get("/faqs", adminCtrl.getAdminFaqs);
router.post("/faqs", adminCtrl.createFaq);
router.patch("/faqs/:id", adminCtrl.updateFaq);
router.delete("/faqs/:id", adminCtrl.deleteFaq);

// CMS: Testimonials (Reviews)
router.get("/testimonials", adminCtrl.getAdminTestimonials);
router.post("/testimonials", adminCtrl.createTestimonial);
router.patch("/testimonials/:id", adminCtrl.updateTestimonial);
router.delete("/testimonials/:id", adminCtrl.deleteTestimonial);

export default router;
