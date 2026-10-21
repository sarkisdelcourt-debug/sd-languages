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

const CONTRACTIONS: Array<[RegExp, string, RegExp, string]> = [
  [/\bcan't\b/gi, "cannot", /\bcannot\b/gi, "can't"],
  [/\bwon't\b/gi, "will not", /\bwill not\b/gi, "won't"],
  [/\b(do|does|did|is|are|was|were|has|have|had|should|would|could|must)n't\b/gi, "$1 not", /\b(do|does|did|is|are|was|were|has|have|had|should|would|could|must) not\b/gi, "$1n't"],
  [/\bI'm\b/g, "I am", /\bI am\b/g, "I'm"],
  [/\b(you|we|they)'re\b/gi, "$1 are", /\b(you|we|they) are\b/gi, "$1're"],
  [/\b(I|you|we|they)'ve\b/gi, "$1 have", /\b(I|you|we|they) have\b(?! to)/gi, "$1've"],
  [/\b(I|you|he|she|we|they|it)'ll\b/gi, "$1 will", /\b(I|you|he|she|we|they|it) will\b/gi, "$1'll"],
  [/\b(it|that|there|what|he|she)'s\b(?= (?!been\b|got\b))/gi, "$1 is", /\b(it|that|there|what|he|she) is\b/gi, "$1's"]
];

/** Variantes équivalentes (contractée / développée) pour ne pas pénaliser « I am » au lieu de « I'm ». */
export function contractionVariants(sentence: string): string[] {
  const expanded = CONTRACTIONS.reduce((text, [contracted, expansion]) => text.replace(contracted, expansion), sentence);
  const contracted = CONTRACTIONS.reduce((text, [, , full, contraction]) => text.replace(full, contraction), sentence);
  return [...new Set([expanded, contracted])].filter((variant) => variant !== sentence);
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
    const candidates = [...new Set(pool.filter((word) => !present.has(word) && word.length > 2))];
    const start = candidates.length ? hash(item.id) % candidates.length : 0;
    const distractors = candidates.length >= 2 ? [candidates[start]!, candidates[(start + 7) % candidates.length]!].filter((word, index, all) => all.indexOf(word) === index) : [];
    const variants = contractionVariants(item.en);
    const base = { language: LANGUAGE, level: item.level, topic: item.topic, explanation: item.note, focus: "Phrases en contexte" } as const;
    return [
      {
        ...base, id: `${item.id}-build`, type: "word-bank",
        prompt: `Construisez : « ${item.fr} »`, tiles: [...words, ...distractors], answer: item.en,
        hint: "Commencez par le sujet, puis le verbe."
      },
      {
        ...base, id: `${item.id}-listen`, type: "listening",
        prompt: "Écoutez puis écrivez la phrase.", audioText: item.en, answer: item.en,
        ...(variants.length ? { acceptedAnswers: variants } : {}),
        hint: `Sens : « ${item.fr} »`
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
    return [
      {
        ...base, id: `en-irr-${slug(item.base)}-past`, prompt: `Prétérit de « to ${item.base} » (${item.fr})`,
        answer: past!, ...(pastVariants.length ? { acceptedAnswers: pastVariants } : {}),
        hint: "Le prétérit : « hier, je… »."
      },
      {
        ...base, id: `en-irr-${slug(item.base)}-pp`, prompt: `Participe passé de « to ${item.base} » (${item.fr})`,
        answer: participle!, ...(participleVariants.length ? { acceptedAnswers: participleVariants } : {}),
        hint: "Le participe passé : « I have… »."
      }
    ];
  });
}
