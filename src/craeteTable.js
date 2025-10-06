import sequelize from "./config/db.js";
import Quiz from "./models/Quiz.js";
import Question from "./models/Question.js";
import Option from "./models/Option.js";

async function createTables() {
  try {
    await sequelize.sync({ alter: true }); // creates or updates tables
    console.log("✅ Tables created successfully in Neon PostgreSQL");
    process.exit(0); // exit after done
  } catch (err) {
    console.error("❌ Error creating tables:", err);
    process.exit(1);
  }
}

createTables();
