import express from "express";

import quizManageRoutes from "../src/routes/quizManageRoutes.js";
import quizPlayRoutes from "../src/routes/quizPlayRoutes.js";

const app = express();
app.use(express.json());
app.use("/api/quiz", quizManageRoutes);
app.use("/api/play", quizPlayRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

export default app;
