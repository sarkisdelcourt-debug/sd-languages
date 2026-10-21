import type { LanguageCode } from "@shared/types";

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

export function speakText(text: string, language: LanguageCode, rate = 0.86): boolean {
  if (!("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LOCALES[language];
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function chooseRecordingMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  return ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"].find((type) => MediaRecorder.isTypeSupported(type));
}
