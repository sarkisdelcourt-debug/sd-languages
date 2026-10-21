import { describe, expect, it } from "vitest";
import { DIAGNOSTIC_QUESTIONS, EXERCISES } from "../src/curriculum.js";
import { deduceSentenceSkills } from "../src/content/generators.js";
import { SKILLS, skillIds } from "../src/skills.js";

/** Thèmes des « Exercices ciblés » qui doivent avoir une série par thème depuis « Mes acquis ». */
const TOPICS_WITH_SKILL = ["medical", "everyday", "travel", "phrasal-verbs", "false-friends", "irregular-verbs"] as const;

describe("liste fermée des compétences (22/10/2026)", () => {
  it("définit 15 à 25 compétences par langue, avec un libellé français et un identifiant unique", () => {
    for (const language of ["en", "de", "es"] as const) {
      const skills = SKILLS[language];
      expect(skills.length, language).toBeGreaterThanOrEqual(15);
      expect(skills.length, language).toBeLessThanOrEqual(25);
      expect(new Set(skills.map((skill) => skill.id)).size, language).toBe(skills.length);
      for (const skill of skills) expect(skill.label.trim().length, skill.id).toBeGreaterThan(3);
    }
  });

  it("étiquette chaque exercice et chaque question de diagnostic avec des compétences de sa propre langue", () => {
    const problems: string[] = [];
    for (const exercise of [...EXERCISES, ...DIAGNOSTIC_QUESTIONS]) {
      const tags = exercise.skillTags ?? [];
      if (!tags.length) problems.push(`${exercise.id} : aucune compétence`);
      const known = skillIds(exercise.language);
      for (const tag of tags) if (!known.has(tag)) problems.push(`${exercise.id} : compétence inconnue « ${tag} » (${exercise.language})`);
      if (new Set(tags).size !== tags.length) problems.push(`${exercise.id} : compétence en double`);
    }
    expect(problems).toEqual([]);
  });

  it("couvre chaque compétence anglaise par au moins trois exercices", () => {
    const uncovered = SKILLS.en
      .map((skill) => ({ skill, count: EXERCISES.filter((exercise) => exercise.language === "en" && exercise.skillTags?.includes(skill.id)).length }))
      .filter(({ count }) => count < 3)
      .map(({ skill, count }) => `${skill.id} : ${count}`);
    expect(uncovered).toEqual([]);
  });

  it("relie chaque thème des exercices ciblés à une compétence de vocabulaire", () => {
    for (const topic of TOPICS_WITH_SKILL) {
      expect(SKILLS.en.some((skill) => skill.topic === topic), topic).toBe(true);
    }
  });

  it("déduit les compétences d'une phrase par des règles simples", () => {
    expect(deduceSentenceSkills("How long have you been learning English?")).toEqual(expect.arrayContaining(["present-perfect", "questions"]));
    expect(deduceSentenceSkills("Could we have the check, please?")).toContain("polite-requests");
    expect(deduceSentenceSkills("My flight has been delayed by two hours.")).toEqual(expect.arrayContaining(["present-perfect", "passive-voice"]));
    expect(deduceSentenceSkills("If I were you, I would ask for a second opinion.")).toContain("conditionals");
    expect(deduceSentenceSkills("She said that she was tired.")).toContain("reported-speech");
    expect(deduceSentenceSkills("The train is cheaper than the plane.")).toContain("comparatives");
    expect(deduceSentenceSkills("A table for two, please.")).not.toContain("questions");
  });
});
