import { Router } from "express";
import { getGoals, updateGoals,} from "../goal/goal.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getGoals);
router.put("/", authMiddleware, updateGoals);

export default router;