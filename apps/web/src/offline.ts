import type { LanguageCode } from "@shared/types";

const DATABASE_NAME = "sd-languages-offline";
const DATABASE_VERSION = 1;
const STORE_NAME = "outbox";
export const OFFLINE_STATUS_EVENT = "sd-languages-offline-status";

type QueueStatus = "pending" | "failed";

interface QueuedMutation {
  id: string;
  path: string;
  method: string;
  body?: string;
  createdAt: string;
  attempts: number;
  status: QueueStatus;
  lastError?: string;
}

export interface OfflineSnapshot {
  pending: number;
  failed: number;
}

export interface SyncResult extends OfflineSnapshot {
  synced: number;
  reachable: boolean;
}

export class OfflineQueuedError extends Error {
  constructor() {
    super("Réponse gardée sur cet appareil. Elle sera synchronisée dès que le serveur local sera de nouveau disponible.");
    this.name = "OfflineQueuedError";
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("createdAt", "createdAt");
        store.createIndex("status", "status");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Le stockage hors ligne est indisponible."));
  });
}

function transactionRequest<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDatabase().then((database) => new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const request = action(transaction.objectStore(STORE_NAME));
    let result: T;
    request.onsuccess = () => { result = request.result; };
    request.onerror = () => reject(request.error ?? new Error("Impossible de mettre à jour la file hors ligne."));
    transaction.oncomplete = () => {
      database.close();
      resolve(result);
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error("La transaction hors ligne a été annulée."));
    };
  }));
}

function notifyStatus(reachable?: boolean) {
  window.dispatchEvent(new CustomEvent(OFFLINE_STATUS_EVENT, { detail: { reachable } }));
}

export function reportCachedRead() {
  notifyStatus(false);
}

export function isQueueableMutation(path: string, method = "GET") {
  const normalizedMethod = method.toUpperCase();
  if (normalizedMethod === "PATCH" && /^\/api\/settings\/(en|de|es)$/.test(path)) return true;
  if (normalizedMethod !== "POST") return false;
  return /^\/api\/practice\/[^/]+\/answer$/.test(path)
    || /^\/api\/lessons\/(en|de|es)\/answer$/.test(path)
    || /^\/api\/pronunciation\/[^/]+\/attempts$/.test(path);
}

export async function queueMutation(path: string, options: RequestInit) {
  if (!("indexedDB" in window)) return false;
  const method = (options.method ?? "POST").toUpperCase();
  if (!isQueueableMutation(path, method)) return false;
  const queued = await listMutations();
  const existing = queued.find((item) => item.path === path && item.status === "pending");
  if (existing && (method === "PATCH" || existing.body === options.body)) {
    if (method === "PATCH") {
      await saveMutation({ ...existing, body: typeof options.body === "string" ? options.body : undefined });
    }
    notifyStatus(false);
    return true;
  }
  const item: QueuedMutation = {
    id: crypto.randomUUID(),
    path,
    method,
    body: typeof options.body === "string" ? options.body : undefined,
    createdAt: new Date().toISOString(),
    attempts: 0,
    status: "pending"
  };
  await transactionRequest("readwrite", (store) => store.put(item));
  notifyStatus(false);
  return true;
}

async function listMutations(): Promise<QueuedMutation[]> {
  const items = await transactionRequest("readonly", (store) => store.getAll());
  return items.sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

async function saveMutation(item: QueuedMutation) {
  await transactionRequest("readwrite", (store) => store.put(item));
}

async function removeMutation(id: string) {
  await transactionRequest("readwrite", (store) => store.delete(id));
}

export async function getOfflineSnapshot(): Promise<OfflineSnapshot> {
  if (!("indexedDB" in window)) return { pending: 0, failed: 0 };
  const items = await listMutations();
  return {
    pending: items.filter((item) => item.status === "pending").length,
    failed: items.filter((item) => item.status === "failed").length
  };
}

export async function probeLocalServer() {
  try {
    const response = await fetch("/api/health", { cache: "no-store", headers: { Accept: "application/json" } });
    return response.ok;
  } catch {
    return false;
  }
}

async function flushUnlocked(): Promise<SyncResult> {
  if (!("indexedDB" in window)) return { pending: 0, failed: 0, synced: 0, reachable: await probeLocalServer() };
  const reachable = await probeLocalServer();
  if (!reachable) return { ...(await getOfflineSnapshot()), synced: 0, reachable: false };

  let synced = 0;
  for (const item of await listMutations()) {
    if (item.status === "failed") continue;
    try {
      const response = await fetch(item.path, {
        method: item.method,
        body: item.body,
        headers: { "Content-Type": "application/json", "X-SD-Offline-Replay": item.id }
      });
      if (response.ok) {
        await removeMutation(item.id);
        synced += 1;
        continue;
      }
      const message = ((await response.json().catch(() => null)) as { error?: string } | null)?.error;
      if (response.status >= 400 && response.status < 500) {
        await saveMutation({ ...item, status: "failed", attempts: item.attempts + 1, lastError: message ?? `Erreur ${response.status}` });
        continue;
      }
      break;
    } catch {
      break;
    }
  }
  const snapshot = await getOfflineSnapshot();
  return { ...snapshot, synced, reachable: true };
}

export async function flushOfflineQueue(): Promise<SyncResult> {
  if (navigator.locks) {
    return navigator.locks.request("sd-languages-outbox", () => flushUnlocked());
  }
  return flushUnlocked();
}

const warmPaths = (languages: LanguageCode[]) => [
  "/api/languages",
  "/api/dashboard",
  ...languages.flatMap((language) => [
    `/api/plan/${language}`,
    `/api/settings/${language}`,
    `/api/diagnostic/${language}`,
    `/api/practice/${language}`,
    `/api/reviews/${language}`,
    `/api/mistakes?language=${language}`,
    `/api/scenarios/${language}`,
    `/api/conversations/${language}`,
    `/api/lessons/${language}`,
    `/api/pronunciation/${language}`
  ])
];

export async function prepareOfflineLibrary() {
  if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) return;
  await Promise.allSettled(
    warmPaths(["en", "de", "es"]).map((path) => fetch(path, { headers: { Accept: "application/json" } }))
  );
}
