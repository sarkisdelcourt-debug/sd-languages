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

      // Variété : un exercice jamais vu passe devant ; un exercice réussi récemment s'efface
      // quelques jours (il reviendra par les révisions espacées s'il a posé problème).
      const exposure = state.exerciseHistory?.[exercise.id];
      if (!exposure) {
        score += 20;
        if (!(mistake && unresolved > 0)) recommendationReason = `Nouveau · ${recommendationReason}`;
      } else if (exposure.lastCorrect && !(mistake && unresolved > 0)) {
        const days = (now.getTime() - new Date(exposure.lastSeenAt).getTime()) / 86_400_000;
        score -= Math.max(0, 60 - days * 6);
      }

      return { exercise, score, recommendationReason };
    })
    .sort((a, b) => b.score - a.score || a.exercise.id.localeCompare(b.exercise.id));
}

export const SERIES_LENGTH = 6;
const MAX_SAME_FORMAT = 2;

/** Une même phrase donne « construire » et « écouter » : on ne les met pas dans la même série. */
const sourceOf = (exercise: Exercise) => exercise.id.replace(/-(build|listen)$/u, "");

/**
 * Série variée : on suit le classement, mais au plus deux exercices du même format et jamais deux
 * exercices issus de la même phrase. Si le thème ne permet pas mieux, on complète dans l'ordre.
 */
export function diversify(ranked: RankedExercise[], count = SERIES_LENGTH): RankedExercise[] {
  const series: RankedExercise[] = [];
  const formats = new Map<string, number>();
  const sources = new Set<string>();
  for (const candidate of ranked) {
    if (series.length >= count) break;
    const format = candidate.exercise.type;
    if ((formats.get(format) ?? 0) >= MAX_SAME_FORMAT || sources.has(sourceOf(candidate.exercise))) continue;
    series.push(candidate);
    formats.set(format, (formats.get(format) ?? 0) + 1);
    sources.add(sourceOf(candidate.exercise));
  }
  for (const candidate of ranked) {
    if (series.length >= count) break;
    if (!series.includes(candidate) && !sources.has(sourceOf(candidate.exercise))) {
      series.push(candidate);
      sources.add(sourceOf(candidate.exercise));
    }
  }
  // Alterne les formats (construire, QCM, écouter…) plutôt que de les enchaîner par paquets.
  const queues = new Map<string, RankedExercise[]>();
  for (const item of series) queues.set(item.exercise.type, [...(queues.get(item.exercise.type) ?? []), item]);
  const interleaved: RankedExercise[] = [];
  while (interleaved.length < series.length) {
    for (const queue of queues.values()) {
      const next = queue.shift();
      if (next) interleaved.push(next);
    }
  }
  return interleaved;
}

/**
 * Série ciblée sur un thème choisi : pas de fenêtre de niveau (l'apprenant a demandé ce thème),
 * le classement favorise quand même son niveau, les erreurs et la nouveauté.
 */
export function selectTopicExercises(
  exercises: Exercise[],
  state: LearnerState,
  language: LanguageCode,
  now: Date = new Date()
): RankedExercise[] {
  return diversify(rankExercises(exercises, state, language, now));
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
  return diversify(rankExercises(candidates, state, language, now));
}
