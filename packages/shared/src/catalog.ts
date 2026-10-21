import type { LanguageCode, LanguageDefinition } from "./types.js";

export const LANGUAGES: Record<LanguageCode, LanguageDefinition> = {
  en: {
    code: "en",
    name: "Anglais",
    nativeName: "English",
    flag: "EN",
    accent: "#4f7cff",
    suggestedGoal: "Retrouver de l'aisance et nuancer son expression"
  },
  de: {
    code: "de",
    name: "Allemand",
    nativeName: "Deutsch",
    flag: "DE",
    accent: "#f0ad3d",
    suggestedGoal: "Réactiver les automatismes et le vocabulaire courant"
  },
  es: {
    code: "es",
    name: "Espagnol",
    nativeName: "Español",
    flag: "ES",
    accent: "#ed5b62",
    suggestedGoal: "Construire des bases solides pour les situations quotidiennes"
  }
};

export const LANGUAGE_CODES = Object.keys(LANGUAGES) as LanguageCode[];

export function isLanguageCode(value: string): value is LanguageCode {
  return value in LANGUAGES;
}
