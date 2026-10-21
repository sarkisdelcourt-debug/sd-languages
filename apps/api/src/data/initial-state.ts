import type { LanguageCode, LearnerState } from "../../../../packages/shared/src/types.js";
import { LANGUAGE_CODES } from "../../../../packages/shared/src/catalog.js";

export function createInitialState(): LearnerState {
  const progress = Object.fromEntries(
    LANGUAGE_CODES.map((language) => [
      language,
      {
        language,
        xp: 0,
        completedExercises: 0,
        correctAnswers: 0,
        currentStreak: 0
      }
    ])
  ) as LearnerState["progress"];

  const conversations: LearnerState["conversations"] = {
    en: { language: "en", messages: [] },
    de: { language: "de", messages: [] },
    es: { language: "es", messages: [] }
  };

  const settings: LearnerState["settings"] = {
    en: { language: "en", goal: "fluency", dailyMinutes: 15, targetLevel: "B2", onboardingCompleted: false },
    de: { language: "de", goal: "fluency", dailyMinutes: 10, targetLevel: "B1", onboardingCompleted: false },
    es: { language: "es", goal: "basics", dailyMinutes: 10, targetLevel: "A2", onboardingCompleted: false }
  };

  return {
    version: 5,
    progress,
    mistakes: [],
    reviewCards: [],
    conversations,
    processedAttemptIds: [],
    settings,
    lessonSessions: [],
    lessonProgress: {},
    pronunciationAttempts: [],
    pronunciationProgress: {}
  };
}
