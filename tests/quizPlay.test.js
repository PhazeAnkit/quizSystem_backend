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
});
