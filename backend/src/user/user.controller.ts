import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../user/entities/user.entity";

export const uploadUserMetrics = async ( req: Request, res: Response )  => {
    try {
      const userId = (req as any).user.id;
      const { weight, height, gender, activityLevel } = req.body;

      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOneBy({
        id: userId
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
      
      user.weight = Number(weight);
      user.height = Number(height);
      user.gender = gender;
      user.activityLevel = activityLevel;
      
      await userRepository.save(user);

      return res.status(200).json({
        message: "Metrics updated successfully",
        user,
      });

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Error updating metrics"
      });
    }
};