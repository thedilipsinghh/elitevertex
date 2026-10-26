import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { env } from "../config/env";
import { db } from "../config/db";
import { admins } from "../db/schema";

export interface AuthenticatedRequest extends Request {
  cookies: any;
  admin?: {
    id: string;
    email: string;
    role: "admin" | "editor";
  };
}

export const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.admin_token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as {
      adminId: string;
      email: string;
      role?: "admin" | "editor";
    };

    // Legacy env-based tokens carry no DB identity; treat as full admin.
    if (decoded.adminId === "env-admin") {
      req.admin = { id: decoded.adminId, email: decoded.email, role: "admin" };
      return next();
    }

    const user = await db.query.admins.findFirst({
      where: eq(admins.id, decoded.adminId),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Account no longer exists",
      });
    }

    req.admin = {
      id: user.id,
      email: user.email,
      role: user.role as "admin" | "editor",
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

export const requireRole =
  (...roles: Array<"admin" | "editor">) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient permissions",
      });
    }
    next();
  };
