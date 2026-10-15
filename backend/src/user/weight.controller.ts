import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "./entities/user.entity";
import { WeightEntry } from "./entities/weight-entry.entity";

export const getWeightHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const entries = await AppDataSource.getRepository(WeightEntry).find({
      where: { user: { id: userId } },
      order: { recordedAt: "ASC", id: "ASC" },
    });
    return res.json({ entries });
  } catch (error) {
    console.error("Error fetching weight history:", error);
    return res.status(500).json({ message: "Could not load weight history" });
  }
};

export const addWeightEntry = async (req: Request, res: Response) => {
  const weight = req.body.weight;
  if (typeof weight !== "number" || !Number.isFinite(weight) || weight <= 0 || weight >= 1000) {
    return res.status(400).json({ message: "Enter a valid weight in kg" });
  }
  try {
    const result = await AppDataSource.transaction(async manager => {
      const userId = (req as any).user.id;
      const user = await manager.findOne(User, { where: { id: userId }, lock: { mode: "pessimistic_write" } });
      if (!user) return null;
      const entry = await manager.save(WeightEntry, manager.create(WeightEntry, { weight, user }));
      user.weight = weight;
      await manager.save(User, user);
      return { entry, weight };
    });
    if (!result) return res.status(404).json({ message: "User not found" });
    return res.status(201).json(result);
  } catch (error) {
    console.error("Error recording weight:", error);
    return res.status(500).json({ message: "Could not save your weight" });
  }
};
