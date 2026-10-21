import { describe, expect, it } from "vitest";
import { EXERCISES } from "../src/curriculum.js";
import { evaluateAnswer, matchPairsAnswer, normalizeAnswer } from "../src/learning.js";
import { GUIDED_LESSONS, RETIRED_LESSON_REVISIONS } from "../src/lessons.js";
import type { Exercise } from "../src/types.js";

const exercise = (id: string) => {
  const found = EXERCISES.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`Exercice ${id} introuvable`);
  return found;
};
const spanishA1Lessons = GUIDED_LESSONS.filter((lesson) => lesson.language === "es" && lesson.level === "A1");

describe("formats d'exercice à la Duolingo", () => {
  it("corrige une phrase construite avec les étiquettes comme une phrase tapée", () => {
    const wordBank = exercise("es-a1-l1-wordbank-origin");
    expect(evaluateAnswer(wordBank, "Me llamo Ana y soy de Madrid").verdict).toBe("exact");
    expect(evaluateAnswer(wordBank, "Me llamo Ana y estoy de Madrid").correct).toBe(false);
  });

  it("accepte une paire associée correctement et explique une paire inversée", () => {
    const pairs = exercise("es-a1-l1-match-greetings");
    expect(evaluateAnswer(pairs, matchPairsAnswer(pairs.pairs!)).verdict).toBe("exact");
    const swapped = pairs.pairs!.map((pair, index, all) => ({ target: pair.target, native: all[index === 0 ? 1 : index === 1 ? 0 : index]!.native }));
    const result = evaluateAnswer(pairs, matchPairsAnswer(swapped));
    expect(result.correct).toBe(false);
    expect(result.issues[0]?.message).toContain("paire est inversée");
  });

  it("tolère l'oubli des accents et des signes ¿ ? en dictée, en le signalant", () => {
    const listening = exercise("es-a1-l1-listen-question");
    expect(evaluateAnswer(listening, "¿Cómo te llamas?").verdict).toBe("exact");
    expect(evaluateAnswer(listening, "como te llamas").verdict).toBe("minor");
  });
});

describe("tranche espagnol A1", () => {
  it("donne à chaque leçon A1 au moins six exercices dont quatre qui lui sont propres", () => {
    expect(spanishA1Lessons.map((lesson) => lesson.revision)).toEqual([2, 2, 2]);
    const usage = new Map<string, number>();
    for (const lesson of GUIDED_LESSONS) for (const id of lesson.exerciseIds) usage.set(id, (usage.get(id) ?? 0) + 1);
    for (const lesson of spanishA1Lessons) {
      expect(lesson.exerciseIds.length).toBeGreaterThanOrEqual(6);
      expect(lesson.exerciseIds.filter((id) => usage.get(id) === 1).length).toBeGreaterThanOrEqual(4);
      expect(new Set(lesson.exerciseIds.map((id) => exercise(id).type)).size).toBeGreaterThanOrEqual(4);
      expect(lesson.exerciseIds.every((id) => exercise(id).language === "es" && exercise(id).level === "A1")).toBe(true);
    }
  });

  it("n'utilise que des exercices complets et cohérents avec leur format", () => {
    const formats = EXERCISES.filter((item): item is Exercise => ["word-bank", "match-pairs", "listening"].includes(item.type));
    expect(formats.length).toBeGreaterThanOrEqual(9);
    for (const item of formats) {
      if (item.type === "word-bank") {
        // Chaque mot de la réponse doit être disponible parmi les étiquettes.
        const tiles = item.tiles!.map(normalizeAnswer);
        expect(normalizeAnswer(item.answer).split(" ").every((word) => tiles.includes(word))).toBe(true);
        expect(item.tiles!.length).toBeGreaterThan(normalizeAnswer(item.answer).split(" ").length);
      }
      if (item.type === "match-pairs") {
        expect(item.pairs!.length).toBeGreaterThanOrEqual(3);
        expect(new Set(item.pairs!.map((pair) => pair.native)).size).toBe(item.pairs!.length);
        expect(item.answer).toBe(matchPairsAnswer(item.pairs!));
      }
      if (item.type === "listening") {
        expect(item.audioText).toBe(item.answer);
        // La traduction n'est révélée qu'après validation (explication), jamais dans l'indice.
        expect(item.hint).not.toContain("Sens");
        expect(item.explanation).toMatch(/^« .+ » — /u);
      }
    }
  });

  it("garde l'ancienne révision des leçons remplacées pour les séances en cours", () => {
    const retired = RETIRED_LESSON_REVISIONS.find((lesson) => lesson.id === "lesson-es-daily-basics");
    expect(retired?.revision).toBe(1);
    expect(retired?.exerciseIds).toEqual(["es-a1-mcq-gender", "es-a1-gap-present", "es-a1-mcq-hotel-room"]);
    expect(GUIDED_LESSONS.filter((lesson) => lesson.id === "lesson-es-daily-basics")).toHaveLength(1);
  });
});
