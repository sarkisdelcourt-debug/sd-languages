import { EXERCISES } from "../../../shared/src/curriculum.js";
import { SKILLS, SKILL_GROUP_LABELS, type SkillDefinition } from "../../../shared/src/skills.js";
import type { Exercise, LanguageCode, LearnerState, SkillAction, SkillSummary, SkillsView } from "../../../shared/src/types.js";

/**
 * Carte de compétences (22/10/2026), calcul pur et déterministe à partir de l'état local :
 * - exposition : tentatives cumulées (`exerciseHistory.seen`) sur les exercices de la compétence ;
 * - réussite récente : dix dernières observations (tentatives de leçon horodatées + dernier
 *   résultat connu de chaque exercice vu en série), sans double compte ;
 * - stabilité : part des exercices rencontrés réussis au moins deux fois et à leur dernière tentative ;
 * - erreurs ouvertes : mémoire des erreurs non résolues ; prochaine révision : carte due la plus proche.
 * Les compétences d'une langue ne lisent que les exercices, séances, erreurs et cartes de cette langue.
 */
export const RECENT_WINDOW = 10;

interface Observation {
  at: number;
  correct: boolean;
}

function observationsFor(state: LearnerState, language: LanguageCode, exerciseIds: Set<string>): Observation[] {
  const observations: Observation[] = [];
  const lessonAttemptTimes = new Map<string, number[]>();
  for (const session of state.lessonSessions) {
    if (session.language !== language) continue;
    for (const attempt of session.attempts) {
      if (!exerciseIds.has(attempt.exerciseId)) continue;
      const at = new Date(attempt.createdAt).getTime();
      observations.push({ at, correct: attempt.evaluation.correct });
      lessonAttemptTimes.set(attempt.exerciseId, [...(lessonAttemptTimes.get(attempt.exerciseId) ?? []), at]);
    }
  }
  for (const id of exerciseIds) {
    const exposure = state.exerciseHistory?.[id];
    if (!exposure) continue;
    const at = new Date(exposure.lastSeenAt).getTime();
    // La dernière tentative vient d'une séance de leçon déjà comptée (même instant, à 2 s près) ?
    const counted = (lessonAttemptTimes.get(id) ?? []).some((time) => Math.abs(time - at) < 2_000);
    if (!counted) observations.push({ at, correct: exposure.lastCorrect });
  }
  return observations.sort((left, right) => right.at - left.at);
}

function decide(summary: Omit<SkillSummary, "action" | "reason">): { action: SkillAction; reason: string } {
  const recentLabel = summary.recentSuccess === undefined ? "" : `${Math.round(summary.recentSuccess * 100)} % de réussite sur les ${summary.recentResults.length} dernières réponses`;
  if (summary.exposure === 0) {
    return { action: "practice", reason: `Jamais rencontrée : ${summary.exerciseCount} exercice${summary.exerciseCount > 1 ? "s" : ""} disponible${summary.exerciseCount > 1 ? "s" : ""} pour une première exposition.` };
  }
  if (summary.openMistakes > 0) {
    return { action: "review", reason: `${summary.openMistakes} erreur${summary.openMistakes > 1 ? "s" : ""} encore ouverte${summary.openMistakes > 1 ? "s" : ""} dans la mémoire des erreurs : à revoir avant d'aller plus loin.` };
  }
  if (summary.recentSuccess !== undefined && summary.recentSuccess < 0.7) {
    return { action: "review", reason: `${recentLabel} : revoyez la règle avant une nouvelle série.` };
  }
  if (summary.recentResults.length < 3) {
    return { action: "consolidate", reason: `Seulement ${summary.recentResults.length} réponse${summary.recentResults.length > 1 ? "s" : ""} observée${summary.recentResults.length > 1 ? "s" : ""} : trop peu pour conclure, consolidez.` };
  }
  if ((summary.recentSuccess ?? 0) < 1 || summary.stability < 0.6) {
    return { action: "consolidate", reason: `${recentLabel}, stabilité ${Math.round(summary.stability * 100)} % : consolidez pour rendre l'acquis durable.` };
  }
  return { action: "practice", reason: `${recentLabel}, stabilité ${Math.round(summary.stability * 100)} % : acquis solide, pratiquez-le en contexte (leçon, dialogue).` };
}

export function summarizeSkill(
  state: LearnerState,
  language: LanguageCode,
  skill: SkillDefinition,
  exercises: Exercise[]
): SkillSummary {
  const tagged = exercises.filter((exercise) => exercise.language === language && exercise.skillTags?.includes(skill.id));
  const ids = new Set(tagged.map((exercise) => exercise.id));
  const history = tagged.map((exercise) => state.exerciseHistory?.[exercise.id]).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const exposure = history.reduce((total, entry) => total + entry.seen, 0);
  const seenExerciseCount = history.length;
  const stable = history.filter((entry) => entry.lastCorrect && entry.correct >= 2).length;
  const recent = observationsFor(state, language, ids).slice(0, RECENT_WINDOW);
  const recentResults = recent.map((observation) => observation.correct);
  const recentSuccess = recentResults.length ? recentResults.filter(Boolean).length / recentResults.length : undefined;
  const openMistakes = state.mistakes
    .filter((mistake) => mistake.language === language && ids.has(mistake.exerciseId))
    .reduce((total, mistake) => total + Math.max(0, mistake.occurrenceCount - mistake.resolvedCount), 0);
  const nextReviewAt = state.reviewCards
    .filter((card) => card.language === language && ids.has(card.sourceExerciseId))
    .map((card) => card.nextReviewAt)
    .sort()[0];
  const base = {
    id: skill.id,
    label: skill.label,
    group: skill.group,
    ...(skill.topic ? { topic: skill.topic } : {}),
    exerciseCount: tagged.length,
    exposure,
    seenExerciseCount,
    recentResults,
    ...(recentSuccess === undefined ? {} : { recentSuccess: Number(recentSuccess.toFixed(2)) }),
    stability: seenExerciseCount ? Number((stable / seenExerciseCount).toFixed(2)) : 0,
    openMistakes,
    ...(nextReviewAt ? { nextReviewAt } : {})
  };
  return { ...base, ...decide(base) };
}

export function createSkillsView(state: LearnerState, language: LanguageCode, now: Date = new Date(), exercises: Exercise[] = EXERCISES): SkillsView {
  const groups = (["grammar", "vocabulary", "communication"] as const)
    .filter((group) => SKILLS[language].some((skill) => skill.group === group))
    .map((group) => ({ group, label: SKILL_GROUP_LABELS[group] }));
  return {
    language,
    generatedAt: now.toISOString(),
    groups,
    skills: SKILLS[language].map((skill) => summarizeSkill(state, language, skill, exercises))
  };
}
