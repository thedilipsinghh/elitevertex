import { Router } from "express";
import { requireAdmin, requireRole } from "../middleware/auth.middleware";
import * as adminCtrl from "../controller/admin.controller";
import * as pagesCtrl from "../controller/pages.controller";
import * as navCtrl from "../controller/navigation.controller";
import * as mediaCtrl from "../controller/media.controller";
import * as dashboardCtrl from "../controller/dashboard.controller";
import * as usersCtrl from "../controller/users.controller";
import * as certCtrl from "../controller/certificate.controller";
import {
  validate,
  courseSchema,
  gallerySchema,
  faqSchema,
  testimonialSchema,
  mentorSchema,
  campusSchema,
  settingsSchema,
  aboutSchema,
  messageStatusSchema,
  certificateSchema,
} from "../validation/schemas";

const router = Router();

// Protect all admin routes
router.use(requireAdmin);

// Dashboard
router.get("/dashboard/stats", dashboardCtrl.getDashboardStats);

// CMS: Courses
router.get("/courses", adminCtrl.getAdminCourses);
router.get("/courses/:id", adminCtrl.getAdminCourseById);
router.post("/courses/seed", adminCtrl.seedDefaultCourses);
router.post("/courses", validate(courseSchema.partial()), adminCtrl.createCourse);
router.patch("/courses/:id", validate(courseSchema.partial()), adminCtrl.updateCourse);
router.delete("/courses/:id", adminCtrl.deleteCourse);

// CMS: Gallery
router.post("/gallery", validate(gallerySchema.partial()), adminCtrl.createGalleryItem);
router.patch("/gallery/:id", validate(gallerySchema.partial()), adminCtrl.updateGalleryItem);
router.delete("/gallery/:id", adminCtrl.deleteGalleryItem);

// CMS: FAQs
router.get("/faqs", adminCtrl.getAdminFaqs);
router.post("/faqs", validate(faqSchema.partial()), adminCtrl.createFaq);
router.patch("/faqs/:id", validate(faqSchema.partial()), adminCtrl.updateFaq);
router.delete("/faqs/:id", adminCtrl.deleteFaq);

// CMS: Testimonials (Reviews)
router.get("/testimonials", adminCtrl.getAdminTestimonials);
router.post("/testimonials", validate(testimonialSchema.partial()), adminCtrl.createTestimonial);
router.patch("/testimonials/:id", validate(testimonialSchema.partial()), adminCtrl.updateTestimonial);
router.delete("/testimonials/:id", adminCtrl.deleteTestimonial);

// CMS: Website Settings & Homepage CRM
router.get("/settings", adminCtrl.getAdminWebsiteSettings);
router.post("/settings", validate(settingsSchema.partial()), adminCtrl.updateWebsiteSettings);
router.patch("/settings", validate(settingsSchema.partial()), adminCtrl.updateWebsiteSettings);

// CMS: Mentors
router.get("/mentors", adminCtrl.getAdminMentors);
router.post("/mentors", validate(mentorSchema.partial()), adminCtrl.createMentor);
router.patch("/mentors/:id", validate(mentorSchema.partial()), adminCtrl.updateMentor);
router.delete("/mentors/:id", adminCtrl.deleteMentor);

// CMS: About Page
router.get("/about", adminCtrl.getAdminAboutPage);
router.post("/about", validate(aboutSchema.partial()), adminCtrl.updateAboutPage);
router.patch("/about", validate(aboutSchema.partial()), adminCtrl.updateAboutPage);

// CMS: Campuses
router.get("/campuses", adminCtrl.getAdminCampuses);
router.post("/campuses", validate(campusSchema.partial()), adminCtrl.createCampus);
router.patch("/campuses/:id", validate(campusSchema.partial()), adminCtrl.updateCampus);
router.delete("/campuses/:id", adminCtrl.deleteCampus);

// CMS: Certificates & Credentials
router.get("/certificates", certCtrl.getAdminCertificates);
router.post("/certificates/seed", certCtrl.seedSampleCertificates);
router.get("/certificates/:id", certCtrl.getAdminCertificateById);
router.post("/certificates", validate(certificateSchema), certCtrl.createCertificate);
router.patch("/certificates/:id", validate(certificateSchema.partial()), certCtrl.updateCertificate);
router.delete("/certificates/:id", certCtrl.deleteCertificate);
router.post("/certificates/signatures", certCtrl.updateAuthoritySignatures);

// Leads / Contact Enquiries CRM
router.get("/messages", adminCtrl.getAdminMessages);
router.get("/messages/export/csv", adminCtrl.exportMessagesCsv);
router.patch("/messages/:id", validate(messageStatusSchema), adminCtrl.updateMessageStatus);
router.delete("/messages/:id", adminCtrl.deleteMessage);

// Audit logs
router.get("/audit-logs", adminCtrl.getAuditLogs);

// Media library
router.get("/media", mediaCtrl.getMediaLibrary);
router.patch("/media/:id", mediaCtrl.updateMedia);
router.delete("/media/:id", mediaCtrl.deleteMedia);

// Pages & sections (editors can edit drafts; publishing is admin-only)
router.get("/pages", pagesCtrl.listPages);
router.post("/pages", pagesCtrl.createPage);
router.get("/pages/:id", pagesCtrl.getPage);
router.patch("/pages/:id", pagesCtrl.updatePageMeta);
router.delete("/pages/:id", requireRole("admin"), pagesCtrl.deletePage);
router.post("/pages/:id/duplicate", pagesCtrl.duplicatePage);
router.post("/pages/:id/publish", requireRole("admin"), pagesCtrl.publishPage);
router.post("/pages/:id/unpublish", requireRole("admin"), pagesCtrl.unpublishPage);
router.get("/pages/:id/preview", pagesCtrl.previewPage);
router.post("/pages/:id/sections", pagesCtrl.addSection);
router.patch("/sections/:sectionId", pagesCtrl.updateSection);
router.delete("/sections/:sectionId", pagesCtrl.deleteSection);
router.post("/sections/reorder", pagesCtrl.reorderSections);

// Navigation menus
router.get("/navigation", navCtrl.listMenus);
router.post("/navigation/:location/items", navCtrl.createMenuItem);
router.patch("/navigation/items/:itemId", navCtrl.updateMenuItem);
router.delete("/navigation/items/:itemId", navCtrl.deleteMenuItem);
router.post("/navigation/items/reorder", navCtrl.reorderMenuItems);

// User management (admin only)
router.get("/users", requireRole("admin"), usersCtrl.listUsers);
router.post("/users", requireRole("admin"), usersCtrl.createUser);
router.patch("/users/:id", requireRole("admin"), usersCtrl.updateUser);
router.delete("/users/:id", requireRole("admin"), usersCtrl.deleteUser);

export default router;
