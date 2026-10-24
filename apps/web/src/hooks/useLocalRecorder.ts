import { useCallback, useEffect, useRef, useState } from "react";
import { chooseRecordingMimeType, stopSpeaking } from "../lib/browser-speech";

export function useLocalRecorder(resetKey: string) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [error, setError] = useState<string>();
  const recorderRef = useRef<MediaRecorder | undefined>(undefined);
  const streamRef = useRef<MediaStream | undefined>(undefined);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | undefined>(undefined);

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = undefined;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = undefined;
  }, []);

  const clearAudio = useCallback(() => {
    setAudioUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return undefined;
    });
  }, []);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder?.state === "recording") recorder.stop();
    else releaseStream();
  }, [releaseStream]);

  const start = useCallback(async () => {
    if (recording || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") return;
    setError(undefined);
    clearAudio();
    stopSpeaking();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = chooseRecordingMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = recorder;
      streamRef.current = stream;
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (blob.size) setAudioUrl(URL.createObjectURL(blob));
        setRecording(false);
        recorderRef.current = undefined;
        chunksRef.current = [];
        releaseStream();
      };
      recorder.onerror = () => {
        setError("L’enregistrement a été interrompu. Vous pouvez réessayer ou utiliser le mode texte.");
        setRecording(false);
        recorderRef.current = undefined;
        releaseStream();
      };
      recorder.start();
      setRecording(true);
      timerRef.current = window.setTimeout(() => stop(), 15_000);
    } catch (reason) {
      const name = (reason as DOMException).name;
      setError(name === "NotAllowedError"
        ? "Microphone non autorisé. Autorisez-le dans le navigateur ou utilisez le mode texte."
        : "Le microphone n’est pas accessible. Vous pouvez continuer avec le mode texte.");
      setRecording(false);
      releaseStream();
    }
  }, [clearAudio, recording, releaseStream, stop]);

  useEffect(() => () => {
    const recorder = recorderRef.current;
    if (recorder?.state === "recording") recorder.stop();
    releaseStream();
    clearAudio();
  }, [clearAudio, releaseStream, resetKey]);

  return {
    supported: typeof MediaRecorder !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia),
    recording,
    audioUrl,
    error,
    start,
    stop,
    clearAudio,
    clearError: () => setError(undefined)
  };
}
