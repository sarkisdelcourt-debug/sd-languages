import { createReviewCard, evaluateAnswer } from "../../../../packages/shared/src/learning.js";
import type { Exercise, LearnerState, MistakeRecord } from "../../../../packages/shared/src/types.js";
import { recordPractice } from "./progress.js";

export function applyPracticeAttempt(
  state: LearnerState,
  exercise: Exercise,
  answer: string,
  attemptId: string
) {
  const evaluation = evaluateAnswer(exercise, answer);
  if (state.processedAttemptIds.includes(attemptId)) return { evaluation, duplicate: true };

  state.processedAttemptIds.push(attemptId);
  if (state.processedAttemptIds.length > 1_000) {
    state.processedAttemptIds.splice(0, state.processedAttemptIds.length - 1_000);
  }
  recordPractice(state, exercise.language, evaluation.correct);
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
    existingMistake.resolvedCount += 1;
  }
  return { evaluation, duplicate: false };
}
