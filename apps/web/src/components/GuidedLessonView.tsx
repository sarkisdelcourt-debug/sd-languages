import { useEffect, useMemo, useRef, useState } from "react";
import type { AnswerEvaluation, CefrLevel, GuidedLessonCatalogItem, GuidedLessonView as LessonView, LanguageCode } from "@shared/types";
import { api } from "../api";
import { getSpeechCapabilities, speakText } from "../lib/browser-speech";
import { ContentNotice } from "./ContentNotice";
import { ExerciseAnswer } from "./ExerciseAnswer";

const phaseIndex = { intro: 0, practice: 1, correction: 2, conversation: 3, summary: 4 } as const;
const phaseLabels = ["Comprendre", "Pratiquer", "Corriger", "Dialoguer", "Retenir"];

const statusLabels: Record<GuidedLessonCatalogItem["status"], string> = {
  locked: "Verrouillée",
  available: "Disponible",
  active: "En cours",
  completed: "Maîtrisée"
};

const levelChapters = {
  A1: { label: "Premiers réflexes", description: "Comprendre et agir dans une situation courte." },
  A2: { label: "Autonomie quotidienne", description: "Relier vos idées et préciser vos besoins." },
  B1: { label: "Conversation structurée", description: "Expliquer, raconter et faire avancer un échange." },
  B2: { label: "Nuance et négociation", description: "Argumenter et gérer une situation complexe." }
} as const;
const levelRank: Record<CefrLevel, number> = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };

/**
 * Chapitres repliés/dépliés (22/10/2026) : préférence de confort mémorisée par langue dans
 * localStorage ; en son absence, un chapitre « Acquis » (niveau déclaré) est replié, les autres ouverts.
 */
function readOpenChapters(language: LanguageCode): Record<string, boolean> {
  try {
    const saved = localStorage.getItem(`sd-path-open-${language}`);
    const parsed: unknown = saved ? JSON.parse(saved) : {};
    return parsed && typeof parsed === "object" ? (parsed as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function writeOpenChapters(language: LanguageCode, value: Record<string, boolean>) {
  try {
    localStorage.setItem(`sd-path-open-${language}`, JSON.stringify(value));
  } catch {
    // Préférence de confort seulement.
  }
}

function LearningPath({
  view,
  disabled,
  onSelect
}: {
  view: LessonView;
  disabled: boolean;
  onSelect: (lessonId: string) => void;
}) {
  const { catalog, lesson } = view;
  const chapters = Object.entries(levelChapters).map(([level, copy]) => {
    const items = catalog.items.filter((item) => item.lesson.level === level);
    // Niveau déclaré (ex. B1) : les chapitres inférieurs entièrement « Acquis » se replient par défaut.
    const acquired = Boolean(catalog.declaredLevel)
      && levelRank[level as keyof typeof levelRank] < levelRank[catalog.declaredLevel!]
      && items.length > 0
      && items.every((item) => item.status === "completed");
    return { level, ...copy, items, acquired };
  });
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>(() => readOpenChapters(catalog.language));
  const isOpen = (chapter: (typeof chapters)[number]) => openChapters[chapter.level] ?? !chapter.acquired;
  const toggle = (level: string, open: boolean) => {
    setOpenChapters((current) => {
      const next = { ...current, [level]: open };
      writeOpenChapters(catalog.language, next);
      return next;
    });
  };
  return (
    <section className="learning-path" aria-labelledby="learning-path-title">
      <header className="path-heading">
        <div>
          <p className="lesson-kicker">Parcours adaptatif</p>
          <h2 id="learning-path-title">Du niveau actuel à votre objectif</h2>
        </div>
        <div className="path-count" aria-label={`${catalog.completedCount} leçons maîtrisées sur ${catalog.totalLessons}`}>
          <strong>{catalog.completedCount}/{catalog.totalLessons}</strong>
          <span>maîtrisées</span>
        </div>
      </header>
      <div className="path-scale" aria-label="Progression en quatre chapitres">
        {chapters.map((chapter) => {
          const mastered = chapter.items.filter((item) => item.status === "completed").length;
          const current = chapter.items.some((item) => item.lesson.id === lesson.id);
          const open = isOpen(chapter);
          return (
            <details
              className={`path-chapter${current ? " current" : ""}${chapter.acquired ? " acquired" : ""}`}
              key={chapter.level}
              aria-labelledby={`chapter-${chapter.level}`}
              open={open}
              onToggle={(event) => toggle(chapter.level, event.currentTarget.open)}
            >
              <summary>
                <span>{chapter.level}</span>
                <div>
                  <strong id={`chapter-${chapter.level}`}>{chapter.label}</strong>
                  <small>{chapter.acquired ? `Acquis · niveau ${catalog.declaredLevel} déclaré · ${open ? "replier" : "déplier"}` : chapter.description}</small>
                </div>
                <b aria-label={`${mastered} sur ${chapter.items.length} maîtrisées`}>{mastered}/{chapter.items.length}</b>
              </summary>
              <div className="path-lessons">
                {chapter.items.map((item) => {
                  const locked = item.status === "locked";
                  const selected = item.lesson.id === lesson.id;
                  return (
                    <button
                      type="button"
                      className={`path-step ${item.status}${item.recommended ? " recommended" : ""}${selected ? " selected" : ""}`}
                      key={item.lesson.id}
                      onClick={() => onSelect(item.lesson.id)}
                      disabled={locked || (disabled && !selected)}
                      aria-pressed={selected}
                      aria-label={`Étape ${item.lesson.sequence}, ${item.lesson.level}, ${item.lesson.title}. ${item.statusDetail}`}
                    >
                      <span className="path-node" aria-hidden="true">{item.status === "completed" ? "✓" : item.lesson.sequence}</span>
                      <span className="path-copy">
                        <strong>{item.lesson.title}</strong>
                        <small>{item.recommended ? "Recommandée" : statusLabels[item.status]} · {item.statusDetail}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
      <p className="path-reason"><strong>Pourquoi cette étape ?</strong> {catalog.recommendationReason}</p>
    </section>
  );
}

export function GuidedLessonView({
  language,
  onProgress,
  onHome
}: {
  language: LanguageCode;
  onProgress: () => void;
  onHome: () => void;
}) {
  const [view, setView] = useState<LessonView>();
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const busyRef = useRef(false);
  const [pending, setPending] = useState<string>();
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const messageCount = view?.session?.conversation.messages.length ?? 0;
  useEffect(() => {
    const list = messagesRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messageCount, pending]);
  const attemptRef = useRef<{ key: string; id: string } | undefined>(undefined);

  useEffect(() => {
    setView(undefined);
    setAnswer("");
    setMessage("");
    setError(undefined);
    api.lesson(language).then(setView).catch((reason: Error) => setError(reason.message));
  }, [language]);

  useEffect(() => {
    if (!view?.session) return;
    document.querySelector<HTMLElement>("#lesson-step-title")?.focus();
  }, [view?.session?.phase, view?.session?.currentExerciseIndex]);

  useEffect(() => {
  }, [view?.session?.id, view?.session?.currentExerciseIndex, view?.session?.attempts.length]);

  const currentAttempts = useMemo(() => {
    const exerciseId = view?.currentExercise?.id;
    return exerciseId ? view?.session?.attempts.filter((attempt) => attempt.exerciseId === exerciseId) ?? [] : [];
  }, [view]);
  const evaluation: AnswerEvaluation | undefined = view?.session?.phase === "correction"
    ? view.session.attempts.at(-1)?.evaluation
    : undefined;

  const run = async (action: () => Promise<LessonView>) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setLoading(true);
    setError(undefined);
    try {
      setView(await action());
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  };

  const start = (lessonId = view?.lesson.id) => {
    if (!lessonId) return Promise.resolve();
    return run(() => api.startLesson(language, lessonId));
  };
  const selectLesson = (lessonId: string) => run(() => api.lesson(language, lessonId));
  const continueLesson = () => run(async () => {
    const next = await api.continueLesson(language);
    setAnswer("");
    return next;
  });
  const submitAnswer = async () => {
    if (!answer.trim() || loading || !view?.session || !view.currentExercise) return;
    const attemptKey = `${view.session.id}:${view.currentExercise.id}:${currentAttempts.length}`;
    if (attemptRef.current?.key !== attemptKey) {
      attemptRef.current = { key: attemptKey, id: crypto.randomUUID() };
    }
    await run(async () => {
      const result = await api.answerLesson(
        language,
        answer,
        attemptRef.current!.id,
        view.session!.id,
        view.currentExercise!.id
      );
      onProgress();
      return result.view;
    });
  };
  const abandonLesson = () => {
    if (!window.confirm("Abandonner cette leçon ? Elle redeviendra disponible ; vos erreurs mémorisées et vos révisions sont conservées.")) return;
    return run(async () => {
      const next = await api.abandonLesson(language);
      setAnswer("");
      setMessage("");
      return next;
    });
  };
  const sendMessage = async () => {
    if (!message.trim() || busyRef.current) return;
    const text = message;
    // Le message s'affiche tout de suite (et le champ se vide) : l'attente de la réponse, surtout
    // celle de l'IA, ne donne jamais l'impression que rien ne s'est passé.
    setPending(text);
    setMessage("");
    let delivered = false;
    await run(async () => {
      const next = (await api.messageLesson(language, text)).view;
      delivered = true;
      return next;
    });
    setPending(undefined);
    if (!delivered) setMessage(text);
    // Le champ garde le focus : le clavier de l'iPhone reste ouvert pour la réplique suivante.
    window.setTimeout(() => composerRef.current?.focus({ preventScroll: true }), 0);
  };

  if (error && !view) return <div className="alert" role="alert">{error}<button onClick={() => location.reload()}>Réessayer</button></div>;
  if (!view) return <div className="loading-card">Préparation de la leçon…</div>;

  const { lesson, session, currentExercise } = view;
  if (!session) {
    return (
      <div className="guided-lesson catalog-mode">
        <ContentNotice language={language} />
        <LearningPath view={view} disabled={loading} onSelect={selectLesson} />
        <section className="lesson-welcome" aria-labelledby="lesson-preview-title">
          <div className="lesson-welcome-copy">
            <p className="lesson-kicker">Séance sélectionnée · {lesson.estimatedMinutes} minutes</p>
            <h2 id="lesson-preview-title">{lesson.title}</h2>
            <p>{lesson.objective}</p>
            <dl className="lesson-preview-facts">
              <div><dt>Niveau</dt><dd>{lesson.level}</dd></div>
              <div><dt>Point central</dt><dd>{lesson.focus}</dd></div>
              <div><dt>Structure</dt><dd>{lesson.exerciseIds.length} exercices + 1 dialogue</dd></div>
            </dl>
            <button className="primary-button" onClick={() => void start(lesson.id)} disabled={loading}>
              {loading ? "Préparation…" : view.catalog.items.find((item) => item.lesson.id === lesson.id)?.completionCount ? "Refaire cette leçon" : "Commencer la leçon"}
            </button>
          </div>
          <aside className="lesson-route" aria-label="Déroulé de la leçon">
            <strong>Votre itinéraire</strong>
            {phaseLabels.map((label, index) => <span key={label}><b>{index + 1}</b>{label}</span>)}
          </aside>
        </section>
      </div>
    );
  }

  const activePhase = phaseIndex[session.phase];
  return (
    <section className="guided-lesson" aria-labelledby="lesson-step-title">
      {session.phase === "summary" ? <LearningPath view={view} disabled={loading} onSelect={selectLesson} /> : null}
      <header className="lesson-progress-head">
        <div><span>{lesson.level}</span><strong>{lesson.title}</strong></div>
        <span>{lesson.estimatedMinutes} min</span>
        {session.status === "active" ? (
          <button type="button" className="text-button abandon-lesson" onClick={() => void abandonLesson()} disabled={loading}>Abandonner cette leçon</button>
        ) : null}
      </header>
      <ol className="lesson-stepper" aria-label="Progression de la leçon">
        {phaseLabels.map((label, index) => (
          <li key={label} className={index < activePhase ? "done" : index === activePhase ? "active" : ""} aria-current={index === activePhase ? "step" : undefined}>
            <span>{index < activePhase ? "✓" : index + 1}</span><small>{label}</small>
          </li>
        ))}
      </ol>

      {session.phase === "intro" ? (
        <article className="lesson-stage course-stage">
          <div className="stage-number">01</div>
          <div className="course-copy">
            <p className="lesson-kicker">Le repère à garder</p>
            <h2 id="lesson-step-title" tabIndex={-1}>{lesson.microCourse.title}</h2>
            <p className="course-intro">{lesson.microCourse.introduction}</p>
            <ul>{lesson.microCourse.points.map((point) => <li key={point}>{point}</li>)}</ul>
          </div>
          <div className="example-board" aria-label="Exemples">
            {lesson.microCourse.examples.map((example) => (
              <div key={example.target}><strong>{example.target}</strong><span>{example.translation}</span></div>
            ))}
          </div>
          <footer><button className="primary-button" onClick={continueLesson} disabled={loading}>J’ai compris, pratiquer</button></footer>
        </article>
      ) : null}

      {session.phase === "practice" && currentExercise ? (
        <article className="lesson-stage practice-stage">
          <div className="stage-number">{String(session.currentExerciseIndex + 2).padStart(2, "0")}</div>
          <div className="exercise-meta"><span>{currentExercise.level}</span><span>Exercice {session.currentExerciseIndex + 1} sur {lesson.exerciseIds.length}</span></div>
          <h2 id="lesson-step-title" tabIndex={-1}>{currentExercise.prompt}</h2>
          {currentAttempts.length ? <p className="retry-note">Deuxième essai : relisez le point d’attention avant de répondre.</p> : null}
          <ExerciseAnswer exercise={currentExercise} language={language} value={answer} onChange={setAnswer} onSubmit={() => void submitAnswer()} disabled={loading} />
          <p className="hint">Indice : {currentExercise.hint}</p>
          <footer><button className="primary-button" onClick={submitAnswer} disabled={!answer.trim() || loading}>{loading ? "Vérification…" : "Vérifier ma réponse"}</button></footer>
        </article>
      ) : null}

      {session.phase === "correction" && evaluation ? (
        <article className={`lesson-stage correction-stage ${evaluation.verdict}`} aria-live="polite">
          <div className="verdict-mark" aria-hidden="true">{evaluation.verdict === "exact" ? "✓" : evaluation.verdict === "minor" ? "≈" : "!"}</div>
          <div className="correction-copy">
            <p className="lesson-kicker">{evaluation.verdict === "exact" ? "Réponse exacte" : evaluation.verdict === "minor" ? "Bonne réponse, forme à préciser" : "On ajuste puis on réessaie"}</p>
            <h2 id="lesson-step-title" tabIndex={-1}>{evaluation.feedback}</h2>
            {evaluation.verdict !== "exact" ? <div className="model-answer"><span>Forme attendue</span><strong>{evaluation.expectedAnswer}</strong></div> : null}
            {currentExercise && currentExercise.type !== "match-pairs" && getSpeechCapabilities().synthesis ? (
              <button className="text-button listen-model" onClick={() => speakText(evaluation.expectedAnswer, language, 0.85)}>▶ Écouter la phrase</button>
            ) : null}
            <p>{evaluation.explanation}</p>
            {evaluation.issues.map((issue) => <p className="attention-note" key={issue.message}><strong>À observer :</strong> {issue.message}</p>)}
          </div>
          <footer><button className="primary-button" onClick={continueLesson} disabled={loading}>{evaluation.correct ? "Continuer" : currentAttempts.length < 2 ? "Réessayer avec cet indice" : session.currentExerciseIndex + 1 < lesson.exerciseIds.length ? "Passer à l'exercice suivant" : "Continuer vers la mise en situation"}</button></footer>
        </article>
      ) : null}

      {session.phase === "conversation" ? (
        <article className="lesson-stage dialogue-stage">
          <div className="dialogue-brief">
            <p className="lesson-kicker">Mise en situation</p>
            <h2 id="lesson-step-title" tabIndex={-1}>Utilisez la notion dans un vrai échange</h2>
            <p>{lesson.objective}</p>
            <span>{session.conversationTurns} / {lesson.conversationTurnGoal} réponses</span>
          </div>
          <div className="lesson-messages" aria-live="polite" ref={messagesRef}>
            {session.conversation.messages.map((item) => (
              <div className={`lesson-message ${item.role}`} key={item.id}>
                <span>{item.role === "coach" ? "Coach" : "Vous"}{item.source === "ai" ? <b className="ai-badge" title="Réponse générée par Claude Haiku">IA</b> : null}</span><p>{item.text}</p>
                {item.correction ? <small className="lesson-correction"><strong>Plutôt : {item.correction}</strong>{item.explanation ? <span>{item.explanation}</span> : null}</small> : null}
              </div>
            ))}
            {pending ? <div className="lesson-message learner pending"><span>Vous</span><p>{pending}</p></div> : null}
            {loading && pending ? <div className="lesson-message coach typing" role="status" aria-label="Le coach écrit"><i /><i /><i /></div> : null}
          </div>
          <label className="dialogue-composer">Votre réponse
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} readOnly={loading} ref={composerRef} rows={3} enterKeyHint="send" />
          </label>
          <footer><span>Entrée pour envoyer · Maj + Entrée pour une nouvelle ligne</span><button className="primary-button" onClick={sendMessage} disabled={!message.trim() || loading}>{loading ? "Envoi…" : "Répondre"}</button></footer>
        </article>
      ) : null}

      {session.phase === "summary" && session.summary ? (
        <article className={`lesson-stage summary-stage ${session.summary.outcome}`}>
          <div className="summary-seal" aria-hidden="true"><span>{session.summary.exact + session.summary.minor}</span><small>acquis</small></div>
          <div>
            <p className="lesson-kicker">{session.summary.outcome === "mastered" ? "Niveau validé pour cette étape" : "Séance terminée · consolidation conseillée"}</p>
            <h2 id="lesson-step-title" tabIndex={-1}>{session.summary.outcome === "mastered" ? "Vous pouvez avancer dans le parcours" : "Un second passage rendra cette notion plus solide"}</h2>
            <p>{session.summary.outcome === "mastered" ? lesson.objective : "La séance est enregistrée, mais le niveau suivant reste verrouillé jusqu'à une meilleure maîtrise."}</p>
            <dl className="summary-grid">
              <div><dt>Exactes</dt><dd>{session.summary.exact}</dd></div>
              <div><dt>Détails à polir</dt><dd>{session.summary.minor}</dd></div>
              <div><dt>À revoir</dt><dd>{session.summary.incorrect}</dd></div>
              <div><dt>Dialogue</dt><dd>{session.summary.conversationSteps}/{session.summary.conversationGoal}</dd></div>
            </dl>
          </div>
          <footer>
            <button className="secondary-button" onClick={onHome}>Retour au tableau de bord</button>
            <button className="secondary-button" onClick={() => void start(lesson.id)} disabled={loading}>Refaire cette leçon</button>
            <button className="primary-button" onClick={() => void start(view.catalog.recommendedLessonId)} disabled={loading}>
              {session.summary.outcome === "mastered" && view.catalog.recommendedLessonId !== lesson.id ? "Continuer le parcours" : "Consolider maintenant"}
            </button>
          </footer>
        </article>
      ) : null}

      {error ? <div className="alert" role="alert">{error}<button onClick={() => setError(undefined)}>Fermer</button></div> : null}
    </section>
  );
}
