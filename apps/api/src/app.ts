import express from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DIAGNOSTIC_QUESTIONS, EXERCISES } from "../../../packages/shared/src/curriculum.js";
import { CONVERSATION_SCENARIOS } from "../../../packages/shared/src/scenarios.js";
import { LANGUAGE_CODES, LANGUAGES, isLanguageCode } from "../../../packages/shared/src/catalog.js";
import { estimateLevel, isDue, scheduleReview } from "../../../packages/shared/src/learning.js";
import type { CefrLevel, LearningGoal, ReviewRating } from "../../../packages/shared/src/types.js";
import { JsonStore } from "./data/json-store.js";
import { rankExercises, selectAdaptiveExercises } from "./modules/adaptive-practice.js";
import { LocalCoachProvider } from "./modules/coach.js";
import { createDailyPlan } from "./modules/daily-plan.js";
import {
  completeLessonSession,
  createLessonCatalog,
  findActiveLessonSession,
  findLessonById,
  startLessonSession,
  toLessonView
} from "./modules/guided-lessons.js";
import { applyPracticeAttempt } from "./modules/practice-attempt.js";
import { applyPronunciationAttempt, createPronunciationLab, findPronunciationPrompt } from "./modules/pronunciation.js";
import { createDashboard } from "./modules/progress.js";

const reviewRatings = new Set<ReviewRating>(["again", "hard", "good", "easy"]);
const cefrRank: Record<CefrLevel, number> = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };
const goalLabels: Record<LearningGoal, string> = {
  fluency: "Gagner en aisance",
  travel: "Voyager",
  work: "Travailler",
  basics: "Construire les bases"
};

export function createApp(store: JsonStore) {
  const app = express();
  const coach = new LocalCoachProvider();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_request, response) => response.json({ status: "ok", mode: "local" }));
  app.get("/api/languages", (_request, response) => response.json(LANGUAGE_CODES.map((code) => LANGUAGES[code])));

  app.get("/api/diagnostic/:language", (request, response) => {
    if (!isLanguageCode(request.params.language)) return response.status(404).json({ error: "Langue inconnue." });
    const questions = DIAGNOSTIC_QUESTIONS.filter((question) => question.language === request.params.language).map(
      ({ answer: _answer, acceptedAnswers: _accepted, ...question }) => question
    );
    return response.json(questions);
  });

  app.post("/api/diagnostic/:language", async (request, response) => {
    if (!isLanguageCode(request.params.language)) return response.status(404).json({ error: "Langue inconnue." });
    const answers = request.body?.answers;
    if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
      return response.status(400).json({ error: "Le champ answers est requis." });
    }
    const language = request.params.language;
    const questions = DIAGNOSTIC_QUESTIONS.filter((question) => question.language === language);
    const scoring = estimateLevel(questions, answers as Record<string, string>);
    const result = { language, ...scoring, completedAt: new Date().toISOString() };
    await store.update((state) => {
      if (!state.progress[language].diagnostic) state.progress[language].xp += 25;
      state.progress[language].diagnostic = result;
    });
    return response.json(result);
  });

  app.get("/api/practice/:language", async (request, response) => {
    if (!isLanguageCode(request.params.language)) return response.status(404).json({ error: "Langue inconnue." });
    const requestedLevel = typeof request.query.level === "string" ? request.query.level : undefined;
    const allowedLevels: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1"];
    if (requestedLevel && !allowedLevels.includes(requestedLevel as CefrLevel)) {
      return response.status(400).json({ error: "Niveau CECRL invalide." });
    }
    const language = request.params.language;
    const candidates = EXERCISES.filter(
      (exercise) => exercise.language === language && (!requestedLevel || exercise.level === requestedLevel)
    );
    const state = await store.read();
    const ranked = requestedLevel
      ? rankExercises(candidates, state, language)
      : selectAdaptiveExercises(candidates, state, language);
    const exercises = ranked.map(
      ({ exercise, score, recommendationReason }) => {
        const { answer: _answer, acceptedAnswers: _accepted, ...publicExercise } = exercise;
        return { ...publicExercise, recommendationScore: score, recommendationReason };
      }
    );
    return response.json(exercises);
  });

  app.post("/api/practice/:exerciseId/answer", async (request, response) => {
    const exercise = EXERCISES.find((candidate) => candidate.id === request.params.exerciseId);
    if (!exercise) return response.status(404).json({ error: "Exercice introuvable." });
    const answer = request.body?.answer;
    const attemptId = request.body?.attemptId;
    if (typeof answer !== "string" || typeof attemptId !== "string" || attemptId.length < 6) {
      return response.status(400).json({ error: "Une réponse et un identifiant de tentative sont requis." });
    }
    const result = await store.update((state) => {
      const attempt = applyPracticeAttempt(state, exercise, answer, attemptId);
      return { ...attempt, dashboard: createDashboard(state) };
    });
    return response.json(result);
  });

  app.get("/api/reviews/:language", async (request, response) => {
    if (!isLanguageCode(request.params.language)) return response.status(404).json({ error: "Langue inconnue." });
    const state = await store.read();
    return response.json(state.reviewCards.filter((card) => card.language === request.params.language && isDue(card)));
  });

  app.post("/api/reviews/:cardId", async (request, response) => {
    const rating = request.body?.rating as ReviewRating | undefined;
    if (!rating || !reviewRatings.has(rating)) return response.status(400).json({ error: "Note de révision invalide." });
    const updated = await store.update((state) => {
      const index = state.reviewCards.findIndex((card) => card.id === request.params.cardId);
      if (index < 0) return undefined;
      const card = scheduleReview(state.reviewCards[index]!, rating);
      state.reviewCards[index] = card;
      state.progress[card.language].xp += rating === "again" ? 1 : 5;
      return card;
    });
    return updated ? response.json(updated) : response.status(404).json({ error: "Carte introuvable." });
  });

  app.get("/api/dashboard", async (_request, response) => response.json(createDashboard(await store.read())));
  app.get("/api/plan/:language", async (request, response) => {
    if (!isLanguageCode(request.params.language)) return response.status(404).json({ error: "Langue inconnue." });
    return response.json(createDailyPlan(await store.read(), request.params.language));
  });

  app.get("/api/pronunciation/:language", async (request, response) => {
    if (!isLanguageCode(request.params.language)) return response.status(404).json({ error: "Langue inconnue." });
    return response.json(createPronunciationLab(await store.read(), request.params.language));
  });

  app.post("/api/pronunciation/:promptId/attempts", async (request, response) => {
    const prompt = findPronunciationPrompt(request.params.promptId);
    if (!prompt) return response.status(404).json({ error: "Phrase de prononciation introuvable." });
    const transcript = request.body?.transcript;
    const attemptId = request.body?.attemptId;
    const mode = request.body?.mode;
    if (
      typeof transcript !== "string"
      || !transcript.trim()
      || transcript.length > 500
      || typeof attemptId !== "string"
      || attemptId.length < 6
      || (mode !== "browser-transcript" && mode !== "manual-transcript")
    ) {
      return response.status(400).json({ error: "Une transcription, un mode et un identifiant de tentative valides sont requis." });
    }
    try {
      const result = await store.update((state) => (
        applyPronunciationAttempt(state, prompt, transcript.trim(), mode, attemptId)
      ));
      return response.status(result.duplicate ? 200 : 201).json(result);
    } catch (error) {
      return response.status(409).json({ error: (error as Error).message });
    }
  });

  app.get("/api/lessons/:language", async (request, response) => {
    if (!isLanguageCode(request.params.language)) return response.status(404).json({ error: "Langue inconnue." });
    const state = await store.read();
    const selectedLessonId = typeof request.query.lessonId === "string" ? request.query.lessonId : undefined;
    try {
      return response.json(toLessonView(state, request.params.language, undefined, selectedLessonId));
    } catch (error) {
      return response.status(404).json({ error: (error as Error).message });
    }
  });

  app.post("/api/lessons/:language/start", async (request, response) => {
    if (!isLanguageCode(request.params.language)) return response.status(404).json({ error: "Langue inconnue." });
    const language = request.params.language;
    const result = await store.update((state) => {
      const catalog = createLessonCatalog(state, language);
      const requestedLessonId = typeof request.body?.lessonId === "string"
        ? request.body.lessonId
        : catalog.recommendedLessonId;
      const requestedItem = catalog.items.find((item) => item.lesson.id === requestedLessonId);
      if (!requestedItem) return { error: "Leçon introuvable." } as const;
      const active = findActiveLessonSession(state, language);
      if (active && active.lessonId !== requestedLessonId) {
        return { error: "Une autre leçon est déjà en cours. Reprenez-la avant d'en choisir une nouvelle." } as const;
      }
      if (requestedItem.status === "locked") return { error: requestedItem.statusDetail } as const;
      const created = !active;
      const session = startLessonSession(state, language, requestedLessonId);
      return { view: toLessonView(state, language, session), created } as const;
    });
    if ("error" in result) return response.status(409).json(result);
    return response.status(result.created ? 201 : 200).json(result.view);
  });

  app.post("/api/lessons/:language/continue", async (request, response) => {
    if (!isLanguageCode(request.params.language)) return response.status(404).json({ error: "Langue inconnue." });
    const language = request.params.language;
    const result = await store.update((state) => {
      const session = findActiveLessonSession(state, language);
      if (!session) return { error: "Aucune leçon active." } as const;
      const lesson = findLessonById(session.lessonId, session.lessonRevision);
      if (session.phase === "intro") {
        session.phase = "practice";
      } else if (session.phase === "correction") {
        const exerciseId = lesson.exerciseIds[session.currentExerciseIndex];
        const attempts = session.attempts.filter((attempt) => attempt.exerciseId === exerciseId);
        const lastAttempt = attempts.at(-1);
        if (!lastAttempt) return { error: "Aucune correction à valider." } as const;
        if (lastAttempt.evaluation.correct || attempts.length >= 2) session.currentExerciseIndex += 1;
        if (session.currentExerciseIndex >= lesson.exerciseIds.length) {
          const scenario = CONVERSATION_SCENARIOS.find((candidate) => candidate.id === lesson.scenarioId);
          if (!scenario) return { error: "Scénario pédagogique introuvable." } as const;
          session.phase = "conversation";
          session.conversation = {
            language,
            activeScenarioId: scenario.id,
            scenarioStepIndex: 0,
            scenarioCompleted: false,
            messages: [{ id: crypto.randomUUID(), role: "coach", text: scenario.openingPrompt, createdAt: new Date().toISOString() }]
          };
        } else {
          session.phase = "practice";
        }
      } else {
        return { error: "Cette étape ne peut pas être continuée." } as const;
      }
      session.updatedAt = new Date().toISOString();
      return { view: toLessonView(state, language, session) } as const;
    });
    return "error" in result ? response.status(409).json(result) : response.json(result.view);
  });

  app.post("/api/lessons/:language/answer", async (request, response) => {
    if (!isLanguageCode(request.params.language)) return response.status(404).json({ error: "Langue inconnue." });
    const answer = request.body?.answer;
    const attemptId = request.body?.attemptId;
    const requestedSessionId = request.body?.sessionId;
    const requestedExerciseId = request.body?.exerciseId;
    if (typeof answer !== "string" || !answer.trim() || typeof attemptId !== "string" || attemptId.length < 6) {
      return response.status(400).json({ error: "Une réponse et un identifiant de tentative sont requis." });
    }
    if (typeof requestedSessionId !== "string" || requestedSessionId.length < 6
      || typeof requestedExerciseId !== "string" || requestedExerciseId.length < 6) {
      return response.status(400).json({ error: "La séance et l'exercice de la tentative sont requis." });
    }
    const language = request.params.language;
    const result = await store.update((state) => {
      const session = findActiveLessonSession(state, language);
      if (!session) return { error: "Aucune leçon active." } as const;
      if (session.id !== requestedSessionId) {
        return { error: "Cette réponse appartient à une autre séance." } as const;
      }
      const savedAttempt = session.attempts.find((attempt) => attempt.attemptId === attemptId);
      if (savedAttempt) {
        return { view: toLessonView(state, language, session), evaluation: savedAttempt.evaluation, duplicate: true } as const;
      }
      if (session.phase !== "practice") return { error: "La leçon n'attend pas de réponse." } as const;
      const lesson = findLessonById(session.lessonId, session.lessonRevision);
      const exerciseId = lesson.exerciseIds[session.currentExerciseIndex];
      if (exerciseId !== requestedExerciseId) {
        return { error: "Cette réponse appartient à une autre étape de la leçon." } as const;
      }
      const exercise = EXERCISES.find((candidate) => candidate.id === exerciseId && candidate.language === language);
      if (!exercise) return { error: "Exercice pédagogique introuvable." } as const;
      const applied = applyPracticeAttempt(state, exercise, answer.trim(), attemptId);
      if (applied.duplicate) return { error: "Identifiant de tentative déjà utilisé." } as const;
      session.attempts.push({ attemptId, exerciseId: exercise.id, submittedAnswer: answer.trim(), evaluation: applied.evaluation, createdAt: new Date().toISOString() });
      session.phase = "correction";
      session.updatedAt = new Date().toISOString();
      return { view: toLessonView(state, language, session), evaluation: applied.evaluation, duplicate: false } as const;
    });
    return "error" in result ? response.status(409).json(result) : response.json(result);
  });

  app.post("/api/lessons/:language/message", async (request, response) => {
    if (!isLanguageCode(request.params.language)) return response.status(404).json({ error: "Langue inconnue." });
    const text = request.body?.text;
    if (typeof text !== "string" || !text.trim() || text.length > 1_000) {
      return response.status(400).json({ error: "Le message doit contenir entre 1 et 1 000 caractères." });
    }
    const language = request.params.language;
    const result = await store.update((state) => {
      const session = findActiveLessonSession(state, language);
      if (!session || session.phase !== "conversation") return { error: "Aucune conversation de leçon active." } as const;
      const lesson = findLessonById(session.lessonId, session.lessonRevision);
      const scenario = CONVERSATION_SCENARIOS.find((candidate) => candidate.id === lesson.scenarioId);
      if (!scenario) return { error: "Scénario pédagogique introuvable." } as const;
      const reply = coach.reply(language, text.trim(), {
        scenario,
        scenarioStepIndex: session.conversation.scenarioStepIndex ?? 0
      });
      session.conversation.messages.push(reply.learnerMessage, reply.coachMessage);
      session.conversationTurns += 1;
      if (reply.scenarioAdvanced) {
        session.conversation.scenarioStepIndex = (session.conversation.scenarioStepIndex ?? 0) + 1;
        session.conversation.scenarioCompleted = session.conversation.scenarioStepIndex >= scenario.steps.length;
      }
      session.updatedAt = new Date().toISOString();
      if (session.conversation.scenarioCompleted || session.conversationTurns >= lesson.conversationTurnGoal) {
        completeLessonSession(state, session, lesson);
      }
      return { view: toLessonView(state, language, session), reply } as const;
    });
    return "error" in result ? response.status(409).json(result) : response.json(result);
  });
  app.get("/api/settings/:language", async (request, response) => {
    if (!isLanguageCode(request.params.language)) return response.status(404).json({ error: "Langue inconnue." });
    return response.json((await store.read()).settings[request.params.language]);
  });
  app.patch("/api/settings/:language", async (request, response) => {
    if (!isLanguageCode(request.params.language)) return response.status(404).json({ error: "Langue inconnue." });
    const goals = new Set<LearningGoal>(["fluency", "travel", "work", "basics"]);
    const minutes = new Set([5, 10, 15, 20]);
    const levels = new Set<CefrLevel>(["A1", "A2", "B1", "B2", "C1"]);
    const { goal, dailyMinutes, targetLevel } = request.body ?? {};
    if (!goals.has(goal) || !minutes.has(dailyMinutes) || !levels.has(targetLevel)) {
      return response.status(400).json({ error: "Réglages d'apprentissage invalides." });
    }
    const language = request.params.language;
    const settings = await store.update((state) => {
      state.settings[language] = { language, goal, dailyMinutes, targetLevel, onboardingCompleted: true };
      return state.settings[language];
    });
    return response.json(settings);
  });
  app.get("/api/mistakes", async (request, response) => {
    const language = typeof request.query.language === "string" ? request.query.language : undefined;
    if (language && !isLanguageCode(language)) return response.status(400).json({ error: "Langue inconnue." });
    const state = await store.read();
    return response.json(language ? state.mistakes.filter((mistake) => mistake.language === language) : state.mistakes);
  });

  app.get("/api/conversations/:language", async (request, response) => {
    if (!isLanguageCode(request.params.language)) return response.status(404).json({ error: "Langue inconnue." });
    return response.json((await store.read()).conversations[request.params.language]);
  });

  app.get("/api/scenarios/:language", async (request, response) => {
    if (!isLanguageCode(request.params.language)) return response.status(404).json({ error: "Langue inconnue." });
    const language = request.params.language;
    const settings = (await store.read()).settings[language];
    const scored = CONVERSATION_SCENARIOS.filter((scenario) => scenario.language === language).map((scenario) => {
      const goalToken = settings.goal === "basics" ? "daily" : settings.goal;
      const goalMatch = settings.goal !== "fluency" && scenario.id.includes(goalToken);
      const levelDistance = Math.abs(cefrRank[scenario.level] - cefrRank[settings.targetLevel]);
      const levelScore = Math.max(0, 12 - levelDistance * 4);
      const recommendationReason = goalMatch
        ? `Prioritaire · ${goalLabels[settings.goal]}`
        : settings.goal === "fluency" && levelScore > 0
          ? `Progression vers ${settings.targetLevel}`
          : undefined;
      return {
        ...scenario,
        recommendationScore: (goalMatch ? 30 : 0) + levelScore,
        recommendationReason
      };
    }).sort((a, b) => b.recommendationScore - a.recommendationScore || a.title.localeCompare(b.title));
    return response.json(scored);
  });

  app.post("/api/conversations/:language/scenario", async (request, response) => {
    if (!isLanguageCode(request.params.language)) return response.status(404).json({ error: "Langue inconnue." });
    const language = request.params.language;
    const scenario = CONVERSATION_SCENARIOS.find(
      (candidate) => candidate.id === request.body?.scenarioId && candidate.language === language
    );
    if (!scenario) return response.status(404).json({ error: "Scénario introuvable." });
    const thread = await store.update((state) => {
      const conversation = state.conversations[language];
      conversation.activeScenarioId = scenario.id;
      conversation.scenarioStepIndex = 0;
      conversation.scenarioCompleted = false;
      conversation.messages.push({
        id: crypto.randomUUID(),
        role: "coach",
        text: scenario.openingPrompt,
        createdAt: new Date().toISOString()
      });
      return conversation;
    });
    return response.json(thread);
  });

  app.post("/api/conversations/:language", async (request, response) => {
    if (!isLanguageCode(request.params.language)) return response.status(404).json({ error: "Langue inconnue." });
    const text = request.body?.text;
    if (typeof text !== "string" || !text.trim() || text.length > 1_000) {
      return response.status(400).json({ error: "Le message doit contenir entre 1 et 1 000 caractères." });
    }
    const language = request.params.language;
    const reply = await store.update((state) => {
      const thread = state.conversations[language];
      const scenario = CONVERSATION_SCENARIOS.find((candidate) => candidate.id === thread.activeScenarioId);
      const result = coach.reply(language, text.trim(), {
        scenario,
        scenarioStepIndex: thread.scenarioStepIndex ?? 0
      });
      thread.messages.push(result.learnerMessage, result.coachMessage);
      if (scenario && result.scenarioAdvanced && (thread.scenarioStepIndex ?? 0) < scenario.steps.length) {
        thread.scenarioStepIndex = (thread.scenarioStepIndex ?? 0) + 1;
        thread.scenarioCompleted = thread.scenarioStepIndex >= scenario.steps.length;
      }
      return result;
    });
    return response.json(reply);
  });

  app.get("/api/export", async (_request, response) => {
    response.setHeader("Content-Disposition", `attachment; filename=sd-languages-export-${new Date().toISOString().slice(0, 10)}.json`);
    return response.json(await store.read());
  });

  if (process.env.NODE_ENV === "production") {
    const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
    const webDirectory = path.resolve(currentDirectory, "../../web/dist");
    if (existsSync(webDirectory)) {
      app.use(express.static(webDirectory));
      app.use((request, response, next) => {
        if (request.method !== "GET" || request.path.startsWith("/api/")) return next();
        return response.sendFile(path.join(webDirectory, "index.html"));
      });
    }
  }

  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    console.error(error);
    response.status(500).json({ error: "Erreur locale inattendue." });
  });

  return app;
}
