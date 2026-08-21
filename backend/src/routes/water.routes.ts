import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { addWater, getTodayWater } from "../water/water.controller";

const router = Router();

router.post( "/",authMiddleware, addWater);
router.get("/today", authMiddleware, getTodayWater);

export default router;