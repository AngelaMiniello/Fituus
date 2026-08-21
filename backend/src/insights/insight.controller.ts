import { Request, Response } from "express";
import { generateInsight } from "../ai/gemini.service";

export const getWeeklyInsight = async (req: Request, res: Response) => {

  const prompt = ` ... `;

  const insight = await generateInsight(prompt);

  res.json({
    insight,
  });
  
};