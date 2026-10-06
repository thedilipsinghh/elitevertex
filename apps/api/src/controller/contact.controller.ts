import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { db } from "../config/db";
import { contactMessages } from "../db/schema";
import nodemailer from "nodemailer";
import { env } from "../config/env";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  program: z.string().optional(),
  mode: z.string().optional(),
  message: z.string().min(2),
});

export const submitContactForm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.format(),
      });
    }

    const data = parsed.data;

    // Save to DB
    await db.insert(contactMessages).values({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      program: data.program,
      mode: data.mode,
      message: data.message,
    });

    // Send Emails if configured
    if (env.EMAIL_FROM && env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: env.EMAIL_FROM,
          pass: env.EMAIL_PASS,
        },
      });

      // Email to Admin
      if (env.ADMIN_USER) {
        await transporter.sendMail({
          from: env.EMAIL_FROM,
          to: env.ADMIN_USER,
          subject: `New Contact Form Submission: ${data.subject || "No Subject"}`,
          text: `New Contact Form Submission\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "N/A"}\nSubject: ${data.subject || "N/A"}\nMessage:\n${data.message}`,
        }).catch(err => console.error("Admin Email Error:", err));
      }

      // Email to Customer
      await transporter.sendMail({
        from: env.EMAIL_FROM,
        to: data.email,
        subject: "Thank you for contacting Elite Vertex",
        text: `Dear ${data.name},\n\nThank you for contacting us.\n\nWe have received your message. Our team will review it and contact you shortly.\n\nBest Regards,\nElite Vertex Team`,
      }).catch(err => console.error("Customer Email Error:", err));
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    next(error);
  }
};
