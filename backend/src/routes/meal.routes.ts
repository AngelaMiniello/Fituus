import { Router } from "express";
import { createMeal, getMeals, getTodayMeals, searchFoods, deleteMeal, getMealById, updateMeal } from "../meal/meal.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createMeal);
router.get("/", authMiddleware, getMeals);
router.get("/today", authMiddleware, getTodayMeals);
router.get("/search", authMiddleware, searchFoods);
router.get("/:id", authMiddleware, getMealById);
router.put ("/:id", authMiddleware, updateMeal);
router.delete("/:id", authMiddleware, deleteMeal);

export default router;