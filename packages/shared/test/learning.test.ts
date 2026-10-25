import { describe, expect, it } from "vitest";
import { DIAGNOSTIC_QUESTIONS, EXERCISES, contentCoverage } from "../src/curriculum";
import { CONVERSATION_SCENARIOS } from "../src/scenarios";
import { GUIDED_LESSONS } from "../src/lessons";
import { assessPronunciation, createReviewCard, estimateLevel, evaluateAnswer, normalizeAnswer, scheduleReview } from "../src/learning";
import { PRONUNCIATION_PROMPTS } from "../src/pronunciation";
import type { DiagnosticQuestion, Exercise } from "../src/types";

const exercise: Exercise = {
  id: "en-test",
  language: "en",
  level: "A1",
  type: "translation",
  prompt: "Bonjour",
  answer: "Hello",
  acceptedAnswers: ["Hi"],
  explanation: "Salutation simple.",
  hint: "H…",
  focus: "salutations"
};

describe("answer evaluation", () => {
  it("normalizes accents, case, spaces and punctuation", () => {
    expect(normalizeAnswer("  ¡QUÉ   TAL! ")).toBe("que tal");
  });

  it("accepts alternative answers", () => {
    expect(evaluateAnswer(exercise, "HI!").correct).toBe(true);
  });

  it("rejects a different answer and returns guidance", () => {
    const result = evaluateAnswer(exercise, "Goodbye");
    expect(result.correct).toBe(false);
    expect(result.expectedAnswer).toBe("Hello");
  });

  it("distinguishes an exact answer from a correct answer missing an accent", () => {
    const accented: Exercise = { ...exercise, id: "es-accent", language: "es", answer: "escribió", acceptedAnswers: [] };
    expect(evaluateAnswer(accented, "escribió")).toMatchObject({ correct: true, verdict: "exact", issues: [] });
    expect(evaluateAnswer(accented, "escribio")).toMatchObject({
      correct: true,
      verdict: "minor",
      issues: [expect.objectContaining({ kind: "accent" })]
    });
  });

  it("keeps a close spelling error incorrect while explaining it", () => {
    const accented: Exercise = { ...exercise, id: "es-spelling", language: "es", answer: "escribió", acceptedAnswers: [] };
    expect(evaluateAnswer(accented, "escribo")).toMatchObject({
      correct: false,
      verdict: "incorrect",
      issues: [expect.objectContaining({ kind: "orthography" })]
    });
  });
});

describe("diagnostic scoring", () => {
  const question = (id: string, weight: number): DiagnosticQuestion => ({
    ...exercise,
    id,
    diagnosticWeight: weight
  });

  it("maps a weighted score to a CEFR level", () => {
    const result = estimateLevel([question("q1", 1), question("q2", 2)], { q1: "hello", q2: "wrong" });
    expect(result.score).toBe(1);
    expect(result.total).toBe(3);
    expect(result.estimatedLevel).toBe("A2");
  });
});

describe("spaced repetition", () => {
  it("schedules a successful first review for the following day", () => {
    const now = new Date("2026-01-01T10:00:00.000Z");
    const card = createReviewCard(exercise, now);
    const scheduled = scheduleReview(card, "good", now);
    expect(scheduled.repetitions).toBe(1);
    expect(scheduled.intervalDays).toBe(1);
    expect(scheduled.nextReviewAt).toBe("2026-01-02T10:00:00.000Z");
  });

  it("resets repetitions and records a lapse after forgetting", () => {
    const now = new Date("2026-01-10T10:00:00.000Z");
    const scheduled = scheduleReview({ ...createReviewCard(exercise), repetitions: 3, intervalDays: 8 }, "again", now);
    expect(scheduled.repetitions).toBe(0);
    expect(scheduled.lapses).toBe(1);
    expect(scheduled.easeFactor).toBe(2.3);
  });
});

describe("pronunciation transcript assessment", () => {
  const prompt = PRONUNCIATION_PROMPTS.find((item) => item.id === "pron-en-report")!;

  it("scores an exact transcript at 100 with transparent metrics", () => {
    expect(assessPronunciation(prompt, "Could you send me the report by Friday?")).toMatchObject({
      score: 100,
      verdict: "clear",
      mastered: true,
      metrics: { coverage: 100, order: 100, precision: 100 },
      missedWords: [],
      extraWords: [],
      missingKeyTokens: []
    });
  });

  it("ignores punctuation and written accents in the transcription", () => {
    const spanish = PRONUNCIATION_PROMPTS.find((item) => item.id === "pron-es-bakery")!;
    expect(assessPronunciation(spanish, "donde esta la panaderia").score).toBe(100);
  });

  it("caps a result when a key word is missing and reports extra words", () => {
    const result = assessPronunciation(prompt, "Could you send me the document please");
    expect(result.score).toBeLessThanOrEqual(49);
    expect(result.missingKeyTokens).toEqual(["report", "Friday"]);
    expect(result.extraWords).toEqual(["document", "please"]);
  });
});

describe("curriculum integrity", () => {
  it("contains a complete starter set for every language", () => {
    for (const language of ["en", "de", "es"] as const) {
      expect(DIAGNOSTIC_QUESTIONS.filter((question) => question.language === language)).toHaveLength(6);
      expect(EXERCISES.filter((item) => item.language === language).length).toBeGreaterThanOrEqual(15);
      const types = new Set(EXERCISES.filter((item) => item.language === language).map((item) => item.type));
      for (const type of ["multiple-choice", "fill-gap", "translation"] as const) expect(types.has(type)).toBe(true);
    }
  });

  it("uses unique identifiers across diagnostics and exercises", () => {
    const ids = [...DIAGNOSTIC_QUESTIONS, ...EXERCISES].map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("provides at least four well-formed conversation scenarios per language", () => {
    const scenarioIds = CONVERSATION_SCENARIOS.map((scenario) => scenario.id);
    const stepIds = CONVERSATION_SCENARIOS.flatMap((scenario) => scenario.steps.map((step) => step.id));
    expect(new Set(scenarioIds).size).toBe(scenarioIds.length);
    expect(new Set(stepIds).size).toBe(stepIds.length);
    for (const language of ["en", "de", "es"] as const) {
      expect(CONVERSATION_SCENARIOS.filter((scenario) => scenario.language === language).length).toBeGreaterThanOrEqual(4);
    }
    for (const scenario of CONVERSATION_SCENARIOS) {
      expect(scenario.steps).toHaveLength(4);
      expect(scenario.steps.every((step) => step.keywords.length > 0 && step.reply.length > 0)).toBe(true);
    }
  });

  it("builds guided lessons only from valid same-language content", () => {
    expect(GUIDED_LESSONS).toHaveLength(36);
    expect(new Set(GUIDED_LESSONS.map((lesson) => lesson.language))).toEqual(new Set(["en", "de", "es"]));
    expect(new Set(GUIDED_LESSONS.map((lesson) => lesson.id)).size).toBe(GUIDED_LESSONS.length);
    for (const language of ["en", "de", "es"] as const) {
      const lessons = GUIDED_LESSONS
        .filter((lesson) => lesson.language === language)
        .sort((left, right) => left.sequence - right.sequence);
      expect(lessons.map((lesson) => lesson.sequence)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(lessons.map((lesson) => lesson.level)).toEqual([
        "A1", "A1", "A1", "A2", "A2", "A2", "B1", "B1", "B1", "B2", "B2", "B2"
      ]);
      for (const [index, lesson] of lessons.entries()) {
        expect(lesson.revision).toBeGreaterThan(0);
        expect(lesson.title.trim()).not.toBe("");
        expect(lesson.microCourse.points.length).toBeGreaterThanOrEqual(3);
        expect(lesson.microCourse.examples.length).toBeGreaterThan(0);
        expect(lesson.exerciseIds.length).toBeGreaterThanOrEqual(2);
        expect(lesson.exerciseIds.every((exerciseId) =>
          EXERCISES.some((item) => item.id === exerciseId && item.language === lesson.language)
        )).toBe(true);
        expect(CONVERSATION_SCENARIOS.some((scenario) =>
          scenario.id === lesson.scenarioId && scenario.language === lesson.language
        )).toBe(true);
        expect(lesson.prerequisiteLessonId).toBe(index === 0 ? undefined : lessons[index - 1]?.id);
      }
    }
  });

  it("provides at least four pronunciation prompts per language (A1 to B2) linked to guided lessons", () => {
    expect(PRONUNCIATION_PROMPTS).toHaveLength(14);
    expect(new Set(PRONUNCIATION_PROMPTS.map((prompt) => prompt.id)).size).toBe(PRONUNCIATION_PROMPTS.length);
    for (const language of ["en", "de", "es"] as const) {
      const prompts = PRONUNCIATION_PROMPTS.filter((prompt) => prompt.language === language);
      expect([...new Set(prompts.map((prompt) => prompt.level))]).toEqual(["A1", "A2", "B1", "B2"]);
      expect(prompts.every((prompt) => prompt.keyTokens.length === 2)).toBe(true);
      expect(prompts.every((prompt) => GUIDED_LESSONS.some(
        (lesson) => lesson.id === prompt.sourceLessonId && lesson.language === language
      ))).toBe(true);
    }
  });
});

describe("cartes de révision lisibles (21/10/2026)", () => {
  const base = { language: "en" as const, level: "B1" as const, explanation: "", hint: "", focus: "Phrases" };

  it("remplace la consigne d'écoute par la phrase française à dire", () => {
    const card = createReviewCard({ ...base, id: "x-listen", type: "listening", prompt: "Écoutez puis écrivez la phrase.", audioText: "I'd like a coffee.", answer: "I'd like a coffee.", explanation: "« Je voudrais un café. » — Note." });
    expect(card.prompt).toBe("Dites en anglais : « Je voudrais un café. »");
    expect(card.answer).toBe("I'd like a coffee.");
  });

  it("transforme « Construisez » en consigne de traduction et liste les paires à associer", () => {
    expect(createReviewCard({ ...base, id: "x-build", type: "word-bank", prompt: "Construisez : « Je voudrais un café. »", tiles: [], answer: "I'd like a coffee." }).prompt)
      .toBe("Dites en anglais : « Je voudrais un café. »");
    const pairs = [{ target: "a tracer", native: "un traceur" }, { target: "uptake", native: "la fixation" }];
    expect(createReviewCard({ ...base, id: "x-pairs", type: "match-pairs", prompt: "Associez chaque mot à sa traduction.", pairs, answer: "a tracer = un traceur · uptake = la fixation" }).prompt)
      .toBe("Traduisez en anglais : un traceur · la fixation");
  });

  it("garde la consigne telle quelle pour les autres formats", () => {
    expect(createReviewCard(exercise).prompt).toBe("Bonjour");
  });
});

describe("couverture du contenu par langue (21/10/2026)", () => {
  it("ne signale « en construction » que les langues de moins de 50 exercices", () => {
    for (const language of ["en", "de", "es"] as const) {
      const exercises = EXERCISES.filter((item) => item.language === language).length;
      expect(contentCoverage(language), language).toMatchObject({ language, exercises, inConstruction: exercises < 50 });
    }
    expect(contentCoverage("en").inConstruction).toBe(false);
  });
});

describe("phrases de prononciation reliées aux leçons (audit UX du 24/10/2026)", () => {
  it("référence une leçon existante du même niveau et de la même langue, jamais deux phrases pour la même leçon", () => {
    const seen = new Map<string, string>();
    for (const prompt of PRONUNCIATION_PROMPTS) {
      const lesson = GUIDED_LESSONS.find((candidate) => candidate.id === prompt.sourceLessonId);
      expect(lesson, prompt.id).toBeDefined();
      expect(lesson!.language, prompt.id).toBe(prompt.language);
      expect(lesson!.level, prompt.id).toBe(prompt.level);
      expect(seen.get(prompt.sourceLessonId!), `${prompt.id} et ${seen.get(prompt.sourceLessonId!)} visent la même leçon`).toBeUndefined();
      seen.set(prompt.sourceLessonId!, prompt.id);
    }
  });
});

describe("retour ciblé des exercices « associer »", () => {
  it("ne liste que les paires fausses, avec ce que l'apprenant a associé", async () => {
    const { matchPairsMistakes } = await import("../src/learning");
    const expected = "a coffee = un café · a tea = un thé · a sandwich = un sandwich";
    expect(matchPairsMistakes("a coffee = un thé · a tea = un café · a sandwich = un sandwich", expected)).toEqual([
      { target: "a coffee", given: "un thé", expected: "un café" },
      { target: "a tea", given: "un café", expected: "un thé" }
    ]);
    expect(matchPairsMistakes(expected, expected)).toEqual([]);
    expect(matchPairsMistakes("", expected)).toHaveLength(3);
  });
});
