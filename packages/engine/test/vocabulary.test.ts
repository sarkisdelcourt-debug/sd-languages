import { describe, expect, it } from "vitest";
import type { LearnerState } from "../../shared/src/types.js";
import { createInitialState } from "../src/initial-state.js";
import { createEngine } from "../src/router.js";
import type { StateStore } from "../src/state.js";

class MemoryStore implements StateStore {
  constructor(public state: LearnerState = createInitialState()) {}
  async read() { return structuredClone(this.state); }
  async update<T>(mutation: (state: LearnerState) => T | Promise<T>) {
    const draft = structuredClone(this.state);
    const result = await mutation(draft);
    this.state = draft;
    return result;
  }
}

type Drill = { id: string; prompt: string; type: string; choices?: string[]; answer?: string };
const drillOf = async (engine: ReturnType<typeof createEngine>, query: string) => (await engine.handle("GET", `/api/vocabulary/en/drill?${query}`)).body as Drill[];

describe("route des tests de vocabulaire", () => {
  it("liste les listes thématiques de chaque langue avec leur nombre de mots", async () => {
    const engine = createEngine(new MemoryStore());
    for (const language of ["en", "de", "es"]) {
      const body = (await engine.handle("GET", `/api/vocabulary/${language}`)).body as { sets: Array<{ id: string; count: number; seen: number }> };
      expect(body.sets.length, language).toBeGreaterThanOrEqual(8);
      expect(body.sets.every((set) => set.count >= 8 && set.seen === 0), language).toBe(true);
    }
    expect((await engine.handle("GET", "/api/vocabulary/xx")).status).toBe(404);
  });

  it("fabrique une série de 10 sans jamais révéler la réponse", async () => {
    const engine = createEngine(new MemoryStore());
    const series = await drillOf(engine, "direction=to-target&mode=choice&set=en-med-v-anatomy");
    expect(series).toHaveLength(10);
    expect(series.every((item) => item.prompt.startsWith("Comment dit-on") && item.type === "multiple-choice")).toBe(true);
    expect(series.every((item) => !("answer" in item) && !("acceptedAnswers" in item))).toBe(true);
    expect(new Set(series.map((item) => item.id)).size).toBe(10);
    const typed = await drillOf(engine, "direction=to-french&mode=typing&set=en-med-v-anatomy&count=5");
    expect(typed).toHaveLength(5);
    expect(typed.every((item) => item.type === "translation" && item.prompt.startsWith("Traduisez en français"))).toBe(true);
  });

  it("refuse un sens, un mode ou une liste inconnus", async () => {
    const engine = createEngine(new MemoryStore());
    expect((await engine.handle("GET", "/api/vocabulary/en/drill?direction=sideways")).status).toBe(400);
    expect((await engine.handle("GET", "/api/vocabulary/en/drill?mode=oral")).status).toBe(400);
    expect((await engine.handle("GET", "/api/vocabulary/en/drill?set=nope")).status).toBe(404);
  });

  it("corrige la réponse via la route des exercices et range une erreur en mémoire et en révision", async () => {
    const store = new MemoryStore();
    const engine = createEngine(store);
    const [first] = await drillOf(engine, "direction=to-target&mode=typing&set=en-med-v-anatomy");
    const wrong = await engine.handle("POST", `/api/practice/${encodeURIComponent(first!.id)}/answer`, { answer: "banana", attemptId: "vocab-attempt-001" });
    expect(wrong.status).toBe(200);
    expect((wrong.body as { evaluation: { correct: boolean } }).evaluation.correct).toBe(false);
    expect(store.state.mistakes.some((mistake) => mistake.exerciseId === first!.id)).toBe(true);
    expect(store.state.reviewCards.some((card) => card.sourceExerciseId === first!.id)).toBe(true);
    // Les écrans qui relisent la mémoire des erreurs ne doivent pas planter sur un exercice de vocabulaire.
    expect((await engine.handle("GET", "/api/skills/en")).status).toBe(200);
    expect((await engine.handle("GET", "/api/dashboard")).status).toBe(200);
    expect((await engine.handle("GET", "/api/mistakes?language=en")).status).toBe(200);
  });

  it("repropose d'abord ce qui vient d'être raté, et exclut la série déjà vue", async () => {
    const store = new MemoryStore();
    const engine = createEngine(store);
    const query = "direction=to-target&mode=choice&set=en-med-v-anatomy";
    const [first, second] = await drillOf(engine, query);
    await engine.handle("POST", `/api/practice/${encodeURIComponent(first!.id)}/answer`, { answer: "wrong", attemptId: "vocab-attempt-002" });
    const correct = "the bladder";
    await engine.handle("POST", `/api/practice/${encodeURIComponent(second!.id)}/answer`, { answer: correct, attemptId: "vocab-attempt-003" });
    const next = await drillOf(engine, query);
    expect(next[0]!.id).toBe(first!.id);
    const seen = (await drillOf(engine, `${query}&count=5`)).map((item) => item.id);
    const another = (await drillOf(engine, `${query}&count=5&exclude=${seen.join(",")}`)).map((item) => item.id);
    expect(another.some((id) => seen.includes(id))).toBe(false);
    const sets = (await engine.handle("GET", "/api/vocabulary/en")).body as { sets: Array<{ id: string; seen: number }> };
    expect(sets.sets.find((set) => set.id === "en-med-v-anatomy")!.seen).toBeGreaterThanOrEqual(1);
  });

  it("garde la même série sur les trois langues sans mélanger les mots", async () => {
    const engine = createEngine(new MemoryStore());
    for (const language of ["de", "es"]) {
      const series = (await engine.handle("GET", `/api/vocabulary/${language}/drill?direction=mixed&mode=choice`)).body as Drill[];
      expect(series, language).toHaveLength(10);
      expect(series.every((item) => item.id.includes(`${language}-v-`)), language).toBe(true);
    }
  });
});
