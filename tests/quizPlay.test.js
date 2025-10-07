import request from "supertest";
import app from "./appForTest.js";
import { sequelize } from "./setupTestDB.js";

let quizId, questionId, correctOptionId, wrongOptionId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const quizRes = await request(app)
    .post("/api/quiz")
    .send({ title: "Play Quiz" });
  quizId = quizRes.body.id;

  const questionRes = await request(app)
    .post(`/api/quiz/${quizId}/questions`)
    .send({
      text: "Select 4?",
      type: "single",
      options: [
        { text: "3", correct: false },
        { text: "4", correct: true },
      ],
    });

  questionId = questionRes.body.id;
  correctOptionId = questionRes.body.Options.find((o) => o.correct).id;
  wrongOptionId = questionRes.body.Options.find((o) => !o.correct).id;
});

afterEach(() => {
  console.log(" Test passed");
});

describe("Quiz Taking APIs", () => {
  test("Fetch questions for quiz", async () => {
    const res = await request(app).get(`/api/play/${quizId}/questions`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].Options[0]).not.toHaveProperty("correct");
  });

  test("Fetch questions for quiz with no questions", async () => {
    const emptyQuizRes = await request(app)
      .post("/api/quiz")
      .send({ title: "Empty Quiz" });
    const res = await request(app).get(
      `/api/play/${emptyQuizRes.body.id}/questions`
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("Fetch questions for invalid quiz", async () => {
    const res = await request(app).get("/api/play/invalid/questions");
    expect(res.status).toBe(404);
  });

  test("Ensure correct answer not exposed", async () => {
    const res = await request(app).get(`/api/play/${quizId}/questions`);
    expect(
      res.body[0].Options.find((o) => o.id === correctOptionId)
    ).not.toHaveProperty("correct");
  });

  test("Submit correct answer", async () => {
    const res = await request(app)
      .post(`/api/play/${quizId}/submit`)
      .send({
        answers: [{ questionId, selectedOptionId: correctOptionId }],
      });
    expect(res.status).toBe(200);
    expect(res.body.score).toBe(1);
    expect(res.body.total).toBe(1);
  });

  test("Submit incorrect answer", async () => {
    const res = await request(app)
      .post(`/api/play/${quizId}/submit`)
      .send({
        answers: [{ questionId, selectedOptionId: wrongOptionId }],
      });
    expect(res.status).toBe(200);
    expect(res.body.score).toBe(0);
    expect(res.body.total).toBe(1);
  });

  test("Submit answer to invalid quiz", async () => {
    const res = await request(app)
      .post(`/api/play/invalid/submit`)
      .send({
        answers: [{ questionId, selectedOptionId: correctOptionId }],
      });
    expect(res.status).toBe(404);
  });

  test("Submit answer with invalid question/option", async () => {
    const res = await request(app)
      .post(`/api/play/${quizId}/submit`)
      .send({
        answers: [{ questionId: "invalid", selectedOptionId: "invalid" }],
      });
    expect(res.status).toBe(400);
  });

  test("Fetch questions with multiple questions", async () => {
    const questionRes = await request(app)
      .post(`/api/quiz/${quizId}/questions`)
      .send({
        text: "Select 3?",
        type: "single",
        options: [
          { text: "3", correct: true },
          { text: "4", correct: false },
        ],
      });

    const res = await request(app).get(`/api/play/${quizId}/questions`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    res.body.forEach((q) =>
      q.Options.forEach((o) => expect(o).not.toHaveProperty("correct"))
    );
  });

  test("Fetch questions for quiz with multiple correct options", async () => {
    await request(app)
      .post(`/api/quiz/${quizId}/questions`)
      .send({
        text: "Select 2 numbers?",
        type: "multiple",
        options: [
          { text: "1", correct: true },
          { text: "2", correct: true },
          { text: "3", correct: false },
        ],
      });

    const res = await request(app).get(`/api/play/${quizId}/questions`);
    expect(res.status).toBe(200);
    res.body.forEach((q) =>
      q.Options.forEach((o) => expect(o).not.toHaveProperty("correct"))
    );
  });

  test("Submit multiple answers with mixed correctness", async () => {
    const questionsRes = await request(app).get(
      `/api/play/${quizId}/questions`
    );
    const answers = questionsRes.body.map((q) => ({
      questionId: q.id,
      selectedOptionId: q.Options[0].id,
    }));

    const res = await request(app)
      .post(`/api/play/${quizId}/submit`)
      .send({ answers });

    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(2);
    expect(res.body.score).toBeLessThanOrEqual(res.body.total);
  });

  test("Submit quiz with empty answers array", async () => {
    const res = await request(app)
      .post(`/api/play/${quizId}/submit`)
      .send({ answers: [] });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Answers must be a non-empty array."
    );
  });

  test("Submit quiz with missing answers field", async () => {
    const res = await request(app).post(`/api/play/${quizId}/submit`).send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Answers must be a non-empty array."
    );
  });
});
