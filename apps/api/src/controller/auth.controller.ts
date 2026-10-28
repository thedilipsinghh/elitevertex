import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { env } from "../config/env";
import { admins } from "../db/schema";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signToken = (payload: { adminId: string; email: string; role: string }) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRATION as any,
  });

const setAuthCookie = (res: Response, token: string) => {
  const isProd = env.NODE_ENV === "production";
  res.cookie("admin_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });
};

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.format(),
      });
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();

    let user = await db.query.admins.findFirst({
      where: eq(admins.email, normalizedEmail),
    });

    // Bootstrap: if no DB user matches but env credentials do, create the admin account.
    if (!user) {
      const envUser = (env.ADMIN_USER || "").trim().toLowerCase();
      const envPass = env.ADMIN_PASS || "";
      if (normalizedEmail === envUser && password === envPass) {
        const [created] = await db
          .insert(admins)
          .values({
            email: normalizedEmail,
            passwordHash: await bcrypt.hash(envPass, 10),
            name: "Super Admin",
            role: "admin",
          })
          .returning();
        user = created;
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if (!passwordOk) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = signToken({
      adminId: user.id,
      email: user.email,
      role: user.role,
    });
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogout = (req: Request, res: Response) => {
  const isProd = env.NODE_ENV === "production";
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (req.admin.id === "env-admin") {
      return res.status(200).json({
        success: true,
        data: { id: "env-admin", name: "Super Admin", email: req.admin.email, role: "admin" },
      });
    }
    const user = await db.query.admins.findFirst({ where: eq(admins.id, req.admin.id) });
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    return res.status(200).json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};
