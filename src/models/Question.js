import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Quiz from "./Quiz.js";

const Question = sequelize.define("Question", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("single", "multiple", "text"),
    allowNull: false,
  },
  correctAnswer: {
    type: DataTypes.STRING,
  },
});

Quiz.hasMany(Question, { onDelete: "CASCADE" });
Question.belongsTo(Quiz);

export default Question;
