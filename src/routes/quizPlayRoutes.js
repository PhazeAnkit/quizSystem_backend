import express from "express";
import * as quizPlayController from "../controllers/quizPlayController.js";

const router = express.Router();

router.get("/:quizId/questions", quizPlayController.getQuizQuestions);

router.post("/:quizId/submit", quizPlayController.submitQuiz);

export default router;
