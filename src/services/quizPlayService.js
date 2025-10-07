import { Quiz, Question, Option } from "../models/index.js";
import { throwError } from "../utils/error.js";

export const getQuizQuestions = async (quizId) => {
  if (!quizId) throwError("Quiz ID is required.", 400);

  const quiz = await Quiz.findByPk(quizId, {
    include: {
      model: Question,
      include: [{ model: Option, attributes: ["id", "text"] }],
    },
  });

  if (!quiz) throwError("Quiz not found.", 404);

  return quiz.Questions.map((q) => ({
    id: q.id,
    text: q.text,
    type: q.type,
    Options: (q.Options || []).map(({ id, text }) => ({ id, text })), // hide correct
  }));
};

export const submitQuiz = async (quizId, answers) => {
  if (!quizId) throwError("Quiz ID is required.", 400);
  if (!answers || !Array.isArray(answers) || answers.length === 0)
    throwError("Answers must be a non-empty array.", 400);

  const quiz = await Quiz.findByPk(quizId, {
    include: { model: Question, include: [Option] },
  });

  if (!quiz) throwError("Quiz not found.", 404);
  const questions = quiz.Questions;

  if (!questions.length) throwError("No questions found for this quiz.", 400);

  for (const a of answers) {
    if (!questions.find((q) => q.id === a.questionId))
      throwError(`Invalid question ID: ${a.questionId}`, 400);
  }

  let score = 0;

  for (const q of questions) {
    const userAnswer = answers.find((a) => a.questionId === q.id);
    if (!userAnswer) continue;

    if (q.type === "single" || q.type === "multiple") {
      const selectedOption = q.Options.find(
        (o) => o.id === userAnswer.selectedOptionId
      );
      if (!selectedOption)
        throwError(`Invalid option selected for question ID ${q.id}`, 400);

      const correctOption = q.Options.find((o) => o.correct);
      if (selectedOption.id === correctOption.id) score++;
    }
  }

  return { score, total: questions.length };
};
