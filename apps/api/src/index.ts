import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { db } from "./config/db";
import { sql } from "drizzle-orm";
import apiRoutes from "./routes/index";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// Allowed origins — local dev + production frontend
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  env.FRONTEND_URL,
  "https://elitevertex-web.vercel.app",
  "https://elitevertex.vercel.app",
].filter((v): v is string => Boolean(v));

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server (no origin) and all allowed origins
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
}));
app.use(express.json());
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
});
app.use("/api", limiter);

// Base route & Health check
app.get("/", (req: Request, res: Response) => {
  res.json({ success: true, message: "EliteVertex API is running on Vercel" });
});
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ success: true, message: "API is healthy" });
});

// Routes
app.use("/api/v1", apiRoutes);

// Error Handling
app.use(errorHandler);

// Safe idempotent check for certificate showcase columns
async function ensureDatabaseColumns() {
  if (!db) return;
  try {
    await db.execute(sql`
      ALTER TABLE "website_settings" ADD COLUMN IF NOT EXISTS "cert_showcase_enabled" boolean DEFAULT true;
      ALTER TABLE "website_settings" ADD COLUMN IF NOT EXISTS "cert_showcase_title" text;
      ALTER TABLE "website_settings" ADD COLUMN IF NOT EXISTS "cert_showcase_subtitle" text;
      ALTER TABLE "website_settings" ADD COLUMN IF NOT EXISTS "cert_showcase_student_name" varchar(255);
      ALTER TABLE "website_settings" ADD COLUMN IF NOT EXISTS "cert_showcase_course_name" varchar(255);
      ALTER TABLE "website_settings" ADD COLUMN IF NOT EXISTS "cert_showcase_cert_number" varchar(100);
      ALTER TABLE "website_settings" ADD COLUMN IF NOT EXISTS "cert_showcase_issue_date" varchar(100);
      ALTER TABLE "website_settings" ADD COLUMN IF NOT EXISTS "cert_showcase_grade" varchar(100);
      ALTER TABLE "website_settings" ADD COLUMN IF NOT EXISTS "cert_showcase_badge_text" varchar(100);
    `);
  } catch (err) {
    // Non-blocking: continue even if connection is delayed
  }
}
ensureDatabaseColumns();

if (!process.env.VERCEL) {
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
  });
}

export default app;


