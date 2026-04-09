import { Router, type IRouter } from "express";
import healthRouter from "./health.routes.js";
import chatRouter from "./chat.routes.js";
import predictRouter from "./predict.routes.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(chatRouter);
router.use(predictRouter);

export default router;
