export type LanguageCode = "en" | "de" | "es";
export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1";
/**
 * Formats d'exercice. Les trois derniers (style Duolingo, 21/10/2026) restent corrigés par la même
 * règle déterministe : la réponse construite est comparée au modèle.
 * - word-bank : construire la phrase en touchant des étiquettes (`tiles`, distracteurs compris) ;
 * - match-pairs : associer chaque mot à sa traduction (`pairs`) ; réponse = `matchPairsAnswer(pairs)` ;
 * - listening : écouter `audioText` (synthèse vocale de l'appareil) puis l'écrire.
 */
export type ExerciseType = "multiple-choice" | "fill-gap" | "translation" | "word-bank" | "match-pairs" | "listening";
export type LearningGoal = "fluency" | "travel" | "work" | "basics";

export interface LanguageDefinition {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  accent: string;
  suggestedGoal: string;
}

export interface Exercise {
  id: string;
  language: LanguageCode;
  level: CefrLevel;
  type: ExerciseType;
  prompt: string;
  choices?: string[];
  tiles?: string[];
  pairs?: Array<{ target: string; native: string }>;
  audioText?: string;
  answer: string;
  acceptedAnswers?: string[];
  explanation: string;
  hint: string;
  focus: string;
}

export interface DiagnosticQuestion extends Exercise {
  diagnosticWeight: number;
}

export interface AnswerEvaluation {
  correct: boolean;
  verdict: "exact" | "minor" | "incorrect";
  normalizedAnswer: string;
  expectedAnswer: string;
  explanation: string;
  feedback: string;
  issues: Array<{
    kind: "accent" | "orthography" | "grammar" | "vocabulary" | "formulation";
    message: string;
  }>;
}

export interface DiagnosticResult {
  language: LanguageCode;
  score: number;
  total: number;
  percentage: number;
  estimatedLevel: CefrLevel;
  completedAt: string;
}

export interface ReviewCard {
  id: string;
  sourceExerciseId: string;
  language: LanguageCode;
  prompt: string;
  answer: string;
  focus: string;
  nextReviewAt: string;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  lapses: number;
  lastReviewedAt?: string;
}

export interface MistakeRecord {
  id: string;
  exerciseId: string;
  language: LanguageCode;
  submittedAnswer: string;
  expectedAnswer: string;
  focus: string;
  occurrenceCount: number;
  resolvedCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  kind?: "accent" | "orthography" | "grammar" | "vocabulary" | "formulation";
}

export type ReviewRating = "again" | "hard" | "good" | "easy";

export interface LanguageProgress {
  language: LanguageCode;
  xp: number;
  completedExercises: number;
  correctAnswers: number;
  currentStreak: number;
  lastPracticeDate?: string;
  diagnostic?: DiagnosticResult;
}

export interface ConversationMessage {
  id: string;
  role: "learner" | "coach";
  text: string;
  createdAt: string;
  correction?: string;
  explanation?: string;
}

export interface ConversationThread {
  language: LanguageCode;
  messages: ConversationMessage[];
  activeScenarioId?: string;
  scenarioStepIndex?: number;
  scenarioCompleted?: boolean;
}

export interface ConversationScenarioStep {
  id: string;
  keywords: string[];
  reply: string;
}

export interface ConversationScenario {
  id: string;
  language: LanguageCode;
  title: string;
  description: string;
  level: CefrLevel;
  openingPrompt: string;
  steps: ConversationScenarioStep[];
}

export type GuidedLessonPhase = "intro" | "practice" | "correction" | "conversation" | "summary";

export interface GuidedLessonDefinition {
  id: string;
  revision: number;
  language: LanguageCode;
  level: CefrLevel;
  sequence: number;
  title: string;
  objective: string;
  focus: string;
  goalAffinity: LearningGoal[];
  prerequisiteLessonId?: string;
  estimatedMinutes: number;
  microCourse: {
    title: string;
    introduction: string;
    points: string[];
    examples: Array<{ target: string; translation: string }>;
  };
  exerciseIds: string[];
  scenarioId: string;
  conversationTurnGoal: number;
}

export interface GuidedLessonAttempt {
  attemptId: string;
  exerciseId: string;
  submittedAnswer: string;
  evaluation: AnswerEvaluation;
  createdAt: string;
}

export interface GuidedLessonSummary {
  exact: number;
  minor: number;
  incorrect: number;
  completedExercises: number;
  conversationSteps: number;
  conversationGoal: number;
  outcome: "mastered" | "needs-review";
}

export interface GuidedLessonProgress {
  lessonId: string;
  completions: number;
  masteryCount: number;
  bestExact: number;
  lastCompletedAt: string;
  lastOutcome: GuidedLessonSummary["outcome"];
}

export type GuidedLessonCatalogStatus = "locked" | "available" | "active" | "completed";

export interface GuidedLessonCatalogItem {
  lesson: GuidedLessonDefinition;
  status: GuidedLessonCatalogStatus;
  completionCount: number;
  masteryCount: number;
  recommended: boolean;
  statusDetail: string;
  lastCompletedAt?: string;
}

export interface GuidedLessonCatalog {
  language: LanguageCode;
  assessedLevel: CefrLevel;
  targetLevel: CefrLevel;
  recommendedLessonId: string;
  recommendationReason: string;
  completedCount: number;
  totalLessons: number;
  items: GuidedLessonCatalogItem[];
}

export interface GuidedLessonSession {
  id: string;
  lessonId: string;
  lessonRevision: number;
  language: LanguageCode;
  status: "active" | "completed";
  phase: GuidedLessonPhase;
  currentExerciseIndex: number;
  attempts: GuidedLessonAttempt[];
  conversation: ConversationThread;
  conversationTurns: number;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  summary?: GuidedLessonSummary;
}

export interface GuidedLessonView {
  lesson: GuidedLessonDefinition;
  catalog: GuidedLessonCatalog;
  session?: GuidedLessonSession;
  currentExercise?: Omit<Exercise, "answer" | "acceptedAnswers">;
}

export interface LearnerState {
  version: 5;
  progress: Record<LanguageCode, LanguageProgress>;
  mistakes: MistakeRecord[];
  reviewCards: ReviewCard[];
  conversations: Record<LanguageCode, ConversationThread>;
  processedAttemptIds: string[];
  settings: Record<LanguageCode, LanguageSettings>;
  lessonSessions: GuidedLessonSession[];
  lessonProgress: Record<string, GuidedLessonProgress>;
  pronunciationAttempts: PronunciationAttempt[];
  pronunciationProgress: Record<string, PronunciationProgress>;
  /** Relais entre appareils (PC ⟷ iPhone). Absent dans les profils antérieurs au mode téléphone. */
  sync?: SyncMeta;
}

/**
 * Chaque envoi ou reprise de fichier crée un « point de relais ». Un fichier peut remplacer sans
 * avertissement l'état d'un appareil seulement s'il descend du dernier point de cet appareil et si
 * celui-ci n'a rien fait depuis.
 */
export interface SyncMeta {
  checkpointId?: string;
  /** Points de relais successifs de cette lignée, du plus ancien au plus récent (bornés). */
  checkpointHistory: string[];
  changesSinceCheckpoint: number;
  lastCheckpointAt?: string;
  lastChangeAt?: string;
}

export interface LanguageSettings {
  language: LanguageCode;
  goal: LearningGoal;
  dailyMinutes: 5 | 10 | 15 | 20;
  targetLevel: CefrLevel;
  onboardingCompleted: boolean;
}

export interface DashboardSnapshot {
  progress: Record<LanguageCode, LanguageProgress>;
  dueReviews: Record<LanguageCode, number>;
  totalCards: number;
}

export type DailyPlanKind = "diagnostic" | "lesson" | "practice" | "review" | "conversation";

export interface DailyPlanItem {
  id: string;
  kind: DailyPlanKind;
  title: string;
  description: string;
  estimatedMinutes: number;
  priority: number;
}

export interface DailyPlan {
  language: LanguageCode;
  generatedAt: string;
  totalMinutes: number;
  goalMinutes: number;
  items: DailyPlanItem[];
}

export interface ConversationReply {
  learnerMessage: ConversationMessage;
  coachMessage: ConversationMessage;
  scenarioAdvanced?: boolean;
}

export type PronunciationAttemptMode = "browser-transcript" | "manual-transcript";
export type PronunciationVerdict = "clear" | "close" | "retry";

export interface PronunciationPrompt {
  id: string;
  language: LanguageCode;
  level: CefrLevel;
  sourceLessonId: string;
  text: string;
  translation: string;
  focus: string;
  keyTokens: string[];
  coachingTip: string;
}

export interface PronunciationAssessment {
  score: number;
  verdict: PronunciationVerdict;
  mastered: boolean;
  transcript: string;
  target: string;
  metrics: {
    coverage: number;
    order: number;
    precision: number;
  };
  matchedWords: string[];
  missedWords: string[];
  extraWords: string[];
  missingKeyTokens: string[];
  feedback: string;
}

export interface PronunciationAttempt {
  attemptId: string;
  promptId: string;
  language: LanguageCode;
  mode: PronunciationAttemptMode;
  score: number;
  verdict: PronunciationVerdict;
  mastered: boolean;
  createdAt: string;
}

export interface PronunciationProgress {
  promptId: string;
  attempts: number;
  bestScore: number;
  lastScore: number;
  masteryCount: number;
  lastPracticedAt: string;
}

export interface PronunciationPromptView extends PronunciationPrompt {
  recommended: boolean;
  progress?: PronunciationProgress;
}

export interface PronunciationLabView {
  language: LanguageCode;
  recommendedPromptId: string;
  recommendationReason: string;
  prompts: PronunciationPromptView[];
  recentAttempts: PronunciationAttempt[];
}

export interface PronunciationAttemptResult {
  attempt: PronunciationAttempt;
  assessment: PronunciationAssessment;
  progress: PronunciationProgress;
  duplicate: boolean;
}

export interface ApiError {
  error: string;
}
