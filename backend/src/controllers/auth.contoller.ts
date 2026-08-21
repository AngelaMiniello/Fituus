import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../user/entities/user.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({
      user,
      token
    });

  } catch (error) {
    res.status(500).json({ error: "Error en login" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const userRepository = AppDataSource.getRepository(User);

    // verificar si ya existe
    const existingUser = await userRepository.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      email,
      name,
      password: hashedPassword
    });

    await userRepository.save(newUser);

    res.status(201).json({
      message: "Usuario creado",
      user: newUser
    });

  } catch (error) {
    console.error(error);
  res.status(500).json({ error: error });
}
};