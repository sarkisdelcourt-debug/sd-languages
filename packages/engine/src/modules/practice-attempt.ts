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
  attemptId: string,
  options: { assisted?: boolean } = {}
) {
  const evaluation = evaluateAnswer(exercise, answer);
  if (!rememberAttempt(state, attemptId)) return { evaluation, duplicate: true };
  // « Assisté » : la correction vient d'être affichée dans cette séance et l'apprenant la recopie. La réponse reste JUSTE à l'écran,
  // mais elle ne prouve pas un savoir : pas d'XP de réussite, pas de crédit de maîtrise, et l'erreur mémorisée reste ouverte
  // jusqu'à une réussite ultérieure (audit du 26/10/2026).
  const credited = evaluation.correct && !options.assisted;
  recordPractice(state, exercise.language, credited);
  // Registre compact par exercice : permet de proposer du neuf au lieu de tourner en rond.
  const history = (state.exerciseHistory ??= {});
  // Le registre ne grossit pas sans fin : au-delà de 8 000 exercices vus, on retire les 1 000 plus anciens (audit du 26/10/2026).
  const known = Object.keys(history);
  if (known.length > 8_000) {
    known.sort((left, right) => (history[left]?.lastSeenAt ?? "").localeCompare(history[right]?.lastSeenAt ?? "")).slice(0, 1_000).forEach((id) => delete history[id]);
  }
  const seen = history[exercise.id];
  history[exercise.id] = {
    seen: (seen?.seen ?? 0) + 1,
    correct: (seen?.correct ?? 0) + (credited ? 1 : 0),
    lastSeenAt: new Date().toISOString(),
    lastCorrect: credited
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
  } else if (existingMistake && credited) {
    // Une réussite solde un échec déjà survenu, jamais un échec à venir (LANG-03) : le compteur ne dépasse pas les échecs.
    existingMistake.resolvedCount = Math.min(existingMistake.resolvedCount + 1, existingMistake.occurrenceCount);
  }
  return { evaluation, duplicate: false };
}
