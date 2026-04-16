import { Router, type IRouter } from "express";
import { chatController } from "../controllers/chat.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { chatRateLimit } from "../middleware/rateLimit.middleware.js";
import { ChatRequestSchema } from "../schemas/chat.schema.js";

const router: IRouter = Router();

router.post(
  "/chat",
  chatRateLimit,
  validate(ChatRequestSchema),
  chatController,
);

export default router;
