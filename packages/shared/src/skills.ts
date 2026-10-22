import type { ExerciseTopic, LanguageCode } from "./types.js";

/**
 * Carte de compétences (22/10/2026) : liste FERMÉE des micro-compétences par langue. Chaque exercice
 * porte un ou plusieurs `skillTags` pris dans la liste de sa langue (le test `skills.test.ts` refuse
 * tout tag inconnu). Les compétences d'une langue sont indépendantes de celles des autres, même quand
 * l'identifiant est le même (« modals » en anglais et en allemand sont deux compétences distinctes).
 * `topic` relie une compétence à un thème des « Exercices ciblés » quand il existe (série par thème) ;
 * sinon la série ciblée se fait par `skillTags`.
 */
export type SkillGroup = "grammar" | "vocabulary" | "communication";

export interface SkillDefinition {
  id: string;
  label: string;
  group: SkillGroup;
  topic?: ExerciseTopic;
}

export const SKILL_GROUP_LABELS: Record<SkillGroup, string> = {
  grammar: "Grammaire et conjugaison",
  vocabulary: "Vocabulaire",
  communication: "Comprendre et produire"
};

export const SKILLS: Record<LanguageCode, SkillDefinition[]> = {
  en: [
    { id: "present-simple", label: "Présent simple (be, have, has)", group: "grammar" },
    { id: "questions", label: "Poser une question (directe ou indirecte)", group: "grammar" },
    { id: "articles", label: "Articles (a, an, the, Ø)", group: "grammar" },
    { id: "prepositions", label: "Prépositions (on, at, in, to)", group: "grammar" },
    { id: "comparatives", label: "Comparatifs et superlatifs", group: "grammar" },
    { id: "quantifiers", label: "Some, any et quantités", group: "grammar" },
    { id: "irregular-past", label: "Prétérit des verbes irréguliers", group: "grammar", topic: "irregular-verbs" },
    { id: "past-participles", label: "Participes passés irréguliers", group: "grammar", topic: "irregular-verbs" },
    { id: "present-perfect", label: "Present perfect (since, for, so far)", group: "grammar" },
    { id: "past-tenses", label: "Prétérit, past continuous, used to", group: "grammar" },
    { id: "future-forms", label: "Futur (will, going to, présent continu)", group: "grammar" },
    { id: "modals", label: "Modaux (should, must, have to)", group: "grammar" },
    { id: "conditionals", label: "Conditionnels (if…)", group: "grammar" },
    { id: "passive-voice", label: "Voix passive", group: "grammar" },
    { id: "reported-speech", label: "Discours indirect", group: "grammar" },
    { id: "gerund-infinitive", label: "Gérondif ou infinitif", group: "grammar" },
    { id: "phrasal-verbs", label: "Phrasal verbs", group: "vocabulary", topic: "phrasal-verbs" },
    { id: "false-friends", label: "Faux amis", group: "vocabulary", topic: "false-friends" },
    { id: "medical-vocabulary", label: "Vocabulaire médical et scientifique", group: "vocabulary", topic: "medical" },
    { id: "everyday-vocabulary", label: "Vocabulaire et tournures du quotidien", group: "vocabulary", topic: "everyday" },
    { id: "travel-vocabulary", label: "Vocabulaire du voyage", group: "vocabulary", topic: "travel" },
    { id: "polite-requests", label: "Demandes et formules polies", group: "communication" },
    { id: "listening", label: "Compréhension orale (dictées)", group: "communication" },
    { id: "sentence-building", label: "Construire une phrase", group: "communication" }
  ],
  de: [
    { id: "present-tense", label: "Présent des verbes", group: "grammar" },
    { id: "verb-second", label: "Verbe en deuxième position", group: "grammar" },
    { id: "articles-gender", label: "Genre et articles", group: "grammar" },
    { id: "accusative", label: "Accusatif", group: "grammar" },
    { id: "dative", label: "Datif (mit, relatif au datif)", group: "grammar" },
    { id: "possessives", label: "Possessifs (Ihr, mein…)", group: "grammar" },
    { id: "modals", label: "Verbes modaux", group: "grammar" },
    { id: "perfekt", label: "Perfekt", group: "grammar" },
    { id: "subordinate-clauses", label: "Subordonnées (weil…)", group: "grammar" },
    { id: "relative-clauses", label: "Propositions relatives", group: "grammar" },
    { id: "konjunktiv-2", label: "Konjunktiv II (hypothèse, politesse)", group: "grammar" },
    { id: "konjunktiv-1", label: "Konjunktiv I et discours indirect", group: "grammar" },
    { id: "passive-voice", label: "Passif", group: "grammar" },
    { id: "separable-verbs", label: "Verbes à particule séparable", group: "grammar" },
    { id: "comparison", label: "Comparaison (je…, desto…)", group: "grammar" },
    { id: "travel-vocabulary", label: "Voyage, gare et hôtel", group: "vocabulary" },
    { id: "health-vocabulary", label: "Santé et pharmacie", group: "vocabulary" },
    { id: "work-vocabulary", label: "Travail et réunions", group: "vocabulary" },
    { id: "everyday-vocabulary", label: "Vocabulaire et tournures du quotidien", group: "vocabulary" },
    { id: "listening", label: "Compréhension orale (dictées)", group: "communication" },
    { id: "sentence-building", label: "Construire une phrase", group: "communication" }
  ],
  es: [
    { id: "ser-estar", label: "Ser et estar", group: "grammar" },
    { id: "present-tense", label: "Présent de l'indicatif", group: "grammar" },
    { id: "articles-gender", label: "Genre et articles", group: "grammar" },
    { id: "numbers", label: "Nombres", group: "grammar" },
    { id: "object-pronouns", label: "Pronoms compléments (lo, la…)", group: "grammar" },
    { id: "quantities", label: "Quantités (medio kilo de…)", group: "grammar" },
    { id: "preterite", label: "Passé simple (pretérito indefinido)", group: "grammar" },
    { id: "imperfect", label: "Imparfait", group: "grammar" },
    { id: "duration", label: "Durée (desde hace…)", group: "grammar" },
    { id: "obligation", label: "Obligation (tener que, deber)", group: "grammar" },
    { id: "subjunctive", label: "Subjonctif", group: "grammar" },
    { id: "pluperfect-conditional", label: "Plus-que-parfait et hypothèse passée", group: "grammar" },
    { id: "introductions", label: "Se présenter et saluer", group: "communication" },
    { id: "location", label: "Localiser (¿dónde está…?)", group: "communication" },
    { id: "polite-requests", label: "Demander poliment", group: "communication" },
    { id: "listening", label: "Compréhension orale (dictées)", group: "communication" },
    { id: "sentence-building", label: "Construire une phrase", group: "communication" },
    { id: "hotel-travel-vocabulary", label: "Hôtel et voyage", group: "vocabulary" },
    { id: "family-vocabulary", label: "Famille et entourage", group: "vocabulary" },
    { id: "health-vocabulary", label: "Santé et symptômes", group: "vocabulary" },
    { id: "work-vocabulary", label: "Travail et échéances", group: "vocabulary" },
    { id: "everyday-vocabulary", label: "Vocabulaire et tournures du quotidien", group: "vocabulary" }
  ]
};

export function skillIds(language: LanguageCode): Set<string> {
  return new Set(SKILLS[language].map((skill) => skill.id));
}

export function findSkill(language: LanguageCode, id: string): SkillDefinition | undefined {
  return SKILLS[language].find((skill) => skill.id === id);
}
