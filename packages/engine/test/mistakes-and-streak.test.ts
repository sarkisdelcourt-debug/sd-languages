// LANG-03 : une réussite solde un échec encore ouvert, jamais un échec futur.
// LANG-05 : la série quotidienne se compte en jours du fuseau de l'apprenant, pas en jours UTC.
import { describe, expect, it } from "vitest";
import { EXERCISES } from "../../shared/src/curriculum.js";
import type { Exercise, LearnerState, MistakeRecord } from "../../shared/src/types.js";
import { evaluateAnswer } from "../../shared/src/learning.js";
import { createInitialState } from "../src/initial-state.js";
import { createDailyPlan } from "../src/modules/daily-plan.js";
import { unresolvedCount } from "../src/modules/mistakes.js";
import { applyPracticeAttempt } from "../src/modules/practice-attempt.js";
import { learningDay, previousDay, recordPractice } from "../src/modules/progress.js";

const exercise = EXERCISES.find((item) => item.language === "en")! as Exercise;
const WRONG = "zzz-reponse-fausse";
let counter = 0;
const play = (state: LearnerState, correct: boolean) =>
  applyPracticeAttempt(state, exercise, correct ? exercise.answer : WRONG, `attempt-${++counter}-${correct}`);
const sequence = (results: boolean[]) => {
  const state = createInitialState();
  for (const correct of results) play(state, correct);
  return state;
};
const openCount = (state: LearnerState) => {
  const mistake = state.mistakes.find((item) => item.exerciseId === exercise.id);
  return mistake ? unresolvedCount(mistake, state.exerciseHistory) : 0;
};

describe("erreurs ouvertes : une réussite ne solde que les échecs déjà survenus (LANG-03)", () => {
  it("faux, juste, juste, juste, faux : l'erreur est ouverte (cas reproduit : 0 avant correction)", () => {
    const state = sequence([false, true, true, true, false]);
    const mistake = state.mistakes[0]!;
    expect(mistake.occurrenceCount).toBe(2);
    expect(mistake.resolvedCount).toBe(1); // plus de crédit illimité : 3 réussites ne soldent qu'un seul échec
    expect(state.exerciseHistory?.[exercise.id]?.lastCorrect).toBe(false);
    expect(openCount(state)).toBe(1);
  });

  it("chaque réussite solde un échec ouvert, dans l'ordre", () => {
    expect(openCount(sequence([false]))).toBe(1);
    expect(openCount(sequence([false, true]))).toBe(0);
    expect(openCount(sequence([false, false]))).toBe(2);
    expect(openCount(sequence([false, false, true]))).toBe(1);
    expect(openCount(sequence([false, false, true, true]))).toBe(0);
    expect(openCount(sequence([false, true, true, true]))).toBe(0);
    expect(sequence([true, true]).mistakes).toEqual([]); // jamais d'erreur : rien à rouvrir
  });

  it("un rejeu de la même tentative ne compte pas deux fois", () => {
    const state = createInitialState();
    applyPracticeAttempt(state, exercise, WRONG, "same-attempt-1");
    applyPracticeAttempt(state, exercise, WRONG, "same-attempt-1");
    expect(state.mistakes[0]!.occurrenceCount).toBe(1);
  });

  it("données existantes : un crédit de réussites trop grand est neutralisé à la lecture, sans modifier les compteurs enregistrés", () => {
    const legacy: MistakeRecord = {
      id: `mistake-${exercise.id}`, exerciseId: exercise.id, language: "en", submittedAnswer: WRONG, expectedAnswer: exercise.answer,
      focus: "f", occurrenceCount: 2, resolvedCount: 3, firstSeenAt: "2026-10-01T00:00:00.000Z", lastSeenAt: "2026-10-02T00:00:00.000Z"
    };
    expect(unresolvedCount(legacy, { [exercise.id]: { seen: 5, correct: 3, lastSeenAt: "2026-10-02T00:00:00.000Z", lastCorrect: false } })).toBe(1);
    expect(unresolvedCount(legacy, { [exercise.id]: { seen: 5, correct: 4, lastSeenAt: "2026-10-02T00:00:00.000Z", lastCorrect: true } })).toBe(0);
    expect(unresolvedCount(legacy, undefined)).toBe(0);
    expect(legacy.resolvedCount).toBe(3); // aucune écriture : réversible
  });

  it("le plan quotidien reprend l'erreur rouverte (avant : « 0 erreur ouverte », elle disparaissait)", () => {
    const state = sequence([false, true, true, true, false]);
    const titles = createDailyPlan(state, "en", new Date("2026-10-23T10:00:00Z")).items.map((item) => item.title).join(" | ");
    expect(titles).toContain(state.mistakes[0]!.focus);
    const solved = sequence([false, true]);
    expect(createDailyPlan(solved, "en", new Date("2026-10-23T10:00:00Z")).items.map((item) => item.title).join(" | ")).not.toContain(solved.mistakes[0]!.focus);
  });
});

describe("série quotidienne : jours du fuseau de l'apprenant (LANG-05)", () => {
  const practiceAt = (state: LearnerState, iso: string, timeZone: string) => recordPractice(state, "en", true, new Date(iso), timeZone);

  it("23h30 puis 00h30 à Paris : deux jours, série de 2 (cas reproduit : 1 en UTC)", () => {
    const state = createInitialState();
    practiceAt(state, "2026-10-23T21:30:00Z", "Europe/Paris"); // 23:30, heure d'été
    practiceAt(state, "2026-10-23T22:30:00Z", "Europe/Paris"); // 00:30 le lendemain
    expect(state.progress.en.lastPracticeDate).toBe("2026-10-24");
    expect(state.progress.en.currentStreak).toBe(2);
  });

  it("les mêmes instants comptés en UTC restent un seul jour (le fuseau fait bien la différence)", () => {
    const state = createInitialState();
    practiceAt(state, "2026-10-23T21:30:00Z", "UTC");
    practiceAt(state, "2026-10-23T22:30:00Z", "UTC");
    expect(state.progress.en).toMatchObject({ lastPracticeDate: "2026-10-23", currentStreak: 1 });
  });

  it("deux séances le même jour local ne font pas avancer la série ; un jour sauté la remet à 1", () => {
    const state = createInitialState();
    practiceAt(state, "2026-10-20T08:00:00Z", "Europe/Paris");
    practiceAt(state, "2026-10-20T19:00:00Z", "Europe/Paris");
    expect(state.progress.en.currentStreak).toBe(1);
    practiceAt(state, "2026-10-21T08:00:00Z", "Europe/Paris");
    expect(state.progress.en.currentStreak).toBe(2);
    practiceAt(state, "2026-10-23T08:00:00Z", "Europe/Paris"); // le 22 est sauté
    expect(state.progress.en.currentStreak).toBe(1);
  });

  it("changements d'heure : une journée de 23 h ou de 25 h ne casse pas la série", () => {
    const autumn = createInitialState(); // fin de l'heure d'été le 25/10/2026 : journée de 25 h
    practiceAt(autumn, "2026-10-24T21:00:00Z", "Europe/Paris");
    practiceAt(autumn, "2026-10-25T22:30:00Z", "Europe/Paris");
    practiceAt(autumn, "2026-10-26T22:10:00Z", "Europe/Paris");
    expect(autumn.progress.en.currentStreak).toBe(3);
    const spring = createInitialState(); // passage à l'heure d'été le 29/03/2026 : journée de 23 h
    practiceAt(spring, "2026-03-28T22:30:00Z", "Europe/Paris");
    practiceAt(spring, "2026-03-29T21:30:00Z", "Europe/Paris");
    expect(spring.progress.en.currentStreak).toBe(2);
  });

  it("voyage : le jour est celui du fuseau en vigueur au moment de la séance (deux fuseaux, même date locale = pas de nouveau jour)", () => {
    const state = createInitialState();
    practiceAt(state, "2026-10-23T21:30:00Z", "Europe/Paris"); // 23:30 le 23
    practiceAt(state, "2026-10-24T03:30:00Z", "America/New_York"); // 23:30 le 23 à New York
    expect(state.progress.en).toMatchObject({ lastPracticeDate: "2026-10-23", currentStreak: 1 });
  });

  it("fuseau inconnu : repli sur UTC, sans erreur", () => {
    expect(learningDay(new Date("2026-10-23T22:30:00Z"), "Pas/DeFuseau")).toBe("2026-10-23");
    expect(learningDay(new Date("2026-10-23T22:30:00Z"), "Europe/Paris")).toBe("2026-10-24");
  });

  it("veille d'une date : bords de mois et d'année, années bissextiles", () => {
    expect(previousDay("2026-03-01")).toBe("2026-02-28");
    expect(previousDay("2028-03-01")).toBe("2028-02-29");
    expect(previousDay("2027-01-01")).toBe("2026-12-31");
  });
});

describe("rotation quotidienne : même jour que la série (LANG-05)", () => {
  it("le départage change à minuit heure de Paris, pas à minuit UTC", async () => {
    const { dailyTieBreaker } = await import("../src/modules/adaptive-practice.js");
    const before = new Date("2026-10-23T21:30:00Z"); // 23h30 à Paris
    const after = new Date("2026-10-23T22:30:00Z"); // 00h30 le lendemain à Paris
    expect(dailyTieBreaker("ex-1", before, "UTC")).toBe(dailyTieBreaker("ex-1", after, "UTC"));
    const ids = ["a", "b", "c", "d", "e", "f", "g", "h"];
    expect(ids.some((id) => dailyTieBreaker(id, before, "Europe/Paris") !== dailyTieBreaker(id, after, "Europe/Paris"))).toBe(true);
  });
});

describe("série quotidienne : date enregistrée dans le futur (ancien calcul en UTC)", () => {
  it("garde la série et la date quand la dernière séance porte une date postérieure à aujourd'hui", () => {
    const state = createInitialState();
    state.progress.en.lastPracticeDate = "2026-10-24";
    state.progress.en.currentStreak = 30;
    recordPractice(state, "en", true, new Date("2026-10-24T04:00:00Z"), "America/Los_Angeles"); // 23 octobre au soir à Los Angeles
    expect(state.progress.en).toMatchObject({ lastPracticeDate: "2026-10-24", currentStreak: 30 });
  });
});

import { createEngine } from "../src/router.js";
import { buildLessonSummary } from "../src/modules/guided-lessons.js";
import { GUIDED_LESSONS } from "../../shared/src/lessons.js";
import { EXERCISES } from "../../shared/src/curriculum.js";

describe("preuve de maîtrise : recopier la correction ne vaut pas maîtrise (audit du 26/10/2026, C1)", () => {
  it("une leçon dont chaque exercice est raté puis recopié n'est PAS maîtrisée", () => {
    const lesson = GUIDED_LESSONS.find((candidate) => candidate.id === "lesson-en-project-update")!;
    const attempts = lesson.exerciseIds.flatMap((exerciseId, index) => {
      const exercise = EXERCISES.find((candidate) => candidate.id === exerciseId)!;
      const wrong = evaluateAnswer(exercise, "banana banana banana");
      const copied = evaluateAnswer(exercise, exercise.answer);
      return [
        { attemptId: `w${index}`, exerciseId, submittedAnswer: "banana banana banana", evaluation: wrong, createdAt: "2026-10-26T10:00:00Z" },
        { attemptId: `c${index}`, exerciseId, submittedAnswer: exercise.answer, evaluation: copied, createdAt: "2026-10-26T10:01:00Z" }
      ];
    });
    const summary = buildLessonSummary({ attempts, conversation: { language: "en", messages: [], scenarioStepIndex: 4 } } as never, lesson);
    expect(summary.exact + summary.minor).toBe(0);
    expect(summary.corrected).toBe(lesson.exerciseIds.length);
    expect(summary.outcome).toBe("needs-review");
  });
  it("les erreurs recopiées restent ouvertes et ne rapportent pas d'XP de réussite", async () => {
    const state = createInitialState();
    const exercise = EXERCISES.find((candidate) => candidate.language === "en" && candidate.type === "fill-gap")!;
    const { applyPracticeAttempt } = await import("../src/modules/practice-attempt.js");
    applyPracticeAttempt(state, exercise, "zzz", "attempt-1");
    const xpAfterMiss = state.progress.en.xp;
    applyPracticeAttempt(state, exercise, exercise.answer, "attempt-2", { assisted: true });
    expect(state.progress.en.xp - xpAfterMiss).toBe(2);
    expect(state.mistakes[0]!.resolvedCount).toBe(0);
    applyPracticeAttempt(state, exercise, exercise.answer, "attempt-3");
    expect(state.mistakes[0]!.resolvedCount).toBe(1);
    expect(createEngine).toBeDefined();
  });
});
