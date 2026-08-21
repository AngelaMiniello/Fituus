import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token" });
    }

    // Si envían "Bearer <token>", toma el token; si envían solo el token, toma la primera parte
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    // Validación extra: si el token vino vacío o como "undefined" (string)
    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({ error: "Token malformado o no provisto" });
    }

    const secret = process.env.JWT_SECRET || "secret_key_fallback"; // 👈 Clave por defecto si falla el .env

    const decoded = jwt.verify(token, secret) as any;

    // guardamos el user en el request
    (req as any).user = decoded;

    next();
  } catch (error) {
    console.log("Error en authMiddleware:", error);

    return res.status(401).json({
      error: "Token inválido",
    });
  }
};