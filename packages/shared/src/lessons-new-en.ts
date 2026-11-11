import type { ConversationScenario, GuidedLessonDefinition } from "./types.js";

/** Leçons guidées complémentaires (novembre 2026), EN. La révision (1) et le nombre de tours sont ajoutés par lessons.ts. */
export type NewLesson = Omit<GuidedLessonDefinition, "revision" | "conversationTurnGoal">;

export const EN_NEW_LESSONS: NewLesson[] = [
  {
    id: "lesson-en-hire-a-car", language: "en", level: "A2", sequence: 7,
    title: "Louer une voiture et demander un service",
    objective: "Louer une voiture au comptoir (durée, assurance, plein) et demander poliment un service.",
    focus: "Could I…? Could you…? et questions sur le prix et les obligations",
    goalAffinity: ["travel", "basics", "fluency"], prerequisiteLessonId: "lesson-en-state-routine-and-needs", estimatedMinutes: 12,
    microCourse: {
      title: "Au comptoir de location",
      introduction: "Au comptoir, trois gestes suffisent : dire ce que vous voulez louer, poser vos questions sur le prix et les obligations, puis demander un petit service avec une formule polie.",
      points: [
        "Could I…? demande quelque chose pour vous (Could I hire…? Could I have…?) ; Could you…? demande à l'autre de faire quelque chose. Les deux sont suivis de la base verbale, sans to.",
        "Pour le prix et les règles, posez des questions courtes : Is insurance included? Do I have to return the car with a full tank?",
        "Au Royaume-Uni on dit hire a car ; aux États-Unis, rent a car. Les deux se comprennent partout."
      ],
      examples: [
        { target: "Could I hire a small car for three days, please?", translation: "Pourrais-je louer une petite voiture pour trois jours, s'il vous plaît ?" },
        { target: "Could you show me how the sat nav works?", translation: "Pourriez-vous me montrer comment fonctionne le GPS ?" }
      ]
    },
    exerciseIds: ["en-x-car-road-pairs-1", "en-trv-s-021-build", "en-trv-s-023-listen", "en-hw-car-mcq-sat-nav", "en-hw-car-gap-included", "en-hw-car-translation-key"],
    scenarioId: "en-travel-car-hire",
    relevance: { keywords: ["car", "hire", "rent", "sat nav", "insurance", "licence", "tank", "could you"] }
  },
  {
    id: "lesson-en-give-opinion", language: "en", level: "B1", sequence: 11,
    title: "Donner son avis et nuancer",
    objective: "Donner son avis, le justifier et exprimer un désaccord ou un doute sans froisser.",
    focus: "In my opinion, although, not entirely et formules de concession",
    goalAffinity: ["fluency", "work", "travel"], prerequisiteLessonId: "lesson-en-give-advice-and-request", estimatedMinutes: 14,
    microCourse: {
      title: "Dire ce que l'on pense, avec tact",
      introduction: "En anglais, un désaccord direct sonne vite sec. On reconnaît d'abord l'argument de l'autre, puis on adoucit sa propre position avec un adverbe de degré.",
      points: [
        "Pour introduire un avis : In my opinion, I think, I tend to think. On ne dit pas « according to me ».",
        "Pour adoucir : not entirely, not completely, quite, rather. I'm not entirely convinced se dit beaucoup plus facilement que I disagree.",
        "Pour concéder : I see your point, but… ou Although + proposition. Avec although, on n'ajoute pas but dans la même phrase."
      ],
      examples: [
        { target: "In my opinion, the second option is rather risky, although it's cheaper.", translation: "À mon avis, la seconde option est plutôt risquée, bien qu'elle soit moins chère." },
        { target: "I see your point, but I'm not entirely convinced.", translation: "Je comprends votre point de vue, mais je ne suis pas tout à fait convaincu." }
      ]
    },
    exerciseIds: ["en-gen-v-conversation-pairs-4", "en-day-s-002-build", "en-day-s-001-listen", "en-hw-opinion-mcq-nuance", "en-hw-opinion-gap-although", "en-hw-opinion-translation-point"],
    scenarioId: "en-daily-opinion",
    relevance: { keywords: ["opinion", "agree", "think", "fair enough", "convinced", "although", "point"] }
  },
  {
    id: "lesson-en-complain-politely", language: "en", level: "B1", sequence: 12,
    title: "Se plaindre poliment et obtenir une solution",
    objective: "Signaler un problème avec tact, le décrire précisément et demander une solution concrète.",
    focus: "I'm afraid…, Could you…, remboursement et remplacement",
    goalAffinity: ["travel", "fluency", "work"], prerequisiteLessonId: "lesson-en-explain-availability", estimatedMinutes: 14,
    microCourse: {
      title: "Du problème à la solution",
      introduction: "Une réclamation efficace reste calme : on adoucit l'annonce, on décrit le fait sans accuser, puis on propose ou on demande une solution précise.",
      points: [
        "Pour adoucir l'annonce : I'm afraid… ou I'm sorry to bother you, but… avant de décrire le problème.",
        "Pour décrire : It doesn't work (une panne), I ordered… but I received… (une erreur), The room hasn't been cleaned (un oubli).",
        "Pour demander une solution : Could you send someone to look at it? I'd like a refund, or a replacement if possible."
      ],
      examples: [
        { target: "I'm afraid the air conditioning doesn't work. Could you send someone to look at it?", translation: "Je crains que la climatisation ne marche pas. Pourriez-vous envoyer quelqu'un y jeter un œil ?" },
        { target: "I'd like a refund, or a replacement if possible.", translation: "Je voudrais un remboursement, ou un remplacement si c'est possible." }
      ]
    },
    exerciseIds: ["en-x-travel-trouble-a-refund", "en-hw-complain-pairs", "en-hw-complain-build", "en-trv-s-035-listen", "en-hw-complain-gap-brought", "en-hw-complain-translation-room"],
    scenarioId: "en-daily-complaint",
    relevance: { keywords: ["refund", "complain", "afraid", "doesn't work", "broken", "replacement", "manager", "noisy", "change room", "ordered"] }
  },
  {
    id: "lesson-en-conference-questions", language: "en", level: "B2", sequence: 16,
    title: "Intervenir dans un congrès : question, réponse, désaccord courtois",
    objective: "Poser une question précise après une communication, répondre à une objection et exprimer un désaccord courtois.",
    focus: "Could you clarify…, That's a fair point, With respect…",
    goalAffinity: ["work", "fluency", "travel"], prerequisiteLessonId: "lesson-en-analyse-missed-connection", estimatedMinutes: 16,
    microCourse: {
      title: "Prendre la parole depuis la salle",
      introduction: "Une bonne intervention de congrès tient en trois temps : un remerciement bref, une question ciblée, puis, si besoin, une réserve formulée avec courtoisie.",
      points: [
        "Pour poser la question : Thank you for the talk. Could you clarify how…? ; Would you mind if I asked a quick question? Après how, gardez l'ordre sujet + verbe.",
        "Pour répondre à une objection : That's a fair point ; I take your point, although… reconnaît l'argument sans abandonner sa position.",
        "Pour contredire poliment : With respect, I'm not sure the data support that conclusion. Visez l'argument (les données), jamais la personne."
      ],
      examples: [
        { target: "Thank you for the presentation. Could you clarify how you defined the primary outcome?", translation: "Merci pour cette présentation. Pourriez-vous préciser comment vous avez défini le critère principal ?" },
        { target: "That's a fair point; the sample was small, although the effect was consistent.", translation: "Votre remarque est juste ; l'échantillon était petit, même si l'effet était constant." }
      ]
    },
    exerciseIds: ["en-v-m2-congress-publication-pairs-3", "en-x-s-061-build", "en-med-s-053-listen", "en-hw-conf-mcq-fair-point", "en-hw-conf-gap-with", "en-hw-conf-translation-outcome"],
    scenarioId: "en-work-conference-qa",
    relevance: { keywords: ["question", "session", "mind if", "respect", "data", "conclusion", "clarify", "fair point", "workshop", "panel"] }
  }
];

export const EN_NEW_SCENARIOS: ConversationScenario[] = [
  {
    id: "en-travel-car-hire",
    language: "en",
    title: "Louer une voiture",
    description: "Dire ce que l'on veut louer, préciser la durée et le modèle, puis demander un petit service.",
    level: "A2",
    openingPrompt: "Good morning, and welcome to Quick Hire. How can I help you?",
    steps: [
      {
        id: "en-travel-car-hire-need",
        keywords: ["hire", "rent", "car", "book", "booked", "reserved", "reservation", "would like", "need", "vehicle", "pick up", "looking for"],
        reply: "Of course. Could you confirm how long you'll need the car for?"
      },
      {
        id: "en-travel-car-hire-duration",
        keywords: ["day", "days", "week", "weekend", "until", "tomorrow", "night", "nights", "back", "return", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        reply: "No problem. And could you confirm what size of car you'd like: a small one or a bigger one?"
      },
      {
        id: "en-travel-car-hire-model",
        keywords: ["small", "big", "bigger", "larger", "medium", "compact", "automatic", "manual", "family", "cheap", "cheaper", "estate", "economical", "electric", "hybrid", "diesel", "petrol", "seats"],
        reply: "Good choice. Is there anything else you need? Some customers ask for a sat nav or a child seat."
      },
      {
        id: "en-travel-car-hire-service",
        keywords: ["could you", "can you", "would you", "sat nav", "child seat", "insurance", "help", "show", "explain", "map", "key", "please", "thank", "thanks", "all", "everything", "nothing", "driver", "return", "airport"],
        reply: "Certainly, we can sort that out at the desk. Please remember to bring the car back with a full tank. Your deposit will be returned when you do."
      }
    ]
  },
  {
    id: "en-daily-opinion",
    language: "en",
    title: "Donner son avis",
    description: "Dire ce que l'on pense, le justifier, nuancer face à une objection et proposer un compromis.",
    level: "B1",
    openingPrompt: "We need to choose a restaurant for dinner after the conference. Some people want Italian, others prefer a local place. What do you think?",
    steps: [
      {
        id: "en-daily-opinion-view",
        keywords: ["think", "opinion", "view", "prefer", "feel", "seems", "rather", "better", "idea", "would", "sounds", "go for", "favour", "italian", "local", "like"],
        reply: "I see. Why do you say that?"
      },
      {
        id: "en-daily-opinion-reason",
        keywords: ["because", "since", "reason", "cheaper", "quieter", "closer", "food", "menu", "reviews", "price", "good", "better", "dishes", "authentic", "recommended", "atmosphere", "terrace", "italian", "local"],
        reply: "Fair enough. But Sam isn't convinced: she thinks the other place would be much better. How would you respond?"
      },
      {
        id: "en-daily-opinion-nuance",
        keywords: ["see", "understand", "point", "however", "although", "though", "but", "agree", "true", "fair", "convinced", "quite", "rather", "actually", "expensive", "worth"],
        reply: "That sounds like a reasonable view. So, shall we vote, or do you have another suggestion?"
      },
      {
        id: "en-daily-opinion-suggestion",
        keywords: ["suggest", "shall", "how about", "why don't", "let's", "vote", "alternative", "maybe", "perhaps", "could", "propose", "compromise", "what about", "why not", "both", "split"],
        reply: "Great idea. Let's book a table for eight o'clock, then."
      }
    ]
  },
  {
    id: "en-daily-complaint",
    language: "en",
    title: "Se plaindre poliment à l'hôtel",
    description: "Signaler un problème dans sa chambre, préciser quand il est apparu et obtenir une solution.",
    level: "B1",
    openingPrompt: "Good evening, this is reception. How can I help you?",
    steps: [
      {
        id: "en-daily-complaint-problem",
        keywords: ["afraid", "problem", "broken", "work", "working", "noisy", "noise", "cold", "hot", "water", "dirty", "cleaned", "heating", "shower", "toilet", "blocked", "window", "loud", "neighbours", "wifi", "wi fi", "tv", "leak", "smell", "issue", "complain", "complaint"],
        reply: "I'm very sorry to hear that. When did you first notice the problem?"
      },
      {
        id: "en-daily-complaint-when",
        keywords: ["since", "arrived", "yesterday", "last night", "this morning", "this afternoon", "tonight", "hour", "hours", "ago", "first", "night", "when", "checked", "started", "just now", "clock", "minutes", "evening", "morning"],
        reply: "I understand. I can send someone to look at it, or I can offer you another room. What would you prefer?"
      },
      {
        id: "en-daily-complaint-solution",
        keywords: ["another room", "other room", "different room", "move", "moving", "change", "send", "someone", "look at", "fix", "repair", "replace", "replacement", "refund", "discount", "manager", "prefer", "would like", "could you", "rather"],
        reply: "Certainly. I'll arrange that straight away. Is there anything else I can do to put this right?"
      },
      {
        id: "en-daily-complaint-closing",
        keywords: ["thank", "thanks", "nothing", "fine", "okay", "ok", "also", "compensation", "breakfast", "discount", "refund", "please", "all", "everything", "late", "checkout"],
        reply: "Of course. I'll make a note on your booking, and I do apologise again for the inconvenience."
      }
    ]
  },
  {
    id: "en-work-conference-qa",
    language: "en",
    title: "Intervenir après une communication",
    description: "Poser une question à l'orateur, nuancer face à sa réponse et exprimer un désaccord courtois.",
    level: "B2",
    openingPrompt: "Thank you for attending my talk on our new anticoagulation protocol. Are there any questions from the floor?",
    steps: [
      {
        id: "en-work-conference-qa-question",
        keywords: ["question", "ask", "clarify", "could you", "would you", "how", "why", "wondering", "curious", "outcome", "criteria", "sample", "data"],
        reply: "Thank you for the question. We followed the criteria set out in our published protocol, and the primary outcome was major bleeding within thirty days. Does that answer your question?"
      },
      {
        id: "en-work-conference-qa-reservation",
        keywords: ["but", "however", "though", "although", "not sure", "concern", "concerned", "worried", "confounder", "confounders", "bias", "sample", "small", "limitation", "still", "follow", "also", "respect", "entirely", "partly", "convinced", "wonder", "short", "missing"],
        reply: "That's a fair point, and we acknowledge it as a limitation of the study. Which part of our conclusion concerns you most?"
      },
      {
        id: "en-work-conference-qa-disagreement",
        keywords: ["conclusion", "support", "supports", "evidence", "data", "results", "interval", "effect", "significant", "power", "underpowered", "convinced", "disagree", "respect", "challenge", "randomised", "randomized", "trial", "follow", "short", "control", "comparable", "claim", "safety", "safer", "mainly"],
        reply: "Thank you, that is a constructive objection. We are planning a larger multicentre study to confirm the result. Perhaps we could continue this discussion after the session?"
      },
      {
        id: "en-work-conference-qa-closing",
        keywords: ["thank", "thanks", "coffee", "card", "email", "contact", "exchange", "glad", "pleasure", "later", "break", "absolutely", "sure", "yes", "happy", "look forward", "details", "great", "gladly", "delighted", "love", "would"],
        reply: "Excellent. Here is my card, so please do email me. Thank you all for your questions."
      }
    ]
  }
];
