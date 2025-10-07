

# **Quiz Application Backend**

## **Project Overview**

This project is a **backend API for a Quiz Application**, allowing users to:

* Create quizzes
* Add questions with multiple options
* Take quizzes and receive automatic scoring

The backend follows **RESTful principles**, uses **PostgreSQL** for storage, and includes **unit tests** for all API endpoints.

---

## **Features**

### **Core Features**

* **Quiz Management**

  * Create a quiz with a title
  * Add questions to a quiz with multiple options

* **Quiz Taking**

  * Fetch questions for a quiz (correct answers hidden)
  * Submit answers and receive a score `{ "score": 3, "total": 5 }`

* **Validation Rules**

  * Single/multiple-choice questions require at least one correct option
  * Text questions have a maximum length of 300 characters
  * Quiz title must be a non-empty string

* **Unit Tests**

  * Full coverage for all API endpoints

---

## **Tech Stack**

* **Node.js** & **Express** – Backend framework
* **Sequelize ORM** – Database abstraction
* **PostgreSQL** – Production database (Neon for serverless)
* **Jest + Supertest** – Unit testing

---

## **Database Structure**

* **Quiz Table**

  * `id` (UUID)
  * `title` (string)

* **Question Table**

  * `id` (UUID)
  * `quizId` (foreign key)
  * `text` (string)
  * `type` (enum: single, multiple, text)

* **Option Table**

  * `id` (UUID)
  * `questionId` (foreign key)
  * `text` (string)
  * `correct` (boolean)

**Relationships:**

* Quiz → has many Questions
* Question → has many Options

---

## **API Endpoints**

### **Quiz Management**

| Endpoint                      | Method | Description                          |
| ----------------------------- | ------ | ------------------------------------ |
| `/api/quiz`                   | POST   | Create a quiz with a title           |
| `/api/quiz/:quizId/questions` | POST   | Add questions to a quiz with options |
| `/api/quiz`                   | GET    | Retrieve a list of all quizzes       |

### **Quiz Taking**

| Endpoint                      | Method | Description                                         |
| ----------------------------- | ------ | --------------------------------------------------- |
| `/api/play/:quizId/questions` | GET    | Fetch questions for a quiz (correct answers hidden) |
| `/api/play/:quizId/submit`    | POST   | Submit answers and receive a score                  |

---

## **Setup Instructions**

1. **Clone the repository**

```bash
git clone https://github.com/PhazeAnkit/quizSystem_backend.git
cd quizSystem_backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file:

```env
DATABASE_URL=postgresql://username:password@host:port/dbname?sslmode=require
PORT=3000
```

4. **Sync Database**

```bash
node src/createTable.js
```

5. **Run the server**

```bash
npm start
```

---

## **Testing**

* Unit tests are implemented using **Jest** and **Supertest**
* Tests cover all endpoints including:

  * Creating quizzes
  * Adding questions
  * Fetching questions
  * Submitting answers
  * Validation and error handling
* By default, tests run on **SQLite in-memory** database for fast execution

**Run tests:**

```bash
npm test
```

---

## **Future Enhancements**

* Add **user authentication** for quiz creators and participants
* Support **timed quizzes**
* Add **leaderboards** and analytics for scores
* Support **quiz categories** or tags
* **Live Quiz Feature**:

  * Real-time quizzes between multiple participants using **WebSockets**
  * Live score updates and question timers
  * Instant feedback for answers

---