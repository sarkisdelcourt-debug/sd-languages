import { irregularVerbExercises, phrasalVerbExercises, sentenceExercises, vocabExercises } from "../generators.js";
import type { TopicExercise } from "../types.js";
import { BEGINNER_EXERCISES } from "./beginner.js";
import { EVERYDAY_SENTENCES, GENERAL_VOCAB, GRAMMAR_EXERCISES, TRAVEL_SENTENCES } from "./general.js";
import { EN_VERB_SETS } from "./verb-lists.js";
import { EN_VOCAB_EXTRA } from "./vocab-extra.js";
import { MEDICAL_SENTENCES, MEDICAL_VOCAB } from "./medical.js";
import { FALSE_FRIENDS, IRREGULAR_VERBS, PHRASAL_VERBS } from "./verbs.js";

/** Banque anglaise générée et rédigée (22/10/2026), ajoutée au catalogue d'exercices. */
export const ENGLISH_BANK: TopicExercise[] = [
  ...MEDICAL_VOCAB.flatMap((set) => vocabExercises(set)),
  ...sentenceExercises(MEDICAL_SENTENCES),
  ...GENERAL_VOCAB.flatMap((set) => vocabExercises(set)),
  ...[...EN_VOCAB_EXTRA, ...EN_VERB_SETS].flatMap((set) => vocabExercises(set, "en")),
  ...sentenceExercises(EVERYDAY_SENTENCES),
  ...sentenceExercises(TRAVEL_SENTENCES),
  ...GRAMMAR_EXERCISES,
  ...BEGINNER_EXERCISES,
  ...phrasalVerbExercises(PHRASAL_VERBS),
  ...irregularVerbExercises(IRREGULAR_VERBS),
  ...FALSE_FRIENDS
];
