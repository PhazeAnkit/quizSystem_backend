import express from "express";
import dotenv from "dotenv";
import quizManageRoutes from "./routes/quizManageRoutes.js";
import quizPlayRoutes from "./routes/quizPlayRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running in " + process.env.NODE_ENV + " mode");
});

app.use("/api/quiz", quizManageRoutes);
app.use("/api/play", quizPlayRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} (${process.env.NODE_ENV})\nLink: http://127.0.0.1:5000/`
  );
});
