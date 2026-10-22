import type { AiUsage } from "@engine/modules/ai-coach";
import { store } from "../local/device";

/**
 * Réglages du coach IA facultatif (22/10/2026), sans dépendance au SDK pour rester dans le paquet
 * principal. La clé API vit UNIQUEMENT dans la zone « meta » d'IndexedDB de l'appareil, jamais dans la
 * progression : ni exportée dans le fichier de relais, ni publiée, effacée par « Effacer mes données ».
 */
export interface AiSettings {
  enabled: boolean;
  apiKey: string;
  /** Plafond mensuel estimé en dollars ; au-delà, l'application revient au coach local. */
  monthlyCapUsd: number;
}

export const DEFAULT_AI_SETTINGS: AiSettings = { enabled: false, apiKey: "", monthlyCapUsd: 10 };
export const AI_NOTICE_EVENT = "sd-languages-ai-notice";
export const SETTINGS_KEY = "aiSettings";
export const USAGE_KEY = "aiUsage";

export async function loadAiSettings(): Promise<AiSettings> {
  try {
    return { ...DEFAULT_AI_SETTINGS, ...((await store.getMeta<Partial<AiSettings>>(SETTINGS_KEY)) ?? {}) };
  } catch {
    return DEFAULT_AI_SETTINGS;
  }
}

export const saveAiSettings = (settings: AiSettings) => store.setMeta(SETTINGS_KEY, settings);
export const loadAiUsage = () => store.getMeta<AiUsage>(USAGE_KEY);
export const hasUsableKey = (settings: AiSettings) => settings.enabled && /^sk-ant-/.test(settings.apiKey.trim());

export function announceFallback(reason: string) {
  window.dispatchEvent(new CustomEvent(AI_NOTICE_EVENT, { detail: reason }));
}
