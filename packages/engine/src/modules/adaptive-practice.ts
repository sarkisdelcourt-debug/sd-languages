import type { CefrLevel, Exercise, LanguageCode, LearnerState, LearningGoal } from "../../../shared/src/types.js";

const LEVEL_RANK: Record<CefrLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };

export interface RankedExercise {
  exercise: Exercise;
  score: number;
  recommendationReason: string;
}

function stableDailyTieBreaker(id: string, now: Date): number {
  const day = now.toISOString().slice(0, 10);
  return Array.from(`${day}-${id}`).reduce((sum, character) => sum + (character.codePointAt(0) ?? 0), 0) % 7;
}

function goalBoost(exercise: Exercise, goal: LearningGoal): number {
  const searchable = `${exercise.id} ${exercise.prompt} ${exercise.focus}`.toLocaleLowerCase("fr");
  if (goal === "basics") return LEVEL_RANK[exercise.level] <= 2 ? 18 : 0;
  if (goal === "fluency") return exercise.type === "translation" || LEVEL_RANK[exercise.level] >= 3 ? 14 : 0;
  if (goal === "work") return /(work|project|meeting|interview|travail|réunion|projet|beruf|trabajo)/u.test(searchable) ? 24 : 0;
  return /(travel|hotel|train|station|restaurant|voyage|gare|billet|marché|viaje|estación|hotel)/u.test(searchable) ? 24 : 0;
}

export function rankExercises(
  exercises: Exercise[],
  state: LearnerState,
  language: LanguageCode,
  now: Date = new Date()
): RankedExercise[] {
  const estimatedLevel = state.progress[language].diagnostic?.estimatedLevel;
  const targetRank = estimatedLevel ? LEVEL_RANK[estimatedLevel] : 1;

  return exercises
    .map((exercise) => {
      const mistake = state.mistakes.find(
        (candidate) => candidate.language === language && candidate.exerciseId === exercise.id
      );
      let score = stableDailyTieBreaker(exercise.id, now);
      let recommendationReason = "Découverte progressive";
      score += goalBoost(exercise, state.settings[language].goal);

      const unresolved = mistake ? Math.max(0, mistake.occurrenceCount - mistake.resolvedCount) : 0;
      if (mistake && unresolved > 0) {
        score += 100 + unresolved * 15;
        recommendationReason = `À renforcer · ${mistake.focus}`;
      } else if (estimatedLevel) {
        const distance = Math.abs(LEVEL_RANK[exercise.level] - targetRank);
        score += Math.max(0, 45 - distance * 16);
        recommendationReason = distance === 0 ? `Adapté à votre niveau ${estimatedLevel}` : "Progression autour de votre niveau";
      } else {
        score += Math.max(0, 30 - (LEVEL_RANK[exercise.level] - 1) * 8);
      }

      return { exercise, score, recommendationReason };
    })
    .sort((a, b) => b.score - a.score || a.exercise.id.localeCompare(b.exercise.id));
}

export function selectAdaptiveExercises(
  exercises: Exercise[],
  state: LearnerState,
  language: LanguageCode,
  now: Date = new Date()
): RankedExercise[] {
  const estimatedLevel = state.progress[language].diagnostic?.estimatedLevel;
  const currentRank = estimatedLevel ? LEVEL_RANK[estimatedLevel] : 1;
  const targetRank = LEVEL_RANK[state.settings[language].targetLevel];
  const upperRank = targetRank >= currentRank ? Math.min(currentRank + 1, targetRank) : currentRank;
  const lowerRank = Math.max(1, Math.min(currentRank, targetRank) - 1);
  const candidates = exercises.filter((exercise) => {
    const mistake = state.mistakes.find((item) => item.exerciseId === exercise.id && item.language === language);
    const unresolved = mistake ? mistake.occurrenceCount - mistake.resolvedCount : 0;
    const rank = LEVEL_RANK[exercise.level];
    return unresolved > 0 || (rank >= lowerRank && rank <= upperRank);
  });
  return rankExercises(candidates, state, language, now).slice(0, 6);
}
