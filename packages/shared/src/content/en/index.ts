import { irregularVerbExercises, phrasalVerbExercises, sentenceExercises, vocabExercises } from "../generators.js";
import type { TopicExercise } from "../types.js";
import { EVERYDAY_SENTENCES, GENERAL_VOCAB, GRAMMAR_EXERCISES, TRAVEL_SENTENCES } from "./general.js";
import { MEDICAL_SENTENCES, MEDICAL_VOCAB } from "./medical.js";
import { FALSE_FRIENDS, IRREGULAR_VERBS, PHRASAL_VERBS } from "./verbs.js";

/** Banque anglaise générée et rédigée (22/10/2026), ajoutée au catalogue d'exercices. */
export const ENGLISH_BANK: TopicExercise[] = [
  ...MEDICAL_VOCAB.flatMap(vocabExercises),
  ...sentenceExercises(MEDICAL_SENTENCES),
  ...GENERAL_VOCAB.flatMap(vocabExercises),
  ...sentenceExercises(EVERYDAY_SENTENCES),
  ...sentenceExercises(TRAVEL_SENTENCES),
  ...GRAMMAR_EXERCISES,
  ...phrasalVerbExercises(PHRASAL_VERBS),
  ...irregularVerbExercises(IRREGULAR_VERBS),
  ...FALSE_FRIENDS
];
