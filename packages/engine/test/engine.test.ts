import { describe, expect, it } from "vitest";
import type { GuidedLessonSession, LearnerState } from "../../shared/src/types.js";
import { createInitialState } from "../src/initial-state.js";
import { createEngine } from "../src/router.js";
import { buildLessonSummary } from "../src/modules/guided-lessons.js";
import { dailyTieBreaker, selectAdaptiveExercises } from "../src/modules/adaptive-practice.js";
import { EXERCISES } from "../../shared/src/curriculum.js";
import { GUIDED_LESSONS } from "../../shared/src/lessons.js";
import type { StateStore } from "../src/state.js";

export class MemoryStore implements StateStore {
  constructor(public state: LearnerState = createInitialState()) {}
  async read() {
    return structuredClone(this.state);
  }
  async update<T>(mutation: (state: LearnerState) => T | Promise<T>) {
    const draft = structuredClone(this.state);
    const result = await mutation(draft);
    this.state = draft;
    return result;
  }
}

describe("transport-free engine", () => {
  it("answers the same routes as the former HTTP API without any server", async () => {
    const engine = createEngine(new MemoryStore());
    expect(await engine.handle("GET", "/api/health")).toEqual({ status: 200, body: { status: "ok", mode: "local" } });
    expect((await engine.handle("GET", "/api/nothing")).status).toBe(404);
    expect((await engine.handle("GET", "/api/plan/xx")).status).toBe(404);
  });

  it("parses query strings and keeps practice attempts idempotent", async () => {
    const store = new MemoryStore();
    const engine = createEngine(store);
    const a1 = await engine.handle("GET", "/api/practice/en?level=A1");
    expect((a1.body as Array<{ level: string }>).every((exercise) => exercise.level === "A1")).toBe(true);
    expect((await engine.handle("GET", "/api/practice/en?level=Z9")).status).toBe(400);

    const body = { answer: "has", attemptId: "engine-attempt-001" };
    await engine.handle("POST", "/api/practice/en-a1-mcq-have/answer", body);
    const replay = await engine.handle("POST", "/api/practice/en-a1-mcq-have/answer", body);
    expect((replay.body as { duplicate: boolean }).duplicate).toBe(true);
    expect(store.state.progress.en.completedExercises).toBe(1);
  });

  it("lets a lesson session started on a retired revision continue with its own exercises", async () => {
    const store = new MemoryStore();
    const engine = createEngine(store);
    const started = await engine.handle("POST", "/api/lessons/es/start", { lessonId: "lesson-es-daily-basics" });
    expect(started.status).toBe(201);
    // Simule une séance commencée avant la mise à jour : révision 1, premier exercice « es-a1-mcq-gender ».
    store.state.lessonSessions[0]!.lessonRevision = 1;
    await engine.handle("POST", "/api/lessons/es/continue");
    const answered = await engine.handle("POST", "/api/lessons/es/answer", {
      answer: "La", attemptId: "retired-revision-001", sessionId: store.state.lessonSessions[0]!.id, exerciseId: "es-a1-mcq-gender"
    });
    expect(answered.status).toBe(200);
    expect((answered.body as { evaluation: { verdict: string } }).evaluation.verdict).toBe("exact");
  });

  it("proposes a fresh series instead of looping over the same six exercises", async () => {
    const engine = createEngine(new MemoryStore());
    const ids = (body: unknown) => (body as Array<{ id: string }>).map((exercise) => exercise.id);
    const first = ids((await engine.handle("GET", "/api/practice/es")).body);
    expect(first).toHaveLength(6);
    const second = ids((await engine.handle("GET", `/api/practice/es?exclude=${first.join(",")}`)).body);
    expect(second.length).toBeGreaterThan(0);
    expect(second.some((id) => first.includes(id))).toBe(false);
  });

  it("lets a correctly answered exercise step aside so new ones come first", async () => {
    const store = new MemoryStore();
    const engine = createEngine(store);
    const first = (await engine.handle("GET", "/api/practice/es")).body as Array<{ id: string; recommendationReason: string }>;
    expect(first[0]!.recommendationReason).toContain("Nouveau");
    const target = first[0]!.id;
    const exercise = (await import("../../shared/src/curriculum.js")).EXERCISES.find((item) => item.id === target)!;
    await engine.handle("POST", `/api/practice/${target}/answer`, { answer: exercise.answer, attemptId: "variety-001" });
    expect(store.state.exerciseHistory?.[target]).toMatchObject({ seen: 1, correct: 1, lastCorrect: true });
    const next = ((await engine.handle("GET", "/api/practice/es")).body as Array<{ id: string }>).map((item) => item.id);
    expect(next).not.toContain(target);
  });

  it("varies the formats of a topic series and never builds then dictates the same sentence", async () => {
    const engine = createEngine(new MemoryStore());
    const series = (await engine.handle("GET", "/api/practice/en?topic=medical")).body as Array<{ id: string; type: string }>;
    expect(series).toHaveLength(6);
    const perFormat = series.reduce<Record<string, number>>((totals, item) => ({ ...totals, [item.type]: (totals[item.type] ?? 0) + 1 }), {});
    expect(Math.max(...Object.values(perFormat))).toBeLessThanOrEqual(2);
    const sources = series.map((item) => item.id.replace(/-(build|listen)$/u, ""));
    expect(new Set(sources).size).toBe(sources.length);
  });

  it("rejects an unknown topic and lists only topics that have content", async () => {
    const engine = createEngine(new MemoryStore());
    expect((await engine.handle("GET", "/api/practice/en?topic=astrologie")).status).toBe(400);
    const topics = (await engine.handle("GET", "/api/practice-topics/en")).body as Array<{ count: number }>;
    expect(topics.every((topic) => topic.count > 0)).toBe(true);
  });

  it("lets the learner declare B1 over an A2 diagnostic: A1–A2 lessons count as acquired", async () => {
    const store = new MemoryStore();
    store.state.progress.en.diagnostic = { language: "en", score: 4, total: 12, percentage: 33, estimatedLevel: "A2", completedAt: "2026-10-19T20:42:51.953Z" };
    const engine = createEngine(store);
    const settings = { goal: "fluency", dailyMinutes: 15, targetLevel: "B2" };

    expect((await engine.handle("PATCH", "/api/settings/en", { ...settings, declaredLevel: "Z9" })).status).toBe(400);
    const saved = await engine.handle("PATCH", "/api/settings/en", { ...settings, declaredLevel: "B1" });
    expect(saved.body).toMatchObject({ declaredLevel: "B1" });

    const view = (await engine.handle("GET", "/api/lessons/en")).body as {
      catalog: { recommendedLessonId: string; items: Array<{ lesson: { level: string }; status: string; statusDetail: string }> };
    };
    const lower = view.catalog.items.filter((item) => item.lesson.level === "A1" || item.lesson.level === "A2");
    expect(lower).toHaveLength(6);
    expect(lower.every((item) => item.status === "completed" && item.statusDetail.includes("niveau B1 déclaré"))).toBe(true);
    expect(view.catalog.recommendedLessonId).toBe("lesson-en-project-update");

    const plan = (await engine.handle("GET", "/api/plan/en")).body as { items: Array<{ kind: string }> };
    expect(plan.items.map((item) => item.kind)).not.toContain("diagnostic");
    const dashboard = (await engine.handle("GET", "/api/dashboard")).body as { levels: Record<string, string | undefined> };
    expect(dashboard.levels.en).toBe("B1");

    // Revenir au diagnostic : on efface le niveau déclaré.
    const cleared = await engine.handle("PATCH", "/api/settings/en", { ...settings, declaredLevel: null });
    expect(cleared.body).not.toHaveProperty("declaredLevel");
    expect(((await engine.handle("GET", "/api/dashboard")).body as { levels: Record<string, string> }).levels.en).toBe("A2");
  });

  it("returns a 500 with a neutral message when a rule throws", async () => {
    const broken: StateStore = {
      read: async () => { throw new Error("disque plein"); },
      update: async () => { throw new Error("disque plein"); }
    };
    const original = console.error;
    console.error = () => undefined;
    try {
      const result = await createEngine(broken).handle("GET", "/api/dashboard");
      expect(result).toEqual({ status: 500, body: { error: "Erreur locale inattendue." } });
    } finally {
      console.error = original;
    }
  });
});

describe("leçons guidées : maîtrise tolérante et abandon (21/10/2026)", () => {
  it("compte un accent oublié (verdict « minor ») comme acquis pour la maîtrise", () => {
    const lesson = GUIDED_LESSONS.find((candidate) => candidate.id === "lesson-en-project-update")!;
    const verdicts = ["exact", "exact", "exact", "minor", "minor", "minor"] as const;
    const session: GuidedLessonSession = {
      id: "s-1", lessonId: lesson.id, lessonRevision: lesson.revision, language: "en", status: "active", phase: "conversation",
      currentExerciseIndex: lesson.exerciseIds.length, conversationTurns: 3, startedAt: "2026-10-21T20:00:00.000Z", updatedAt: "2026-10-21T20:00:00.000Z",
      conversation: { language: "en", messages: [], scenarioStepIndex: 3 },
      attempts: lesson.exerciseIds.map((exerciseId, index) => ({
        attemptId: `a-${index}`, exerciseId, submittedAnswer: "x", createdAt: "2026-10-21T20:00:00.000Z",
        evaluation: { correct: true, verdict: verdicts[index % verdicts.length]!, normalizedAnswer: "x", expectedAnswer: "x", explanation: "", feedback: "", issues: [] }
      }))
    };
    expect(buildLessonSummary(session, lesson)).toMatchObject({ exact: 3, minor: 3, incorrect: 0, outcome: "mastered" });
    session.attempts[0]!.evaluation = { ...session.attempts[0]!.evaluation, correct: false, verdict: "incorrect" };
    expect(buildLessonSummary(session, lesson).outcome).toBe("needs-review");
  });

  it("abandonne la leçon en cours : elle redevient disponible, rien d'autre n'est effacé", async () => {
    const store = new MemoryStore();
    const engine = createEngine(store);
    expect((await engine.handle("POST", "/api/lessons/en/abandon")).status).toBe(409);
    await engine.handle("POST", "/api/lessons/en/start", { lessonId: "lesson-en-daily-basics" });
    await engine.handle("POST", "/api/lessons/en/continue");
    const session = store.state.lessonSessions[0]!;
    const exerciseId = GUIDED_LESSONS.find((candidate) => candidate.id === "lesson-en-daily-basics")!.exerciseIds[0]!;
    await engine.handle("POST", "/api/lessons/en/answer", { answer: "zzz", attemptId: "abandon-attempt-01", sessionId: session.id, exerciseId });
    const mistakesBefore = store.state.mistakes.length;
    expect(mistakesBefore).toBeGreaterThan(0);

    // Avant l'abandon, la séance reste reprenable (cas de la séance réelle de Sarkis).
    expect(((await engine.handle("GET", "/api/lessons/en")).body as { session?: { status: string } }).session?.status).toBe("active");

    const abandoned = await engine.handle("POST", "/api/lessons/en/abandon");
    expect(abandoned.status).toBe(200);
    const stored = store.state.lessonSessions.find((candidate) => candidate.id === session.id)!;
    expect(stored.status).toBe("completed");
    expect(stored.summary?.outcome).toBe("abandoned");
    expect(store.state.lessonProgress["lesson-en-daily-basics"]).toBeUndefined();
    expect(store.state.mistakes).toHaveLength(mistakesBefore);

    const view = (await engine.handle("GET", "/api/lessons/en")).body as { session?: unknown; catalog: { items: Array<{ lesson: { id: string }; status: string }> } };
    expect(view.session).toBeUndefined();
    expect(view.catalog.items.find((item) => item.lesson.id === "lesson-en-daily-basics")?.status).toBe("available");
    expect((await engine.handle("POST", "/api/lessons/en/start", { lessonId: "lesson-en-daily-basics" })).status).toBe(201);
  });
});

describe("série « Recommandé » équilibrée (21/10/2026)", () => {
  const englishExercises = EXERCISES.filter((exercise) => exercise.language === "en");
  const declaredState = (goal: "fluency" | "work") => {
    const state = createInitialState();
    state.settings.en = { ...state.settings.en, goal, declaredLevel: "B1", targetLevel: "B2" };
    return state;
  };
  const days = [21, 22, 23, 24, 25].map((day) => new Date(`2026-10-${day}T19:00:00.000Z`));

  it("varie les thèmes sur cinq jours et ne propose jamais six exercices du même thème", () => {
    const topicsSeen = new Set<string>();
    for (const day of days) {
      const series = selectAdaptiveExercises(englishExercises, declaredState("fluency"), "en", day);
      expect(series).toHaveLength(6);
      const perTopic = new Map<string, number>();
      for (const item of series) {
        const topic = item.exercise.topic ?? "général";
        topicsSeen.add(topic);
        perTopic.set(topic, (perTopic.get(topic) ?? 0) + 1);
      }
      expect(Math.max(...perTopic.values()), day.toISOString()).toBeLessThanOrEqual(2);
    }
    expect(topicsSeen.size).toBeGreaterThanOrEqual(4);
  });

  it("inclut de l'anglais médical quand l'objectif est « Travailler »", () => {
    for (const day of days) {
      const series = selectAdaptiveExercises(englishExercises, declaredState("work"), "en", day);
      expect(series.some((item) => item.exercise.topic === "medical"), day.toISOString()).toBe(true);
    }
  });

  it("ne dépend plus de l'ordre alphabétique : le départage jour + id couvre 0–1000", () => {
    const values = new Set(englishExercises.slice(0, 200).map((exercise) => dailyTieBreaker(exercise.id, days[0]!)));
    expect(values.size).toBeGreaterThan(100);
    expect([...values].every((value) => value >= 0 && value <= 1000)).toBe(true);
    expect(dailyTieBreaker("x", days[0]!)).toBe(dailyTieBreaker("x", days[0]!));
  });
});

describe("révisions retirées (22/10/2026)", () => {
  it("laisse la séance réelle « Faire un point projet clair » commencée en révision 2 se poursuivre avec ses exercices", async () => {
    const store = new MemoryStore();
    store.state.settings.en.declaredLevel = "B1";
    const engine = createEngine(store);
    const started = await engine.handle("POST", "/api/lessons/en/start", { lessonId: "lesson-en-project-update" });
    expect(started.status).toBe(201);
    expect(store.state.lessonSessions[0]!.lessonRevision).toBe(3);
    // Simule la séance de Sarkis : commencée en révision 2, premier exercice « en-hw-g-001 ».
    store.state.lessonSessions[0]!.lessonRevision = 2;
    await engine.handle("POST", "/api/lessons/en/continue");
    const view = (await engine.handle("GET", "/api/lessons/en")).body as { lesson: { revision: number; exerciseIds: string[] }; currentExercise?: { id: string } };
    expect(view.lesson.revision).toBe(2);
    expect(view.currentExercise?.id).toBe("en-hw-g-001");
    const answered = await engine.handle("POST", "/api/lessons/en/answer", {
      answer: "have been", attemptId: "retired-revision-en-001", sessionId: store.state.lessonSessions[0]!.id, exerciseId: "en-hw-g-001"
    });
    expect(answered.status).toBe(200);
    expect((answered.body as { evaluation: { verdict: string } }).evaluation.verdict).toBe("exact");
  });
});

describe("chapitres acquis (22/10/2026)", () => {
  it("expose le niveau déclaré dans le catalogue pour replier les chapitres inférieurs, et rien sans déclaration", async () => {
    const store = new MemoryStore();
    const engine = createEngine(store);
    const before = (await engine.handle("GET", "/api/lessons/en")).body as { catalog: { declaredLevel?: string } };
    expect(before.catalog.declaredLevel).toBeUndefined();
    await engine.handle("PATCH", "/api/settings/en", { goal: "fluency", dailyMinutes: 15, targetLevel: "B2", declaredLevel: "B1" });
    const after = (await engine.handle("GET", "/api/lessons/en")).body as { catalog: { declaredLevel?: string; items: Array<{ lesson: { level: string }; status: string }> } };
    expect(after.catalog.declaredLevel).toBe("B1");
    for (const level of ["A1", "A2"]) {
      expect(after.catalog.items.filter((item) => item.lesson.level === level).every((item) => item.status === "completed"), level).toBe(true);
    }
    expect(after.catalog.items.filter((item) => item.lesson.level === "B1").some((item) => item.status !== "completed")).toBe(true);
  });
});
