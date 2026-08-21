import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Exercise } from "./entities/exercise.entity";
import { User } from "../user/entities/user.entity";
import { Between } from "typeorm";

export const createExercise = async ( req: Request, res: Response ) => {
  try {
    const userId = (req as any).user.id;

    const exerciseRepository =
      AppDataSource.getRepository(Exercise);

    const userRepository =
      AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({
      id: userId
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const { name, duration, caloriesBurned} = req.body;

    const exercise =
      exerciseRepository.create({
        ...req.body,
        baseDuration: req.body.duration,
        baseCaloriesBurned: req.body.caloriesBurned,
        user
      });

    await exerciseRepository.save(exercise);

    return res.status(201).json(exercise);

  } catch(error){

    console.log(error);

    return res.status(500).json({
      message: "Error creating exercise"
    });

  }

};

export const getTodayExercises = async ( req: Request, res: Response ) => {
  try {
    const exerciseRepository = AppDataSource.getRepository(Exercise);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const userId = (req as any).user.id;

    const exercises = await exerciseRepository.find({
      where: {
        user: {
          id: userId,
        },
        createdAt: Between(today, tomorrow),
      }
    });

    const totalCaloriesBurned = exercises.reduce((acc, exercise) => acc + exercise.caloriesBurned, 0);
  
    return res.json({
      totalCaloriesBurned,
      exercises
    });

  } catch (error){
    console.log(error);

    return res.status(500).json({
      message:
        "Error getting exercises"
    });
  }
}

export const getExerciseById = async ( req: Request, res: Response ) => {
 try {
    const exerciseRepository = AppDataSource.getRepository(Exercise);
    
    const userId = (req as any).user.id;

    const exercise =
      await exerciseRepository.findOne({
        where: {
          id: Number(req.params.id),
          user: {
            id: userId
          }
        }
      });

    if (!exercise) {
      return res.status(404).json({
        error: "Exercise not found"
      });
    }

    return res.json(exercise);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      error: "Error getting exercise"
    });

  }
};

export const updateExercise = async (req: Request, res: Response ) => {
  try {
    const { id } = req.params;//el id q me traigo de los params 
    const exerciseRepository = AppDataSource.getRepository(Exercise);//busco el repositorio de exercises en la db

    const exercise = await exerciseRepository.findOneBy({id: Number(id)});//me traigo el ejercicio de la db de acuerdo al id q le mande

    if(!exercise){
      return res.status(404).json({
        message:"Exercise not found"
      });
    }

    const duration =  Number(req.body.duration);//"Tomo la nueva duración que me envió el frontend."
    
    exercise.duration = duration;//actualizando el valor que se guarda en la base de datos
    exercise.caloriesBurned = (exercise.baseCaloriesBurned * duration ) / exercise.baseDuration; //Las calorías nuevas se calculan usando la duración nueva
  
    const updateExercise = await exerciseRepository.save(exercise);

    return res.json(updateExercise);

  } catch (error){
    
    console.log(error);

    return res.status(500).json({
      messege: "Error updating exercise"
    });
  }
}