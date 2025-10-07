import { Quiz, Question, Option } from "../models/index.js";
import { throwError } from "../utils/error.js";


export const createQuiz = async (title) => {
  if (!title || !title.trim()) throwError("Quiz title is required.");
  title = title.trim();

  const [quiz, created] = await Quiz.findOrCreate({
    where: { title },
    defaults: { title },
  });

  if (!created) throwError("Quiz with this title already exists");
  return quiz;
};

export const addQuestion = async (quizId, { text, options, type }) => {
  if (!quizId) throwError("Quiz ID is required.", 404);

  if (!text || !text.trim()) throwError("Question text is required.");
  if (type === "text" && text.length > 300)
    throwError("Question text cannot exceed 300 characters.");

  const allowedTypes = ["single", "multiple", "text"];
  if (!allowedTypes.includes(type))
    throwError(`Question type must be one of: ${allowedTypes.join(", ")}`);

  if (
    (type === "single" || type === "multiple") &&
    (!options || !options.length)
  )
    throwError("Options are required for single/multiple choice questions.");
  if (options && options.length && !options.some((o) => o.correct))
    throwError("At least one option must be marked as correct.");

  const quizExists = await Quiz.findByPk(quizId);
  if (!quizExists) throwError("Quiz not found.", 404);

  const question = await Question.create({
    quizId,
    text: text.trim(),
    type,
  });

  if (options && options.length) {
    const optionRecords = options.map((opt) => {
      if (!opt.text || !opt.text.trim())
        throwError("Option text cannot be empty.");
      return {
        text: opt.text.trim(),
        correct: !!opt.correct,
        QuestionId: question.id,
      };
    });
    await Option.bulkCreate(optionRecords);
  }

  return await Question.findByPk(question.id, { include: Option });
};

export const getAllQuizzes = async () => {
  return await Quiz.findAll({ attributes: ["id", "title"] });
};

export const deleteQuiz = async (quizId) => {
  if (!quizId) throwError("Quiz ID is required.", 404);

  const quiz = await Quiz.findByPk(quizId);
  if (!quiz) throwError("Quiz not found.", 404);

  await quiz.destroy();
  return { message: "Quiz deleted successfully." };
};

export const updateQuiz = async (quizId, newTitle) => {
  if (!quizId) throwError("Quiz ID is required.", 404);
  if (!newTitle || !newTitle.trim()) throwError("Quiz title is required.");

  const quiz = await Quiz.findByPk(quizId);
  if (!quiz) throwError("Quiz not found.", 404);

  newTitle = newTitle.trim();
  const duplicate = await Quiz.findOne({ where: { title: newTitle } });
  if (duplicate && duplicate.id !== quiz.id)
    throwError("Quiz with this title already exists");

  quiz.title = newTitle;
  await quiz.save();
  return quiz;
};
