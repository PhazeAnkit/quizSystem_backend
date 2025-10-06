import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Question from "./Question.js";

const Option = sequelize.define(
  "Option",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Option text cannot be empty." },
        len: {
          args: [1, 200],
          msg: "Option text must be between 1 and 200 characters.",
        },
      },
    },
    correct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { timestamps: true }
);

// Associations
Question.hasMany(Option, {
  foreignKey: "QuestionId",
  onDelete: "CASCADE",
  hooks: true,
});
Option.belongsTo(Question, { foreignKey: "QuestionId" });

export default Option;
