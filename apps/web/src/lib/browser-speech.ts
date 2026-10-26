import type { LanguageCode } from "@shared/types";
import { playClip, stopClip } from "./voice-clips";

export const SPEECH_LOCALES: Record<LanguageCode, string> = {
  en: "en-GB",
  de: "de-DE",
  es: "es-ES"
};

export interface RecognitionResultEvent {
  results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>;
}

export interface RecognitionErrorEvent {
  error: string;
}

export interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: RecognitionResultEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new(): BrowserSpeechRecognition;
}

interface SpeechWindow extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

export interface SpeechCapabilities {
  synthesis: boolean;
  recognition: boolean;
  recording: boolean;
}

export function getSpeechCapabilities(): SpeechCapabilities {
  const speechWindow = window as SpeechWindow;
  return {
    synthesis: "speechSynthesis" in window,
    recognition: Boolean(speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition),
    recording: typeof MediaRecorder !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia)
  };
}

/** iPhone : application ouverte depuis l'écran d'accueil (mode « standalone »). */
export function isIosStandalone(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean };
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && nav.standalone === true;
}

/** Message affiché quand la dictée ne répond pas (aucun résultat ni erreur) : cause la plus fréquente sur iPhone. */
export const RECOGNITION_SILENT_HELP =
  "Aucune réponse du micro. Sur iPhone, la dictée intégrée à une application ajoutée à l'écran d'accueil est souvent bloquée par iOS. "
  + "Solutions : touchez le champ de texte et utilisez la touche micro 🎤 du clavier (ajoutez le clavier de la langue : Réglages › Général › Clavier), "
  + "ou ouvrez le site dans Safari. Vérifiez aussi Réglages › Général › Clavier › Activer la dictée.";

export function createRecognition(language: LanguageCode): BrowserSpeechRecognition | undefined {
  const speechWindow = window as SpeechWindow;
  const Constructor = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
  if (!Constructor) return undefined;
  const recognition = new Constructor();
  recognition.lang = SPEECH_LOCALES[language];
  recognition.continuous = false;
  recognition.interimResults = false;
  return recognition;
}

/**
 * Choix de la voix (24/10/2026). Sans voix explicite, l'iPhone lit un texte anglais ou allemand avec la voix
 * française par défaut quand aucune voix de la langue n'est installée : d'où « un Français qui parle anglais ».
 * On choisit donc nous-mêmes la meilleure voix de la langue (améliorée / premium d'abord) et on dit
 * à l'utilisateur quand il n'y en a aucune.
 */
const NOVELTY_VOICES = /^(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|ralph|kathy|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley)/i;
const QUALITY_VOICES = /premium|enhanced|améliorée|amélioré|erweitert|mejorada|siri|natural|neural|online/i;
const PREFERRED_LOCALES: Record<LanguageCode, string[]> = {
  en: ["en-GB", "en-US", "en-AU", "en-IE", "en-ZA", "en-IN"],
  de: ["de-DE", "de-AT", "de-CH"],
  es: ["es-ES", "es-MX", "es-US", "es-AR", "es-CO"]
};

export interface VoiceReport {
  found: boolean;
  name?: string;
  locale?: string;
  enhanced: boolean;
}

function availableVoices(): SpeechSynthesisVoice[] {
  return "speechSynthesis" in window ? window.speechSynthesis.getVoices() : [];
}

export function pickVoice(language: LanguageCode): SpeechSynthesisVoice | undefined {
  const locales = PREFERRED_LOCALES[language];
  const candidates = availableVoices().filter((voice) => voice.lang.replace("_", "-").toLowerCase().startsWith(language) && !NOVELTY_VOICES.test(voice.name));
  const score = (voice: SpeechSynthesisVoice) => {
    const locale = voice.lang.replace("_", "-");
    const rank = locales.findIndex((candidate) => candidate.toLowerCase() === locale.toLowerCase());
    return (QUALITY_VOICES.test(voice.name) ? 100 : 0) + (rank >= 0 ? 40 - rank * 4 : 0) + (voice.localService ? 5 : 0) + (voice.default ? 1 : 0);
  };
  return [...candidates].sort((left, right) => score(right) - score(left))[0];
}

export function voiceReport(language: LanguageCode): VoiceReport {
  const voice = pickVoice(language);
  return voice ? { found: true, name: voice.name, locale: voice.lang, enhanced: QUALITY_VOICES.test(voice.name) } : { found: false, enhanced: false };
}

/** Appelle `listener` quand la liste des voix change (elle se charge après le premier affichage). */
export function onVoicesChanged(listener: () => void): () => void {
  if (!("speechSynthesis" in window)) return () => undefined;
  window.speechSynthesis.addEventListener("voiceschanged", listener);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", listener);
}

/** Arrête toute lecture en cours (enregistrement intégré ou voix de l'appareil). */
export function stopSpeaking(): void {
  stopClip();
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

export function speakText(text: string, language: LanguageCode, rate = 0.86): boolean {
  // 1) l'enregistrement intégré (voix Piper) quand il existe ; 2) sinon la voix de l'appareil.
  if (playClip(text, language, rate < 0.75, () => speakWithDevice(text, language, rate))) {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    return true;
  }
  return speakWithDevice(text, language, rate);
}

function speakWithDevice(text: string, language: LanguageCode, rate: number): boolean {
  if (!("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(language);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = SPEECH_LOCALES[language];
  }
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function chooseRecordingMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  return ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"].find((type) => MediaRecorder.isTypeSupported(type));
}
