import type { LanguageCode } from "@shared/types";
import { ConversationView } from "./ConversationView";
import { PronunciationLabView } from "./PronunciationLabView";

export type SpeakingMode = "pronunciation" | "conversation";

export function SpeakingView({ language, mode, onModeChange }: {
  language: LanguageCode;
  mode: SpeakingMode;
  onModeChange: (mode: SpeakingMode) => void;
}) {
  return (
    <div className="speaking-space">
      <div className="speaking-tabs" role="tablist" aria-label="Mode d’entraînement oral">
        <button
          role="tab"
          id="pronunciation-tab"
          aria-selected={mode === "pronunciation"}
          aria-controls="pronunciation-panel"
          onClick={() => onModeChange("pronunciation")}
        >
          Prononciation
          <small>Écouter et répéter</small>
        </button>
        <button
          role="tab"
          id="conversation-tab"
          aria-selected={mode === "conversation"}
          aria-controls="conversation-panel"
          onClick={() => onModeChange("conversation")}
        >
          Conversation
          <small>Répondre en situation</small>
        </button>
      </div>
      <div
        id={mode === "pronunciation" ? "pronunciation-panel" : "conversation-panel"}
        role="tabpanel"
        aria-labelledby={mode === "pronunciation" ? "pronunciation-tab" : "conversation-tab"}
      >
        {mode === "pronunciation"
          ? <PronunciationLabView language={language} />
          : <ConversationView language={language} />}
      </div>
    </div>
  );
}
