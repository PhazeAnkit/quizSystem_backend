import * as quizManageService from "../services/quizManageService.js";

export const createQuiz = async (req, res, next) => {
  try {
    const quiz = await quizManageService.createQuiz(req.body.title);
    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
};

export const addQuestion = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const question = await quizManageService.addQuestion(quizId, req.body);
    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
};

export const getAllQuizzes = async (req, res, next) => {
  try {
    const quizzes = await quizManageService.getAllQuizzes();
    res.json(quizzes);
  } catch (err) {
    next(err);
  }
};
