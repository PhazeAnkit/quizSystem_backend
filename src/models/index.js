import sequelize from "../config/db.js";
import Quiz from "./Quiz.js";
import Question from "./Question.js";
import Option from "./Option.js";

export async function syncDB() {
  try {
    await sequelize.sync({ alter: true }); // only alter tables to match models
    console.log("✅ Database synchronized with PostgreSQL");
  } catch (err) {
    console.error("❌ DB sync failed:", err);
    process.exit(1);
  }
}

export { sequelize, Quiz, Question, Option };
