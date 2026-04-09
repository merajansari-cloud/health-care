import { openai, OPENAI_MODEL, SYSTEM_PROMPT } from "../config/openai.js";
import type { ChatMessageInput } from "../schemas/chat.schema.js";
import { AppError } from "../middleware/error.middleware.js";
import type { ChatResponse } from "../schemas/chat.schema.js";

export async function getChatReply(
  message: string,
  history: ChatMessageInput[],
): Promise<ChatResponse> {
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.content,
    })),
    { role: "user", content: message },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      max_tokens: 600,
      temperature: 0.5,
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      throw new AppError(502, "EMPTY_AI_RESPONSE", "AI returned an empty response.");
    }

    return { reply, model: completion.model };
  } catch (err) {
    if (err instanceof AppError) throw err;

    const message =
      err instanceof Error ? err.message : "Unknown OpenAI error";
    throw new AppError(502, "AI_SERVICE_ERROR", `AI service error: ${message}`);
  }
}
