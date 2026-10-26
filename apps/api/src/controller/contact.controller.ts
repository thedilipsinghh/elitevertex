import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { db } from "../config/db";
import { contactMessages } from "../db/schema";
import nodemailer from "nodemailer";
import { env } from "../config/env";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  program: z.string().optional().nullable(),
  mode: z.string().optional().nullable(),
  message: z.string().min(2, "Message must be at least 2 characters"),
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
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // 1. Save lead to Database (Guaranteed persistence)
    const [insertedLead] = await db
      .insert(contactMessages)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || null,
        program: data.program || null,
        mode: data.mode || null,
        message: data.message,
      })
      .returning();

    // 2. Dispatch Dual Notifications via Nodemailer if SMTP credentials exist
    const emailFrom = env.EMAIL_FROM?.trim() || "replyelitevertex@gmail.com";
    const emailPass = env.EMAIL_PASS?.trim();
    const adminRecipient = env.ADMIN_USER?.trim() || "dilipmotive@gmail.com";

    if (emailFrom && emailPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailFrom,
          pass: emailPass,
        },
      });

      const cleanPhone = (data.phone || "").replace(/[^0-9+]/g, "");

      // Template 1: High-Priority Admin Lead Notification
      const adminMailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Student Lead Alert</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #cbd5e1; }
    .header { background-color: #002855; color: #ffffff; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; }
    .badge { display: inline-block; background-color: #e0a924; color: #002855; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 24px; }
    .lead-table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 20px; font-size: 14px; }
    .lead-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
    .lead-table td.label { font-weight: 700; color: #64748b; width: 35%; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
    .lead-table td.value { font-weight: 600; color: #0f172a; }
    .message-box { background-color: #f8fafc; border-left: 4px solid #002855; padding: 16px; border-radius: 4px; margin-top: 12px; font-size: 14px; line-height: 1.6; color: #334155; }
    .actions { display: flex; gap: 10px; margin-top: 24px; flex-wrap: wrap; }
    .btn { display: inline-block; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 13px; text-align: center; }
    .btn-primary { background-color: #002855; color: #ffffff !important; }
    .btn-secondary { background-color: #10b981; color: #ffffff !important; }
    .footer { background-color: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Elite Vertex English Institute</h1>
      <span class="badge">🔥 New Student Lead Alert</span>
    </div>
    <div class="content">
      <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: #0f172a;">
        A new inquiry has been submitted through the public website. Please review and initiate contact within 24 hours.
      </p>

      <table class="lead-table">
        <tr>
          <td class="label">Student Name</td>
          <td class="value">${data.name}</td>
        </tr>
        <tr>
          <td class="label">Email Address</td>
          <td class="value"><a href="mailto:${data.email}" style="color: #002855; text-decoration: underline;">${data.email}</a></td>
        </tr>
        <tr>
          <td class="label">Phone / WhatsApp</td>
          <td class="value">${data.phone ? `<a href="tel:${cleanPhone}" style="color: #002855; text-decoration: underline;">${data.phone}</a>` : "Not provided"}</td>
        </tr>
        <tr>
          <td class="label">Program of Interest</td>
          <td class="value"><strong style="color: #002855;">${data.program || data.subject || "General Spoken English"}</strong></td>
        </tr>
        <tr>
          <td class="label">Learning Format</td>
          <td class="value">${data.mode || "Classroom / Campus"}</td>
        </tr>
        <tr>
          <td class="label">Subject</td>
          <td class="value">${data.subject || "Website Inquiry"}</td>
        </tr>
        <tr>
          <td class="label">Submission Time</td>
          <td class="value">${formattedDate} IST</td>
        </tr>
      </table>

      <div style="margin-top: 16px;">
        <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Student Query / Notes:</span>
        <div class="message-box">
          ${data.message.replace(/\n/g, "<br/>")}
        </div>
      </div>

      <div class="actions">
        <a href="mailto:${data.email}?subject=Regarding%20Your%20Inquiry%20at%20Elite%20Vertex" class="btn btn-primary">✉️ Reply to ${data.name}</a>
        ${data.phone ? `<a href="https://wa.me/${cleanPhone.replace("+", "")}" class="btn btn-secondary" target="_blank">💬 WhatsApp Student</a>` : ""}
      </div>
    </div>
    <div class="footer">
      Elite Vertex CRM System • Automated Lead Routing & Dispatch
    </div>
  </div>
</body>
</html>
      `;

      // Template 2: Professional Student Acknowledgement & Confirmation
      const studentMailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Inquiry Received - Elite Vertex</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #cbd5e1; }
    .header { background-color: #002855; color: #ffffff; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; }
    .subtitle { margin-top: 6px; font-size: 13px; color: #cbd5e1; letter-spacing: 0.5px; }
    .content { padding: 28px 24px; }
    .greeting { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
    .lead-text { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
    .steps-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 24px; }
    .step-item { display: flex; gap: 12px; margin-bottom: 12px; font-size: 13px; line-height: 1.5; color: #334155; }
    .step-num { width: 22px; height: 22px; border-radius: 50%; background-color: #002855; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 11px; flex-shrink: 0; }
    .summary-card { background-color: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 24px; font-size: 13px; }
    .summary-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 8px; }
    .support-bar { background-color: #e0f2fe; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; font-size: 13px; color: #0369a1; }
    .footer { background-color: #002855; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; }
    .footer a { color: #e0a924; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Elite Vertex English Institute</h1>
      <div class="subtitle">Premier Institute for Spoken English & Executive Communication</div>
    </div>
    <div class="content">
      <div class="greeting">Dear ${data.name},</div>
      <p class="lead-text">
        Thank you for contacting <strong>Elite Vertex English Institute</strong>. We have received your inquiry regarding our <strong>${data.program || "Spoken English & Communication"}</strong> training programs.
      </p>

      <div class="steps-box">
        <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">What Happens Next:</div>
        <div class="step-item">
          <div class="step-num">1</div>
          <div><strong>Academic Evaluation:</strong> Our senior admissions counselor will review your goals and language focus area.</div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div><strong>Consultation Callback:</strong> We will reach out to you within 24 hours to arrange your complimentary 1-on-1 speech diagnostic assessment.</div>
        </div>
        <div class="step-item" style="margin-bottom: 0;">
          <div class="step-num">3</div>
          <div><strong>Tailored Roadmap:</strong> We match you with the right cohort level, faculty mentor, and classroom or online schedule.</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-title">Your Submitted Details</div>
        <div style="margin-bottom: 4px;"><strong>Program:</strong> ${data.program || data.subject || "General Inquiry"}</div>
        <div style="margin-bottom: 4px;"><strong>Preferred Mode:</strong> ${data.mode || "Classroom / Campus"}</div>
        <div style="margin-bottom: 4px;"><strong>Phone:</strong> ${data.phone || "Not specified"}</div>
        <div style="margin-top: 8px; font-style: italic; color: #475569;">"${data.message}"</div>
      </div>

      <div class="support-bar">
        <strong>Need immediate assistance or want to visit the campus?</strong><br/>
        📞 Call Hotline: <strong>+91 (80) 4920-8800</strong><br/>
        💬 WhatsApp Desk: <strong>+91 98450 12345</strong><br/>
        📍 Campus: 42, Apex Tower, M.G. Road, Bengaluru, Karnataka 560001
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0; color: #cbd5e1; font-weight: 600;">Elite Vertex English Institute</p>
      <p style="margin: 0; color: #94a3b8; font-size: 11px;">ISO 9001:2015 Accredited Spoken English & Professional Communication</p>
    </div>
  </div>
</body>
</html>
      `;

      // Dispatch both emails asynchronously and handle errors gracefully
      Promise.allSettled([
        transporter.sendMail({
          from: `"Elite Vertex Lead Portal" <${emailFrom}>`,
          to: adminRecipient,
          replyTo: `${data.name} <${data.email}>`,
          subject: `🔥 [New Student Lead] ${data.name} - ${data.program || data.subject || "General Inquiry"}`,
          html: adminMailHtml,
        }),
        transporter.sendMail({
          from: `"Elite Vertex Admissions" <${emailFrom}>`,
          to: data.email,
          subject: "Confirmation: We've Received Your Inquiry — Elite Vertex English Institute",
          html: studentMailHtml,
        }),
      ])
        .then(([adminRes, studentRes]) => {
          if (adminRes.status === "fulfilled") {
            console.log("✓ Admin lead alert email sent successfully to", adminRecipient);
          } else {
            console.error("❌ Admin email dispatch failed:", adminRes.reason);
          }

          if (studentRes.status === "fulfilled") {
            console.log("✓ Student confirmation email sent successfully to", data.email);
          } else {
            console.error("❌ Student confirmation email dispatch failed:", studentRes.reason);
          }
        })
        .catch((err) => {
          console.error("❌ Unexpected email dispatch error:", err);
        });
    } else {
      console.warn("⚠️ SMTP credentials not fully set; lead stored in DB only.");
    }

    return res.status(201).json({
      success: true,
      message: "Thank you! Your message has been sent successfully. Our academic counselling team will contact you shortly.",
      data: {
        id: insertedLead?.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

