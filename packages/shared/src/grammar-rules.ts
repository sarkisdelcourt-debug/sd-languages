import type { CefrLevel, LanguageCode } from "./types.js";
import { EN_RULES } from "./rules/en.js";
import { DE_RULES } from "./rules/de.js";
import { ES_RULES } from "./rules/es.js";

/**
 * Fiches de règles (24/10/2026) : grammaire générale, accords, genre, cas, formation du vocabulaire. Une fiche explique la
 * règle en français, donne un tableau, des exemples et les pièges ; « S'entraîner » lance une série ciblée sur ses compétences.
 * RÈGLE D'OR : l'`id` d'une fiche ne change jamais.
 */
export interface RuleTable {
  caption?: string;
  head: string[];
  rows: string[][];
}

export interface RuleSection {
  heading?: string;
  /** Un paragraphe d'explication, en français. */
  text?: string;
  /** Une liste de points courts. */
  points?: string[];
  table?: RuleTable;
}

export interface RuleExample {
  target: string;
  translation: string;
  /** Ce qu'il faut remarquer dans l'exemple. */
  note?: string;
}

export interface GrammarRule {
  id: string;
  language: LanguageCode;
  level: CefrLevel;
  /** Rubrique d'affichage : « Premiers pas », « Genre et articles », « Cas », « Verbes », « Vocabulaire »… */
  group: string;
  /** Ordre d'affichage dans la langue (croissant). */
  order: number;
  title: string;
  /** Une phrase qui dit l'essentiel. */
  summary: string;
  sections: RuleSection[];
  examples: RuleExample[];
  pitfalls?: string[];
  /** Compétences (skills.ts) de la langue travaillées par la fiche ; la première lance « S'entraîner ». */
  skills: string[];
}

export const GRAMMAR_RULES: GrammarRule[] = [...EN_RULES, ...DE_RULES, ...ES_RULES];

export function rulesFor(language: LanguageCode): GrammarRule[] {
  return GRAMMAR_RULES.filter((rule) => rule.language === language).sort((a, b) => a.order - b.order);
}
