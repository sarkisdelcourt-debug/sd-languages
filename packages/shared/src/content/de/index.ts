import { sentenceExercises, vocabExercises } from "../generators.js";
import type { TopicExercise } from "../types.js";
import { GERMAN_BEGINNER_EXERCISES } from "./beginner.js";
import { DE_GRAMMAR, DE_SENTENCES, DE_VOCAB } from "./bank.js";

/** Banque allemande rédigée et générée (22/10/2026), réactivation A2 → B2. */
export const GERMAN_BANK: TopicExercise[] = [
  ...DE_VOCAB.flatMap((set) => vocabExercises(set, "de")),
  ...sentenceExercises(DE_SENTENCES, "de"),
  ...GERMAN_BEGINNER_EXERCISES,
  ...DE_GRAMMAR
];
