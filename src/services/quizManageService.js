import { Quiz, Question, Option } from "../models/index.js";

export const createQuiz = async (title) => {
  if (!title || !title.trim()) {
    throw new Error("Quiz title is required.");
  }
  return await Quiz.create({ title: title.trim() });
};

export const addQuestion = async (quizId, { text, options, type }) => {
  const quiz = await Quiz.findByPk(quizId);
  if (!quiz) throw new Error("Quiz not found.");

  if (!text || !text.trim()) throw new Error("Question text is required.");
  if (text.length > 300)
    throw new Error("Question text cannot exceed 300 characters.");

  const allowedTypes = ["single", "multiple", "text"];
  if (!allowedTypes.includes(type))
    throw new Error(`Question type must be one of: ${allowedTypes.join(", ")}`);

  if (type === "single" || type === "multiple") {
    if (!options || !options.length)
      throw new Error(
        "Options are required for single/multiple choice questions."
      );
    const hasCorrect = options.some((o) => o.correct === true);
    if (!hasCorrect)
      throw new Error("At least one option must be marked as correct.");
  }

  const question = await Question.create({ quizId, text: text.trim(), type });

  // Insert options if applicable
  if (options && options.length) {
    for (const opt of options) {
      if (!opt.text || !opt.text.trim()) throw new Error("Option text cannot be empty.");
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
