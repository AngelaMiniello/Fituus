import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Meal } from "../meal/entities/meal.entity";
import { Goal } from "../goal/entities/goal.entity";
import { WaterEntry } from "../water/entities/water-entry.entity";
import { Exercise } from "../exercise/entities/exercise.entity";
import { WeightEntry } from "../user/entities/weight-entry.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [User, Meal, Goal, WaterEntry, Exercise, WeightEntry],
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});
