import { useEffect, useMemo, useState } from "react";
import { LANGUAGES } from "@shared/catalog";
import type { GrammarRule } from "@shared/grammar-rules";
import type { LanguageCode } from "@shared/types";
import { api } from "../api";
import { speakText } from "../lib/browser-speech";
import type { PracticeTarget } from "./SkillsView";

/**
 * Règles (24/10/2026) : fiches de grammaire, d'accords, de genre, de cas et de formation du vocabulaire, en français, avec
 * tableaux, exemples écoutables et pièges. Le bouton « S'entraîner » lance une série ciblée sur les compétences de la fiche.
 */
export function RulesView({ language, onPractice }: { language: LanguageCode; onPractice: (target: PracticeTarget) => void }) {
  const [rules, setRules] = useState<GrammarRule[]>();
  const [error, setError] = useState<string>();
  const [group, setGroup] = useState<string>();
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string>();

  useEffect(() => {
    setRules(undefined);
    setError(undefined);
    setGroup(undefined);
    setOpenId(undefined);
    api.rules(language).then((list) => {
      setRules(list);
      // Parcours « je pars de 0 » : la première fiche des premiers pas s'ouvre d'elle-même.
      api.settings(language).then((settings) => {
        if (settings.declaredLevel === "A1") setOpenId(list.find((rule) => rule.group === "Premiers pas")?.id);
      }).catch(() => undefined);
    }).catch((reason: Error) => setError(reason.message));
  }, [language]);

  const groups = useMemo(() => [...new Set((rules ?? []).map((rule) => rule.group))], [rules]);
  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("fr");
    return (rules ?? []).filter((rule) => (!group || rule.group === group)
      && (!needle || `${rule.title} ${rule.summary} ${rule.group}`.toLocaleLowerCase("fr").includes(needle)));
  }, [rules, group, query]);

  if (error) return <div className="alert" role="alert">{error}</div>;
  if (!rules) return <div className="loading-card">Chargement des règles…</div>;
  const languageName = LANGUAGES[language].name.toLowerCase();
  if (!rules.length) {
    return (
      <section className="rules-layout">
        <div className="settings-intro"><p className="eyebrow">Règles</p><h2>Les règles de {languageName}</h2><p>Les fiches de cette langue arrivent bientôt.</p></div>
      </section>
    );
  }

  return (
    <section className="rules-layout">
      <div className="settings-intro">
        <p className="eyebrow">Règles</p>
        <h2>Les règles de {languageName}</h2>
        <p>Genre, accords, cas, temps, formation des mots : une fiche par sujet, avec tableaux, exemples à écouter et pièges de francophone. « S'entraîner » lance une série sur la règle.</p>
      </div>
      <div className="rules-filters">
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Chercher une règle (datif, ser, pluriel…)" aria-label="Chercher une règle" />
        <div className="rules-groups" role="group" aria-label="Rubriques">
          <button className={!group ? "selected" : ""} aria-pressed={!group} onClick={() => setGroup(undefined)}>Tout</button>
          {groups.map((name) => <button key={name} className={group === name ? "selected" : ""} aria-pressed={group === name} onClick={() => setGroup(name)}>{name}</button>)}
        </div>
      </div>
      {visible.length === 0 ? <p className="hint">Aucune règle ne correspond à « {query} ».</p> : null}
      <div className="rules-list">
        {visible.map((rule, index) => (
          <details key={rule.id} className="rule-card" open={openId === rule.id} onToggle={(event) => { if ((event.currentTarget as HTMLDetailsElement).open) setOpenId(rule.id); else if (openId === rule.id) setOpenId(undefined); }}>
            <summary>
              {index === 0 || visible[index - 1]!.group !== rule.group ? <span className="rule-group">{rule.group}</span> : null}
              <span className="rule-title"><strong>{rule.title}</strong><span className="rule-level">{rule.level}</span></span>
              <span className="rule-summary">{rule.summary}</span>
            </summary>
            <div className="rule-body">
              {rule.sections.map((section, sectionIndex) => (
                <div className="rule-section" key={sectionIndex}>
                  {section.heading ? <h4>{section.heading}</h4> : null}
                  {section.text ? <p>{section.text}</p> : null}
                  {section.points?.length ? <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul> : null}
                  {section.table ? (
                    <div className="rule-table-wrap">
                      <table className="rule-table">
                        {section.table.caption ? <caption>{section.table.caption}</caption> : null}
                        <thead><tr>{section.table.head.map((cell) => <th scope="col" key={cell}>{cell}</th>)}</tr></thead>
                        <tbody>{section.table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => (cellIndex === 0 ? <th scope="row" key={cellIndex}>{cell}</th> : <td key={cellIndex}>{cell}</td>))}</tr>)}</tbody>
                      </table>
                    </div>
                  ) : null}
                </div>
              ))}
              <h4>Exemples</h4>
              <ul className="rule-examples">
                {rule.examples.map((example) => (
                  <li key={example.target}>
                    <div>
                      <strong lang={language}>{example.target}</strong>
                      <span>{example.translation}</span>
                      {example.note ? <small>{example.note}</small> : null}
                    </div>
                    <button className="text-button" aria-label={`Écouter : ${example.target}`} onClick={() => speakText(example.target, language)}>▶</button>
                  </li>
                ))}
              </ul>
              {rule.pitfalls?.length ? (
                <div className="rule-pitfalls">
                  <h4>Pièges</h4>
                  <ul>{rule.pitfalls.map((pitfall) => <li key={pitfall}>{pitfall}</li>)}</ul>
                </div>
              ) : null}
              {rule.skills[0] ? (
                <div className="relay-actions">
                  <button className="primary-button" onClick={() => onPractice({ label: rule.title, skill: rule.skills[0] })}>S'entraîner sur cette règle</button>
                </div>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
