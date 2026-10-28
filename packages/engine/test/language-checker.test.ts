import { describe, expect, it } from "vitest";
import { checkText } from "../src/modules/language-checker.js";

describe("correcteur local de l'anglais (erreurs de francophones)", () => {
  const cases: Array<[string, string, string]> = [
    ["I have finish the report yesterday.", "I finished the report yesterday.", "present-perfect-finished-time"],
    ["I've seen him last week.", "I saw him last week.", "present-perfect-finished-time"],
    ["We have been there last year.", "We were there last year.", "present-perfect-finished-time"],
    ["She has not sent it two days ago.", "She didn't send it two days ago.", "present-perfect-finished-time"],
    ["Yesterday I have work at the hospital.", "Yesterday I worked at the hospital.", "present-perfect-finished-time"],
    ["I have finish the report.", "I have finished the report.", "have-plus-base"],
    ["She has write three papers.", "She has written three papers.", "have-plus-base"],
    ["I work here since three years.", "I have worked here for three years.", "since-duration"],
    ["We stayed in Boston during two weeks.", "We stayed in Boston for two weeks.", "during-duration"],
    ["I am here since 2019.", "I have been here since 2019.", "present-since"],
    ["I am agree with you.", "I agree with you.", "be-agree"],
    ["I'm not agree.", "I don't agree.", "be-agree"],
    ["It depends of the results.", "It depends on the results.", "depend-of"],
    ["It's depend on the patient.", "It depends on the patient.", "its-depend"],
    ["Can you explain me the protocol?", "Can you explain to me the protocol?", "explain-me"],
    ["We discussed about the case.", "We discussed the case.", "discuss-about"],
    ["I made a photo of the poster.", "I took a photo of the poster.", "make-photo"],
    ["I need some informations.", "I need some information.", "uncountable-plural"],
    ["Thanks for your advices.", "Thanks for your advice.", "uncountable-plural"],
    ["People is very friendly here.", "People are very friendly here.", "people-is"],
    ["He don't like flying.", "He doesn't like flying.", "third-person-dont"],
    ["This tracer is more better.", "This tracer is better.", "double-comparative"],
    ["I have 45 years.", "I am 45 years old.", "age-have"],
    ["I am waiting you at the station.", "I am waiting for you at the station.", "wait-for"],
    ["We are waiting the new camera.", "We are waiting for the new camera.", "wait-for"],
    ["I listen music in the car.", "I listen to music in the car.", "listen-to"],
    ["I go to home after work.", "I go home after work.", "go-to-home"],
    ["According to me, it is benign.", "In my opinion, it is benign.", "according-to-me"],
    ["I know him since long time.", "I have known him for a long time.", "since-long"],
    ["I will assist to the congress.", "I will attend the congress.", "assist-to"],
    ["How do you call this in English?", "What do you call this in English?", "how-call"],
    ["Did you went to the meeting?", "Did you go to the meeting?", "did-past"],
    ["I didn't saw the email.", "I didn't see the email.", "did-past"],
    ["You must to fast before the scan.", "You must fast before the scan.", "modal-to"],
    ["She can goes home now.", "She can go home now.", "modal-s"],
    ["In the other hand, it is expensive.", "On the other hand, it is expensive.", "on-the-other-hand"],
    ["The most of patients agree.", "Most of patients agree.", "the-most-of"],
    ["Thanks you very much.", "Thank you very much.", "thanks-you"],
    ["yes i think so", "yes I think so", "lowercase-i"]
  ];

  it.each(cases)("corrige « %s »", (input, expected, rule) => {
    const result = checkText("en", input);
    expect(result.corrected).toBe(expected);
    expect(result.findings.map((finding) => finding.rule)).toContain(rule);
    expect(result.findings.every((finding) => finding.explanation.length > 20)).toBe(true);
  });

  it("ne touche pas aux phrases correctes", () => {
    for (const sentence of [
      "I have finished the report.",
      "I finished the report yesterday.",
      "I have to finish the report.",
      "We have been working here for three years.",
      "I have been here since 2019.",
      "It depends on the weather.",
      "I have a lot of work this week.",
      "We have dinner at eight.",
      "Did you see the new guidelines?",
      "She has two children.",
      "I agree with you.",
      "They listened to the presentation during the meeting.",
      "I would like some information about the PET scan.",
      "Wait a minute, please."
    ]) {
      expect(checkText("en", sentence), sentence).toEqual({ corrected: sentence, findings: [] });
    }
  });

  it("reconnaît les apostrophes typographiques du clavier de l'iPhone", () => {
    expect(checkText("en", "I’m not agree.").corrected).toBe("I don't agree.");
  });

  it("corrige plusieurs erreurs dans la même phrase", () => {
    const result = checkText("en", "I am agree, it depends of the informations.");
    expect(result.corrected).toBe("I agree, it depends on the information.");
    expect(result.findings).toHaveLength(3);
  });

  it("garde les règles allemandes et espagnoles", () => {
    expect(checkText("de", "Ich bin gut, danke.").corrected).toBe("Mir geht es gut, danke.");
    expect(checkText("es", "Soy 45 años.").corrected).toBe("Tengo 45 años.");
    expect(checkText("es", "Soy en Madrid.").corrected).toBe("Estoy en Madrid.");
  });
});

import { checkText as checkTextAudit } from "../src/modules/language-checker.js";

describe("phrases modèles correctes (audit du 26/10/2026, I7)", () => {
  it("« The informations are on the table » → « The information is on the table »", () => {
    expect(checkTextAudit("en", "The informations are on the table").corrected).toBe("The information is on the table");
  });
  it("« The patient has a fever since two days » → « has had a fever for two days »", () => {
    expect(checkTextAudit("en", "The patient has a fever since two days").corrected).toBe("The patient has had a fever for two days");
  });
});

describe("règles ajoutées après l'audit du 26/10/2026", () => {
  it("corrige « I have 42 years old », « responsible of » et « borrow me »", () => {
    expect(checkText("en", "I have 42 years old.").corrected).toContain("I am 42 years old");
    expect(checkText("en", "I am responsible of the unit.").corrected).toContain("responsible for");
    expect(checkText("en", "Can you borrow me a pen?").corrected).toContain("lend me");
  });
});
