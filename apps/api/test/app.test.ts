import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { JsonStore } from "../src/data/json-store.js";
import { EXERCISES } from "../../../packages/shared/src/curriculum.js";
import { GUIDED_LESSONS } from "../../../packages/shared/src/lessons.js";

// Les leçons évoluent par révisions : les tests lisent les exercices courants au lieu de les figer.
const lessonExercises = (lessonId: string) => GUIDED_LESSONS.find((lesson) => lesson.id === lessonId)!.exerciseIds;
const answerFor = (exerciseId: string) => EXERCISES.find((exercise) => exercise.id === exerciseId)!.answer;

describe("SD Languages API", () => {
  let temporaryDirectory: string;
  let storePath: string;
  let app: ReturnType<typeof createApp>;

  beforeEach(async () => {
    temporaryDirectory = await mkdtemp(path.join(tmpdir(), "sd-languages-api-"));
    storePath = path.join(temporaryDirectory, "state.json");
    app = createApp(new JsonStore(storePath));
  });

  afterEach(async () => {
    await rm(temporaryDirectory, { recursive: true, force: true });
  });

  it("exposes the local health status", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.body).toEqual({ status: "ok", mode: "local" });
  });

  it("builds a local daily plan from the learner state", async () => {
    const initialPlan = await request(app).get("/api/plan/de").expect(200);
    expect(initialPlan.body.language).toBe("de");
    expect(initialPlan.body.items.map((item: { kind: string }) => item.kind)).toEqual([
      "diagnostic",
      "lesson"
    ]);
    expect(initialPlan.body.totalMinutes).toBe(10);
    expect(initialPlan.body.goalMinutes).toBe(10);

    await request(app)
      .post("/api/practice/de-a1-mcq-present/answer")
      .send({ answer: "wohnt", attemptId: "attempt-de-plan-001" })
      .expect(200);

    const adaptedPlan = await request(app).get("/api/plan/de").expect(200);
    expect(adaptedPlan.body.items.map((item: { kind: string }) => item.kind)).toEqual([
      "diagnostic",
      "review",
      "lesson"
    ]);
    expect(adaptedPlan.body.items[2].title).toContain("Présent des verbes réguliers");
  });

  it("persists independent learning settings and applies the daily budget", async () => {
    const defaults = await request(app).get("/api/settings/es").expect(200);
    expect(defaults.body).toMatchObject({ goal: "basics", dailyMinutes: 10, targetLevel: "A2", onboardingCompleted: false });

    await request(app)
      .patch("/api/settings/es")
      .send({ goal: "unknown", dailyMinutes: 7, targetLevel: "C2" })
      .expect(400);

    const saved = await request(app)
      .patch("/api/settings/es")
      .send({ goal: "travel", dailyMinutes: 5, targetLevel: "B1" })
      .expect(200);
    expect(saved.body).toMatchObject({ goal: "travel", dailyMinutes: 5, targetLevel: "B1", onboardingCompleted: true });

    const reloadedApp = createApp(new JsonStore(storePath));
    const persisted = await request(reloadedApp).get("/api/settings/es").expect(200);
    expect(persisted.body).toEqual(saved.body);
    const german = await request(reloadedApp).get("/api/settings/de").expect(200);
    expect(german.body.goal).toBe("fluency");

    const plan = await request(reloadedApp).get("/api/plan/es").expect(200);
    expect(plan.body.goalMinutes).toBe(5);
    expect(plan.body.totalMinutes).toBeLessThanOrEqual(5);
  });

  it("migrates a version 2 profile without losing its learning settings", async () => {
    await writeFile(storePath, JSON.stringify({
      version: 2,
      progress: {
        en: { language: "en", xp: 42, completedExercises: 3, correctAnswers: 2, currentStreak: 2 },
        de: { language: "de", xp: 0, completedExercises: 0, correctAnswers: 0, currentStreak: 0 },
        es: { language: "es", xp: 0, completedExercises: 0, correctAnswers: 0, currentStreak: 0 }
      },
      mistakes: [],
      reviewCards: [],
      conversations: { en: { language: "en", messages: [] }, de: { language: "de", messages: [] }, es: { language: "es", messages: [] } },
      processedAttemptIds: [],
      settings: {
        en: { language: "en", goal: "work", dailyMinutes: 20, targetLevel: "B2", onboardingCompleted: true }
      }
    }), "utf8");

    const migrated = await new JsonStore(storePath).read();
    expect(migrated.version).toBe(5);
    expect(migrated.lessonSessions).toEqual([]);
    expect(migrated.lessonProgress).toEqual({});
    expect(migrated.pronunciationAttempts).toEqual([]);
    expect(migrated.pronunciationProgress).toEqual({});
    expect(migrated.progress.en.xp).toBe(42);
    expect(migrated.settings.en).toMatchObject({ goal: "work", dailyMinutes: 20, targetLevel: "B2" });
    expect(migrated.settings.de.goal).toBe("fluency");
  });

  it("assesses pronunciation transcripts locally and persists only compact attempt metadata", async () => {
    const lab = await request(app).get("/api/pronunciation/en").expect(200);
    expect(lab.body.prompts).toHaveLength(4);
    expect(lab.body.prompts.map((prompt: { level: string }) => prompt.level)).toEqual(["A1", "A2", "B1", "B2"]);
    expect(lab.body.recommendedPromptId).toBe("pron-en-setback");

    await request(app)
      .post("/api/pronunciation/pron-en-report/attempts")
      .send({ transcript: "", mode: "browser-transcript", attemptId: "pron-empty-001" })
      .expect(400);

    const payload = {
      transcript: "Could you send me the report by Friday?",
      mode: "browser-transcript",
      attemptId: "pron-en-report-001"
    };
    const first = await request(app)
      .post("/api/pronunciation/pron-en-report/attempts")
      .send(payload)
      .expect(201);
    expect(first.body).toMatchObject({
      duplicate: false,
      attempt: { promptId: "pron-en-report", language: "en", score: 100, mastered: true },
      assessment: { score: 100, metrics: { coverage: 100, order: 100, precision: 100 } },
      progress: { attempts: 1, bestScore: 100, masteryCount: 1 }
    });

    const duplicate = await request(app)
      .post("/api/pronunciation/pron-en-report/attempts")
      .send(payload)
      .expect(200);
    expect(duplicate.body.duplicate).toBe(true);
    expect(duplicate.body.progress.attempts).toBe(1);

    const reloaded = createApp(new JsonStore(storePath));
    const persisted = await request(reloaded).get("/api/pronunciation/en").expect(200);
    expect(persisted.body.prompts.find((prompt: { id: string }) => prompt.id === "pron-en-report").progress)
      .toMatchObject({ attempts: 1, bestScore: 100, masteryCount: 1 });
    expect(persisted.body.recentAttempts).toHaveLength(1);
    expect(persisted.body.recentAttempts[0]).not.toHaveProperty("transcript");
    expect(persisted.body.recentAttempts[0]).not.toHaveProperty("assessment");
  });

  it("rejects an unknown diagnostic language and records a valid diagnostic", async () => {
    const unknown = await request(app).get("/api/diagnostic/fr").expect(404);
    expect(unknown.body).toEqual({ error: "Langue inconnue." });

    const questions = await request(app).get("/api/diagnostic/en").expect(200);
    expect(questions.body).toHaveLength(6);
    expect(questions.body[0]).not.toHaveProperty("answer");
    expect(questions.body[0]).not.toHaveProperty("acceptedAnswers");

    const diagnostic = await request(app)
      .post("/api/diagnostic/en")
      .send({ answers: { "diag-en-a1-greeting": "is" } })
      .expect(200);

    expect(diagnostic.body).toMatchObject({
      language: "en",
      score: 1,
      total: 12,
      percentage: 8,
      estimatedLevel: "A1"
    });
    expect(diagnostic.body.completedAt).toEqual(expect.any(String));

    const dashboard = await request(app).get("/api/dashboard").expect(200);
    expect(dashboard.body.progress.en.xp).toBe(25);
    expect(dashboard.body.progress.en.diagnostic).toEqual(diagnostic.body);
  });

  it("creates one mistake and one due review while keeping repeated attemptIds idempotent", async () => {
    const payload = { answer: "have", attemptId: "attempt-en-001" };

    const firstAttempt = await request(app)
      .post("/api/practice/en-a1-mcq-have/answer")
      .send(payload)
      .expect(200);

    expect(firstAttempt.body).toMatchObject({
      evaluation: {
        correct: false,
        normalizedAnswer: "have",
        expectedAnswer: "has"
      },
      duplicate: false,
      dashboard: {
        progress: {
          en: {
            xp: 2,
            completedExercises: 1,
            correctAnswers: 0,
            currentStreak: 1
          }
        },
        dueReviews: { en: 1 },
        totalCards: 1
      }
    });

    const mistakes = await request(app).get("/api/mistakes?language=en").expect(200);
    expect(mistakes.body).toEqual([
      expect.objectContaining({
        id: "mistake-en-a1-mcq-have",
        exerciseId: "en-a1-mcq-have",
        language: "en",
        submittedAnswer: "have",
        expectedAnswer: "has",
        occurrenceCount: 1,
        resolvedCount: 0
      })
    ]);

    const reviews = await request(app).get("/api/reviews/en").expect(200);
    expect(reviews.body).toEqual([
      expect.objectContaining({
        id: "card-en-a1-mcq-have",
        sourceExerciseId: "en-a1-mcq-have",
        language: "en",
        intervalDays: 0,
        repetitions: 0
      })
    ]);

    const adaptivePractice = await request(app).get("/api/practice/en").expect(200);
    expect(adaptivePractice.body[0]).toMatchObject({
      id: "en-a1-mcq-have",
      recommendationReason: "À renforcer · Présent simple"
    });
    expect(adaptivePractice.body[0]).not.toHaveProperty("answer");

    const duplicateAttempt = await request(app)
      .post("/api/practice/en-a1-mcq-have/answer")
      .send(payload)
      .expect(200);

    expect(duplicateAttempt.body.duplicate).toBe(true);
    expect(duplicateAttempt.body.dashboard.progress.en).toMatchObject({
      xp: 2,
      completedExercises: 1,
      correctAnswers: 0,
      currentStreak: 1
    });
    expect(duplicateAttempt.body.dashboard.totalCards).toBe(1);

    const persistedMistakes = await request(app).get("/api/mistakes?language=en").expect(200);
    expect(persistedMistakes.body).toHaveLength(1);
    expect(persistedMistakes.body[0].occurrenceCount).toBe(1);
  });

  it("uses the local conversation coach and reloads its messages from disk", async () => {
    const reply = await request(app)
      .post("/api/conversations/es")
      .send({ text: "Soy 42 años" })
      .expect(200);

    expect(reply.body.learnerMessage).toMatchObject({
      role: "learner",
      text: "Soy 42 años",
      correction: "tengo 42 años",
      explanation: expect.stringContaining("tener")
    });
    expect(reply.body.coachMessage).toMatchObject({
      role: "coach",
      text: expect.any(String)
    });

    const reloadedApp = createApp(new JsonStore(storePath));
    const conversation = await request(reloadedApp).get("/api/conversations/es").expect(200);

    expect(conversation.body.language).toBe("es");
    expect(conversation.body.messages).toHaveLength(2);
    expect(conversation.body.messages).toEqual([
      reply.body.learnerMessage,
      reply.body.coachMessage
    ]);
  });

  it("starts, advances and persists a guided conversation scenario", async () => {
    const scenarios = await request(app).get("/api/scenarios/en").expect(200);
    expect(scenarios.body).toHaveLength(4);
    expect(scenarios.body[0]).toMatchObject({
      id: "en-work-service-recovery",
      recommendationReason: "Progression vers B2"
    });

    await request(app)
      .post("/api/conversations/en/scenario")
      .send({ scenarioId: "es-travel-restaurant" })
      .expect(404);

    const started = await request(app)
      .post("/api/conversations/en/scenario")
      .send({ scenarioId: "en-daily-cafe" })
      .expect(200);
    expect(started.body).toMatchObject({
      activeScenarioId: "en-daily-cafe",
      scenarioStepIndex: 0,
      scenarioCompleted: false
    });
    expect(started.body.messages.at(-1).text).toContain("What would you like to drink");

    const matched = await request(app)
      .post("/api/conversations/en")
      .send({ text: "I would like a coffee, please." })
      .expect(200);
    expect(matched.body.scenarioAdvanced).toBe(true);

    const missed = await request(app)
      .post("/api/conversations/en")
      .send({ text: "Maybe later." })
      .expect(200);
    expect(missed.body.scenarioAdvanced).toBe(false);

    const reloadedApp = createApp(new JsonStore(storePath));
    const thread = await request(reloadedApp).get("/api/conversations/en").expect(200);
    expect(thread.body.scenarioStepIndex).toBe(1);
    expect(thread.body.scenarioCompleted).toBe(false);
    expect(thread.body.messages).toHaveLength(5);
  });

  it("recommends the assessed level and keeps an active session bound to its lesson", async () => {
    const stateStore = new JsonStore(storePath);
    await stateStore.update((state) => {
      state.progress.en.diagnostic = {
        language: "en",
        score: 4,
        total: 12,
        percentage: 33,
        estimatedLevel: "A2",
        completedAt: "2026-10-20T08:00:00.000Z"
      };
    });

    const preview = await request(app).get("/api/lessons/en").expect(200);
    expect(preview.body.lesson.id).toBe("lesson-en-routine-travel");
    expect(preview.body.catalog.items.map((item: { status: string }) => item.status)).toEqual([
      "available",
      "available",
      "available",
      "available",
      "locked",
      "locked",
      "locked",
      "locked",
      "locked",
      "locked",
      "locked",
      "locked"
    ]);

    const started = await request(app)
      .post("/api/lessons/en/start")
      .send({ lessonId: "lesson-en-routine-travel" })
      .expect(201);
    const sessionId = started.body.session.id;

    await stateStore.update((state) => {
      state.progress.en.diagnostic!.estimatedLevel = "B2";
      state.settings.en.goal = "work";
    });

    const resumed = await request(app).get("/api/lessons/en").expect(200);
    expect(resumed.body).toMatchObject({
      lesson: { id: "lesson-en-routine-travel", level: "A2" },
      session: { id: sessionId, lessonId: "lesson-en-routine-travel", lessonRevision: 2 }
    });
    const practice = await request(app).post("/api/lessons/en/continue").expect(200);
    expect(practice.body.currentExercise.id).toBe(lessonExercises("lesson-en-routine-travel")[0]);
  });

  it("records a completed session without unlocking the next level when mastery is missing", async () => {
    const started = await request(app).post("/api/lessons/en/start").expect(201);
    const sessionId = started.body.session.id;
    await request(app).post("/api/lessons/en/continue").expect(200);

    for (const [index, exerciseId] of lessonExercises("lesson-en-daily-basics").entries()) {
      await request(app)
        .post("/api/lessons/en/answer")
        .send({ answer: answerFor(exerciseId), attemptId: `needs-review-answer-${index}`, sessionId, exerciseId })
        .expect(200);
      await request(app).post("/api/lessons/en/continue").expect(200);
    }

    let finalView: { session: { summary: { outcome: string } } } | undefined;
    for (let index = 0; index < 4; index += 1) {
      const reply = await request(app)
        .post("/api/lessons/en/message")
        .send({ text: "Maybe later." })
        .expect(200);
      finalView = reply.body.view;
    }
    expect(finalView?.session.summary.outcome).toBe("needs-review");

    const next = await request(app).get("/api/lessons/en").expect(200);
    expect(next.body.catalog).toMatchObject({ completedCount: 0, recommendedLessonId: "lesson-en-daily-basics" });
    expect(next.body.catalog.items[0]).toMatchObject({ status: "available", completionCount: 1, masteryCount: 0, statusDetail: "À consolider" });
    expect(next.body.catalog.items[1].status).toBe("locked");
  });

  it("runs, resumes and completes an idempotent guided lesson", async () => {
    const preview = await request(app).get("/api/lessons/en").expect(200);
    expect(preview.body).toMatchObject({
      lesson: { id: "lesson-en-daily-basics", language: "en", level: "A1" },
      catalog: {
        recommendedLessonId: "lesson-en-daily-basics",
        completedCount: 0,
        totalLessons: 12,
        items: [
          expect.objectContaining({ status: "available", recommended: true }),
          expect.objectContaining({ status: "locked" }),
          expect.objectContaining({ status: "locked" }),
          expect.objectContaining({ status: "locked" }),
          expect.objectContaining({ status: "locked" }),
          expect.objectContaining({ status: "locked" }),
          expect.objectContaining({ status: "locked" }),
          expect.objectContaining({ status: "locked" }),
          expect.objectContaining({ status: "locked" }),
          expect.objectContaining({ status: "locked" }),
          expect.objectContaining({ status: "locked" }),
          expect.objectContaining({ status: "locked" })
        ]
      }
    });
    expect(preview.body).not.toHaveProperty("session");

    await request(app)
      .post("/api/lessons/en/start")
      .send({ lessonId: "lesson-en-routine-travel" })
      .expect(409);

    const started = await request(app).post("/api/lessons/en/start").expect(201);
    expect(started.body.session).toMatchObject({ phase: "intro", status: "active", currentExerciseIndex: 0 });
    const sessionId = started.body.session.id;

    const [firstId, ...otherIds] = lessonExercises("lesson-en-daily-basics");
    const practice = await request(app).post("/api/lessons/en/continue").expect(200);
    expect(practice.body).toMatchObject({
      session: { id: sessionId, phase: "practice" },
      currentExercise: { id: firstId }
    });
    expect(practice.body.currentExercise).not.toHaveProperty("answer");
    expect(practice.body.currentExercise).not.toHaveProperty("acceptedAnswers");

    await request(app)
      .post("/api/lessons/en/answer")
      .send({
        answer: answerFor(firstId!),
        attemptId: "lesson-attempt-wrong-context",
        sessionId: "another-session",
        exerciseId: firstId
      })
      .expect(409);

    const first = await request(app)
      .post("/api/lessons/en/answer")
      .send({
        answer: answerFor(firstId!),
        attemptId: "lesson-attempt-en-001",
        sessionId,
        exerciseId: firstId
      })
      .expect(200);
    expect(first.body).toMatchObject({ evaluation: { verdict: "exact", correct: true }, duplicate: false });
    expect(first.body.view.session.phase).toBe("correction");

    const duplicate = await request(app)
      .post("/api/lessons/en/answer")
      .send({ answer: answerFor(firstId!), attemptId: "lesson-attempt-en-001", sessionId, exerciseId: firstId })
      .expect(200);
    expect(duplicate.body.duplicate).toBe(true);

    const reloadedApp = createApp(new JsonStore(storePath));
    const resumed = await request(reloadedApp).get("/api/lessons/en").expect(200);
    expect(resumed.body.session).toMatchObject({ id: sessionId, phase: "correction" });
    expect(resumed.body.session.attempts).toHaveLength(1);

    for (const [index, exerciseId] of otherIds.entries()) {
      const next = await request(reloadedApp).post("/api/lessons/en/continue").expect(200);
      expect(next.body.currentExercise.id).toBe(exerciseId);
      const answered = await request(reloadedApp)
        .post("/api/lessons/en/answer")
        .send({ answer: answerFor(exerciseId), attemptId: `lesson-attempt-en-00${index + 2}`, sessionId, exerciseId })
        .expect(200);
      expect(answered.body.evaluation.verdict).toBe("exact");
    }

    const dialogue = await request(reloadedApp).post("/api/lessons/en/continue").expect(200);
    expect(dialogue.body.session).toMatchObject({ phase: "conversation", conversationTurns: 0 });
    expect(dialogue.body.session.conversation.messages.at(-1).text).toContain("What would you like to drink");

    let finalLessonView: Record<string, unknown> | undefined;
    for (const [index, text] of [
      "I would like a coffee, please.",
      "Hot, please.",
      "Nothing, thank you.",
      "For here, please."
    ].entries()) {
      const reply = await request(reloadedApp).post("/api/lessons/en/message").send({ text }).expect(200);
      finalLessonView = reply.body.view;
      if (index < 3) expect(reply.body.view.session.phase).toBe("conversation");
      else expect(reply.body.view.session.phase).toBe("summary");
    }

    expect((finalLessonView as { session: object }).session).toMatchObject({
      id: sessionId,
      phase: "summary",
      status: "completed",
      summary: { exact: 6, minor: 0, incorrect: 0, completedExercises: 6, conversationSteps: 4, conversationGoal: 4, outcome: "mastered" }
    });
    const completed = await request(reloadedApp).get("/api/lessons/en").expect(200);
    expect(completed.body).not.toHaveProperty("session");
    expect(completed.body.catalog).toMatchObject({
      completedCount: 1,
      recommendedLessonId: "lesson-en-ask-and-clarify"
    });
    expect(completed.body.catalog.items[0]).toMatchObject({ status: "completed", masteryCount: 1 });
    expect(completed.body.catalog.items[1]).toMatchObject({ status: "available", recommended: true });

    const dashboard = await request(reloadedApp).get("/api/dashboard").expect(200);
    expect(dashboard.body.progress.en).toMatchObject({ xp: 60, completedExercises: 6, correctAnswers: 6 });

    const restarted = await request(reloadedApp).post("/api/lessons/en/start").expect(201);
    expect(restarted.body.session.id).not.toBe(sessionId);
    expect(restarted.body.session.phase).toBe("intro");
    expect(restarted.body.session.lessonId).toBe("lesson-en-ask-and-clarify");
  });
});
