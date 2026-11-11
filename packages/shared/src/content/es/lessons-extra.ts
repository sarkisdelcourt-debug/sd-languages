import type { TopicExercise } from "../types.js";

/**
 * Exercices rédigés pour les quatre leçons guidées espagnoles de novembre 2026 (chemin, marché, médecin, réclamation).
 * RÈGLE D'OR : un id publié ne change jamais ; on peut corriger un texte, pas renommer.
 */
export const ES_LESSON_EXERCISES: TopicExercise[] = [
  // ---- A1 : demander son chemin et se repérer ----
  {
    id: "es-le-chemin-gap-estar", language: "es", level: "A1", topic: "travel", type: "fill-gap", skillTags: ["location", "ser-estar"],
    prompt: "Complétez : Perdone, ¿dónde ___ el museo, por favor? (estar)",
    answer: "está",
    explanation: "Pour situer un lieu, on emploie estar : « ¿Dónde está el museo? ». Ser servirait à dire ce qu'il est (« Es un museo »).",
    hint: "Verbe estar, 3e personne du singulier, avec un accent.",
    focus: "Estar pour localiser"
  },
  {
    id: "es-le-chemin-tr-banque", language: "es", level: "A1", topic: "travel", type: "translation", skillTags: ["location", "ser-estar"],
    prompt: "Traduisez : La banque est à côté de la place.",
    answer: "El banco está al lado de la plaza.",
    acceptedAnswers: ["El banco está junto a la plaza.", "El banco queda al lado de la plaza.", "El banco se encuentra al lado de la plaza."],
    understandable: [["banco"], ["esta", "queda", "encuentra"], ["lado", "junto"], ["de la", "a la"], ["plaza"]],
    explanation: "Estar situe le lieu ; « al lado de » = à côté de ; de + la reste « de la » (seul de + el devient del).",
    hint: "Estar + al lado de + la plaza.",
    focus: "Situer un lieu"
  },
  // ---- A1 : marché et supermarché ----
  {
    id: "es-le-marche-gap-de", language: "es", level: "A1", topic: "everyday", type: "fill-gap", skillTags: ["quantities", "everyday-vocabulary"],
    prompt: "Complétez : Quiero medio kilo ___ queso, por favor.",
    answer: "de",
    explanation: "Après une quantité (un kilo, medio kilo, una botella, una docena), on met toujours de avant le produit.",
    hint: "Petit mot de deux lettres, comme en français : « un kilo ___ pommes ».",
    focus: "Quantité + de"
  },
  {
    id: "es-le-marche-gap-estar", language: "es", level: "A1", topic: "everyday", type: "fill-gap", skillTags: ["ser-estar", "everyday-vocabulary"],
    prompt: "Complétez : Hoy las fresas ___ muy buenas. (estar, au présent)",
    answer: "están",
    explanation: "Pour le goût ou la fraîcheur du moment, on emploie estar : las fresas están muy buenas hoy. Ser (son buenas) dirait qu'elles sont bonnes en général.",
    hint: "Le goût du moment : estar, au pluriel (las fresas).",
    focus: "Estar pour le goût du moment"
  },
  {
    id: "es-le-marche-tr-fraises", language: "es", level: "A1", topic: "everyday", type: "translation", skillTags: ["quantities", "polite-requests"],
    prompt: "Traduisez : Combien coûtent les fraises, s'il vous plaît ?",
    answer: "¿Cuánto cuestan las fresas, por favor?",
    acceptedAnswers: ["¿Cuánto valen las fresas, por favor?", "Por favor, ¿cuánto cuestan las fresas?", "¿A cuánto están las fresas, por favor?", "¿Qué precio tienen las fresas, por favor?"],
    understandable: [["cuanto"], ["cuestan", "valen"], ["fresas"], ["favor"]],
    explanation: "Le verbe s'accorde avec ce qui est acheté : cuesta pour un seul article, cuestan pour plusieurs. Cuánto prend l'accent dans une question.",
    hint: "Fresas est au pluriel : le verbe aussi.",
    focus: "Demander un prix"
  },
  // ---- A2 : chez le médecin ou à la pharmacie ----
  {
    id: "es-le-sante-mcq-estoy", language: "es", level: "A2", topic: "medical", type: "multiple-choice", skillTags: ["ser-estar", "health-vocabulary"],
    prompt: "Complétez : Hoy ___ mareado y tengo mucha tos.",
    choices: ["estoy", "soy", "estás", "es"],
    answer: "estoy",
    explanation: "Un état passager (mareado, cansado, enfermo) se dit avec estar. Ser sert aux caractéristiques durables : « Soy alérgico a la penicilina ».",
    hint: "L'état est temporaire, et c'est vous qui parlez.",
    focus: "Estar pour un état"
  },
  {
    id: "es-le-sante-gap-duelen", language: "es", level: "A2", topic: "medical", type: "fill-gap", skillTags: ["health-vocabulary", "present-tense"],
    prompt: "Complétez : Después de caminar todo el día, me ___ los pies. (doler, au présent)",
    answer: "duelen",
    explanation: "Doler fonctionne comme gustar : la partie du corps est le sujet, donc le verbe s'accorde avec elle (me duele la cabeza, me duelen los pies).",
    hint: "Les pieds sont au pluriel ; o devient ue.",
    focus: "Doler avec une partie du corps"
  },
  {
    id: "es-le-sante-tr-fievre-gorge", language: "es", level: "A2", topic: "medical", type: "translation", skillTags: ["health-vocabulary", "duration"],
    prompt: "Traduisez : J'ai de la fièvre et mal à la gorge depuis deux jours.",
    answer: "Tengo fiebre y me duele la garganta desde hace dos días.",
    acceptedAnswers: [
      "Tengo fiebre y dolor de garganta desde hace dos días.",
      "Llevo dos días con fiebre y dolor de garganta.",
      "Llevo dos días con fiebre y me duele la garganta.",
      "Desde hace dos días tengo fiebre y me duele la garganta.",
      "Desde hace dos días tengo fiebre y dolor de garganta.",
      "Hace dos días que tengo fiebre y me duele la garganta.",
      "Hace dos días que tengo fiebre y dolor de garganta."
    ],
    understandable: [["tengo", "llevo"], ["fiebre"], ["garganta"], ["hace", "llevo"], ["dos", "2"], ["dias", "dia"]],
    explanation: "On dit « tener fiebre » (sans article) et « me duele la garganta ». La durée s'exprime par desde hace + durée, ou par llevo + durée + con.",
    hint: "Desde hace dos días ; me duele la garganta.",
    focus: "Décrire des symptômes et leur durée"
  },
  // ---- B1 : réclamer poliment et donner son avis ----
  {
    id: "es-le-avis-mcq-parece", language: "es", level: "B1", topic: "everyday", type: "multiple-choice", skillTags: ["everyday-vocabulary", "subjunctive"],
    prompt: "Complétez : Me parece que el precio ___ demasiado alto.",
    choices: ["es", "sea", "fuera", "seamos"],
    answer: "es",
    explanation: "Me parece que, creo que, pienso que affirment une opinion : verbe à l'indicatif. Le subjonctif n'arrive qu'avec la négation (no creo que sea…).",
    hint: "Opinion affirmée : indicatif.",
    focus: "Opinion affirmée : indicatif"
  },
  {
    id: "es-le-avis-gap-sea", language: "es", level: "B1", topic: "grammar", type: "fill-gap", skillTags: ["subjunctive", "ser-estar"],
    prompt: "Complétez : No creo que el servicio ___ suficiente. (ser, au présent)",
    answer: "sea",
    explanation: "Après no creer que, on emploie le subjonctif : que sea. Ser exprime ici une qualité du service.",
    hint: "Subjonctif présent de ser.",
    focus: "No creo que + subjonctif"
  },
  {
    id: "es-le-avis-tr-clim", language: "es", level: "B1", topic: "everyday", type: "translation", skillTags: ["polite-requests", "everyday-vocabulary"],
    prompt: "Traduisez : Je voudrais me plaindre : la climatisation ne fonctionne pas.",
    answer: "Quisiera quejarme: el aire acondicionado no funciona.",
    acceptedAnswers: [
      "Quería quejarme: el aire acondicionado no funciona.",
      "Me gustaría quejarme: el aire acondicionado no funciona.",
      "Quiero quejarme: el aire acondicionado no funciona.",
      "Quisiera presentar una queja: el aire acondicionado no funciona.",
      "Quisiera quejarme porque el aire acondicionado no funciona.",
      "Me quiero quejar: el aire acondicionado no funciona.",
      "Quisiera quejarme: el aire acondicionado no va."
    ],
    understandable: [["quisiera", "quiero", "queria", "gustaria"], ["quejarm*", "queja", "reclamar", "reclamacion", "me quiero quejar", "me queria quejar"], ["aire", "climatizacion"], ["no"], ["funciona"]],
    explanation: "Quisiera (ou me gustaría) adoucit la demande ; quejarse est un verbe pronominal (quejarme après quisiera). Le verbe funcionar est négatif avec no.",
    hint: "Quisiera + infinitif avec -me ; aire acondicionado.",
    focus: "Se plaindre poliment"
  }
];
