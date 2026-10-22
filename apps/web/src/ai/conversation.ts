import type {
  CefrLevel, ConversationScenario, ConversationThread, GuidedLessonView, LanguageCode, LanguageSettings, DashboardSnapshot
} from "@shared/types";
import type { AiCoachContext, AiCoachReply } from "@engine/modules/ai-coach";
import { engine } from "../local/device";
import { announceFallback, hasUsableKey, loadAiSettings } from "./settings";

async function read<T>(path: string): Promise<T> {
  const response = await engine.handle("GET", path);
  if (response.status >= 400) throw new Error("Lecture locale impossible.");
  return response.body as T;
}

async function baseContext(language: LanguageCode): Promise<Pick<AiCoachContext, "language" | "level" | "goal">> {
  const [dashboard, settings] = await Promise.all([
    read<DashboardSnapshot>("/api/dashboard"),
    read<LanguageSettings>(`/api/settings/${language}`)
  ]);
  return { language, level: dashboard.levels?.[language] as CefrLevel | undefined, goal: settings.goal };
}

const toTurns = (thread: Pick<ConversationThread, "messages">) => thread.messages.map((message) => ({ role: message.role, text: message.text }));

/**
 * Réponse IA pour la conversation (libre ou scénario) ou pour le dialogue d'une leçon, à joindre au
 * message envoyé au moteur. Renvoie undefined — et prévient l'utilisateur — quand le coach local
 * doit répondre ; aucune erreur ne remonte jusqu'à l'écran.
 */
export async function aiReplyFor(
  mode: "conversation" | "lesson",
  language: LanguageCode,
  learnerText: string
): Promise<AiCoachReply | undefined> {
  try {
    const settings = await loadAiSettings();
    if (!hasUsableKey(settings)) return undefined;
    const base = await baseContext(language);
    let context: AiCoachContext;
    if (mode === "conversation") {
      const [thread, scenarios] = await Promise.all([
        read<ConversationThread>(`/api/conversations/${language}`),
        read<ConversationScenario[]>(`/api/scenarios/${language}`)
      ]);
      const scenario = scenarios.find((candidate) => candidate.id === thread.activeScenarioId);
      context = { ...base, learnerText, history: toTurns(thread), scenario, stepIndex: thread.scenarioStepIndex ?? 0 };
    } else {
      const view = await read<GuidedLessonView>(`/api/lessons/${language}`);
      const session = view.session;
      if (!session) return undefined;
      const scenarios = await read<ConversationScenario[]>(`/api/scenarios/${language}`);
      const scenario = scenarios.find((candidate) => candidate.id === view.lesson.scenarioId);
      context = { ...base, learnerText, history: toTurns(session.conversation), scenario, stepIndex: session.conversation.scenarioStepIndex ?? 0 };
    }
    const { askCoach } = await import("./coach-client");
    const result = await askCoach(context, settings);
    if (result.fallbackReason) announceFallback(result.fallbackReason);
    return result.reply;
  } catch {
    announceFallback("Coach IA indisponible : coach local.");
    return undefined;
  }
}
