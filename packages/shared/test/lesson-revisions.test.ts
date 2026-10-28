import { describe, expect, it } from "vitest";
import { EXERCISES } from "../src/curriculum.js";
import { GUIDED_LESSONS, RETIRED_LESSON_REVISIONS } from "../src/lessons.js";

/**
 * Révisions du 28/10/2026 (audit indépendant) : des leçons proposaient la construction ET la dictée de
 * la même phrase. Chaque correction est une nouvelle révision ; la révision précédente ne change pas.
 * Ce tableau fige la révision remplacée de chaque leçon corrigée : il ne doit jamais être modifié.
 */
const REPLACED_REVISIONS: Record<string, { revision: number; exerciseIds: string[] }> = {
  "lesson-en-daily-basics": { revision: 3, exerciseIds: ["en-hw-a1-cafe-pairs", "en-hw-a1-cafe-build", "en-hw-a1-cafe-listen", "en-hw-a1-cafe-mcq-here", "en-hw-a1-cafe-gap-have", "en-hw-a1-cafe-translation"] },
  "lesson-de-daily-basics": { revision: 2, exerciseIds: ["de-hw-a1-shop-pairs", "de-hw-a1-shop-build", "de-hw-a1-shop-listen", "de-hw-a1-shop-mcq-price", "de-hw-a1-shop-gap-nehmen", "de-hw-a1-shop-translation"] },
  "lesson-de-train-ticket": { revision: 2, exerciseIds: ["de-s-002-build", "de-s-002-listen", "de-v-station-pairs-1", "de-hw-g-006", "de-s-016-build", "de-s-016-listen"] },
  "lesson-de-explain-organise": { revision: 2, exerciseIds: ["de-s-067-build", "de-s-067-listen", "de-v-work-pairs-1", "de-s-050-build", "de-s-050-listen", "de-hw-g-025"] },
  "lesson-de-handle-disruption": { revision: 2, exerciseIds: ["de-hw-g-059", "de-s-076-build", "de-s-076-listen", "de-hw-g-053", "de-b2-gap-konjunktiv", "de-hw-g-051"] },
  "lesson-es-new-neighbour": { revision: 2, exerciseIds: ["es-a2-translation-location", "es-s-057-build", "es-s-057-listen", "es-hw-g-027", "es-hw-g-028", "es-s-067-build"] },
  "lesson-es-experience-work": { revision: 2, exerciseIds: ["es-b1-translation-duration", "es-s-081-build", "es-s-081-listen", "es-v-travail-bureau-pairs-1", "es-s-088-build", "es-s-088-listen"] },
  "lesson-es-negotiate-conditions": { revision: 2, exerciseIds: ["es-hw-b2-nego-pairs", "es-hw-b2-nego-build", "es-hw-b2-nego-listen", "es-hw-b2-nego-mcq-siempre", "es-hw-b2-nego-gap-conditional", "es-hw-b2-nego-translation"] },
  "lesson-en-ask-and-clarify": { revision: 3, exerciseIds: ["en-a1-mcq-airport-gate", "en-hw-a1-ask-build", "en-hw-a1-ask-listen", "en-hw-a1-ask-gap-am", "en-hw-a1-ask-translation", "en-hw-a1-ask-pairs"] },
  "lesson-en-count-and-describe": { revision: 3, exerciseIds: ["en-a1-mcq-have", "en-a1-gap-plural", "en-hw-a1-family-pairs", "en-hw-a1-family-build", "en-hw-a1-family-listen", "en-hw-a1-family-translation"] },
  "lesson-en-compare-options": { revision: 3, exerciseIds: ["en-a2-mcq-comparative", "en-a2-gap-grocery-any", "en-hw-a2-compare-build", "en-hw-a2-compare-listen", "en-hw-a2-compare-pairs", "en-hw-a2-compare-translation"] },
  "lesson-en-explain-availability": { revision: 3, exerciseIds: ["en-b1-translation-doctor-appointment", "en-day-s-041-listen", "en-day-s-029-build", "en-hw-g-020", "en-hw-g-018", "en-med-v-hospital-pairs-2"] },
  "lesson-de-check-in-politely": { revision: 2, exerciseIds: ["de-hw-a1-hotel-pairs", "de-hw-a1-hotel-build", "de-hw-a1-hotel-listen", "de-a1-mcq-hotel-key", "de-hw-a1-hotel-mcq-name", "de-hw-a1-hotel-translation"] },
  "lesson-de-build-basic-sentences": { revision: 2, exerciseIds: ["de-hw-a1-daily-pairs", "de-hw-a1-daily-build", "de-hw-a1-daily-listen", "de-a1-mcq-present", "de-hw-a1-daily-gap-haben", "de-hw-a1-daily-translation"] },
  "lesson-de-plan-a-trip": { revision: 2, exerciseIds: ["de-hw-g-009", "de-s-013-build", "de-s-013-listen", "de-s-001-build", "de-s-001-listen", "de-a2-translation-order"] },
  "lesson-de-pay-and-confirm": { revision: 2, exerciseIds: ["de-a2-gap-shopping-dative", "de-s-018-build", "de-s-018-listen", "de-hw-g-003", "de-v-shopping-pairs-3", "de-s-023-build"] },
  "lesson-de-explain-a-delay": { revision: 2, exerciseIds: ["de-s-039-build", "de-s-039-listen", "de-b1-translation-meeting-delay", "de-hw-g-024", "de-s-074-build", "de-s-074-listen"] },
  "lesson-de-explain-health-absence": { revision: 2, exerciseIds: ["de-s-058-build", "de-s-058-listen", "de-b1-translation-pharmacy", "de-v-nuclear-die-untersuchung", "de-v-nuclear-pairs-1", "de-s-036-build"] },
  "lesson-de-propose-an-alternative": { revision: 2, exerciseIds: ["de-hw-g-054", "de-s-089-build", "de-s-089-listen", "de-hw-g-052", "de-hw-g-060", "de-s-077-build"] },
  "lesson-de-clarify-a-disruption": { revision: 2, exerciseIds: ["de-b2-mcq-relative", "de-hw-g-055", "de-s-079-build", "de-s-079-listen", "de-s-087-build", "de-s-087-listen"] },
  "lesson-es-order-a-meal": { revision: 2, exerciseIds: ["es-s-073-listen", "es-s-073-build", "es-a2-gap-market-quantity", "es-s-051-listen", "es-a2-mcq-object", "es-s-051-build"] },
  "lesson-es-find-and-identify": { revision: 2, exerciseIds: ["es-s-067-listen", "es-s-052-build", "es-s-052-listen", "es-s-056-build", "es-hw-g-030", "es-hw-g-031"] },
  "lesson-es-tell-career-story": { revision: 2, exerciseIds: ["es-s-077-build", "es-s-077-listen", "es-s-079-build", "es-s-079-listen", "es-b1-gap-imperfect", "es-hw-g-053"] },
  "lesson-es-explain-health-availability": { revision: 2, exerciseIds: ["es-b1-translation-work-schedule", "es-s-087-build", "es-s-087-listen", "es-b1-translation-doctor", "es-s-084-build", "es-s-084-listen"] },
  "lesson-es-find-a-collaborator": { revision: 2, exerciseIds: ["es-hw-b2-profile-pairs", "es-hw-b2-profile-build", "es-hw-b2-profile-listen", "es-b2-mcq-subjunctive", "es-hw-b2-profile-gap-saber", "es-hw-b2-profile-translation"] },
  "lesson-es-explain-a-missed-deadline": { revision: 2, exerciseIds: ["es-hw-b2-late-build", "es-hw-b2-late-listen", "es-hw-b2-late-translation", "es-hw-b2-late-mcq-meeting", "es-b2-gap-pluperfect", "es-b2-mcq-flight-counterfactual"] }

};

const exercise = (id: string) => {
  const found = EXERCISES.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`Exercice ${id} introuvable`);
  return found;
};

describe("une leçon courante ne propose jamais construire ET écouter la même phrase", () => {
  it("n'a, dans aucune leçon, deux exercices -build et -listen de même identifiant de base", () => {
    const duplicates = GUIDED_LESSONS.flatMap((lesson) => lesson.exerciseIds
      .filter((id) => id.endsWith("-build") && lesson.exerciseIds.includes(id.replace(/-build$/, "-listen")))
      .map((id) => `${lesson.id} → ${id.replace(/-build$/, "")}`));
    expect(duplicates).toEqual([]);
  });

  it("n'a pas deux exercices de formats construire/écouter qui portent le même texte", () => {
    const duplicates = GUIDED_LESSONS.flatMap((lesson) => {
      const built = new Set(lesson.exerciseIds.map(exercise).filter((item) => item.type === "word-bank").map((item) => item.answer));
      return lesson.exerciseIds.map(exercise).filter((item) => item.type === "listening" && built.has(item.answer)).map((item) => `${lesson.id} → ${item.id}`);
    });
    expect(duplicates).toEqual([]);
  });
});

describe("révisions retirées des leçons guidées", () => {
  it("garde chaque révision retirée intacte et jouable (exercices existants, même langue, même niveau)", () => {
    for (const retired of RETIRED_LESSON_REVISIONS) {
      const current = GUIDED_LESSONS.find((lesson) => lesson.id === retired.id)!;
      expect(current, retired.id).toBeDefined();
      expect(retired.revision, retired.id).toBeLessThan(current.revision);
      expect(new Set(retired.exerciseIds).size, `${retired.id} r${retired.revision}`).toBe(retired.exerciseIds.length);
      for (const id of retired.exerciseIds) {
        expect(exercise(id).language, `${retired.id} r${retired.revision} → ${id}`).toBe(retired.language);
      }
    }
  });

  it("numérote les révisions de chaque leçon sans trou, de 1 à la révision courante", () => {
    for (const lesson of GUIDED_LESSONS) {
      const retired = RETIRED_LESSON_REVISIONS.filter((candidate) => candidate.id === lesson.id).map((candidate) => candidate.revision).sort((a, b) => a - b);
      expect(retired, lesson.id).toEqual(Array.from({ length: lesson.revision - 1 }, (_, index) => index + 1));
    }
  });

  it("garde exactement les exercices de la révision remplacée par la correction du 28/10/2026", () => {
    for (const [id, expected] of Object.entries(REPLACED_REVISIONS)) {
      const current = GUIDED_LESSONS.find((lesson) => lesson.id === id)!;
      const retired = RETIRED_LESSON_REVISIONS.find((lesson) => lesson.id === id && lesson.revision === expected.revision)!;
      expect(retired, id).toBeDefined();
      expect(retired.exerciseIds, id).toEqual(expected.exerciseIds);
      expect(current.revision, id).toBe(expected.revision + 1);
      // La correction remplace un ou deux exercices, jamais plus, et garde les six emplacements.
      const kept = current.exerciseIds.filter((exerciseId) => expected.exerciseIds.includes(exerciseId));
      expect(current.exerciseIds, id).toHaveLength(6);
      expect(kept.length, id).toBeGreaterThanOrEqual(4);
      expect(current.exerciseIds.map((exerciseId) => exercise(exerciseId).level).every((level) => level === current.level), id).toBe(true);
      expect(new Set(current.exerciseIds.map((exerciseId) => exercise(exerciseId).type)).size, id).toBeGreaterThanOrEqual(4);
    }
  });

  it("garde le micro-cours, le scénario et la durée d'une leçon corrigée", () => {
    for (const id of Object.keys(REPLACED_REVISIONS)) {
      const current = GUIDED_LESSONS.find((lesson) => lesson.id === id)!;
      const retired = RETIRED_LESSON_REVISIONS.filter((lesson) => lesson.id === id).at(-1)!;
      expect(current.microCourse, id).toEqual(retired.microCourse);
      expect(current.scenarioId, id).toBe(retired.scenarioId);
      expect(current.estimatedMinutes, id).toBe(retired.estimatedMinutes);
    }
  });
});
