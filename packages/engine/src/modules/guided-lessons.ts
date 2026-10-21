import { EXERCISES } from "../../../shared/src/curriculum.js";
import { GUIDED_LESSONS, RETIRED_LESSON_REVISIONS } from "../../../shared/src/lessons.js";
import { CONVERSATION_SCENARIOS } from "../../../shared/src/scenarios.js";
import type {
  CefrLevel,
  GuidedLessonCatalog,
  GuidedLessonCatalogItem,
  GuidedLessonDefinition,
  GuidedLessonSession,
  GuidedLessonSummary,
  GuidedLessonView,
  LanguageCode,
  LearnerState
} from "../../../shared/src/types.js";

const cefrRank: Record<CefrLevel, number> = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };

export function getLessons(language: LanguageCode): GuidedLessonDefinition[] {
  return GUIDED_LESSONS
    .filter((lesson) => lesson.language === language)
    .sort((left, right) => left.sequence - right.sequence || left.id.localeCompare(right.id));
}

export function findLessonById(lessonId: string, revision?: number): GuidedLessonDefinition {
  const matches = (candidate: GuidedLessonDefinition) => candidate.id === lessonId && (revision === undefined || candidate.revision === revision);
  // Une séance commencée sur une ancienne révision la garde jusqu'au bout.
  const lesson = GUIDED_LESSONS.find(matches) ?? (revision === undefined ? undefined : RETIRED_LESSON_REVISIONS.find(matches));
  if (!lesson) throw new Error(`La leçon ${lessonId} (révision ${revision ?? "actuelle"}) n'est plus disponible.`);
  return lesson;
}

export function findLatestLessonSession(state: LearnerState, language: LanguageCode) {
  return [...state.lessonSessions].reverse().find((session) => session.language === language);
}

export function findActiveLessonSession(state: LearnerState, language: LanguageCode) {
  return [...state.lessonSessions].reverse().find((session) => session.language === language && session.status === "active");
}

function unresolvedMistakeCount(state: LearnerState, lesson: GuidedLessonDefinition) {
  return state.mistakes
    .filter((mistake) => lesson.exerciseIds.includes(mistake.exerciseId))
    .reduce((total, mistake) => total + Math.max(0, mistake.occurrenceCount - mistake.resolvedCount), 0);
}

function lessonIsUnlocked(
  state: LearnerState,
  lesson: GuidedLessonDefinition,
  assessedRank: number,
  activeLessonId?: string
) {
  if (lesson.id === activeLessonId) return true;
  if ((state.lessonProgress[lesson.id]?.masteryCount ?? 0) > 0) return true;
  if (cefrRank[lesson.level] < assessedRank) return true;
  if (!lesson.prerequisiteLessonId) return true;
  const prerequisite = GUIDED_LESSONS.find((candidate) => candidate.id === lesson.prerequisiteLessonId);
  if (cefrRank[lesson.level] === assessedRank && prerequisite?.level !== lesson.level) return true;
  return (state.lessonProgress[lesson.prerequisiteLessonId]?.masteryCount ?? 0) > 0;
}

export function createLessonCatalog(state: LearnerState, language: LanguageCode): GuidedLessonCatalog {
  const lessons = getLessons(language);
  if (!lessons.length) throw new Error(`Aucune leçon guidée disponible pour ${language}.`);
  const active = findActiveLessonSession(state, language);
  const diagnosticLevel = state.progress[language].diagnostic?.estimatedLevel ?? "A1";
  const targetLevel = state.settings[language].targetLevel;
  const assessedRank = Math.min(cefrRank[diagnosticLevel], cefrRank[targetLevel], cefrRank.B2);
  const assessedLevel = lessons.find((lesson) => cefrRank[lesson.level] === assessedRank)?.level ?? "A1";

  const provisional: GuidedLessonCatalogItem[] = lessons.map((lesson) => {
    const progress = state.lessonProgress[lesson.id];
    const unlocked = lessonIsUnlocked(state, lesson, assessedRank, active?.lessonId);
    const status: GuidedLessonCatalogItem["status"] = lesson.id === active?.lessonId
      ? "active"
      : !unlocked
        ? "locked"
        : (progress?.masteryCount ?? 0) > 0
          ? "completed"
          : "available";
    const statusDetail = status === "active"
      ? "Séance en cours"
      : status === "locked"
        ? `Après « ${lessons.find((candidate) => candidate.id === lesson.prerequisiteLessonId)?.title ?? "l'étape précédente"} »`
        : status === "completed"
          ? `Maîtrisée ${progress?.masteryCount ?? 0} fois`
          : progress?.lastOutcome === "needs-review"
            ? "À consolider"
            : "Disponible";
    return {
      lesson,
      status,
      completionCount: progress?.completions ?? 0,
      masteryCount: progress?.masteryCount ?? 0,
      recommended: false,
      statusDetail,
      lastCompletedAt: progress?.lastCompletedAt
    };
  });

  const candidates = provisional.filter((item) => item.status !== "locked");
  const ranked = candidates.map((item) => {
    const mistakes = unresolvedMistakeCount(state, item.lesson);
    const progress = state.lessonProgress[item.lesson.id];
    const predecessorJustMastered = item.lesson.prerequisiteLessonId
      ? (state.lessonProgress[item.lesson.prerequisiteLessonId]?.masteryCount ?? 0) > 0
      : false;
    let score = 0;
    if (item.status === "active") score += 10_000;
    if (mistakes > 0) score += 2_000 + mistakes * 50;
    if (!progress?.masteryCount) score += 600;
    if (cefrRank[item.lesson.level] === assessedRank) score += 500;
    if (predecessorJustMastered && !progress?.masteryCount) score += 350;
    if (item.lesson.goalAffinity.includes(state.settings[language].goal)) score += 120;
    score -= Math.abs(cefrRank[item.lesson.level] - assessedRank) * 80;
    score -= item.lesson.sequence;
    return { item, score, mistakes, predecessorJustMastered };
  }).sort((left, right) => right.score - left.score || left.item.lesson.sequence - right.item.lesson.sequence);

  const recommendation = ranked[0] ?? { item: provisional[0]!, score: 0, mistakes: 0, predecessorJustMastered: false };
  recommendation.item.recommended = true;
  const recommendationReason = recommendation.item.status === "active"
    ? "Reprenez exactement là où vous vous êtes arrêté."
    : recommendation.mistakes > 0
      ? "Cette séance reprend une notion qui vous a récemment posé problème."
      : recommendation.predecessorJustMastered
        ? "La séance précédente est maîtrisée : celle-ci est la suite logique."
        : cefrRank[recommendation.item.lesson.level] === assessedRank
          ? `Votre diagnostic et votre objectif placent cette séance au niveau ${recommendation.item.lesson.level}.`
          : "Cette séance est la meilleure étape disponible dans votre parcours.";

  return {
    language,
    assessedLevel,
    targetLevel,
    recommendedLessonId: recommendation.item.lesson.id,
    recommendationReason,
    completedCount: provisional.filter((item) => item.status === "completed").length,
    totalLessons: provisional.length,
    items: provisional
  };
}

export function startLessonSession(
  state: LearnerState,
  language: LanguageCode,
  lessonId: string,
  now = new Date()
): GuidedLessonSession {
  const active = findActiveLessonSession(state, language);
  if (active) return active;
  const lesson = findLessonById(lessonId);
  if (lesson.language !== language) throw new Error("Cette leçon ne correspond pas à la langue active.");
  const catalogItem = createLessonCatalog(state, language).items.find((item) => item.lesson.id === lessonId);
  if (!catalogItem || catalogItem.status === "locked") throw new Error("Cette leçon est encore verrouillée.");
  const timestamp = now.toISOString();
  const session: GuidedLessonSession = {
    id: crypto.randomUUID(),
    lessonId: lesson.id,
    lessonRevision: lesson.revision,
    language,
    status: "active",
    phase: "intro",
    currentExerciseIndex: 0,
    attempts: [],
    conversation: { language, messages: [] },
    conversationTurns: 0,
    startedAt: timestamp,
    updatedAt: timestamp
  };
  state.lessonSessions.push(session);
  if (state.lessonSessions.length > 60) {
    const oldestCompletedIndex = state.lessonSessions.findIndex((candidate) => candidate.status === "completed");
    if (oldestCompletedIndex >= 0) state.lessonSessions.splice(oldestCompletedIndex, 1);
  }
  return session;
}

export function buildLessonSummary(session: GuidedLessonSession, lesson: GuidedLessonDefinition): GuidedLessonSummary {
  const finalAttempts = lesson.exerciseIds.map((exerciseId) =>
    [...session.attempts].reverse().find((attempt) => attempt.exerciseId === exerciseId)
  ).filter((attempt): attempt is NonNullable<typeof attempt> => Boolean(attempt));
  const scenarioSteps = CONVERSATION_SCENARIOS.find((scenario) => scenario.id === lesson.scenarioId)?.steps.length ?? 0;
  const summary: GuidedLessonSummary = {
    exact: finalAttempts.filter((attempt) => attempt.evaluation.verdict === "exact").length,
    minor: finalAttempts.filter((attempt) => attempt.evaluation.verdict === "minor").length,
    incorrect: finalAttempts.filter((attempt) => attempt.evaluation.verdict === "incorrect").length,
    completedExercises: finalAttempts.length,
    conversationSteps: session.conversation.scenarioStepIndex ?? 0,
    conversationGoal: scenarioSteps,
    outcome: "needs-review"
  };
  const requiredExact = Math.ceil(lesson.exerciseIds.length * 2 / 3);
  if (
    summary.completedExercises === lesson.exerciseIds.length
    && summary.exact >= requiredExact
    && summary.incorrect === 0
    && summary.conversationSteps >= Math.min(3, scenarioSteps)
  ) summary.outcome = "mastered";
  return summary;
}

export function completeLessonSession(
  state: LearnerState,
  session: GuidedLessonSession,
  lesson: GuidedLessonDefinition,
  now = new Date()
) {
  const timestamp = now.toISOString();
  session.phase = "summary";
  session.status = "completed";
  session.updatedAt = timestamp;
  session.completedAt = timestamp;
  session.summary = buildLessonSummary(session, lesson);
  const previous = state.lessonProgress[lesson.id];
  state.lessonProgress[lesson.id] = {
    lessonId: lesson.id,
    completions: (previous?.completions ?? 0) + 1,
    masteryCount: (previous?.masteryCount ?? 0) + (session.summary.outcome === "mastered" ? 1 : 0),
    bestExact: Math.max(previous?.bestExact ?? 0, session.summary.exact),
    lastCompletedAt: timestamp,
    lastOutcome: session.summary.outcome
  };
}

export function toLessonView(
  state: LearnerState,
  language: LanguageCode,
  preferredSession?: GuidedLessonSession,
  selectedLessonId?: string
): GuidedLessonView {
  const catalog = createLessonCatalog(state, language);
  const active = findActiveLessonSession(state, language);
  const session = preferredSession ?? active;
  const lesson = session
    ? findLessonById(session.lessonId, session.lessonRevision)
    : findLessonById(selectedLessonId ?? catalog.recommendedLessonId);
  if (lesson.language !== language) throw new Error("Cette leçon ne correspond pas à la langue active.");
  const exercise = session?.status === "active" && (session.phase === "practice" || session.phase === "correction")
    ? EXERCISES.find((candidate) => candidate.id === lesson.exerciseIds[session.currentExerciseIndex])
    : undefined;
  const currentExercise = exercise
    ? (({ answer: _answer, acceptedAnswers: _accepted, ...publicExercise }) => publicExercise)(exercise)
    : undefined;
  return { lesson, catalog, session, currentExercise };
}
