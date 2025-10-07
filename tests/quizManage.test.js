import request from "supertest";
import app from "./appForTest.js";
import { sequelize, Quiz } from "./setupTestDB.js";

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Quiz Management APIs", () => {
  let quizId;

  test("Create valid quiz", async () => {
    const res = await request(app)
      .post("/api/quiz")
      .send({ title: "Demo Quiz" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("title", "Demo Quiz");
    quizId = res.body.id; // store for question tests
  });

  test("Create quiz missing title", async () => {
    const res = await request(app).post("/api/quiz").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("Create quiz with invalid title type", async () => {
    const res = await request(app).post("/api/quiz").send({ title: 123 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("Create quiz duplicate title", async () => {
    await request(app).post("/api/quiz").send({ title: "Demo Quiz" });

    // Attempt duplicate
    const res = await request(app)
      .post("/api/quiz")
      .send({ title: "Demo Quiz" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("Add valid question", async () => {
    const quizRes = await request(app)
      .post("/api/quiz")
      .send({ title: "Quiz 1" });
    quizId = quizRes.body.id;

    const res = await request(app)
      .post(`/api/quiz/${quizId}/questions`)
      .send({
        text: "What is 2+2?",
        type: "single",
        options: [
          { text: "3", correct: false },
          { text: "4", correct: true },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("text", "What is 2+2?");
    expect(res.body.Options.length).toBe(2);
  });

  test("Add question to invalid quiz", async () => {
    const res = await request(app)
      .post(`/api/quiz/9999/questions`)
      .send({
        text: "Q?",
        type: "single",
        options: [{ text: "A", correct: true }],
      });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Quiz not found.");
  });

  test("Add multiple-choice question with no options", async () => {
    const quizRes = await request(app)
      .post("/api/quiz")
      .send({ title: "Quiz 2" });
    quizId = quizRes.body.id;

    const res = await request(app)
      .post(`/api/quiz/${quizId}/questions`)
      .send({ text: "MCQ?", type: "multiple", options: [] });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Options are required for single/multiple choice questions."
    );
  });

  test("Add text question exceeding 300 chars", async () => {
    const quizRes = await request(app)
      .post("/api/quiz")
      .send({ title: "Quiz 3" });
    quizId = quizRes.body.id;

    const longText = "a".repeat(301);
    const res = await request(app)
      .post(`/api/quiz/${quizId}/questions`)
      .send({ text: longText, type: "text", options: [] });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Question text cannot exceed 300 characters."
    );
  });

  test("Get all quizzes", async () => {
    await request(app).post("/api/quiz").send({ title: "Quiz A" });
    await request(app).post("/api/quiz").send({ title: "Quiz B" });

    const res = await request(app).get("/api/quiz");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("title");
  });

  test("Get quizzes when none exist", async () => {
    const res = await request(app).get("/api/quiz");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
