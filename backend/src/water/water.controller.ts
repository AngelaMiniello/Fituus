import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { WaterEntry } from "./entities/water-entry.entity";
import { User } from "../user/entities/user.entity";
import { Between } from "typeorm";

export const addWater = async ( req: Request, res: Response) => {
  try {

    const userId = (req as any).user.id;

    const { amount } = req.body;

    const userRepository =
      AppDataSource.getRepository(User);

    const waterRepository =
      AppDataSource.getRepository(WaterEntry);

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

    const entry = waterRepository.create({
      amount,
      user,
    });

    await waterRepository.save(entry);

    return res.json(entry);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Error agregando agua",
    });

  }

};

export const getTodayWater = async ( req: Request, res: Response) => {
  try {

    const userId = (req as any).user.id;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    const waterRepository =
      AppDataSource.getRepository(WaterEntry);

    const entries =
      await waterRepository.find({
        where: {
          user: {
            id: userId,
          },
          createdAt: Between(
            today,
            tomorrow
          ),
        },
      });

    return res.json(entries);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Error obteniendo agua",
    });

  }

};