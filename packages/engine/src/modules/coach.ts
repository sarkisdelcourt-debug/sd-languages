import type {
  ConversationMessage,
  ConversationReply,
  ConversationScenario,
  LanguageCode
} from "../../../shared/src/types.js";
import { normalizeAnswer } from "../../../shared/src/learning.js";
import { checkText } from "./language-checker.js";

export interface CoachProvider {
  reply(
    language: LanguageCode,
    text: string,
    options?: { now?: Date; scenario?: ConversationScenario; scenarioStepIndex?: number }
  ): ConversationReply;
}

/**
 * Coach local (22/10/2026, sans IA par décision de Sarkis) : déterministe et hors ligne, mais
 * conversationnel — il accuse réception, relance une réponse trop courte, reformule la question
 * avec un indice quand on sort du sujet, suit le thème abordé en conversation libre, et corrige
 * les erreurs typiques par règles (language-checker.ts), explication comprise.
 */
interface CoachPhrases {
  greeting: string;
  prompts: string[];
  acknowledgements: string[];
  shortAnswer: string;
  offTopic: string[];
  hint: (words: string[]) => string;
  completion: string;
  questionBack: string;
}

export const COACH_PHRASES: Record<LanguageCode, CoachPhrases> = {
  en: {
    greeting: "Hello! Let's practise naturally. How are you today?",
    prompts: ["What would you like to talk about today?", "Can you tell me a little more about that?", "Why is that important to you?", "How did that make you feel?"],
    acknowledgements: ["Thanks, that's clear.", "I see.", "Right, thanks for explaining.", "OK, got it.", "That makes sense."],
    shortAnswer: "Could you answer with a full sentence? It's the best way to practise.",
    offTopic: ["Let's stay with the situation.", "Let's come back to the question.", "Interesting, but let's focus on the situation."],
    hint: (words) => `For example, you could use “${words.join("” or “")}”.`,
    completion: "Great work — you completed this scenario. Choose another one when you are ready.",
    questionBack: "Good question! First, let me hear your answer:"
  },
  de: {
    greeting: "Hallo! Lass uns ganz natürlich üben. Wie geht es dir heute?",
    prompts: ["Was möchtest du als Nächstes machen?", "Kannst du mir mehr darüber erzählen?", "Warum ist das für dich wichtig?"],
    acknowledgements: ["Danke, das ist klar.", "Verstehe.", "Gut, danke für die Erklärung."],
    shortAnswer: "Kannst du mit einem ganzen Satz antworten? So übst du am besten.",
    offTopic: ["Bleiben wir bei der Situation.", "Kommen wir zur Frage zurück."],
    hint: (words) => `Zum Beispiel mit „${words.join("“ oder „")}“.`,
    completion: "Sehr gut — du hast dieses Szenario abgeschlossen. Wähl ein neues, wenn du bereit bist.",
    questionBack: "Gute Frage! Aber zuerst deine Antwort:"
  },
  es: {
    greeting: "¡Hola! Vamos a practicar de forma natural. ¿Cómo estás hoy?",
    prompts: ["¿Qué te gustaría hacer después?", "¿Puedes contarme un poco más?", "¿Por qué es importante para ti?"],
    acknowledgements: ["Gracias, está claro.", "Entiendo.", "Muy bien, gracias por explicarlo."],
    shortAnswer: "¿Puedes responder con una frase completa? Es la mejor forma de practicar.",
    offTopic: ["Volvamos a la situación.", "Volvamos a la pregunta."],
    hint: (words) => `Por ejemplo, puedes usar «${words.join("» o «")}».`,
    completion: "Muy bien: has completado este escenario. Elige otro cuando estés listo.",
    questionBack: "¡Buena pregunta! Pero primero, tu respuesta:"
  }
};

/** Conversation libre en anglais : le coach suit le thème que l'apprenant aborde. */
const ENGLISH_TOPICS: Array<{ pattern: RegExp; questions: string[] }> = [
  { pattern: /\b(work|job|hospital|patients?|colleagues?|office|meeting|department|scan|clinic)\b/i, questions: ["What do you enjoy most about your work?", "What is the most challenging part of your job at the moment?", "How do you usually organise your working day?"] },
  { pattern: /\b(travel|trip|holidays?|vacation|flight|hotel|abroad|visit(ed)?)\b/i, questions: ["Where would you like to go next, and why?", "What was the best trip you have ever taken?", "Do you prefer planning everything or improvising when you travel?"] },
  { pattern: /\b(family|wife|husband|children|kids|son|daughter|parents|brother|sister)\b/i, questions: ["What do you like doing together?", "How do you usually spend time with them at the weekend?"] },
  { pattern: /\b(music|guitar|piano|sport|running|tennis|cycling|reading|books?|films?|movies?|series)\b/i, questions: ["How did you get into that?", "How often do you find time for it?", "What would you recommend to a beginner?"] },
  { pattern: /\b(food|cook(ing)?|restaurant|dinner|lunch|wine|coffee)\b/i, questions: ["What's your favourite dish, and where do you eat it?", "Do you cook often, or do you prefer eating out?"] },
  { pattern: /\b(weekend|saturday|sunday|evening|tonight)\b/i, questions: ["What are your plans, then?", "What did you do last weekend?"] },
  { pattern: /\b(tired|stressed|busy|exhausted|happy|great|fine|good)\b/i, questions: ["What made your day like that?", "What helps you relax after a long day?"] }
];

/** Mots d'acquiescement : si la réplique du scénario commence déjà ainsi, on n'en ajoute pas. */
const STARTS_WITH_ACK = /^(good|great|perfect|agreed|i understand|i see|sure|of course|thanks|thank you|right|ok|okay|fine|excellent|sehr gut|gut|verstehe|danke|muy bien|perfecto|gracias|claro|entiendo|vale)\b/i;

function pick<T>(items: T[], seed: string): T {
  const hash = Array.from(seed).reduce((sum, character) => (sum * 31 + (character.codePointAt(0) ?? 0)) >>> 0, 7);
  return items[hash % items.length]!;
}

const wordCount = (text: string) => text.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;

export class LocalCoachProvider implements CoachProvider {
  reply(
    language: LanguageCode,
    text: string,
    options: { now?: Date; scenario?: ConversationScenario; scenarioStepIndex?: number } = {}
  ): ConversationReply {
    const now = options.now ?? new Date();
    const createdAt = now.toISOString();
    const phrases = COACH_PHRASES[language];
    const trimmed = text.trim();
    const check = checkText(language, trimmed);
    const learnerMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      role: "learner",
      text,
      createdAt,
      ...(check.findings.length
        ? { correction: check.corrected, explanation: check.findings.map((finding) => finding.explanation).join("\n") }
        : {})
    };

    const words = wordCount(trimmed);
    const asksQuestion = trimmed.endsWith("?");
    const scenario = options.scenario;
    const stepIndex = options.scenarioStepIndex ?? 0;
    const scenarioStep = scenario?.steps[stepIndex];
    // On cherche les mots attendus dans la réponse ET dans sa version corrigée (« have finish » → « finished »).
    const searchable = `${normalizeAnswer(trimmed)} ${normalizeAnswer(check.corrected)}`;
    const scenarioMatch = Boolean(scenarioStep?.keywords.some((keyword) => searchable.includes(normalizeAnswer(keyword))));

    let coachText: string;
    if (scenario && !scenarioStep) {
      coachText = phrases.completion;
    } else if (scenario && scenarioStep) {
      const question = stepIndex === 0 ? scenario.openingPrompt : scenario.steps[stepIndex - 1]!.reply;
      const hint = phrases.hint(scenarioStep.keywords.slice(0, 2));
      if (scenarioMatch) {
        coachText = STARTS_WITH_ACK.test(scenarioStep.reply) ? scenarioStep.reply : `${pick(phrases.acknowledgements, trimmed)} ${scenarioStep.reply}`;
      } else if (asksQuestion) {
        coachText = `${phrases.questionBack} ${question}`;
      } else if (words < 3) {
        coachText = `${phrases.shortAnswer} ${hint} ${question}`;
      } else {
        coachText = `${pick(phrases.offTopic, trimmed)} ${hint} ${question}`;
      }
    } else if (/^(hi|hello|hey|hallo|hola|bonjour)[!.\s]*$/i.test(trimmed)) {
      coachText = phrases.greeting;
    } else if (words < 3) {
      coachText = phrases.shortAnswer;
    } else {
      const topic = language === "en" ? ENGLISH_TOPICS.find((candidate) => candidate.pattern.test(trimmed)) : undefined;
      const mentioned = topic ? trimmed.match(topic.pattern)?.[0] : undefined;
      coachText = topic && mentioned
        ? `${pick(phrases.acknowledgements, trimmed)} You mentioned “${mentioned.toLowerCase()}”. ${pick(topic.questions, trimmed)}`
        : pick(phrases.prompts, trimmed);
    }

    const coachMessage: ConversationMessage = { id: crypto.randomUUID(), role: "coach", text: coachText, createdAt };
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
