import type { CefrLevel, Exercise, ExerciseTopic, LanguageCode } from "../types.js";
import { slug } from "./generators.js";
import { EN_PHRASES, EN_PHRASE_SITUATIONS } from "./en/phrases.js";
import { DE_PHRASES, DE_PHRASE_SITUATIONS } from "./de/phrases.js";
import { ES_PHRASES, ES_PHRASE_SITUATIONS } from "./es/phrases.js";
import { applyPhraseFixes } from "./phrase-fixes.js";
import { DE_FIXES, EN_FIXES, ES_FIXES } from "./phrase-fix-data.js";

/**
 * Phrases du quotidien (26/10/2026) : des phrases simples et utiles, avec PLUSIEURS formulations acceptées, pour se faire
 * comprendre plutôt que pour réciter. Deux sens : français → langue étudiée (« Dites en anglais : … »), langue → français
 * (« Que signifie… ? »). Fabriquées à la demande (ids `ph~sens~id`), corrigées par la même règle que les autres exercices,
 * avec en plus une tolérance « se faire comprendre » : une réponse qui contient les concepts clés est comptée juste.
 * Dans une PhraseItem, `fr` est la phrase française et `targets` les formulations dans la langue étudiée.
 */
export interface PhraseSituation {
  id: string;
  title: string;
  topic: ExerciseTopic;
  level: CefrLevel;
}

export interface PhraseItem {
  /** Identifiant stable, ex. « en-ph-cafe-001 ». Ne change jamais. */
  id: string;
  situation: string;
  level: CefrLevel;
  /** Phrase française (l'intention à exprimer). */
  fr: string;
  /** Autres formulations françaises acceptées pour le sens langue → français. */
  frVariants?: string[];
  /** Formulations dans la langue étudiée : [0] = la plus naturelle, les autres = variantes acceptées. */
  targets: string[];
  /** Concepts à faire passer en français → langue : un groupe de mots équivalents par concept (« * » final = début de mot). */
  keys: string[][];
  /** Idem pour le sens langue → français. */
  frKeys?: string[][];
  /** Conseil bref, en français. */
  note: string;
}

export type PhraseDirection = "to-target" | "to-french" | "mixed";

export const PHRASE_SITUATIONS: Record<LanguageCode, PhraseSituation[]> = { en: EN_PHRASE_SITUATIONS, de: DE_PHRASE_SITUATIONS, es: ES_PHRASE_SITUATIONS };
export const PHRASES: Record<LanguageCode, PhraseItem[]> = {
  en: applyPhraseFixes(EN_PHRASES, EN_FIXES),
  de: applyPhraseFixes(DE_PHRASES, DE_FIXES),
  es: applyPhraseFixes(ES_PHRASES, ES_FIXES)
};

const LANGUAGE_NAMES: Record<LanguageCode, string> = { en: "anglais", de: "allemand", es: "espagnol" };
const DIRECTION_CODE = { "to-target": "tf", "to-french": "ff" } as const;
type ConcreteDirection = keyof typeof DIRECTION_CODE;

function hash(text: string): number {
  let value = 2_166_136_261;
  for (const character of text) value = Math.imul(value ^ character.charCodeAt(0), 16_777_619) >>> 0;
  return value;
}

/** Sens réel d'une phrase quand le sens demandé est « mélangé » : stable pour une même phrase. */
export function concretePhraseDirection(direction: PhraseDirection, item: PhraseItem): ConcreteDirection {
  if (direction !== "mixed") return direction;
  return hash(item.id) % 2 === 0 ? "to-target" : "to-french";
}

export const phraseDrillId = (direction: ConcreteDirection, item: PhraseItem): string => `ph~${DIRECTION_CODE[direction]}~${item.id}`;

export function phraseExercise(language: LanguageCode, item: PhraseItem, direction: ConcreteDirection): Exercise {
  const situation = PHRASE_SITUATIONS[language].find((candidate) => candidate.id === item.situation);
  const base = {
    id: phraseDrillId(direction, item), language, level: item.level, topic: situation?.topic ?? "everyday",
    skillTags: ["everyday-vocabulary"], type: "translation" as const, focus: situation?.title ?? "Phrases du quotidien"
  };
  if (direction === "to-target") {
    const others = item.targets.slice(1);
    const first = (item.targets[0]!.split(/\s+/)[0] ?? "").replace(/[¿¡.,;:!?]/g, "");
    return {
      ...base,
      prompt: `Dites en ${LANGUAGE_NAMES[language]} : « ${item.fr} »`,
      answer: item.targets[0]!,
      ...(others.length ? { acceptedAnswers: others } : {}),
      understandable: item.keys,
      explanation: `« ${item.fr} » → « ${item.targets[0]} ».${others.length ? ` Autres façons de le dire : ${others.map((variant) => `« ${variant} »`).join(", ")}.` : ""} ${item.note}`.trim(),
      hint: `L'important est de vous faire comprendre. Premier mot possible : « ${first} ».`
    };
  }
  return {
    ...base,
    prompt: `Que signifie : « ${item.targets[0]} » ?`,
    answer: item.fr,
    ...(item.frVariants?.length ? { acceptedAnswers: item.frVariants } : {}),
    ...(item.frKeys?.length ? { understandable: item.frKeys } : {}),
    audioText: item.targets[0]!,
    explanation: `« ${item.targets[0]} » = « ${item.fr} ». ${item.note}`.trim(),
    hint: "Écrivez le sens en français, avec vos mots : seul le message compte."
  };
}

export function phraseSituations(language: LanguageCode): PhraseSituation[] {
  return PHRASE_SITUATIONS[language];
}

/** Tous les exercices possibles pour un périmètre (une situation ou toutes) et un sens. */
export function phraseCandidates(language: LanguageCode, direction: PhraseDirection, situationId?: string): Exercise[] {
  return PHRASES[language]
    .filter((item) => !situationId || item.situation === situationId)
    .map((item) => phraseExercise(language, item, concretePhraseDirection(direction, item)));
}

/** Retrouve un exercice de phrase à partir de son identifiant (réponses et révisions). */
export function findPhraseExercise(id: string): Exercise | undefined {
  const [prefix, directionCode, itemId] = id.split("~");
  if (prefix !== "ph" || !itemId) return undefined;
  const direction: ConcreteDirection | undefined = directionCode === "tf" ? "to-target" : directionCode === "ff" ? "to-french" : undefined;
  if (!direction) return undefined;
  for (const language of Object.keys(PHRASES) as LanguageCode[]) {
    const item = PHRASES[language].find((candidate) => candidate.id === itemId);
    if (item) return phraseExercise(language, item, direction);
  }
  return undefined;
}

export const phraseSlug = slug;
