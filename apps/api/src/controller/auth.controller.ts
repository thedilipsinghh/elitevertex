import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db";
import { env } from "../config/env";
import { sql } from "drizzle-orm";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

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

    // Check credentials directly against environment variables
    const adminUser = env.ADMIN_USER || "admin@elitevertax.com";
    const adminPass = env.ADMIN_PASS || "password123";

    if (email !== adminUser || password !== adminPass) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { adminId: "env-admin", email: adminUser },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRATION as any }
    );

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: "env-admin",
        name: "Super Admin",
        email: adminUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogout = (req: Request, res: Response) => {
  res.clearCookie("admin_token");
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
