import { describe, expect, it } from "vitest";
import { EXERCISES } from "../src/curriculum.js";
import { GUIDED_LESSONS, RETIRED_LESSON_REVISIONS } from "../src/lessons.js";
import type { Exercise } from "../src/types.js";

const exercise = (id: string) => {
  const found = EXERCISES.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`Exercice ${id} introuvable`);
  return found;
};
const searchableText = (item: Exercise) => [
  item.id, item.prompt, item.answer, item.focus, item.audioText ?? "",
  ...(item.pairs ?? []).flatMap((pair) => [pair.target, pair.native]),
  ...(item.choices ?? [])
].join(" ").toLocaleLowerCase();

describe.each(["de", "es"] as const)("leçons guidées %s reliées aux nouvelles banques", (language) => {
  const lessons = GUIDED_LESSONS.filter((lesson) => lesson.language === language);

  it("donne six exercices distincts de la bonne langue à chaque leçon", () => {
    expect(lessons).toHaveLength(12);
    for (const lesson of lessons) {
      expect(lesson.exerciseIds, lesson.id).toHaveLength(6);
      expect(new Set(lesson.exerciseIds).size, lesson.id).toBe(6);
      expect(lesson.exerciseIds.every((id) => exercise(id).language === language), lesson.id).toBe(true);
    }
  });

  it("reste au niveau exact de la leçon et n'emploie aucun exercice dans deux leçons", () => {
    const owners = new Map<string, string[]>();
    for (const lesson of lessons) {
      for (const id of lesson.exerciseIds) {
        expect(exercise(id).level, `${lesson.id} → ${id}`).toBe(lesson.level);
        owners.set(id, [...(owners.get(id) ?? []), lesson.id]);
      }
    }
    expect([...owners.entries()].filter(([, owning]) => owning.length > 1)).toEqual([]);
  });

  it("varie les formats dans chaque leçon (au moins trois)", () => {
    for (const lesson of lessons) {
      expect(new Set(lesson.exerciseIds.map((id) => exercise(id).type)).size, lesson.id).toBeGreaterThanOrEqual(3);
    }
  });

  it("vérifie que chaque exercice porte un mot-clé de l'objectif de sa leçon", () => {
    const offTopic: string[] = [];
    for (const lesson of lessons) {
      if (!lesson.relevance) continue;
      const keywords = lesson.relevance.keywords.map((keyword) => keyword.toLocaleLowerCase());
      for (const id of lesson.exerciseIds) {
        if (!keywords.some((keyword) => ` ${searchableText(exercise(id))} `.includes(keyword))) offTopic.push(`${lesson.id} → ${id}`);
      }
    }
    expect(offTopic).toEqual([]);
  });

  it("garde la révision précédente lisible pour une séance déjà commencée", () => {
    for (const lesson of lessons.filter((candidate) => candidate.revision >= 2)) {
      const retired = RETIRED_LESSON_REVISIONS.filter((candidate) => candidate.id === lesson.id);
      expect(retired.length, lesson.id).toBeGreaterThan(0);
      expect(retired.every((candidate) => candidate.revision < lesson.revision), lesson.id).toBe(true);
    }
  });
});

describe("allemand A1 rédigé", () => {
  it("fournit au moins quinze exercices A1 allemands aux ids uniques", () => {
    const a1 = EXERCISES.filter((item) => item.language === "de" && item.level === "A1");
    expect(a1.length).toBeGreaterThanOrEqual(18);
    expect(new Set(a1.map((item) => item.id)).size).toBe(a1.length);
  });
});
