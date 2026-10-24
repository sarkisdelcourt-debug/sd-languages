import { LANGUAGE_CODES } from "../../shared/src/catalog.js";
import type { LanguageCode, LearnerState, SyncMeta } from "../../shared/src/types.js";
import { createDailyPlan } from "./modules/daily-plan.js";
import { createDashboard } from "./modules/progress.js";
import { createSkillsView } from "./modules/skills.js";
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
  if (candidate.sync !== undefined) {
    const sync = candidate.sync;
    if (!isRecord(sync) || !Array.isArray(sync.checkpointHistory) || !sync.checkpointHistory.every(isText)
      || (sync.changesSinceCheckpoint !== undefined && !isCount(sync.changesSinceCheckpoint))) {
      throw new BackupFormatError("Les informations de relais de ce fichier sont abîmées.");
    }
  }
  checkRecords(candidate.reviewCards, REVIEW_CARD_RULE);
  checkRecords(candidate.mistakes, MISTAKE_RULE);
  checkRecords(candidate.lessonSessions, LESSON_SESSION_RULE);
  (candidate.processedAttemptIds as unknown[] | undefined)?.forEach((id, index) => {
    if (!isText(id)) throw new BackupFormatError(`L'identifiant de tentative n°${index + 1} de ce fichier est illisible (ce n'est pas du texte).`);
  });
  for (const language of LANGUAGE_CODES) {
    const thread = isRecord(candidate.conversations) ? candidate.conversations[language] : undefined;
    if (thread !== undefined && (!isRecord(thread) || !Array.isArray(thread.messages) || !thread.messages.every(isRecord))) {
      throw new BackupFormatError(`La conversation « ${language} » de ce fichier est illisible.`);
    }
    const settings = isRecord(candidate.settings) ? candidate.settings[language] : undefined;
    if (settings !== undefined && !isRecord(settings)) {
      throw new BackupFormatError(`Les réglages « ${language} » de ce fichier sont illisibles.`);
    }
  }
  for (const [key, message] of [
    ["conversations", "Les conversations de ce fichier sont abîmées."],
    ["settings", "Les réglages de ce fichier sont abîmés."],
    ["lessonProgress", "La progression des leçons de ce fichier est abîmée."],
    ["pronunciationProgress", "La progression de prononciation de ce fichier est abîmée."],
    ["exerciseHistory", "L'historique des exercices de ce fichier est abîmé."]
  ] as const) {
    if (candidate[key] !== undefined && !isRecord(candidate[key])) throw new BackupFormatError(message);
  }
  const state = migrateState(candidate as Partial<LearnerState>);
  // Dernier filet : ce qui est accepté doit pouvoir être affiché, sinon l'appareil serait remplacé par un profil inutilisable.
  try {
    createDashboard(state);
    summarizeState(state);
    isPristine(state);
    // Les écrans qui lisent les séances, les erreurs et les conversations de chaque langue doivent pouvoir s'afficher.
    for (const language of LANGUAGE_CODES) {
      createSkillsView(state, language);
      createDailyPlan(state, language);
    }
  } catch {
    throw new BackupFormatError("Ce fichier contient des données que l'application ne sait pas afficher : la reprise est refusée pour ne rien écraser.");
  }
  return { state, exportedAt, device };
}

const isText = (value: unknown): value is string => typeof value === "string";
const isCount = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

/**
 * Champs d'un élément de liste. `id` et `language` (et `status` pour une séance) sont obligatoires : sans eux le
 * moteur ne sait pas où ranger l'élément. Les autres champs, absents des anciens profils, ne sont refusés que
 * s'ils sont présents avec un mauvais type.
 */
interface RecordRule {
  label: string;
  text: readonly string[];
  numbers: readonly string[];
  statuses?: readonly string[];
}

const REVIEW_CARD_RULE: RecordRule = {
  label: "La carte de révision",
  text: ["sourceExerciseId", "prompt", "answer", "focus", "nextReviewAt", "lastReviewedAt"],
  numbers: ["intervalDays", "easeFactor", "repetitions", "lapses"]
};
const MISTAKE_RULE: RecordRule = {
  label: "L'erreur enregistrée",
  text: ["exerciseId", "submittedAnswer", "expectedAnswer", "focus", "firstSeenAt", "lastSeenAt"],
  numbers: ["occurrenceCount", "resolvedCount"]
};
const LESSON_SESSION_RULE: RecordRule = {
  label: "La séance de leçon",
  text: ["lessonId", "startedAt", "updatedAt", "completedAt"],
  numbers: ["currentExerciseIndex", "conversationTurns", "lessonRevision"],
  statuses: ["active", "completed"]
};

function checkRecords(list: unknown, rule: RecordRule): void {
  if (!Array.isArray(list)) return;
  const seen = new Set<string>();
  list.forEach((item, index) => {
    const who = `${rule.label} n°${index + 1} de ce fichier`;
    const fail = (reason: string): never => { throw new BackupFormatError(`${who} est illisible (${reason}).`); };
    if (!isRecord(item)) return fail("ce n'est pas un objet");
    if (!isText(item.id) || item.id.length === 0) return fail("identifiant manquant");
    if (seen.has(item.id)) throw new BackupFormatError(`${who} est en double (identifiant « ${item.id} »).`);
    seen.add(item.id);
    if (!(LANGUAGE_CODES as readonly string[]).includes(item.language as string)) return fail(`langue « ${String(item.language)} » inconnue`);
    if (rule.statuses && !rule.statuses.includes(item.status as string)) return fail(`statut « ${String(item.status)} » inconnu`);
    for (const key of rule.text) if (item[key] !== undefined && !isText(item[key])) fail(`« ${key} » doit être du texte`);
    for (const key of rule.numbers) if (item[key] !== undefined && !isCount(item[key])) fail(`« ${key} » doit être un nombre`);
    if (rule === LESSON_SESSION_RULE) {
      if (!Array.isArray(item.attempts)) fail("« attempts » doit être une liste");
      if (!isText(item.lessonId) || item.lessonId.length === 0) fail("leçon manquante");
    }
  });
}

/** Ce qui identifie l'état de la progression au moment de l'envoi (compteur de changements et dernier changement). */
export interface SyncRevision {
  changes: number;
  lastChangeAt?: string;
}

export const syncRevision = (state: LearnerState): SyncRevision => ({
  changes: state.sync?.changesSinceCheckpoint ?? 0,
  lastChangeAt: state.sync?.lastChangeAt
});

/**
 * État de l'appareil après un envoi réussi. `sent` est la révision relevée AVANT de fabriquer le fichier : le
 * fichier remet le compteur à zéro, on ne peut donc pas s'en servir pour savoir si l'apprenant a travaillé
 * entre-temps. Si la révision courante est la même, le point de relais est posé ; sinon l'état courant est rendu
 * tel quel, avec le travail fait pendant l'envoi et sans point (ce travail n'est pas dans le fichier).
 */
export function applyExportCheckpoint(current: LearnerState, backup: BackupFile, sent: SyncRevision): LearnerState {
  const now = syncRevision(current);
  if (now.changes !== sent.changes || now.lastChangeAt !== sent.lastChangeAt) return current;
  return { ...current, sync: backup.state.sync };
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
