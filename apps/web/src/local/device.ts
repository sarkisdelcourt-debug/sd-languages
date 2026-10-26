import type { LearnerState } from "@shared/types";
import {
  adoptBackup,
  applyExportCheckpoint,
  isPristine,
  assessImport,
  createBackup,
  parseBackupFile,
  syncRevision,
  type ImportAssessment
} from "@engine/backup";
import { createEngine } from "@engine/router";
import { BrowserStore, type BackupEntry } from "./browser-store";

/** Un seul moteur et un seul stockage par onglet : tout s'exécute sur l'appareil. */
export const store = new BrowserStore();
export const engine = createEngine(store);

export function deviceLabel(userAgent = navigator.userAgent, touchPoints = navigator.maxTouchPoints): string {
  if (/iPhone/i.test(userAgent)) return "iPhone";
  // iPadOS se présente comme un Mac ; on le reconnaît à son écran tactile.
  if (/iPad/i.test(userAgent) || (/Macintosh/i.test(userAgent) && touchPoints > 1)) return "iPad";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Macintosh/i.test(userAgent)) return "Mac";
  return "PC";
}

export const isIos = () => ["iPhone", "iPad"].includes(deviceLabel());
export const isStandalone = () => window.matchMedia?.("(display-mode: standalone)").matches
  || (navigator as Navigator & { standalone?: boolean }).standalone === true;

export interface RelayStatus {
  device: string;
  changesSinceCheckpoint: number;
  lastCheckpointAt?: string;
  lastChangeAt?: string;
  persisted?: boolean;
  /** Appareil jamais utilisé : la reprise de l'ancienne progression du PC est proposée. */
  pristine: boolean;
}

export async function getRelayStatus(): Promise<RelayStatus> {
  const state = await store.read();
  const persisted = await navigator.storage?.persisted?.().catch(() => undefined);
  return {
    device: deviceLabel(),
    changesSinceCheckpoint: state.sync?.changesSinceCheckpoint ?? 0,
    lastCheckpointAt: state.sync?.lastCheckpointAt,
    lastChangeAt: state.sync?.lastChangeAt,
    pristine: isPristine(state),
    persisted
  };
}

/** Demande au navigateur de ne pas effacer le stockage (Safari le fait sinon après 7 jours sans visite). */
export async function requestPersistentStorage(): Promise<boolean | undefined> {
  if (!navigator.storage?.persist) return undefined;
  if (await navigator.storage.persisted()) return true;
  return navigator.storage.persist().catch(() => undefined);
}

const fileDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}-${String(date.getHours()).padStart(2, "0")}h${String(date.getMinutes()).padStart(2, "0")}`;

export type ExportOutcome = "shared" | "downloaded" | "cancelled";

/**
 * Envoie la progression. Sur iPhone, la feuille de partage propose Mail, Fichiers/iCloud ou AirDrop ;
 * ailleurs, le fichier est téléchargé. Le point de relais n'est posé que si l'envoi a eu lieu.
 */
export async function exportProgress(): Promise<ExportOutcome> {
  const now = new Date();
  const device = deviceLabel();
  const checkpointId = crypto.randomUUID();
  const before = await store.read();
  // Révision relevée avant de fabriquer le fichier : le fichier remet le compteur à zéro, c'est donc la seule
  // référence fiable pour savoir si l'apprenant a travaillé pendant la feuille de partage (LANG-02).
  const sentRevision = syncRevision(before);
  const backup = createBackup(before, device, checkpointId, now);
  const name = `sd-languages-${device.toLowerCase()}-${fileDate(now)}.json`;
  const text = `${JSON.stringify(backup, null, 1)}\n`;
  const file = new File([text], name, { type: "application/json" });

  let outcome: ExportOutcome;
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "Progression SD Languages" });
      outcome = "shared";
    } catch (reason) {
      if ((reason as Error).name === "AbortError") return "cancelled";
      throw reason;
    }
  } else {
    const url = URL.createObjectURL(file);
    const link = Object.assign(document.createElement("a"), { href: url, download: name });
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    outcome = "downloaded";
  }
  // L'état a pu changer pendant la feuille de partage : on ne pose le point que sur l'état envoyé.
  await store.transform((state) => ({ state: applyExportCheckpoint(state, backup, sentRevision), result: undefined }));
  return outcome;
}

export interface ImportPreview {
  state: LearnerState;
  exportedAt?: string;
  sourceDevice?: string;
  assessment: ImportAssessment;
}

export async function previewImport(text: string): Promise<ImportPreview> {
  const parsed = parseBackupFile(text);
  return {
    state: parsed.state,
    exportedAt: parsed.exportedAt,
    sourceDevice: parsed.device,
    assessment: assessImport(await store.read(), parsed.state)
  };
}

export async function confirmImport(preview: ImportPreview): Promise<void> {
  await store.replace(adoptBackup(preview.state, crypto.randomUUID()), "before-import");
}

export const listBackups = (): Promise<BackupEntry[]> => store.listBackups();

export async function restoreBackup(id: number): Promise<void> {
  const state = await store.getBackup(id);
  if (!state) throw new Error("Cette sauvegarde n'existe plus.");
  await store.replace(state, "before-restore");
}

/**
 * Reprise unique de l'ancienne progression du PC : quand l'application est servie par l'ancien
 * serveur local, son fichier `data/sd-languages.json` reste lisible via `/api/export`.
 */
export async function fetchLegacyServerExport(): Promise<string | undefined> {
  // Sur GitHub Pages (base /sd-languages/) ou hors ligne, il n'y a pas de serveur à interroger.
  if (import.meta.env.BASE_URL !== "/" || !navigator.onLine) return undefined;
  try {
    const response = await fetch("/api/export", { cache: "no-store", headers: { Accept: "application/json" } });
    if (!response.ok || !response.headers.get("content-type")?.includes("json")) return undefined;
    return await response.text();
  } catch {
    return undefined;
  }
}

/** Efface toutes les copies connues sur cet appareil : progression, sauvegardes, caches, préférences. */
export async function eraseDevice(): Promise<void> {
  await store.erase();
  if ("caches" in window) {
    // On efface les voix gardées, pas l'application elle-même : sinon elle ne se rouvrirait plus hors ligne (audit du 26/10/2026).
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("sd-languages-audio")).map((key) => caches.delete(key)));
  }
  try {
    localStorage.clear();
  } catch {
    // Stockage indisponible (navigation privée) : rien à effacer.
  }
}
