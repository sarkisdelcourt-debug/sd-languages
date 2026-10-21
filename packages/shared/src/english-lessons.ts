import type { GuidedLessonDefinition } from "./types.js";

/**
 * Leçons guidées anglaises, révision 2 (22/10/2026) : chaque leçon reçoit 6 exercices tirés de la
 * banque anglaise (content/en), au moins 4 qui lui sont propres et au moins 4 formats, comme la
 * tranche espagnol A1. Le micro-cours de la révision 1 reste valable et est conservé.
 * Une séance commencée en révision 1 (ex. « Faire un point projet clair ») se termine telle quelle.
 */
type EnglishLessonRevision = Pick<GuidedLessonDefinition, "id" | "revision" | "estimatedMinutes" | "exerciseIds">;

export const ENGLISH_LESSON_REVISIONS: EnglishLessonRevision[] = [
  // A1
  {
    id: "lesson-en-daily-basics", revision: 2, estimatedMinutes: 10,
    exerciseIds: ["en-gen-v-hotel-restaurant-pairs-1", "en-a1-mcq-have", "en-trv-s-007-build", "en-trv-s-008-listen", "en-a1-gap-plural", "en-trv-s-040-build"]
  },
  {
    id: "lesson-en-ask-and-clarify", revision: 2, estimatedMinutes: 10,
    exerciseIds: ["en-a1-mcq-airport-gate", "en-trv-s-028-build", "en-trv-s-029-listen", "en-gen-v-transport-pairs-1", "en-irr-be-past", "en-trv-s-031-build"]
  },
  {
    id: "lesson-en-count-and-describe", revision: 2, estimatedMinutes: 10,
    exerciseIds: ["en-gen-v-hotel-restaurant-pairs-2", "en-a1-gap-plural", "en-trv-s-017-listen", "en-irr-have-past", "en-trv-s-026-build", "en-a1-mcq-have"]
  },
  // A2
  {
    id: "lesson-en-routine-travel", revision: 2, estimatedMinutes: 12,
    exerciseIds: ["en-gen-v-hotel-restaurant-pairs-3", "en-a2-translation-routine", "en-trv-s-002-build", "en-a2-mcq-comparative", "en-trv-s-005-listen", "en-trv-s-039-build"]
  },
  {
    id: "lesson-en-compare-options", revision: 2, estimatedMinutes: 12,
    exerciseIds: ["en-gen-v-transport-pairs-2", "en-hw-g-056", "en-a2-gap-grocery-any", "en-trv-s-003-build", "en-hw-g-058", "en-trv-s-021-listen"]
  },
  {
    id: "lesson-en-state-routine-and-needs", revision: 2, estimatedMinutes: 12,
    exerciseIds: ["en-gen-v-transport-pairs-3", "en-a2-translation-routine", "en-trv-s-025-build", "en-irr-take-past", "en-trv-s-024-listen", "en-trv-s-038-build"]
  },
  // B1
  {
    id: "lesson-en-project-update", revision: 2, estimatedMinutes: 15,
    exerciseIds: ["en-hw-g-001", "en-b1-gap-since", "en-day-s-031-build", "en-hw-g-007", "en-day-s-018-listen", "en-b1-translation-report-deadline"]
  },
  {
    id: "lesson-en-give-advice-and-request", revision: 2, estimatedMinutes: 15,
    exerciseIds: ["en-gen-v-conversation-pairs-1", "en-hw-g-023", "en-day-s-043-build", "en-hw-g-021", "en-day-s-014-listen", "en-b1-translation-advice"]
  },
  {
    id: "lesson-en-explain-availability", revision: 2, estimatedMinutes: 15,
    exerciseIds: ["en-gen-v-conversation-pairs-2", "en-hw-g-004", "en-day-s-012-build", "en-hw-g-020", "en-day-s-041-listen", "en-b1-translation-doctor-appointment"]
  },
  // B2
  {
    id: "lesson-en-handle-setback", revision: 2, estimatedMinutes: 16,
    exerciseIds: ["en-gen-v-emotions-pairs-1", "en-b2-mcq-missed-flight", "en-hw-g-029", "en-day-s-050-build", "en-trv-s-020-listen", "en-hw-g-030"]
  },
  {
    id: "lesson-en-report-and-regret", revision: 2, estimatedMinutes: 16,
    exerciseIds: ["en-hw-g-036", "en-b2-gap-wish", "en-day-s-021-build", "en-hw-g-038", "en-day-s-048-listen", "en-hw-g-037"]
  },
  {
    id: "lesson-en-analyse-missed-connection", revision: 2, estimatedMinutes: 16,
    exerciseIds: ["en-gen-v-emotions-pairs-2", "en-b2-mcq-reported", "en-trv-s-013-build", "en-hw-g-028", "en-trv-s-037-listen", "en-hw-g-040"]
  }
];
