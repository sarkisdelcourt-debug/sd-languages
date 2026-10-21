import type { LearnerState } from "../../shared/src/types.js";
import { createInitialState } from "./initial-state.js";

export const CURRENT_STATE_VERSION = 5;

/** Port de persistance : fichier JSON côté Node, IndexedDB côté navigateur. */
export interface StateStore {
  read(): Promise<LearnerState>;
  update<T>(mutation: (state: LearnerState) => T | Promise<T>): Promise<T>;
}

/**
 * Complète un profil issu d'une version antérieure. Les champs absents reçoivent des valeurs sûres
 * et les registres compacts sont reconstruits à partir de l'historique lorsque c'est possible.
 */
export function migrateState(value: Partial<LearnerState>): LearnerState {
  const sourceVersion = typeof value.version === "number" ? value.version : 1;
  if (sourceVersion > CURRENT_STATE_VERSION) throw new Error(`Version de données non prise en charge : ${sourceVersion}.`);
  const initial = createInitialState();
  const settings: LearnerState["settings"] = {
    en: { ...initial.settings.en, ...(value.settings?.en ?? {}) },
    de: { ...initial.settings.de, ...(value.settings?.de ?? {}) },
    es: { ...initial.settings.es, ...(value.settings?.es ?? {}) }
  };
  const lessonSessions = value.lessonSessions ?? [];
  const derivedLessonProgress: LearnerState["lessonProgress"] = { ...(value.lessonProgress ?? {}) };
  for (const session of lessonSessions) {
    if (session.status !== "completed" || !session.completedAt || !session.summary || session.summary.outcome === "abandoned") continue;
    if (derivedLessonProgress[session.lessonId]) continue;
    const inferredOutcome = session.summary.outcome ?? (
      session.summary.incorrect === 0
      && session.summary.exact >= Math.ceil(session.summary.completedExercises * 2 / 3)
      && session.summary.conversationSteps >= Math.min(3, session.summary.conversationGoal)
        ? "mastered"
        : "needs-review"
    );
    derivedLessonProgress[session.lessonId] = {
      lessonId: session.lessonId,
      completions: 1,
      masteryCount: inferredOutcome === "mastered" ? 1 : 0,
      bestExact: session.summary.exact,
      lastCompletedAt: session.completedAt,
      lastOutcome: inferredOutcome === "mastered" ? "mastered" : "needs-review"
    };
  }
  const pronunciationAttempts = Array.isArray(value.pronunciationAttempts)
    ? value.pronunciationAttempts.filter((attempt) => (
        typeof attempt?.attemptId === "string"
        && typeof attempt?.promptId === "string"
        && (attempt?.language === "en" || attempt?.language === "de" || attempt?.language === "es")
        && typeof attempt?.score === "number"
        && typeof attempt?.createdAt === "string"
      )).slice(-100)
    : [];
  const pronunciationProgress: LearnerState["pronunciationProgress"] = {
    ...(value.pronunciationProgress ?? {})
  };
  for (const attempt of pronunciationAttempts) {
    const current = pronunciationProgress[attempt.promptId];
    if (current) continue;
    pronunciationProgress[attempt.promptId] = {
      promptId: attempt.promptId,
      attempts: 1,
      bestScore: attempt.score,
      lastScore: attempt.score,
      masteryCount: attempt.mastered ? 1 : 0,
      lastPracticedAt: attempt.createdAt
    };
  }
  return {
    ...initial,
    ...value,
    version: CURRENT_STATE_VERSION,
    progress: { ...initial.progress, ...(value.progress ?? {}) },
    conversations: { ...initial.conversations, ...(value.conversations ?? {}) },
    settings,
    mistakes: value.mistakes ?? [],
    reviewCards: value.reviewCards ?? [],
    processedAttemptIds: value.processedAttemptIds ?? [],
    lessonSessions,
    lessonProgress: derivedLessonProgress,
    pronunciationAttempts,
    pronunciationProgress
  };
}
