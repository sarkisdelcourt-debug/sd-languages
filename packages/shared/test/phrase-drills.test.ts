import { describe, expect, it } from "vitest";
import { conceptsCovered, evaluateAnswer, normalizeAnswer } from "../src/learning.js";
import { findPhraseExercise, phraseCandidates, phraseExercise, PHRASES, PHRASE_SITUATIONS } from "../src/content/phrase-drills.js";

const LANGUAGES = ["en", "de", "es"] as const;

describe("phrases du quotidien : contenu", () => {
  it("couvre chaque langue avec des situations de 10 phrases, des ids uniques et des niveaux A1–B1", () => {
    for (const language of LANGUAGES) {
      const items = PHRASES[language];
      expect(items.length, language).toBeGreaterThanOrEqual(150);
      expect(new Set(items.map((item) => item.id)).size, `${language} : ids uniques`).toBe(items.length);
      expect(items.every((item) => item.id.startsWith(`${language}-ph-`)), language).toBe(true);
      expect(items.every((item) => ["A1", "A2", "B1"].includes(item.level)), language).toBe(true);
      const situations = new Set(PHRASE_SITUATIONS[language].map((situation) => situation.id));
      expect(items.every((item) => situations.has(item.situation)), `${language} : situation connue`).toBe(true);
      for (const situation of PHRASE_SITUATIONS[language]) expect(items.filter((item) => item.situation === situation.id).length, `${language}/${situation.id}`).toBeGreaterThanOrEqual(8);
    }
  });

  it("donne à chaque phrase 3 formulations ou plus, des concepts clés et une note", () => {
    const problems: string[] = [];
    for (const language of LANGUAGES) {
      for (const item of PHRASES[language]) {
        if (item.targets.length < 3) problems.push(`${item.id} : moins de 3 formulations`);
        if (new Set(item.targets.map(normalizeAnswer)).size !== item.targets.length) problems.push(`${item.id} : formulations en double`);
        if (item.keys.length < 1 || item.keys.some((group) => group.length === 0)) problems.push(`${item.id} : concepts clés manquants`);
        if (!item.fr.trim() || !item.note.trim()) problems.push(`${item.id} : texte vide`);
      }
    }
    expect(problems).toEqual([]);
  });

  it("fait passer la formulation principale par ses propres concepts clés, et le français par ses clés françaises", () => {
    const problems: string[] = [];
    for (const language of LANGUAGES) {
      for (const item of PHRASES[language]) {
        // Les formulations de la liste sont acceptées telles quelles ; la plus naturelle doit en plus passer ses propres clés.
        if (!conceptsCovered(normalizeAnswer(item.targets[0]!), item.keys)) problems.push(`${item.id} : « ${item.targets[0]} » ne passe pas ses clés`);
        if (item.frKeys) {
          for (const french of [item.fr, ...(item.frVariants ?? [])]) if (!conceptsCovered(normalizeAnswer(french), item.frKeys)) problems.push(`${item.id} : « ${french} » ne passe pas ses clés françaises`);
        }
      }
    }
    expect(problems).toEqual([]);
  });
});

describe("phrases du quotidien : exercices", () => {
  it("compte exacte chaque formulation prévue dans les deux sens", () => {
    for (const language of LANGUAGES) {
      for (const item of PHRASES[language]) {
        const toTarget = phraseExercise(language, item, "to-target");
        for (const target of item.targets) expect(evaluateAnswer(toTarget, target).correct, `${item.id} ← ${target}`).toBe(true);
        const toFrench = phraseExercise(language, item, "to-french");
        for (const french of [item.fr, ...(item.frVariants ?? [])]) expect(evaluateAnswer(toFrench, french).correct, `${item.id} ← ${french}`).toBe(true);
      }
    }
  });

  it("retrouve un exercice à partir de son identifiant, et seulement ceux-là", () => {
    for (const language of LANGUAGES) {
      for (const direction of ["to-target", "to-french", "mixed"] as const) {
        const drills = phraseCandidates(language, direction);
        expect(new Set(drills.map((drill) => drill.id)).size).toBe(drills.length);
        for (const drill of drills.slice(0, 40)) expect(findPhraseExercise(drill.id)?.answer, drill.id).toBe(drill.answer);
      }
    }
    expect(findPhraseExercise("ph~tf~inconnu")).toBeUndefined();
    expect(findPhraseExercise("vd~tf~c~x~y")).toBeUndefined();
  });

  it("ne révèle pas la réponse dans l'énoncé et compte juste une phrase imparfaite qui porte le message", () => {
    const item = PHRASES.en.find((candidate) => candidate.situation === "cafe")!;
    const exercise = phraseExercise("en", item, "to-target");
    expect(exercise.prompt).not.toContain(item.targets[0]!);
    const message = item.keys.map((group) => group[0]!.replace(/\*$/, "")).join(" ");
    const result = evaluateAnswer(exercise, message);
    expect(result.correct, message).toBe(true);
  });
});

import { applyPhraseFixes } from "../src/content/phrase-fixes.js";
import { DE_FIXES, EN_FIXES, ES_FIXES } from "../src/content/phrase-fix-data.js";
import { DE_PHRASES } from "../src/content/de/phrases.js";
import { EN_PHRASES } from "../src/content/en/phrases.js";
import { ES_PHRASES } from "../src/content/es/phrases.js";

describe("corrections de relecture des phrases", () => {
  it("modifient réellement chaque phrase visée (aucune opération sans effet)", () => {
    const raw = { en: EN_PHRASES, de: DE_PHRASES, es: ES_PHRASES };
    const fixes = { en: EN_FIXES, de: DE_FIXES, es: ES_FIXES };
    const idle: string[] = [];
    for (const language of LANGUAGES) {
      const fixed = applyPhraseFixes(raw[language], fixes[language]);
      for (const [id] of Object.entries(fixes[language])) {
        const before = raw[language].find((item) => item.id === id);
        const after = fixed.find((item) => item.id === id);
        if (!before) idle.push(`${id} : phrase introuvable`);
        else if (JSON.stringify(before) === JSON.stringify(after)) idle.push(`${id} : correction sans effet`);
      }
    }
    expect(idle).toEqual([]);
  });

  it("refuse, pour chaque phrase négative, la même phrase sans sa négation, dans les deux sens (03/11/2026)", () => {
    const NEG = /\b(isn't|aren't|don't|doesn't|didn't|can't|cannot|won't|couldn't|not|no|never|nicht|kein|keine|nie|nunca|nadie|nada|tampoco|ne|n'|pas|jamais|rien|personne)\b/i;
    const AUX: Record<string, string> = { "isn't": "is", "aren't": "are", "don't": "do", "doesn't": "does", "didn't": "did", "can't": "can", "cannot": "can", "won't": "will", "couldn't": "could" };
    const accepted: string[] = [];
    let negative = 0;
    for (const language of LANGUAGES) {
      for (const direction of ["to-target", "to-french"] as const) {
        for (const exercise of phraseCandidates(language, direction)) {
          // « ne … plus » privé de « ne » reste négatif en français (« il y a plus de lait ») : hors du balayage.
          if (!NEG.test(exercise.answer) || /\bplus\b/i.test(exercise.answer)) continue;
          negative += 1;
          const stripped = exercise.answer
            .replace(/\b(isn't|aren't|don't|doesn't|didn't|can't|cannot|won't|couldn't)\b/gi, (word) => AUX[word.toLowerCase()] ?? word)
            .replace(/\bn'/gi, "").replace(/\b(not|no|never|nicht|kein|keine|nie|nunca|nadie|nada|tampoco|ne|pas|jamais|rien|personne)\b\s?/gi, "")
            .replace(/\s+/g, " ").trim();
          if (evaluateAnswer(exercise, stripped).correct) accepted.push(`${exercise.id} : « ${stripped} »`);
        }
      }
    }
    expect(negative).toBeGreaterThan(100);
    expect(accepted).toEqual([]);
  });

  it("refuse une négation déplacée dans une autre proposition, et accepte les reformulations réelles (relecture du 03/11/2026)", () => {
    const find = (id: string) => { const [, direction, item] = id.split("~"); return phraseCandidates(item!.slice(0, 2) as "en", direction === "tf" ? "to-target" : "to-french").find((exercise) => exercise.id === id)!; };
    const cases: Array<[string, string, boolean]> = [
      ["ph~tf~en-ph-understand-001", "Sorry, I don't get it", true],
      ["ph~tf~en-ph-understand-001", "I understand, don't worry", false],
      ["ph~tf~en-ph-understand-001", "Don't worry, I understand", false],
      ["ph~tf~en-ph-kitchen-005", "I eat fish but I don't eat meat", true],
      ["ph~tf~en-ph-kitchen-005", "I don't eat fish, but I eat meat", false],
      ["ph~tf~en-ph-health-005", "I am stressed at work and I cannot sleep properly", true],
      ["ph~tf~en-ph-phone-002", "Could you speak up, I can't hear you very well", true],
      ["ph~tf~en-ph-hotel-005", "The air conditioning in my room doesn't work", true],
      ["ph~tf~en-ph-hotel-005", "The air conditioning is working in my room", false],
      ["ph~tf~en-ph-hotel-005", "The air conditioning in my room is not broken", false],
      ["ph~tf~de-ph-leisure-011", "Ich spiele lieber Tennis, Fußball mag ich nicht so gern", true],
      ["ph~tf~de-ph-leisure-011", "Ich mag Fußball, ich spiele nicht lieber Tennis", false],
      ["ph~tf~de-ph-compr-003", "Ich verstehe das nicht", true],
      ["ph~tf~de-ph-compr-003", "Kein Problem, ich verstehe", false],
      ["ph~tf~es-ph-work-009", "Está enfermo, mi compañero no está hoy", true],
      ["ph~tf~es-ph-work-009", "Mi compañero está hoy, no está enfermo", false],
      ["ph~tf~es-ph-work-009", "Mi compañero está hoy, está enfermo", false],
      ["ph~tf~es-ph-understand-001", "No lo entiendo", true],
      ["ph~tf~es-ph-understand-001", "No te preocupes, entiendo", false],
      ["ph~ff~en-ph-understand-001", "Je comprends pas", true],
      ["ph~ff~en-ph-understand-001", "Pas de souci, je comprends", false],
      ["ph~ff~en-ph-friends-006", "Désolé, je peux pas venir, je suis occupé", true],
      ["ph~ff~en-ph-hotel-005", "La clim fonctionne pas dans ma chambre", true],
      ["ph~ff~de-ph-cuisine-004", "Je mange pas de porc", true],
      ["ph~ff~es-ph-understand-012", "Je sais pas comment on dit ça en espagnol", true]
    ];
    const wrong = cases.filter(([id, text, expected]) => evaluateAnswer(find(id), text).correct !== expected).map(([id, text]) => `${id} « ${text} »`);
    expect(wrong).toEqual([]);
  });

  it("ne laisse passer ni un sens contraire ni un mot voisin", () => {
    const answer = (id: string, text: string, direction: "to-target" | "to-french" = "to-target") => {
      const item = PHRASES[id.slice(0, 2) as "en" | "de" | "es"].find((candidate) => candidate.id === id)!;
      return evaluateAnswer(phraseExercise(id.slice(0, 2) as "en" | "de" | "es", item, direction), text).correct;
    };
    expect(answer("en-ph-greet-004", "Can I help you?")).toBe(false);
    expect(answer("en-ph-shops-001", "What is your name?")).toBe(false);
    expect(answer("es-ph-directions-005", "Vaya a la derecha")).toBe(false);
    expect(answer("de-ph-cafe-006", "Ich esse gern Fleisch.")).toBe(false);
    expect(answer("de-ph-intro-001", "Ich heisse Marc.")).toBe(true);
    expect(answer("es-ph-understand-001", "Entendí")).toBe(false);
    expect(answer("es-ph-understand-001", "No entendí")).toBe(true);
    expect(answer("de-ph-weather-009", "Es ist halb 9 Uhr, wie spät?")).toBe(true);
  });
});
