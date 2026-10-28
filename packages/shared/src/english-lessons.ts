import type { GuidedLessonDefinition } from "./types.js";

/**
 * Leçons guidées anglaises.
 *
 * Révision 3 (22/10/2026) : les 6 exercices de chaque leçon sont choisis pour son objectif, au
 * niveau exact de la leçon (A1 pour une leçon A1), et aucun id n'apparaît dans deux leçons. Les
 * leçons A1 et deux leçons A2 s'appuient sur la banque rédigée `content/en/beginner.ts`. Chaque
 * leçon déclare sa `relevance` (mots-clés, thèmes) que le test de pertinence vérifie.
 *
 * Révision 2 (22/10/2026, retirée) : 6 exercices tirés de la banque, 4 propres, 4 formats — mais
 * choisis pour ces contraintes plus que pour l'objectif (A1 faites d'exercices A2, hors sujet).
 * Elle reste lisible pour une séance en cours (RETIRED_LESSON_REVISIONS). Le micro-cours de la
 * révision 1 reste valable et est conservé.
 */
type EnglishLessonRevision = Pick<GuidedLessonDefinition, "id" | "revision" | "estimatedMinutes" | "exerciseIds">
  & Partial<Pick<GuidedLessonDefinition, "relevance">>;

const REVISION_2: EnglishLessonRevision[] = [
  { id: "lesson-en-daily-basics", revision: 2, estimatedMinutes: 10, exerciseIds: ["en-gen-v-hotel-restaurant-pairs-1", "en-a1-mcq-have", "en-trv-s-007-build", "en-trv-s-008-listen", "en-a1-gap-plural", "en-trv-s-040-build"] },
  { id: "lesson-en-ask-and-clarify", revision: 2, estimatedMinutes: 10, exerciseIds: ["en-a1-mcq-airport-gate", "en-trv-s-028-build", "en-trv-s-029-listen", "en-gen-v-transport-pairs-1", "en-irr-be-past", "en-trv-s-031-build"] },
  { id: "lesson-en-count-and-describe", revision: 2, estimatedMinutes: 10, exerciseIds: ["en-gen-v-hotel-restaurant-pairs-2", "en-a1-gap-plural", "en-trv-s-017-listen", "en-irr-have-past", "en-trv-s-026-build", "en-a1-mcq-have"] },
  { id: "lesson-en-routine-travel", revision: 2, estimatedMinutes: 12, exerciseIds: ["en-gen-v-hotel-restaurant-pairs-3", "en-a2-translation-routine", "en-trv-s-002-build", "en-a2-mcq-comparative", "en-trv-s-005-listen", "en-trv-s-039-build"] },
  { id: "lesson-en-compare-options", revision: 2, estimatedMinutes: 12, exerciseIds: ["en-gen-v-transport-pairs-2", "en-hw-g-056", "en-a2-gap-grocery-any", "en-trv-s-003-build", "en-hw-g-058", "en-trv-s-021-listen"] },
  { id: "lesson-en-state-routine-and-needs", revision: 2, estimatedMinutes: 12, exerciseIds: ["en-gen-v-transport-pairs-3", "en-a2-translation-routine", "en-trv-s-025-build", "en-irr-take-past", "en-trv-s-024-listen", "en-trv-s-038-build"] },
  { id: "lesson-en-project-update", revision: 2, estimatedMinutes: 15, exerciseIds: ["en-hw-g-001", "en-b1-gap-since", "en-day-s-031-build", "en-hw-g-007", "en-day-s-018-listen", "en-b1-translation-report-deadline"] },
  { id: "lesson-en-give-advice-and-request", revision: 2, estimatedMinutes: 15, exerciseIds: ["en-gen-v-conversation-pairs-1", "en-hw-g-023", "en-day-s-043-build", "en-hw-g-021", "en-day-s-014-listen", "en-b1-translation-advice"] },
  { id: "lesson-en-explain-availability", revision: 2, estimatedMinutes: 15, exerciseIds: ["en-gen-v-conversation-pairs-2", "en-hw-g-004", "en-day-s-012-build", "en-hw-g-020", "en-day-s-041-listen", "en-b1-translation-doctor-appointment"] },
  { id: "lesson-en-handle-setback", revision: 2, estimatedMinutes: 16, exerciseIds: ["en-gen-v-emotions-pairs-1", "en-b2-mcq-missed-flight", "en-hw-g-029", "en-day-s-050-build", "en-trv-s-020-listen", "en-hw-g-030"] },
  { id: "lesson-en-report-and-regret", revision: 2, estimatedMinutes: 16, exerciseIds: ["en-hw-g-036", "en-b2-gap-wish", "en-day-s-021-build", "en-hw-g-038", "en-day-s-048-listen", "en-hw-g-037"] },
  { id: "lesson-en-analyse-missed-connection", revision: 2, estimatedMinutes: 16, exerciseIds: ["en-gen-v-emotions-pairs-2", "en-b2-mcq-reported", "en-trv-s-013-build", "en-hw-g-028", "en-trv-s-037-listen", "en-hw-g-040"] }
];

const REVISION_3: EnglishLessonRevision[] = [
  // A1
  {
    id: "lesson-en-daily-basics", revision: 3, estimatedMinutes: 10,
    // Commander au café : I would like, Can I have, comprendre « for here or to take away ».
    exerciseIds: ["en-hw-a1-cafe-pairs", "en-hw-a1-cafe-build", "en-hw-a1-cafe-listen", "en-hw-a1-cafe-mcq-here", "en-hw-a1-cafe-gap-have", "en-hw-a1-cafe-translation"],
    relevance: { keywords: ["coffee", "tea", "sandwich", "would like", "for here", "take away", "something to eat"] }
  },
  {
    id: "lesson-en-ask-and-clarify", revision: 3, estimatedMinutes: 10,
    // Questions avec be (Where is…?) et information personnelle courte (I am from…).
    exerciseIds: ["en-a1-mcq-airport-gate", "en-hw-a1-ask-build", "en-hw-a1-ask-listen", "en-hw-a1-ask-gap-am", "en-hw-a1-ask-translation", "en-hw-a1-ask-pairs"],
    relevance: { keywords: ["where", "from", "my name", "gate", "when", "who", "how much"] }
  },
  {
    id: "lesson-en-count-and-describe", revision: 3, estimatedMinutes: 10,
    // Has, nombres et pluriels (children, brothers, sisters).
    exerciseIds: ["en-a1-mcq-have", "en-a1-gap-plural", "en-hw-a1-family-pairs", "en-hw-a1-family-build", "en-hw-a1-family-listen", "en-hw-a1-family-translation"],
    relevance: { keywords: ["has", "child", "children", "brother", "sister", "parents", "two", "three"] }
  },
  // A2
  {
    id: "lesson-en-routine-travel", revision: 3, estimatedMinutes: 12,
    // Habitudes (usually) et informations utiles à l'hôtel (breakfast, check out, pillow).
    exerciseIds: ["en-a2-translation-routine", "en-trv-s-002-build", "en-trv-s-006-listen", "en-gen-v-hotel-restaurant-pairs-1", "en-gen-v-hotel-restaurant-to-check-in", "en-trv-s-039-build"],
    relevance: { keywords: ["usually", "breakfast", "check out", "check in", "reservation", "front desk", "room key", "pillow", "bus"] }
  },
  {
    id: "lesson-en-compare-options", revision: 3, estimatedMinutes: 12,
    // Comparatif (cheaper than, better, bigger) et some/any.
    exerciseIds: ["en-a2-mcq-comparative", "en-a2-gap-grocery-any", "en-hw-a2-compare-build", "en-hw-a2-compare-listen", "en-hw-a2-compare-pairs", "en-hw-a2-compare-translation"],
    relevance: { keywords: ["than", "cheaper", "better", "bigger", "more", "any", "some"] }
  },
  {
    id: "lesson-en-state-routine-and-needs", revision: 3, estimatedMinutes: 12,
    // Adverbes de fréquence puis demande concrète (Can I…, Could I have…, something for…).
    exerciseIds: ["en-trv-s-005-build", "en-trv-s-025-listen", "en-gen-v-hotel-restaurant-pairs-2", "en-hw-a2-routine-gap-usually", "en-hw-a2-request-mcq", "en-hw-a2-routine-translation"],
    relevance: { keywords: ["usually", "could i", "can i", "something for", "towel", "napkin", "luggage", "sore throat"] }
  },
  // B1
  {
    id: "lesson-en-project-update", revision: 3, estimatedMinutes: 15,
    // Present perfect (since, for, so far), échéances et créneaux de travail.
    exerciseIds: ["en-b1-gap-since", "en-b1-translation-report-deadline", "en-hw-g-001", "en-hw-g-007", "en-day-s-011-listen", "en-med-s-047-build"],
    relevance: { keywords: ["since", "so far", "has been", "have been", "report", "friday", "thursday", "tomorrow", "deadline", "project"] }
  },
  {
    id: "lesson-en-give-advice-and-request", revision: 3, estimatedMinutes: 15,
    // Conseil (should, had better), obligation (have to, mustn't) et demande polie (Could you…).
    exerciseIds: ["en-b1-translation-advice", "en-hw-g-023", "en-hw-g-021", "en-med-s-041-build", "en-day-s-014-listen", "en-pv-call-back-gap"],
    relevance: { keywords: ["should", "could you", "let me know", "call back", "have to", "mustn't", "conseil"] }
  },
  {
    id: "lesson-en-explain-availability", revision: 3, estimatedMinutes: 15,
    // Rendez-vous, disponibilité, projet déjà fixé (are flying on Friday), when + présent.
    exerciseIds: ["en-b1-translation-doctor-appointment", "en-day-s-041-listen", "en-day-s-029-build", "en-hw-g-020", "en-hw-g-018", "en-med-v-hospital-pairs-2"],
    relevance: { keywords: ["appointment", "free", "arrive", "on friday", "booked", "running late", "busy", "available"] }
  },
  // B2
  {
    id: "lesson-en-handle-setback", revision: 3, estimatedMinutes: 16,
    // Troisième conditionnel, imprévu (delayed), nuance émotionnelle.
    exerciseIds: ["en-b2-mcq-missed-flight", "en-hw-g-029", "en-hw-g-030", "en-day-s-050-listen", "en-med-s-050-build", "en-gen-v-emotions-pairs-1"],
    relevance: { keywords: ["if ", "had", "would have", "wouldn't have", "delayed", "missed", "second opinion", "relieved", "upset", "disappointed"] }
  },
  {
    id: "lesson-en-report-and-regret", revision: 3, estimatedMinutes: 16,
    // Discours indirect (said, told, would) et regret (wish, didn't mean to).
    exerciseIds: ["en-b2-gap-wish", "en-hw-g-036", "en-hw-g-037", "en-hw-g-038", "en-day-s-021-build", "en-day-s-048-listen"],
    relevance: { keywords: ["said", "told", "wish", "mean to", "keep you posted", "would call"] }
  },
  {
    id: "lesson-en-analyse-missed-connection", revision: 3, estimatedMinutes: 16,
    // Reconstruire la cause (if + past perfect, must have), rapporter (said, asked), vérifier (wasn't it…?).
    exerciseIds: ["en-b2-mcq-reported", "en-hw-g-028", "en-hw-g-040", "en-day-s-015-build", "en-day-s-036-listen", "en-hw-g-025"],
    relevance: { keywords: ["said", "asked", "if ", "had", "would have", "must have", "wasn't it", "hadn't", "correct me"] }
  }
];

/**
 * Révision 4 (28/10/2026) : audit indépendant. Cinq leçons changent un ou deux exercices, la
 * révision 3 restant jouable à l'identique (RETIRED_LESSON_REVISIONS) :
 * - « Expliquer une indisponibilité » gagne un exercice de durée (« How long have you been waiting? »)
 *   à la place du vocabulaire hospitalier, hors sujet ;
 * - les leçons de café, de questions, de famille et de comparaison proposaient la construction ET la
 *   dictée de la même phrase : la construction est remplacée par un exercice d'un autre format.
 */
const REVISION_4: EnglishLessonRevision[] = [
{
    id: "lesson-en-explain-availability", revision: 4, estimatedMinutes: 15,
    exerciseIds: ["en-b1-translation-doctor-appointment", "en-day-s-041-listen", "en-day-s-029-build", "en-hw-g-020", "en-hw-g-018", "en-hw-g-010"],
    relevance: { keywords: ["appointment", "free", "arrive", "on friday", "booked", "running late", "busy", "available", "how long", "since"] }
  },
  {
    id: "lesson-en-daily-basics", revision: 4, estimatedMinutes: 10,
    exerciseIds: ["en-hw-a1-cafe-pairs", "en-hw-a1-cafe-gap-like", "en-hw-a1-cafe-listen", "en-hw-a1-cafe-mcq-here", "en-hw-a1-cafe-gap-have", "en-hw-a1-cafe-translation"],
    relevance: { keywords: ["coffee", "tea", "sandwich", "would like", "for here", "take away", "something to eat"] }
  },
  {
    id: "lesson-en-ask-and-clarify", revision: 4, estimatedMinutes: 10,
    exerciseIds: ["en-a1-mcq-airport-gate", "en-hw-a1-ask-mcq-where", "en-hw-a1-ask-listen", "en-hw-a1-ask-gap-am", "en-hw-a1-ask-translation", "en-hw-a1-ask-pairs"],
    relevance: { keywords: ["where", "from", "my name", "gate", "when", "who", "how much"] }
  },
  {
    id: "lesson-en-count-and-describe", revision: 4, estimatedMinutes: 10,
    exerciseIds: ["en-a1-mcq-have", "en-a1-gap-plural", "en-hw-a1-family-pairs", "en-hw-a1-family-gap-has", "en-hw-a1-family-listen", "en-hw-a1-family-translation"],
    relevance: { keywords: ["has", "child", "children", "brother", "sister", "parents", "two", "three"] }
  },
  {
    id: "lesson-en-compare-options", revision: 4, estimatedMinutes: 12,
    exerciseIds: ["en-a2-mcq-comparative", "en-a2-gap-grocery-any", "en-hw-a2-compare-mcq-than", "en-hw-a2-compare-listen", "en-hw-a2-compare-pairs", "en-hw-a2-compare-translation"],
    relevance: { keywords: ["than", "cheaper", "better", "bigger", "more", "any", "some"] }
  }
];

/** Toutes les révisions publiées après la première, de la plus ancienne à la plus récente. */
export const ENGLISH_LESSON_REVISIONS: EnglishLessonRevision[] = [...REVISION_2, ...REVISION_3, ...REVISION_4];
