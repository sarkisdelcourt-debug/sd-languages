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
import { OfflineQueuedError, queueMutation, reportCachedRead } from "./offline";

export type PublicExercise = Omit<Exercise, "answer" | "acceptedAnswers"> & {
  recommendationScore?: number;
  recommendationReason?: string;
};
export type PublicDiagnosticQuestion = Omit<DiagnosticQuestion, "answer" | "acceptedAnswers">;
export type PublicConversationScenario = ConversationScenario & {
  recommendationScore?: number;
  recommendationReason?: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) }
    });
  } catch (reason) {
    if (options && await queueMutation(path, options)) throw new OfflineQueuedError();
    throw reason instanceof Error ? reason : new Error("Le serveur local est indisponible.");
  }
  if (response.headers.get("X-SD-Data-Source")) reportCachedRead();
  const body = (await response.json()) as T | { error: string };
  if (!response.ok) throw new Error("error" in (body as object) ? (body as { error: string }).error : "Erreur de communication.");
  return body as T;
}

export const api = {
  languages: () => request<LanguageDefinition[]>("/api/languages"),
  dashboard: () => request<DashboardSnapshot>("/api/dashboard"),
  plan: (language: string) => request<DailyPlan>(`/api/plan/${language}`),
  settings: (language: string) => request<LanguageSettings>(`/api/settings/${language}`),
  updateSettings: (language: string, payload: { goal: LearningGoal; dailyMinutes: number; targetLevel: string }) =>
    request<LanguageSettings>(`/api/settings/${language}`, { method: "PATCH", body: JSON.stringify(payload) }),
  diagnostic: (language: string) => request<PublicDiagnosticQuestion[]>(`/api/diagnostic/${language}`),
  submitDiagnostic: (language: string, answers: Record<string, string>) =>
    request<DiagnosticResult>(`/api/diagnostic/${language}`, { method: "POST", body: JSON.stringify({ answers }) }),
  exercises: (language: string) => request<PublicExercise[]>(`/api/practice/${language}`),
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
