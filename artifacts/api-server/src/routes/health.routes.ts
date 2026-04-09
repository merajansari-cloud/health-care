import { Router, type IRouter } from "express";
import { healthCheck } from "../controllers/health.controller.js";

const router: IRouter = Router();

router.get("/health", healthCheck);

export default router;
