import { Router, type IRouter } from "express";
import { predictController } from "../controllers/predict.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { predictRateLimit } from "../middleware/rateLimit.middleware.js";
import { PredictRequestSchema } from "../schemas/predict.schema.js";

const router: IRouter = Router();

router.post(
  "/predict",
  predictRateLimit,
  validate(PredictRequestSchema),
  predictController,
);

export default router;
