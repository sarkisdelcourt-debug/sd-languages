import { describe, expect, it } from "vitest";
import { EXERCISES } from "../src/curriculum.js";
import { GUIDED_LESSONS, RETIRED_LESSON_REVISIONS } from "../src/lessons.js";
import { CONVERSATION_SCENARIOS } from "../src/scenarios.js";
import type { Exercise } from "../src/types.js";

const english = GUIDED_LESSONS.filter((lesson) => lesson.language === "en");
const exercise = (id: string) => {
  const found = EXERCISES.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`Exercice ${id} introuvable`);
  return found;
};

/** Texte sur lequel la pertinence est vérifiée : id, consigne, réponse, point central, paires, choix. */
function searchableText(item: Exercise): string {
  return [
    item.id, item.prompt, item.answer, item.focus, item.audioText ?? "",
    ...(item.pairs ?? []).flatMap((pair) => [pair.target, pair.native]),
    ...(item.choices ?? [])
  ].join(" ").toLocaleLowerCase("en");
}

describe("leçons guidées anglaises, révision 3 (22/10/2026)", () => {
  it("donne à chacune des 12 leçons six exercices anglais distincts, sur au moins quatre formats", () => {
    expect(english).toHaveLength(12);
    for (const lesson of english) {
      expect(lesson.revision, lesson.id).toBe(3);
      expect(lesson.exerciseIds, lesson.id).toHaveLength(6);
      expect(new Set(lesson.exerciseIds).size, lesson.id).toBe(6);
      expect(lesson.exerciseIds.every((id) => exercise(id).language === "en"), lesson.id).toBe(true);
      expect(new Set(lesson.exerciseIds.map((id) => exercise(id).type)).size, lesson.id).toBeGreaterThanOrEqual(4);
      expect(CONVERSATION_SCENARIOS.some((scenario) => scenario.id === lesson.scenarioId && scenario.language === "en"), lesson.id).toBe(true);
    }
  });

  it("n'emploie jamais le même exercice dans deux leçons anglaises, ni dans une leçon d'une autre langue", () => {
    const owners = new Map<string, string[]>();
    for (const lesson of english) {
      for (const id of lesson.exerciseIds) owners.set(id, [...(owners.get(id) ?? []), lesson.id]);
    }
    const shared = [...owners.entries()].filter(([, lessons]) => lessons.length > 1);
    expect(shared).toEqual([]);
    const elsewhere = GUIDED_LESSONS.filter((lesson) => lesson.language !== "en").flatMap((lesson) => lesson.exerciseIds.filter((id) => owners.has(id)));
    expect(elsewhere).toEqual([]);
  });

  it("reste strictement au niveau de la leçon (une leçon A1 ne contient que des exercices A1)", () => {
    const mismatches = english.flatMap((lesson) => lesson.exerciseIds
      .filter((id) => exercise(id).level !== lesson.level)
      .map((id) => `${lesson.id} (${lesson.level}) → ${id} (${exercise(id).level})`));
    expect(mismatches).toEqual([]);
  });

  it("vérifie pour chaque leçon que chaque exercice porte un mot-clé ou un thème de son objectif", () => {
    const offTopic: string[] = [];
    for (const lesson of english) {
      expect(lesson.relevance?.keywords.length, lesson.id).toBeGreaterThan(0);
      const keywords = lesson.relevance!.keywords.map((keyword) => keyword.toLocaleLowerCase("en"));
      const topics = lesson.relevance!.topics ?? [];
      for (const id of lesson.exerciseIds) {
        const item = exercise(id);
        const text = ` ${searchableText(item)} `;
        const relevant = keywords.some((keyword) => text.includes(keyword)) || (item.topic !== undefined && topics.includes(item.topic));
        if (!relevant) offTopic.push(`${lesson.id} → ${id}`);
      }
    }
    expect(offTopic).toEqual([]);
  });

  it("écarte les choix de la révision 2 signalés hors objectif", () => {
    const byId = Object.fromEntries(english.map((lesson) => [lesson.id, lesson.exerciseIds]));
    expect(byId["lesson-en-daily-basics"]).not.toContain("en-trv-s-007-build");
    expect(byId["lesson-en-count-and-describe"]).not.toContain("en-trv-s-026-build");
    expect(byId["lesson-en-explain-availability"]).not.toContain("en-hw-g-004");
    expect(byId["lesson-en-project-update"]).not.toContain("en-day-s-018-listen");
  });

  it("garde les révisions 1 et 2 de « Faire un point projet clair » pour une séance déjà commencée", () => {
    const retired = RETIRED_LESSON_REVISIONS.filter((lesson) => lesson.id === "lesson-en-project-update");
    expect(retired.map((lesson) => lesson.revision)).toEqual([1, 2]);
    expect(retired[0]?.exerciseIds).toEqual(["en-b1-gap-since", "en-b1-translation-report-deadline"]);
    expect(retired[1]?.exerciseIds).toEqual(["en-hw-g-001", "en-b1-gap-since", "en-day-s-031-build", "en-hw-g-007", "en-day-s-018-listen", "en-b1-translation-report-deadline"]);
    // Le micro-cours et le scénario de la révision 1 restent ceux de la révision courante.
    const current = english.find((lesson) => lesson.id === "lesson-en-project-update")!;
    expect(current.microCourse).toEqual(retired[0]!.microCourse);
    expect(current.scenarioId).toBe("en-work-project-update");
    // Chaque révision retirée reste jouable : tous ses exercices existent encore.
    for (const lesson of RETIRED_LESSON_REVISIONS) for (const id of lesson.exerciseIds) expect(exercise(id).id, `${lesson.id} r${lesson.revision}`).toBe(id);
  });
});
