import { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "../config/db";
import { admins } from "../db/schema";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { logAudit } from "../lib/audit";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).max(255),
  role: z.enum(["admin", "editor"]).default("editor"),
});

const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  role: z.enum(["admin", "editor"]).optional(),
  password: z.string().min(8).optional(),
});

const sanitize = (u: any) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  role: u.role,
  createdAt: u.createdAt,
});

export const listUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const list = await db.query.admins.findMany();
    return res.status(200).json({ success: true, data: list.map(sanitize) });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.format() });
    }
    const email = parsed.data.email.trim().toLowerCase();
    const existing = await db.query.admins.findFirst({ where: eq(admins.email, email) });
    if (existing) {
      return res.status(409).json({ success: false, message: "A user with this email already exists" });
    }
    const [created] = await db
      .insert(admins)
      .values({
        email,
        name: parsed.data.name,
        role: parsed.data.role,
        passwordHash: await bcrypt.hash(parsed.data.password, 10),
      })
      .returning();
    await logAudit(req.admin, "create", "admin_user", created.id, { email });
    return res.status(201).json({ success: true, message: "User created", data: sanitize(created) });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.format() });
    }
    const set: Record<string, unknown> = { updatedAt: new Date() };
    if (parsed.data.name !== undefined) set.name = parsed.data.name;
    if (parsed.data.role !== undefined) set.role = parsed.data.role;
    if (parsed.data.password !== undefined) set.passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const updated = await db.update(admins).set(set).where(eq(admins.id, String(req.params.id))).returning();
    if (!updated[0]) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await logAudit(req.admin, "update", "admin_user", String(req.params.id), { role: parsed.data.role });
    return res.status(200).json({ success: true, message: "User updated", data: sanitize(updated[0]) });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.admin?.id === req.params.id) {
      return res.status(400).json({ success: false, message: "You cannot delete your own account" });
    }
    const deleted = await db.delete(admins).where(eq(admins.id, String(req.params.id))).returning();
    if (!deleted[0]) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await logAudit(req.admin, "delete", "admin_user", String(req.params.id));
    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};
