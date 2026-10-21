import { useEffect, useMemo, useState } from "react";
import { LANGUAGES } from "@shared/catalog";
import type { DailyPlan, DashboardSnapshot, LanguageCode, LanguageSettings, MistakeRecord } from "@shared/types";
import { api } from "../api";

interface Props {
  dashboard: DashboardSnapshot;
  language: LanguageCode;
  onNavigate: (
    view: "lesson" | "diagnostic" | "practice" | "review" | "conversation" | "settings",
    speakingMode?: "pronunciation" | "conversation"
  ) => void;
}

export function DashboardView({ dashboard, language, onNavigate }: Props) {
  const progress = dashboard.progress[language];
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [plan, setPlan] = useState<DailyPlan>();
  const [settings, setSettings] = useState<LanguageSettings>();
  useEffect(() => {
    api.mistakes(language).then(setMistakes).catch(() => setMistakes([]));
    api.plan(language).then(setPlan).catch(() => setPlan(undefined));
    api.settings(language).then(setSettings).catch(() => setSettings(undefined));
  }, [language, progress.completedExercises]);
  const accuracy = progress.completedExercises ? Math.round((progress.correctAnswers / progress.completedExercises) * 100) : 0;
  const focusAreas = useMemo(
    () => [...mistakes].sort((a, b) => b.occurrenceCount - a.occurrenceCount).slice(0, 3),
    [mistakes]
  );

  return (
    <div className="stack-large">
      {settings && !settings.onboardingCompleted ? (
        <section className="setup-banner">
          <span className="setup-icon" aria-hidden="true">01</span>
          <div><strong>Construisons un parcours qui vous ressemble</strong><p>Indiquez votre objectif, votre niveau cible et le temps disponible. Chaque recommandation expliquera ensuite pourquoi elle vous est proposée.</p></div>
          <button className="secondary-button" onClick={() => onNavigate("settings")}>Personnaliser mon parcours</button>
        </section>
      ) : null}
      <section className="hero-card">
        <div>
          <p className="eyebrow dark">Aujourd'hui · {LANGUAGES[language].nativeName}</p>
          <h2>{progress.diagnostic ? (progress.completedExercises ? "Continuez sur votre lancée." : "Votre première leçon est prête.") : "Commençons par situer votre niveau."}</h2>
          <p>{LANGUAGES[language].suggestedGoal}</p>
          <button className="primary-button light" onClick={() => onNavigate(progress.diagnostic ? "lesson" : "diagnostic")}>
            {progress.diagnostic ? "Commencer ma leçon" : "Faire le diagnostic"} <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="hero-score" aria-label={`${progress.xp} points d'expérience`}>
          <strong>{progress.xp}</strong>
          <span>XP gagnés</span>
        </div>
      </section>

      {plan ? (
        <section className="daily-plan">
          <div className="section-heading plan-heading">
            <div><p className="eyebrow">Recommandation locale</p><h2>Votre parcours du jour</h2></div>
            <span>{plan.totalMinutes} min prévues · objectif {plan.goalMinutes} min</span>
          </div>
          <div className="plan-list">
            {plan.items.map((item, itemIndex) => (
              <button key={item.id} className="plan-item" onClick={() => onNavigate(item.kind, item.kind === "conversation" ? "conversation" : undefined)}>
                <span className="plan-number">{String(itemIndex + 1).padStart(2, "0")}</span>
                <span className="plan-copy"><strong>{item.title}</strong><small>{item.description}</small></span>
                <span className="plan-time">{item.estimatedMinutes} min</span>
                <span className="plan-arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="metric-grid" aria-label="Progression">
        <article className="metric-card">
          <span className="metric-icon violet" aria-hidden="true">PR</span>
          <div><strong>{accuracy}%</strong><span>Précision</span></div>
        </article>
        <article className="metric-card">
          <span className="metric-icon coral" aria-hidden="true">JR</span>
          <div><strong>{progress.currentStreak} j</strong><span>Série actuelle</span></div>
        </article>
        <article className="metric-card">
          <span className="metric-icon mint" aria-hidden="true">EX</span>
          <div><strong>{progress.completedExercises}</strong><span>Exercices réalisés</span></div>
        </article>
        <article className="metric-card">
          <span className="metric-icon amber" aria-hidden="true">NV</span>
          <div><strong>{progress.diagnostic?.estimatedLevel ?? "—"}</strong><span>Niveau indicatif</span></div>
        </article>
      </section>

      <section className="two-column">
        <article className="panel">
          <div className="panel-heading">
            <div><p className="eyebrow">À consolider</p><h3>Mémoire des erreurs</h3></div>
            <span>{mistakes.length} notion{mistakes.length === 1 ? "" : "s"}</span>
          </div>
          {focusAreas.length ? (
            <ul className="focus-list">
              {focusAreas.map((mistake) => (
                <li key={mistake.id}>
                  <span><strong>{mistake.focus}</strong><small>{mistake.expectedAnswer}</small></span>
                  <span className="count-badge">×{mistake.occurrenceCount}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-compact">Vos erreurs utiles apparaîtront ici après une session.</div>
          )}
        </article>
        <article className="panel review-panel">
          <div><p className="eyebrow">Répétition espacée</p><h3>{dashboard.dueReviews[language]} carte{dashboard.dueReviews[language] === 1 ? "" : "s"} à revoir</h3></div>
          <p>Les notions difficiles reviennent au bon moment, sans compte ni abonnement.</p>
          <button className="secondary-button" onClick={() => onNavigate("review")}>Ouvrir les révisions</button>
        </article>
      </section>

      <section>
        <div className="section-heading"><div><p className="eyebrow">Choisir un rythme</p><h2>Que voulez-vous travailler ?</h2></div></div>
        <div className="action-grid">
          <button className="action-card featured" onClick={() => onNavigate("lesson")}>
            <span className="action-index">PARCOURS GUIDÉ</span><strong>Ma leçon du jour</strong><span>Comprendre, pratiquer, dialoguer puis retenir</span>
          </button>
          <button className="action-card" onClick={() => onNavigate("practice")}>
            <span className="action-index">MODE LIBRE</span><strong>Exercices ciblés</strong><span>Grammaire, vocabulaire et traduction</span>
          </button>
          <button className="action-card" onClick={() => onNavigate("conversation", "pronunciation")}>
            <span className="action-index">ENTRAÎNEMENT ORAL</span><strong>Prononciation</strong><span>Écouter, vous enregistrer et comparer les mots</span>
          </button>
        </div>
      </section>
    </div>
  );
}
