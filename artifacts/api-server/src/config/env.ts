import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.string().min(1),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  AI_INTEGRATIONS_OPENAI_BASE_URL: z.string().min(1, "AI_INTEGRATIONS_OPENAI_BASE_URL is required"),
  AI_INTEGRATIONS_OPENAI_API_KEY: z.string().min(1, "AI_INTEGRATIONS_OPENAI_API_KEY is required"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  LOG_LEVEL: z.string().default("info"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment configuration:",
    parsed.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const env = parsed.data;
