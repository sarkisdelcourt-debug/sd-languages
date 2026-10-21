import { useCallback, useEffect, useState } from "react";
import { isLanguageCode, LANGUAGES } from "@shared/catalog";
import type { DashboardSnapshot, LanguageCode } from "@shared/types";
import { api } from "./api";
import { DashboardView } from "./components/DashboardView";
import { DiagnosticView } from "./components/DiagnosticView";
import { GuidedLessonView } from "./components/GuidedLessonView";
import { NavIcon } from "./components/NavIcon";
import { PracticeView } from "./components/PracticeView";
import { ReviewView } from "./components/ReviewView";
import { SettingsView } from "./components/SettingsView";
import { SpeakingView, type SpeakingMode } from "./components/SpeakingView";
import {
  flushOfflineQueue,
  getOfflineSnapshot,
  OFFLINE_STATUS_EVENT,
  prepareOfflineLibrary
} from "./offline";

type View = "home" | "lesson" | "diagnostic" | "practice" | "review" | "conversation" | "settings";

const viewLabels: Record<View, string> = {
  home: "Vue d'ensemble",
  lesson: "Ma leçon",
  diagnostic: "Diagnostic",
  practice: "S'entraîner",
  review: "Réviser",
  conversation: "Parler",
  settings: "Mes objectifs"
};

const navViews = ["home", "lesson", "review", "conversation", "settings"] as const;

interface ConnectionState {
  reachable: boolean;
  syncing: boolean;
  pending: number;
  failed: number;
  justSynced: number;
}

export function App() {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem("sd-language");
    return saved && isLanguageCode(saved) ? saved : "en";
  });
  const [view, setView] = useState<View>("home");
  const [speakingMode, setSpeakingMode] = useState<SpeakingMode>("pronunciation");
  const [dashboard, setDashboard] = useState<DashboardSnapshot>();
  const [error, setError] = useState<string>();
  const [connection, setConnection] = useState<ConnectionState>({
    reachable: navigator.onLine,
    syncing: false,
    pending: 0,
    failed: 0,
    justSynced: 0
  });

  const refreshDashboard = useCallback(() => {
    api.dashboard().then(setDashboard).catch((reason: Error) => setError(reason.message));
  }, []);

  const synchronize = useCallback(async () => {
    setConnection((current) => ({ ...current, syncing: true, justSynced: 0 }));
    const result = await flushOfflineQueue();
    setConnection({
      reachable: result.reachable,
      syncing: false,
      pending: result.pending,
      failed: result.failed,
      justSynced: result.synced
    });
    if (result.reachable) {
      if (result.synced > 0) refreshDashboard();
      void prepareOfflineLibrary();
    }
  }, [refreshDashboard]);

  useEffect(() => {
    refreshDashboard();
    void synchronize();
    const handleConnectivity = () => void synchronize();
    const handleQueueChange = (event: Event) => {
      const detail = (event as CustomEvent<{ reachable?: boolean }>).detail;
      getOfflineSnapshot().then((snapshot) => setConnection((current) => ({
        ...current,
        ...snapshot,
        reachable: detail?.reachable ?? current.reachable,
        justSynced: 0
      })));
    };
    window.addEventListener("online", handleConnectivity);
    window.addEventListener("offline", handleConnectivity);
    window.addEventListener(OFFLINE_STATUS_EVENT, handleQueueChange);
    return () => {
      window.removeEventListener("online", handleConnectivity);
      window.removeEventListener("offline", handleConnectivity);
      window.removeEventListener(OFFLINE_STATUS_EVENT, handleQueueChange);
    };
  }, [refreshDashboard, synchronize]);

  useEffect(() => {
    document.querySelector<HTMLElement>("#view-title")?.focus();
  }, [view]);

  useEffect(() => {
    if (!connection.justSynced) return;
    const timeout = window.setTimeout(() => {
      setConnection((current) => ({ ...current, justSynced: 0 }));
    }, 4_000);
    return () => window.clearTimeout(timeout);
  }, [connection.justSynced]);

  useEffect(() => {
    if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.ready.then(() => prepareOfflineLibrary());
  }, []);

  const chooseLanguage = (next: LanguageCode) => {
    setLanguage(next);
    localStorage.setItem("sd-language", next);
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Aller au contenu principal</a>
      <aside className="sidebar">
        <div className="brand" aria-label="SD Languages">
          <span className="brand-mark">SD</span>
          <span>Languages</span>
        </div>
        <nav aria-label="Navigation principale">
          {navViews.map((item) => (
            <button className={view === item ? "nav-item active" : "nav-item"} onClick={() => setView(item)} key={item}>
              <NavIcon name={item} />
              {viewLabels[item]}
              {item === "review" && dashboard && dashboard.dueReviews[language] > 0 ? (
                <span className="nav-badge">{dashboard.dueReviews[language]}</span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="local-note">
          <span className={connection.reachable ? "status-dot" : "status-dot offline"} />
          {connection.syncing
            ? "Synchronisation…"
            : !connection.reachable
              ? "Mode hors ligne"
              : connection.pending > 0
                ? `${connection.pending} en attente`
                : "Local et synchronisé"}
        </div>
      </aside>

      <main id="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Votre espace d'apprentissage</p>
            <h1 id="view-title" tabIndex={-1}>{viewLabels[view]}</h1>
          </div>
          <div className="language-switcher" aria-label="Langue active">
            {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => (
              <button
                key={code}
                className={language === code ? "language-pill active" : "language-pill"}
                onClick={() => chooseLanguage(code)}
                aria-pressed={language === code}
              >
                <span aria-hidden="true">{code.toUpperCase()}</span>
                {LANGUAGES[code].name}
              </button>
            ))}
          </div>
        </header>

        {(!connection.reachable || connection.pending > 0 || connection.failed > 0 || connection.syncing || connection.justSynced > 0) ? (
          <aside className={`offline-banner${connection.reachable ? "" : " is-offline"}`} aria-live="polite">
            <span className="offline-symbol" aria-hidden="true">{connection.reachable ? "↻" : "↓"}</span>
            <div>
              <strong>
                {connection.syncing
                  ? "Synchronisation en cours"
                  : connection.failed > 0
                    ? `${connection.failed} action${connection.failed > 1 ? "s" : ""} à vérifier`
                    : connection.pending > 0
                      ? `${connection.pending} action${connection.pending > 1 ? "s" : ""} gardée${connection.pending > 1 ? "s" : ""} sur cet appareil`
                      : connection.justSynced > 0
                        ? `${connection.justSynced} action${connection.justSynced > 1 ? "s" : ""} synchronisée${connection.justSynced > 1 ? "s" : ""}`
                        : "Mode hors ligne actif"}
              </strong>
              <span>
                {connection.reachable
                  ? "Votre progression locale est à jour."
                  : "Les contenus déjà préparés restent consultables. Les réponses compatibles partiront au retour du serveur local."}
              </span>
            </div>
            {!connection.syncing && (connection.pending > 0 || !connection.reachable) ? (
              <button type="button" onClick={() => void synchronize()}>Réessayer</button>
            ) : null}
          </aside>
        ) : null}

        {error ? (
          <div className="alert" role="alert">
            {error} <button onClick={() => { setError(undefined); refreshDashboard(); }}>Réessayer</button>
          </div>
        ) : null}

        <section className="content" key={`${view}-${language}`}>
          {view === "home" && dashboard ? (
            <DashboardView dashboard={dashboard} language={language} onNavigate={(nextView, nextSpeakingMode) => {
              if (nextSpeakingMode) setSpeakingMode(nextSpeakingMode);
              setView(nextView);
            }} />
          ) : null}
          {view === "diagnostic" ? <DiagnosticView language={language} onComplete={refreshDashboard} /> : null}
          {view === "lesson" ? <GuidedLessonView language={language} onProgress={refreshDashboard} onHome={() => setView("home")} /> : null}
          {view === "practice" ? <PracticeView language={language} onProgress={refreshDashboard} /> : null}
          {view === "review" ? <ReviewView language={language} onProgress={refreshDashboard} /> : null}
          {view === "conversation" ? <SpeakingView language={language} mode={speakingMode} onModeChange={setSpeakingMode} /> : null}
          {view === "settings" ? <SettingsView language={language} onSaved={refreshDashboard} /> : null}
          {view === "home" && !dashboard ? <div className="loading-card">Chargement de votre progression…</div> : null}
        </section>
      </main>
    </div>
  );
}
