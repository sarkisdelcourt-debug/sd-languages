import { DIAGNOSTIC_QUESTIONS, EXERCISES } from "../../shared/src/curriculum.js";
import { CONVERSATION_SCENARIOS } from "../../shared/src/scenarios.js";
import { LANGUAGE_CODES, LANGUAGES, isLanguageCode } from "../../shared/src/catalog.js";
import { estimateLevel, isDue, scheduleReview } from "../../shared/src/learning.js";
import type { CefrLevel, ExerciseTopic, LearningGoal, ReviewRating } from "../../shared/src/types.js";
import { rankExercises, selectAdaptiveExercises, selectTopicExercises } from "./modules/adaptive-practice.js";
import { LocalCoachProvider } from "./modules/coach.js";
import { createDailyPlan } from "./modules/daily-plan.js";
import {
  abandonLessonSession,
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
import { createSkillsView } from "./modules/skills.js";
import { findSkill } from "../../shared/src/skills.js";
import type { StateStore } from "./state.js";

/**
 * Moteur applicatif indépendant du transport. Il conserve la forme « méthode + chemin + corps » de
 * l'ancienne API HTTP afin que le serveur Node (tests, PC) et le navigateur (iPhone, hors ligne)
 * exécutent exactement les mêmes règles.
 */
export type HttpMethod = "GET" | "POST" | "PATCH";
export interface EngineResponse {
  status: number;
  body: unknown;
}
/** Chaque gestionnaire ne lit que les paramètres déclarés dans son propre motif de route. */
type RouteParams = Record<"language" | "exerciseId" | "cardId" | "promptId", string>;
interface RouteContext {
  params: RouteParams;
  query: URLSearchParams;
  body: any;
}
type Handler = (context: RouteContext) => Promise<EngineResponse> | EngineResponse;
interface Route {
  method: HttpMethod;
  segments: string[];
  handler: Handler;
}

const reviewRatings = new Set<ReviewRating>(["again", "hard", "good", "easy"]);
export const TOPIC_LABELS: Record<ExerciseTopic, string> = {
  medical: "Anglais médical",
  everyday: "Conversation",
  travel: "Voyage",
  grammar: "Grammaire",
  "phrasal-verbs": "Phrasal verbs",
  "irregular-verbs": "Verbes irréguliers",
  "false-friends": "Faux amis"
};
const cefrRank: Record<CefrLevel, number> = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };
const goalLabels: Record<LearningGoal, string> = {
  fluency: "Gagner en aisance",
  travel: "Voyager",
  work: "Travailler",
  basics: "Construire les bases"
};

const ok = (body: unknown, status = 200): EngineResponse => ({ status, body });
const fail = (status: number, error: string): EngineResponse => ({ status, body: { error } });
const unknownLanguage = () => fail(404, "Langue inconnue.");

export interface Engine {
  handle(method: string, path: string, body?: unknown): Promise<EngineResponse>;
}

export function createEngine(store: StateStore): Engine {
  const coach = new LocalCoachProvider();
  const routes: Route[] = [];
  const route = (method: HttpMethod, pattern: string, handler: Handler) => {
    routes.push({ method, segments: pattern.split("/").filter(Boolean), handler });
  };

  route("GET", "/api/health", () => ok({ status: "ok", mode: "local" }));
  route("GET", "/api/languages", () => ok(LANGUAGE_CODES.map((code) => LANGUAGES[code])));

  route("GET", "/api/diagnostic/:language", ({ params }) => {
    if (!isLanguageCode(params.language)) return unknownLanguage();
    const questions = DIAGNOSTIC_QUESTIONS.filter((question) => question.language === params.language).map(
      ({ answer: _answer, acceptedAnswers: _accepted, ...question }) => question
    );
    return ok(questions);
  });

  route("POST", "/api/diagnostic/:language", async ({ params, body }) => {
    const language = params.language;
    if (!isLanguageCode(language)) return unknownLanguage();
    const answers = body?.answers;
    if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
      return fail(400, "Le champ answers est requis.");
    }
    const questions = DIAGNOSTIC_QUESTIONS.filter((question) => question.language === language);
    const scoring = estimateLevel(questions, answers as Record<string, string>);
    const result = { language, ...scoring, completedAt: new Date().toISOString() };
    await store.update((state) => {
      if (!state.progress[language].diagnostic) state.progress[language].xp += 25;
      state.progress[language].diagnostic = result;
    });
    return ok(result);
  });

  route("GET", "/api/practice/:language", async ({ params, query }) => {
    const language = params.language;
    if (!isLanguageCode(language)) return unknownLanguage();
    const requestedLevel = query.get("level") ?? undefined;
    const allowedLevels: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1"];
    if (requestedLevel && !allowedLevels.includes(requestedLevel as CefrLevel)) {
      return fail(400, "Niveau CECRL invalide.");
    }
    const topic = query.get("topic") ?? undefined;
    if (topic && !TOPIC_LABELS[topic as ExerciseTopic]) return fail(400, "Thème inconnu.");
    // Série ciblée par compétence (carte « Mes acquis ») quand la compétence n'a pas de thème.
    const skill = query.get("skill") ?? undefined;
    if (skill && !findSkill(language, skill)) return fail(400, "Compétence inconnue.");
    // Exercices déjà vus dans la série en cours : la « nouvelle série » ne les repropose pas.
    const excluded = new Set((query.get("exclude") ?? "").split(",").filter(Boolean));
    const inScope = EXERCISES.filter(
      (exercise) => exercise.language === language
        && (!requestedLevel || exercise.level === requestedLevel)
        && (!topic || exercise.topic === topic)
        && (!skill || exercise.skillTags?.includes(skill))
    );
    const fresh = inScope.filter((exercise) => !excluded.has(exercise.id));
    const candidates = fresh.length ? fresh : inScope;
    const state = await store.read();
    const ranked = requestedLevel
      ? rankExercises(candidates, state, language)
      : topic || skill
        ? selectTopicExercises(candidates, state, language)
        : selectAdaptiveExercises(candidates, state, language);
    return ok(ranked.map(({ exercise, score, recommendationReason }) => {
      const { answer: _answer, acceptedAnswers: _accepted, ...publicExercise } = exercise;
      return { ...publicExercise, recommendationScore: score, recommendationReason };
    }));
  });

  route("GET", "/api/practice-topics/:language", async ({ params }) => {
    const language = params.language;
    if (!isLanguageCode(language)) return unknownLanguage();
    const state = await store.read();
    const topics = (Object.keys(TOPIC_LABELS) as ExerciseTopic[]).map((topic) => {
      const exercises = EXERCISES.filter((exercise) => exercise.language === language && exercise.topic === topic);
      const seen = exercises.filter((exercise) => state.exerciseHistory?.[exercise.id]).length;
      return { topic, label: TOPIC_LABELS[topic], count: exercises.length, seen };
    }).filter((entry) => entry.count > 0);
    return ok(topics);
  });

  route("POST", "/api/practice/:exerciseId/answer", async ({ params, body }) => {
    const exercise = EXERCISES.find((candidate) => candidate.id === params.exerciseId);
    if (!exercise) return fail(404, "Exercice introuvable.");
    const answer = body?.answer;
    const attemptId = body?.attemptId;
    if (typeof answer !== "string" || typeof attemptId !== "string" || attemptId.length < 6) {
      return fail(400, "Une réponse et un identifiant de tentative sont requis.");
    }
    return ok(await store.update((state) => {
      const attempt = applyPracticeAttempt(state, exercise, answer, attemptId);
      return { ...attempt, dashboard: createDashboard(state) };
    }));
  });

  route("GET", "/api/reviews/:language", async ({ params }) => {
    if (!isLanguageCode(params.language)) return unknownLanguage();
    const state = await store.read();
    return ok(state.reviewCards.filter((card) => card.language === params.language && isDue(card)));
  });

  route("POST", "/api/reviews/:cardId", async ({ params, body }) => {
    const rating = body?.rating as ReviewRating | undefined;
    if (!rating || !reviewRatings.has(rating)) return fail(400, "Note de révision invalide.");
    const updated = await store.update((state) => {
      const index = state.reviewCards.findIndex((card) => card.id === params.cardId);
      if (index < 0) return undefined;
      const card = scheduleReview(state.reviewCards[index]!, rating);
      state.reviewCards[index] = card;
      state.progress[card.language].xp += rating === "again" ? 1 : 5;
      return card;
    });
    return updated ? ok(updated) : fail(404, "Carte introuvable.");
  });

  route("GET", "/api/dashboard", async () => ok(createDashboard(await store.read())));
  route("GET", "/api/skills/:language", async ({ params }) => {
    if (!isLanguageCode(params.language)) return unknownLanguage();
    return ok(createSkillsView(await store.read(), params.language));
  });
  route("GET", "/api/plan/:language", async ({ params }) => {
    if (!isLanguageCode(params.language)) return unknownLanguage();
    return ok(createDailyPlan(await store.read(), params.language));
  });

  route("GET", "/api/pronunciation/:language", async ({ params }) => {
    if (!isLanguageCode(params.language)) return unknownLanguage();
    return ok(createPronunciationLab(await store.read(), params.language));
  });

  route("POST", "/api/pronunciation/:promptId/attempts", async ({ params, body }) => {
    const prompt = findPronunciationPrompt(params.promptId);
    if (!prompt) return fail(404, "Phrase de prononciation introuvable.");
    const transcript = body?.transcript;
    const attemptId = body?.attemptId;
    const mode = body?.mode;
    if (
      typeof transcript !== "string"
      || !transcript.trim()
      || transcript.length > 500
      || typeof attemptId !== "string"
      || attemptId.length < 6
      || (mode !== "browser-transcript" && mode !== "manual-transcript")
    ) {
      return fail(400, "Une transcription, un mode et un identifiant de tentative valides sont requis.");
    }
    try {
      const result = await store.update((state) => (
        applyPronunciationAttempt(state, prompt, transcript.trim(), mode, attemptId)
      ));
      return ok(result, result.duplicate ? 200 : 201);
    } catch (error) {
      return fail(409, (error as Error).message);
    }
  });

  route("GET", "/api/lessons/:language", async ({ params, query }) => {
    if (!isLanguageCode(params.language)) return unknownLanguage();
    const state = await store.read();
    const selectedLessonId = query.get("lessonId") ?? undefined;
    try {
      return ok(toLessonView(state, params.language, undefined, selectedLessonId));
    } catch (error) {
      return fail(404, (error as Error).message);
    }
  });

  route("POST", "/api/lessons/:language/start", async ({ params, body }) => {
    const language = params.language;
    if (!isLanguageCode(language)) return unknownLanguage();
    const result = await store.update((state) => {
      const catalog = createLessonCatalog(state, language);
      const requestedLessonId = typeof body?.lessonId === "string" ? body.lessonId : catalog.recommendedLessonId;
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
    if ("error" in result) return ok(result, 409);
    return ok(result.view, result.created ? 201 : 200);
  });

  route("POST", "/api/lessons/:language/continue", async ({ params }) => {
    const language = params.language;
    if (!isLanguageCode(language)) return unknownLanguage();
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
    return "error" in result ? ok(result, 409) : ok(result.view);
  });

  route("POST", "/api/lessons/:language/abandon", async ({ params }) => {
    const language = params.language;
    if (!isLanguageCode(language)) return unknownLanguage();
    const result = await store.update((state) => {
      const session = findActiveLessonSession(state, language);
      if (!session) return { error: "Aucune leçon active." } as const;
      abandonLessonSession(session, findLessonById(session.lessonId, session.lessonRevision));
      return { view: toLessonView(state, language) } as const;
    });
    return "error" in result ? ok(result, 409) : ok(result.view);
  });

  route("POST", "/api/lessons/:language/answer", async ({ params, body }) => {
    const language = params.language;
    if (!isLanguageCode(language)) return unknownLanguage();
    const answer = body?.answer;
    const attemptId = body?.attemptId;
    const requestedSessionId = body?.sessionId;
    const requestedExerciseId = body?.exerciseId;
    if (typeof answer !== "string" || !answer.trim() || typeof attemptId !== "string" || attemptId.length < 6) {
      return fail(400, "Une réponse et un identifiant de tentative sont requis.");
    }
    if (typeof requestedSessionId !== "string" || requestedSessionId.length < 6
      || typeof requestedExerciseId !== "string" || requestedExerciseId.length < 6) {
      return fail(400, "La séance et l'exercice de la tentative sont requis.");
    }
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
    return "error" in result ? ok(result, 409) : ok(result);
  });

  route("POST", "/api/lessons/:language/message", async ({ params, body }) => {
    const language = params.language;
    if (!isLanguageCode(language)) return unknownLanguage();
    const text = body?.text;
    if (typeof text !== "string" || !text.trim() || text.length > 1_000) {
      return fail(400, "Le message doit contenir entre 1 et 1 000 caractères.");
    }
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
    return "error" in result ? ok(result, 409) : ok(result);
  });

  route("GET", "/api/settings/:language", async ({ params }) => {
    if (!isLanguageCode(params.language)) return unknownLanguage();
    return ok((await store.read()).settings[params.language]);
  });

  route("PATCH", "/api/settings/:language", async ({ params, body }) => {
    const language = params.language;
    if (!isLanguageCode(language)) return unknownLanguage();
    const goals = new Set<LearningGoal>(["fluency", "travel", "work", "basics"]);
    const minutes = new Set([5, 10, 15, 20]);
    const levels = new Set<CefrLevel>(["A1", "A2", "B1", "B2", "C1"]);
    const { goal, dailyMinutes, targetLevel, declaredLevel } = body ?? {};
    if (!goals.has(goal) || !minutes.has(dailyMinutes) || !levels.has(targetLevel)) {
      return fail(400, "Réglages d'apprentissage invalides.");
    }
    // declaredLevel : absent = inchangé, null = revenir au diagnostic, sinon un niveau CECRL.
    if (declaredLevel !== undefined && declaredLevel !== null && !levels.has(declaredLevel)) {
      return fail(400, "Niveau actuel invalide.");
    }
    return ok(await store.update((state) => {
      const keptLevel = declaredLevel === undefined ? state.settings[language].declaredLevel : declaredLevel ?? undefined;
      state.settings[language] = {
        language, goal, dailyMinutes, targetLevel, onboardingCompleted: true,
        ...(keptLevel ? { declaredLevel: keptLevel } : {})
      };
      return state.settings[language];
    }));
  });

  route("GET", "/api/mistakes", async ({ query }) => {
    const language = query.get("language") ?? undefined;
    if (language && !isLanguageCode(language)) return fail(400, "Langue inconnue.");
    const state = await store.read();
    return ok(language ? state.mistakes.filter((mistake) => mistake.language === language) : state.mistakes);
  });

  route("GET", "/api/conversations/:language", async ({ params }) => {
    if (!isLanguageCode(params.language)) return unknownLanguage();
    return ok((await store.read()).conversations[params.language]);
  });

  route("GET", "/api/scenarios/:language", async ({ params }) => {
    const language = params.language;
    if (!isLanguageCode(language)) return unknownLanguage();
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
      return { ...scenario, recommendationScore: (goalMatch ? 30 : 0) + levelScore, recommendationReason };
    }).sort((a, b) => b.recommendationScore - a.recommendationScore || a.title.localeCompare(b.title));
    return ok(scored);
  });

  route("POST", "/api/conversations/:language/scenario", async ({ params, body }) => {
    const language = params.language;
    if (!isLanguageCode(language)) return unknownLanguage();
    const scenario = CONVERSATION_SCENARIOS.find(
      (candidate) => candidate.id === body?.scenarioId && candidate.language === language
    );
    if (!scenario) return fail(404, "Scénario introuvable.");
    return ok(await store.update((state) => {
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
    }));
  });

  route("POST", "/api/conversations/:language", async ({ params, body }) => {
    const language = params.language;
    if (!isLanguageCode(language)) return unknownLanguage();
    const text = body?.text;
    if (typeof text !== "string" || !text.trim() || text.length > 1_000) {
      return fail(400, "Le message doit contenir entre 1 et 1 000 caractères.");
    }
    return ok(await store.update((state) => {
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
    }));
  });

  route("GET", "/api/export", async () => ok(await store.read()));

  const match = (method: string, segments: string[]) => {
    for (const candidate of routes) {
      if (candidate.method !== method || candidate.segments.length !== segments.length) continue;
      const params: Record<string, string> = {};
      const matched = candidate.segments.every((segment, index) => {
        const actual = segments[index]!;
        if (segment.startsWith(":")) {
          params[segment.slice(1)] = actual;
          return true;
        }
        return segment === actual;
      });
      if (matched) return { route: candidate, params: params as RouteParams };
    }
    return undefined;
  };

  return {
    async handle(method, path, body) {
      const url = new URL(path, "http://sd-languages.local");
      let segments: string[];
      try {
        segments = url.pathname.split("/").filter(Boolean).map((segment) => decodeURIComponent(segment));
      } catch {
        return fail(400, "Chemin invalide.");
      }
      const found = match(method.toUpperCase(), segments);
      if (!found) return fail(404, "Route inconnue.");
      try {
        return await found.route.handler({ params: found.params, query: url.searchParams, body });
      } catch (error) {
        console.error(error);
        return fail(500, "Erreur locale inattendue.");
      }
    }
  };
}
