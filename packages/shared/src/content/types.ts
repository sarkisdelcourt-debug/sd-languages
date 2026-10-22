import type { CefrLevel, Exercise, ExerciseTopic } from "../types.js";

export type { ExerciseTopic };

/**
 * Format des banques de contenu (22/10/2026). Les générateurs (`generators.ts`) transforment ces
 * listes en exercices ordinaires, corrigés par la même règle déterministe que les autres.
 *
 * RÈGLE D'OR : un `id` publié ne change JAMAIS (il est référencé par la mémoire des erreurs et les
 * cartes de révision des appareils). On peut corriger un texte, ajouter des éléments, pas renommer.
 */
// Thèmes : medical (anglais médical, congrès), everyday (aisance générale), travel (voyage),
// grammar (points B1–B2), phrasal-verbs, irregular-verbs, false-friends.
export type TopicExercise = Exercise & { topic: ExerciseTopic };

/** Mot ou expression avec sa traduction. `en` porte l'article si utile (« the bladder »). */
export interface VocabItem {
  en: string;
  fr: string;
}

/** Liste de vocabulaire d'un même champ : génère des paires à associer et des QCM de sens. */
export interface VocabSet {
  id: string;            // ex. "en-med-anatomy" — stable
  topic: ExerciseTopic;
  level: CefrLevel;
  title: string;         // ex. "Anatomie et organes"
  skill?: string;        // compétence de skills.ts (obligatoire hors anglais)
  items: VocabItem[];    // 8 à 24 éléments, traductions `fr` toutes différentes dans la liste
}

/**
 * Phrase modèle : génère « construire la phrase » (à partir du français) et « écouter et écrire ».
 * La phrase anglaise doit être LA traduction naturelle et non ambiguë du français (un seul ordre
 * des mots raisonnable), 5 à 14 mots, ponctuation simple (point, virgule, point d'interrogation).
 */
export interface SentenceItem {
  id: string;            // ex. "en-med-s-001" — stable
  topic: ExerciseTopic;
  level: CefrLevel;
  en: string;
  fr: string;
  skills?: string[];     // compétences de skills.ts (obligatoire hors anglais)
  note: string;          // une phrase d'explication en français (tournure, faux ami, grammaire)
}

/** Verbe à particule : génère un texte à trous en contexte et des paires à associer. */
export interface PhrasalVerbItem {
  id: string;            // ex. "en-pv-put-off" — stable
  level: CefrLevel;
  verb: string;          // « put off » (forme de base, particule comprise)
  fr: string;            // « reporter »
  example: string;       // phrase où le verbe apparaît tel quel, conjugué ou non : « We had to put off the meeting. »
  form: string;          // la forme exacte présente dans `example` : « put off » (ou « looked after »)
}

/** Verbe irrégulier : génère prétérit et participe passé. Variantes séparées par « / ». */
export interface IrregularVerbItem {
  base: string;          // « go »
  past: string;          // « went » ; « was/were » ; « learnt/learned »
  participle: string;    // « gone »
  fr: string;            // « aller »
  level: CefrLevel;
  example?: string;      // phrase au prétérit, affichée dans le drill si présente : « She went home after the scan. »
}

/** Exercice rédigé à la main, déjà au format final (id préfixé « en-hw- »). */
export type HandwrittenExercise = TopicExercise;
