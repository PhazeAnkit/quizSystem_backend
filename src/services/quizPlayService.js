import { Quiz, Question, Option } from "../models/index.js";

export const getQuizQuestions = async (quizId) => {
  if (!quizId) {
    throw new Error("Quiz ID is required.");
  }

  const quiz = await Quiz.findByPk(quizId);
  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  const questions = await Question.findAll({
    where: { QuizId: quizId },
    include: [{ model: Option, attributes: ["id", "text"] }],
  });

  if (!questions.length) {
    throw new Error("No questions found for this quiz.");
  }

  return questions.map((q) => ({
    id: q.id,
    text: q.text,
    type: q.type,
    options: q.Options,
  }));
};

export const submitQuiz = async (quizId, answers) => {
  if (!quizId) {
    throw new Error("Quiz ID is required.");
  }

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    throw new Error("Answers must be a non-empty array.");
  }

  const quiz = await Quiz.findByPk(quizId);
  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  const questions = await Question.findAll({
    where: { QuizId: quizId },
    include: [Option],
  });

  if (!questions.length) {
    throw new Error("No questions found for this quiz.");
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
        throw new Error(`Invalid option selected for question ID ${q.id}.`);
      }

      const correctOption = q.Options.find((o) => o.correct);
      if (userAnswer.selectedOptionId === correctOption.id) {
        score++;
      }
    }
  }

  return { score, total: questions.length };
};
