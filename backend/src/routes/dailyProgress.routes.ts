import { Router } from "express";
import { getDailyProgress } from "../dailyProgress/dailyProgress.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getDailyProgress);

export default router;
