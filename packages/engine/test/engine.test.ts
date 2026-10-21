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
