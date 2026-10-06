import { Router } from "express";
import publicRoutes from "./public.routes";
import authRoutes from "./auth.routes";
import adminRoutes from "./admin.routes";
import uploadRoutes from "./upload.routes";

const router = Router();

router.use("/", publicRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/admin/upload", uploadRoutes);

export default router;
