import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../user/entities/user.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

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

    if (!user.password) {
      return res.status(401).json({
        error: "Esta cuenta usa Google. Iniciá sesión con Google."
      });
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

    const { password: _, googleId: __, ...safeUser } = user;

    return res.json({
      user: safeUser,
      token
    });

  } catch (error) {
    res.status(500).json({ error: "Error en login" });
  }
};

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      email,
      name,
      password: hashedPassword
    });

    await userRepository.save(newUser);

    // 1. Generamos el JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = newUser;

    // 2. Devolvemos el token junto al usuario
    return res.status(201).json({
      message: "Usuario creado exitosamente",
      user: userWithoutPassword,
      token // <- Token listo para usar en el frontend
    });

  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const googleClient = new OAuth2Client();

export const googleLogin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { idToken } = req.body;

  if (typeof idToken !== "string" || !idToken) {
    return res.status(400).json({ error: "Falta el token de Google" });
  }

  const clientId = process.env.GOOGLE_WEB_CLIENT_ID;
  const jwtSecret = process.env.JWT_SECRET;

  if (!clientId || !jwtSecret) {
    return res.status(500).json({
      error: "Falta configurar la autenticación en el servidor"
    });
  }

  let googleUser;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: clientId
    });

    googleUser = ticket.getPayload();
  } catch {
    return res.status(401).json({
      error: "El token de Google no es válido o expiró"
    });
  }

  if (!googleUser?.sub || !googleUser.email || !googleUser.email_verified) {
    return res.status(401).json({
      error: "Google no proporcionó un correo verificado"
    });
  }

  try {
    const repository = AppDataSource.getRepository(User);

    let user = await repository.findOne({
      where: { googleId: googleUser.sub }
    });

    if (!user) {
      const existingUser = await repository.findOne({
        where: { email: googleUser.email }
      });

      // Vincular una cuenta existente requiere verificar su sesión.
      if (existingUser) {
        return res.status(409).json({
          error:
            "Ya tenés una cuenta con este correo. Iniciá sesión con tu contraseña para vincular Google."
        });
      }

      user = repository.create({
        name: googleUser.name || googleUser.email.split("@")[0],
        email: googleUser.email,
        googleId: googleUser.sub,
        password: null
      });

      await repository.save(user);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtSecret,
      { expiresIn: "1h" }
    );

    const { password: _, googleId: __, ...safeUser } = user;

    return res.json({
      user: safeUser,
      token
    });
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);

    return res.status(500).json({
      error: "No se pudo iniciar sesión con Google"
    });
  }
};