import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { db } from "./config/db";
import apiRoutes from "./routes/index";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// Allowed origins — local dev + production frontend + custom domains
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://www.elitevertex.in",
  "https://elitevertex.in",
  "https://elitevertex-web.vercel.app",
  "https://elitevertex.vercel.app",
  env.FRONTEND_URL,
].filter((v): v is string => Boolean(v));

const isAllowedOrigin = (origin: string): boolean => {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Match apex and any subdomain of elitevertex.in (e.g. www.elitevertex.in)
  if (/^https?:\/\/([a-z0-9-]+\.)?elitevertex\.in$/i.test(origin)) return true;
  // Match any Vercel preview or production deployment
  if (/^https?:\/\/([a-z0-9-]+\.)?vercel\.app$/i.test(origin)) return true;
  return false;
};

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server (no origin) and all allowed origins
    if (!origin || isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    // Safely reject disallowed origins without throwing an unhandled Error (which causes HTTP 500)
    return callback(null, false);
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

if (!process.env.VERCEL) {
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
  });
}

export default app;


