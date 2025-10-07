import { Sequelize } from "sequelize";
import QuizModel from "../src/models/Quiz.js";
import QuestionModel from "../src/models/Question.js";
import OptionModel from "../src/models/Option.js";

const sequelize = new Sequelize("sqlite::memory:", { logging: false });

const Quiz = QuizModel.init(QuizModel.tableAttributes, { sequelize });
const Question = QuestionModel.init(QuestionModel.tableAttributes, { sequelize });
const Option = OptionModel.init(OptionModel.tableAttributes, { sequelize });

Quiz.hasMany(Question, { foreignKey: "quizId", onDelete: "CASCADE", hooks: true });
Question.belongsTo(Quiz, { foreignKey: "quizId" });

Question.hasMany(Option, { foreignKey: "QuestionId", onDelete: "CASCADE", hooks: true });
Option.belongsTo(Question, { foreignKey: "QuestionId" });

export { sequelize, Quiz, Question, Option };
