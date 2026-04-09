import { z } from "zod";

export const PredictRequestSchema = z.object({
  symptoms: z
    .array(z.string().min(1).max(100))
    .min(1, "At least one symptom is required")
    .max(20, "Too many symptoms provided"),
  userId: z.string().optional(),
});

export const PredictionResultSchema = z.object({
  name: z.string(),
  matchPercent: z.number(),
  severity: z.enum(["mild", "moderate", "severe"]),
  recommendation: z.string(),
  specialist: z.string(),
  matchedSymptoms: z.array(z.string()),
  description: z.string(),
});

export const PredictResponseSchema = z.object({
  results: z.array(PredictionResultSchema),
  totalMatched: z.number(),
  symptomsAnalyzed: z.array(z.string()),
});

export type PredictRequest = z.infer<typeof PredictRequestSchema>;
export type PredictResponse = z.infer<typeof PredictResponseSchema>;
