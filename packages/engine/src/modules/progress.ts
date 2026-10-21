import { currentLevel } from "./level.js";
import type { DashboardSnapshot, LanguageCode, LearnerState } from "../../../shared/src/types.js";
import { LANGUAGE_CODES } from "../../../shared/src/catalog.js";
import { isDue } from "../../../shared/src/learning.js";

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function recordPractice(
  state: LearnerState,
  language: LanguageCode,
  correct: boolean,
  now: Date = new Date()
): void {
  const progress = state.progress[language];
  const today = dayKey(now);
  const yesterday = new Date(now);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  if (progress.lastPracticeDate !== today) {
    progress.currentStreak = progress.lastPracticeDate === dayKey(yesterday) ? progress.currentStreak + 1 : 1;
  }

  progress.lastPracticeDate = today;
  progress.completedExercises += 1;
  progress.correctAnswers += correct ? 1 : 0;
  progress.xp += correct ? 10 : 2;
}

export function createDashboard(state: LearnerState, now: Date = new Date()): DashboardSnapshot {
  const dueReviews = Object.fromEntries(
    LANGUAGE_CODES.map((language) => [
      language,
      state.reviewCards.filter((card) => card.language === language && isDue(card, now)).length
    ])
  ) as Record<LanguageCode, number>;

  return {
    progress: state.progress,
    dueReviews,
    totalCards: state.reviewCards.length,
    levels: Object.fromEntries(LANGUAGE_CODES.map((language) => [language, currentLevel(state, language)])) as DashboardSnapshot["levels"]
  };
}
