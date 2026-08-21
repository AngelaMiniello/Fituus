import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../user/entities/user.entity";
import { Meal } from "../meal/entities/meal.entity";
import { Exercise } from "../exercise/entities/exercise.entity";
import { WaterEntry } from "../water/entities/water-entry.entity";
import { Between} from "typeorm";

interface AuthRequest extends Request {
  user?: User;
}

export const getDailyProgress = async ( req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const mealRepository = AppDataSource.getRepository(Meal);
    const exerciseRepository = AppDataSource.getRepository(Exercise);
    const waterRepository = AppDataSource.getRepository(WaterEntry);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const meals = await mealRepository.find({
      where: {
        user: { id: userId },
        createdAt: Between(today, tomorrow),
      },
    });

    const exercises = await exerciseRepository.find({
      where: {
        user: { id: userId },
        createdAt: Between(today, tomorrow),
      },
    });

    
    const waters = await waterRepository.find({
      where: {
        user: { id: userId },
        createdAt: Between(today, tomorrow),
      },
    });

    const caloriesConsumed = meals.reduce(
      (sum, meal) => sum + meal.calories,
      0
    );

    const protein = meals.reduce(
      (sum, meal) => sum + meal.protein,
      0
    );

    const carbs = meals.reduce(
      (sum, meal) => sum + meal.carbs,
      0
    );

    const fat = meals.reduce(
      (sum, meal) => sum + meal.fat,
      0
    );

    const caloriesBurned = exercises.reduce(
      (sum, exercise) =>
        sum + exercise.caloriesBurned,
      0
    );

    const water = waters.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );

    // Sumamos los minutos totales de los ejercicios del día
const exerciseMinutes = exercises.reduce(
  (sum, exercise) => sum + exercise.duration,
  0
);

// Formateamos la lista de ejercicios para enviarla al front
const exerciseList = exercises.map((e) => ({
  id: e.id,
  type: e.name,              // Usa el 'name' de la entidad
  minutes: e.duration,       // Usa la 'duration' de la entidad
  calories: e.caloriesBurned // Usa las 'caloriesBurned' de la entidad
}));

    return res.json({
      caloriesConsumed,
      caloriesBurned,
      protein,
      carbs,
      fat,
      water,
      exerciseMinutes,          
      exercises: exerciseList,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Error getting daily summary",
    });
  }
};