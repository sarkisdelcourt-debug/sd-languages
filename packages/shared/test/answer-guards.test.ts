import { describe, expect, it } from "vitest";
import { conceptsCovered, evaluateAnswer, normalizeAnswer } from "../src/learning.js";
import type { Exercise } from "../src/types.js";

/** Garde-fous du correcteur ajoutés après l'audit du 10/11/2026 : nombres, jours relatifs, fautes de frappe, « sans plomb ». */
const phrase = (answer: string, understandable: string[][], extra: Partial<Exercise> = {}): Exercise => ({
  id: "t", language: "es", level: "A2", topic: "everyday", type: "translation", prompt: "Dites : x", answer, understandable,
  explanation: "x", hint: "x", focus: "x", skillTags: [], ...extra
} as Exercise);

describe("nombres et jours relatifs dans une réponse « comprise »", () => {
  const sixty = phrase("Mon père a soixante-dix ans.", [["pere"], ["soixante dix", "70"], ["ans"]], { language: "es" });

  it("refuse un autre nombre que ceux prévus", () => {
    expect(evaluateAnswer(sixty, "Mon père a soixante-quinze ans").correct).toBe(false);
    expect(evaluateAnswer(sixty, "Mon père a 70 ans").correct).toBe(true);
  });

  it("lit « 10h30 » comme « dix et demie », mais pas comme « dix »", () => {
    const ten = phrase("A las diez.", [["diez", "10"]]);
    expect(evaluateAnswer(ten, "10:30 diez").correct).toBe(false);
    const half = phrase("A las diez y media.", [["diez", "10"], ["media", "30"]]);
    expect(evaluateAnswer(half, "diez 10:30").correct).toBe(true);
  });

  it("refuse « pasado mañana » quand seul « mañana » est prévu", () => {
    const tomorrow = phrase("Nos vemos mañana.", [["vemos", "ver*"], ["manana"]]);
    expect(evaluateAnswer(tomorrow, "Nos vemos pasado mañana").correct).toBe(false);
    expect(evaluateAnswer(tomorrow, "Nos vemos mañana, vale").correct).toBe(true);
  });
});

describe("tolérance aux fautes de frappe", () => {
  it("ne confond plus deux mots qui diffèrent au début ou par leur seule dernière lettre", () => {
    expect(conceptsCovered(normalizeAnswer("ich moechte mich abmelden"), [["anmelden"]])).toBe(false);
    expect(conceptsCovered(normalizeAnswer("taxameter abschalten"), [["anschalten"]])).toBe(false);
    expect(conceptsCovered(normalizeAnswer("ich verstehe"), [["verstehen"]])).toBe(false);
  });

  it("tolère toujours une vraie faute de frappe, un pluriel ou une conjugaison", () => {
    expect(conceptsCovered(normalizeAnswer("tous les dimanches"), [["dimanche"]])).toBe(true);
    expect(conceptsCovered(normalizeAnswer("je termine ce rapport"), [["terminer"]])).toBe(true);
    expect(conceptsCovered(normalizeAnswer("restaurnt"), [["restaurant"]])).toBe(true);
  });
});

describe("« sans plomb » n'est pas une négation", () => {
  it("compte « sans plomb » dans une réponse sans négation", () => {
    const fuel = phrase("Je veux de l'essence sans plomb.", [["essence"], ["sans plomb"]], { language: "es" });
    expect(evaluateAnswer(fuel, "Je voudrais de l'essence sans plomb").correct).toBe(true);
  });
});
