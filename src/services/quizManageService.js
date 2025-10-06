import { Quiz, Question, Option } from "../models/index.js";

export const createQuiz = async (title) => {
  return await Quiz.create({ title });
};

export const addQuestion = async (quizId, { text, options, type }) => {
  const question = await Question.create({ quizId, text, type });

  if (options && options.length) {
    for (const opt of options) {
      await Option.create({
        text: opt.text,
        correct: opt.correct,
        QuestionId: question.id,
      });
    }
  }

  return await Question.findByPk(question.id, { include: Option });
};

export const getAllQuizzes = async () => {
  return await Quiz.findAll({ attributes: ["id", "title"] });
};
