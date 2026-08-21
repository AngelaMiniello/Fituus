import dotenv from "dotenv";
dotenv.config();
import server from "./server";
import { AppDataSource } from "./config/data-source"; // ⚠️ Ajusta la ruta si tu data-source está en otro lado

const PORT = 3000;

// 1. Inicializar la base de datos primero
AppDataSource.initialize()
  .then(() => {
    console.log("Base de datos conectada correctamente 🛢️");

    // 2. Levantar el servidor Express una vez conectada la BD
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`API corriendo en http://localhost:${PORT}`);
      console.log(`Expo puede conectarse usando tu IP local en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar la base de datos:", error);
  });