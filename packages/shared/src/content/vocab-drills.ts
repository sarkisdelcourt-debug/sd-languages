import type { Exercise, LanguageCode } from "../types.js";
import { slug } from "./generators.js";
import type { VocabItem, VocabSet } from "./types.js";
import { DE_VOCAB } from "./de/bank.js";
import { GENERAL_VOCAB } from "./en/general.js";
import { MEDICAL_VOCAB } from "./en/medical.js";
import { ES_VOCAB } from "./es/bank.js";

/**
 * Tests de vocabulaire (22/10/2026) : les mêmes listes que les séries, mais interrogées dans les
 * deux sens — langue étudiée → français (« Que signifie… ? ») et français → langue étudiée
 * (« Comment dit-on… ? ») — en QCM ou en saisie. Les exercices sont fabriqués à la demande, avec des
 * identifiants déterministes (`vd~sens~mode~liste~mot`) : ils ne gonflent pas le catalogue des séries,
 * mais passent par la même correction, la même mémoire des erreurs et les mêmes révisions.
 * Dans une VocabSet, le champ `en` contient le mot de la langue étudiée, `fr` sa traduction.
 */
export type VocabDirection = "to-target" | "to-french" | "mixed";
export type VocabMode = "choice" | "typing";
export type ConcreteDirection = Exclude<VocabDirection, "mixed">;

export const VOCAB_SETS: Record<LanguageCode, VocabSet[]> = {
  en: [...MEDICAL_VOCAB, ...GENERAL_VOCAB],
  de: DE_VOCAB,
  es: ES_VOCAB
};

const LANGUAGE_NAMES: Record<LanguageCode, string> = { en: "anglais", de: "allemand", es: "espagnol" };
const DIRECTION_CODE: Record<ConcreteDirection, string> = { "to-target": "tf", "to-french": "ff" };
const ID_PREFIX = "vd";

const ARTICLES: Record<LanguageCode, RegExp> = {
  en: /^(?:the|an?|to)\s+/i,
  de: /^(?:der|die|das|ein|eine)\s+/i,
  es: /^(?:el|la|los|las|un|una|unos|unas)\s+/i
};
const FRENCH_ARTICLES = /^(?:le|la|les|l'|un|une|des|du|de la|de l'|d')\s*/i;

function hash(text: string): number {
  let value = 2_166_136_261;
  for (const character of text) value = Math.imul(value ^ character.charCodeAt(0), 16_777_619) >>> 0;
  return value;
}

/** Variantes acceptées à la saisie : avec ou sans article, sans précision entre parenthèses, chaque synonyme. */
export function typedVariants(answer: string, strip: RegExp): string[] {
  const withoutNote = answer.replace(/\s*\([^)]*\)/g, "").trim();
  const synonyms = withoutNote.split(/\s*(?:,|\/|;| ou )\s*/).map((part) => part.trim()).filter(Boolean);
  const variants = new Set<string>([withoutNote, ...synonyms]);
  for (const form of [...variants]) {
    const bare = form.replace(strip, "").trim();
    if (bare && bare.length > 1) variants.add(bare);
  }
  variants.delete(answer);
  return [...variants];
}

/** Direction réelle d'un mot quand le sens demandé est « mélangé » : stable pour un même mot. */
export function concreteDirection(direction: VocabDirection, item: VocabItem): ConcreteDirection {
  if (direction !== "mixed") return direction;
  return hash(item.en) % 2 === 0 ? "to-target" : "to-french";
}

export function drillId(direction: ConcreteDirection, mode: VocabMode, setId: string, item: VocabItem): string {
  return [ID_PREFIX, DIRECTION_CODE[direction], mode === "choice" ? "c" : "t", setId, slug(item.en)].join("~");
}

function distractors(set: VocabSet, item: VocabItem, pick: (entry: VocabItem) => string, seed: string): string[] {
  const own = pick(item).toLowerCase();
  const pool = [...new Set(set.items.map(pick).filter((value) => value.toLowerCase() !== own))];
  return pool.sort((a, b) => hash(`${seed}${a}`) - hash(`${seed}${b}`)).slice(0, 3);
}

export function drillExercise(language: LanguageCode, set: VocabSet, item: VocabItem, direction: ConcreteDirection, mode: VocabMode): Exercise {
  const id = drillId(direction, mode, set.id, item);
  const toTarget = direction === "to-target";
  const answer = toTarget ? item.en : item.fr;
  const question = toTarget ? item.fr : item.en;
  const base = {
    id, language, level: set.level, topic: set.topic, skillTags: set.skill ? [set.skill] : undefined,
    answer, focus: set.title,
    explanation: `« ${item.en} » = « ${item.fr} ».`
  };
  if (mode === "choice") {
    const wrong = distractors(set, item, (entry) => (toTarget ? entry.en : entry.fr), id);
    const choices = [answer, ...wrong].sort((a, b) => hash(`${id}${a}`) - hash(`${id}${b}`));
    return {
      ...base, type: "multiple-choice", choices,
      prompt: toTarget ? `Comment dit-on « ${question} » en ${LANGUAGE_NAMES[language]} ?` : `Que signifie « ${question} » ?`,
      hint: `Thème : ${set.title.toLowerCase()}.`
    };
  }
  const first = (answer.replace(toTarget ? ARTICLES[language] : FRENCH_ARTICLES, "").trim()[0] ?? "").toLowerCase();
  const variants = typedVariants(answer, toTarget ? ARTICLES[language] : FRENCH_ARTICLES);
  return {
    ...base, type: "translation",
    ...(variants.length ? { acceptedAnswers: variants } : {}),
    prompt: toTarget ? `Traduisez en ${LANGUAGE_NAMES[language]} : « ${question} »` : `Traduisez en français : « ${question} »`,
    hint: `Commence par « ${first} » (l'article est facultatif).`
  };
}

export function drillSets(language: LanguageCode, setId?: string): VocabSet[] {
  const sets = VOCAB_SETS[language];
  return setId ? sets.filter((set) => set.id === setId) : sets;
}

/** Tous les exercices possibles pour un périmètre (une liste ou toutes), un sens et un mode. */
export function drillCandidates(language: LanguageCode, direction: VocabDirection, mode: VocabMode, setId?: string): Exercise[] {
  return drillSets(language, setId).flatMap((set) => set.items.map((item) => drillExercise(language, set, item, concreteDirection(direction, item), mode)));
}

/** Retrouve un exercice de vocabulaire à partir de son identifiant (réponses et révisions). */
export function findDrillExercise(id: string, language?: LanguageCode): Exercise | undefined {
  const [prefix, directionCode, modeCode, setId, word] = id.split("~");
  if (prefix !== ID_PREFIX || !setId || !word) return undefined;
  const direction: ConcreteDirection | undefined = directionCode === "tf" ? "to-target" : directionCode === "ff" ? "to-french" : undefined;
  const mode: VocabMode | undefined = modeCode === "c" ? "choice" : modeCode === "t" ? "typing" : undefined;
  if (!direction || !mode) return undefined;
  for (const code of Object.keys(VOCAB_SETS) as LanguageCode[]) {
    if (language && code !== language) continue;
    const set = VOCAB_SETS[code].find((candidate) => candidate.id === setId);
    const item = set?.items.find((entry) => slug(entry.en) === word);
    if (set && item) return drillExercise(code, set, item, direction, mode);
  }
  return undefined;
}
