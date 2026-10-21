import type { CefrLevel, LanguageCode, LearnerState } from "../../../shared/src/types.js";

/**
 * Niveau actuel d'une langue, seule référence pour les leçons, les séries et le plan du jour :
 * le niveau déclaré par l'apprenant prime sur l'estimation du diagnostic (décision du 22/10/2026,
 * le diagnostic de 6 questions sous-estimait l'anglais de Sarkis).
 */
export function currentLevel(state: LearnerState, language: LanguageCode): CefrLevel | undefined {
  return state.settings[language]?.declaredLevel ?? state.progress[language]?.diagnostic?.estimatedLevel;
}
