import { useCallback, useEffect, useRef, useState } from "react";
import type { AnswerEvaluation, ExerciseTopic, LanguageCode } from "@shared/types";
import { api, type PracticeTopic, type PublicExercise } from "../api";
import { getSpeechCapabilities, speakText } from "../lib/browser-speech";
import { ExerciseAnswer, exerciseTypeLabels } from "./ExerciseAnswer";
import type { PracticeTarget } from "./SkillsView";

interface SeriesResult {
  exerciseId: string;
  correct: boolean;
}

/**
 * Exercices ciblés : une série de 6, puis un bilan et une nouvelle série qui exclut ce qui vient
 * d'être vu (plus de boucle sur les mêmes exercices). Le thème est facultatif. Depuis « Mes acquis »,
 * la série vise un thème s'il existe, sinon une compétence (`skillTags`).
 */
export function PracticeView({ language, onProgress, target }: { language: LanguageCode; onProgress: () => void; target?: PracticeTarget }) {
  const [topics, setTopics] = useState<PracticeTopic[]>([]);
  const [topic, setTopic] = useState<ExerciseTopic | undefined>(target?.topic);
  const [skill, setSkill] = useState<PracticeTarget | undefined>(target?.skill ? target : undefined);
  const [exercises, setExercises] = useState<PublicExercise[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<AnswerEvaluation>();
  const [results, setResults] = useState<SeriesResult[]>([]);
  const [seen, setSeen] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const nextRef = useRef<HTMLButtonElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const attemptRef = useRef<{ exerciseId: string; id: string } | undefined>(undefined);

  const loadSeries = useCallback((nextTopic: ExerciseTopic | undefined, exclude: string[], nextSkill?: string) => {
    setExercises([]);
    setIndex(0);
    setAnswer("");
    setEvaluation(undefined);
    setResults([]);
    setError(undefined);
    api.exercises(language, { topic: nextTopic, skill: nextSkill, exclude }).then(setExercises).catch((reason: Error) => setError(reason.message));
    // Les compteurs « vus / total » de chaque thème suivent les séries terminées.
    api.practiceTopics(language).then(setTopics).catch(() => setTopics([]));
  }, [language]);

  useEffect(() => {
    setTopic(target?.topic);
    setSkill(target?.skill ? target : undefined);
    setSeen([]);
    loadSeries(target?.topic, [], target?.skill);
  }, [language, loadSeries, target]);

  const chooseTopic = (next: ExerciseTopic | undefined) => {
    setTopic(next);
    setSkill(undefined);
    setSeen([]);
    loadSeries(next, []);
  };

  const exercise = exercises[index];
  // Résultat affiché : on ferme le clavier, on amène la correction à l'écran et on donne le focus à
  // « Exercice suivant » pour pouvoir enchaîner avec la touche Entrée.
  useEffect(() => {
    if (!evaluation) return;
    (document.activeElement as HTMLElement | null)?.blur?.();
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    feedbackRef.current?.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
    nextRef.current?.focus({ preventScroll: true });
  }, [evaluation]);
  const finished = exercises.length > 0 && index >= exercises.length;

  const validate = async () => {
    if (!exercise || !answer.trim() || evaluation) return;
    if (attemptRef.current?.exerciseId !== exercise.id) {
      attemptRef.current = { exerciseId: exercise.id, id: crypto.randomUUID() };
    }
    setLoading(true);
    try {
      const result = await api.submitAnswer(exercise.id, answer, attemptRef.current.id);
      setEvaluation(result.evaluation);
      setResults((current) => [...current, { exerciseId: exercise.id, correct: result.evaluation.correct }]);
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
  const newSeries = () => {
    const nextSeen = [...seen, ...exercises.map((item) => item.id)];
    setSeen(nextSeen);
    loadSeries(topic, nextSeen, skill?.skill);
  };

  const topicBar = topics.length ? (
    <div className="topic-bar" role="group" aria-label="Choisir un thème">
      <button className={topic || skill ? "topic-chip" : "topic-chip active"} aria-pressed={!topic && !skill} onClick={() => chooseTopic(undefined)}>Recommandé</button>
      {skill ? <button className="topic-chip active" aria-pressed="true" onClick={() => loadSeries(undefined, [], skill.skill)}>Compétence : {skill.label}</button> : null}
      {topics.map((entry) => (
        <button key={entry.topic} className={topic === entry.topic ? "topic-chip active" : "topic-chip"} aria-pressed={topic === entry.topic} onClick={() => chooseTopic(entry.topic)}>
          {entry.label}<small>{entry.seen}/{entry.count}</small>
        </button>
      ))}
    </div>
  ) : null;

  if (error && !exercise && !finished) return <section className="exercise-layout">{topicBar}<div className="alert" role="alert">{error}</div></section>;
  if (!exercises.length) return <section className="exercise-layout">{topicBar}<div className="loading-card">Sélection des exercices…</div></section>;

  if (finished || !exercise) {
    const correct = results.filter((result) => result.correct).length;
    return (
      <section className="exercise-layout">
        {topicBar}
        <article className="exercise-card series-summary" aria-live="polite">
          <p className="eyebrow">Série terminée</p>
          <h2>{correct} / {results.length} réponses justes</h2>
          <p>{correct === results.length
            ? "Série sans faute : ces exercices s'effacent quelques jours pour laisser place à du nouveau."
            : "Les erreurs sont gardées dans votre mémoire des erreurs et reviendront en révision."}</p>
          <div className="exercise-actions end">
            <button className="primary-button" onClick={newSeries}>Nouvelle série</button>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="exercise-layout">
      {topicBar}
      <div className="session-head">
        <div><p className="eyebrow">{skill ? `Compétence · ${skill.label}` : topic ? topics.find((entry) => entry.topic === topic)?.label : "Série recommandée"}</p><h2>{exercise.focus}</h2></div>
        <span>{index + 1} / {exercises.length}</span>
      </div>
      <article className="exercise-card">
        <div className="exercise-meta"><span>{exercise.level}</span><span>{exerciseTypeLabels[exercise.type]}</span></div>
        {exercise.recommendationReason ? <p className="recommendation-label">Recommandé : {exercise.recommendationReason}</p> : null}
        <h2>{exercise.prompt}</h2>
        <ExerciseAnswer exercise={exercise} language={language} value={answer} onChange={setAnswer} onSubmit={() => void validate()} disabled={Boolean(evaluation)} />
        {!evaluation ? <p className="hint">Indice : {exercise.hint}</p> : null}
        {evaluation ? (
          <div className={`feedback ${evaluation.verdict}`} role="status" ref={feedbackRef}>
            <strong>{evaluation.verdict === "exact" ? "Exact — forme maîtrisée" : evaluation.verdict === "minor" ? "Bonne idée — peaufinons la forme" : "Une erreur utile à retenir"}</strong>
            <p>{evaluation.feedback}</p>
            <div className="teaching-lens">
              {evaluation.verdict !== "exact" ? <div><span>Réponse modèle</span><strong>{evaluation.expectedAnswer}</strong></div> : null}
              <div><span>Pourquoi ?</span><strong>{evaluation.explanation}</strong></div>
              {evaluation.issues.map((issue) => <div key={`${issue.kind}-${issue.message}`}><span>{issue.kind === "accent" ? "Point d'attention" : "Piste de correction"}</span><strong>{issue.message}</strong></div>)}
            </div>
            {exercise.type !== "match-pairs" && getSpeechCapabilities().synthesis ? (
              <button className="text-button listen-model" onClick={() => speakText(evaluation.expectedAnswer, language, 0.85)}>▶ Écouter la phrase</button>
            ) : null}
          </div>
        ) : null}
        {error ? <div className="alert" role="alert">{error}</div> : null}
        <div className="exercise-actions end">
          {evaluation
            ? <button className="primary-button" ref={nextRef} onClick={next}>{index + 1 < exercises.length ? "Exercice suivant" : "Voir le bilan"}</button>
            : <button className="primary-button" disabled={!answer.trim() || loading} onClick={validate}>{loading ? "Vérification…" : "Vérifier"}</button>}
        </div>
      </article>
    </section>
  );
}
