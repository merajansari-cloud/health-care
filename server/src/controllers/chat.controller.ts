import type { Request, Response, NextFunction } from "express";
import { getChatReply } from "../services/chat.service.js";
import type { ChatRequest } from "../schemas/chat.schema.js";

export async function chatController(
  req: Request<object, object, ChatRequest>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { message, history } = req.body;

    const result = await getChatReply(message, history);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}
