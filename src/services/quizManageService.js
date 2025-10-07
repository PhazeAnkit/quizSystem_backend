import { Quiz, Question, Option } from "../models/index.js";

export const createQuiz = async (title) => {
  if (!title || !title.trim()) {
    const err = new Error("Quiz title is required.");
    err.status = 400;
    throw err;
  }

  const existing = await Quiz.findOne({ where: { title: title.trim() } });
  if (existing) {
    const err = new Error("Quiz with this title already exists");
    err.status = 400;
    throw err;
  }

  return await Quiz.create({ title: title.trim() });
};

export const addQuestion = async (quizId, { text, options, type }) => {
  const quiz = await Quiz.findByPk(quizId);
  if (!quiz) {
    const err = new Error("Quiz not found.");
    err.status = 404;
    throw err;
  }

  if (!text || !text.trim()) {
    const err = new Error("Question text is required.");
    err.status = 400;
    throw err;
  }

  if (type === "text" && text.length > 300) {
    const err = new Error("Question text cannot exceed 300 characters.");
    err.status = 400;
    throw err;
  }

  const allowedTypes = ["single", "multiple", "text"];
  if (!allowedTypes.includes(type)) {
    const err = new Error(
      `Question type must be one of: ${allowedTypes.join(", ")}`
    );
    err.status = 400;
    throw err;
  }

  if (
    (type === "single" || type === "multiple") &&
    (!options || !options.length)
  ) {
    const err = new Error(
      "Options are required for single/multiple choice questions."
    );
    err.status = 400;
    throw err;
  }

  if (options && options.length && !options.some((o) => o.correct === true)) {
    const err = new Error("At least one option must be marked as correct.");
    err.status = 400;
    throw err;
  }

  const question = await Question.create({
    quizId,
    text: text.trim(),
    type,
  });

  if (options && options.length) {
    for (const opt of options) {
      if (!opt.text || !opt.text.trim()) {
        const err = new Error("Option text cannot be empty.");
        err.status = 400;
        throw err;
      }

      await Option.create({
        text: opt.text.trim(),
        correct: !!opt.correct,
        QuestionId: question.id,
      });
    }
  }

  return await Question.findByPk(question.id, { include: Option });
};

export const getAllQuizzes = async () => {
  return await Quiz.findAll({ attributes: ["id", "title"] });
};
