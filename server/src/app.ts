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

// 🔥 CORS fix (IMPORTANT for Vercel frontend)
app.use(
  cors({
    origin: "*", // safer for testing + avoids JSON issues
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 Preflight support
app.options("*", cors());

// 🔥 Basic safety middleware
app.use(globalRateLimit);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// 🔥 Health check (VERY IMPORTANT for debugging)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// 🔥 API routes
app.use("/api", router);

// 🔥 404 handler (IMPORTANT to avoid empty responses)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// 🔥 Error handler
app.use(errorMiddleware);

export default app;
