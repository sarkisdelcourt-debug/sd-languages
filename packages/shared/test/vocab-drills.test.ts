import { describe, expect, it } from "vitest";
import { evaluateAnswer } from "../src/learning.js";
import {
  VOCAB_SETS, concreteDirection, drillCandidates, drillExercise, findDrillExercise, typedVariants, type VocabDirection, type VocabMode
} from "../src/content/vocab-drills.js";

const LANGUAGES = ["en", "de", "es"] as const;
const find = (language: (typeof LANGUAGES)[number], setId: string, word: string) => {
  const set = VOCAB_SETS[language].find((candidate) => candidate.id === setId)!;
  return { set, item: set.items.find((entry) => entry.en === word)! };
};

describe("tests de vocabulaire dans les deux sens", () => {
  it("pose « Comment dit-on… en anglais ? » en QCM, avec la bonne réponse parmi des mots de la même liste", () => {
    const { set, item } = find("en", "en-med-v-anatomy", "the bladder");
    const drill = drillExercise("en", set, item, "to-target", "choice");
    expect(drill.prompt).toBe("Comment dit-on « la vessie » en anglais ?");
    expect(drill.type).toBe("multiple-choice");
    expect(drill.choices).toHaveLength(4);
    expect(drill.choices).toContain("the bladder");
    expect(drill.choices!.every((choice) => set.items.some((entry) => entry.en === choice))).toBe(true);
    expect(evaluateAnswer(drill, "the bladder").verdict).toBe("exact");
    expect(evaluateAnswer(drill, "the kidney").correct).toBe(false);
  });

  it("pose « Que signifie… ? » dans le sens inverse, avec des traductions françaises en choix", () => {
    const { set, item } = find("en", "en-med-v-anatomy", "the bladder");
    const drill = drillExercise("en", set, item, "to-french", "choice");
    expect(drill.prompt).toBe("Que signifie « the bladder » ?");
    expect(drill.answer).toBe("la vessie");
    expect(drill.choices!.every((choice) => set.items.some((entry) => entry.fr === choice))).toBe(true);
  });

  it("accepte la saisie avec ou sans article, accents tolérés, et refuse un autre mot", () => {
    const { set, item } = find("en", "en-med-v-anatomy", "the bladder");
    const toEnglish = drillExercise("en", set, item, "to-target", "typing");
    expect(toEnglish.type).toBe("translation");
    for (const typed of ["the bladder", "bladder", "The Bladder"]) expect(evaluateAnswer(toEnglish, typed).correct, typed).toBe(true);
    expect(evaluateAnswer(toEnglish, "kidney").correct).toBe(false);
    const toFrench = drillExercise("en", set, item, "to-french", "typing");
    for (const typed of ["la vessie", "vessie", "La vessie"]) expect(evaluateAnswer(toFrench, typed).correct, typed).toBe(true);
    expect(toEnglish.hint).toContain("« b »");
  });

  it("fonctionne pour l'espagnol et l'allemand (articles el/la, der/die/das)", () => {
    const spanish = VOCAB_SETS.es[0]!;
    const withArticle = spanish.items.find((entry) => /^(el|la|los|las) /.test(entry.en))!;
    const es = drillExercise("es", spanish, withArticle, "to-target", "typing");
    expect(evaluateAnswer(es, withArticle.en).verdict).toBe("exact");
    expect(evaluateAnswer(es, withArticle.en.replace(/^\w+ /, "")).correct).toBe(true);
    const german = VOCAB_SETS.de.find((set) => set.items.some((entry) => /^(der|die|das) /.test(entry.en)))!;
    const noun = german.items.find((entry) => /^(der|die|das) /.test(entry.en))!;
    const de = drillExercise("de", german, noun, "to-target", "typing");
    expect(evaluateAnswer(de, noun.en.replace(/^\w+ /, "")).correct).toBe(true);
    expect(de.prompt).toContain("allemand");
  });

  it("accepte chaque synonyme et ignore la précision entre parenthèses", () => {
    expect(typedVariants("attraper (une maladie)", /^(?:le|la)\s+/)).toContain("attraper");
    expect(typedVariants("débuter, commencer", /^(?:le|la)\s+/)).toEqual(expect.arrayContaining(["débuter", "commencer"]));
    expect(typedVariants("les constatations", /^(?:le|la|les)\s+/i)).toContain("constatations");
  });

  it("garde le même sens pour un mot en mode mélangé et couvre les deux sens", () => {
    const { item } = find("en", "en-med-v-anatomy", "the bladder");
    expect(concreteDirection("mixed", item)).toBe(concreteDirection("mixed", item));
    const directions = new Set(drillCandidates("en", "mixed", "choice").map((drill) => drill.id.split("~")[1]));
    expect(directions).toEqual(new Set(["tf", "ff"]));
  });

  it("retrouve n'importe quel exercice à partir de son identifiant, et seulement ceux-là", () => {
    for (const language of LANGUAGES) {
      for (const direction of ["to-target", "to-french", "mixed"] as VocabDirection[]) {
        for (const mode of ["choice", "typing"] as VocabMode[]) {
          const drills = drillCandidates(language, direction, mode);
          const ids = drills.map((drill) => drill.id);
          expect(new Set(ids).size, `${language} ${direction} ${mode} : ids uniques`).toBe(ids.length);
          for (const drill of drills) {
            const again = findDrillExercise(drill.id, language);
            expect(again?.answer, drill.id).toBe(drill.answer);
            expect(again?.prompt, drill.id).toBe(drill.prompt);
          }
        }
      }
    }
    expect(findDrillExercise("en-a1-mcq-have")).toBeUndefined();
    expect(findDrillExercise("vd~tf~c~liste-inconnue~mot")).toBeUndefined();
    expect(findDrillExercise("vd~zz~c~en-med-v-anatomy~the-bladder")).toBeUndefined();
  });

  it("rend chaque bonne réponse atteignable et chaque QCM valide, dans toutes les listes", () => {
    const problems: string[] = [];
    for (const language of LANGUAGES) {
      for (const mode of ["choice", "typing"] as VocabMode[]) {
        for (const drill of drillCandidates(language, "mixed", mode)) {
          if (evaluateAnswer(drill, drill.answer).verdict !== "exact") problems.push(`${drill.id} : réponse non exacte`);
          if (mode === "choice") {
            if (drill.choices!.length < 4) problems.push(`${drill.id} : moins de 4 choix`);
            if (new Set(drill.choices!.map((choice) => choice.toLowerCase())).size !== drill.choices!.length) problems.push(`${drill.id} : choix en double`);
            if (!drill.choices!.includes(drill.answer)) problems.push(`${drill.id} : réponse absente`);
          }
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it("garde des listes saines : 14 à 16 mots, traductions et mots distincts, ids uniques", () => {
    const problems: string[] = [];
    for (const language of LANGUAGES) {
      const ids = new Set<string>();
      for (const set of VOCAB_SETS[language]) {
        if (ids.has(set.id)) problems.push(`${set.id} : id en double`);
        ids.add(set.id);
        if (set.items.length < 8 || set.items.length > 24) problems.push(`${set.id} : ${set.items.length} mots`);
        const fr = set.items.map((item) => item.fr.toLowerCase());
        const target = set.items.map((item) => item.en.toLowerCase());
        if (new Set(fr).size !== fr.length) problems.push(`${set.id} : traductions en double`);
        if (new Set(target).size !== target.length) problems.push(`${set.id} : mots en double`);
      }
    }
    expect(problems).toEqual([]);
  });

  it("n'ajoute aucun mot déjà présent dans une autre liste (les listes publiées avant le 22/10 gardent leurs rares doublons)", () => {
    const repeated: string[] = [];
    for (const language of LANGUAGES) {
      const owners = new Map<string, string>();
      for (const set of VOCAB_SETS[language]) for (const item of set.items) {
        const key = item.en.toLowerCase();
        const previous = owners.get(key);
        if (previous && (/-v-(x|verbs)-/.test(set.id) || /-v-(x|verbs)-/.test(previous))) repeated.push(`${language} « ${item.en} » : ${owners.get(key)} et ${set.id}`);
        owners.set(key, set.id);
      }
    }
    expect(repeated).toEqual([]);
  });

  it("couvre au moins 300 mots répartis sur les trois langues", () => {
    for (const language of LANGUAGES) expect(drillCandidates(language, "to-target", "choice").length, language).toBeGreaterThanOrEqual(100);
  });
});

describe("synonymes d'autres listes en saisie", () => {
  it("accepte « operating room » pour « le bloc opératoire » même si la liste interrogée contient « operating theatre »", () => {
    const set = VOCAB_SETS.en.find((candidate) => candidate.items.some((entry) => entry.en === "the operating theatre"))!;
    const item = set.items.find((entry) => entry.en === "the operating theatre")!;
    const drill = drillExercise("en", set, item, "to-target", "typing");
    expect(evaluateAnswer(drill, "the operating theatre").correct).toBe(true);
    expect(evaluateAnswer(drill, "operating room").correct).toBe(true);
    expect(evaluateAnswer(drill, "kitchen").correct).toBe(false);
  });
});

describe("sens vers le français : l'article est retiré sans amputer le mot (audit du 26/10/2026)", () => {
  it("accepte le nom français sans son article pour chaque mot de chaque langue, et refuse un fragment de mot", () => {
    const problems: string[] = [];
    const FR_ARTICLE = /^(?:(?:le|la|les|un|une|des|du|de la|de l')\s+|l'|d')/i;
    for (const language of LANGUAGES) {
      for (const drill of drillCandidates(language, "to-french", "typing")) {
        const bare = drill.answer.replace(/\s*\([^)]*\)/g, "").split(/\s*(?:,|\/|;| ou )\s*/)[0]!.replace(FR_ARTICLE, "").trim();
        if (bare && !evaluateAnswer(drill, bare).correct) problems.push(`${drill.id} : « ${bare} » refusé`);
        const fragment = bare.slice(1);
        if (fragment.length > 2 && evaluateAnswer(drill, fragment).correct) problems.push(`${drill.id} : fragment « ${fragment} » accepté`);
      }
    }
    expect(problems.slice(0, 10)).toEqual([]);
  });
});
