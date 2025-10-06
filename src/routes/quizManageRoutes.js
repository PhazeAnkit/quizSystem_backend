import express from "express";
import * as quizManageController from "../controllers/quizManageController.js";

const router = express.Router();

router.post("/", quizManageController.createQuiz);
router.post("/:quizId/questions", quizManageController.addQuestion);
router.get("/", quizManageController.getAllQuizzes);

export default router;
