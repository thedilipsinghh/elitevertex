import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().min(1).default("super_secret_jwt_access_key_default_32chars"),
  JWT_REFRESH_SECRET: z.string().optional(),
  JWT_ACCESS_EXPIRATION: z.string().default("15m"),
  JWT_REFRESH_EXPIRATION: z.string().default("7d"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  ADMIN_USER: z.string().optional(),
  ADMIN_PASS: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  VERCEL_URL: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
}

// Use parsed values or fall back to defaults — never throw at module load time
const baseEnv = _env.success
  ? _env.data
  : {
      NODE_ENV: (process.env.NODE_ENV as "development" | "production" | "test") || "production",
      PORT: Number(process.env.PORT) || 5000,
      DATABASE_URL: process.env.DATABASE_URL,
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "super_secret_jwt_access_key_default_32chars",
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || process.env.JWT_ACCESS_SECRET || "super_secret_jwt_refresh_key_default_32chars",
      JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || "15m",
      JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || "7d",
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
      ADMIN_USER: process.env.ADMIN_USER,
      ADMIN_PASS: process.env.ADMIN_PASS,
      EMAIL_PASS: process.env.EMAIL_PASS,
      EMAIL_FROM: process.env.EMAIL_FROM,
      FRONTEND_URL: process.env.FRONTEND_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
      VERCEL_URL: process.env.VERCEL_URL,
    };

export const env = {
  ...baseEnv,
  JWT_REFRESH_SECRET: baseEnv.JWT_REFRESH_SECRET || baseEnv.JWT_ACCESS_SECRET,
} as typeof baseEnv & { JWT_REFRESH_SECRET: string };

