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

// CMS: Website Settings & Homepage CRM
router.get("/settings", adminCtrl.getAdminWebsiteSettings);
router.post("/settings", adminCtrl.updateWebsiteSettings);
router.patch("/settings", adminCtrl.updateWebsiteSettings);

// CMS: Mentors
router.get("/mentors", adminCtrl.getAdminMentors);
router.post("/mentors", adminCtrl.createMentor);
router.patch("/mentors/:id", adminCtrl.updateMentor);
router.delete("/mentors/:id", adminCtrl.deleteMentor);

// CMS: About Page
router.get("/about", adminCtrl.getAdminAboutPage);
router.post("/about", adminCtrl.updateAboutPage);
router.patch("/about", adminCtrl.updateAboutPage);

// CMS: Campuses
router.get("/campuses", adminCtrl.getAdminCampuses);
router.post("/campuses", adminCtrl.createCampus);
router.patch("/campuses/:id", adminCtrl.updateCampus);
router.delete("/campuses/:id", adminCtrl.deleteCampus);

// Leads / Contact Enquiries CRM
router.get("/messages", adminCtrl.getAdminMessages);
router.patch("/messages/:id", adminCtrl.updateMessageStatus);
router.delete("/messages/:id", adminCtrl.deleteMessage);

export default router;
