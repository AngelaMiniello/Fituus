import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadUserMetrics } from "../user/user.controller"; 

const router = Router();

router.patch("/profile/metrics", authMiddleware, uploadUserMetrics);

export default router;