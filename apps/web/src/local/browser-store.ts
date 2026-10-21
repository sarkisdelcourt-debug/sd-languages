import type { LearnerState } from "@shared/types";
import { createInitialState } from "@engine/initial-state";
import { migrateState, type StateStore } from "@engine/state";
import { isPristine, noteChange, summarizeState, type StateSummary } from "@engine/backup";

/**
 * Persistance de l'appareil (iPhone ou navigateur du PC). Tout l'état d'apprentissage vit dans
 * IndexedDB ; aucune donnée ne quitte l'appareil sans un envoi explicite de fichier.
 *
 * - `update` est exclusif entre onglets (Web Locks) et au sein d'un onglet (file de promesses).
 * - Une copie quotidienne et une copie avant chaque remplacement sont gardées (10 au plus).
 * - Les autres onglets sont prévenus d'un changement par BroadcastChannel.
 */
export const DATA_DATABASE = "sd-languages-data";
/** Ancienne file hors ligne vers le serveur PC, abandonnée avec le mode téléphone. */
export const LEGACY_OUTBOX_DATABASE = "sd-languages-offline";
const STATE_KEY = "current";
const MAX_BACKUPS = 10;
const LOCK_NAME = "sd-languages-state";
const CHANNEL_NAME = "sd-languages-state";

export type BackupReason = "daily" | "before-import" | "before-restore";

export interface BackupEntry {
  id: number;
  createdAt: string;
  reason: BackupReason;
  summary: StateSummary;
}

interface StoredBackup extends Omit<BackupEntry, "id"> {
  id?: number;
  state: LearnerState;
}

interface Options {
  databaseName?: string;
  factory?: IDBFactory;
  locks?: LockManager;
  channel?: boolean;
  now?: () => Date;
}

function promisify<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Le stockage de l'appareil a refusé l'opération."));
  });
}

function completion(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error("L'écriture sur l'appareil a été annulée."));
    transaction.onerror = () => reject(transaction.error ?? new Error("L'écriture sur l'appareil a échoué."));
  });
}

const localDay = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export class BrowserStore implements StateStore {
  private readonly databaseName: string;
  private readonly factory: IDBFactory;
  private readonly locks?: LockManager;
  private readonly now: () => Date;
  private readonly channel?: BroadcastChannel;
  private readonly listeners = new Set<() => void>();
  private database?: Promise<IDBDatabase>;
  private queue: Promise<unknown> = Promise.resolve();

  constructor(options: Options = {}) {
    this.databaseName = options.databaseName ?? DATA_DATABASE;
    this.factory = options.factory ?? indexedDB;
    this.locks = options.locks ?? (typeof navigator !== "undefined" ? navigator.locks : undefined);
    this.now = options.now ?? (() => new Date());
    if (options.channel !== false && typeof BroadcastChannel !== "undefined") {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.channel.onmessage = () => this.listeners.forEach((listener) => listener());
    }
  }

  /** Prévient quand un autre onglet a modifié la progression. */
  onExternalChange(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async read(): Promise<LearnerState> {
    const stored = await this.readRaw();
    return stored ? migrateState(stored) : createInitialState();
  }

  update<T>(mutation: (state: LearnerState) => T | Promise<T>): Promise<T> {
    return this.exclusive(async () => {
      const state = await this.read();
      const before = JSON.stringify(state);
      await this.dailyBackup(state);
      const result = await mutation(state);
      if (JSON.stringify(state) !== before) {
        noteChange(state, this.now());
        await this.writeState(state);
      }
      return result;
    });
  }

  /**
   * Remplace tout l'état (reprise d'un fichier, restauration). L'état actuel est d'abord copié dans
   * les sauvegardes de l'appareil, sauf s'il est vierge.
   */
  replace(next: LearnerState, reason: Exclude<BackupReason, "daily">): Promise<void> {
    return this.exclusive(async () => {
      const current = await this.read();
      if (!isPristine(current)) await this.addBackup(current, reason);
      await this.writeState(next);
    });
  }

  /** Transforme l'état sans le compter comme activité (ex. poser un point de relais à l'envoi). */
  transform<T>(transformation: (state: LearnerState) => { state: LearnerState; result: T }): Promise<T> {
    return this.exclusive(async () => {
      const { state, result } = transformation(await this.read());
      await this.writeState(state);
      return result;
    });
  }

  async listBackups(): Promise<BackupEntry[]> {
    const database = await this.open();
    const all = await promisify(database.transaction("backups").objectStore("backups").getAll() as IDBRequest<StoredBackup[]>);
    return all
      .map(({ state: _state, ...entry }) => entry as BackupEntry)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt) || right.id - left.id);
  }

  async getBackup(id: number): Promise<LearnerState | undefined> {
    const database = await this.open();
    const backup = await promisify(database.transaction("backups").objectStore("backups").get(id) as IDBRequest<StoredBackup | undefined>);
    return backup ? migrateState(backup.state) : undefined;
  }

  async getMeta<T>(key: string): Promise<T | undefined> {
    const database = await this.open();
    return promisify(database.transaction("meta").objectStore("meta").get(key) as IDBRequest<T | undefined>);
  }

  async setMeta(key: string, value: unknown): Promise<void> {
    const database = await this.open();
    const transaction = database.transaction("meta", "readwrite");
    transaction.objectStore("meta").put(value, key);
    await completion(transaction);
  }

  /** Efface la base de l'appareil, sauvegardes comprises, ainsi que l'ancienne file hors ligne. */
  async erase(): Promise<void> {
    await this.exclusive(async () => {
      const database = await this.database;
      database?.close();
      this.database = undefined;
      await Promise.all([this.databaseName, LEGACY_OUTBOX_DATABASE].map((name) => new Promise<void>((resolve, reject) => {
        const request = this.factory.deleteDatabase(name);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error ?? new Error("Impossible d'effacer le stockage de l'appareil."));
        request.onblocked = () => resolve();
      })));
    });
    this.channel?.postMessage({ type: "erased" });
  }

  close() {
    this.channel?.close();
    void this.database?.then((database) => database.close());
    this.database = undefined;
  }

  private exclusive<T>(operation: () => Promise<T>): Promise<T> {
    const run = () => (this.locks ? this.locks.request(LOCK_NAME, operation) as Promise<T> : operation());
    const next = this.queue.then(run, run);
    this.queue = next.catch(() => undefined);
    return next;
  }

  private open(): Promise<IDBDatabase> {
    this.database ??= new Promise((resolve, reject) => {
      const request = this.factory.open(this.databaseName, 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains("state")) database.createObjectStore("state");
        if (!database.objectStoreNames.contains("backups")) database.createObjectStore("backups", { keyPath: "id", autoIncrement: true });
        if (!database.objectStoreNames.contains("meta")) database.createObjectStore("meta");
      };
      request.onsuccess = () => {
        const database = request.result;
        database.onversionchange = () => {
          database.close();
          this.database = undefined;
        };
        resolve(database);
      };
      request.onerror = () => reject(request.error ?? new Error("Le stockage de l'appareil est indisponible."));
      request.onblocked = () => reject(new Error("Le stockage est bloqué par un autre onglet. Fermez les autres onglets SD Languages."));
    });
    return this.database;
  }

  private async readRaw(): Promise<Partial<LearnerState> | undefined> {
    const database = await this.open();
    return promisify(database.transaction("state").objectStore("state").get(STATE_KEY) as IDBRequest<Partial<LearnerState> | undefined>);
  }

  private async writeState(state: LearnerState): Promise<void> {
    const database = await this.open();
    const transaction = database.transaction("state", "readwrite");
    transaction.objectStore("state").put(state, STATE_KEY);
    await completion(transaction);
    this.channel?.postMessage({ type: "changed" });
  }

  private async dailyBackup(state: LearnerState): Promise<void> {
    if (isPristine(state)) return;
    const today = localDay(this.now());
    if ((await this.getMeta<string>("lastDailyBackup")) === today) return;
    await this.addBackup(state, "daily");
    await this.setMeta("lastDailyBackup", today);
  }

  private async addBackup(state: LearnerState, reason: BackupReason): Promise<void> {
    const database = await this.open();
    const transaction = database.transaction("backups", "readwrite");
    const store = transaction.objectStore("backups");
    const entry: StoredBackup = { createdAt: this.now().toISOString(), reason, summary: summarizeState(state), state };
    store.add(entry);
    const keys = await promisify(store.getAllKeys());
    const excess = keys.length - MAX_BACKUPS;
    for (const key of keys.slice(0, Math.max(0, excess))) store.delete(key);
    await completion(transaction);
  }
}
