import { assessPronunciation } from "../../../shared/src/learning.js";
import { PRONUNCIATION_PROMPTS } from "../../../shared/src/pronunciation.js";
import type {
  CefrLevel,
  LanguageCode,
  LearnerState,
  PronunciationAttemptMode,
  PronunciationAttemptResult,
  PronunciationLabView,
  PronunciationPrompt
} from "../../../shared/src/types.js";

const cefrRank: Record<CefrLevel, number> = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };

function promptsFor(language: LanguageCode): PronunciationPrompt[] {
  return PRONUNCIATION_PROMPTS.filter((prompt) => prompt.language === language);
}

export function findPronunciationPrompt(promptId: string): PronunciationPrompt | undefined {
  return PRONUNCIATION_PROMPTS.find((prompt) => prompt.id === promptId);
}

export function createPronunciationLab(state: LearnerState, language: LanguageCode): PronunciationLabView {
  const prompts = promptsFor(language);
  const activeLesson = [...state.lessonSessions].reverse().find(
    (session) => session.language === language && session.status === "active"
  );
  const activeMatch = activeLesson
    ? prompts.find((prompt) => prompt.sourceLessonId === activeLesson.lessonId)
    : undefined;
  const needsRetry = prompts
    .filter((prompt) => {
      const progress = state.pronunciationProgress[prompt.id];
      return progress && progress.bestScore < 85;
    })
    .sort((left, right) => (
      (state.pronunciationProgress[left.id]?.bestScore ?? 0) - (state.pronunciationProgress[right.id]?.bestScore ?? 0)
    ))[0];
  const referenceLevel = state.progress[language].diagnostic?.estimatedLevel ?? state.settings[language].targetLevel;
  const untried = prompts
    .filter((prompt) => !state.pronunciationProgress[prompt.id])
    .sort((left, right) => (
      Math.abs(cefrRank[left.level] - cefrRank[referenceLevel])
      - Math.abs(cefrRank[right.level] - cefrRank[referenceLevel])
    ))[0];
  const recommended = activeMatch ?? needsRetry ?? untried ?? prompts
    .slice()
    .sort((left, right) => (
      (state.pronunciationProgress[left.id]?.bestScore ?? 100)
      - (state.pronunciationProgress[right.id]?.bestScore ?? 100)
    ))[0]!;
  const recommendationReason = activeMatch
    ? "Cette phrase reprend la leçon actuellement en cours."
    : needsRetry
      ? "Cette phrase contient encore des mots à stabiliser."
      : untried
        ? `Une nouvelle phrase ${recommended.level}, proche de votre repère ${referenceLevel}.`
        : "Reprenez votre score le plus perfectible.";

  return {
    language,
    recommendedPromptId: recommended.id,
    recommendationReason,
    prompts: prompts.map((prompt) => ({
      ...prompt,
      recommended: prompt.id === recommended.id,
      progress: state.pronunciationProgress[prompt.id]
    })),
    recentAttempts: state.pronunciationAttempts
      .filter((attempt) => attempt.language === language)
      .slice(-5)
      .reverse()
  };
}

export function applyPronunciationAttempt(
  state: LearnerState,
  prompt: PronunciationPrompt,
  transcript: string,
  mode: PronunciationAttemptMode,
  attemptId: string,
  now: Date = new Date()
): PronunciationAttemptResult {
  const assessment = assessPronunciation(prompt, transcript);
  const duplicate = state.pronunciationAttempts.find((attempt) => attempt.attemptId === attemptId);
  if (duplicate) {
    if (duplicate.promptId !== prompt.id || duplicate.mode !== mode) {
      throw new Error("Cet identifiant de tentative a déjà été utilisé.");
    }
    return {
      attempt: duplicate,
      assessment,
      progress: state.pronunciationProgress[prompt.id]!,
      duplicate: true
    };
  }

  const createdAt = now.toISOString();
  const attempt = {
    attemptId,
    promptId: prompt.id,
    language: prompt.language,
    mode,
    score: assessment.score,
    verdict: assessment.verdict,
    mastered: assessment.mastered,
    createdAt
  } as const;
  state.pronunciationAttempts.push(attempt);
  if (state.pronunciationAttempts.length > 100) {
    state.pronunciationAttempts.splice(0, state.pronunciationAttempts.length - 100);
  }
  const current = state.pronunciationProgress[prompt.id];
  const progress = {
    promptId: prompt.id,
    attempts: (current?.attempts ?? 0) + 1,
    bestScore: Math.max(current?.bestScore ?? 0, assessment.score),
    lastScore: assessment.score,
    masteryCount: (current?.masteryCount ?? 0) + (assessment.mastered ? 1 : 0),
    lastPracticedAt: createdAt
  };
  state.pronunciationProgress[prompt.id] = progress;

  return { attempt, assessment, progress, duplicate: false };
}
