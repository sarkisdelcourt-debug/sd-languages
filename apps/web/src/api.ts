import type {
  AnswerEvaluation,
  ConversationReply,
  ConversationScenario,
  ConversationThread,
  DailyPlan,
  DashboardSnapshot,
  DiagnosticQuestion,
  DiagnosticResult,
  Exercise,
  ExerciseTopic,
  GuidedLessonView,
  LanguageDefinition,
  LanguageSettings,
  LearningGoal,
  MistakeRecord,
  PronunciationAttemptMode,
  PronunciationAttemptResult,
  PronunciationLabView,
  ReviewCard,
  ReviewRating
} from "@shared/types";
import { engine } from "./local/device";

export type PublicExercise = Omit<Exercise, "answer" | "acceptedAnswers"> & {
  recommendationScore?: number;
  recommendationReason?: string;
};
export interface PracticeTopic {
  topic: ExerciseTopic;
  label: string;
  count: number;
  seen: number;
}
export type PublicDiagnosticQuestion = Omit<DiagnosticQuestion, "answer" | "acceptedAnswers">;
export type PublicConversationScenario = ConversationScenario & {
  recommendationScore?: number;
  recommendationReason?: string;
};

/**
 * Les vues gardent leurs appels « /api/… », mais le moteur s'exécute dans l'appareil : aucune
 * requête réseau, donc la même expérience en ligne, hors ligne ou en mode avion.
 */
async function request<T>(path: string, options?: { method?: string; body?: string }): Promise<T> {
  const response = await engine.handle(options?.method ?? "GET", path, options?.body ? JSON.parse(options.body) : undefined);
  const body = response.body as T | { error?: string };
  if (response.status >= 400) {
    const message = body && typeof body === "object" && "error" in body ? body.error : undefined;
    throw new Error(message ?? "Erreur locale inattendue.");
  }
  return body as T;
}

export const api = {
  languages: () => request<LanguageDefinition[]>("/api/languages"),
  dashboard: () => request<DashboardSnapshot>("/api/dashboard"),
  plan: (language: string) => request<DailyPlan>(`/api/plan/${language}`),
  settings: (language: string) => request<LanguageSettings>(`/api/settings/${language}`),
  updateSettings: (language: string, payload: { goal: LearningGoal; dailyMinutes: number; targetLevel: string; declaredLevel?: string | null }) =>
    request<LanguageSettings>(`/api/settings/${language}`, { method: "PATCH", body: JSON.stringify(payload) }),
  diagnostic: (language: string) => request<PublicDiagnosticQuestion[]>(`/api/diagnostic/${language}`),
  submitDiagnostic: (language: string, answers: Record<string, string>) =>
    request<DiagnosticResult>(`/api/diagnostic/${language}`, { method: "POST", body: JSON.stringify({ answers }) }),
  exercises: (language: string, options: { topic?: ExerciseTopic; exclude?: string[] } = {}) => {
    const query = new URLSearchParams();
    if (options.topic) query.set("topic", options.topic);
    if (options.exclude?.length) query.set("exclude", options.exclude.join(","));
    const suffix = query.toString();
    return request<PublicExercise[]>(`/api/practice/${language}${suffix ? `?${suffix}` : ""}`);
  },
  practiceTopics: (language: string) => request<PracticeTopic[]>(`/api/practice-topics/${language}`),
  submitAnswer: (exerciseId: string, answer: string, attemptId: string) =>
    request<{ evaluation: AnswerEvaluation; duplicate: boolean; dashboard: DashboardSnapshot }>(
      `/api/practice/${exerciseId}/answer`,
      { method: "POST", body: JSON.stringify({ answer, attemptId }) }
    ),
  reviews: (language: string) => request<ReviewCard[]>(`/api/reviews/${language}`),
  review: (cardId: string, rating: ReviewRating) =>
    request<ReviewCard>(`/api/reviews/${cardId}`, { method: "POST", body: JSON.stringify({ rating }) }),
  mistakes: (language: string) => request<MistakeRecord[]>(`/api/mistakes?language=${language}`),
  conversation: (language: string) => request<ConversationThread>(`/api/conversations/${language}`),
  scenarios: (language: string) => request<PublicConversationScenario[]>(`/api/scenarios/${language}`),
  startScenario: (language: string, scenarioId: string) =>
    request<ConversationThread>(`/api/conversations/${language}/scenario`, {
      method: "POST",
      body: JSON.stringify({ scenarioId })
    }),
  sendMessage: (language: string, text: string) =>
    request<ConversationReply>(`/api/conversations/${language}`, { method: "POST", body: JSON.stringify({ text }) }),
  lesson: (language: string, lessonId?: string) => request<GuidedLessonView>(
    `/api/lessons/${language}${lessonId ? `?lessonId=${encodeURIComponent(lessonId)}` : ""}`
  ),
  startLesson: (language: string, lessonId: string) => request<GuidedLessonView>(`/api/lessons/${language}/start`, {
    method: "POST",
    body: JSON.stringify({ lessonId })
  }),
  continueLesson: (language: string) => request<GuidedLessonView>(`/api/lessons/${language}/continue`, { method: "POST" }),
  abandonLesson: (language: string) => request<GuidedLessonView>(`/api/lessons/${language}/abandon`, { method: "POST" }),
  answerLesson: (language: string, answer: string, attemptId: string, sessionId: string, exerciseId: string) =>
    request<{ view: GuidedLessonView; evaluation: AnswerEvaluation; duplicate: boolean }>(`/api/lessons/${language}/answer`, {
      method: "POST",
      body: JSON.stringify({ answer, attemptId, sessionId, exerciseId })
    }),
  messageLesson: (language: string, text: string) =>
    request<{ view: GuidedLessonView; reply: ConversationReply }>(`/api/lessons/${language}/message`, {
      method: "POST",
      body: JSON.stringify({ text })
    }),
  pronunciation: (language: string) => request<PronunciationLabView>(`/api/pronunciation/${language}`),
  assessPronunciation: (promptId: string, transcript: string, mode: PronunciationAttemptMode, attemptId: string) =>
    request<PronunciationAttemptResult>(`/api/pronunciation/${promptId}/attempts`, {
      method: "POST",
      body: JSON.stringify({ transcript, mode, attemptId })
    })
};
