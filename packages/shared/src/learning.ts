import type {
  AnswerEvaluation,
  CefrLevel,
  DiagnosticQuestion,
  Exercise,
  PronunciationAssessment,
  PronunciationPrompt,
  ReviewCard,
  ReviewRating
} from "./types.js";

/** Forme canonique (et lisible en révision) d'un exercice d'association : « la casa = la maison · … ». */
export function matchPairsAnswer(pairs: Array<{ target: string; native: string }>): string {
  return pairs.map((pair) => `${pair.target} = ${pair.native}`).join(" · ");
}

/**
 * Tolérances d'écriture communes aux deux normalisations : tiret ou espace (« half-life »),
 * « 3pm » / « 3 p.m. » / « 3 pm », « o clock » / « oclock » / « o'clock ».
 */
function tolerateSpelling(value: string): string {
  return value
    .replace(/[’']/g, "'")
    .replace(/\b([ap])\.m\.?(?=\s|$)/g, "$1m")
    .replace(/[^\p{L}\p{N}'\s-]/gu, "")
    .replace(/-/g, " ")
    .replace(/(\d)\s*([ap]m)\b/g, "$1 $2")
    .replace(/\bo\s*'?\s*clock\b/g, "o'clock")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeAnswer(value: string): string {
  return tolerateSpelling(value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase("fr").replace(/œ/g, "oe").replace(/æ/g, "ae"));
}

function normalizeSurface(value: string): string {
  return tolerateSpelling(value.normalize("NFC").toLocaleLowerCase("fr"));
}

function editDistance(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        (current[rightIndex - 1] ?? 0) + 1,
        (previous[rightIndex] ?? 0) + 1,
        (previous[rightIndex - 1] ?? 0) + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1)
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length] ?? Math.max(left.length, right.length);
}

function pronunciationTokens(value: string): Array<{ surface: string; normalized: string }> {
  return (value.match(/\p{L}+(?:[’'-]\p{L}+)*/gu) ?? []).map((surface) => ({
    surface,
    normalized: normalizeAnswer(surface).replace(/ß/g, "ss")
  }));
}

function alignWords(expected: string[], spoken: string[]): Array<[number, number]> {
  const table = Array.from({ length: expected.length + 1 }, () => Array<number>(spoken.length + 1).fill(0));
  for (let left = 1; left <= expected.length; left += 1) {
    for (let right = 1; right <= spoken.length; right += 1) {
      table[left]![right] = expected[left - 1] === spoken[right - 1]
        ? (table[left - 1]![right - 1] ?? 0) + 1
        : Math.max(table[left - 1]![right] ?? 0, table[left]![right - 1] ?? 0);
    }
  }

  const pairs: Array<[number, number]> = [];
  let left = expected.length;
  let right = spoken.length;
  while (left > 0 && right > 0) {
    if (expected[left - 1] === spoken[right - 1]) {
      pairs.unshift([left - 1, right - 1]);
      left -= 1;
      right -= 1;
    } else if ((table[left - 1]![right] ?? 0) >= (table[left]![right - 1] ?? 0)) {
      left -= 1;
    } else {
      right -= 1;
    }
  }
  return pairs;
}

export function assessPronunciation(prompt: PronunciationPrompt, transcript: string): PronunciationAssessment {
  const expected = pronunciationTokens(prompt.text);
  const spoken = pronunciationTokens(transcript);
  const aligned = alignWords(expected.map((token) => token.normalized), spoken.map((token) => token.normalized));
  const matchedExpected = new Set(aligned.map(([index]) => index));
  const matchedSpoken = new Set(aligned.map(([, index]) => index));
  const keyTokens = new Set(prompt.keyTokens.map((token) => normalizeAnswer(token).replace(/ß/g, "ss")));
  const totalWeight = expected.reduce((sum, token) => sum + (keyTokens.has(token.normalized) ? 2 : 1), 0);
  const matchedWeight = expected.reduce(
    (sum, token, index) => sum + (matchedExpected.has(index) ? (keyTokens.has(token.normalized) ? 2 : 1) : 0),
    0
  );
  const coverage = totalWeight ? Math.round((matchedWeight / totalWeight) * 100) : 0;
  const order = expected.length ? Math.round((aligned.length / expected.length) * 100) : 0;
  const precision = spoken.length ? Math.round((aligned.length / spoken.length) * 100) : 0;
  const missingKeyTokens = prompt.keyTokens.filter((keyToken) => {
    const normalized = normalizeAnswer(keyToken).replace(/ß/g, "ss");
    return !expected.some((token, index) => token.normalized === normalized && matchedExpected.has(index));
  });
  let score = Math.round(coverage * 0.6 + order * 0.25 + precision * 0.15);
  if (missingKeyTokens.length) score = Math.min(score, missingKeyTokens.length === prompt.keyTokens.length ? 49 : 74);
  score = Math.max(0, Math.min(100, score));
  const verdict = score >= 90 ? "clear" : score >= 70 ? "close" : "retry";
  const mastered = score >= 85 && missingKeyTokens.length === 0;
  const feedback = !spoken.length
    ? "Aucune parole n’a été reconnue. Ralentissez, écoutez le modèle, puis recommencez."
    : missingKeyTokens.length
      ? `« ${missingKeyTokens[0]} » n’a pas été reconnu. Isolez ce mot trois fois, puis replacez-le dans la phrase.`
      : score >= 90
        ? `Très intelligible. Recommencez une fois sans lire, en gardant l’accent sur ${prompt.keyTokens.join(" et ")}.`
        : score >= 75
          ? `Le message passe. Retravaillez « ${expected.find((_, index) => !matchedExpected.has(index))?.surface ?? prompt.keyTokens[0]} », puis refaites la phrase entière.`
          : score >= 50
            ? "Les mots principaux sont partiellement reconnus. Découpez la phrase en deux groupes, puis reliez-les."
            : `Ralentissez. Répétez d’abord « ${prompt.keyTokens[0]} », puis reconstruisez la phrase.`;

  return {
    score,
    verdict,
    mastered,
    transcript: transcript.trim(),
    target: prompt.text,
    metrics: { coverage, order, precision },
    matchedWords: expected.filter((_, index) => matchedExpected.has(index)).map((token) => token.surface),
    missedWords: expected.filter((_, index) => !matchedExpected.has(index)).map((token) => token.surface),
    extraWords: spoken.filter((_, index) => !matchedSpoken.has(index)).map((token) => token.surface),
    missingKeyTokens,
    feedback
  };
}

export function evaluateAnswer(exercise: Exercise, submittedAnswer: string): AnswerEvaluation {
  const normalizedAnswer = normalizeAnswer(submittedAnswer);
  const answers = [exercise.answer, ...(exercise.acceptedAnswers ?? [])];
  const accepted = answers.map(normalizeAnswer);
  const acceptedSurface = answers.map(normalizeSurface);
  const matchedIndex = accepted.indexOf(normalizedAnswer);
  const correct = matchedIndex >= 0;
  const exactSurface = correct && acceptedSurface[matchedIndex] === normalizeSurface(submittedAnswer);
  const nearMiss = !correct && normalizedAnswer.length >= 6 && accepted.some((candidate) => editDistance(candidate, normalizedAnswer) === 1);
  const verdict = correct ? (exactSurface ? "exact" : "minor") : "incorrect";
  const issues = verdict === "exact"
    ? []
    : verdict === "minor"
      ? [{ kind: "accent" as const, message: "Le sens est juste, mais vérifiez les accents ou signes propres à la langue." }]
      : exercise.type === "match-pairs"
        ? [{ kind: "formulation" as const, message: "Au moins une paire est inversée : comparez chaque mot avec sa traduction attendue." }]
        : nearMiss
        ? [{ kind: "orthography" as const, message: "La réponse est très proche : relisez l'orthographe caractère par caractère." }]
        : [{ kind: exercise.type === "translation" ? "formulation" as const : "grammar" as const, message: "Comparez la structure de votre réponse avec le modèle proposé." }];

  return {
    correct,
    verdict,
    normalizedAnswer,
    expectedAnswer: exercise.answer,
    explanation: exercise.explanation,
    feedback: verdict === "exact"
      ? "Réponse exacte — l'idée et la forme sont maîtrisées."
      : verdict === "minor"
        ? "Bonne réponse sur le fond — un détail d'écriture mérite votre attention."
        : `À revoir : « ${exercise.answer} ».`,
    issues
  };
}

const LEVEL_ORDER: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1"];

export function estimateLevel(
  questions: DiagnosticQuestion[],
  answers: Record<string, string>
): { score: number; total: number; percentage: number; estimatedLevel: CefrLevel } {
  const total = questions.reduce((sum, question) => sum + question.diagnosticWeight, 0);
  const score = questions.reduce(
    (sum, question) => sum + (evaluateAnswer(question, answers[question.id] ?? "").correct ? question.diagnosticWeight : 0),
    0
  );
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100);
  const index = percentage < 25 ? 0 : percentage < 45 ? 1 : percentage < 65 ? 2 : percentage < 85 ? 3 : 4;

  return { score, total, percentage, estimatedLevel: LEVEL_ORDER[index] ?? "A1" };
}

const LANGUAGE_NAMES: Record<Exercise["language"], string> = { en: "anglais", de: "allemand", es: "espagnol" };

/**
 * Consigne lisible sur une carte (sans audio ni étiquettes) : la phrase française à dire pour une
 * dictée ou une construction, la liste des mots à traduire pour une association.
 */
export function reviewPrompt(exercise: Exercise): string {
  const language = LANGUAGE_NAMES[exercise.language];
  if (exercise.type === "listening") {
    const translation = /^« (.+?) »/u.exec(exercise.explanation)?.[1];
    return translation ? `Dites en ${language} : « ${translation} »` : exercise.prompt;
  }
  if (exercise.type === "word-bank") return exercise.prompt.replace(/^Construisez :/u, `Dites en ${language} :`);
  if (exercise.type === "match-pairs" && exercise.pairs?.length) {
    return `Traduisez en ${language} : ${exercise.pairs.map((pair) => pair.native).join(" · ")}`;
  }
  return exercise.prompt;
}

export function createReviewCard(exercise: Exercise, now: Date = new Date()): ReviewCard {
  return {
    id: `card-${exercise.id}`,
    sourceExerciseId: exercise.id,
    language: exercise.language,
    prompt: reviewPrompt(exercise),
    answer: exercise.answer,
    focus: exercise.focus,
    nextReviewAt: now.toISOString(),
    intervalDays: 0,
    easeFactor: 2.5,
    repetitions: 0,
    lapses: 0
  };
}

export function scheduleReview(card: ReviewCard, rating: ReviewRating, now: Date = new Date()): ReviewCard {
  let intervalDays = card.intervalDays;
  let easeFactor = card.easeFactor;
  let repetitions = card.repetitions;
  let lapses = card.lapses;

  if (rating === "again") {
    intervalDays = 1;
    repetitions = 0;
    lapses += 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = rating === "hard" ? 3 : rating === "easy" ? 6 : 4;
    else {
      const modifier = rating === "hard" ? 0.8 : rating === "easy" ? 1.3 : 1;
      intervalDays = Math.max(1, Math.round(Math.max(card.intervalDays, 1) * easeFactor * modifier));
    }

    if (rating === "hard") easeFactor = Math.max(1.3, easeFactor - 0.15);
    if (rating === "easy") easeFactor += 0.15;
  }

  const next = new Date(now);
  next.setUTCDate(next.getUTCDate() + intervalDays);

  return {
    ...card,
    intervalDays,
    easeFactor: Number(easeFactor.toFixed(2)),
    repetitions,
    lapses,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: next.toISOString()
  };
}

export function isDue(card: ReviewCard, now: Date = new Date()): boolean {
  return new Date(card.nextReviewAt).getTime() <= now.getTime();
}
