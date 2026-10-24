import { useEffect, useState } from "react";
import { LANGUAGES } from "@shared/catalog";
import type { LanguageCode } from "@shared/types";
import { getSpeechCapabilities, onVoicesChanged, voiceReport, type VoiceReport } from "../lib/browser-speech";

/**
 * Dit quelle voix lit la langue étudiée, et quoi faire quand l'appareil n'en a pas : sans voix de la langue,
 * l'iPhone lit l'anglais ou l'allemand avec sa voix française, ce qui n'a aucun accent.
 */
export function VoiceNotice({ language, onlyMissing = false }: { language: LanguageCode; onlyMissing?: boolean }) {
  const [report, setReport] = useState<VoiceReport>(() => (getSpeechCapabilities().synthesis ? voiceReport(language) : { found: false, enhanced: false }));
  useEffect(() => {
    if (!getSpeechCapabilities().synthesis) return undefined;
    const refresh = () => setReport(voiceReport(language));
    refresh();
    return onVoicesChanged(refresh);
  }, [language]);
  if (!getSpeechCapabilities().synthesis) return null;
  const name = LANGUAGES[language].name.toLowerCase();
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
