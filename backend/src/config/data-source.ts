import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Meal } from "../meal/entities/meal.entity";
import { Goal } from "../goal/entities/goal.entity";
import { WaterEntry } from "../water/entities/water-entry.entity";
import { Exercise } from "../exercise/entities/exercise.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Meal, Goal, WaterEntry, Exercise ],
});