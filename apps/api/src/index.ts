import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import apiRoutes from "./routes/index";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      origin === env.FRONTEND_URL ||
      origin.endsWith(".vercel.app") ||
      process.env.NODE_ENV !== "production"
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
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


