import { Request, Response, NextFunction } from "express";
import { db } from "../config/db";
import { sql } from "drizzle-orm";
import { certificates } from "../db/schema";

export const verifyCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { certificateNumber } = req.params;

    if (!certificateNumber) {
      return res.status(400).json({
        success: false,
        message: "Certificate number is required",
      });
    }

    const certificate = await db.query.certificates.findFirst({
      where: sql`certificate_number = ${certificateNumber}`,
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    // Only return safe public data
    const safeData = {
      certificateNumber: certificate.certificateNumber,
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      issueDate: certificate.issueDate,
      status: certificate.status,
    };

    return res.status(200).json({
      success: true,
      message: "Certificate verified successfully",
      data: safeData,
    });
  } catch (error) {
    next(error);
  }
};
