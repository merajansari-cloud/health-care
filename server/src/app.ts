import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { globalRateLimit } from "./middleware/rateLimit.middleware.js";

const app: Express = express();

// 🔥 Logger
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

// 🔥 CORS (keep strict + safe for Vercel)
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// 🔥 Body parsing (increase limit to avoid silent failures)
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// 🔥 Rate limit (after body parsing)
app.use(globalRateLimit);

// 🔥 Health check (IMPORTANT)
app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// 🔥 TEST endpoint (VERY IMPORTANT for debugging JSON issue)
app.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "API working fine",
  });
});

// 🔥 API routes
app.use("/api", router);

// 🔥 FIXED 404 handler (always return JSON)
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// 🔥 GLOBAL ERROR HANDLER (SAFE JSON ALWAYS)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);

  return res.status(500).json({
    success: false,
    message: err?.message || "Internal Server Error",
  });
});

// 🔥 Export app
export default app;
