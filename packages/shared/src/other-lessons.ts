import type { GuidedLessonDefinition } from "./types.js";

/**
 * Leçons guidées allemandes et espagnoles — révision 2 (22/10/2026).
 *
 * Comme pour l'anglais : 6 exercices par leçon, choisis pour l'objectif de la leçon, au niveau
 * exact (A1 pour une leçon A1), formats variés, et aucun id dans deux leçons d'une même langue.
 * Les leçons A1 allemandes s'appuient sur `content/de/beginner.ts`. Les trois premières leçons
 * espagnoles gardent leur révision 2 (`spanish-a1.ts`). Le B2 espagnol s'appuie sur `content/es/advanced.ts`.
 * Le micro-cours de la révision 1 est conservé.
 */
type LessonRevision = Pick<GuidedLessonDefinition, "id" | "revision" | "estimatedMinutes" | "exerciseIds">
  & Partial<Pick<GuidedLessonDefinition, "relevance">>;

const GERMAN: LessonRevision[] = [
  // A1
  {
    id: "lesson-de-daily-basics", revision: 2, estimatedMinutes: 10,
    exerciseIds: ["de-hw-a1-shop-pairs", "de-hw-a1-shop-build", "de-hw-a1-shop-listen", "de-hw-a1-shop-mcq-price", "de-hw-a1-shop-gap-nehmen", "de-hw-a1-shop-translation"],
    relevance: { keywords: ["brot", "wasser", "käse", "kostet", "euro", "möchte", "nehme"] }
  },
  {
    id: "lesson-de-check-in-politely", revision: 2, estimatedMinutes: 10,
    exerciseIds: ["de-hw-a1-hotel-pairs", "de-hw-a1-hotel-build", "de-hw-a1-hotel-listen", "de-a1-mcq-hotel-key", "de-hw-a1-hotel-mcq-name", "de-hw-a1-hotel-translation"],
    relevance: { keywords: ["schlüssel", "zimmer", "reservierung", "ihr", "name", "nächte"] }
  },
  {
    id: "lesson-de-build-basic-sentences", revision: 2, estimatedMinutes: 10,
    exerciseIds: ["de-hw-a1-daily-pairs", "de-hw-a1-daily-build", "de-hw-a1-daily-listen", "de-a1-mcq-present", "de-hw-a1-daily-gap-haben", "de-hw-a1-daily-translation"],
    relevance: { keywords: ["wohnen", "wohnt", "arbeite", "hat", "familie", "freund", "haus"] }
  },
  // A2
  {
    id: "lesson-de-train-ticket", revision: 2, estimatedMinutes: 12,
    exerciseIds: ["de-s-002-build", "de-s-002-listen", "de-v-station-pairs-1", "de-hw-g-006", "de-s-016-build", "de-s-016-listen"],
    relevance: { keywords: ["zug", "fahr", "bahnhof", "nach", "gleis", "fahrkarte"] }
  },
  {
    id: "lesson-de-plan-a-trip", revision: 2, estimatedMinutes: 12,
    exerciseIds: ["de-hw-g-009", "de-s-013-build", "de-s-013-listen", "de-s-001-build", "de-s-001-listen", "de-a2-translation-order"],
    relevance: { keywords: ["muss", "möchte", "morgen", "früh", "fahrkarte", "aufstehen"] }
  },
  {
    id: "lesson-de-pay-and-confirm", revision: 2, estimatedMinutes: 12,
    exerciseIds: ["de-a2-gap-shopping-dative", "de-s-018-build", "de-s-018-listen", "de-hw-g-003", "de-v-shopping-pairs-3", "de-s-023-build"],
    relevance: { keywords: ["bezahle", "karte", "mit", "helfen", "möchte", "hunger"] }
  },
  // B1
  {
    id: "lesson-de-explain-organise", revision: 2, estimatedMinutes: 15,
    exerciseIds: ["de-s-067-build", "de-s-067-listen", "de-v-work-pairs-1", "de-s-050-build", "de-s-050-listen", "de-hw-g-025"],
    relevance: { keywords: ["besprechung", "montag", "verschoben", "während", "ob", "weiß"] }
  },
  {
    id: "lesson-de-explain-a-delay", revision: 2, estimatedMinutes: 15,
    exerciseIds: ["de-s-039-build", "de-s-039-listen", "de-b1-translation-meeting-delay", "de-hw-g-024", "de-s-074-build", "de-s-074-listen"],
    relevance: { keywords: ["obwohl", "weil", "besprechung", "später", "müde", "frage"] }
  },
  {
    id: "lesson-de-explain-health-absence", revision: 2, estimatedMinutes: 15,
    exerciseIds: ["de-s-058-build", "de-s-058-listen", "de-b1-translation-pharmacy", "de-v-nuclear-die-untersuchung", "de-v-nuclear-pairs-1", "de-s-036-build"],
    relevance: { keywords: ["krank", "arzt", "ruhe", "untersuchung", "kopfschmerzen", "empfohlen", "apotheke"] }
  },
  // B2
  {
    id: "lesson-de-handle-disruption", revision: 2, estimatedMinutes: 16,
    exerciseIds: ["de-hw-g-059", "de-s-076-build", "de-s-076-listen", "de-hw-g-053", "de-b2-gap-konjunktiv", "de-hw-g-051"],
    relevance: { keywords: ["wenn", "hätte", "wäre", "würde", "zeit", "reisen"] }
  },
  {
    id: "lesson-de-propose-an-alternative", revision: 2, estimatedMinutes: 16,
    exerciseIds: ["de-hw-g-054", "de-s-089-build", "de-s-089-listen", "de-hw-g-052", "de-hw-g-060", "de-s-077-build"],
    relevance: { keywords: ["hätten", "sollen", "wenn ich du", "würde", "könnten", "arzt"] }
  },
  {
    id: "lesson-de-clarify-a-disruption", revision: 2, estimatedMinutes: 16,
    exerciseIds: ["de-b2-mcq-relative", "de-hw-g-055", "de-s-079-build", "de-s-079-listen", "de-s-087-build", "de-s-087-listen"],
    relevance: { keywords: ["der", "den", "dem", "mit dem", "befund", "zug"] }
  }
];

const SPANISH: LessonRevision[] = [
  // A2
  {
    id: "lesson-es-new-neighbour", revision: 2, estimatedMinutes: 12,
    exerciseIds: ["es-a2-translation-location", "es-s-057-build", "es-s-057-listen", "es-hw-g-027", "es-hw-g-028", "es-s-067-build"],
    relevance: { keywords: ["farmacia", "enfrente", "está", "estación", "dónde", "hay"] }
  },
  {
    id: "lesson-es-order-a-meal", revision: 2, estimatedMinutes: 12,
    exerciseIds: ["es-s-073-listen", "es-s-073-build", "es-a2-gap-market-quantity", "es-s-051-listen", "es-a2-mcq-object", "es-s-051-build"],
    relevance: { keywords: ["pan", "medio kilo", "un poco", "puede dar", "compro", "barato"] }
  },
  {
    id: "lesson-es-find-and-identify", revision: 2, estimatedMinutes: 12,
    exerciseIds: ["es-s-067-listen", "es-s-052-build", "es-s-052-listen", "es-s-056-build", "es-hw-g-030", "es-hw-g-031"],
    relevance: { keywords: ["farmacia", "supermercado", "dónde", "al lado", "llaves", "billete"] }
  },
  // B1
  {
    id: "lesson-es-experience-work", revision: 2, estimatedMinutes: 15,
    exerciseIds: ["es-b1-translation-duration", "es-s-081-build", "es-s-081-listen", "es-v-travail-bureau-pairs-1", "es-s-088-build", "es-s-088-listen"],
    relevance: { keywords: ["desde hace", "trabajaba", "reunión", "años", "mientras", "tiempo"] }
  },
  {
    id: "lesson-es-tell-career-story", revision: 2, estimatedMinutes: 15,
    exerciseIds: ["es-s-077-build", "es-s-077-listen", "es-s-079-build", "es-s-079-listen", "es-b1-gap-imperfect", "es-hw-g-053"],
    relevance: { keywords: ["llevaba", "cuando", "estaba", "de niño", "era", "llegamos"] }
  },
  {
    id: "lesson-es-explain-health-availability", revision: 2, estimatedMinutes: 15,
    exerciseIds: ["es-b1-translation-work-schedule", "es-s-087-build", "es-s-087-listen", "es-b1-translation-doctor", "es-s-084-build", "es-s-084-listen"],
    relevance: { keywords: ["jueves", "fiebre", "garganta", "debería", "descansar", "semana"] }
  },
  // B2
  {
    id: "lesson-es-negotiate-conditions", revision: 2, estimatedMinutes: 16,
    exerciseIds: ["es-hw-b2-nego-pairs", "es-hw-b2-nego-build", "es-hw-b2-nego-listen", "es-hw-b2-nego-mcq-siempre", "es-hw-b2-nego-gap-conditional", "es-hw-b2-nego-translation"],
    relevance: { keywords: ["plazo", "con tal de que", "a menos que", "siempre que", "tuviéramos", "propuesta"] }
  },
  {
    id: "lesson-es-find-a-collaborator", revision: 2, estimatedMinutes: 16,
    exerciseIds: ["es-hw-b2-profile-pairs", "es-hw-b2-profile-build", "es-hw-b2-profile-listen", "es-b2-mcq-subjunctive", "es-hw-b2-profile-gap-saber", "es-hw-b2-profile-translation"],
    relevance: { keywords: ["candidato", "alguien que", "busco", "buscamos", "nadie que", "persona que"] }
  },
  {
    id: "lesson-es-explain-a-missed-deadline", revision: 2, estimatedMinutes: 16,
    exerciseIds: ["es-hw-b2-late-build", "es-hw-b2-late-listen", "es-hw-b2-late-translation", "es-hw-b2-late-mcq-meeting", "es-b2-gap-pluperfect", "es-b2-mcq-flight-counterfactual"],
    relevance: { keywords: ["hubiéramos", "habríamos", "había", "habían", "informe", "reunión", "vuelo"] }
  }
];

export const OTHER_LANGUAGE_LESSON_REVISIONS: LessonRevision[] = [...GERMAN, ...SPANISH];
