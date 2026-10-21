import { describe, expect, it } from "vitest";
import {
  chunkForPairs,
  contractionVariants,
  irregularVerbExercises,
  phrasalVerbExercises,
  sentenceExercises,
  sentenceTiles,
  vocabExercises
} from "../src/content/generators.js";
import { evaluateAnswer, matchPairsAnswer } from "../src/learning.js";

const set = {
  id: "en-test-v-imaging", topic: "medical" as const, level: "B2" as const, title: "Imagerie",
  items: [
    { en: "a tracer", fr: "un traceur" }, { en: "uptake", fr: "la fixation" }, { en: "half-life", fr: "la demi-vie" },
    { en: "a bone scan", fr: "une scintigraphie osseuse" }, { en: "a gamma camera", fr: "une gamma-caméra" },
    { en: "background activity", fr: "le bruit de fond" }, { en: "a contrast agent", fr: "un produit de contraste" }
  ]
};

describe("générateurs de contenu", () => {
  it("transforme une liste de vocabulaire en paires et en QCM de sens, avec des ids stables", () => {
    const exercises = vocabExercises(set);
    expect(exercises.filter((item) => item.type === "match-pairs").map((item) => item.pairs!.length)).toEqual([4, 3]);
    const tracer = exercises.find((item) => item.id === "en-test-v-imaging-a-tracer")!;
    expect(tracer.choices).toContain("un traceur");
    expect(new Set(tracer.choices).size).toBe(tracer.choices!.length);
    expect(evaluateAnswer(tracer, "un traceur").verdict).toBe("exact");
    expect(vocabExercises(set).map((item) => item.id)).toEqual(exercises.map((item) => item.id));
  });

  it("ne laisse jamais un groupe d'association de moins de trois éléments", () => {
    expect(chunkForPairs([1, 2, 3, 4, 5]).map((group) => group.length)).toEqual([5]);
    expect(chunkForPairs([1, 2, 3, 4, 5, 6, 7]).map((group) => group.length)).toEqual([4, 3]);
    expect(chunkForPairs([1, 2])).toEqual([]);
  });

  it("fait d'une phrase un exercice à construire et une dictée qui accepte les contractions", () => {
    const [build, listen] = sentenceExercises([
      { id: "en-test-s-001", topic: "medical", level: "B1", en: "You don't need to fast before the scan.", fr: "Vous n'avez pas besoin d'être à jeun avant l'examen.", note: "Need to + verbe." },
      { id: "en-test-s-002", topic: "medical", level: "B1", en: "The injection is painless and very quick.", fr: "L'injection est indolore et très rapide.", note: "Painless = indolore." }
    ]);
    expect(build!.tiles!.slice(0, 8)).toEqual(sentenceTiles("You don't need to fast before the scan."));
    expect(build!.tiles!.length).toBeGreaterThan(8);
    expect(evaluateAnswer(build!, build!.tiles!.slice(0, 8).join(" ")).verdict).toBe("exact");
    expect(evaluateAnswer(listen!, "You do not need to fast before the scan").correct).toBe(true);
  });

  it("produit les contractions dans les deux sens sans confondre « he's been »", () => {
    expect(contractionVariants("I'm sure it's fine.")).toContain("I am sure it is fine.");
    expect(contractionVariants("We cannot stay.")).toContain("We can't stay.");
    expect(contractionVariants("He's been there.")).not.toContain("He is been there.");
  });

  it("met un verbe à particule en contexte avec autant de blancs que de mots", () => {
    const [gap] = phrasalVerbExercises([
      { id: "en-pv-come-down-with", level: "B2", verb: "come down with", fr: "attraper (une maladie)", example: "She came down with the flu last week.", form: "came down with" },
      { id: "en-pv-put-off", level: "B1", verb: "put off", fr: "reporter", example: "We had to put off the meeting.", form: "put off" },
      { id: "en-pv-give-up", level: "B1", verb: "give up", fr: "arrêter, abandonner", example: "He gave up smoking last year.", form: "gave up" }
    ]);
    expect(gap!.prompt).toBe("Complétez (« attraper (une maladie) ») : She ___ ___ ___ the flu last week.");
    expect(evaluateAnswer(gap!, "came down with").verdict).toBe("exact");
  });

  it("accepte les deux formes des verbes irréguliers à variantes", () => {
    const [past, participle] = irregularVerbExercises([{ base: "learn", past: "learnt/learned", participle: "learnt/learned", fr: "apprendre", level: "A2" }]);
    expect(past!.id).toBe("en-irr-learn-past");
    expect(evaluateAnswer(past!, "learned").correct).toBe(true);
    expect(evaluateAnswer(participle!, "learnt").verdict).toBe("exact");
    expect(matchPairsAnswer([{ target: "a", native: "b" }])).toBe("a = b");
  });
});
