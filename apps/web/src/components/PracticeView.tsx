import { useEffect, useRef, useState } from "react";
import type { AnswerEvaluation, LanguageCode } from "@shared/types";
import { api, type PublicExercise } from "../api";
import { OfflineQueuedError } from "../offline";

export function PracticeView({ language, onProgress }: { language: LanguageCode; onProgress: () => void }) {
  const [exercises, setExercises] = useState<PublicExercise[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<AnswerEvaluation>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [queued, setQueued] = useState(false);
  const attemptRef = useRef<{ exerciseId: string; id: string } | undefined>(undefined);

  useEffect(() => {
    api.exercises(language).then(setExercises).catch((reason: Error) => setError(reason.message));
  }, [language]);

  const exercise = exercises[index];
  const validate = async () => {
    if (!exercise || !answer.trim() || evaluation || queued) return;
    if (attemptRef.current?.exerciseId !== exercise.id) {
      attemptRef.current = { exerciseId: exercise.id, id: crypto.randomUUID() };
    }
    setLoading(true);
    try {
      const result = await api.submitAnswer(exercise.id, answer, attemptRef.current.id);
      setEvaluation(result.evaluation);
      onProgress();
    } catch (reason) {
      if (reason instanceof OfflineQueuedError) setQueued(true);
      setError((reason as Error).message);
    } finally {
      setLoading(false);
    }
  };
  const next = () => {
    setIndex((value) => (value + 1) % exercises.length);
    setAnswer("");
    setEvaluation(undefined);
    setError(undefined);
    setQueued(false);
  };

  if (error && !exercise) return <div className="alert" role="alert">{error}</div>;
  if (!exercise) return <div className="loading-card">Sélection des exercices…</div>;
  return (
    <section className="exercise-layout">
      <div className="session-head">
        <div><p className="eyebrow">Session adaptative</p><h2>{exercise.focus}</h2></div>
        <span>{index + 1} / {exercises.length}</span>
      </div>
      <article className="exercise-card">
        <div className="exercise-meta"><span>{exercise.level}</span><span>{exercise.type === "multiple-choice" ? "Choix multiple" : exercise.type === "fill-gap" ? "Texte à trous" : "Traduction"}</span></div>
        {exercise.recommendationReason ? <p className="recommendation-label">Recommandé : {exercise.recommendationReason}</p> : null}
        <h2>{exercise.prompt}</h2>
        {exercise.choices ? (
          <div className="choice-list">
            {exercise.choices.map((choice) => (
              <button disabled={Boolean(evaluation) || queued} key={choice} className={answer === choice ? "choice selected" : "choice"} onClick={() => setAnswer(choice)}>
                <span className="radio" />{choice}
              </button>
            ))}
          </div>
        ) : (
          <label className="answer-field">Votre réponse<input disabled={Boolean(evaluation) || queued} value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void validate(); }} autoFocus /></label>
        )}
        {!evaluation ? <p className="hint">Indice : {exercise.hint}</p> : null}
        {evaluation ? (
          <div className={`feedback ${evaluation.verdict}`} role="status">
            <strong>{evaluation.verdict === "exact" ? "Exact — forme maîtrisée" : evaluation.verdict === "minor" ? "Bonne idée — peaufinons la forme" : "Une erreur utile à retenir"}</strong>
            <p>{evaluation.feedback}</p>
            <div className="teaching-lens">
              {evaluation.verdict !== "exact" ? <div><span>Réponse modèle</span><strong>{evaluation.expectedAnswer}</strong></div> : null}
              <div><span>Pourquoi ?</span><strong>{evaluation.explanation}</strong></div>
              {evaluation.issues.map((issue) => <div key={`${issue.kind}-${issue.message}`}><span>{issue.kind === "accent" ? "Point d'attention" : "Piste de correction"}</span><strong>{issue.message}</strong></div>)}
            </div>
          </div>
        ) : null}
        {error ? <div className="alert" role="alert">{error}</div> : null}
        <div className="exercise-actions end">
          {evaluation ? <button className="primary-button" onClick={next}>Exercice suivant</button> : <button className="primary-button" disabled={!answer.trim() || loading || queued} onClick={validate}>{queued ? "Réponse en attente" : loading ? "Vérification…" : "Vérifier"}</button>}
        </div>
      </article>
    </section>
  );
}
