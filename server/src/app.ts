import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { globalRateLimit } from "./middleware/rateLimit.middleware.js";

const app: Express = express();

// Logger
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  })
);

// CORS
app.use(
  cors({
    origin: "*", // IMPORTANT fix for Vercel + frontend issues
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// Body parser (increase limit to avoid silent failure)
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limit
app.use(globalRateLimit);

// 🔥 IMPORTANT: health check (must for debugging)
app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server running",
  });
});

// API routes
app.use("/api", router);

// 🔥 FIX: 404 must always return JSON (NOT empty / HTML)
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// 🔥 FIX: Safe error handler (prevents empty response crash)
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  return res.status(500).json({
    success: false,
    message: err?.message || "Internal Server Error",
  });
});

export default app;
