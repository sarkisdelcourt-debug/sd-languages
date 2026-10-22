import { FormEvent, useEffect, useRef, useState } from "react";
import { LANGUAGES } from "@shared/catalog";
import type { ConversationThread, LanguageCode } from "@shared/types";
import { api, type PublicConversationScenario } from "../api";
import {
  createRecognition,
  getSpeechCapabilities,
  speakText,
  type BrowserSpeechRecognition
} from "../lib/browser-speech";

export function ConversationView({ language }: { language: LanguageCode }) {
  const [thread, setThread] = useState<ConversationThread>({ language, messages: [] });
  const [scenarios, setScenarios] = useState<PublicConversationScenario[]>([]);
  const [showScenarios, setShowScenarios] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();
  const [listening, setListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState<string>();
  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | undefined>(undefined);
  const speechCapabilities = getSpeechCapabilities();
  useEffect(() => {
    Promise.all([api.conversation(language), api.scenarios(language)])
      .then(([nextThread, nextScenarios]) => {
        setThread(nextThread);
        setScenarios(nextScenarios);
        setShowScenarios(!nextThread.activeScenarioId);
      })
      .catch((reason: Error) => setError(reason.message));
  }, [language]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.messages]);
  useEffect(() => () => {
    recognitionRef.current?.abort();
    recognitionRef.current = undefined;
  }, [language]);

  const activeScenario = scenarios.find((scenario) => scenario.id === thread.activeScenarioId);
  const startScenario = async (scenarioId: string) => {
    setSending(true);
    try {
      setThread(await api.startScenario(language, scenarioId));
      setShowScenarios(false);
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setSending(false);
    }
  };

  const send = async (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    setError(undefined);
    try {
      const reply = await api.sendMessage(language, text);
      setThread((current) => ({
        ...current,
        scenarioStepIndex: reply.scenarioAdvanced && current.activeScenarioId ? (current.scenarioStepIndex ?? 0) + 1 : current.scenarioStepIndex,
        scenarioCompleted: reply.scenarioAdvanced && activeScenario
          ? (current.scenarioStepIndex ?? 0) + 1 >= activeScenario.steps.length
          : current.scenarioCompleted,
        messages: [...current.messages, reply.learnerMessage, reply.coachMessage]
      }));
      setText("");
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setSending(false);
    }
  };
  const speak = (message: string) => {
    speakText(message, language);
  };
  const dictate = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setVoiceNote("Dictée arrêtée. Relisez le texte avant de l’envoyer.");
      return;
    }
    window.speechSynthesis?.cancel();
    const recognition = createRecognition(language);
    if (!recognition) {
      setVoiceNote("La dictée n’est pas disponible dans ce navigateur. Vous pouvez continuer au clavier.");
      return;
    }
    recognitionRef.current = recognition;
    setVoiceNote("Parlez maintenant — le texte restera modifiable avant envoi.");
    setListening(true);
    recognition.onresult = (event) => {
      if (recognitionRef.current !== recognition) return;
      const transcript = Array.from(event.results).map((result) => result[0]?.transcript ?? "").join(" ").trim();
      if (transcript) setText((current) => `${current}${current ? " " : ""}${transcript}`.slice(0, 1000));
    };
    recognition.onerror = (event) => {
      if (recognitionRef.current !== recognition) return;
      setVoiceNote(event.error === "not-allowed" ? "Microphone non autorisé. Vous pouvez continuer au clavier." : "Dictée interrompue. Réessayez ou continuez au clavier.");
      setListening(false);
    };
    recognition.onend = () => {
      if (recognitionRef.current !== recognition) return;
      setListening(false);
      recognitionRef.current = undefined;
    };
    try {
      recognition.start();
    } catch {
      recognitionRef.current = undefined;
      setListening(false);
      setVoiceNote("Le microphone n’a pas pu démarrer. Réessayez ou continuez au clavier.");
    }
  };
  return (
    <section className="conversation-panel">
      <div className="conversation-header">
        <div className="coach-avatar">SD</div>
        <div><h2>Coach {LANGUAGES[language].nativeName}</h2><p><span className="status-dot" /> Mode local guidé</p></div>
        <button className="scenario-toggle" onClick={() => setShowScenarios((value) => !value)}>
          {activeScenario ? "Changer de scénario" : "Choisir un scénario"}
        </button>
      </div>
      {showScenarios ? (
        <div className="scenario-picker">
          <div className="scenario-picker-head"><strong>Choisissez une situation</strong><span>{scenarios.length} parcours · 100 % local</span></div>
          <div className="scenario-grid">
            {scenarios.map((scenario) => (
              <button key={scenario.id} onClick={() => void startScenario(scenario.id)} disabled={sending}>
                <span>{scenario.level}</span><strong>{scenario.title}</strong><small>{scenario.description}</small>{scenario.recommendationReason ? <em>Recommandé : {scenario.recommendationReason}</em> : null}
              </button>
            ))}
          </div>
        </div>
      ) : activeScenario ? (
        <div className="active-scenario">
          <span>{activeScenario.level}</span>
          <div><strong>{activeScenario.title}</strong><small>{thread.scenarioCompleted ? "Scénario terminé" : `Étape ${Math.min((thread.scenarioStepIndex ?? 0) + 1, activeScenario.steps.length)} sur ${activeScenario.steps.length}`}</small></div>
          <div className="scenario-progress"><i style={{ width: `${Math.min(100, ((thread.scenarioStepIndex ?? 0) / activeScenario.steps.length) * 100)}%` }} /></div>
        </div>
      ) : null}
      <div className="messages" aria-live="polite">
        {!thread.messages.length ? <div className="conversation-empty"><strong>Choisissez un scénario pour commencer.</strong><span>Chaque situation vous guide pas à pas dans la langue choisie.</span></div> : null}
        {thread.messages.map((message) => (
          <div key={message.id} className={`message-row ${message.role}`}>
            <div className="message">
              {message.source === "ai" ? <span className="ai-badge" title="Réponse générée par Claude Haiku">IA</span> : null}
              <p>{message.text}</p>
              {message.correction ? <aside className="correction"><strong>Suggestion</strong><span>{message.correction}</span><small>{message.explanation}</small></aside> : null}
              {message.role === "coach" && speechCapabilities.synthesis ? <button className="speak-button" onClick={() => speak(message.text)} aria-label="Écouter la réponse">Écouter</button> : null}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      {error ? <div className="alert" role="alert">{error}</div> : null}
      <form className="composer" onSubmit={send}>
        <label htmlFor="message">Votre message</label>
        <textarea id="message" value={text} onChange={(event) => setText(event.target.value)} placeholder={`Écrivez en ${LANGUAGES[language].name.toLowerCase()}…`} maxLength={1000} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
        <button
          type="button"
          className={listening ? "voice-button listening" : "voice-button"}
          onClick={dictate}
          aria-pressed={listening}
          aria-label={listening ? "Arrêter la dictée" : "Dicter le message"}
          disabled={!speechCapabilities.recognition}
          title={speechCapabilities.recognition ? undefined : "Dictée indisponible dans ce navigateur"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3Z"/><path d="M6 11.5v.5a6 6 0 0 0 12 0v-.5M12 18v3M9 21h6"/></svg>
          <span>{listening ? "Arrêter" : "Dicter"}</span>
        </button>
        <button className="primary-button" disabled={sending || !text.trim()}>{sending ? "Envoi…" : "Envoyer"}</button>
      </form>
      {voiceNote ? <p className="voice-note" role="status">{voiceNote}</p> : null}
      <p className="fine-print conversation-note">La conversation est scénarisée localement. La dictée reste modifiable et n’envoie jamais votre message automatiquement.</p>
    </section>
  );
}
