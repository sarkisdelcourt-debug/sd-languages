import { useEffect, useRef, useState } from "react";
import { LANGUAGES } from "@shared/catalog";
import type { AnswerEvaluation, LanguageCode } from "@shared/types";
import { api, type PhraseSituationSummary, type PublicExercise } from "../api";
import { getSpeechCapabilities, speakText } from "../lib/browser-speech";
import { ExerciseAnswer } from "./ExerciseAnswer";

type Direction = "to-target" | "to-french" | "mixed";
interface Settings {
  direction: Direction;
  setId?: string;
}
interface Miss {
  prompt: string;
  answer: string;
  typed: string;
}

const readSettings = (): Settings => {
  try {
    const saved = JSON.parse(localStorage.getItem("sd-phrase-settings") ?? "{}") as Partial<Settings>;
    return { direction: ["to-target", "to-french", "mixed"].includes(saved.direction as string) ? saved.direction! : "to-target", setId: saved.setId };
  } catch {
    return { direction: "to-target" };
  }
};

/**
 * Phrases du quotidien : des phrases simples et utiles, plusieurs formulations acceptées. L'important est de se faire
 * comprendre : une réponse qui porte le message est comptée juste, et la formulation la plus naturelle est montrée ensuite.
 */
export function PhrasesView({ language, onProgress }: { language: LanguageCode; onProgress: () => void }) {
  const languageName = LANGUAGES[language].name;
  const [situations, setSituations] = useState<PhraseSituationSummary[]>([]);
  const [settings, setSettings] = useState<Settings>(readSettings);
  const [series, setSeries] = useState<PublicExercise[]>();
  const [seen, setSeen] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<AnswerEvaluation>();
  const [explanation, setExplanation] = useState("");
  const [misses, setMisses] = useState<Miss[]>([]);
  const [correct, setCorrect] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const attemptRef = useRef<{ exerciseId: string; id: string } | undefined>(undefined);
  const nextRef = useRef<HTMLButtonElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSeries(undefined);
    setSeen([]);
    api.phrases(language).then((value) => setSituations(value.situations)).catch((reason: Error) => setError(reason.message));
  }, [language]);

  const update = (patch: Partial<Settings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      try {
        localStorage.setItem("sd-phrase-settings", JSON.stringify(next));
      } catch {
        // Confort seulement.
      }
      return next;
    });
  };

  const start = async (exclude: string[] = [], override: Partial<Settings> = {}, forLevel = false, random = false) => {
    const chosen = { ...settings, ...override };
    setLoading(true);
    setError(undefined);
    try {
      const drill = await api.phraseDrill(language, { direction: chosen.direction, setId: chosen.setId, exclude, forLevel, random });
      setSeries(drill);
      setSeen([...exclude, ...drill.map((item) => item.id)]);
      setIndex(0);
      setAnswer("");
      setEvaluation(undefined);
      setMisses([]);
      setCorrect(0);
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const exercise = series?.[index];
  useEffect(() => {
    if (!evaluation) return;
    (document.activeElement as HTMLElement | null)?.blur?.();
    feedbackRef.current?.scrollIntoView({ block: "nearest", behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    nextRef.current?.focus({ preventScroll: true });
  }, [evaluation]);

  const validate = async () => {
    if (!exercise || !answer.trim() || evaluation || loading) return;
    if (attemptRef.current?.exerciseId !== exercise.id) attemptRef.current = { exerciseId: exercise.id, id: crypto.randomUUID() };
    setLoading(true);
    try {
      const result = await api.submitAnswer(exercise.id, answer, attemptRef.current.id);
      setEvaluation(result.evaluation);
      setExplanation(result.evaluation.explanation);
      if (result.evaluation.correct) setCorrect((value) => value + 1);
      else setMisses((current) => [...current, { prompt: exercise.prompt, answer: result.evaluation.expectedAnswer, typed: answer }]);
      onProgress();
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setLoading(false);
    }
  };
  const next = () => {
    setIndex((value) => value + 1);
    setAnswer("");
    setEvaluation(undefined);
    setError(undefined);
  };

  const directions: Array<{ id: Direction; label: string }> = [
    { id: "to-target", label: `Français → ${languageName.toLowerCase()}` },
    { id: "to-french", label: `${languageName} → français` },
    { id: "mixed", label: "Les deux" }
  ];
  const total = series?.length ?? 0;
  const finished = Boolean(series) && index >= total;
  const chosen = situations.find((situation) => situation.id === settings.setId);

  if (!series) {
    return (
      <section className="vocab-layout">
        <div className="settings-intro">
          <p className="eyebrow">Phrases du quotidien</p>
          <h2>Se faire comprendre en {languageName.toLowerCase()}</h2>
          <p>Des phrases simples et utiles. Plusieurs formulations sont acceptées, et une phrase qui fait passer le message compte juste : on vous montre ensuite la formulation la plus naturelle.</p>
        </div>
        <article className="settings-card vocab-setup">
          <div className="settings-section"><strong>Sens</strong></div>
          <div className="segmented-options" role="group" aria-label="Sens">
            {directions.map((item) => (
              <button key={item.id} className={settings.direction === item.id ? "selected" : ""} aria-pressed={settings.direction === item.id} onClick={() => update({ direction: item.id })}>{item.label}</button>
            ))}
          </div>
          <div className="relay-actions">
            <button className="primary-button" disabled={loading || !situations.length} onClick={() => void start([], { setId: undefined }, true)}>10 phrases utiles maintenant (adaptées à mon niveau)</button>
            <button className="secondary-button" disabled={loading || !situations.length} onClick={() => void start([], { setId: undefined }, false, true)}>Phrases au hasard</button>
          </div>
          <div className="settings-section"><strong>Ou choisir une situation</strong></div>
          <div className="vocab-sets" role="group" aria-label="Situation">
            {situations.map((situation) => (
              <button key={situation.id} className={settings.setId === situation.id ? "vocab-set selected" : "vocab-set"} aria-pressed={settings.setId === situation.id}
                onClick={() => { update({ setId: situation.id }); void start([], { setId: situation.id }); }}>
                <strong>{situation.title}</strong><small>{situation.level} · {situation.seen}/{situation.count} vues</small>
              </button>
            ))}
          </div>
          {error ? <div className="alert" role="alert">{error}</div> : null}
        </article>
      </section>
    );
  }

  if (finished || !exercise) {
    return (
      <section className="vocab-layout">
        <article className="exercise-card series-summary" aria-live="polite">
          <p className="eyebrow">Série terminée{chosen ? ` · ${chosen.title}` : ""}</p>
          <h2>{correct} / {total} phrases qui passent</h2>
          <p>{misses.length === 0 ? "Sans faute : vous vous feriez comprendre." : "Les phrases ratées reviennent en premier à la prochaine série et dans vos révisions."}</p>
          {misses.length ? (
            <ul className="vocab-misses">
              {misses.map((miss) => <li key={miss.prompt}><span>{miss.prompt}</span><strong>{miss.answer}</strong><small>Votre réponse : {miss.typed}</small></li>)}
            </ul>
          ) : null}
          <div className="relay-actions">
            <button className="primary-button" disabled={loading} onClick={() => void start(seen)}>Nouvelle série</button>
            <button className="secondary-button" onClick={() => setSeries(undefined)}>Changer de situation</button>
          </div>
        </article>
      </section>
    );
  }

  const audioTarget = exercise.audioText ?? (evaluation && exercise.prompt.startsWith("Dites") ? evaluation.expectedAnswer : undefined);
  return (
    <section className="exercise-layout">
      <div className="session-head">
        <div><p className="eyebrow">{chosen?.title ?? "Phrases du quotidien"}</p><h2>{exercise.focus}</h2></div>
        <span>{index + 1} / {total}</span>
      </div>
      <article className="exercise-card">
        <div className="exercise-meta"><span>{exercise.level}</span><span>Phrase</span></div>
        <h2>{exercise.prompt}</h2>
        <ExerciseAnswer exercise={exercise} language={language} value={answer} onChange={setAnswer} onSubmit={() => void validate()} disabled={Boolean(evaluation)} />
        {!evaluation ? <p className="hint">{exercise.hint}</p> : null}
        {evaluation ? (
          <div className={`feedback ${evaluation.verdict}`} role="status" ref={feedbackRef}>
            <strong>{evaluation.verdict === "exact" ? "Exact" : evaluation.verdict === "minor" ? "Ça passe !" : "À retenir"}</strong>
            <p>{evaluation.verdict === "incorrect" ? `Une bonne formulation : ${evaluation.expectedAnswer}` : evaluation.feedback}</p>
            <div className="teaching-lens"><div><span>Pour retenir</span><strong>{explanation}</strong></div></div>
            {audioTarget && getSpeechCapabilities().synthesis ? (
              <button className="text-button listen-model" onClick={() => speakText(audioTarget, language, 0.85)}>▶ Écouter la phrase</button>
            ) : null}
          </div>
        ) : null}
        {error ? <div className="alert" role="alert">{error}</div> : null}
        <div className="exercise-actions end">
          {evaluation
            ? <button className="primary-button" ref={nextRef} onClick={next}>{index + 1 < total ? "Phrase suivante" : "Voir le bilan"}</button>
            : <button className="primary-button" disabled={!answer.trim() || loading} onClick={() => void validate()}>{loading ? "Vérification…" : "Vérifier"}</button>}
        </div>
      </article>
    </section>
  );
}
