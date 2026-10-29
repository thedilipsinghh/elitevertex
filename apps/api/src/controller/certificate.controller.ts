import { Request, Response, NextFunction } from "express";
import { db } from "../config/db";
import { sql, desc } from "drizzle-orm";
import { certificates, websiteSettings } from "../db/schema";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

// Public Verification Endpoint
export const verifyCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawNumber = String(req.params.certificateNumber || "");

    if (!rawNumber.trim()) {
      return res.status(400).json({
        success: false,
        message: "Certificate number is required",
      });
    }

    const cleanNumber = rawNumber.trim().toUpperCase();

    // Query certificate
    const certificate = await db.query.certificates.findFirst({
      where: sql`UPPER(certificate_number) = ${cleanNumber}`,
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found in Elite Vertex Academic Registry",
      });
    }

    // Query authority signatories from website settings
    let settings: any = null;
    try {
      settings = await db.query.websiteSettings.findFirst();
    } catch (e) {
      console.warn("Could not load authority settings for verification:", e);
    }

    const data = {
      id: certificate.id,
      certificateNumber: certificate.certificateNumber,
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      issueDate: certificate.issueDate,
      grade: certificate.grade || "Distinction",
      customNote: certificate.customNote || "We appreciate their dedication and commitment towards learning and skill development.",
      status: certificate.status,
      // Authority Signatures
      signatory1: {
        name: settings?.certSig1Name || "Dr. Aris Thorne",
        title: settings?.certSig1Title || "Authorized Signatory",
        signUrl: settings?.certSig1Sign || "",
      },
      signatory2: {
        name: settings?.certSig2Name || "Prof. Marcus Vance",
        title: settings?.certSig2Title || "Director / Principal",
        signUrl: settings?.certSig2Sign || "",
      },
      instituteName: settings?.instituteName || "Elite Vertex",
      logoUrl: settings?.logoUrl || "",
    };

    return res.status(200).json({
      success: true,
      message: "Certificate verified successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: List all certificates
export const getAdminCertificates = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim().toUpperCase() : "";

    let items;
    if (q) {
      items = await db.query.certificates.findMany({
        where: sql`UPPER(student_name) LIKE ${`%${q}%`} OR UPPER(certificate_number) LIKE ${`%${q}%`} OR UPPER(course_name) LIKE ${`%${q}%`}`,
        orderBy: [desc(certificates.createdAt)],
      });
    } else {
      items = await db.query.certificates.findMany({
        orderBy: [desc(certificates.createdAt)],
      });
    }

    // Also include current authority signatures and hero showcase settings in metadata
    let settings: any = null;
    try {
      settings = await db.query.websiteSettings.findFirst();
    } catch (e) {
      console.warn("Could not load website settings for certificates metadata:", e);
    }
    const authoritySignatures = {
      sig1Name: settings?.certSig1Name || "Dr. Aris Thorne",
      sig1Title: settings?.certSig1Title || "Authorized Signatory",
      sig1Sign: settings?.certSig1Sign || "",
      sig2Name: settings?.certSig2Name || "Prof. Marcus Vance",
      sig2Title: settings?.certSig2Title || "Director / Principal",
      sig2Sign: settings?.certSig2Sign || "",
    };

    const showcaseSettings = {
      enabled: settings?.certShowcaseEnabled ?? true,
      title: settings?.certShowcaseTitle || "Official Institutional Attestation",
      subtitle: settings?.certShowcaseSubtitle || "Tamper-proof verifiable credentials backed by central academic registrar ledger.",
      studentName: settings?.certShowcaseStudentName || "Aditi Sharma",
      courseName: settings?.certShowcaseCourseName || "Executive Spoken English & Global Communication",
      certNumber: settings?.certShowcaseCertNumber || "EV-2025-ENG-8492",
      issueDate: settings?.certShowcaseIssueDate || "14 Nov 2025",
      grade: settings?.certShowcaseGrade || "Distinction (CEFR C1)",
      badgeText: settings?.certShowcaseBadgeText || "OFFICIAL SPECIMEN",
    };

    return res.status(200).json({
      success: true,
      data: items,
      authoritySignatures,
      showcaseSettings,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get single certificate
export const getAdminCertificateById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const cert = await db.query.certificates.findFirst({
      where: sql`id = ${req.params.id}`,
    });

    if (!cert) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    return res.status(200).json({ success: true, data: cert });
  } catch (error) {
    next(error);
  }
};

// Admin: Create new certificate
export const createCertificate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { studentName, certificateNumber, courseName, issueDate, grade, customNote, status } = req.body;

    const cleanNum = (certificateNumber || "").trim().toUpperCase();

    // Check duplicate
    const existing = await db.query.certificates.findFirst({
      where: sql`UPPER(certificate_number) = ${cleanNum}`,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Certificate number "${cleanNum}" already exists. Please use a unique number.`,
      });
    }

    const [created] = await db
      .insert(certificates)
      .values({
        studentName: studentName.trim(),
        certificateNumber: cleanNum,
        courseName: courseName.trim(),
        issueDate: issueDate,
        grade: grade?.trim() || null,
        customNote: customNote?.trim() || null,
        status: status === "revoked" ? "revoked" : "valid",
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Certificate issued successfully",
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update certificate
export const updateCertificate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { studentName, certificateNumber, courseName, issueDate, grade, customNote, status } = req.body;

    const cert = await db.query.certificates.findFirst({
      where: sql`id = ${id}`,
    });

    if (!cert) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    const cleanNum = certificateNumber ? certificateNumber.trim().toUpperCase() : cert.certificateNumber;

    // Check duplicate if certificateNumber changed
    if (cleanNum !== cert.certificateNumber) {
      const existing = await db.query.certificates.findFirst({
        where: sql`UPPER(certificate_number) = ${cleanNum} AND id != ${id}`,
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Certificate number "${cleanNum}" is already in use by another record.`,
        });
      }
    }

    const [updated] = await db
      .update(certificates)
      .set({
        studentName: studentName !== undefined ? studentName.trim() : cert.studentName,
        certificateNumber: cleanNum,
        courseName: courseName !== undefined ? courseName.trim() : cert.courseName,
        issueDate: issueDate !== undefined ? issueDate : cert.issueDate,
        grade: grade !== undefined ? (grade?.trim() || null) : cert.grade,
        customNote: customNote !== undefined ? (customNote?.trim() || null) : cert.customNote,
        status: status !== undefined ? status : cert.status,
        updatedAt: new Date(),
      })
      .where(sql`id = ${id}`)
      .returning();

    return res.status(200).json({
      success: true,
      message: "Certificate updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete certificate
export const deleteCertificate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await db.delete(certificates).where(sql`id = ${id}`);
    return res.status(200).json({ success: true, message: "Certificate deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Admin: Update Authority Signatures CMS
export const updateAuthoritySignatures = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { sig1Name, sig1Title, sig1Sign, sig2Name, sig2Title, sig2Sign } = req.body;

    const existing = await db.query.websiteSettings.findFirst();

    if (existing) {
      await db
        .update(websiteSettings)
        .set({
          certSig1Name: sig1Name,
          certSig1Title: sig1Title,
          certSig1Sign: sig1Sign,
          certSig2Name: sig2Name,
          certSig2Title: sig2Title,
          certSig2Sign: sig2Sign,
          updatedAt: new Date(),
        })
        .where(sql`id = ${existing.id}`);
    } else {
      await db.insert(websiteSettings).values({
        certSig1Name: sig1Name,
        certSig1Title: sig1Title,
        certSig1Sign: sig1Sign,
        certSig2Name: sig2Name,
        certSig2Title: sig2Title,
        certSig2Sign: sig2Sign,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Authority signatures updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update Hero Showcase Settings CMS
export const updateShowcaseSettings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const {
      enabled,
      title,
      subtitle,
      studentName,
      courseName,
      certNumber,
      issueDate,
      grade,
      badgeText,
    } = req.body;

    const existing = await db.query.websiteSettings.findFirst();

    const payload = {
      certShowcaseEnabled: enabled !== undefined ? Boolean(enabled) : true,
      certShowcaseTitle: title || "Official Institutional Attestation",
      certShowcaseSubtitle: subtitle || "Tamper-proof verifiable credentials backed by central academic registrar ledger.",
      certShowcaseStudentName: studentName || "Aditi Sharma",
      certShowcaseCourseName: courseName || "Executive Spoken English & Global Communication",
      certShowcaseCertNumber: certNumber || "EV-2025-ENG-8492",
      certShowcaseIssueDate: issueDate || "14 Nov 2025",
      certShowcaseGrade: grade || "Distinction (CEFR C1)",
      certShowcaseBadgeText: badgeText || "OFFICIAL SPECIMEN",
      updatedAt: new Date(),
    };

    if (existing) {
      await db
        .update(websiteSettings)
        .set(payload)
        .where(sql`id = ${existing.id}`);
    } else {
      await db.insert(websiteSettings).values(payload);
    }

    return res.status(200).json({
      success: true,
      message: "Hero showcase settings updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Seed sample certificates if none exist
export const seedSampleCertificates = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const count = await db.query.certificates.findMany({ limit: 1 });
    if (count.length > 0) {
      return res.status(200).json({ success: true, message: "Certificates already exist", count: count.length });
    }

    const demoCerts = [
      {
        certificateNumber: "EV-2025-ENG-8492",
        studentName: "Aditi Sharma",
        courseName: "Advanced Spoken English & Executive Communication",
        issueDate: "2025-11-14",
        grade: "Distinction (CEFR C1)",
        customNote: "We appreciate their dedication and commitment towards learning and skill development.",
        status: "valid" as const,
      },
      {
        certificateNumber: "EV-2026-ENG-9014",
        studentName: "Rahul Verma",
        courseName: "Public Speaking & Leadership Rhetoric",
        issueDate: "2026-02-10",
        grade: "Grade A+ (Distinction)",
        customNote: "Demonstrated exceptional mastery in extempore presentations and boardroom communications.",
        status: "valid" as const,
      },
    ];

    for (const cert of demoCerts) {
      await db.insert(certificates).values(cert);
    }

    return res.status(201).json({
      success: true,
      message: "Demo certificates seeded successfully",
    });
  } catch (error) {
    next(error);
  }
};
