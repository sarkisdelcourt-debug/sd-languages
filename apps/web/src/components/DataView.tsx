import { useCallback, useEffect, useRef, useState } from "react";
import { STATE_CHANGED_EVENT } from "../api";
import { LANGUAGE_CODES, LANGUAGES } from "@shared/catalog";
import type { StateSummary } from "@engine/backup";
import type { BackupEntry } from "../local/browser-store";
import {
  confirmImport,
  eraseDevice,
  exportProgress,
  fetchLegacyServerExport,
  getRelayStatus,
  isIos,
  isStandalone,
  listBackups,
  previewImport,
  restoreBackup,
  type ImportPreview,
  type RelayStatus
} from "../local/device";

const dateTime = (value?: string) => value
  ? new Date(value).toLocaleString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
  : "jamais";

const backupReasons: Record<BackupEntry["reason"], string> = {
  daily: "Copie du jour",
  "before-import": "Avant une reprise de fichier",
  "before-restore": "Avant une restauration"
};

function SummaryTable({ current, incoming }: { current: StateSummary; incoming: StateSummary }) {
  return (
    <table className="relay-compare">
      <caption>Comparaison avant remplacement</caption>
      <thead><tr><th scope="col">Langue</th><th scope="col">Cet appareil</th><th scope="col">Le fichier</th></tr></thead>
      <tbody>
        {LANGUAGE_CODES.map((code) => (
          <tr key={code}>
            <th scope="row">{LANGUAGES[code].name}</th>
            <td>{current.languages[code].xp} XP · {current.languages[code].completedLessons} leçon(s){current.languages[code].activeLesson ? " · 1 en cours" : ""}</td>
            <td>{incoming.languages[code].xp} XP · {incoming.languages[code].completedLessons} leçon(s){incoming.languages[code].activeLesson ? " · 1 en cours" : ""}</td>
          </tr>
        ))}
        <tr><th scope="row">Dernière activité</th><td>{dateTime(current.lastActivityAt)}</td><td>{dateTime(incoming.lastActivityAt)}</td></tr>
      </tbody>
    </table>
  );
}

export function DataView({ onChanged }: { onChanged: () => void }) {
  const [status, setStatus] = useState<RelayStatus>();
  const [backups, setBackups] = useState<BackupEntry[]>([]);
  const [preview, setPreview] = useState<ImportPreview>();
  const [legacyText, setLegacyText] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [eraseStep, setEraseStep] = useState<0 | 1>(0);
  const [eraseWord, setEraseWord] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const previewTitle = useRef<HTMLHeadingElement>(null);

  const refresh = useCallback(async () => {
    const [nextStatus, nextBackups] = await Promise.all([getRelayStatus(), listBackups()]);
    setStatus(nextStatus);
    setBackups(nextBackups);
  }, []);

  useEffect(() => {
    void refresh();
    void fetchLegacyServerExport().then(setLegacyText);
    const onChange = () => { void refresh(); };
    window.addEventListener(STATE_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(STATE_CHANGED_EVENT, onChange);
  }, [refresh]);

  useEffect(() => {
    if (preview) previewTitle.current?.focus();
  }, [preview]);

  const act = async (action: () => Promise<string | undefined>) => {
    setBusy(true);
    setError(undefined);
    setMessage(undefined);
    try {
      setMessage(await action());
      await refresh();
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const send = () => act(async () => {
    const outcome = await exportProgress();
    if (outcome === "cancelled") return "Envoi annulé : rien n'a changé.";
    return outcome === "shared"
      ? "Fichier envoyé. Sur l'autre appareil, ouvrez « Mes données » puis « Reprendre un fichier »."
      : "Fichier téléchargé. Transmettez-le à l'autre appareil (mail, iCloud, OneDrive…), puis reprenez-le là-bas.";
  });

  const openFile = async (file: File | undefined) => {
    if (!file) return;
    await act(async () => {
      setPreview(await previewImport(await file.text()));
      return undefined;
    });
    if (fileInput.current) fileInput.current.value = "";
  };

  const openLegacy = () => act(async () => {
    if (!legacyText) return undefined;
    setPreview({ ...(await previewImport(legacyText)), sourceDevice: "ancien serveur du PC" });
    return undefined;
  });

  const accept = () => act(async () => {
    if (!preview) return undefined;
    const wasPristine = status?.pristine ?? false;
    await confirmImport(preview);
    setPreview(undefined);
    onChanged();
    return wasPristine
      ? "Progression reprise sur cet appareil."
      : "Progression reprise. L'état précédent de cet appareil reste disponible dans les sauvegardes ci-dessous.";
  });

  const restore = (backup: BackupEntry) => {
    if (!window.confirm(`Restaurer la sauvegarde du ${dateTime(backup.createdAt)} (${backup.summary.totalXp} XP) ? L'état actuel sera lui-même sauvegardé.`)) return;
    void act(async () => {
      await restoreBackup(backup.id);
      onChanged();
      return "Sauvegarde restaurée.";
    });
  };

  const erase = () => act(async () => {
    await eraseDevice();
    window.location.reload();
    return undefined;
  });

  const unsent = status?.changesSinceCheckpoint ?? 0;
  const needsHomeScreen = isIos() && !isStandalone();

  return (
    <section className="data-layout">
      <div className="settings-intro">
        <p className="eyebrow">Relais entre appareils</p>
        <h2>Vos données restent sur cet appareil</h2>
        <p>Avant de changer d'appareil, envoyez votre progression ; sur l'autre, reprenez le fichier. Rien ne part sur internet sans ce geste.</p>
      </div>

      {needsHomeScreen ? (
        <aside className="relay-notice" role="note">
          <strong>Ajoutez SD Languages à l'écran d'accueil</strong>
          <span>Dans Safari : bouton Partager, puis « Sur l'écran d'accueil ». Ouvrez ensuite toujours l'application par cette icône : c'est elle qui garde votre progression durablement, y compris en mode avion.</span>
        </aside>
      ) : null}

      {message ? <p className="relay-message" role="status">{message}</p> : null}
      {error ? <div className="alert" role="alert">{error}</div> : null}

      {preview ? (
        <article className={`settings-card relay-preview${preview.assessment.verdict === "warning" ? " is-warning" : ""}`} aria-labelledby="relay-preview-title">
          <h3 id="relay-preview-title" ref={previewTitle} tabIndex={-1}>
            {preview.assessment.verdict === "warning" ? "Attention avant de remplacer" : preview.assessment.verdict === "identical" ? "Ce fichier est déjà sur cet appareil" : "Prêt à reprendre"}
          </h3>
          <p>Fichier {preview.sourceDevice ? `venant de : ${preview.sourceDevice}` : "sans appareil indiqué"}{preview.exportedAt ? `, envoyé ${dateTime(preview.exportedAt)}` : ""}.</p>
          {preview.assessment.reasons.length > 0 ? (
            <ul className="relay-reasons">
              {preview.assessment.reasons.map((reason) => <li key={reason}>{reason}</li>)}
            </ul>
          ) : null}
          <SummaryTable current={preview.assessment.current} incoming={preview.assessment.incoming} />
          <p className="relay-footnote">Une copie de l'état actuel est gardée dans les sauvegardes de cet appareil avant le remplacement.</p>
          <div className="relay-actions">
            <button className={preview.assessment.verdict === "warning" ? "secondary-button danger" : "primary-button"} disabled={busy} onClick={() => void accept()}>
              {preview.assessment.verdict === "warning" ? "Remplacer quand même" : "Remplacer par ce fichier"}
            </button>
            <button className="secondary-button" disabled={busy} onClick={() => setPreview(undefined)}>Annuler</button>
          </div>
        </article>
      ) : null}

      <article className="settings-card">
        <div className="settings-section">
          <strong>Cet appareil : {status?.device ?? "…"}</strong>
          <span>
            {unsent > 0
              ? `${unsent} changement${unsent > 1 ? "s" : ""} pas encore envoyé${unsent > 1 ? "s" : ""} · dernier envoi ou reprise : ${dateTime(status?.lastCheckpointAt)}`
              : status?.lastCheckpointAt
                ? `À jour avec le dernier relais (${dateTime(status.lastCheckpointAt)}).`
                : "Aucun relais pour l'instant."}
          </span>
        </div>
        <div className="relay-actions">
          <button className="primary-button" disabled={busy} onClick={() => void send()}>Envoyer ma progression</button>
          <button className="secondary-button" disabled={busy} onClick={() => fileInput.current?.click()}>Reprendre un fichier</button>
          <input
            ref={fileInput}
            className="visually-hidden"
            type="file"
            accept=".json,application/json,text/plain"
            aria-label="Choisir un fichier de progression"
            onChange={(event) => void openFile(event.target.files?.[0])}
          />
        </div>
        {legacyText && status?.pristine ? (
          <div className="settings-section legacy-import">
            <strong>Ancienne progression du PC détectée</strong>
            <span>Le fichier <code>data/sd-languages.json</code> de l'ancien serveur peut être repris une fois sur ce navigateur.</span>
            <button className="secondary-button" disabled={busy} onClick={() => void openLegacy()}>Voir et reprendre</button>
          </div>
        ) : null}
      </article>

      <article className="settings-card">
        <div className="settings-section">
          <strong>Sauvegardes de cet appareil</strong>
          <span>Une copie par jour d'activité et une avant chaque remplacement, dix au plus.{status?.persisted === false ? " Le navigateur n'a pas encore garanti la conservation de ce stockage." : ""}</span>
        </div>
        {backups.length === 0 ? <p className="empty-compact">Aucune sauvegarde pour l'instant.</p> : (
          <ul className="backup-list">
            {backups.map((backup) => (
              <li key={backup.id}>
                <span><strong>{dateTime(backup.createdAt)}</strong><small>{backupReasons[backup.reason]} · {backup.summary.totalXp} XP</small></span>
                <button className="text-button" disabled={busy} onClick={() => restore(backup)}>Restaurer</button>
              </li>
            ))}
          </ul>
        )}
      </article>

      <article className="settings-card danger-zone">
        <div className="settings-section">
          <strong>Effacer toutes mes données sur cet appareil</strong>
          <span>Progression, sauvegardes, préférences et fichiers hors ligne de cet appareil. L'autre appareil n'est pas touché.</span>
        </div>
        {eraseStep === 0 ? (
          <button className="secondary-button danger" onClick={() => setEraseStep(1)}>Effacer…</button>
        ) : (
          <div className="erase-confirm">
            <p>Conseil : envoyez d'abord votre progression, elle sera récupérable ensuite.</p>
            <button className="secondary-button" disabled={busy} onClick={() => void send()}>Envoyer d'abord ma progression</button>
            <label>Tapez EFFACER pour confirmer<input value={eraseWord} onChange={(event) => setEraseWord(event.target.value)} autoCapitalize="characters" autoComplete="off" /></label>
            <div className="relay-actions">
              <button className="secondary-button danger" disabled={busy || eraseWord.trim().toUpperCase() !== "EFFACER"} onClick={() => void erase()}>Effacer définitivement</button>
              <button className="secondary-button" onClick={() => { setEraseStep(0); setEraseWord(""); }}>Annuler</button>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
