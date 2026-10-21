import type { DailyPlan, DailyPlanItem, LanguageCode, LearnerState } from "../../../shared/src/types.js";
import { isDue } from "../../../shared/src/learning.js";
import { createLessonCatalog } from "./guided-lessons.js";

export function createDailyPlan(
  state: LearnerState,
  language: LanguageCode,
  now: Date = new Date()
): DailyPlan {
  const progress = state.progress[language];
  const dueReviews = state.reviewCards.filter((card) => card.language === language && isDue(card, now));
  const frequentMistake = state.mistakes
    .filter((mistake) => mistake.language === language)
    .map((mistake) => ({ mistake, unresolved: Math.max(0, mistake.occurrenceCount - mistake.resolvedCount) }))
    .filter((entry) => entry.unresolved > 0)
    .sort((a, b) => b.unresolved - a.unresolved)[0]?.mistake;
  const items: DailyPlanItem[] = [];
  const catalog = createLessonCatalog(state, language);
  const lesson = catalog.items.find((item) => item.lesson.id === catalog.recommendedLessonId)?.lesson;
  const goalMinutes = state.settings[language].dailyMinutes;

  if (!progress.diagnostic) {
    items.push({
      id: `${language}-diagnostic`,
      kind: "diagnostic",
      title: "Situer votre niveau",
      description: "Un diagnostic court adapte la suite du parcours.",
      estimatedMinutes: 5,
      priority: 100
    });
  }

  if (dueReviews.length) {
    items.push({
      id: `${language}-reviews`,
      kind: "review",
      title: `Réviser ${dueReviews.length} carte${dueReviews.length > 1 ? "s" : ""}`,
      description: "Consolidez les notions juste avant de les oublier.",
      estimatedMinutes: Math.min(10, Math.max(3, dueReviews.length * 2)),
      priority: 90
    });
  }

  items.push({
    id: `${language}-lesson`,
    kind: "lesson",
    title: frequentMistake ? `Leçon guidée · ${frequentMistake.focus}` : lesson?.title ?? "Leçon guidée",
    description: frequentMistake
      ? `Cette notion sera retravaillée dans une séance complète : explication, exercice et dialogue.`
      : catalog.recommendationReason,
    estimatedMinutes: progress.diagnostic ? Math.min(lesson?.estimatedMinutes ?? 10, goalMinutes) : Math.max(5, goalMinutes - 5),
    priority: frequentMistake ? 80 : 60
  });

  items.sort((a, b) => b.priority - a.priority);
  const selectedItems: DailyPlanItem[] = [];
  let selectedMinutes = 0;
  for (const item of items) {
    if (selectedItems.length === 0 || selectedMinutes + item.estimatedMinutes <= goalMinutes) {
      selectedItems.push(item);
      selectedMinutes += item.estimatedMinutes;
    } else if (item.kind === "lesson" && selectedMinutes < goalMinutes) {
      const adjustedMinutes = Math.max(3, goalMinutes - selectedMinutes);
      if (selectedMinutes + adjustedMinutes <= goalMinutes + 2) {
        selectedItems.push({ ...item, estimatedMinutes: adjustedMinutes });
        selectedMinutes += adjustedMinutes;
      }
    }
  }
  return {
    language,
    generatedAt: now.toISOString(),
    totalMinutes: selectedMinutes,
    goalMinutes,
    items: selectedItems
  };
}
