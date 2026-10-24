import { createReviewCard, evaluateAnswer } from "../../../shared/src/learning.js";
import type { Exercise, LearnerState, MistakeRecord } from "../../../shared/src/types.js";
import { recordPractice } from "./progress.js";

/** Retient une tentative déjà comptée (les 1 000 dernières) ; faux si elle l'était déjà : un rejeu ne compte pas deux fois. */
export function rememberAttempt(state: LearnerState, attemptId: string): boolean {
  if (state.processedAttemptIds.includes(attemptId)) return false;
  state.processedAttemptIds.push(attemptId);
  if (state.processedAttemptIds.length > 1_000) {
    state.processedAttemptIds.splice(0, state.processedAttemptIds.length - 1_000);
  }
  return true;
}

export function applyPracticeAttempt(
  state: LearnerState,
  exercise: Exercise,
  answer: string,
  attemptId: string
) {
  const evaluation = evaluateAnswer(exercise, answer);
  if (!rememberAttempt(state, attemptId)) return { evaluation, duplicate: true };
  recordPractice(state, exercise.language, evaluation.correct);
  // Registre compact par exercice : permet de proposer du neuf au lieu de tourner en rond.
  const history = (state.exerciseHistory ??= {});
  const seen = history[exercise.id];
  history[exercise.id] = {
    seen: (seen?.seen ?? 0) + 1,
    correct: (seen?.correct ?? 0) + (evaluation.correct ? 1 : 0),
    lastSeenAt: new Date().toISOString(),
    lastCorrect: evaluation.correct
  };
  const mistakeId = `mistake-${exercise.id}`;
  const existingMistake = state.mistakes.find((mistake) => mistake.id === mistakeId);
  if (!evaluation.correct) {
    const now = new Date().toISOString();
    if (existingMistake) {
      existingMistake.occurrenceCount += 1;
      existingMistake.lastSeenAt = now;
      existingMistake.submittedAnswer = answer;
      existingMistake.kind = evaluation.issues[0]?.kind;
    } else {
      const mistake: MistakeRecord = {
        id: mistakeId,
        exerciseId: exercise.id,
        language: exercise.language,
        submittedAnswer: answer,
        expectedAnswer: exercise.answer,
        focus: exercise.focus,
        kind: evaluation.issues[0]?.kind,
        occurrenceCount: 1,
        resolvedCount: 0,
        firstSeenAt: now,
        lastSeenAt: now
      };
      state.mistakes.push(mistake);
    }
    if (!state.reviewCards.some((card) => card.sourceExerciseId === exercise.id)) {
      state.reviewCards.push(createReviewCard(exercise));
    }
  } else if (existingMistake) {
    // Une réussite solde un échec déjà survenu, jamais un échec à venir (LANG-03) : le compteur ne dépasse pas les échecs.
    existingMistake.resolvedCount = Math.min(existingMistake.resolvedCount + 1, existingMistake.occurrenceCount);
  }
  return { evaluation, duplicate: false };
}
