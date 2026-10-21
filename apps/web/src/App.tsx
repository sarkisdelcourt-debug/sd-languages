import { useCallback, useEffect, useState } from "react";
import { isLanguageCode, LANGUAGES } from "@shared/catalog";
import type { DashboardSnapshot, LanguageCode } from "@shared/types";
import { api } from "./api";
import { DashboardView } from "./components/DashboardView";
import { DataView } from "./components/DataView";
import { DiagnosticView } from "./components/DiagnosticView";
import { GuidedLessonView } from "./components/GuidedLessonView";
import { NavIcon } from "./components/NavIcon";
import { PracticeView } from "./components/PracticeView";
import { ReviewView } from "./components/ReviewView";
import { SettingsView } from "./components/SettingsView";
import { SpeakingView, type SpeakingMode } from "./components/SpeakingView";
import { getRelayStatus, requestPersistentStorage, store, type RelayStatus } from "./local/device";

type View = "home" | "lesson" | "diagnostic" | "practice" | "review" | "conversation" | "settings" | "data";

const viewLabels: Record<View, string> = {
  home: "Vue d'ensemble",
  lesson: "Ma leçon",
  diagnostic: "Diagnostic",
  practice: "S'entraîner",
  review: "Réviser",
  conversation: "Parler",
  settings: "Mes objectifs",
  data: "Mes données"
};

const navViews = ["home", "lesson", "review", "conversation", "settings", "data"] as const;

function readSavedLanguage(): LanguageCode {
  try {
    const saved = localStorage.getItem("sd-language");
    return saved && isLanguageCode(saved) ? saved : "en";
  } catch {
    return "en";
  }
}

export function App() {
  const [language, setLanguage] = useState<LanguageCode>(readSavedLanguage);
  const [view, setView] = useState<View>("home");
  const [speakingMode, setSpeakingMode] = useState<SpeakingMode>("pronunciation");
  const [dashboard, setDashboard] = useState<DashboardSnapshot>();
  const [relay, setRelay] = useState<RelayStatus>();
  const [externalChange, setExternalChange] = useState(false);
  const [error, setError] = useState<string>();

  const refreshDashboard = useCallback(() => {
    api.dashboard().then(setDashboard).catch((reason: Error) => setError(reason.message));
    getRelayStatus().then(setRelay).catch(() => undefined);
  }, []);

  useEffect(() => {
    refreshDashboard();
    void requestPersistentStorage();
    return store.onExternalChange(() => {
      setExternalChange(true);
      refreshDashboard();
    });
  }, [refreshDashboard]);

  useEffect(() => {
    document.querySelector<HTMLElement>("#view-title")?.focus();
  }, [view]);

  const chooseLanguage = (next: LanguageCode) => {
    setLanguage(next);
    try {
      localStorage.setItem("sd-language", next);
    } catch {
      // Préférence de confort seulement.
    }
  };

  const unsent = relay?.changesSinceCheckpoint ?? 0;

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
            <button className={view === item ? "nav-item active" : "nav-item"} onClick={() => setView(item)} key={item} aria-current={view === item ? "page" : undefined}>
              <NavIcon name={item} />
              {viewLabels[item]}
              {item === "review" && dashboard && dashboard.dueReviews[language] > 0 ? (
                <span className="nav-badge">{dashboard.dueReviews[language]}</span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="local-note">
          <span className="status-dot" />
          {unsent > 0 ? `${unsent} changement${unsent > 1 ? "s" : ""} à envoyer` : `Sur cet appareil${relay ? ` · ${relay.device}` : ""}`}
        </div>
      </aside>

      <main id="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Votre espace d'apprentissage</p>
            <h1 id="view-title" tabIndex={-1}>{viewLabels[view]}</h1>
          </div>
          {view !== "data" ? (
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
          ) : null}
        </header>

        {externalChange ? (
          <aside className="offline-banner" aria-live="polite">
            <span className="offline-symbol" aria-hidden="true">↻</span>
            <div>
              <strong>Progression modifiée dans un autre onglet</strong>
              <span>Rechargez pour afficher la version la plus récente de cet écran.</span>
            </div>
            <button type="button" onClick={() => window.location.reload()}>Recharger</button>
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
          {view === "data" ? <DataView onChanged={refreshDashboard} /> : null}
          {view === "home" && !dashboard ? <div className="loading-card">Chargement de votre progression…</div> : null}
        </section>
      </main>
    </div>
  );
}
