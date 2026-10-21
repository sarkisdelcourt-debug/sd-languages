import { matchPairsAnswer } from "../learning.js";
import type { LanguageCode } from "../types.js";
import type { IrregularVerbItem, PhrasalVerbItem, SentenceItem, TopicExercise, VocabSet } from "./types.js";

/**
 * Générateurs déterministes : une même liste produit toujours les mêmes exercices, avec les mêmes
 * identifiants. Les ids dérivent de l'id de la liste/phrase et du texte anglais — ne pas renommer.
 */
const LANGUAGE: LanguageCode = "en";

/** Identifiant lisible et stable à partir d'un texte : « the thyroid gland » → « the-thyroid-gland ». */
export function slug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function hash(text: string): number {
  let value = 2_166_136_261;
  for (const character of text) value = Math.imul(value ^ character.charCodeAt(0), 16_777_619) >>> 0;
  return value;
}

/** Découpe en groupes de `size`, sans laisser de dernier groupe trop petit pour un exercice d'association. */
export function chunkForPairs<T>(items: T[], size = 4): T[][] {
  const groups: T[][] = [];
  for (let index = 0; index < items.length; index += size) groups.push(items.slice(index, index + size));
  const last = groups.at(-1);
  if (groups.length > 1 && last && last.length < 3) groups[groups.length - 2]!.push(...groups.pop()!);
  return groups.filter((group) => group.length >= 3);
}

const PRONOUN = "(I|you|he|she|we|they|it)";
/** Participe passé reconnaissable après « 'd » / « had » (liste courte + terminaison -ed). */
const PARTICIPLE = "(?:already |never |just |not |always )?(?:been|done|gone|seen|had|known|taken|made|given|left|forgotten|written|told|thought|said|come|become|heard|found|got|gotten|lost|met|put|read|run|sent|spent|won|\\w+ed)\\b";

const CONTRACTIONS: Array<[RegExp, string, RegExp, string]> = [
  [/\bcan't\b/gi, "cannot", /\bcannot\b/gi, "can't"],
  [/\bwon't\b/gi, "will not", /\bwill not\b/gi, "won't"],
  [/\b(do|does|did|is|are|was|were|has|have|had|should|would|could|must)n't\b/gi, "$1 not", /\b(do|does|did|is|are|was|were|has|have|had|should|would|could|must) not\b/gi, "$1n't"],
  [/\bI'm\b/g, "I am", /\bI am\b/g, "I'm"],
  [/\b(you|we|they)'re\b/gi, "$1 are", /\b(you|we|they) are\b/gi, "$1're"],
  [/\b(I|you|we|they)'ve\b/gi, "$1 have", /\b(I|you|we|they) have\b(?! to)/gi, "$1've"],
  [/\b(I|you|he|she|we|they|it)'ll\b/gi, "$1 will", /\b(I|you|he|she|we|they|it) will\b/gi, "$1'll"],
  [/\b(it|that|there|what|he|she)'s\b(?= (?!been\b|got\b))/gi, "$1 is", /\b(it|that|there|what|he|she) is\b/gi, "$1's"],
  [/\b(would|should|could|might|must)'ve\b/gi, "$1 have", /\b(would|should|could|might|must) have\b/gi, "$1've"],
  [/\b(l)et's\b/gi, "$1et us", /\b(l)et us\b/gi, "$1et's"],
  // « 'd » : would devant like/rather/better/prefer…, had devant un participe passé, would sinon.
  [new RegExp(`\\b${PRONOUN}'d\\b(?= (?:like|love|rather|better|prefer|sooner|hate)\\b)`, "gi"), "$1 would", new RegExp(`\\b${PRONOUN} would\\b`, "gi"), "$1'd"],
  [new RegExp(`\\b${PRONOUN}'d\\b(?= ${PARTICIPLE})`, "gi"), "$1 had", new RegExp(`\\b${PRONOUN} had\\b(?= ${PARTICIPLE})`, "gi"), "$1'd"],
  [new RegExp(`\\b${PRONOUN}'d\\b`, "gi"), "$1 would", /$^/g, ""]
];

/** Forme entièrement développée d'une phrase (« I'd like » → « I would like »). */
export function expandContractions(sentence: string): string {
  return CONTRACTIONS.reduce((text, [contracted, expansion]) => text.replace(contracted, expansion), sentence);
}

/** Variantes équivalentes (contractée / développée) pour ne pas pénaliser « I am » au lieu de « I'm ». */
export function contractionVariants(sentence: string): string[] {
  const expanded = expandContractions(sentence);
  const contracted = CONTRACTIONS.reduce((text, [, , full, contraction]) => text.replace(full, contraction), sentence);
  // « 'd » devant un participe (« I'd seen ») : « had » est produit ci-dessus, on accepte aussi « would ».
  const ambiguous = sentence.replace(/\b(I|you|he|she|we|they|it)'d\b/gi, "$1 would");
  return [...new Set([expanded, contracted, ambiguous])].filter((variant) => variant !== sentence);
}

const NUMBER_WORDS: Array<[number, string]> = [
  [0, "zero"], [1, "one"], [2, "two"], [3, "three"], [4, "four"], [5, "five"], [6, "six"], [7, "seven"], [8, "eight"],
  [9, "nine"], [10, "ten"], [11, "eleven"], [12, "twelve"], [13, "thirteen"], [14, "fourteen"], [15, "fifteen"],
  [16, "sixteen"], [17, "seventeen"], [18, "eighteen"], [19, "nineteen"], [20, "twenty"], [21, "twenty-one"],
  [22, "twenty-two"], [23, "twenty-three"], [24, "twenty-four"], [25, "twenty-five"], [26, "twenty-six"],
  [27, "twenty-seven"], [28, "twenty-eight"], [29, "twenty-nine"], [30, "thirty"], [40, "forty"], [50, "fifty"], [100, "a hundred"]
];
const WORD_TO_DIGIT = new Map<string, string>([
  ...NUMBER_WORDS.map(([digit, word]): [string, string] => [word, String(digit)]),
  ["one hundred", "100"], ["twenty one", "21"], ["twenty two", "22"], ["twenty three", "23"], ["twenty four", "24"],
  ["twenty five", "25"], ["twenty six", "26"], ["twenty seven", "27"], ["twenty eight", "28"], ["twenty nine", "29"]
]);
const WORD_PATTERN = new RegExp(`\\b(${[...WORD_TO_DIGIT.keys()].sort((left, right) => right.length - left.length).join("|")})\\b`, "gi");
const DIGIT_TO_WORD = new Map(NUMBER_WORDS.map(([digit, word]) => [String(digit), word]));

/** Variantes chiffres ↔ mots (0–30, 40, 50, 100) et « an hour » ↔ « one hour ». */
export function numberVariants(sentence: string): string[] {
  const inDigits = sentence.replace(WORD_PATTERN, (word) => WORD_TO_DIGIT.get(word.toLowerCase()) ?? word);
  const inWords = sentence.replace(/\b(\d+)\b/g, (digits) => DIGIT_TO_WORD.get(digits) ?? digits);
  const hour = sentence.replace(/\b(an|one) hour\b/gi, (_, article: string) => `${article.toLowerCase() === "an" ? "one" : "an"} hour`);
  return [...new Set([inDigits, inWords, hour])].filter((variant) => variant !== sentence);
}

/** Lexique US ↔ UK : chaque entrée est acceptée dans les deux sens (« the check » ↔ « the bill »). */
const US_UK: Array<[string, string]> = [
  ["the check", "the bill"], ["gas station", "petrol station"], ["gas", "petrol"], ["movie", "film"], ["subway", "underground"],
  ["downtown", "in the city centre"], ["rent a car", "hire a car"], ["rented a car", "hired a car"], ["appetizer", "starter"],
  ["apartment", "flat"], ["elevator", "lift"], ["vacation", "holiday"], ["cell phone", "mobile"], ["in line", "in the queue"],
  ["restroom", "toilet"], ["schedule", "timetable"], ["store", "shop"], ["pharmacy", "chemist's"], ["drugstore", "chemist's"],
  ["fall", "autumn"], ["truck", "lorry"], ["trucks", "lorries"], ["parking lot", "car park"], ["candy", "sweets"],
  ["cookie", "biscuit"], ["soccer", "football"], ["color", "colour"], ["favorite", "favourite"], ["center", "centre"],
  ["traveling", "travelling"], ["organize", "organise"]
];
const escapePattern = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const usToUk = US_UK.map(([us, uk]): [RegExp, string] => [new RegExp(`\\b${escapePattern(us)}(s?)\\b`, "gi"), `${uk}$1`]);
const ukToUs = [...US_UK].reverse().map(([us, uk]): [RegExp, string] => [new RegExp(`\\b${escapePattern(uk)}(s?)\\b`, "gi"), `${us}$1`]);

/** Variantes lexicales : la phrase entièrement « britannique » et entièrement « américaine ». */
export function dialectVariants(sentence: string): string[] {
  const british = usToUk.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), sentence);
  const american = ukToUs.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), sentence);
  return [...new Set([british, american])].filter((variant) => variant !== sentence);
}

/**
 * Toutes les formulations acceptées pour une dictée : contractions, chiffres et lexique US/UK se
 * combinent (chaque famille est appliquée aux variantes déjà obtenues), sans la phrase d'origine.
 */
export function answerVariants(sentence: string): string[] {
  let variants = new Set([sentence]);
  for (const family of [contractionVariants, numberVariants, dialectVariants]) {
    const next = new Set(variants);
    for (const variant of variants) for (const produced of family(variant)) next.add(produced);
    variants = next;
  }
  variants.delete(sentence);
  return [...variants];
}

/**
 * Familles de mots grammaticaux : si la phrase contient l'un d'eux, ses voisins font de bons
 * distracteurs (« does » / « did » pour une question en « do », « for » pour « since »…).
 */
const GRAMMAR_FAMILIES: string[][] = [
  ["do", "does", "did"], ["is", "are", "was", "were"], ["has", "have", "had"], ["since", "for"],
  ["in", "on", "at"], ["a", "an", "the"], ["much", "many"], ["this", "that", "these", "those"], ["some", "any"]
];

/** Distracteurs grammaticaux déterministes (au plus `count`), absents de la phrase. */
export function grammarDistractors(words: string[], seed: string, count = 2): string[] {
  const present = new Set(words.map((word) => word.toLowerCase()));
  const candidates = [...new Set(GRAMMAR_FAMILIES
    .filter((family) => family.some((member) => present.has(member)))
    .flatMap((family) => family.filter((member) => !present.has(member))))];
  if (!candidates.length) return [];
  const start = hash(seed) % candidates.length;
  return candidates.length <= count ? candidates : [candidates[start]!, candidates[(start + 1) % candidates.length]!];
}

const IMPERATIVE_STARTS = new Set([
  "please", "don't", "do", "let", "let's", "hold", "go", "come", "avoid", "take", "turn", "call", "fill", "check", "drink", "keep",
  "try", "make", "tell", "give", "send", "remember", "ask", "get", "bring", "breathe", "lie", "sit", "stand", "press", "follow",
  "wait", "open", "close", "stop", "look", "put", "leave", "book", "pay", "show", "write", "read", "have", "be", "use", "rest",
  "excuse", "thank", "relax", "swallow", "raise", "lift", "drive", "pick", "drop", "feel", "move", "stay", "sign", "describe"
]);

/** Indice de construction selon la forme de la phrase : question, impératif ou affirmation. */
export function buildHint(sentence: string): string {
  if (sentence.trim().endsWith("?")) return "Commencez par le mot interrogatif ou l'auxiliaire.";
  const first = sentenceTiles(sentence)[0]?.toLowerCase() ?? "";
  if (IMPERATIVE_STARTS.has(first)) return "Commencez par le verbe.";
  return "Commencez par le sujet, puis le verbe.";
}

/** Mots d'une phrase tels qu'affichés sur les étiquettes (ponctuation finale retirée). */
export function sentenceTiles(sentence: string): string[] {
  return sentence.split(/\s+/).map((word) => word.replace(/[.,?!;:]+$/g, "")).filter(Boolean);
}

export function vocabExercises(set: VocabSet): TopicExercise[] {
  const pairs = chunkForPairs(set.items).map((group, index): TopicExercise => {
    const items = group.map((item) => ({ target: item.en, native: item.fr }));
    return {
      id: `${set.id}-pairs-${index + 1}`, language: LANGUAGE, level: set.level, topic: set.topic, type: "match-pairs",
      prompt: "Associez chaque mot à sa traduction.", pairs: items, answer: matchPairsAnswer(items),
      explanation: `Vocabulaire : ${set.title.toLowerCase()}.`, hint: "Commencez par les mots que vous reconnaissez.", focus: set.title
    };
  });
  const meanings = set.items.map((item, index): TopicExercise => {
    const others = set.items.filter((_, otherIndex) => otherIndex !== index);
    const start = hash(item.en) % Math.max(1, others.length);
    const distractors = [0, 1, 2].map((offset) => others[(start + offset * 3) % others.length]!.fr);
    const choices = [...new Set([item.fr, ...distractors])].sort((left, right) => hash(`${item.en}${left}`) - hash(`${item.en}${right}`));
    return {
      id: `${set.id}-${slug(item.en)}`, language: LANGUAGE, level: set.level, topic: set.topic, type: "multiple-choice",
      prompt: `Que signifie « ${item.en} » ?`, choices, answer: item.fr,
      explanation: `« ${item.en} » se traduit par « ${item.fr} ».`, hint: `Thème : ${set.title.toLowerCase()}.`, focus: set.title
    };
  });
  return [...pairs, ...meanings];
}

export function sentenceExercises(items: SentenceItem[]): TopicExercise[] {
  const pool = items.flatMap((item) => sentenceTiles(item.en).slice(1).map((word) => word.toLowerCase()));
  return items.flatMap((item): TopicExercise[] => {
    const words = sentenceTiles(item.en);
    const present = new Set(words.map((word) => word.toLowerCase()));
    // Distracteurs : d'abord grammaticaux (auxiliaire, préposition, article de la phrase), sinon deux mots de la banque.
    const grammatical = grammarDistractors(words, item.id);
    const candidates = [...new Set(pool.filter((word) => !present.has(word) && word.length > 2 && !grammatical.includes(word)))];
    const start = candidates.length ? hash(item.id) % candidates.length : 0;
    const fallback = candidates.length >= 2 ? [candidates[start]!, candidates[(start + 7) % candidates.length]!].filter((word, index, all) => all.indexOf(word) === index) : [];
    const distractors = [...grammatical, ...fallback].slice(0, 2);
    const variants = answerVariants(item.en);
    const base = { language: LANGUAGE, level: item.level, topic: item.topic, explanation: item.note, focus: "Phrases en contexte" } as const;
    return [
      {
        ...base, id: `${item.id}-build`, type: "word-bank",
        prompt: `Construisez : « ${item.fr} »`, tiles: [...words, ...distractors], answer: item.en,
        hint: buildHint(item.en)
      },
      {
        // La traduction n'est révélée qu'après validation (explication), pas dans l'indice.
        ...base, id: `${item.id}-listen`, type: "listening", explanation: `« ${item.fr} » — ${item.note}`,
        prompt: "Écoutez puis écrivez la phrase.", audioText: item.en, answer: item.en,
        ...(variants.length ? { acceptedAnswers: variants } : {}),
        hint: "Réécoutez autant de fois que nécessaire, puis écrivez les mots dans l'ordre entendu."
      }
    ];
  });
}

export function phrasalVerbExercises(items: PhrasalVerbItem[]): TopicExercise[] {
  const gaps = items.map((item): TopicExercise => {
    const blanks = item.form.split(/\s+/).map(() => "___").join(" ");
    return {
      id: `${item.id}-gap`, language: LANGUAGE, level: item.level, topic: "phrasal-verbs", type: "fill-gap",
      prompt: `Complétez (« ${item.fr} ») : ${item.example.replace(item.form, blanks)}`, answer: item.form,
      explanation: `« ${item.verb} » = ${item.fr}. Dans cette phrase : « ${item.form} ».`,
      hint: `Verbe à particule en ${item.form.split(/\s+/).length} mots.`, focus: "Phrasal verbs"
    };
  });
  const pairs = chunkForPairs(items).map((group, index): TopicExercise => {
    const pairItems = group.map((item) => ({ target: item.verb, native: item.fr }));
    const level = group.some((item) => item.level === "B2") ? "B2" : "B1";
    return {
      id: `en-pv-pairs-${index + 1}`, language: LANGUAGE, level, topic: "phrasal-verbs", type: "match-pairs",
      prompt: "Associez chaque verbe à particule à sa traduction.", pairs: pairItems, answer: matchPairsAnswer(pairItems),
      explanation: "La particule change le sens du verbe : apprenez-les comme des mots à part entière.",
      hint: "Pensez à une phrase où vous les avez déjà entendus.", focus: "Phrasal verbs"
    };
  });
  return [...gaps, ...pairs];
}

export function irregularVerbExercises(items: IrregularVerbItem[]): TopicExercise[] {
  return items.flatMap((item): TopicExercise[] => {
    const [past, ...pastVariants] = item.past.split("/").map((value) => value.trim());
    const [participle, ...participleVariants] = item.participle.split("/").map((value) => value.trim());
    const base = {
      language: LANGUAGE, level: item.level, topic: "irregular-verbs", type: "fill-gap", focus: "Verbes irréguliers",
      explanation: `${item.base} → ${item.past} → ${item.participle} (${item.fr}).`
    } as const;
    // Verbes invariants (put, read, cut…) : demander le prétérit n'apprend rien, on garde le participe.
    const invariant = past === item.base;
    const example = item.example ? ` — ex. « ${item.example} »` : "";
    return [
      ...(invariant ? [] : [{
        ...base, id: `en-irr-${slug(item.base)}-past`, prompt: `Prétérit de « to ${item.base} » (${item.fr})${example}`,
        answer: past!, ...(pastVariants.length ? { acceptedAnswers: pastVariants } : {}),
        hint: "Le prétérit : « hier, je… »."
      }]),
      {
        ...base, id: `en-irr-${slug(item.base)}-pp`, prompt: `Participe passé de « to ${item.base} » (${item.fr})`,
        answer: participle!, ...(participleVariants.length ? { acceptedAnswers: participleVariants } : {}),
        hint: "Le participe passé : « I have… »."
      }
    ];
  });
}
