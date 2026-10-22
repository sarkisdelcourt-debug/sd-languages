import { matchPairsAnswer } from "../../learning.js";
import type { HandwrittenExercise } from "../types.js";

/**
 * Espagnol B2 rédigé (22/10/2026) : la banque n'avait que trois exercices B2 pour trois leçons.
 * Thèmes des leçons : négocier sous conditions, définir un profil recherché, analyser un délai manqué.
 * RÈGLE D'OR : un `id` publié ne change jamais.
 */
const pairs = (items: Array<[string, string]>) => items.map(([target, native]) => ({ target, native }));
const LISTEN_HINT = "Réécoutez autant de fois que nécessaire, puis écrivez les mots dans l'ordre entendu.";

const negotiation = pairs([["el plazo", "le délai"], ["la propuesta", "la proposition"], ["el acuerdo", "l'accord"], ["ceder", "céder"]]);
const hiring = pairs([["el candidato", "le candidat"], ["la experiencia", "l'expérience"], ["el puesto", "le poste"], ["la entrevista", "l'entretien"]]);

export const SPANISH_ADVANCED_EXERCISES: HandwrittenExercise[] = [
  // --- B2 · Négocier sous conditions ---------------------------------------------------------
  {
    id: "es-hw-b2-nego-pairs", skillTags: ["work-vocabulary"], language: "es", level: "B2", topic: "everyday", type: "match-pairs",
    prompt: "Associez chaque mot à sa traduction.",
    pairs: negotiation, answer: matchPairsAnswer(negotiation),
    explanation: "Le vocabulaire de base d'une négociation : el plazo, la propuesta, el acuerdo, ceder.",
    hint: "Ceder ressemble au français « céder ».", focus: "Négocier"
  },
  {
    id: "es-hw-b2-nego-build", skillTags: ["subjunctive", "sentence-building"], language: "es", level: "B2", topic: "everyday", type: "word-bank",
    prompt: "Construisez : « Nous acceptons à condition que vous livriez lundi. »",
    tiles: ["Aceptamos", "con", "tal", "de", "que", "entreguen", "el", "lunes", "entregan", "para"],
    answer: "Aceptamos con tal de que entreguen el lunes.",
    explanation: "Con tal de que est suivi du subjonctif : entreguen (et non entregan).",
    hint: "La condition appelle le subjonctif.", focus: "Poser une condition"
  },
  {
    id: "es-hw-b2-nego-listen", skillTags: ["subjunctive", "listening"], language: "es", level: "B2", topic: "everyday", type: "listening",
    prompt: "Écoutez puis écrivez la phrase.",
    audioText: "No firmaremos a menos que cambien el plazo.", answer: "No firmaremos a menos que cambien el plazo.",
    explanation: "« Nous ne signerons pas à moins que vous ne changiez le délai. » — a menos que + subjonctif.",
    hint: LISTEN_HINT, focus: "Comprendre une condition"
  },
  {
    id: "es-hw-b2-nego-mcq-siempre", skillTags: ["subjunctive"], language: "es", level: "B2", topic: "everyday", type: "multiple-choice",
    prompt: "Comment dit-on « Nous signerons à condition que vous baissiez le prix » ?",
    choices: ["Firmaremos siempre que bajen el precio.", "Firmaremos siempre que bajan el precio.", "Firmaremos siempre que bajaron el precio.", "Firmaremos siempre que bajarán el precio."],
    answer: "Firmaremos siempre que bajen el precio.",
    explanation: "Siempre que au sens de « à condition que » se construit avec le subjonctif présent : bajen.",
    hint: "Une condition à venir : subjonctif.", focus: "Poser une condition"
  },
  {
    id: "es-hw-b2-nego-gap-conditional", skillTags: ["pluperfect-conditional"], language: "es", level: "B2", topic: "everyday", type: "fill-gap",
    prompt: "Complétez : Si tuviéramos más tiempo, ___ una solución mejor. (proponer)",
    answer: "propondríamos",
    explanation: "Si + imparfait du subjonctif (tuviéramos) appelle le conditionnel : propondríamos. Proponer est irrégulier (propondr-).",
    hint: "Le radical est propondr-.", focus: "Hypothèse"
  },
  {
    id: "es-hw-b2-nego-translation", skillTags: ["subjunctive", "sentence-building"], language: "es", level: "B2", topic: "everyday", type: "translation",
    prompt: "Traduisez : Nous pourrions accepter, à moins que le délai ne change.",
    answer: "Podríamos aceptar, a menos que cambie el plazo.",
    acceptedAnswers: ["Podríamos aceptar a menos que cambie el plazo.", "Podríamos aceptar, a menos que el plazo cambie.", "Podríamos aceptar a menos que el plazo cambie."],
    explanation: "Podríamos (conditionnel) adoucit la proposition ; a menos que est suivi du subjonctif : cambie.",
    hint: "A menos que + subjonctif.", focus: "Proposer sous réserve"
  },

  // --- B2 · Définir un profil recherché --------------------------------------------------------
  {
    id: "es-hw-b2-profile-pairs", skillTags: ["work-vocabulary"], language: "es", level: "B2", topic: "everyday", type: "match-pairs",
    prompt: "Associez chaque mot à sa traduction.",
    pairs: hiring, answer: matchPairsAnswer(hiring),
    explanation: "Les mots d'un recrutement : el candidato, la experiencia, el puesto, la entrevista.",
    hint: "Candidato et experiencia ressemblent au français.", focus: "Recruter"
  },
  {
    id: "es-hw-b2-profile-build", skillTags: ["subjunctive", "sentence-building"], language: "es", level: "B2", topic: "everyday", type: "word-bank",
    prompt: "Construisez : « Nous cherchons quelqu'un qui ait de l'expérience. »",
    tiles: ["Buscamos", "a", "alguien", "que", "tenga", "experiencia", "tiene", "con"],
    answer: "Buscamos a alguien que tenga experiencia.",
    explanation: "La personne n'est pas identifiée : la relative prend le subjonctif (tenga).",
    hint: "Personne inconnue → subjonctif.", focus: "Décrire un profil"
  },
  {
    id: "es-hw-b2-profile-listen", skillTags: ["subjunctive", "listening"], language: "es", level: "B2", topic: "everyday", type: "listening",
    prompt: "Écoutez puis écrivez la phrase.",
    audioText: "Necesitamos un candidato que hable alemán.", answer: "Necesitamos un candidato que hable alemán.",
    explanation: "« Nous avons besoin d'un candidat qui parle allemand. » — le candidat reste à trouver, d'où hable.",
    hint: LISTEN_HINT, focus: "Comprendre un profil"
  },
  {
    id: "es-hw-b2-profile-gap-saber", skillTags: ["subjunctive"], language: "es", level: "B2", topic: "everyday", type: "fill-gap",
    prompt: "Complétez : No hay nadie que ___ esa respuesta. (saber)",
    answer: "sepa",
    explanation: "Après « nadie que », l'existence est niée : subjonctif. Saber donne sepa.",
    hint: "Le subjonctif de saber est irrégulier.", focus: "Nier l'existence"
  },
  {
    id: "es-hw-b2-profile-translation", skillTags: ["subjunctive", "sentence-building"], language: "es", level: "B2", topic: "everyday", type: "translation",
    prompt: "Traduisez : Nous cherchons une personne qui puisse commencer lundi.",
    answer: "Buscamos a una persona que pueda empezar el lunes.",
    acceptedAnswers: ["Buscamos una persona que pueda empezar el lunes.", "Buscamos a una persona que pueda empezar lunes.", "Buscamos una persona que pueda empezar lunes."],
    explanation: "Une personne non identifiée : pueda (subjonctif). Devant un complément de personne indéfini, le « a » personnel est facultatif.",
    hint: "Personne cherchée → subjonctif.", focus: "Décrire un profil"
  },

  // --- B2 · Analyser un délai manqué -----------------------------------------------------------
  {
    id: "es-hw-b2-late-build", skillTags: ["pluperfect-conditional", "sentence-building"], language: "es", level: "B2", topic: "everyday", type: "word-bank",
    prompt: "Construisez : « Si nous avions commencé plus tôt, nous aurions terminé à temps. »",
    tiles: ["Si", "hubiéramos", "empezado", "antes", "habríamos", "terminado", "a", "tiempo", "hemos", "habíamos"],
    answer: "Si hubiéramos empezado antes, habríamos terminado a tiempo.",
    acceptedAnswers: ["Si hubiéramos empezado antes habríamos terminado a tiempo."],
    explanation: "Condition irréelle du passé : si + plus-que-parfait du subjonctif, puis conditionnel passé.",
    hint: "Si hubiéramos… habríamos…", focus: "Imaginer une autre issue"
  },
  {
    id: "es-hw-b2-late-listen", skillTags: ["pluperfect-conditional", "listening"], language: "es", level: "B2", topic: "everyday", type: "listening",
    prompt: "Écoutez puis écrivez la phrase.",
    audioText: "Cuando llegué, el equipo ya había terminado el informe.", answer: "Cuando llegué, el equipo ya había terminado el informe.",
    explanation: "« Quand je suis arrivé, l'équipe avait déjà terminé le rapport. » — había terminado marque l'antériorité.",
    hint: LISTEN_HINT, focus: "Ordonner les faits"
  },
  {
    id: "es-hw-b2-late-translation", skillTags: ["pluperfect-conditional", "sentence-building"], language: "es", level: "B2", topic: "everyday", type: "translation",
    prompt: "Traduisez : Si nous avions su le problème, nous aurions réagi plus vite.",
    answer: "Si hubiéramos sabido el problema, habríamos reaccionado más rápido.",
    acceptedAnswers: [
      "Si hubiéramos sabido del problema, habríamos reaccionado más rápido.", "Si hubiéramos sabido el problema, habríamos reaccionado antes.",
      "Si hubiéramos sabido del problema, habríamos reaccionado antes.", "Si hubiéramos sabido el problema habríamos reaccionado más rápido.",
      "Si hubiéramos sabido del problema habríamos reaccionado más rápido."
    ],
    explanation: "Même schéma : si + hubiéramos + participe, puis habríamos + participe.",
    hint: "Si hubiéramos sabido…", focus: "Imaginer une autre issue"
  },
  {
    id: "es-hw-b2-late-mcq-meeting", skillTags: ["pluperfect-conditional"], language: "es", level: "B2", topic: "everyday", type: "multiple-choice",
    prompt: "Comment dit-on « Quand nous sommes arrivés, la réunion avait déjà commencé » ?",
    choices: ["Cuando llegamos, la reunión ya había empezado.", "Cuando llegamos, la reunión ya hubiera empezado.", "Cuando llegamos, la reunión ya habrá empezado.", "Cuando llegamos, la reunión ya empezaba."],
    answer: "Cuando llegamos, la reunión ya había empezado.",
    explanation: "Une action terminée avant une autre au passé se dit avec el pluscuamperfecto : había empezado.",
    hint: "Avait commencé → había + participe.", focus: "Ordonner les faits"
  }
];
