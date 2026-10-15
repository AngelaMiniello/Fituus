import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Goal } from "./entities/goal.entity";
import { User } from "../user/entities/user.entity";

interface AuthRequest extends Request { user?: User; }
const defaults = { dailyCalories: 2000, proteinGoal: 120, carbsGoal: 200, fatGoal: 60, waterGoal: 2500, stepsGoal: 10000, sleepGoal: 8, workoutsPerWeek: 4 };
const limits: Record<string, number> = { dailyCalories: 20000, proteinGoal: 2000, carbsGoal: 5000, fatGoal: 2000, waterGoal: 20000, stepsGoal: 200000, sleepGoal: 24, workoutsPerWeek: 7 };
function publicGoals(goal: Goal) {
  return { id: goal.id, goalType: goal.goalType, ...Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [key, (goal as any)[key] ?? fallback])) };
}

export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Authentication required" });
    const repository = AppDataSource.getRepository(Goal);
    let goals = await repository.findOne({ where: { user: { id: userId } } });
    if (!goals) {
      const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
      if (!user) return res.status(404).json({ error: "User not found" });
      goals = await repository.save(repository.create({ ...defaults, user }));
    }
    return res.json(publicGoals(goals));
  } catch (error) {
    console.error("Error getting goals:", error);
    return res.status(500).json({ error: "Could not load goals" });
  }
};

export const updateGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Authentication required" });
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) return res.status(400).json({ error: "Invalid goals" });
    const updates: Record<string, number> = {};
    for (const [inputKey, value] of Object.entries(body)) {
      // Compatibility with older app versions; the database field is workoutsPerWeek.
      const key = inputKey === "workoutsPerWeekGoal" ? "workoutsPerWeek" : inputKey;
      if (!Object.prototype.hasOwnProperty.call(limits, key) || typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > limits[key] || (key !== "sleepGoal" && !Number.isInteger(value)) || (key === "dailyCalories" && value === 0)) {
        return res.status(400).json({ error: `Invalid goal: ${inputKey}` });
      }
      updates[key] = value;
    }
    if (Object.keys(updates).length === 0) return res.status(400).json({ error: "No goals to update" });
    const goals = await AppDataSource.transaction(async manager => {
      const user = await manager.findOne(User, { where: { id: userId }, lock: { mode: "pessimistic_write" } });
      if (!user) return null;
      const repository = manager.getRepository(Goal);
      let goal = await repository.findOne({ where: { user: { id: userId } } });
      if (!goal) goal = repository.create({ ...defaults, user });
      Object.assign(goal, updates);
      return repository.save(goal);
    });
    if (!goals) return res.status(404).json({ error: "User not found" });
    return res.json(publicGoals(goals));
  } catch (error) {
    console.error("Error updating goals:", error);
    return res.status(500).json({ error: "Could not save goals" });
  }
};
