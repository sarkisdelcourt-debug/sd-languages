import { LANGUAGE_CODES } from "../../shared/src/catalog.js";
import type { LanguageCode, LearnerState, SyncMeta } from "../../shared/src/types.js";
import { CURRENT_STATE_VERSION, migrateState } from "./state.js";

/**
 * Relais par fichier entre appareils (décision du 21/10/2026) : avant de changer d'appareil,
 * l'apprenant envoie un fichier ; l'autre appareil le reprend en remplaçant son état. Ce module,
 * pur et testé, décide si une reprise peut écraser l'appareil sans perte et explique pourquoi.
 */
export const BACKUP_FORMAT = "sd-languages-backup";
export const BACKUP_FORMAT_VERSION = 1;
export const MAX_BACKUP_BYTES = 5_000_000;
const MAX_CHECKPOINT_HISTORY = 50;

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  formatVersion: number;
  exportedAt: string;
  device: string;
  state: LearnerState;
}

export interface LanguageSummary {
  xp: number;
  completedExercises: number;
  completedLessons: number;
  activeLesson: boolean;
}

export interface StateSummary {
  languages: Record<LanguageCode, LanguageSummary>;
  totalXp: number;
  lastActivityAt?: string;
}

export type ImportVerdict = "safe" | "identical" | "warning";

export interface ImportAssessment {
  verdict: ImportVerdict;
  reasons: string[];
  current: StateSummary;
  incoming: StateSummary;
}

const emptySync = (): SyncMeta => ({ checkpointHistory: [], changesSinceCheckpoint: 0 });

export function summarizeState(state: LearnerState): StateSummary {
  const languages = Object.fromEntries(LANGUAGE_CODES.map((language) => {
    const sessions = state.lessonSessions.filter((session) => session.language === language);
    return [language, {
      xp: state.progress[language]?.xp ?? 0,
      completedExercises: state.progress[language]?.completedExercises ?? 0,
      completedLessons: sessions.filter((session) => session.status === "completed").length,
      activeLesson: sessions.some((session) => session.status === "active")
    }];
  })) as Record<LanguageCode, LanguageSummary>;
  const dates = [
    ...state.lessonSessions.map((session) => session.updatedAt),
    ...state.pronunciationAttempts.map((attempt) => attempt.createdAt),
    ...LANGUAGE_CODES.flatMap((language) => [
      state.progress[language]?.lastPracticeDate,
      state.progress[language]?.diagnostic?.completedAt
    ]),
    state.sync?.lastChangeAt
  ].filter((value): value is string => typeof value === "string" && value.length > 0);
  return {
    languages,
    totalXp: LANGUAGE_CODES.reduce((sum, language) => sum + languages[language].xp, 0),
    lastActivityAt: dates.sort().at(-1)
  };
}

/** Un appareil vierge (jamais utilisé) peut tout recevoir sans avertissement. */
export function isPristine(state: LearnerState): boolean {
  return LANGUAGE_CODES.every((language) => (state.progress[language]?.xp ?? 0) === 0
    && (state.progress[language]?.completedExercises ?? 0) === 0
    && !state.progress[language]?.diagnostic)
    && state.lessonSessions.length === 0
    && state.mistakes.length === 0
    && state.reviewCards.length === 0
    && state.pronunciationAttempts.length === 0
    && LANGUAGE_CODES.every((language) => state.conversations[language]?.messages.length === 0)
    && LANGUAGE_CODES.every((language) => !state.settings[language]?.onboardingCompleted);
}

/** À appeler après chaque mutation réelle de l'état sur un appareil. */
export function noteChange(state: LearnerState, now = new Date()): void {
  const sync = state.sync ?? emptySync();
  state.sync = { ...sync, changesSinceCheckpoint: sync.changesSinceCheckpoint + 1, lastChangeAt: now.toISOString() };
}

function withCheckpoint(sync: SyncMeta | undefined, checkpointId: string, now: Date): SyncMeta {
  const history = (sync?.checkpointHistory ?? []).filter((id) => id !== checkpointId);
  return {
    checkpointId,
    checkpointHistory: [...history, checkpointId].slice(-MAX_CHECKPOINT_HISTORY),
    changesSinceCheckpoint: 0,
    lastCheckpointAt: now.toISOString(),
    lastChangeAt: sync?.lastChangeAt
  };
}

/** Prépare l'envoi : l'appareil émetteur et le fichier partagent un nouveau point de relais. */
export function createBackup(state: LearnerState, device: string, checkpointId: string, now = new Date()): BackupFile {
  const next = structuredClone(state);
  next.sync = withCheckpoint(state.sync, checkpointId, now);
  return { format: BACKUP_FORMAT, formatVersion: BACKUP_FORMAT_VERSION, exportedAt: now.toISOString(), device, state: next };
}

/** L'état que l'appareil adopte après une reprise : celui du fichier, au même point de relais. */
export function adoptBackup(incoming: LearnerState, fallbackCheckpointId: string, now = new Date()): LearnerState {
  const next = structuredClone(incoming);
  next.sync = withCheckpoint(incoming.sync, incoming.sync?.checkpointId ?? fallbackCheckpointId, now);
  return next;
}

export class BackupFormatError extends Error {
  override name = "BackupFormatError";
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Lit un fichier de relais ou une ancienne exportation brute (`GET /api/export` du serveur PC).
 * Refuse tout ce qui ne ressemble pas à un profil SD Languages plutôt que d'écraser l'appareil
 * avec un état incohérent.
 */
export function parseBackupFile(text: string): { state: LearnerState; exportedAt?: string; device?: string } {
  if (text.length > MAX_BACKUP_BYTES) throw new BackupFormatError("Ce fichier est trop volumineux pour être une sauvegarde SD Languages.");
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new BackupFormatError("Ce fichier n'est pas lisible (JSON invalide).");
  }
  if (!isRecord(raw)) throw new BackupFormatError("Ce fichier n'est pas une sauvegarde SD Languages.");
  let candidate: unknown = raw;
  let exportedAt: string | undefined;
  let device: string | undefined;
  if (raw.format !== undefined) {
    if (raw.format !== BACKUP_FORMAT) throw new BackupFormatError("Ce fichier n'est pas une sauvegarde SD Languages.");
    if (typeof raw.formatVersion !== "number" || raw.formatVersion > BACKUP_FORMAT_VERSION) {
      throw new BackupFormatError("Cette sauvegarde vient d'une version plus récente de l'application. Mettez d'abord l'application à jour.");
    }
    candidate = raw.state;
    exportedAt = typeof raw.exportedAt === "string" ? raw.exportedAt : undefined;
    device = typeof raw.device === "string" ? raw.device.slice(0, 40) : undefined;
  }
  if (!isRecord(candidate) || !isRecord(candidate.progress)) {
    throw new BackupFormatError("Ce fichier ne contient pas de progression SD Languages.");
  }
  if (typeof candidate.version === "number" && candidate.version > CURRENT_STATE_VERSION) {
    throw new BackupFormatError("Cette sauvegarde vient d'une version plus récente de l'application. Mettez d'abord l'application à jour.");
  }
  for (const language of LANGUAGE_CODES) {
    const progress = candidate.progress[language];
    if (progress !== undefined && (!isRecord(progress) || typeof progress.xp !== "number")) {
      throw new BackupFormatError(`La progression « ${language} » de ce fichier est illisible.`);
    }
  }
  for (const key of ["mistakes", "reviewCards", "processedAttemptIds", "lessonSessions", "pronunciationAttempts"] as const) {
    if (candidate[key] !== undefined && !Array.isArray(candidate[key])) {
      throw new BackupFormatError("La structure de ce fichier est incomplète ou abîmée.");
    }
  }
  if (candidate.sync !== undefined && (!isRecord(candidate.sync) || !Array.isArray(candidate.sync.checkpointHistory))) {
    throw new BackupFormatError("Les informations de relais de ce fichier sont abîmées.");
  }
  return { state: migrateState(candidate as Partial<LearnerState>), exportedAt, device };
}

const changesLabel = (count: number) => `${count} changement${count > 1 ? "s" : ""}`;

/** Dit, avant tout remplacement, si l'appareil perdrait quelque chose qui n'est pas dans le fichier. */
export function assessImport(current: LearnerState, incoming: LearnerState): ImportAssessment {
  const summaries = { current: summarizeState(current), incoming: summarizeState(incoming) };
  if (isPristine(current)) return { verdict: "safe", reasons: [], ...summaries };
  const sync = current.sync;
  const reasons: string[] = [];
  if (!sync?.checkpointId) {
    reasons.push("Cet appareil contient déjà une progression qui n'a jamais été envoyée : elle serait remplacée par celle du fichier.");
  } else {
    if (sync.changesSinceCheckpoint > 0) {
      reasons.push(`Cet appareil a ${changesLabel(sync.changesSinceCheckpoint)} depuis le dernier relais, absents de ce fichier.`);
    }
    if (!incoming.sync?.checkpointHistory.includes(sync.checkpointId)) {
      reasons.push("Ce fichier ne prolonge pas le dernier relais de cet appareil : il est peut-être plus ancien, ou vient d'une autre lignée.");
    }
  }
  if (reasons.length > 0) return { verdict: "warning", reasons, ...summaries };
  const identical = incoming.sync?.checkpointId === sync?.checkpointId && (incoming.sync?.changesSinceCheckpoint ?? 0) === 0;
  return { verdict: identical ? "identical" : "safe", reasons, ...summaries };
}
