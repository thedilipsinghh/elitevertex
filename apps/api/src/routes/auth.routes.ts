import { Router } from "express";
import { adminLogin, adminLogout, getMe } from "../controller/auth.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", adminLogin);
router.post("/logout", adminLogout);
router.get("/me", requireAdmin, getMe);

export default router;
