import { Router } from "express";
import { getCourses, getGallery, getTestimonials, getFaqs, getWebsiteSettings, getMentors, getAboutPage, getCampuses } from "../controller/public.controller";
import { submitContactForm } from "../controller/contact.controller";
import { verifyCertificate } from "../controller/certificate.controller";

const router = Router();

router.get("/courses", getCourses);
router.get("/gallery", getGallery);
router.get("/testimonials", getTestimonials);
router.get("/faqs", getFaqs);
router.get("/website-settings", getWebsiteSettings);
router.get("/mentors", getMentors);
router.get("/about", getAboutPage);
router.get("/campuses", getCampuses);
router.post("/contact", submitContactForm);
router.get("/certificates/verify/:certificateNumber", verifyCertificate);

export default router;
