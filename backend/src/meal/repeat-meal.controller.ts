import { Request, Response } from "express";
import { And, LessThan, MoreThanOrEqual } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Meal } from "./entities/meal.entity";
import { User } from "../user/entities/user.entity";

import { mealDay } from "./meal-day";

export const repeatLastMeal = async (req: Request, res: Response) => {
  const { mealType, utcOffsetMinutes = 0 } = req.body || {};
  if (!["breakfast", "lunch", "dinner", "snack"].includes(mealType) || !Number.isInteger(utcOffsetMinutes) || Math.abs(utcOffsetMinutes) > 840) {
    return res.status(400).json({ message: "Invalid meal type or timezone" });
  }
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  try {
    const result = await AppDataSource.transaction(async manager => {
      const user = await manager.findOne(User, { where: { id: userId }, lock: { mode: "pessimistic_write" } });
      if (!user) return { status: 404, message: "User not found" };
      const repository = manager.getRepository(Meal);
      const today = mealDay(new Date(), utcOffsetMinutes);
      const current = await repository.exists({ where: { user: { id: userId }, mealType, createdAt: And(MoreThanOrEqual(today.start), LessThan(today.end)) } });
      if (current) return { status: 409, message: `You already have ${mealType} logged today.` };
      const last = await repository.findOne({ where: { user: { id: userId }, mealType, createdAt: LessThan(today.start) }, order: { createdAt: "DESC", id: "DESC" } });
      if (!last) return { status: 404, message: `No previous ${mealType} found. Log one first to repeat it another day.` };
      const previous = mealDay(last.createdAt, utcOffsetMinutes);
      const foods = await repository.find({ where: { user: { id: userId }, mealType, createdAt: And(MoreThanOrEqual(previous.start), LessThan(previous.end)) }, order: { createdAt: "ASC", id: "ASC" } });
      // Copy nutrition and portions only. New IDs and timestamps belong to today.
      const copies = foods.map(food => repository.create({
        name: food.name, mealType, image: food.image,
        calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat,
        quantity: food.quantity, baseCalories: food.baseCalories, baseProtein: food.baseProtein,
        baseCarbs: food.baseCarbs, baseFat: food.baseFat, user,
      }));
      const saved = await repository.save(copies);
      return { status: 201, meals: saved.map(({ user: _, ...meal }) => meal) };
    });
    return res.status(result.status).json(result.meals ? { meals: result.meals } : { message: result.message });
  } catch (error) {
    console.error("Error repeating meal:", error);
    return res.status(500).json({ message: "Could not repeat this meal. Please try again." });
  }
};
