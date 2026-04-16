import { z } from "zod";

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

export const ChatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(2000, "Message too long"),
  history: z.array(ChatMessageSchema).max(50, "History too long").default([]),
  userId: z.string().optional(),
});

export const ChatResponseSchema = z.object({
  reply: z.string(),
  model: z.string(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;
