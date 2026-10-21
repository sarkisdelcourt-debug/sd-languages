import { describe, expect, it } from "vitest";
import { ENGLISH_BANK } from "../src/content/en/index.js";
import { normalizeAnswer, evaluateAnswer } from "../src/learning.js";
import { DIAGNOSTIC_QUESTIONS, EXERCISES } from "../src/curriculum.js";

describe("banque anglaise", () => {
  it("multiplie largement le contenu anglais et couvre les thèmes demandés", () => {
    expect(EXERCISES.filter((exercise) => exercise.language === "en").length).toBeGreaterThan(600);
    for (const topic of ["medical", "phrasal-verbs", "irregular-verbs", "false-friends"] as const) {
      expect(ENGLISH_BANK.filter((exercise) => exercise.topic === topic).length, topic).toBeGreaterThan(25);
    }
  });

  it("garde des identifiants uniques dans tout le catalogue", () => {
    const ids = [...DIAGNOSTIC_QUESTIONS, ...EXERCISES].map((exercise) => exercise.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    expect(duplicates).toEqual([]);
  });

  it("rend chaque bonne réponse réellement atteignable dans l'interface", () => {
    const problems: string[] = [];
    for (const exercise of ENGLISH_BANK) {
      if (evaluateAnswer(exercise, exercise.answer).verdict !== "exact") problems.push(`${exercise.id} : réponse non exacte`);
      if (exercise.type === "multiple-choice" && !exercise.choices?.includes(exercise.answer)) problems.push(`${exercise.id} : réponse absente des choix`);
      if (exercise.type === "multiple-choice" && new Set(exercise.choices).size !== exercise.choices?.length) problems.push(`${exercise.id} : choix en double`);
      if (exercise.type === "word-bank") {
        const tiles = exercise.tiles!.map(normalizeAnswer);
        const missing = normalizeAnswer(exercise.answer).split(" ").filter((word) => !tiles.includes(word));
        if (missing.length) problems.push(`${exercise.id} : étiquettes manquantes ${missing.join(", ")}`);
      }
      if (exercise.type === "match-pairs" && new Set(exercise.pairs!.map((pair) => pair.native)).size !== exercise.pairs!.length) {
        problems.push(`${exercise.id} : traductions en double`);
      }
      if (exercise.type === "fill-gap" && exercise.topic === "phrasal-verbs" && !exercise.prompt.includes("___")) {
        problems.push(`${exercise.id} : verbe non remplacé par des blancs`);
      }
      if (!exercise.explanation.trim() || !exercise.hint.trim()) problems.push(`${exercise.id} : explication ou indice vide`);
    }
    expect(problems).toEqual([]);
  });

  it("propose des phrases de 5 à 14 mots sans ponctuation qui piégerait les étiquettes", () => {
    const sentences = ENGLISH_BANK.filter((exercise) => exercise.type === "word-bank");
    expect(sentences.length).toBeGreaterThan(50);
    for (const exercise of sentences) {
      const words = exercise.answer.split(/\s+/).length;
      expect(words, exercise.id).toBeGreaterThanOrEqual(5);
      expect(words, exercise.id).toBeLessThanOrEqual(14);
      expect(exercise.answer, exercise.id).not.toMatch(/["“”()\-–—:;]/u);
    }
  });
});
