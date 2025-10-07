import { Quiz, Question, Option } from "../models/index.js";

export const getQuizQuestions = async (quizId) => {
  if (!quizId) {
    const err = new Error("Quiz ID is required.");
    err.status = 400;
    throw err;
  }

  const quiz = await Quiz.findByPk(quizId);
  if (!quiz) {
    const err = new Error("Quiz not found.");
    err.status = 404;
    throw err;
  }

  const questions = await Question.findAll({
    where: { quizId },
    include: [{ model: Option, attributes: ["id", "text"] }],
  });

  return questions.map((q) => ({
    id: q.id,
    text: q.text,
    type: q.type,
    Options: q.Options || [], // ensure Options is always array
  }));
};

export const submitQuiz = async (quizId, answers) => {
  if (!quizId) {
    const err = new Error("Quiz ID is required.");
    err.status = 400;
    throw err;
  }

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    const err = new Error("Answers must be a non-empty array.");
    err.status = 400;
    throw err;
  }

  const quiz = await Quiz.findByPk(quizId);
  if (!quiz) {
    const err = new Error("Quiz not found.");
    err.status = 404;
    throw err;
  }

  const questions = await Question.findAll({
    where: { QuizId: quizId },
    include: [Option],
  });

  if (!questions.length) {
    const err = new Error("No questions found for this quiz.");
    err.status = 400;
    throw err;
  }

  for (const a of answers) {
    if (!questions.find((q) => q.id === a.questionId)) {
      const err = new Error(`Invalid question ID: ${a.questionId}`);
      err.status = 400;
      throw err;
    }
  }

  let score = 0;

  for (const q of questions) {
    const userAnswer = answers.find((a) => a.questionId === q.id);

    if (!userAnswer) continue;

    if (q.type === "single" || q.type === "multiple") {
      const selectedOption = q.Options.find(
        (o) => o.id === userAnswer.selectedOptionId
      );
      if (!selectedOption) {
        const err = new Error(
          `Invalid option selected for question ID ${q.id}`
        );
        err.status = 400;
        throw err;
      }

      const correctOption = q.Options.find((o) => o.correct);
      if (userAnswer.selectedOptionId === correctOption.id) {
        score++;
      }
    }
  }

  return { score, total: questions.length };
};
