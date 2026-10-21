import { describe, expect, it } from "vitest";
import type { Exercise, LearnerState } from "../../shared/src/types.js";
import { createInitialState } from "../src/initial-state.js";
import { createEngine } from "../src/router.js";
import { createSkillsView, summarizeSkill } from "../src/modules/skills.js";
import { SKILLS } from "../../shared/src/skills.js";
import { MemoryStore } from "./engine.test.js";

const exercise = (id: string, language: Exercise["language"], skillTags: string[]): Exercise => ({
  id, language, level: "B1", type: "fill-gap", skillTags, prompt: id, answer: "x", explanation: "", hint: "", focus: id
});
const bank: Exercise[] = [
  exercise("en-pp-1", "en", ["present-perfect"]),
  exercise("en-pp-2", "en", ["present-perfect", "questions"]),
  exercise("en-pp-3", "en", ["present-perfect"]),
  exercise("es-ser-1", "es", ["ser-estar"])
];
const presentPerfect = SKILLS.en.find((skill) => skill.id === "present-perfect")!;
const seen = (seen: number, correct: number, lastCorrect: boolean, lastSeenAt: string) => ({ seen, correct, lastCorrect, lastSeenAt });

function stateWith(partial: Partial<LearnerState>): LearnerState {
  return { ...createInitialState(), ...partial };
}

describe("carte de compétences (22/10/2026)", () => {
  it("décrit une compétence jamais rencontrée sans inventer de score", () => {
    const summary = summarizeSkill(createInitialState(), "en", presentPerfect, bank);
    expect(summary).toMatchObject({ exerciseCount: 3, exposure: 0, seenExerciseCount: 0, recentResults: [], stability: 0, openMistakes: 0, action: "practice" });
    expect(summary.recentSuccess).toBeUndefined();
    expect(summary.reason).toContain("Jamais rencontrée");
  });

  it("calcule exposition, réussite récente, stabilité et erreurs ouvertes à partir des preuves", () => {
    const state = stateWith({
      exerciseHistory: {
        "en-pp-1": seen(3, 3, true, "2026-10-20T10:00:00.000Z"),
        "en-pp-2": seen(2, 1, false, "2026-10-21T10:00:00.000Z")
      },
      mistakes: [{
        id: "mistake-en-pp-2", exerciseId: "en-pp-2", language: "en", submittedAnswer: "y", expectedAnswer: "x", focus: "pp",
        occurrenceCount: 1, resolvedCount: 0, firstSeenAt: "2026-10-21T10:00:00.000Z", lastSeenAt: "2026-10-21T10:00:00.000Z"
      }],
      reviewCards: [{
        id: "card-en-pp-2", sourceExerciseId: "en-pp-2", language: "en", prompt: "", answer: "x", focus: "pp",
        nextReviewAt: "2026-10-22T10:00:00.000Z", intervalDays: 1, easeFactor: 2.5, repetitions: 0, lapses: 0
      }]
    });
    const summary = summarizeSkill(state, "en", presentPerfect, bank);
    expect(summary.exposure).toBe(5);
    expect(summary.seenExerciseCount).toBe(2);
    expect(summary.recentResults).toEqual([false, true]);
    expect(summary.recentSuccess).toBe(0.5);
    expect(summary.stability).toBe(0.5);
    expect(summary.openMistakes).toBe(1);
    expect(summary.nextReviewAt).toBe("2026-10-22T10:00:00.000Z");
    expect(summary.action).toBe("review");
  });

  it("compte chaque tentative de leçon horodatée une seule fois, même si l'historique la reflète", () => {
    const at = "2026-10-21T20:00:00.000Z";
    const attempt = (exerciseId: string, correct: boolean, createdAt: string) => ({
      attemptId: `${exerciseId}-${createdAt}`, exerciseId, submittedAnswer: "x", createdAt,
      evaluation: { correct, verdict: correct ? "exact" as const : "incorrect" as const, normalizedAnswer: "x", expectedAnswer: "x", explanation: "", feedback: "", issues: [] }
    });
    const state = stateWith({
      exerciseHistory: { "en-pp-1": seen(2, 2, true, at) },
      lessonSessions: [{
        id: "s1", lessonId: "lesson-en-project-update", lessonRevision: 3, language: "en", status: "completed", phase: "summary",
        currentExerciseIndex: 1, conversationTurns: 0, startedAt: at, updatedAt: at, conversation: { language: "en", messages: [] },
        attempts: [attempt("en-pp-1", true, "2026-10-21T19:58:00.000Z"), attempt("en-pp-1", true, at)]
      }]
    });
    const summary = summarizeSkill(state, "en", presentPerfect, bank);
    expect(summary.recentResults).toEqual([true, true]);
    expect(summary.action).toBe("consolidate");
    expect(summary.reason).toContain("trop peu pour conclure");
  });

  it("qualifie d'acquis solide une compétence réussie et stable, à pratiquer en contexte", () => {
    const state = stateWith({
      exerciseHistory: {
        "en-pp-1": seen(3, 3, true, "2026-10-19T10:00:00.000Z"),
        "en-pp-2": seen(2, 2, true, "2026-10-20T10:00:00.000Z"),
        "en-pp-3": seen(4, 4, true, "2026-10-21T10:00:00.000Z")
      }
    });
    const summary = summarizeSkill(state, "en", presentPerfect, bank);
    expect(summary).toMatchObject({ recentSuccess: 1, stability: 1, action: "practice" });
    expect(summary.reason).toContain("en contexte");
  });

  it("ne laisse jamais une langue influencer les compétences d'une autre", () => {
    const state = stateWith({
      exerciseHistory: { "es-ser-1": seen(5, 1, false, "2026-10-21T10:00:00.000Z") },
      mistakes: [{
        id: "mistake-es-ser-1", exerciseId: "es-ser-1", language: "es", submittedAnswer: "y", expectedAnswer: "x", focus: "ser",
        occurrenceCount: 4, resolvedCount: 0, firstSeenAt: "2026-10-21T10:00:00.000Z", lastSeenAt: "2026-10-21T10:00:00.000Z"
      }]
    });
    const english = createSkillsView(state, "en", new Date("2026-10-22T00:00:00.000Z"), bank);
    expect(english.skills.every((skill) => skill.exposure === 0 && skill.openMistakes === 0 && skill.recentResults.length === 0)).toBe(true);
    const spanish = createSkillsView(state, "es", new Date("2026-10-22T00:00:00.000Z"), bank);
    expect(spanish.skills.find((skill) => skill.id === "ser-estar")).toMatchObject({ exposure: 5, openMistakes: 4, action: "review" });
    // Même identifiant dans deux langues (« modals », « listening »…) : deux compétences distinctes.
    expect(english.skills.map((skill) => skill.id)).toEqual(SKILLS.en.map((skill) => skill.id));
  });

  it("expose la carte par route et lance une série ciblée par compétence quand il n'y a pas de thème", async () => {
    const store = new MemoryStore();
    const engine = createEngine(store);
    const view = (await engine.handle("GET", "/api/skills/en")).body as { skills: Array<{ id: string; exerciseCount: number; topic?: string }>; groups: unknown[] };
    expect(view.skills).toHaveLength(SKILLS.en.length);
    expect(view.groups.length).toBeGreaterThanOrEqual(2);
    expect(view.skills.every((skill) => skill.exerciseCount >= 3)).toBe(true);
    expect((await engine.handle("GET", "/api/skills/xx")).status).toBe(404);

    const series = (await engine.handle("GET", "/api/practice/en?skill=present-perfect")).body as Array<{ skillTags?: string[] }>;
    expect(series).toHaveLength(6);
    expect(series.every((item) => item.skillTags?.includes("present-perfect"))).toBe(true);
    expect((await engine.handle("GET", "/api/practice/en?skill=ser-estar")).status).toBe(400);

    // Répondre à un exercice espagnol ne touche pas la carte anglaise.
    const before = JSON.stringify((await engine.handle("GET", "/api/skills/en")).body);
    await engine.handle("POST", "/api/practice/es-a1-gap-present/answer", { answer: "hablamos", attemptId: "skills-es-001" });
    const after = (await engine.handle("GET", "/api/skills/en")).body as { generatedAt: string };
    expect(JSON.stringify({ ...JSON.parse(before), generatedAt: after.generatedAt })).toBe(JSON.stringify(after));
    const spanish = (await engine.handle("GET", "/api/skills/es")).body as { skills: Array<{ id: string; exposure: number }> };
    expect(spanish.skills.find((skill) => skill.id === "present-tense")?.exposure).toBe(1);
  });
});
