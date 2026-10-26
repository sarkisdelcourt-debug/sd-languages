import { useEffect, useState } from "react";
import { LANGUAGES } from "@shared/catalog";
import type { CefrLevel, LanguageCode, LanguageSettings, LearningGoal } from "@shared/types";
import { api } from "../api";
import { AiCoachSettings } from "./AiCoachSettings";

const GOALS: Array<{ id: LearningGoal; title: string; description: string; mark: string }> = [
  { id: "fluency", title: "Aisance générale", description: "Parler et écrire avec plus de naturel", mark: "AI" },
  { id: "travel", title: "Voyager", description: "Gérer les situations essentielles sur place", mark: "VO" },
  { id: "work", title: "Travail", description: "Réunions, échanges et vocabulaire professionnel", mark: "PRO" },
  { id: "basics", title: "Bases solides", description: "Construire les automatismes fondamentaux", mark: "A1" }
];
const MINUTES = [5, 10, 15, 20] as const;
const LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1"];

export function SettingsView({ language, onSaved }: { language: LanguageCode; onSaved: () => void }) {
  const [settings, setSettings] = useState<LanguageSettings>();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string>();
  const [diagnosticLevel, setDiagnosticLevel] = useState<CefrLevel>();
  useEffect(() => {
    api.settings(language).then(setSettings).catch((reason: Error) => setError(reason.message));
    api.dashboard().then((dashboard) => setDiagnosticLevel(dashboard.progress[language].diagnostic?.estimatedLevel)).catch(() => undefined);
  }, [language]);
  if (error) return <div className="alert" role="alert">{error}</div>;
  if (!settings) return <div className="loading-card">Chargement de vos objectifs…</div>;
  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const next = await api.updateSettings(language, { ...settings, declaredLevel: settings.declaredLevel ?? null });
      setSettings(next);
      setSaved(true);
      onSaved();
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="settings-layout">
      <div className="settings-intro">
        <p className="eyebrow">Personnalisation locale</p>
        <h2>Votre cap en {LANGUAGES[language].name.toLowerCase()}</h2>
        <p>Ces choix déterminent la durée du parcours quotidien et orienteront progressivement les exercices.</p>
      </div>
      <article className="settings-card">
        <div className="settings-section"><strong>Pourquoi apprenez-vous ?</strong><span>Choisissez votre priorité actuelle.</span></div>
        <div className="goal-grid">
          {GOALS.map((goal) => <button key={goal.id} className={settings.goal === goal.id ? "goal-option selected" : "goal-option"} aria-pressed={settings.goal === goal.id} onClick={() => setSettings({ ...settings, goal: goal.id })}><span>{goal.mark}</span><strong>{goal.title}</strong><small>{goal.description}</small></button>)}
        </div>
        <div className="settings-section"><strong>Temps quotidien</strong><span>Un objectif réaliste vaut mieux qu'une longue session occasionnelle.</span></div>
        <div className="segmented-options">{MINUTES.map((minutes) => <button key={minutes} className={settings.dailyMinutes === minutes ? "selected" : ""} aria-pressed={settings.dailyMinutes === minutes} onClick={() => setSettings({ ...settings, dailyMinutes: minutes })}>{minutes} min</button>)}</div>
        <div className="settings-section"><strong>Je pars de 0</strong><span>Débutant complet en {LANGUAGES[language].name.toLowerCase()} : niveau A1, objectif « bases », et le parcours « Premiers pas » ouvert en premier dans Règles.</span></div>
        <div className="relay-actions">
          <button className="secondary-button" onClick={() => setSettings({ ...settings, declaredLevel: "A1", goal: "basics", targetLevel: settings.targetLevel === "A1" ? "A2" : settings.targetLevel })}>Je pars de 0 (puis Enregistrer)</button>
        </div>
        <div className="settings-section"><strong>Mon niveau actuel</strong><span>Si le diagnostic vous sous-estime, indiquez votre vrai niveau : les leçons en dessous seront considérées comme acquises (toujours accessibles).</span></div>
        <div className="level-options">
          <button className={!settings.declaredLevel ? "selected" : ""} aria-pressed={!settings.declaredLevel} onClick={() => setSettings({ ...settings, declaredLevel: undefined })}>
            Diagnostic{diagnosticLevel ? ` (${diagnosticLevel})` : ""}
          </button>
          {LEVELS.map((level) => <button key={level} className={settings.declaredLevel === level ? "selected" : ""} aria-pressed={settings.declaredLevel === level} onClick={() => setSettings({ ...settings, declaredLevel: level })}>{level}</button>)}
        </div>
        <div className="settings-section"><strong>Niveau visé</strong><span>Le cap que vous vous fixez pour cette langue.</span></div>
        <div className="level-options">{LEVELS.map((level) => <button key={level} className={settings.targetLevel === level ? "selected" : ""} aria-pressed={settings.targetLevel === level} onClick={() => setSettings({ ...settings, targetLevel: level })}>{level}</button>)}</div>
        <div className="settings-footer"><span>{saved ? "✓ Préférences enregistrées sur cet appareil" : "Rien ne quitte cet appareil, sauf si vous activez le coach IA"}</span><button className="primary-button" disabled={saving} onClick={() => void save()}>{saving ? "Enregistrement…" : "Enregistrer"}</button></div>
      </article>
      <AiCoachSettings />
    </section>
  );
}
