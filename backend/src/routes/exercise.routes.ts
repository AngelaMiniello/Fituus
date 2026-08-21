import { Router } from "express";
import { createExercise, getTodayExercises, getExerciseById, updateExercise } from "../exercise/exercise.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post( "/", authMiddleware, createExercise);
router.get( "/today", authMiddleware, getTodayExercises);
router.get( "/:id", authMiddleware, getExerciseById);
router.put( "/:id", authMiddleware, updateExercise);

export default router;
