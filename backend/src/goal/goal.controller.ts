import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Goal } from "./entities/goal.entity";
import { User } from "../user/entities/user.entity";

interface AuthRequest extends Request {
  user?: User;
}

const goalRepository = AppDataSource.getRepository(Goal);
const userRepository = AppDataSource.getRepository(User);

export const getGoals = async ( req: AuthRequest,
  res: Response) =>  {
   try {
      const userId = req.user?.id;

      let goals = await goalRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
      });

    if (!goals) {

      const userRepository =
        AppDataSource.getRepository(User);

      const user = await userRepository.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).json({
          error: "Usuario no encontrado",
        });
      }

      goals = goalRepository.create({
        dailyCalories: 2000,
        proteinGoal: 120,
        carbsGoal: 200,
        fatGoal: 60,
        waterGoal: 2500,
        stepsGoal: 10000,
        sleepGoal: 8,
        workoutsPerWeek: 4,
        user,
      });

      await goalRepository.save(goals);

    }

    return res.json(goals);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Error obteniendo goals",
    });

  }

};

export const updateGoals = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const userId = req.user?.id;

    let  goals = await goalRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ["user"],
    });

    if (!goals) {

    const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado",
    });
  }

  goals = goalRepository.create({
    dailyCalories: 2000,
    proteinGoal: 120,
    carbsGoal: 200,
    fatGoal: 60,
    waterGoal: 2500,
    stepsGoal: 10000,
    sleepGoal: 8,
    workoutsPerWeek: 4,
    user,
  });

}

    Object.assign(goals, req.body);

    await goalRepository.save(goals);

    return res.json(goals);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Error actualizando goals",
    });

  }

};