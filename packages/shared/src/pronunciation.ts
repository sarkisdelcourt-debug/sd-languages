import type { PronunciationPrompt } from "./types.js";

export const PRONUNCIATION_PROMPTS: PronunciationPrompt[] = [
  {
    id: "pron-en-gate",
    language: "en",
    level: "A1",
    sourceLessonId: "lesson-en-daily-basics",
    text: "Where is gate twelve?",
    translation: "Où se trouve la porte douze ?",
    focus: "Le w initial, la diphtongue de gate et le groupe final de twelve.",
    keyTokens: ["gate", "twelve"],
    coachingTip: "Posez la question en un seul groupe et appuyez gate puis twelve."
  },
  {
    id: "pron-en-routine",
    language: "en",
    level: "A2",
    sourceLessonId: "lesson-en-routine-travel",
    text: "I usually take the bus to work.",
    translation: "Je prends habituellement le bus pour aller travailler.",
    focus: "Le rythme accentuel, les syllabes de usually et la forme faible de to.",
    keyTokens: ["usually", "work"],
    coachingTip: "Gardez usually léger et donnez davantage de poids à bus et work."
  },
  {
    id: "pron-en-report",
    language: "en",
    level: "B1",
    sourceLessonId: "lesson-en-project-update",
    text: "Could you send me the report by Friday?",
    translation: "Pourriez-vous m’envoyer le rapport d’ici vendredi ?",
    focus: "L’enchaînement could you, le th de the et les accents de report et Friday.",
    keyTokens: ["report", "Friday"],
    coachingTip: "Liez could you sans avaler le début de Friday."
  },
  {
    id: "pron-en-setback",
    language: "en",
    level: "B2",
    sourceLessonId: "lesson-en-handle-setback",
    text: "Even though the deadline is tight, we can still adjust the plan.",
    translation: "Même si le délai est serré, nous pouvons encore adapter le plan.",
    focus: "La concession even though, le th et le contraste entre deadline et adjust.",
    keyTokens: ["deadline", "adjust"],
    coachingTip: "Marquez une courte pause après tight, puis relancez sur we can still."
  },
  {
    id: "pron-de-greeting",
    language: "de",
    level: "A1",
    sourceLessonId: "lesson-de-daily-basics",
    text: "Guten Tag, ich heiße Alex.",
    translation: "Bonjour, je m’appelle Alex.",
    focus: "Le h expiré de heiße, le ich-Laut et le ß prononcé comme un s net.",
    keyTokens: ["heiße", "Alex"],
    coachingTip: "Détachez Guten Tag, puis gardez ich heiße dans un seul souffle."
  },
  {
    id: "pron-de-ticket",
    language: "de",
    level: "A2",
    sourceLessonId: "lesson-de-train-ticket",
    text: "Ich möchte eine Fahrkarte nach Berlin.",
    translation: "Je voudrais un billet pour Berlin.",
    focus: "Le ich-Laut, la voyelle ö et l’accent principal de Fahrkarte.",
    keyTokens: ["Fahrkarte", "Berlin"],
    coachingTip: "Arrondissez les lèvres sur möchte et accentuez Fahr dans Fahrkarte."
  },
  {
    id: "pron-de-meeting",
    language: "de",
    level: "B1",
    sourceLessonId: "lesson-de-explain-organise",
    text: "Die Besprechung beginnt zehn Minuten später.",
    translation: "La réunion commence dix minutes plus tard.",
    focus: "Le sp prononcé chp, le z initial prononcé ts et les voyelles ü et ä.",
    keyTokens: ["Besprechung", "später"],
    coachingTip: "Gardez les voyelles arrondies et ne réduisez pas les syllabes finales."
  },
  {
    id: "pron-de-disruption",
    language: "de",
    level: "B2",
    sourceLessonId: "lesson-de-handle-disruption",
    text: "Aufgrund der Streckensperrung müssen wir eine Alternative finden.",
    translation: "En raison de la fermeture de la ligne, nous devons trouver une solution de remplacement.",
    focus: "Les groupes consonantiques de Streckensperrung et le ü de müssen.",
    keyTokens: ["Streckensperrung", "Alternative"],
    coachingTip: "Découpez Strecken-sperrung, puis reliez les deux parties sans accélérer."
  },
  {
    id: "pron-es-origin",
    language: "es",
    level: "A1",
    sourceLessonId: "lesson-es-daily-basics",
    text: "Soy de Francia.",
    translation: "Je suis de France.",
    focus: "Les voyelles nettes, la diphtongue de soy et le rythme syllabique.",
    keyTokens: ["soy", "Francia"],
    coachingTip: "Gardez chaque voyelle pleine, sans réduire de en son neutre."
  },
  {
    id: "pron-es-bakery",
    language: "es",
    level: "A2",
    sourceLessonId: "lesson-es-new-neighbour",
    text: "¿Dónde está la panadería?",
    translation: "Où se trouve la boulangerie ?",
    focus: "Les accents toniques de dónde, está et panadería, avec un d intervocalique léger.",
    keyTokens: ["dónde", "panadería"],
    coachingTip: "Faites entendre les trois accents sans hausser chaque syllabe."
  },
  {
    id: "pron-es-deadline",
    language: "es",
    level: "B1",
    sourceLessonId: "lesson-es-experience-work",
    text: "Tenemos que terminar esta tarea antes del jueves.",
    translation: "Nous devons terminer cette tâche avant jeudi.",
    focus: "Le j de jueves, les accents de terminar et tarea, et le débit régulier.",
    keyTokens: ["terminar", "jueves"],
    coachingTip: "Gardez le même espace entre les syllabes et soufflez le j de jueves."
  },
  {
    id: "pron-es-negotiate",
    language: "es",
    level: "B2",
    sourceLessonId: "lesson-es-negotiate-conditions",
    text: "Si ajustamos el plazo, podremos mantener la calidad.",
    translation: "Si nous ajustons le délai, nous pourrons maintenir la qualité.",
    focus: "Le rythme de la condition, le j de ajustamos et les accents de plazo et calidad.",
    keyTokens: ["plazo", "calidad"],
    coachingTip: "Séparez les deux propositions par une pause courte, pas par une rupture."
  }
];
