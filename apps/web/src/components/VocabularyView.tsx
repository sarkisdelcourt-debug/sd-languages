import { useEffect, useRef, useState } from "react";
import { LANGUAGES } from "@shared/catalog";
import type { AnswerEvaluation, LanguageCode } from "@shared/types";
import type { VocabDirection, VocabMode } from "@shared/content/vocab-drills";
import { api, type PublicExercise, type VocabularySet } from "../api";
import { getSpeechCapabilities, speakText } from "../lib/browser-speech";
import { ExerciseAnswer } from "./ExerciseAnswer";

const directionLabels = (languageName: string): Array<{ id: VocabDirection; label: string }> => [
  { id: "to-french", label: `${languageName} → français` },
  { id: "to-target", label: `Français → ${languageName.toLowerCase()}` },
  { id: "mixed", label: "Les deux" }
];
const MODES: Array<{ id: VocabMode; label: string; help: string }> = [
  { id: "choice", label: "QCM", help: "Choisir parmi 4 mots" },
  { id: "typing", label: "Saisie", help: "Écrire la traduction" }
];

interface Settings {
  direction: VocabDirection;
  mode: VocabMode;
  setId?: string;
  random?: boolean;
}
interface Miss {
  prompt: string;
  answer: string;
  typed: string;
}

function readSettings(): Settings {
  try {
    const saved = JSON.parse(localStorage.getItem("sd-vocab-settings") ?? "{}") as Partial<Settings>;
    return {
      direction: ["to-french", "to-target", "mixed"].includes(saved.direction as string) ? saved.direction! : "to-french",
      mode: MODES.some((item) => item.id === saved.mode) ? saved.mode! : "choice",
      setId: saved.random ? undefined : saved.setId,
      random: Boolean(saved.random)
    };
  } catch {
    return { direction: "to-french", mode: "choice" };
  }
}

/**
 * Tests de vocabulaire : par liste thématique, dans le sens choisi (langue → français, français →
 * langue, ou les deux), en QCM ou en saisie. Séries de 10 mots, bilan avec les mots ratés.
 */
export function VocabularyView({ language, onProgress }: { language: LanguageCode; onProgress: () => void }) {
  const [sets, setSets] = useState<VocabularySet[]>([]);
  const [settings, setSettings] = useState<Settings>(readSettings);
  const [series, setSeries] = useState<PublicExercise[]>();
  const [seen, setSeen] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<AnswerEvaluation>();
  const [misses, setMisses] = useState<Miss[]>([]);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [ended, setEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const attemptRef = useRef<{ exerciseId: string; id: string } | undefined>(undefined);
  const nextRef = useRef<HTMLButtonElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const refreshSets = () => api.vocabulary(language).then((value) => {
    setSets(value.sets);
    if (settings.setId && !value.sets.some((set) => set.id === settings.setId)) setSettings((current) => ({ ...current, setId: undefined }));
  }).catch((reason: Error) => setError(reason.message));
  useEffect(() => {
    setSeries(undefined);
    setSeen([]);
    void refreshSets();
  }, [language]);

  const update = (patch: Partial<Settings>) => {
    // Mise à jour fonctionnelle : deux choix enchaînés vite (sens puis format) ne s'écrasent pas.
    setSettings((current) => {
      const next = { ...current, ...patch };
      try {
        localStorage.setItem("sd-vocab-settings", JSON.stringify(next));
      } catch {
        // Confort seulement.
      }
      return next;
    });
  };

  // `keepScore` : en mode « mot au hasard », la série suivante se charge sans remettre le score à zéro.
  const start = async (exclude: string[] = [], keepScore = false) => {
    setLoading(true);
    setError(undefined);
    try {
      const drill = await api.vocabularyDrill(language, { direction: settings.direction, mode: settings.mode, setId: settings.random ? undefined : settings.setId, random: settings.random, exclude });
      setSeries(drill);
      setSeen([...exclude, ...drill.map((item) => item.id)]);
      setIndex(0);
      setAnswer("");
      setEvaluation(undefined);
      if (!keepScore) {
        setMisses([]);
        setCorrect(0);
        setAnswered(0);
        setEnded(false);
      }
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
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    feedbackRef.current?.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
    nextRef.current?.focus({ preventScroll: true });
  }, [evaluation]);

  const validate = async () => {
    if (!exercise || !answer.trim() || evaluation || loading) return;
    if (attemptRef.current?.exerciseId !== exercise.id) attemptRef.current = { exerciseId: exercise.id, id: crypto.randomUUID() };
    setLoading(true);
    try {
      const result = await api.submitAnswer(exercise.id, answer, attemptRef.current.id);
      setEvaluation(result.evaluation);
      setAnswered((value) => value + 1);
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
    setError(undefined);
    if (settings.random && index + 1 >= (series?.length ?? 0)) {
      void start(seen, true);
      return;
    }
    setIndex((value) => value + 1);
    setAnswer("");
    setEvaluation(undefined);
  };

  const total = settings.random ? answered : series?.length ?? 0;
  const finished = Boolean(series) && (ended || (!settings.random && index >= (series?.length ?? 0)));
  const languageName = LANGUAGES[language].name.toLowerCase();
  const chosenSet = sets.find((set) => set.id === settings.setId);
  const scopeLabel = settings.random ? "Mot au hasard" : chosenSet ? chosenSet.title : "Toutes les listes";

  // --- Réglages ---------------------------------------------------------------------------
  if (!series) {
    return (
      <section className="vocab-layout">
        <div className="settings-intro">
          <p className="eyebrow">Tests de vocabulaire</p>
          <h2>Révisez vos mots en {languageName}</h2>
          <p>Choisissez le sens, le format et une liste thématique. Les mots ratés reviennent en premier la fois suivante et alimentent vos révisions.</p>
        </div>
        <article className="settings-card vocab-setup">
          <div className="settings-section"><strong>Sens</strong></div>
          <div className="segmented-options" role="group" aria-label="Sens du test">
            {directionLabels(LANGUAGES[language].name).map((item) => (
              <button key={item.id} className={settings.direction === item.id ? "selected" : ""} aria-pressed={settings.direction === item.id} onClick={() => update({ direction: item.id })}>{item.label}</button>
            ))}
          </div>
          <div className="settings-section"><strong>Format</strong></div>
          <div className="segmented-options" role="group" aria-label="Format du test">
            {MODES.map((item) => (
              <button key={item.id} className={settings.mode === item.id ? "selected" : ""} aria-pressed={settings.mode === item.id} onClick={() => update({ mode: item.id })}>{item.label}<small> · {item.help}</small></button>
            ))}
          </div>
          <div className="settings-section"><strong>Liste</strong></div>
          <div className="vocab-sets" role="group" aria-label="Liste de vocabulaire">
            <button className={settings.random ? "vocab-set selected" : "vocab-set"} aria-pressed={Boolean(settings.random)} onClick={() => update({ random: true, setId: undefined })}>
              <strong>Mot au hasard</strong><small>Un mot après l'autre, tiré dans toutes les listes, sans fin</small>
            </button>
            <button className={!settings.setId && !settings.random ? "vocab-set selected" : "vocab-set"} aria-pressed={!settings.setId && !settings.random} onClick={() => update({ setId: undefined, random: false })}>
              <strong>Toutes les listes</strong><small>{sets.reduce((sum, set) => sum + set.count, 0)} mots</small>
            </button>
            {sets.map((set) => (
              <button key={set.id} className={settings.setId === set.id && !settings.random ? "vocab-set selected" : "vocab-set"} aria-pressed={settings.setId === set.id && !settings.random} onClick={() => update({ setId: set.id, random: false })}>
                <strong>{set.title}</strong><small>{set.level} · {set.seen}/{set.count} vus</small>
              </button>
            ))}
          </div>
          {error ? <div className="alert" role="alert">{error}</div> : null}
          <div className="relay-actions">
            <button className="primary-button" disabled={loading || !sets.length} onClick={() => void start()}>{loading ? "Préparation…" : settings.random ? "Tirer des mots au hasard" : "Commencer une série de 10"}</button>
          </div>
        </article>
      </section>
    );
  }

  // --- Bilan -------------------------------------------------------------------------------
  if (finished || !exercise) {
    return (
      <section className="vocab-layout">
        <article className="exercise-card series-summary" aria-live="polite">
          <p className="eyebrow">Série terminée · {scopeLabel}</p>
          <h2>{correct} / {total} mots justes</h2>
          <p>{misses.length === 0 ? "Sans faute : ces mots s'effacent quelques jours pour laisser place à du nouveau." : "Les mots ratés reviendront en premier à la prochaine série et dans vos révisions."}</p>
          {misses.length ? (
            <ul className="vocab-misses">
              {misses.map((miss) => (
                <li key={miss.prompt}><span>{miss.prompt}</span><strong>{miss.answer}</strong><small>Votre réponse : {miss.typed}</small></li>
              ))}
            </ul>
          ) : null}
          <div className="relay-actions">
            <button className="primary-button" disabled={loading} onClick={() => void start(seen)}>{settings.random ? "Continuer au hasard" : "Nouvelle série"}</button>
            <button className="secondary-button" onClick={() => { setSeries(undefined); void refreshSets(); }}>Changer de liste</button>
          </div>
        </article>
      </section>
    );
  }

  // --- Question ----------------------------------------------------------------------------
  return (
    <section className="exercise-layout">
      <div className="session-head">
        <div><p className="eyebrow">{scopeLabel}</p><h2>{exercise.focus}</h2></div>
        <span>{settings.random ? `Mot ${answered + (evaluation ? 0 : 1)} · ${correct} justes` : `${index + 1} / ${total}`}</span>
      </div>
      <article className="exercise-card">
        <div className="exercise-meta"><span>{exercise.level}</span><span>{exercise.type === "multiple-choice" ? "QCM" : "Saisie"}</span></div>
        <h2>{exercise.prompt}</h2>
        <ExerciseAnswer exercise={exercise} language={language} value={answer} onChange={setAnswer} onSubmit={() => void validate()} disabled={Boolean(evaluation)} />
        {!evaluation ? <p className="hint">Indice : {exercise.hint}</p> : null}
        {evaluation ? (
          <div className={`feedback ${evaluation.verdict}`} role="status" ref={feedbackRef}>
            <strong>{evaluation.verdict === "exact" ? "Exact" : evaluation.verdict === "minor" ? "Presque : un détail d'écriture" : "À retenir"}</strong>
            <p>{evaluation.verdict === "incorrect" ? `Réponse : ${evaluation.expectedAnswer}` : evaluation.feedback}</p>
            <div className="teaching-lens"><div><span>Mot</span><strong>{evaluation.explanation}</strong></div></div>
            {getSpeechCapabilities().synthesis ? (
              <button className="text-button listen-model" onClick={() => speakText(exercise.prompt.includes("français") || exercise.prompt.startsWith("Que signifie") ? exercise.prompt.replace(/^.*«\s*|\s*».*$/g, "") : evaluation.expectedAnswer, language, 0.85)}>▶ Écouter le mot</button>
            ) : null}
          </div>
        ) : null}
        {error ? <div className="alert" role="alert">{error}</div> : null}
        <div className="exercise-actions end">
          {settings.random && answered > 0 ? <button className="secondary-button" onClick={() => setEnded(true)}>Terminer</button> : null}
          {evaluation
            ? <button className="primary-button" ref={nextRef} onClick={next}>{settings.random || index + 1 < total ? "Mot suivant" : "Voir le bilan"}</button>
            : <button className="primary-button" disabled={!answer.trim() || loading} onClick={() => void validate()}>{loading ? "Vérification…" : "Vérifier"}</button>}
        </div>
      </article>
    </section>
  );
}
