import type { CefrLevel, Exercise, ExerciseTopic, LanguageCode, LearnerState, LearningGoal } from "../../../shared/src/types.js";
import { currentLevel } from "./level.js";

const LEVEL_RANK: Record<CefrLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };

export interface RankedExercise {
  exercise: Exercise;
  score: number;
  recommendationReason: string;
}

/**
 * Départage quotidien : hachage (FNV-1a) de « jour + id » réparti sur 0–1000, ramené ensuite à
 * l'échelle des autres bonus. Mille valeurs distinctes évitent les ex æquo que l'ancien « mod 7 »
 * laissait trancher par l'ordre alphabétique des ids (d'où un biais vers « en-day-… »).
 */
export function dailyTieBreaker(id: string, now: Date): number {
  const day = now.toISOString().slice(0, 10);
  let value = 2_166_136_261;
  for (const character of `${day}-${id}`) value = Math.imul(value ^ (character.codePointAt(0) ?? 0), 16_777_619) >>> 0;
  return value % 1001;
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
  const estimatedLevel = currentLevel(state, language);
  const targetRank = estimatedLevel ? LEVEL_RANK[estimatedLevel] : 1;

  return exercises
    .map((exercise) => {
      const mistake = state.mistakes.find(
        (candidate) => candidate.language === language && candidate.exerciseId === exercise.id
      );
      let score = dailyTieBreaker(exercise.id, now) * 7 / 1000;
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
const MAX_SAME_TOPIC = 2;
const topicOf = (exercise: Exercise) => exercise.topic ?? "général";

export interface DiversifyOptions {
  /** Plafond d'exercices d'un même thème (Infinity pour une série ciblée sur un thème). */
  maxSameTopic?: number;
  /** Thème à garantir dans la série s'il existe parmi les candidats (ex. médical pour « Travailler »). */
  ensureTopic?: ExerciseTopic;
}

/** Une même phrase donne « construire » et « écouter » : on ne les met pas dans la même série. */
const sourceOf = (exercise: Exercise) => exercise.id.replace(/-(build|listen)$/u, "");

/**
 * Série variée : on suit le classement, mais au plus deux exercices du même format, au plus deux
 * du même thème (tour de rôle entre thèmes) et jamais deux exercices issus de la même phrase. Un
 * thème garanti (médical pour l'objectif « Travailler ») prend la première place s'il est absent.
 * Si les candidats ne permettent pas mieux, on complète dans l'ordre.
 */
export function diversify(ranked: RankedExercise[], count = SERIES_LENGTH, options: DiversifyOptions = {}): RankedExercise[] {
  const maxSameTopic = options.maxSameTopic ?? MAX_SAME_TOPIC;
  const series: RankedExercise[] = [];
  const formats = new Map<string, number>();
  const topics = new Map<string, number>();
  const sources = new Set<string>();
  const take = (candidate: RankedExercise) => {
    series.push(candidate);
    formats.set(candidate.exercise.type, (formats.get(candidate.exercise.type) ?? 0) + 1);
    topics.set(topicOf(candidate.exercise), (topics.get(topicOf(candidate.exercise)) ?? 0) + 1);
    sources.add(sourceOf(candidate.exercise));
  };
  const ensured = options.ensureTopic ? ranked.find((candidate) => candidate.exercise.topic === options.ensureTopic) : undefined;
  if (ensured) take(ensured);
  // Tour de rôle : à chaque passage, un seul exercice par thème, dans l'ordre du classement.
  while (series.length < count) {
    const before = series.length;
    const topicsThisRound = new Set<string>();
    for (const candidate of ranked) {
      if (series.length >= count) break;
      const topic = topicOf(candidate.exercise);
      if (series.includes(candidate) || topicsThisRound.has(topic)) continue;
      if ((formats.get(candidate.exercise.type) ?? 0) >= MAX_SAME_FORMAT || (topics.get(topic) ?? 0) >= maxSameTopic) continue;
      if (sources.has(sourceOf(candidate.exercise))) continue;
      take(candidate);
      topicsThisRound.add(topic);
    }
    if (series.length === before) break;
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
  return diversify(rankExercises(exercises, state, language, now), SERIES_LENGTH, { maxSameTopic: Infinity });
}

export function selectAdaptiveExercises(
  exercises: Exercise[],
  state: LearnerState,
  language: LanguageCode,
  now: Date = new Date()
): RankedExercise[] {
  const estimatedLevel = currentLevel(state, language);
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
  const ensureTopic = state.settings[language].goal === "work" ? "medical" : undefined;
  return diversify(rankExercises(candidates, state, language, now), SERIES_LENGTH, { ensureTopic });
}
