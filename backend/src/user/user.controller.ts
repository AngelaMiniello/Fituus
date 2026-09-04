import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../user/entities/user.entity";
import { Goal } from "../goal/entities/goal.entity";

export const uploadUserMetrics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { weight, height, gender, activityLevel, goal } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const goalRepository = AppDataSource.getRepository(Goal);

    // 1. Buscamos al usuario junto con su relación Goal
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: { goal: true }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Métrica de números (evitando NaN)
    if (weight !== undefined && weight !== null && !isNaN(Number(weight))) {
      user.weight = Number(weight);
    }
    if (height !== undefined && height !== null && !isNaN(Number(height))) {
      user.height = Number(height);
    }

    // 3. Normalización de Enums en minúscula para PostgreSQL
    if (gender) {
      user.gender = gender.toLowerCase() as "male" | "female";
    }
    if (activityLevel) {
      user.activityLevel = activityLevel.toLowerCase() as any;
    }

    // 4. Guardado seguro en la relación Goal utilizando goalType
    if (goal) {
      if (user.goal) {
        // Si ya tenía un Goal guardado, actualizamos el goalType
        user.goal.goalType = goal;
        await goalRepository.save(user.goal);
      } else {
        // Si no tenía Goal, creamos una nueva instancia en la DB
        const newGoal = goalRepository.create({
          goalType: goal,
          dailyCalories: 2000, // Valor por defecto inicial si corresponde
          user: user,
        });
        await goalRepository.save(newGoal);
        user.goal = newGoal;
      }
    }

    // 5. Guardamos la entidad User con las métricas actualizadas
    await userRepository.save(user);

    return res.status(200).json({
      message: "Metrics and goals updated successfully",
      user,
    });
  } catch (error) {
    console.error("🔴 Error al actualizar métricas:", error);

    return res.status(500).json({
      message: "Error updating metrics",
    });
  }
};