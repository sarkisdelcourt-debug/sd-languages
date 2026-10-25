import { articleExercises, sentenceExercises, vocabExercises } from "../generators.js";
import type { TopicExercise } from "../types.js";
import { ES_GRAMMAR_EXTRA } from "./grammar-extra.js";
import { ES_SENTENCES_EXTRA } from "./sentences-extra.js";
import { ES_VOCAB_MORE } from "./vocab-more.js";
import { ES_VERB_SETS } from "./verb-lists.js";
import { ES_VOCAB_EXTRA } from "./vocab-extra.js";
import { SPANISH_ADVANCED_EXERCISES } from "./advanced.js";
import { ES_GRAMMAR, ES_SENTENCES, ES_VOCAB } from "./bank.js";

/** Banque espagnole rédigée et générée (22/10/2026), débutant → B1. */
export const SPANISH_BANK: TopicExercise[] = [
  ...ES_VOCAB.flatMap((set) => vocabExercises(set, "es")),
  ...[...ES_VOCAB_EXTRA, ...ES_VERB_SETS, ...ES_VOCAB_MORE].flatMap((set) => vocabExercises(set, "es")),
  ...sentenceExercises(ES_SENTENCES, "es"),
  ...sentenceExercises(ES_SENTENCES_EXTRA, "es"),
  ...SPANISH_ADVANCED_EXERCISES,
  ...articleExercises([...ES_VOCAB, ...ES_VOCAB_EXTRA, ...ES_VERB_SETS, ...ES_VOCAB_MORE], "es"),
  ...ES_GRAMMAR,
  ...ES_GRAMMAR_EXTRA
];
