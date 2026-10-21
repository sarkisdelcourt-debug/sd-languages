import { describe, expect, it } from "vitest";
import type { LearnerState } from "../../shared/src/types.js";
import { createInitialState } from "../src/initial-state.js";
import { createEngine } from "../src/router.js";
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
