import { currentLevel } from "./level.js";
import type { DailyPlan, DailyPlanItem, LanguageCode, LearnerState } from "../../../shared/src/types.js";
import { isDue } from "../../../shared/src/learning.js";
import { createLessonCatalog } from "./guided-lessons.js";
import { unresolvedCount } from "./mistakes.js";

export function createDailyPlan(
  state: LearnerState,
  language: LanguageCode,
  now: Date = new Date()
): DailyPlan {
  const progress = state.progress[language];
  const dueReviews = state.reviewCards.filter((card) => card.language === language && isDue(card, now));
  const frequentMistake = state.mistakes
    .filter((mistake) => mistake.language === language)
    .map((mistake) => ({ mistake, unresolved: unresolvedCount(mistake, state.exerciseHistory) }))
    .filter((entry) => entry.unresolved > 0)
    .sort((a, b) => b.unresolved - a.unresolved)[0]?.mistake;
  const items: DailyPlanItem[] = [];
  const catalog = createLessonCatalog(state, language);
  const lesson = catalog.items.find((item) => item.lesson.id === catalog.recommendedLessonId)?.lesson;
  const goalMinutes = state.settings[language].dailyMinutes;

  if (!currentLevel(state, language)) {
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

  // Le titre ne promet la notion fautive que si la leçon réellement ouverte la contient (audit du 26/10/2026).
  const lessonCoversMistake = Boolean(frequentMistake && lesson?.exerciseIds.includes(frequentMistake.exerciseId));
  if (frequentMistake && !lessonCoversMistake) {
    // La leçon recommandée ne contient pas la notion fautive : on la propose pour ce qu'elle est, une série ciblée.
    items.push({
      id: `${language}-mistake`,
      kind: "practice",
      title: `Série ciblée · ${frequentMistake.focus}`,
      description: "Cette notion vous a posé problème : une courte série pour la reprendre.",
      estimatedMinutes: 5,
      priority: 80
    });
  }
  items.push({
    id: `${language}-lesson`,
    kind: "lesson",
    title: lessonCoversMistake ? `Leçon guidée · ${frequentMistake!.focus}` : lesson?.title ?? "Leçon guidée",
    description: lessonCoversMistake
      ? `Cette notion sera retravaillée dans une séance complète : explication, exercice et dialogue.`
      : catalog.recommendationReason,
    estimatedMinutes: currentLevel(state, language) ? Math.min(lesson?.estimatedMinutes ?? 10, goalMinutes) : Math.max(5, goalMinutes - 5),
    priority: lessonCoversMistake ? 80 : 60
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
