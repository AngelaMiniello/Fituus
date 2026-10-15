import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadUserMetrics } from "../user/user.controller"; 
import { getWeightHistory, addWeightEntry } from "../user/weight.controller";

const router = Router();

router.patch("/profile/metrics", authMiddleware, uploadUserMetrics);
router.get("/weight-history", authMiddleware, getWeightHistory);
router.post("/weight-history", authMiddleware, addWeightEntry);

export default router;
