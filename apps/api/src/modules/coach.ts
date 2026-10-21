import type {
  ConversationMessage,
  ConversationReply,
  ConversationScenario,
  LanguageCode
} from "../../../../packages/shared/src/types.js";
import { normalizeAnswer } from "../../../../packages/shared/src/learning.js";

export interface CoachProvider {
  reply(
    language: LanguageCode,
    text: string,
    options?: { now?: Date; scenario?: ConversationScenario; scenarioStepIndex?: number }
  ): ConversationReply;
}

const prompts: Record<LanguageCode, string[]> = {
  en: ["What would you like to do next?", "Can you tell me a little more?", "What makes that important to you?"],
  de: ["Was möchtest du als Nächstes machen?", "Kannst du mir mehr darüber erzählen?", "Warum ist das für dich wichtig?"],
  es: ["¿Qué te gustaría hacer después?", "¿Puedes contarme un poco más?", "¿Por qué es importante para ti?"]
};

const greetings: Record<LanguageCode, string> = {
  en: "Hello! Let's practise naturally. How are you today?",
  de: "Hallo! Lass uns ganz natürlich üben. Wie geht es dir heute?",
  es: "¡Hola! Vamos a practicar de forma natural. ¿Cómo estás hoy?"
};

const retryPrompts: Record<LanguageCode, string> = {
  en: "Try a short answer that fits the situation. You can reuse words from the question.",
  de: "Versuchen Sie eine kurze Antwort, die zur Situation passt. Wörter aus der Frage können helfen.",
  es: "Prueba una respuesta breve que encaje con la situación. Puedes reutilizar palabras de la pregunta."
};

const completionPrompts: Record<LanguageCode, string> = {
  en: "Great work — you completed this scenario. Choose another one when you are ready.",
  de: "Sehr gut — Sie haben dieses Szenario abgeschlossen. Wählen Sie ein neues, wenn Sie bereit sind.",
  es: "Muy bien: has completado este escenario. Elige otro cuando estés listo."
};

function localCorrection(language: LanguageCode, text: string): Pick<ConversationMessage, "correction" | "explanation"> {
  if (language === "en" && /\bi am agree\b/i.test(text)) {
    return { correction: text.replace(/i am agree/gi, "I agree"), explanation: "En anglais, “agree” est un verbe : on dit “I agree”." };
  }
  if (language === "de" && /\bich bin gut\b/i.test(text)) {
    return { correction: text.replace(/ich bin gut/gi, "Mir geht es gut"), explanation: "Pour parler de son état, “Mir geht es gut” est plus naturel." };
  }
  if (language === "es" && /\bsoy\s+(\d+)\s+años\b/i.test(text)) {
    return { correction: text.replace(/soy\s+(\d+)\s+años/gi, "tengo $1 años"), explanation: "En espagnol, l'âge s'exprime avec “tener”." };
  }
  return {};
}

export class LocalCoachProvider implements CoachProvider {
  reply(
    language: LanguageCode,
    text: string,
    options: { now?: Date; scenario?: ConversationScenario; scenarioStepIndex?: number } = {}
  ): ConversationReply {
    const now = options.now ?? new Date();
    const createdAt = now.toISOString();
    const learnerMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      role: "learner",
      text,
      createdAt,
      ...localCorrection(language, text)
    };
    const trimmed = text.trim();
    const greeting = /^(hi|hello|hallo|hola|bonjour)[!.\s]*$/i.test(trimmed);
    const promptIndex = Array.from(trimmed).reduce((sum, character) => sum + (character.codePointAt(0) ?? 0), 0) % prompts[language].length;
    const scenarioStep = options.scenario?.steps[options.scenarioStepIndex ?? 0];
    const normalizedText = normalizeAnswer(trimmed);
    const scenarioMatch = scenarioStep?.keywords.some((keyword) => normalizedText.includes(normalizeAnswer(keyword)));
    const scenarioText = options.scenario
      ? scenarioStep
        ? scenarioMatch
          ? scenarioStep.reply
          : retryPrompts[language]
        : completionPrompts[language]
      : undefined;
    const coachMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      role: "coach",
      text: scenarioText ?? (greeting ? greetings[language] : (prompts[language][promptIndex] ?? prompts[language][0]!)),
      createdAt
    };

    return { learnerMessage, coachMessage, scenarioAdvanced: Boolean(scenarioStep && scenarioMatch) };
  }
}

// Points d'extension volontairement sans fournisseur réseau dans le MVP.
export interface SpeechToTextProvider {
  transcribe(audio: Uint8Array, language: LanguageCode): Promise<string>;
}

export interface TextToSpeechProvider {
  synthesize(text: string, language: LanguageCode): Promise<Uint8Array>;
}
