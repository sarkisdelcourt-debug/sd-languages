import { useCallback, useEffect, useState } from "react";
import { warmUpAi } from "../ai/conversation";
import {
  DEFAULT_AI_SETTINGS, loadAiCheck, loadAiUsage, maskKey, patchAiSettings, readAiSettings, saveAiCheck, type AiCheck, type AiSettings
} from "../ai/settings";
import { COACH_MODEL, monthKey, type AiUsage } from "@engine/modules/ai-coach";

const CAPS = [1, 3, 5, 10] as const;
const when = (iso: string) => new Date(iso).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/** Réglages du coach IA facultatif : clé sur l'appareil, consentement explicite, plafond, test. */
export function AiCoachSettings() {
  const [settings, setSettings] = useState<AiSettings>(DEFAULT_AI_SETTINGS);
  const [readable, setReadable] = useState(true);
  const [usage, setUsage] = useState<AiUsage>();
  const [check, setCheck] = useState<AiCheck>();
  const [loaded, setLoaded] = useState(false);
  const [consent, setConsent] = useState(false);
  const [draftKey, setDraftKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string }>();

  const refresh = useCallback(async () => {
    const [read, nextUsage, nextCheck] = await Promise.all([readAiSettings(), loadAiUsage().catch(() => undefined), loadAiCheck().catch(() => undefined)]);
    setSettings(read.settings);
    setReadable(read.readable);
    setConsent(read.settings.enabled);
    setUsage(nextUsage);
    setCheck(nextCheck);
    setLoaded(true);
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  if (!loaded) return null;
  const hasStoredKey = /^sk-ant-/.test(settings.apiKey);
  const draftValid = /^sk-ant-/.test(draftKey.trim());
  const spent = usage?.month === monthKey(new Date()) ? usage : undefined;
  const change = async (patch: Partial<AiSettings>) => {
    try {
      setSettings(await patchAiSettings(patch));
    } catch (reason) {
      setMessage({ ok: false, text: (reason as Error).message });
    }
  };

  const saveKey = async () => {
    await change({ apiKey: draftKey.trim() });
    setDraftKey("");
    await refresh();
    setMessage({ ok: true, text: "Clé enregistrée sur cet appareil. Vérifiez-la avec « Tester la connexion »." });
  };

  const runTest = async () => {
    setBusy(true);
    setMessage(undefined);
    const { testConnection } = await import("../ai/coach-client");
    const result = await testConnection(settings.apiKey);
    const record = { ok: result.ok, at: new Date().toISOString(), message: result.message };
    await saveAiCheck(record).catch(() => undefined);
    setCheck(record);
    setMessage({ ok: result.ok, text: result.message });
    setUsage(await loadAiUsage().catch(() => undefined));
    setBusy(false);
  };

  return (
    <article className="settings-card ai-settings">
      <div className="settings-section">
        <strong>Coach conversationnel IA (facultatif)</strong>
        <span>Claude Haiku mène le dialogue : il rebondit sur ce que vous dites, corrige vos fautes et explique en français. Sans clé, ou si le réseau tombe, le coach local à règles répond.</span>
      </div>
      {!readable ? <p className="inline-error" role="alert">Le stockage de cet appareil n'a pas pu être lu : rien n'est modifié pour ne pas écraser votre clé. Rechargez la page ; si le message revient, fermez les autres onglets de l'appli.</p> : null}

      <div className="ai-key-state" role="status">
        {hasStoredKey ? (
          <>
            <strong>✓ Clé enregistrée sur cet appareil</strong> <code>{maskKey(settings.apiKey)}</code>
            <small>
              {check ? (check.ok ? `Dernier test réussi le ${when(check.at)}.` : `Dernier test refusé le ${when(check.at)} : ${check.message}`) : "Pas encore testée."}
            </small>
          </>
        ) : (
          <strong>Aucune clé enregistrée sur cet appareil ({location.host})</strong>
        )}
      </div>

      <label className="answer-field">{hasStoredKey ? "Remplacer la clé" : "Clé API Anthropic"}
        <input
          type="password" autoComplete="off" spellCheck={false} placeholder="sk-ant-…"
          value={draftKey} disabled={!readable}
          onChange={(event) => { setMessage(undefined); setDraftKey(event.target.value); }}
        />
      </label>
      {draftKey && !draftValid ? <p className="inline-error" role="alert">Une clé Anthropic commence par « sk-ant- ».</p> : null}
      <div className="relay-actions">
        <button className="secondary-button" disabled={!draftValid || !readable} onClick={() => void saveKey()}>Enregistrer la clé</button>
        {hasStoredKey ? <button className="text-button" disabled={!readable} onClick={async () => { await change({ apiKey: "", enabled: false }); await refresh(); setMessage({ ok: true, text: "Clé supprimée de cet appareil." }); }}>Supprimer la clé</button> : null}
      </div>
      <p className="ai-help">Créez-la sur <strong>console.anthropic.com → API keys</strong> et fixez-y une limite de dépense. Elle reste uniquement sur cet appareil : elle n'est ni envoyée ailleurs que chez Anthropic, ni incluse dans le fichier de relais, et « Effacer mes données » la supprime. Chaque appareil et chaque adresse d'accès ont leur propre clé.</p>

      <label className="ai-consent">
        <input type="checkbox" checked={consent} onChange={(event) => { setConsent(event.target.checked); if (!event.target.checked) void change({ enabled: false }); }} />
        <span>Je comprends que, quand le coach IA est actif, mes messages de conversation (les 8 derniers échanges, ma langue, mon niveau et mon objectif) sont envoyés à Anthropic pour générer la réponse. Ma progression, mes scores et mes autres données ne sont jamais envoyés.</span>
      </label>
      <div className="relay-actions">
        <button className="primary-button" disabled={!consent || !hasStoredKey || !readable} onClick={async () => { await change({ enabled: !settings.enabled }); warmUpAi(); }}>
          {settings.enabled ? "Désactiver le coach IA" : "Activer le coach IA"}
        </button>
        <button className="secondary-button" disabled={busy || !hasStoredKey} onClick={() => void runTest()}>
          {busy ? "Test en cours…" : "Tester la connexion"}
        </button>
      </div>
      {message ? <p className={message.ok ? "relay-message" : "inline-error"} role="status">{message.text}</p> : null}
      <p className="ai-state">{settings.enabled ? "✓ Coach IA actif" : "Coach IA inactif (coach local)"} · modèle {COACH_MODEL}</p>

      <div className="settings-section">
        <strong>Plafond mensuel</strong>
        <span>Estimation tirée des tokens facturés (une réplique coûte environ 0,0005 $). Au-delà, retour automatique au coach local.</span>
      </div>
      <div className="segmented-options">
        {CAPS.map((cap) => (
          <button key={cap} disabled={!readable} className={settings.monthlyCapUsd === cap ? "selected" : ""} aria-pressed={settings.monthlyCapUsd === cap} onClick={() => void change({ monthlyCapUsd: cap })}>{cap} $</button>
        ))}
      </div>
      <p className="ai-state">Ce mois-ci : {spent ? `${spent.calls} appel${spent.calls > 1 ? "s" : ""}, environ ${spent.costUsd.toFixed(3)} $` : "aucun appel"}. Le décompte exact est sur console.anthropic.com.</p>
    </article>
  );
}
