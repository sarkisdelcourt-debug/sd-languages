import { useEffect, useState } from "react";
import { LANGUAGES } from "@shared/catalog";
import type { LanguageCode } from "@shared/types";
import { getSpeechCapabilities, onVoicesChanged, voiceReport, type VoiceReport } from "../lib/browser-speech";
import { clipCount, clipVoiceName, downloadLanguageClips, onClipManifestLoaded } from "../lib/voice-clips";

/**
 * Dit quelle voix lit la langue étudiée. Les voix intégrées (enregistrements Piper) passent en premier ; à défaut, la voix de
 * l'appareil : sans voix de la langue, l'iPhone lit l'anglais ou l'allemand avec sa voix française, sans aucun accent.
 */
export function VoiceNotice({ language, onlyMissing = false }: { language: LanguageCode; onlyMissing?: boolean }) {
  const [report, setReport] = useState<VoiceReport>(() => (getSpeechCapabilities().synthesis ? voiceReport(language) : { found: false, enhanced: false }));
  const [clipVoice, setClipVoice] = useState<string | undefined>(() => clipVoiceName(language));
  const [progress, setProgress] = useState<{ done: number; total: number } | undefined>();
  const [downloaded, setDownloaded] = useState(false);
  useEffect(() => {
    setClipVoice(clipVoiceName(language));
    setDownloaded(false);
    setProgress(undefined);
    const stopClips = onClipManifestLoaded(() => setClipVoice(clipVoiceName(language)));
    if (!getSpeechCapabilities().synthesis) return stopClips;
    const refresh = () => setReport(voiceReport(language));
    refresh();
    const stopVoices = onVoicesChanged(refresh);
    return () => { stopClips(); stopVoices(); };
  }, [language]);
  const name = LANGUAGES[language].name.toLowerCase();

  if (clipVoice) {
    if (onlyMissing) return null;
    const busy = progress !== undefined && !downloaded;
    return (
      <div className="voice-notice ok" role="status">
        Voix intégrée à l'application : {clipVoice}. Un mot sans enregistrement est lu par la voix de l'appareil.
        <div className="voice-download">
          <button className="text-button" disabled={busy} onClick={() => {
            setProgress({ done: 0, total: 1 });
            void downloadLanguageClips(language, (done, total) => setProgress({ done, total })).then(() => setDownloaded(true)).catch(() => setProgress(undefined));
          }}>
            {busy ? `Téléchargement… ${progress!.done}/${progress!.total}` : downloaded ? "✓ Voix téléchargées pour l'écoute hors ligne" : `Télécharger les voix ${name} (${clipCount(language)} enregistrements) pour l'écoute hors ligne`}
          </button>
        </div>
      </div>
    );
  }

  if (!getSpeechCapabilities().synthesis) return null;
  if (!report.found) {
    return (
      <div className="voice-notice warn" role="status">
        <strong>Aucune voix {name} sur cet appareil.</strong> L'écoute utilise alors une autre voix, d'où un accent faux.
        <br />iPhone : Réglages › Accessibilité › Contenu énoncé › Voix › {LANGUAGES[language].name}, puis téléchargez une voix « Améliorée » ou « Premium ». Revenez ensuite dans l'application.
      </div>
    );
  }
  if (onlyMissing) return null;
  if (!report.enhanced) {
    return (
      <div className="voice-notice" role="status">
        Voix utilisée : {report.name} ({report.locale}). Pour un accent plus naturel, téléchargez une voix « Améliorée » ou « Premium » :
        iPhone, Réglages › Accessibilité › Contenu énoncé › Voix › {LANGUAGES[language].name}.
      </div>
    );
  }
  return <div className="voice-notice ok" role="status">Voix utilisée : {report.name} ({report.locale}).</div>;
}
