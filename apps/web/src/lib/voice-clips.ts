import type { LanguageCode } from "@shared/types";

/**
 * Voix intégrées (24/10/2026) : enregistrements Piper (voix libres) rangés dans public/audio, listés dans manifest.json.
 * Ils remplacent les voix de l'appareil, souvent absentes sur iPhone (l'anglais était lu avec la voix française).
 * Un texte sans enregistrement est lu par la voix de l'appareil (repli dans speakText). Le service worker garde en cache
 * les enregistrements déjà écoutés : ils fonctionnent ensuite hors ligne.
 */
interface ClipManifest {
  version: number;
  voices: Record<string, string>;
  clips: Record<string, Record<string, string>>;
  slow: Record<string, string[]>;
}

const BASE = `${import.meta.env.BASE_URL}audio/`;
let manifest: ClipManifest | undefined;
let loading: Promise<ClipManifest | undefined> | undefined;
let current: HTMLAudioElement | undefined;
const listeners = new Set<() => void>();

/** Charge la liste des enregistrements (une fois). À appeler au démarrage : la lecture doit rester synchrone au toucher (iOS). */
export function loadClipManifest(): Promise<ClipManifest | undefined> {
  loading ??= fetch(`${BASE}manifest.json`)
    .then((response) => (response.ok ? (response.json() as Promise<ClipManifest>) : undefined))
    .then((value) => { manifest = value; listeners.forEach((listener) => listener()); return value; })
    .catch(() => undefined);
  return loading;
}

export function onClipManifestLoaded(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function clipVoiceName(language: LanguageCode): string | undefined {
  return manifest && Object.keys(manifest.clips[language] ?? {}).length > 0 ? manifest.voices[language] : undefined;
}

const idFor = (text: string, language: LanguageCode) => manifest?.clips[language]?.[text] ?? manifest?.clips[language]?.[text.trim()];

export function hasClip(text: string, language: LanguageCode): boolean {
  return idFor(text, language) !== undefined;
}

export function stopClip(): void {
  if (!current) return;
  current.pause();
  current = undefined;
}

/** Joue l'enregistrement du texte s'il existe ; renvoie false sinon (l'appelant lit alors avec la voix de l'appareil). */
export function playClip(text: string, language: LanguageCode, slow: boolean): boolean {
  const id = idFor(text, language);
  if (!id) return false;
  const useSlow = slow && (manifest?.slow[language] ?? []).includes(id);
  stopClip();
  const audio = new Audio(`${BASE}${language}/${id}${useSlow ? "-s" : ""}.mp3`);
  current = audio;
  void audio.play().catch(() => undefined);
  return true;
}

/** Télécharge tous les enregistrements d'une langue (le service worker les garde pour l'écoute hors ligne). */
export async function downloadLanguageClips(language: LanguageCode, onProgress: (done: number, total: number) => void): Promise<void> {
  const loaded = await loadClipManifest();
  if (!loaded) throw new Error("La liste des voix est introuvable.");
  const ids = [...new Set(Object.values(loaded.clips[language] ?? {}))];
  const urls = [...ids.map((id) => `${BASE}${language}/${id}.mp3`), ...(loaded.slow[language] ?? []).map((id) => `${BASE}${language}/${id}-s.mp3`)];
  let done = 0;
  onProgress(0, urls.length);
  const next = async (): Promise<void> => {
    const url = urls.shift();
    if (!url) return;
    await fetch(url).then((response) => response.arrayBuffer()).catch(() => undefined);
    done += 1;
    onProgress(done, done + urls.length);
    return next();
  };
  await Promise.all(Array.from({ length: 6 }, next));
}

export function clipCount(language: LanguageCode): number {
  return Object.keys(manifest?.clips[language] ?? {}).length;
}
