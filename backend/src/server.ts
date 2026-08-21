import express from "express";
import cors from "cors";
import mealRouter from "./routes/meal.routes";
import authRouter from "./routes/auth.routes";
import goalRouter from "./routes/goal.routes";
import waterRouter from "./routes/water.routes";
import exerciseRouter from "./routes/exercise.routes";
import dailyProgressRouter from "./routes/dailyProgress.routes";
import userRouter from "./routes/user.routes";

const server = express();

server.use(cors());
server.use(express.json());

server.use("/auth", authRouter);
server.use("/user", userRouter);
server.use("/meals", mealRouter);
server.use("/goals", goalRouter);
server.use("/water", waterRouter);
server.use("/exercises", exerciseRouter);
server.use("/dailyprogress", dailyProgressRouter);

server.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

export default server;