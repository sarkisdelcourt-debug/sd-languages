import type { LearnerState, MistakeRecord } from "../../../shared/src/types.js";

/**
 * Nombre d'échecs encore ouverts pour un exercice (LANG-03).
 *
 * Sémantique : chaque réussite solde UN échec déjà survenu ; elle ne crée jamais de crédit qui absorberait les échecs
 * à venir (faux, juste, juste, juste, faux laisse une erreur ouverte). À l'écriture, `resolvedCount` est plafonné à
 * `occurrenceCount` (practice-attempt.ts). À la lecture, ce calcul corrige aussi les profils déjà enregistrés où le crédit
 * avait dépassé les échecs, SANS toucher aux compteurs enregistrés : si le dernier essai connu de l'exercice est faux,
 * l'erreur reste ouverte (au moins 1).
 */
export function unresolvedCount(mistake: MistakeRecord, history: LearnerState["exerciseHistory"]): number {
  const open = mistake.occurrenceCount - Math.min(mistake.resolvedCount, mistake.occurrenceCount);
  const lastCorrect = history?.[mistake.exerciseId]?.lastCorrect;
  return lastCorrect === false ? Math.max(1, open) : open;
}
