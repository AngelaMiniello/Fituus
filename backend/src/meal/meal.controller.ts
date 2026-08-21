import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Meal } from "./entities/meal.entity";
import { User } from "../user/entities/user.entity";
import { Between } from "typeorm";
import axios from "axios";

export const createMeal = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const mealRepository = AppDataSource.getRepository(Meal);
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({ error: "User no encontrado" });
    }

    const newMeal = mealRepository.create({
      ...req.body,
      date: new Date(),
      user
    });

    await mealRepository.save(newMeal);

    res.status(201).json(newMeal);

  } catch (error) {

    console.error("EL ERROR REAL ES:", error);
    res.status(500).json({ error: "Error creando meal" });
  }
};

export const getMeals = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const mealRepository = AppDataSource.getRepository(Meal);

    const meals = await mealRepository.find({
      where: {
        user: { id: userId }
      }
    });

    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo meals" });
  }
};

export const getTodayMeals = async (req: Request, res: Response) => {
  try {
    const mealRepository = AppDataSource.getRepository(Meal);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const userId = (req as any).user.id;

    const meals = await mealRepository.find({
      where: {
        user: {
          id: userId,
        },
        createdAt: Between(today, tomorrow),
      },
    });
    
    const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
    const totalProtein = meals.reduce((acc, m) => acc + m.protein, 0);
    const totalCarbs = meals.reduce((acc, m) => acc + m.carbs, 0);
    const totalFat = meals.reduce((acc, m) => acc + m.fat, 0);

    res.json({
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      meals
    });

  } catch (error) {
    res.status(500).json({ error: "Error obteniendo resumen" });
  }
};

export const searchFoods = async ( req: Request, res: Response ) => {
  try {

    const { query } = req.query;

    const response = await axios.get(
      "https://api.nal.usda.gov/fdc/v1/foods/search",
      {
        params: {
          query,
          api_key: process.env.USDA_API_KEY
        }
      }
    );

    res.json(response.data.foods);

  } catch(error) {

    console.error(error);

    res.status(500).json({
      message:"Error buscando alimentos"
    });

  }

};

export const deleteMeal = async (req: Request, res: Response) => {
  try {
    const mealId = Number(req.params.id);
    const userId = (req as any).user.id;

    const mealRepository = AppDataSource.getRepository(Meal);

    //buscamos en la db
    const meal = await mealRepository.findOne({
      where: {
        id: mealId
      },
      relations:["user"]
});

if (!meal) {
  return res.status(404).json({
    error:"Meal no encontrada"
  });
}

if (meal.user.id !== userId) {
  return res.status(403).json({
    error:"No autorizado"
  });
}

    await mealRepository.remove(meal);

    res.json({
      message:"Meal deleted"
    });

  } catch(error) {

    console.log(error);

    res.status(500).json({
      error:"Error trying to delete meal"
    });
  }
};

export const getMealById = async ( req: Request, res: Response ) => {
  try {
    const mealRepository = AppDataSource.getRepository(Meal);
    const userId = (req as any).user.id;

    const meal = await mealRepository.findOne({
      where: {
        id: Number(req.params.id),
        user: {
          id: userId
        }
      }
    });

    if(!meal){
      return res.status(404).json({
        error:"Meal no encontrada"
      });
    }

    res.json(meal);

  } catch(error){

    console.log(error);

    res.status(500).json({
      error:"Error obteniendo meal"
    });
  }
};

export const updateMeal = async ( req: Request, res: Response ) => {
 try {
    const { id } = req.params;
    const mealRepository = AppDataSource.getRepository(Meal);

    const meal = await mealRepository.findOneBy({
      id: Number(id)
    });

    if(!meal){
      return res.status(404).json({
        message:"Meal not found"
      });
    }

    const quantity = Number(req.body.quantity);

    meal.calories = (meal.baseCalories * quantity) / 100;
    meal.protein = (meal.baseProtein * quantity) / 100;
    meal.carbs = (meal.baseCarbs * quantity) / 100;
    meal.fat = (meal.baseFat * quantity) / 100;

    const updatedMeal = await mealRepository.save(meal);

    return res.json(updatedMeal);

  } catch(error){

    console.log(error);

    return res.status(500).json({
      message:"Error updating meal"
    });

  }
};