import { describe, expect, it } from "vitest";
import { ENGLISH_BANK } from "../src/content/en/index.js";
import { expandContractions } from "../src/content/generators.js";
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

describe("correcteur tolérant (21/10/2026)", () => {
  const listening = (id: string) => ENGLISH_BANK.find((exercise) => exercise.id === id)!;

  it("accepte « I would like » à la place de « I'd like »", () => {
    expect(evaluateAnswer(listening("en-day-s-010-listen"), "I would like to make an appointment for next week.").correct).toBe(true);
  });

  it("accepte « 10 minutes » à la place de « ten minutes »", () => {
    expect(evaluateAnswer(listening("en-day-s-009-listen"), "Can I call you back in 10 minutes?").correct).toBe(true);
  });

  it("accepte « the bill » (UK) à la place de « the check » (US)", () => {
    expect(evaluateAnswer(listening("en-trv-s-010-listen"), "Could we have the bill, please?").correct).toBe(true);
  });

  it("accepte « I'd ask » à la place de « I would ask »", () => {
    expect(evaluateAnswer(listening("en-day-s-050-listen"), "If I were you, I'd ask for a second opinion.").correct).toBe(true);
  });

  it("accepte pour chaque dictée la variante aux contractions développées", () => {
    const problems: string[] = [];
    for (const exercise of ENGLISH_BANK.filter((item) => item.type === "listening")) {
      const expanded = expandContractions(exercise.answer);
      if (expanded !== exercise.answer && !evaluateAnswer(exercise, expanded).correct) problems.push(`${exercise.id} : « ${expanded} »`);
    }
    expect(problems).toEqual([]);
  });

  it("tolère tiret ou espace, « 3pm » / « 3 p.m. » et « o clock » dans la normalisation", () => {
    expect(normalizeAnswer("half-life")).toBe(normalizeAnswer("half life"));
    expect(normalizeAnswer("at 3pm")).toBe(normalizeAnswer("at 3 p.m."));
    expect(normalizeAnswer("at 3 o clock")).toBe(normalizeAnswer("at 3 o'clock"));
  });

  it("accepte les formulations ajoutées au tronc commun", () => {
    const find = (id: string) => EXERCISES.find((exercise) => exercise.id === id)!;
    expect(evaluateAnswer(find("en-a2-translation-routine"), "I usually take the bus to go to work.").correct).toBe(true);
    expect(evaluateAnswer(find("en-b1-translation-report-deadline"), "Could you send me the report before Friday?").correct).toBe(true);
    expect(evaluateAnswer(find("en-b1-translation-advice"), "You should talk to him before you decide.").correct).toBe(true);
    expect(evaluateAnswer(find("en-b1-translation-doctor-appointment"), "I have a doctor's appointment at 3 pm.").correct).toBe(true);
    expect(evaluateAnswer(find("en-b1-translation-doctor-appointment"), "I have a doctor's appointment at 3 o'clock.").correct).toBe(true);
    expect(evaluateAnswer(find("de-b1-translation-because"), "Ich bleibe zuhause, weil es regnet.").correct).toBe(true);
    expect(evaluateAnswer(find("de-a2-translation-order"), "Morgen gehe ich zum Markt.").correct).toBe(true);
    expect(evaluateAnswer(find("en-hw-g-065"), "Do you know where the chemist's is?").correct).toBe(true);
    expect(evaluateAnswer(find("en-hw-g-023"), "had better").correct).toBe(true);
  });
});
