import { VoiceNotice } from "./VoiceNotice";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { LANGUAGES } from "@shared/catalog";
import type {
  LanguageCode,
  PronunciationAttemptMode,
  PronunciationAttemptResult,
  PronunciationLabView
} from "@shared/types";
import { api } from "../api";
import { useLocalRecorder } from "../hooks/useLocalRecorder";
import {
  createRecognition,
  getSpeechCapabilities,
  speakText,
  type BrowserSpeechRecognition, stopSpeaking } from "../lib/browser-speech";

const verdictLabels = {
  clear: "Phrase très bien reconnue",
  close: "Message compris, quelques mots à reprendre",
  retry: "Nouvel essai conseillé"
} as const;

function AudioIcon({ kind }: { kind: "listen" | "record" | "recognize" }) {
  const paths = {
    listen: <><path d="M5 10v4h4l5 4V6l-5 4H5Z"/><path d="M17 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/></>,
    record: <><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="9"/></>,
    recognize: <><path d="M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3Z"/><path d="M6 11.5v.5a6 6 0 0 0 12 0v-.5M12 18v3M9 21h6"/></>
  } as const;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}

export function PronunciationLabView({ language }: { language: LanguageCode }) {
  const [lab, setLab] = useState<PronunciationLabView>();
  const [selectedId, setSelectedId] = useState("");
  const [transcript, setTranscript] = useState("");
  const [transcriptMode, setTranscriptMode] = useState<PronunciationAttemptMode>("manual-transcript");
  const [result, setResult] = useState<PronunciationAttemptResult>();
  const [listening, setListening] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string>();
  const [error, setError] = useState<string>();
  const recognitionRef = useRef<BrowserSpeechRecognition | undefined>(undefined);
  const resultTitleRef = useRef<HTMLHeadingElement>(null);
  const attemptRef = useRef<{ promptId: string; id: string } | undefined>(undefined);
  const capabilities = getSpeechCapabilities();
  const recorder = useLocalRecorder(`${language}-${selectedId}`);

  useEffect(() => {
    setLab(undefined);
    setError(undefined);
    api.pronunciation(language)
      .then((next) => {
        setLab(next);
        setSelectedId(next.recommendedPromptId);
      })
      .catch((reason: Error) => setError(reason.message));
  }, [language]);

  useEffect(() => () => {
    recognitionRef.current?.abort();
    recognitionRef.current = undefined;
  }, [language]);

  const prompt = useMemo(
    () => lab?.prompts.find((item) => item.id === selectedId),
    [lab, selectedId]
  );

  const selectPrompt = (promptId: string) => {
    recognitionRef.current?.abort();
    recognitionRef.current = undefined;
    recorder.stop();
    setListening(false);
    setSelectedId(promptId);
    setTranscript("");
    setTranscriptMode("manual-transcript");
    setResult(undefined);
    setStatus(undefined);
    setError(undefined);
  };

  const startRecognition = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setStatus("Reconnaissance arrêtée. Vous pouvez corriger la transcription avant l’analyse.");
      return;
    }
    if (!prompt) return;
    recorder.stop();
    stopSpeaking();
    const recognition = createRecognition(language);
    if (!recognition) {
      setError("La reconnaissance n’est pas disponible ici. Enregistrez-vous localement ou saisissez une transcription.");
      return;
    }
    recognitionRef.current = recognition;
    setError(undefined);
    setResult(undefined);
    setListening(true);
    setStatus("Parlez maintenant. Rien ne sera envoyé automatiquement à SD Languages.");
    recognition.onresult = (event) => {
      if (recognitionRef.current !== recognition) return;
      const value = Array.from(event.results).map((item) => item[0]?.transcript ?? "").join(" ").trim();
      if (value) {
        setTranscript(value.slice(0, 500));
        setTranscriptMode("browser-transcript");
        setStatus("Phrase transcrite. Relisez-la, puis lancez l’analyse.");
      }
    };
    recognition.onerror = (event) => {
      if (recognitionRef.current !== recognition) return;
      const message = event.error === "not-allowed"
        ? "Microphone non autorisé. Autorisez-le dans le navigateur ou utilisez l’enregistrement local et le mode texte."
        : event.error === "no-speech"
          ? "Aucune parole détectée. Rapprochez-vous du micro et recommencez."
          : "La reconnaissance a été interrompue. Vous pouvez réessayer ou saisir le texte entendu.";
      setError(message);
      setListening(false);
    };
    recognition.onend = () => {
      if (recognitionRef.current !== recognition) return;
      recognitionRef.current = undefined;
      setListening(false);
    };
    try {
      recognition.start();
    } catch {
      recognitionRef.current = undefined;
      setListening(false);
      setError("Le microphone n’a pas pu démarrer. Réessayez ou utilisez le mode texte.");
    }
  };

  const analyze = async (event: FormEvent) => {
    event.preventDefault();
    if (!prompt || !transcript.trim() || submitting) return;
    if (attemptRef.current?.promptId !== prompt.id) {
      attemptRef.current = { promptId: prompt.id, id: crypto.randomUUID() };
    }
    setSubmitting(true);
    setError(undefined);
    try {
      const nextResult = await api.assessPronunciation(
        prompt.id,
        transcript.trim(),
        transcriptMode,
        attemptRef.current.id
      );
      setResult(nextResult);
      const nextLab = await api.pronunciation(language);
      setLab(nextLab);
      window.requestAnimationFrame(() => resultTitleRef.current?.focus());
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!lab || !prompt) {
    return error ? <div className="alert" role="alert">{error}</div> : <div className="loading-card">Préparation du studio de prononciation…</div>;
  }

  return (
    <section className="pronunciation-lab">
      <header className="pronunciation-intro">
        <div>
          <p className="eyebrow">Laboratoire de prononciation</p>
          <h2>Écoutez, comparez, recommencez.</h2>
          <p>Une séance courte pour rendre votre parole plus intelligible, phrase après phrase.</p>
        </div>
        <aside className="privacy-note">
          <strong>Votre voix reste éphémère</strong>
          <span>L'audio n'est jamais enregistré ni envoyé : il disparaît en quittant la page. Seuls le score et le verdict de chaque essai restent dans votre progression, sur cet appareil.</span>
        </aside>
      </header>

      <div className="pronunciation-path" aria-label="Phrases disponibles">
        {lab.prompts.map((item) => (
          <button
            key={item.id}
            className={item.id === selectedId ? "pronunciation-prompt active" : "pronunciation-prompt"}
            onClick={() => selectPrompt(item.id)}
            aria-pressed={item.id === selectedId}
          >
            <span>{item.level}</span>
            <strong>{item.text}</strong>
            <small>{item.progress ? `Meilleur repère ${item.progress.bestScore}/100` : item.recommended ? "Conseillée maintenant" : "Pas encore essayée"}</small>
          </button>
        ))}
      </div>
      <p className="pronunciation-reason"><strong>Pourquoi cette phrase ?</strong> {lab.recommendationReason}</p>

      <div className="pronunciation-studio">
        <article className="pronunciation-script">
          <span className="level-stamp">{prompt.level} · {LANGUAGES[language].nativeName}</span>
          <p className="target-phrase" lang={language}>{prompt.text}</p>
          <p className="phrase-translation">{prompt.translation}</p>
          <dl className="speech-focus">
            <div><dt>Point d’écoute</dt><dd>{prompt.focus}</dd></div>
            <div><dt>Conseil</dt><dd>{prompt.coachingTip}</dd></div>
          </dl>
          <div className="listen-actions">
            <button className="primary-button" onClick={() => speakText(prompt.text, language, .86)} disabled={!capabilities.synthesis}>
              <AudioIcon kind="listen" /> Écouter
            </button>
            <button className="secondary-button" onClick={() => speakText(prompt.text, language, .62)} disabled={!capabilities.synthesis}>
              Plus lentement
            </button>
          </div>
          {!capabilities.synthesis ? <p className="capability-note">La lecture vocale n’est pas disponible dans ce navigateur.</p> : <VoiceNotice language={language} />}
        </article>

        <div className="pronunciation-workbench">
          <section className="voice-route">
            <div className="step-index">1</div>
            <div>
              <h3>Réécoutez-vous, sans envoyer votre voix</h3>
              <p>L’enregistrement dure au maximum 15 secondes et reste en mémoire vive.</p>
            </div>
            <button
              className={recorder.recording ? "record-button active" : "record-button"}
              onClick={() => recorder.recording ? recorder.stop() : void recorder.start()}
              disabled={!recorder.supported}
              aria-pressed={recorder.recording}
            >
              <AudioIcon kind="record" /> {recorder.recording ? "Arrêter" : "M’enregistrer"}
            </button>
            {recorder.audioUrl ? <audio className="local-playback" src={recorder.audioUrl} controls aria-label="Réécouter mon enregistrement" /> : null}
            {!recorder.supported ? <p className="capability-note">Enregistrement indisponible : poursuivez avec le texte ci-dessous.</p> : null}
            {recorder.error ? <p className="inline-error" role="alert">{recorder.error}</p> : null}
          </section>

          <section className="voice-route assisted-route">
            <div className="step-index">2</div>
            <div>
              <h3>Faites reconnaître la phrase</h3>
              <p>Cette option produit une transcription. Selon le navigateur, son service vocal peut nécessiter Internet.</p>
            </div>
            <button
              className={listening ? "recognition-button active" : "recognition-button"}
              onClick={startRecognition}
              disabled={!capabilities.recognition}
              aria-pressed={listening}
            >
              <AudioIcon kind="recognize" /> {listening ? "Arrêter" : "Reconnaître"}
            </button>
            {!capabilities.recognition ? <p className="capability-note">Reconnaissance indisponible : prononcez la phrase, puis saisissez ce que vous avez dit.</p> : null}
          </section>

          <form className="transcript-form" onSubmit={analyze}>
            <label htmlFor="pronunciation-transcript">Ce qui a été reconnu ou prononcé</label>
            <textarea
              id="pronunciation-transcript"
              value={transcript}
              onChange={(event) => {
                setTranscript(event.target.value);
                if (transcriptMode !== "browser-transcript") setTranscriptMode("manual-transcript");
              }}
              maxLength={500}
              placeholder="La transcription apparaîtra ici. Vous pouvez aussi la saisir manuellement."
              aria-describedby="transcript-help"
            />
            <div className="transcript-footer">
              <span id="transcript-help">Le score compare les mots. Il ne mesure ni votre accent ni vos phonèmes.</span>
              <button className="primary-button" disabled={!transcript.trim() || submitting}>
                {submitting ? "Analyse…" : "Comparer les mots"}
              </button>
            </div>
          </form>
          {status ? <p className="voice-status" role="status">{status}</p> : null}
          {error ? <p className="inline-error" role="alert">{error}</p> : null}
        </div>
      </div>

      {result ? (
        <section className={`pronunciation-result ${result.assessment.verdict}`} aria-labelledby="pronunciation-result-title">
          <div className="result-score">
            <span>{result.assessment.score}</span>
            <small>sur 100</small>
          </div>
          <div className="result-copy">
            <p className="eyebrow">Intelligibilité transcrite</p>
            <h3 id="pronunciation-result-title" ref={resultTitleRef} tabIndex={-1}>{verdictLabels[result.assessment.verdict]}</h3>
            <p>{result.assessment.feedback}</p>
            <div className="word-review" aria-label="Comparaison des mots">
              {result.assessment.matchedWords.length ? <span className="matched"><strong>Reconnus</strong> {result.assessment.matchedWords.join(" · ")}</span> : null}
              {result.assessment.missedWords.length ? <span className="missed"><strong>À reprendre</strong> {result.assessment.missedWords.join(" · ")}</span> : null}
              {result.assessment.extraWords.length ? <span><strong>Ajoutés</strong> {result.assessment.extraWords.join(" · ")}</span> : null}
            </div>
          </div>
          <dl className="pronunciation-metrics">
            <div><dt>Mots clés</dt><dd>{result.assessment.metrics.coverage}%</dd></div>
            <div><dt>Ordre</dt><dd>{result.assessment.metrics.order}%</dd></div>
            <div><dt>Précision</dt><dd>{result.assessment.metrics.precision}%</dd></div>
          </dl>
          <p className="result-disclaimer">Ce repère mesure la proximité entre une transcription et le modèle écrit. Une analyse acoustique complète demanderait un moteur spécialisé.</p>
        </section>
      ) : null}
    </section>
  );
}
