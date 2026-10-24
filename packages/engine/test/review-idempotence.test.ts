import { describe, expect, it } from "vitest";
import { EXERCISES } from "../../shared/src/curriculum.js";
import { createReviewCard } from "../../shared/src/learning.js";
import type { LearnerState, ReviewCard } from "../../shared/src/types.js";
import { createInitialState } from "../src/initial-state.js";
import { createEngine } from "../src/router.js";
import type { StateStore } from "../src/state.js";

class MemoryStore implements StateStore {
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

function withDueCard() {
  const store = new MemoryStore();
  const exercise = EXERCISES.find((item) => item.language === "en")!;
  const card = createReviewCard(exercise);
  store.state.reviewCards.push(card);
  return { store, engine: createEngine(store), cardId: card.id, language: card.language };
}

describe("une révision n'est comptée qu'une fois (LANG-04)", () => {
  it("renvoie le résultat initial quand la même tentative est rejouée, sans rien recompter (cas reproduit)", async () => {
    const { store, engine, cardId, language } = withDueCard();
    const xp = store.state.progress[language].xp;
    const body = { rating: "good", attemptId: "review-attempt-001" };
    const first = await engine.handle("POST", `/api/reviews/${cardId}`, body);
    const replay = await engine.handle("POST", `/api/reviews/${cardId}`, body);
    expect(first.status).toBe(200);
    expect(replay.status).toBe(200);
    expect(replay.body).toEqual(first.body);
    const card = store.state.reviewCards[0] as ReviewCard;
    expect(card.repetitions).toBe(1);
    expect(store.state.progress[language].xp).toBe(xp + 5);
    expect(store.state.processedAttemptIds.filter((id) => id === "review-attempt-001")).toHaveLength(1);
  });

  it("compte deux fois deux tentatives distinctes (deux vraies révisions)", async () => {
    const { store, engine, cardId } = withDueCard();
    await engine.handle("POST", `/api/reviews/${cardId}`, { rating: "good", attemptId: "review-attempt-001" });
    await engine.handle("POST", `/api/reviews/${cardId}`, { rating: "good", attemptId: "review-attempt-002" });
    expect(store.state.reviewCards[0]!.repetitions).toBe(2);
  });

  it("refuse une requête sans identifiant de tentative, et signale une carte inconnue", async () => {
    const { store, engine, cardId } = withDueCard();
    expect((await engine.handle("POST", `/api/reviews/${cardId}`, { rating: "good" })).status).toBe(400);
    expect((await engine.handle("POST", `/api/reviews/${cardId}`, { rating: "good", attemptId: "x" })).status).toBe(400);
    expect((await engine.handle("POST", "/api/reviews/inconnue", { rating: "good", attemptId: "review-attempt-003" })).status).toBe(404);
    expect(store.state.reviewCards[0]!.repetitions).toBe(0);
    expect(store.state.processedAttemptIds).not.toContain("review-attempt-003");
  });
});
