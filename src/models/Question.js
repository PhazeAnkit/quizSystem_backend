import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Quiz from "./Quiz.js";

const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING(300),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Question text cannot be empty." },
        len: {
          args: [1, 300],
          msg: "Question text must be between 1 and 300 characters.",
        },
      },
    },
    type: {
      type: DataTypes.ENUM("single", "multiple", "text"),
      allowNull: false,
    },
  },
  { timestamps: true }
);

// Associations
Quiz.hasMany(Question, {
  foreignKey: "quizId",
  onDelete: "CASCADE",
  hooks: true,
});
Question.belongsTo(Quiz, { foreignKey: "quizId" });

export default Question;
