import { describe, expect, it } from "vitest";
import { EXERCISES } from "../src/curriculum.js";
import { GUIDED_LESSONS, RETIRED_LESSON_REVISIONS } from "../src/lessons.js";
import type { CefrLevel } from "../src/types.js";

const rank: Record<CefrLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };
const english = GUIDED_LESSONS.filter((lesson) => lesson.language === "en");
const exercise = (id: string) => EXERCISES.find((candidate) => candidate.id === id)!;

describe("leçons guidées anglaises, révision 2", () => {
  it("donne à chacune des 12 leçons six exercices dont quatre propres, sur quatre formats", () => {
    expect(english).toHaveLength(12);
    const usage = new Map<string, number>();
    for (const lesson of GUIDED_LESSONS) for (const id of lesson.exerciseIds) usage.set(id, (usage.get(id) ?? 0) + 1);
    for (const lesson of english) {
      expect(lesson.revision, lesson.id).toBe(2);
      expect(lesson.exerciseIds, lesson.id).toHaveLength(6);
      expect(new Set(lesson.exerciseIds).size, lesson.id).toBe(6);
      expect(lesson.exerciseIds.every((id) => exercise(id)?.language === "en"), lesson.id).toBe(true);
      expect(lesson.exerciseIds.filter((id) => usage.get(id) === 1).length, lesson.id).toBeGreaterThanOrEqual(4);
      expect(new Set(lesson.exerciseIds.map((id) => exercise(id).type)).size, lesson.id).toBeGreaterThanOrEqual(4);
    }
  });

  it("reste au niveau de la leçon, à un cran près", () => {
    for (const lesson of english) {
      for (const id of lesson.exerciseIds) {
        expect(Math.abs(rank[exercise(id).level] - rank[lesson.level]), `${lesson.id} → ${id}`).toBeLessThanOrEqual(1);
      }
    }
  });

  it("garde la révision 1 de « Faire un point projet clair » pour la séance déjà commencée", () => {
    const retired = RETIRED_LESSON_REVISIONS.find((lesson) => lesson.id === "lesson-en-project-update");
    expect(retired?.revision).toBe(1);
    expect(retired?.exerciseIds).toEqual(["en-b1-gap-since", "en-b1-translation-report-deadline"]);
  });
});
