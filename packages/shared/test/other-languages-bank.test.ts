import { describe, expect, it } from "vitest";
import { DIAGNOSTIC_QUESTIONS, EXERCISES } from "../src/curriculum.js";
import { evaluateAnswer, normalizeAnswer } from "../src/learning.js";

describe.each(["es", "de"] as const)("banque %s (22/10/2026)", (language) => {
  const bank = EXERCISES.filter((exercise) => exercise.language === language && exercise.topic !== undefined);

  it("compte au moins 300 exercices répartis sur plusieurs formats, thèmes et niveaux", () => {
    expect(EXERCISES.filter((exercise) => exercise.language === language).length).toBeGreaterThanOrEqual(300);
    expect(new Set(bank.map((exercise) => exercise.type)).size).toBeGreaterThanOrEqual(5);
    expect(new Set(bank.map((exercise) => exercise.level)).size).toBeGreaterThanOrEqual(3);
  });

  it("garde des identifiants uniques et rend chaque bonne réponse atteignable", () => {
    const ids = [...DIAGNOSTIC_QUESTIONS, ...EXERCISES].map((exercise) => exercise.id);
    expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([]);
    const problems: string[] = [];
    for (const exercise of bank) {
      if (evaluateAnswer(exercise, exercise.answer).verdict !== "exact") problems.push(`${exercise.id} : réponse non exacte`);
      if (exercise.type === "multiple-choice" && (!exercise.choices?.includes(exercise.answer) || new Set(exercise.choices).size !== exercise.choices.length)) problems.push(`${exercise.id} : choix invalides`);
      if (exercise.type === "word-bank") {
        const tiles = exercise.tiles!.map(normalizeAnswer);
        const missing = normalizeAnswer(exercise.answer).split(" ").filter((word) => !tiles.includes(word));
        if (missing.length) problems.push(`${exercise.id} : étiquettes manquantes ${missing.join(", ")}`);
      }
      if (exercise.type === "match-pairs" && new Set(exercise.pairs!.map((pair) => pair.native)).size !== exercise.pairs!.length) problems.push(`${exercise.id} : traductions en double`);
      if (!exercise.explanation.trim() || !exercise.hint.trim()) problems.push(`${exercise.id} : explication ou indice vide`);
    }
    expect(problems).toEqual([]);
  });

  it("ne mélange aucune autre langue dans les consignes d'écoute et de construction", () => {
    for (const exercise of bank.filter((item) => item.type === "listening")) expect(exercise.audioText, exercise.id).toBe(exercise.answer);
  });
});
