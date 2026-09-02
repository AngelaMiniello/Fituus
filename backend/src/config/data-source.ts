import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Meal } from "../meal/entities/meal.entity";
import { Goal } from "../goal/entities/goal.entity";
import { WaterEntry } from "../water/entities/water-entry.entity";
import { Exercise } from "../exercise/entities/exercise.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User, Meal, Goal, WaterEntry, Exercise],
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});