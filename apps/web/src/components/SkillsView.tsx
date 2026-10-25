import { useEffect, useState } from "react";
import type { ExerciseTopic, LanguageCode, SkillAction, SkillSummary, SkillsView as SkillsSnapshot } from "@shared/types";
import { api } from "../api";
import { ContentNotice } from "./ContentNotice";

/** Cible d'une série lancée depuis « Mes acquis » : par thème s'il existe, sinon par compétence. */
export interface PracticeTarget {
  label: string;
  topic?: ExerciseTopic;
  skill?: string;
}

const actionLabels: Record<SkillAction, { status: string; button: string }> = {
  review: { status: "À revoir", button: "Revoir dans une série ciblée" },
  consolidate: { status: "À consolider", button: "Consolider avec une série" },
  practice: { status: "Acquis à pratiquer", button: "Pratiquer en contexte" }
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" });

function recentResultsLabel(results: boolean[]): string {
  if (!results.length) return "aucune réponse observée";
  return `${results.length} dernière${results.length > 1 ? "s" : ""} réponse${results.length > 1 ? "s" : ""}, de la plus récente à la plus ancienne : ${results.map((correct) => (correct ? "juste" : "fausse")).join(", ")}`;
}

function SkillItem({ skill, onPractice }: { skill: SkillSummary; onPractice: (target: PracticeTarget) => void }) {
  const labels = actionLabels[skill.action];
  const status = skill.exposure === 0 ? "Pas encore rencontrée" : labels.status;
  return (
    <li className="skill-item">
      <div className="skill-head">
        <h3>{skill.label}</h3>
        <span className="skill-status">{status}</span>
      </div>
      <p className="skill-reason">{skill.reason}</p>
      <dl className="skill-evidence">
        <div><dt>Exposition</dt><dd>{skill.exposure} tentative{skill.exposure > 1 ? "s" : ""} · {skill.seenExerciseCount}/{skill.exerciseCount} exercices vus</dd></div>
        <div>
          <dt>Réussite récente</dt>
          <dd>
            {skill.recentSuccess === undefined ? "—" : `${Math.round(skill.recentSuccess * 100)} %`}
            {skill.recentResults.length ? (
              <span className="skill-results" aria-label={recentResultsLabel(skill.recentResults)}>
                {" "}{skill.recentResults.map((correct) => (correct ? "✓" : "✗")).join(" ")}
              </span>
            ) : null}
          </dd>
        </div>
        <div><dt>Stabilité</dt><dd>{skill.seenExerciseCount ? `${Math.round(skill.stability * 100)} %` : "—"}</dd></div>
        <div><dt>Erreurs ouvertes</dt><dd>{skill.openMistakes}</dd></div>
        <div><dt>Prochaine révision</dt><dd>{skill.nextReviewAt ? dateFormatter.format(new Date(skill.nextReviewAt)) : "aucune carte"}</dd></div>
      </dl>
      <button
        type="button"
        className="secondary-button skill-action"
        onClick={() => onPractice({ label: skill.label, ...(skill.topic ? { topic: skill.topic } : { skill: skill.id }) })}
        disabled={skill.exerciseCount === 0}
      >
        {labels.button}
      </button>
    </li>
  );
}

/**
 * « Mes acquis » (22/10/2026) : liste hiérarchique (groupe → compétence) lisible sans couleur — l'état
 * est un mot, les dernières réponses des symboles ✓/✗ avec leur équivalent textuel — et au clavier
 * (titres, listes et boutons natifs). Chaque score cite sa preuve ; l'action lance une série ciblée.
 */
export function SkillsView({ language, onPractice }: { language: LanguageCode; onPractice: (target: PracticeTarget) => void }) {
  const [view, setView] = useState<SkillsSnapshot>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    setView(undefined);
    setError(undefined);
    api.skills(language).then(setView).catch((reason: Error) => setError(reason.message));
  }, [language]);

  if (error) return <div className="alert" role="alert">{error}</div>;
  if (!view) return <div className="loading-card">Lecture de vos acquis…</div>;

  const met = view.skills.filter((skill) => skill.exposure > 0).length;
  const solid = view.skills.filter((skill) => skill.exposure > 0 && skill.action === "practice").length;
  // Audit du 24/10 : on dit d'abord quoi travailler maintenant ; les compétences jamais rencontrées restent repliées.
  const priority = view.skills.filter((skill) => skill.exposure > 0 && skill.action !== "practice")
    .sort((left, right) => (left.action === "review" ? 0 : 1) - (right.action === "review" ? 0 : 1)).slice(0, 3);
  const untouched = (group: string) => view.skills.filter((skill) => skill.group === group && skill.exposure === 0);
  return (
    <div className="stack-large skills-view">
      <ContentNotice language={language} />
      <section className="skills-summary" aria-label="Vue d'ensemble des acquis">
        <p className="eyebrow">Carte de compétences · calcul local</p>
        <h2>{met} compétence{met > 1 ? "s" : ""} rencontrée{met > 1 ? "s" : ""} sur {view.skills.length}, {solid} acquise{solid > 1 ? "s" : ""} de façon stable</h2>
        <p className="skills-note">Chaque état s'appuie sur vos réponses enregistrées sur cet appareil : nombre de tentatives, dix dernières réponses, erreurs encore ouvertes et cartes de révision. Rien n'est estimé par une IA.</p>
      </section>
      {priority.length ? (
        <section className="skills-group" aria-labelledby="skills-priority">
          <h2 id="skills-priority">À travailler maintenant <small>{priority.length}</small></h2>
          <ul className="skills-list">
            {priority.map((skill) => <SkillItem key={skill.id} skill={skill} onPractice={onPractice} />)}
          </ul>
        </section>
      ) : met === 0 ? (
        <section className="skills-group"><p className="skills-note">Aucune compétence rencontrée pour l'instant : faites une leçon ou une série, et cette page dira quoi travailler en priorité.</p></section>
      ) : null}
      {view.groups.map((group) => {
        const skills = view.skills.filter((skill) => skill.group === group.group && skill.exposure > 0);
        const never = untouched(group.group);
        if (!skills.length && !never.length) return null;
        return (
          <section className="skills-group" key={group.group} aria-labelledby={`skills-group-${group.group}`}>
            <h2 id={`skills-group-${group.group}`}>{group.label} <small>{skills.length + never.length}</small></h2>
            {skills.length ? (
              <ul className="skills-list">
                {skills.map((skill) => <SkillItem key={skill.id} skill={skill} onPractice={onPractice} />)}
              </ul>
            ) : null}
            {never.length ? (
              <details className="skills-untouched">
                <summary>{never.length} compétence{never.length > 1 ? "s" : ""} pas encore rencontrée{never.length > 1 ? "s" : ""}</summary>
                <ul className="skills-list">
                  {never.map((skill) => <SkillItem key={skill.id} skill={skill} onPractice={onPractice} />)}
                </ul>
              </details>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
