import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Question from "./Question.js";

const Option = sequelize.define("Option", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correct: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Question.hasMany(Option, { onDelete: "CASCADE" });
Option.belongsTo(Question);

export default Option;
