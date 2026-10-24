import { currentLevel } from "./level.js";
import type { DashboardSnapshot, LanguageCode, LearnerState } from "../../../shared/src/types.js";
import { LANGUAGE_CODES } from "../../../shared/src/catalog.js";
import { isDue } from "../../../shared/src/learning.js";

/** Fuseau horaire de l'appareil (celui de la machine qui exécute le moteur : le navigateur de l'apprenant, ou son PC). */
export function deviceTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/**
 * Jour d'apprentissage (AAAA-MM-JJ) d'un instant, dans un fuseau horaire (LANG-05). Une séance à 00 h 30 à Paris compte
 * pour le lendemain même si elle est encore la veille en UTC. Voyage : le jour est celui du fuseau en vigueur au moment de
 * la séance ; deux séances qui tombent à la même date locale ne font pas avancer la série. Fuseau inconnu : UTC.
 */
export function learningDay(date: Date, timeZone: string = deviceTimeZone()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
    const part = (type: string) => parts.find((p) => p.type === type)?.value;
    const year = part("year");
    const month = part("month");
    const day = part("day");
    if (year && month && day) return `${year}-${month}-${day}`;
  } catch {
    // fuseau inconnu du navigateur : repli ci-dessous
  }
  return date.toISOString().slice(0, 10);
}

/** Veille d'une date AAAA-MM-JJ, calculée sur le calendrier (pas « moins 24 h » : faux les jours de changement d'heure). */
export function previousDay(day: string): string {
  const [year, month, date] = day.split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(year, month - 1, date - 1)).toISOString().slice(0, 10);
}

export function recordPractice(
  state: LearnerState,
  language: LanguageCode,
  correct: boolean,
  now: Date = new Date(),
  timeZone: string = deviceTimeZone()
): void {
  const progress = state.progress[language];
  const today = learningDay(now, timeZone);

  // Une date enregistrée « dans le futur » (ancien calcul en UTC dans un fuseau à décalage négatif, ou voyage vers l'ouest)
  // compte comme aujourd'hui : on ne remet pas la série à 1 et on ne recule pas la date.
  const sameDayOrAhead = progress.lastPracticeDate !== undefined && progress.lastPracticeDate >= today;
  if (!sameDayOrAhead) {
    progress.currentStreak = progress.lastPracticeDate === previousDay(today) ? progress.currentStreak + 1 : 1;
  }

  if (!sameDayOrAhead) progress.lastPracticeDate = today;
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
