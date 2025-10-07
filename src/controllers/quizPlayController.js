import * as quizPlayService from "../services/quizPlayService.js";

export const getQuizQuestions = async (req, res, next) => {
  try {
    const { quizId } = req.params;

    if (!quizId) {
      return res.status(400).json({ error: "Quiz ID is required." });
    }

    const questions = await quizPlayService.getQuizQuestions(quizId);
    res.json(questions);
  } catch (err) {
    // Respect status code from service
    return res.status(err.status || 400).json({ error: err.message });
  }
};

export const submitQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    if (!quizId) {
      return res.status(400).json({ error: "Quiz ID is required." });
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res
        .status(400)
        .json({ error: "Answers must be a non-empty array." });
    }

    const result = await quizPlayService.submitQuiz(quizId, answers);
    res.json(result);
  } catch (err) {
    // Respect status code from service
    return res.status(err.status || 400).json({ error: err.message });
  }
};
