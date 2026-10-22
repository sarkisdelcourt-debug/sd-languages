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

/** Lecture qui distingue « rien d'enregistré » de « stockage illisible » (ne jamais écraser dans ce cas). */
export async function readAiSettings(): Promise<{ settings: AiSettings; readable: boolean }> {
  try {
    const stored = await store.getMeta<Partial<AiSettings>>(SETTINGS_KEY);
    return { settings: { ...DEFAULT_AI_SETTINGS, ...(stored ?? {}) }, readable: true };
  } catch {
    return { settings: DEFAULT_AI_SETTINGS, readable: false };
  }
}

/**
 * Modifie seulement les champs demandés, à partir de ce qui est réellement enregistré : un réglage
 * (plafond, activation) ne peut donc jamais effacer la clé, et rien n'est écrit si la lecture échoue.
 */
export async function patchAiSettings(patch: Partial<AiSettings>): Promise<AiSettings> {
  const { settings, readable } = await readAiSettings();
  if (!readable) throw new Error("Stockage de l'appareil illisible : rien n'a été modifié. Rechargez la page.");
  const next: AiSettings = { ...settings, ...patch };
  next.apiKey = next.apiKey.trim();
  await saveAiSettings(next);
  return next;
}

/** Clé affichée sans la révéler : « sk-ant-…ab12 ». */
export const maskKey = (key: string) => (key.length > 14 ? `${key.slice(0, 7)}…${key.slice(-4)}` : key ? "clé trop courte" : "");

export interface AiCheck {
  ok: boolean;
  at: string;
  message: string;
}
const CHECK_KEY = "aiCheck";
export const loadAiCheck = () => store.getMeta<AiCheck>(CHECK_KEY);
export const saveAiCheck = (check: AiCheck) => store.setMeta(CHECK_KEY, check);

export function announceFallback(reason: string) {
  window.dispatchEvent(new CustomEvent(AI_NOTICE_EVENT, { detail: reason }));
}
