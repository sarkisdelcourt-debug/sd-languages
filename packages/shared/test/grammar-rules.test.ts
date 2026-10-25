import { describe, expect, it } from "vitest";
import { GRAMMAR_RULES, rulesFor } from "../src/grammar-rules.js";
import { EXERCISES } from "../src/curriculum.js";
import { SKILLS } from "../src/skills.js";
import { articleExercises } from "../src/content/generators.js";
import { VOCAB_SETS } from "../src/content/vocab-drills.js";

const MINIMUM = { en: 15, de: 20, es: 25 } as const;

describe("fiches de règles", () => {
  it("couvre chaque langue avec assez de fiches, des ids uniques et un ordre sans doublon", () => {
    expect(new Set(GRAMMAR_RULES.map((rule) => rule.id)).size).toBe(GRAMMAR_RULES.length);
    for (const language of ["en", "de", "es"] as const) {
      const rules = rulesFor(language);
      expect(rules.length, language).toBeGreaterThanOrEqual(MINIMUM[language]);
      expect(new Set(rules.map((rule) => rule.order)).size, `${language} : ordres distincts`).toBe(rules.length);
      expect(rules.every((rule) => rule.id.startsWith(`${language}-r-`)), language).toBe(true);
    }
  });

  it("donne à chaque fiche un résumé, des sections, au moins trois exemples et des compétences valides", () => {
    const problems: string[] = [];
    for (const rule of GRAMMAR_RULES) {
      const valid = new Set(SKILLS[rule.language].map((skill) => skill.id));
      if (!rule.title.trim() || !rule.summary.trim()) problems.push(`${rule.id} : titre ou résumé vide`);
      if (rule.sections.length === 0) problems.push(`${rule.id} : aucune section`);
      if (rule.examples.length < 3) problems.push(`${rule.id} : moins de 3 exemples`);
      if (rule.examples.some((example) => !example.target.trim() || !example.translation.trim())) problems.push(`${rule.id} : exemple vide`);
      if (rule.skills.length === 0 || rule.skills.some((skill) => !valid.has(skill))) problems.push(`${rule.id} : compétence inconnue (${rule.skills.join(", ")})`);
      for (const section of rule.sections) {
        if (!section.text && !section.points?.length && !section.table) problems.push(`${rule.id} : section vide`);
        if (section.table && section.table.rows.some((row) => row.length !== section.table!.head.length)) problems.push(`${rule.id} : tableau aux lignes de longueurs différentes`);
      }
    }
    expect(problems).toEqual([]);
  });

  it("propose aux hispanophones débutants un parcours « Premiers pas » (A1) en tête", () => {
    const first = rulesFor("es").filter((rule) => rule.group === "Premiers pas");
    expect(first.length).toBeGreaterThanOrEqual(8);
    expect(first.every((rule) => rule.level === "A1")).toBe(true);
    expect(rulesFor("es").slice(0, first.length).every((rule) => rule.group === "Premiers pas")).toBe(true);
  });
});

describe("exercices de genre des noms (der/die/das, el/la)", () => {
  it("fabrique un QCM par nom des listes, avec le bon article parmi les choix", () => {
    for (const language of ["de", "es"] as const) {
      const drills = articleExercises(VOCAB_SETS[language], language);
      expect(drills.length, language).toBeGreaterThan(200);
      expect(new Set(drills.map((drill) => drill.id)).size, language).toBe(drills.length);
      expect(drills.every((drill) => drill.choices!.includes(drill.answer) && drill.skillTags?.includes("articles-gender")), language).toBe(true);
    }
    expect(EXERCISES.some((exercise) => exercise.id.includes("-art-"))).toBe(true);
  });
  it("ne pose aucune question de genre sur un pluriel", () => {
    const sample = articleExercises([{ id: "x", topic: "everyday", level: "A1", title: "t", skill: "everyday-vocabulary", items: [{ en: "die Eltern", fr: "les parents" }, { en: "der Vater", fr: "le père" }] }], "de");
    expect(sample.map((drill) => drill.answer)).toEqual(["der"]);
  });
});
