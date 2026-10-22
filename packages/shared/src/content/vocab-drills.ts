import type { Exercise, LanguageCode } from "../types.js";
import { slug } from "./generators.js";
import type { VocabItem, VocabSet } from "./types.js";
import { DE_VOCAB } from "./de/bank.js";
import { DE_VERB_SETS } from "./de/verb-lists.js";
import { DE_VOCAB_EXTRA } from "./de/vocab-extra.js";
import { EN_VERB_SETS } from "./en/verb-lists.js";
import { ES_VERB_SETS } from "./es/verb-lists.js";
import { EN_VOCAB_EXTRA } from "./en/vocab-extra.js";
import { ES_VOCAB_EXTRA } from "./es/vocab-extra.js";
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
  en: [...MEDICAL_VOCAB, ...GENERAL_VOCAB, ...EN_VOCAB_EXTRA, ...EN_VERB_SETS],
  de: [...DE_VOCAB, ...DE_VOCAB_EXTRA, ...DE_VERB_SETS],
  es: [...ES_VOCAB, ...ES_VOCAB_EXTRA, ...ES_VERB_SETS]
};

const LANGUAGE_NAMES: Record<LanguageCode, string> = { en: "anglais", de: "allemand", es: "espagnol" };
const DIRECTION_CODE: Record<ConcreteDirection, string> = { "to-target": "tf", "to-french": "ff" };
const ID_PREFIX = "vd";

const ARTICLES: Record<LanguageCode, RegExp> = {
  en: /^(?:the|an?|to)\s+/i,
  de: /^(?:der|die|das|ein|eine|sich)\s+/i,
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

/**
 * Même sens dans une autre liste (« the operating theatre » / « the operating room ») : en saisie,
 * quand on interroge toutes les listes ou au hasard, la réponse juste d'un synonyme d'une autre liste
 * doit être acceptée. On compare les mots sans article ni précision entre parenthèses.
 */
// Comme FRENCH_ARTICLES, mais sans retirer le début d'un mot (« laboratoire » ne perd pas « la »).
const FRENCH_KEY_ARTICLES = /^(?:(?:le|la|les|un|une|des|du|de la|de l')\s+|l'|d')/i;
const meaningKey = (text: string, strip: RegExp) => text.replace(/\s*\([^)]*\)/g, "").trim().toLowerCase().replace(strip, "").trim();
const meaningIndexes = new Map<string, Map<string, string[]>>();
function sameMeaning(language: LanguageCode, toTarget: boolean, item: VocabItem): string[] {
  const sets = VOCAB_SETS[language];
  const key = (value: string) => meaningKey(value, toTarget ? FRENCH_KEY_ARTICLES : ARTICLES[language]);
  const indexId = `${language}${toTarget}`;
  let index = meaningIndexes.get(indexId);
  if (!index) {
    index = new Map();
    for (const set of sets) for (const entry of set.items) {
      const from = key(toTarget ? entry.fr : entry.en);
      index.set(from, [...(index.get(from) ?? []), toTarget ? entry.en : entry.fr]);
    }
    meaningIndexes.set(indexId, index);
  }
  return index.get(key(toTarget ? item.fr : item.en)) ?? [];
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
  const strip = toTarget ? ARTICLES[language] : FRENCH_ARTICLES;
  const equivalents = sameMeaning(language, toTarget, item).filter((other) => other !== answer);
  const variants = [...new Set([...typedVariants(answer, strip), ...equivalents, ...equivalents.flatMap((other) => typedVariants(other, strip))])];
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
