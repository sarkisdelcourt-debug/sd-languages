import { useEffect, useState } from "react";
import { LANGUAGES } from "@shared/catalog";
import type { DiagnosticResult, LanguageCode } from "@shared/types";
import { api, type PublicDiagnosticQuestion } from "../api";

export function DiagnosticView({ language, onComplete }: { language: LanguageCode; onComplete: () => void }) {
  const [questions, setQuestions] = useState<PublicDiagnosticQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<DiagnosticResult>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    api.diagnostic(language).then(setQuestions).catch((reason: Error) => setError(reason.message));
  }, [language]);

  const question = questions[index];
  const submit = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const nextResult = await api.submitDiagnostic(language, answers);
      setResult(nextResult);
      onComplete();
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="alert" role="alert">{error}</div>;
  if (result) {
    return (
      <section className="result-card">
        <span className="result-orbit">{result.estimatedLevel}</span>
        <p className="eyebrow">Estimation terminée</p>
        <h2>Niveau {result.estimatedLevel} indicatif</h2>
        <p>Vous avez obtenu {result.percentage}% sur ce diagnostic court en {LANGUAGES[language].name.toLowerCase()}.</p>
        <p className="fine-print">Ce résultat oriente les exercices. Il ne constitue pas une certification CECRL.</p>
        <button className="primary-button" onClick={() => { setResult(undefined); setAnswers({}); setIndex(0); }}>Recommencer</button>
      </section>
    );
  }
  if (!question) return <div className="loading-card">Préparation du diagnostic…</div>;

  const currentAnswer = answers[question.id] ?? "";
  const isLast = index === questions.length - 1;
  return (
    <section className="exercise-layout">
      <div className="exercise-progress">
        <span>Question {index + 1} sur {questions.length}</span>
        <div><i style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
      </div>
      <article className="exercise-card">
        <div className="exercise-meta"><span>{question.level}</span><span>{question.focus}</span></div>
        <h2>{question.prompt}</h2>
        {question.choices ? (
          <div className="choice-list">
            {question.choices.map((choice) => (
              <button key={choice} className={currentAnswer === choice ? "choice selected" : "choice"} aria-pressed={currentAnswer === choice} onClick={() => setAnswers({ ...answers, [question.id]: choice })}>
                <span className="radio" />{choice}
              </button>
            ))}
          </div>
        ) : (
          <label className="answer-field">Votre réponse<input value={currentAnswer} onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })} autoFocus /></label>
        )}
        <div className="exercise-actions">
          <button className="text-button" disabled={index === 0} onClick={() => setIndex((value) => value - 1)}>Précédent</button>
          {isLast ? (
            <button className="primary-button" disabled={loading} onClick={submit}>{loading ? "Calcul…" : "Voir mon niveau"}</button>
          ) : (
            <button className="primary-button" onClick={() => setIndex((value) => value + 1)}>Continuer</button>
          )}
        </div>
      </article>
    </section>
  );
}
