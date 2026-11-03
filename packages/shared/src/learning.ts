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
export interface MatchPairsMistake {
  target: string;
  /** Ce que l'apprenant a associé (absent s'il n'a rien associé à ce mot). */
  given?: string;
  expected: string;
}

/** Les paires fausses d'une réponse « a = b · c = d », pour un retour ciblé (audit du 24/10/2026). */
export function matchPairsMistakes(submitted: string, expected: string): MatchPairsMistake[] {
  const parse = (text: string) => text.split(" · ").map((part) => {
    const [target, ...rest] = part.split(" = ");
    return { target: (target ?? "").trim(), native: rest.join(" = ").trim() };
  }).filter((pair) => pair.target);
  const given = new Map(parse(submitted).map((pair) => [pair.target, pair.native]));
  return parse(expected)
    .filter((pair) => given.get(pair.target) !== pair.native)
    .map((pair) => ({ target: pair.target, ...(given.get(pair.target) ? { given: given.get(pair.target) } : {}), expected: pair.native }));
}

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
    // Heures : 3:00, 8h30 et 15h s'écrivent aussi « 3 00 », « 8 30 » et « 15 » (le « : » et le « h » ne sont pas des mots).
    .replace(/(\d)\s*[:h.](?=\d{2}|[\s.,;:!?]|$)/gi, "$1 ")
    // Les signes monétaires sont lus comme des mots (« 200 € » = « 200 euros ») avant le filtrage de la ponctuation.
    .replace(/€/g, " euros ").replace(/£/g, " pounds ")
    .replace(/\b([ap])\.m\.?(?=\s|$)/g, "$1m")
    .replace(/[^\p{L}\p{N}'\s-]/gu, "")
    .replace(/-/g, " ")
    .replace(/(\d)\s*([ap]m)\b/g, "$1 $2")
    .replace(/\bo\s*'?\s*clock\b/g, "o'clock")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeAnswer(value: string): string {
  // Tréma allemand : ä ö ü s'écrivent ae oe ue sans la touche (convention standard) ; « wurde » n'est PAS « würde » (prétérit ≠ Konjunktiv II).
  // Les autres accents (é, è, ñ, ç…) restent ignorés : c'est un détail d'écriture, signalé en « minor ».
  const folded = value.normalize("NFC").toLocaleLowerCase("fr")
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/œ/g, "oe").replace(/æ/g, "ae");
  return tolerateSpelling(folded.normalize("NFD").replace(/[̀-ͯ]/g, ""));
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

/** Vrai quand la réponse fait passer tous les concepts (un mot de chaque groupe ; « * » final = début de mot ; une faute de frappe tolérée sur les mots de 5 lettres ou plus). */
export function conceptsCovered(normalizedAnswer: string, concepts: string[][]): boolean {
  // L'apostrophe sépare les mots (l'addition = l + addition) : un concept « addition » est reconnu dans « l'addition ».
  const flatten = (text: string) => text.replace(/'/g, " ").replace(/\s+/g, " ").trim();
  const flat = flatten(normalizedAnswer);
  const tokens = flat.split(" ").filter(Boolean);
  const padded = ` ${flat} `;
  return concepts.length > 0 && concepts.every((group) => group.some((raw) => {
    const prefix = raw.endsWith("*");
    const alt = flatten(normalizeAnswer(prefix ? raw.slice(0, -1) : raw));
    if (!alt) return false;
    if (prefix ? padded.includes(` ${alt}`) : padded.includes(` ${alt} `)) return true;
    // Une faute de frappe n'est tolérée que sur un mot de 8 lettres ou plus qui garde sa première lettre, et jamais quand seule la
    // voyelle finale change. En dessous, deux mots différents se confondent (cuenta/cuesta, cansado/casado, manzana/mañana,
    // where/here, train/rain) : la liste des formes acceptées utilise alors « * » pour les terminaisons (repet* pour repetez).
    const genderSwap = (token: string) => token.slice(0, -1) === alt.slice(0, -1) && /[aoe]$/.test(token) && /[aoe]$/.test(alt);
    return !alt.includes(" ") && alt.length >= 8 && tokens.some((token) => token.length >= 7 && token[0] === alt[0] && !genderSwap(token) && editDistance(token, alt) <= 1);
  }));
}

/** Négation (français, anglais, allemand, espagnol) : un contresens ne doit pas passer pour « compris ». */
const NEGATION = /(?:^| )(?:not|no|never|nobody|nothing|cannot|nicht|kein|keine|keinen|keinem|keiner|nie|niemals|nichts|niemand|nunca|nadie|nada|tampoco|pas|jamais|aucun|aucune|rien|personne|ne|sin|ohne|sans|without)(?: |$)|n't(?: |$)|(?:^| )(?:isn|aren|wasn|weren|don|doesn|didn|can|couldn|won|wouldn|shouldn|hasn|haven|hadn|mustn|needn)t(?: |$)/;
// L'apostrophe est conservée pour reconnaître « isn't » : la retirer d'abord rendait « n't » invisible.
const hasNegation = (normalized: string) => NEGATION.test(normalized.replace(/\s+/g, " ").trim());

/**
 * Polarité (audit du 26/10/2026, suite du 03/11/2026 avec relecture indépendante) : une phrase « comprise » doit dire la même
 * chose qu'une formulation prévue.
 * - Même polarité qu'une formulation prévue (négative ou affirmative) : obligatoire.
 * - Polarité d'une formulation secondaire (« is broken » quand la principale est « isn't working ») : chaque concept doit être
 *   porté par un mot que cette formulation emploie aussi (après canonisation can't → cannot, 'm → am), sinon « is working »
 *   passerait pour « is broken ».
 * - Phrase négative : on ancre la négation (le même mot négatif si possible : « pas » ↔ « pas », sinon le premier), on repère
 *   dans la formulation le concept nié (le plus proche de la négation, dans la même proposition — la ponctuation sépare les
 *   propositions), et on exige qu'il soit du même côté de la négation et dans la même proposition de la réponse :
 *   « I understand, don't worry » ≠ « I don't understand » ; « Je comprends pas » = « Je ne comprends pas ».
 * Limites connues : « ne … plus » sans « ne » (« Je trouve plus mon fils ») est refusé ; une formulation secondaire dont aucune
 * clé ne porte la polarité (« persiste » pour « ne baisse pas ») laisse encore passer son contraire.
 */
function atomsOf(normalized: string): Array<{ atom: string; word: number }> {
  return normalized.split(" ").filter(Boolean).flatMap((token, word) => token.split("'").filter(Boolean).map((atom) => ({ atom, word })));
}

/** Indice du premier mot négatif d'une phrase normalisée (-1 s'il n'y en a pas). */
function negationIndex(normalized: string): number {
  return normalized.split(" ").filter(Boolean).findIndex((token) => NEGATION.test(` ${token} `));
}

type Span = { start: number; end: number };
function conceptSpans(atoms: Array<{ atom: string; word: number }>, raw: string): Span[] {
  const prefix = raw.endsWith("*");
  const parts = normalizeAnswer(prefix ? raw.slice(0, -1) : raw).replace(/'/g, " ").split(" ").filter(Boolean);
  if (!parts.length) return [];
  const spans: Span[] = [];
  for (let start = 0; start + parts.length <= atoms.length; start += 1) {
    const matches = parts.every((part, offset) => {
      const atom = atoms[start + offset]!.atom;
      return offset === parts.length - 1 && prefix ? atom.startsWith(part) : atom === part;
    });
    if (matches) spans.push({ start: atoms[start]!.word, end: atoms[start + parts.length - 1]!.word });
  }
  return spans;
}
/** Proposition (clause) de chaque mot normalisé : la ponctuation de la saisie brute sépare les propositions. */
function clauseIds(raw: string, normalized: string): number[] {
  const count = normalized.split(" ").filter(Boolean).length;
  const ids: number[] = [];
  raw.split(/[,;!?¿¡—–]+|[.:](?=\s|$)|\s-\s/).forEach((piece, index) => {
    for (const _ of normalizeAnswer(piece).split(" ").filter(Boolean)) ids.push(index);
  });
  return ids.length === count ? ids : Array.from({ length: count }, () => 0);
}
const canon = (alt: string) => normalizeAnswer(alt).replace(/\bcan't\b/g, "cannot").replace(/n't\b/g, " not").replace(/'m\b/g, " am").replace(/'s\b/g, " is").replace(/\s+/g, " ");
function polarityConsistent(rawAnswer: string, normalizedAnswer: string, rawList: string[], acceptedList: string[], concepts: string[][]): boolean {
  const negative = hasNegation(normalizedAnswer);
  const sameSide = acceptedList.map((c, i) => ({ c, raw: rawList[i] ?? c })).filter(({ c }) => hasNegation(c) === negative);
  if (!sameSide.length) return false;
  const mainNegative = hasNegation(acceptedList[0] ?? "");
  const answerAtoms = atomsOf(normalizedAnswer);
  const answerTokens = normalizedAnswer.split(" ").filter(Boolean);
  const answerClauses = clauseIds(rawAnswer, normalizedAnswer);
  const anchorA = negationIndex(normalizedAnswer);
  const lexeme = answerTokens[anchorA];
  const matchedCanon = (atoms: Array<{ atom: string; word: number }>, group: string[]) => group.filter((raw) => conceptSpans(atoms, raw).length > 0).map(canon);
  return sameSide.some(({ c: candidate, raw }) => {
    const candidateAtoms = atomsOf(candidate);
    if (hasNegation(candidate) !== mainNegative) {
      const ok = concepts.every((group) => {
        const inC = matchedCanon(candidateAtoms, group);
        return !inC.length || matchedCanon(answerAtoms, group).some((w) => inC.includes(w));
      });
      if (!ok) return false;
    }
    if (!negative || anchorA < 0) return true;
    const candTokens = candidate.split(" ").filter(Boolean);
    const sameLex = lexeme ? candTokens.indexOf(lexeme) : -1;
    const anchorC = sameLex >= 0 ? sameLex : negationIndex(candidate);
    if (anchorC < 0) return true;
    const candClauses = clauseIds(raw, candidate);
    const side = (s: Span, a: number) => (s.start <= a && s.end >= a ? 0 : s.start > a ? 1 : -1);
    // Une négation seule (« pas », « ne », « no ») n'est jamais « le concept nié » : elle porte la négation, elle ne la subit pas.
    const pure = (s: Span, a: number, tokens: string[]) => s.start === s.end && (s.start === a || NEGATION.test(` ${tokens[s.start] ?? ""} `));
    // Concept nié : le plus proche de la négation, dans la même proposition de la formulation, hors négation seule.
    let best: { index: number; side: number; distance: number } | undefined;
    concepts.forEach((group, index) => {
      for (const s of group.flatMap((r) => conceptSpans(candidateAtoms, r))) {
        if (pure(s, anchorC, candTokens) || candClauses[s.start] !== candClauses[anchorC]) continue;
        const sd = side(s, anchorC);
        const distance = sd === 0 ? 0 : sd > 0 ? s.start - anchorC : anchorC - s.end;
        if (!best || distance < best.distance || (distance === best.distance && sd > best.side)) best = { index, side: sd, distance };
      }
    });
    if (!best) return true;
    const target = best;
    return concepts[target.index]!.flatMap((r) => conceptSpans(answerAtoms, r))
      .some((s) => !pure(s, anchorA, answerTokens) && side(s, anchorA) === target.side && answerClauses[s.start] === answerClauses[anchorA]);
  });
}

/**
 * Mots qui s'excluent : gauche/droite, jours, mois… Une réponse qui contient un de ces mots absent de toutes les formulations
 * prévues, alors qu'une formulation en contient un autre du même groupe, dit autre chose (lundi ≠ mardi, links ≠ geradeaus).
 */
const EXCLUSIVE_GROUPS: string[][] = [
  ["left", "right", "straight", "links", "rechts", "geradeaus", "izquierda", "derecha", "recto", "derecho", "gauche", "droite", "droit"],
  ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "montag", "dienstag", "mittwoch", "donnerstag", "freitag", "samstag", "sonntag", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"],
  ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december", "januar", "februar", "marz", "juni", "juli", "oktober", "dezember", "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", "janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "decembre"],
  ["to", "from", "nach", "von", "aus", "hacia", "desde"],
  ["con", "sin", "with", "without", "mit", "ohne", "avec", "sans"],
  ["before", "after", "vor", "nach", "antes", "despues", "avant", "apres"],
  ["open", "closed", "offen", "geschlossen", "abierto", "cerrado", "ouvert", "ferme"]
];
const exclusiveMismatch = (normalizedAnswer: string, acceptedList: string[]): boolean => {
  const words = (text: string) => new Set(text.replace(/'/g, " ").split(" ").filter(Boolean));
  const ordered = (text: string, group: string[]) => text.replace(/'/g, " ").split(" ").filter((word) => group.includes(word));
  const answerWords = words(normalizedAnswer);
  const acceptedWords = acceptedList.map(words);
  return EXCLUSIVE_GROUPS.some((group, index) => {
    // Jours, mois, directions : plusieurs dans la réponse → même ordre que dans une formulation prévue (lundi puis mardi ≠ mardi puis lundi).
    if (index < 3) {
      const inOrder = ordered(normalizedAnswer, group);
      if (inOrder.length >= 2 && !acceptedList.some((candidate) => ordered(candidate, group).join(" ") === inOrder.join(" "))) return true;
    }
    const inAnswer = group.filter((word) => answerWords.has(word));
    if (!inAnswer.length) return false;
    // Un mot du groupe que NI l'une NI l'autre des formulations prévues ne contient, alors qu'elles en contiennent un autre du groupe.
    const known = new Set(acceptedWords.flatMap((set) => group.filter((word) => set.has(word))));
    return known.size > 0 && inAnswer.some((word) => !known.has(word));
  });
};

export function evaluateAnswer(exercise: Exercise, submittedAnswer: string): AnswerEvaluation {
  const normalizedAnswer = normalizeAnswer(submittedAnswer);
  const answers = [exercise.answer, ...(exercise.acceptedAnswers ?? [])];
  const accepted = answers.map(normalizeAnswer);
  const acceptedSurface = answers.map(normalizeSurface);
  // QCM : le choix cliqué doit être EXACTEMENT l'un des choix (casse mise à part). Les accents comptent : « se » n'est pas « sé »,
  // et ils ne sont jamais « une faute d'écriture » puisque rien n'a été saisi.
  const matchedIndex = exercise.type === "multiple-choice"
    ? answers.findIndex((candidate) => candidate.trim().toLocaleLowerCase() === submittedAnswer.trim().toLocaleLowerCase())
    : accepted.indexOf(normalizedAnswer);
  const correct = matchedIndex >= 0;
  const exactSurface = correct && acceptedSurface[matchedIndex] === normalizeSurface(submittedAnswer);
  const nearMiss = !correct && normalizedAnswer.length >= 6 && accepted.some((candidate) => editDistance(candidate, normalizedAnswer) === 1);
  // Une négation qu'aucune formulation prévue ne contient (ou l'inverse), ou mal placée, annonce un contresens : pas de « on vous comprendrait ».
  if (!correct && exercise.understandable?.length && !exclusiveMismatch(normalizedAnswer, accepted)
    && conceptsCovered(normalizedAnswer, exercise.understandable) && polarityConsistent(submittedAnswer, normalizedAnswer, answers, accepted, exercise.understandable)) {
    return {
      correct: true,
      verdict: "minor",
      normalizedAnswer,
      expectedAnswer: exercise.answer,
      explanation: exercise.explanation,
      feedback: `On vous comprendrait ! Pour sonner plus naturel : « ${exercise.answer} ».`,
      issues: [{ kind: "understood", message: "Votre phrase passe le message : c'est l'essentiel. Comparez avec la forme la plus naturelle pour la prochaine fois." }]
    };
  }
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
  const byPercentage = percentage < 25 ? 0 : percentage < 45 ? 1 : percentage < 65 ? 2 : percentage < 85 ? 3 : 4;
  // Le pourcentage global sous-estimait : A1 à B1 tous justes = 33 % donnait A2 (audit du 26/10/2026). On retient aussi le plus haut
  // niveau dont, parmi les questions de CE niveau et des niveaux inférieurs, au moins les deux tiers sont justes.
  let byLevel = 0;
  LEVEL_ORDER.forEach((level, levelIndex) => {
    const upTo = questions.filter((question) => LEVEL_ORDER.indexOf(question.level) <= levelIndex);
    if (!upTo.length) return;
    const right = upTo.filter((question) => evaluateAnswer(question, answers[question.id] ?? "").correct).length;
    const own = upTo.filter((question) => LEVEL_ORDER.indexOf(question.level) === levelIndex);
    if (right / upTo.length >= 2 / 3 && own.some((question) => evaluateAnswer(question, answers[question.id] ?? "").correct)) byLevel = levelIndex;
  });
  const index = Math.max(byPercentage, byLevel);

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
