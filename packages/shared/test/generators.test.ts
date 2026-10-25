import { describe, expect, it } from "vitest";
import {
  answerVariants,
  chunkForPairs,
  expandContractions,
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

describe("variantes de réponse tolérantes (21/10/2026)", () => {
  it("développe « 'd » selon le contexte, « let's » et « would've »", () => {
    expect(expandContractions("I'd like a coffee.")).toBe("I would like a coffee.");
    expect(expandContractions("She'd already left.")).toBe("She had already left.");
    expect(expandContractions("Let's go, we should've known.")).toBe("Let us go, we should have known.");
    expect(answerVariants("I'd seen it.")).toContain("I had seen it.");
    expect(answerVariants("I'd seen it.")).not.toContain("I would seen it.");
  });

  it("contracte dans l'autre sens : would → 'd, let us → let's", () => {
    expect(answerVariants("I would ask for a second opinion.")).toContain("I'd ask for a second opinion.");
    expect(answerVariants("Let us start now.")).toContain("Let's start now.");
  });

  it("échange chiffres et mots, y compris « an hour »", () => {
    expect(answerVariants("Call me back in ten minutes.")).toContain("Call me back in 10 minutes.");
    expect(answerVariants("It takes 2 hours.")).toContain("It takes two hours.");
    expect(answerVariants("It takes an hour.")).toContain("It takes one hour.");
  });

  it("échange le lexique américain et britannique dans les deux sens", () => {
    expect(answerVariants("We rented a car downtown.")).toContain("We hired a car in the city centre.");
    expect(answerVariants("I love this color.")).toContain("I love this colour.");
    expect(answerVariants("Take the lift to your flat.")).toContain("Take the elevator to your apartment.");
  });

  it("borne le nombre de variantes générées", () => {
    expect(answerVariants("I'd like to rent a car for two days downtown, it's my favorite vacation.").length).toBeLessThan(40);
  });
});

describe("générateurs plus didactiques (21/10/2026)", () => {
  const items = [
    { id: "en-test-s-010", topic: "medical" as const, level: "B1" as const, en: "Do you have an appointment at nine?", fr: "Avez-vous un rendez-vous à neuf heures ?", note: "Question avec do." },
    { id: "en-test-s-011", topic: "medical" as const, level: "B1" as const, en: "Please fill in this form before the scan.", fr: "Veuillez remplir ce formulaire avant l'examen.", note: "Impératif poli." },
    { id: "en-test-s-012", topic: "medical" as const, level: "B1" as const, en: "The injection is painless and very quick.", fr: "L'injection est indolore et très rapide.", note: "Painless = indolore." },
    { id: "en-test-s-013", topic: "medical" as const, level: "B1" as const, en: "We have worked here since March.", fr: "Nous travaillons ici depuis mars.", note: "Since + date." }
  ];
  const exercises = sentenceExercises(items);
  const build = (id: string) => exercises.find((exercise) => exercise.id === `${id}-build`)!;
  const listen = (id: string) => exercises.find((exercise) => exercise.id === `${id}-listen`)!;

  it("adapte l'indice de construction au type de phrase", () => {
    expect(build("en-test-s-010").hint).toBe("Commencez par le mot interrogatif ou l'auxiliaire.");
    expect(build("en-test-s-011").hint).toBe("Commencez par le verbe.");
    expect(build("en-test-s-012").hint).toBe("Commencez par le sujet, puis le verbe.");
  });

  it("propose des distracteurs grammaticaux tirés des mots de la phrase", () => {
    const tiles = (id: string, sentence: string) => build(id).tiles!.slice(sentenceTiles(sentence).length).map((tile) => tile.toLowerCase());
    const question = tiles("en-test-s-010", items[0]!.en);
    expect(question).toHaveLength(2);
    expect(question.every((tile) => ["does", "did", "has", "had", "a", "the", "in", "on"].includes(tile))).toBe(true);
    const since = tiles("en-test-s-013", items[3]!.en);
    expect(since).toContain("for");
    for (const exercise of exercises.filter((item) => item.type === "word-bank")) {
      const present = new Set(sentenceTiles(exercise.answer).map((word) => word.toLowerCase()));
      expect(exercise.tiles!.slice(present.size).some((tile) => present.has(tile.toLowerCase())), exercise.id).toBe(false);
    }
  });

  it("garde la traduction d'une dictée pour l'explication, pas pour l'indice", () => {
    expect(listen("en-test-s-012").hint).not.toContain("indolore");
    expect(listen("en-test-s-012").explanation).toContain("L'injection est indolore et très rapide.");
    expect(listen("en-test-s-012").explanation).toContain("Painless = indolore.");
  });

  it("retire les verbes invariants du drill du prétérit et montre l'exemple s'il existe", () => {
    const drills = irregularVerbExercises([
      { base: "put", past: "put", participle: "put", fr: "mettre", level: "A2" },
      { base: "go", past: "went", participle: "gone", fr: "aller", level: "A1", example: "She went home after the scan." }
    ]);
    expect(drills.map((drill) => drill.id)).toEqual(["en-irr-put-pp", "en-irr-go-past", "en-irr-go-pp"]);
    expect(drills.find((drill) => drill.id === "en-irr-go-past")!.prompt).toContain("She went home after the scan.");
  });
});

describe("construire la phrase : proposition subordonnée inversée (24/10/2026)", () => {
  const item = (en: string, language: "en" | "es" | "de") => sentenceExercises([{ id: `${language}-t-001`, topic: "everyday", level: "B1", en, fr: "…", note: "…", skills: ["everyday-vocabulary"] }], language).find((exercise) => exercise.type === "word-bank")!;
  it("accepte « B si A. » pour « Si A, B. » en anglais et en espagnol", () => {
    const en = item("If you feel dizzy, tell the radiographer straight away.", "en");
    expect(evaluateAnswer(en, "Tell the radiographer straight away if you feel dizzy.").correct).toBe(true);
    const es = item("Cuando llegamos, la reunión ya había empezado.", "es");
    expect(evaluateAnswer(es, "La reunión ya había empezado cuando llegamos.").correct).toBe(true);
    expect(evaluateAnswer(es, "Cuando llegamos la reunión.").correct).toBe(false);
  });
  it("n'inverse jamais en allemand (l'ordre des verbes change)", () => {
    const de = item("Wenn ich Zeit habe, komme ich vorbei.", "de");
    expect(evaluateAnswer(de, "Komme ich vorbei wenn ich Zeit habe.").correct).toBe(false);
  });
});
