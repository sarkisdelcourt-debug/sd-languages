import { useEffect, useState } from "react";
import { DEFAULT_AI_SETTINGS, loadAiSettings, loadAiUsage, saveAiSettings, type AiSettings } from "../ai/settings";
import { COACH_MODEL, monthKey, type AiUsage } from "@engine/modules/ai-coach";

const CAPS = [1, 3, 5, 10] as const;

/** Réglages du coach IA facultatif : clé sur l'appareil, consentement explicite, plafond, test. */
export function AiCoachSettings() {
  const [settings, setSettings] = useState<AiSettings>(DEFAULT_AI_SETTINGS);
  const [usage, setUsage] = useState<AiUsage>();
  const [loaded, setLoaded] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string }>();

  const refreshUsage = () => loadAiUsage().then(setUsage).catch(() => undefined);
  useEffect(() => {
    void loadAiSettings().then((value) => {
      setSettings(value);
      setConsent(value.enabled);
      setLoaded(true);
    });
    void refreshUsage();
  }, []);

  if (!loaded) return null;
  const keyLooksValid = /^sk-ant-/.test(settings.apiKey.trim());
  const spent = usage?.month === monthKey(new Date()) ? usage : undefined;
  const persist = async (next: AiSettings) => {
    setSettings(next);
    await saveAiSettings({ ...next, apiKey: next.apiKey.trim() });
  };

  return (
    <article className="settings-card ai-settings">
      <div className="settings-section">
        <strong>Coach conversationnel IA (facultatif)</strong>
        <span>Claude Haiku mène le dialogue : il rebondit sur ce que vous dites, corrige vos fautes et explique en français. Sans clé, ou si le réseau tombe, le coach local à règles répond.</span>
      </div>
      <label className="answer-field">Clé API Anthropic
        <input
          type="password" autoComplete="off" spellCheck={false} placeholder="sk-ant-…"
          value={settings.apiKey}
          onChange={(event) => { setMessage(undefined); void persist({ ...settings, apiKey: event.target.value }); }}
        />
      </label>
      <p className="ai-help">Créez-la sur <strong>console.anthropic.com → API keys</strong> et fixez-y une limite de dépense. Elle reste uniquement sur cet appareil : elle n'est ni envoyée ailleurs que chez Anthropic, ni incluse dans le fichier de relais, et « Effacer mes données » la supprime. Chaque appareil a sa propre clé.</p>
      <label className="ai-consent">
        <input type="checkbox" checked={consent} onChange={(event) => { setConsent(event.target.checked); if (!event.target.checked) void persist({ ...settings, enabled: false }); }} />
        <span>Je comprends que, quand le coach IA est actif, mes messages de conversation (les 8 derniers échanges, ma langue, mon niveau et mon objectif) sont envoyés à Anthropic pour générer la réponse. Ma progression, mes scores et mes autres données ne sont jamais envoyés.</span>
      </label>
      <div className="relay-actions">
        <button
          className="primary-button"
          disabled={!consent || !keyLooksValid}
          onClick={() => void persist({ ...settings, enabled: !settings.enabled })}
        >
          {settings.enabled ? "Désactiver le coach IA" : "Activer le coach IA"}
        </button>
        <button
          className="secondary-button"
          disabled={busy || !keyLooksValid}
          onClick={async () => {
            setBusy(true);
            setMessage(undefined);
            setMessage(await import("../ai/coach-client").then(({ testConnection }) => testConnection(settings.apiKey)).then((result) => ({ ok: result.ok, text: result.message })));
            await refreshUsage();
            setBusy(false);
          }}
        >
          {busy ? "Test en cours…" : "Tester la connexion"}
        </button>
      </div>
      {settings.apiKey && !keyLooksValid ? <p className="inline-error" role="alert">Une clé Anthropic commence par « sk-ant- ».</p> : null}
      {message ? <p className={message.ok ? "relay-message" : "inline-error"} role="status">{message.text}</p> : null}
      <p className="ai-state">
        {settings.enabled ? "✓ Coach IA actif" : "Coach IA inactif (coach local)"} · modèle {COACH_MODEL}
      </p>
      <div className="settings-section">
        <strong>Plafond mensuel</strong>
        <span>Estimation tirée des tokens facturés (une réplique coûte environ 0,0005 $). Au-delà, retour automatique au coach local.</span>
      </div>
      <div className="segmented-options">
        {CAPS.map((cap) => (
          <button key={cap} className={settings.monthlyCapUsd === cap ? "selected" : ""} aria-pressed={settings.monthlyCapUsd === cap} onClick={() => void persist({ ...settings, monthlyCapUsd: cap })}>{cap} $</button>
        ))}
      </div>
      <p className="ai-state">Ce mois-ci : {spent ? `${spent.calls} appel${spent.calls > 1 ? "s" : ""}, environ ${spent.costUsd.toFixed(3)} $` : "aucun appel"}. Le décompte exact est sur console.anthropic.com.</p>
    </article>
  );
}
