import { sentenceExercises, vocabExercises } from "../generators.js";
import type { TopicExercise } from "../types.js";
import { SPANISH_ADVANCED_EXERCISES } from "./advanced.js";
import { ES_GRAMMAR, ES_SENTENCES, ES_VOCAB } from "./bank.js";

/** Banque espagnole rédigée et générée (22/10/2026), débutant → B1. */
export const SPANISH_BANK: TopicExercise[] = [
  ...ES_VOCAB.flatMap((set) => vocabExercises(set, "es")),
  ...sentenceExercises(ES_SENTENCES, "es"),
  ...SPANISH_ADVANCED_EXERCISES,
  ...ES_GRAMMAR
];
