import type { ConversationScenario, GuidedLessonDefinition } from "./types.js";

/** Leçons guidées complémentaires (novembre 2026), DE. La révision (1) et le nombre de tours sont ajoutés par lessons.ts. */
export type NewLesson = Omit<GuidedLessonDefinition, "revision" | "conversationTurnGoal">;

export const DE_NEW_LESSONS: NewLesson[] = [
  {
    id: "lesson-de-ask-directions", language: "de", level: "A1", sequence: 4,
    title: "Demander son chemin en ville",
    objective: "Demander où se trouve un lieu, comprendre « tout droit, à gauche, à droite » et situer un lieu (rechts, links, neben).",
    focus: "Wo ist…?, suchen + accusatif, zum / zur",
    goalAffinity: ["travel", "basics"], prerequisiteLessonId: "lesson-de-build-basic-sentences", estimatedMinutes: 10,
    microCourse: {
      title: "Trouver son chemin sans se perdre",
      introduction: "Pour demander un lieu, deux tournures suffisent : Wo ist …? et Wie komme ich zu …? Ensuite, il faut reconnaître les mots d'un itinéraire : geradeaus, links, rechts.",
      points: [
        "Cas : suchen est suivi de l'accusatif (Ich suche den Bahnhof), alors que Wo ist…? appelle le nominatif (Wo ist der Bahnhof?). Après zu, c'est le datif, avec contraction : zum (der, das) et zur (die).",
        "Ordre des mots : dans une question avec un mot interrogatif, le verbe vient en deuxième position (Wo ist die Apotheke?). À la forme de politesse, l'instruction commence par le verbe : Gehen Sie geradeaus.",
        "Genre : retenez le nom avec son article, car il détermine la forme : der Bahnhof, die Apotheke, das Krankenhaus."
      ],
      examples: [
        { target: "Entschuldigung, wo ist die Apotheke?", translation: "Excusez-moi, où est la pharmacie ?" },
        { target: "Gehen Sie geradeaus und dann links.", translation: "Allez tout droit, puis à gauche." }
      ]
    },
    exerciseIds: ["de-le-a1-way-pairs", "de-s-x-022-build", "de-le-a1-way-listen", "de-le-a1-way-mcq-zum", "de-le-a1-way-gap-den", "de-le-a1-way-translation"],
    scenarioId: "de-city-directions",
    relevance: { keywords: ["bahnhof", "apotheke", "links", "rechts", "geradeaus", "ampel"] }
  },
  {
    id: "lesson-de-hair-dentist-appointment", language: "de", level: "A2", sequence: 8,
    title: "Chez le coiffeur ou le dentiste : prendre rendez-vous",
    objective: "Demander un rendez-vous, proposer un créneau et expliquer en quelques mots ce dont vous avez besoin.",
    focus: "Termin vereinbaren, beim / zum, avoir mal (haben + douleur)",
    goalAffinity: ["travel", "basics", "fluency"], prerequisiteLessonId: "lesson-de-pay-and-confirm", estimatedMinutes: 12,
    microCourse: {
      title: "Obtenir un créneau et se faire comprendre",
      introduction: "Chez le coiffeur ou le dentiste, vous devez surtout demander un créneau, dire ce que vous voulez et décrire un symptôme. Quelques formules polies font l'essentiel du travail.",
      points: [
        "Cas : der Termin se met à l'accusatif après haben (einen Termin). Après bei, c'est le datif : beim Friseur, beim Zahnarzt (chez). Avec un mouvement, on emploie zum : Ich gehe zum Zahnarzt.",
        "Ordre des mots : avec möchte (ou würde gern), l'infinitif se place en fin de phrase (Ich möchte einen Termin vereinbaren) ; hätte gern se construit directement avec un nom (Ich hätte gern einen Termin). Un repère de temps en tête déclenche l'inversion : Am Montag habe ich Zeit.",
        "Genre : der Termin, die Füllung ; pour la chevelure, l'usage courant est le pluriel die Haare (sich die Haare schneiden lassen), le singulier collectif das Haar étant plus soutenu. Les douleurs se disent au pluriel : Zahnschmerzen."
      ],
      examples: [
        { target: "Ich hätte gern einen Termin beim Zahnarzt.", translation: "Je voudrais un rendez-vous chez le dentiste." },
        { target: "Ich möchte mir die Haare schneiden lassen.", translation: "Je voudrais me faire couper les cheveux." }
      ]
    },
    exerciseIds: ["de-v-m2-dentaire-pairs-1", "de-s-x-078-build", "de-le-a2-appt-listen", "de-le-a2-appt-gap-beim", "de-le-a2-appt-translation", "de-le-a2-appt-mcq-pain"],
    scenarioId: "de-dentist-appointment",
    relevance: { keywords: ["zahn", "friseur", "haare", "termin"] }
  },
  {
    id: "lesson-de-give-opinion", language: "de", level: "B1", sequence: 12,
    title: "Donner son avis, approuver ou nuancer",
    objective: "Exprimer une opinion, approuver ou contredire poliment et nuancer un désaccord.",
    focus: "Ich finde, dass…, zustimmen + datif, Meiner Meinung nach",
    goalAffinity: ["work", "fluency"], prerequisiteLessonId: "lesson-de-explain-a-delay", estimatedMinutes: 14,
    microCourse: {
      title: "Dire ce que vous pensez, avec tact",
      introduction: "En allemand, donner son avis relève de quelques formules stables. L'enjeu est de choisir le bon niveau de politesse et de placer le verbe au bon endroit après dass.",
      points: [
        "Cas : zustimmen et widersprechen se construisent avec le datif (Ich stimme Ihnen zu). Ihrer Meinung sein met Meinung (féminin) au génitif ; meiner Meinung nach est un datif suivi de nach.",
        "Ordre des mots : après dass ou weil, le verbe conjugué part à la fin (Ich finde, dass das eine gute Idee ist). Sans dass, la proposition suivante garde l'ordre d'une principale.",
        "Genre : die Meinung, die Idee, die Lösung, der Vorschlag, das Argument — avec keine pour nier un nom féminin : keine gute Lösung."
      ],
      examples: [
        { target: "Meiner Meinung nach ist das eine gute Lösung.", translation: "À mon avis, c'est une bonne solution." },
        { target: "Da bin ich ganz Ihrer Meinung, aber ich sehe einen Nachteil.", translation: "Là, je suis tout à fait de votre avis, mais je vois un inconvénient." }
      ]
    },
    exerciseIds: ["de-le-b1-opinion-pairs", "de-le-b1-opinion-dass", "de-le-b1-opinion-mcq-agree", "de-le-b1-opinion-gap-zu", "de-le-b1-opinion-translation", "de-le-b1-opinion-listen"],
    scenarioId: "de-give-opinion-team",
    relevance: { keywords: ["meinung", "finde", "stimme", "anders", "einverstanden"] }
  },
  {
    id: "lesson-de-complain-politely", language: "de", level: "B1", sequence: 13,
    title: "Réclamer poliment et obtenir une solution",
    objective: "Décrire un problème, demander poliment une solution (échange, réparation, remboursement) et rester courtois.",
    focus: "sich beschweren über, Konjunktiv II de politesse, weil / da",
    goalAffinity: ["travel", "work", "fluency"], prerequisiteLessonId: "lesson-de-explain-health-absence", estimatedMinutes: 14,
    microCourse: {
      title: "Se plaindre sans se fâcher",
      introduction: "Une réclamation efficace tient en trois temps : constater le problème, l'adoucir, puis demander une solution précise. Le Konjunktiv II (Könnten Sie…?) fait l'essentiel de la politesse.",
      points: [
        "Cas : sich beschweren über est suivi de l'accusatif (über den Lärm) ; on se plaint auprès de quelqu'un avec bei + datif (bei der Rezeption). Zufrieden sein mit appelle le datif : mit dem Service.",
        "Ordre des mots : dans Könnten Sie mir bitte … geben?, le verbe conjugué est en tête et l'infinitif en fin. Après weil ou da, le verbe part à la fin : …, weil das Gerät defekt ist.",
        "Genre : die Erstattung, die Lösung, das Gerät, der Mangel, der Lärm. Les compléments se déclinent selon ce genre : ein anderes Zimmer (neutre), eine Erstattung (féminin)."
      ],
      examples: [
        { target: "Könnten Sie mir bitte ein anderes Zimmer geben?", translation: "Pourriez-vous me donner une autre chambre, s'il vous plaît ?" },
        { target: "Ich möchte eine Erstattung, weil das Gerät defekt ist.", translation: "Je voudrais un remboursement, parce que l'appareil est défectueux." }
      ]
    },
    exerciseIds: ["de-v-verbs-communication-sich-beschweren", "de-le-b1-complaint-gap-ueber", "de-le-b1-complaint-konj", "de-le-b1-complaint-mcq-cold", "de-le-b1-complaint-translation", "de-le-b1-complaint-listen"],
    scenarioId: "de-polite-complaint",
    relevance: { keywords: ["beschwer", "erstattung", "zimmer", "kalt", "zufrieden"] }
  }
];

export const DE_NEW_SCENARIOS: ConversationScenario[] = [
  {
    id: "de-city-directions",
    language: "de",
    title: "Demander son chemin en ville",
    description: "Demander où se trouve un lieu, choisir comment y aller et vérifier l'itinéraire.",
    level: "A1",
    openingPrompt: "Hallo! Kann ich Ihnen helfen? Wohin möchten Sie?",
    steps: [
      {
        id: "de-city-directions-place",
        keywords: ["Bahnhof", "Apotheke", "zum", "zur", "wo", "suche", "Museum", "Hotel", "Krankenhaus", "Zentrum", "Post", "Bank", "Rathaus", "Markt", "Supermarkt", "Kirche"],
        reply: "Das ist nicht weit. Möchten Sie zu Fuß gehen oder mit dem Bus fahren?"
      },
      {
        id: "de-city-directions-way",
        keywords: ["Fuß", "Bus", "gehen", "laufen", "laufe", "fahren", "fahre", "nehme", "Taxi", "Bahn", "Straßenbahn"],
        reply: "Gut. Zu Fuß sind es zehn Minuten, und die Bushaltestelle liegt auf demselben Weg: Gehen Sie hier geradeaus bis zur Ampel, dann links."
      },
      {
        id: "de-city-directions-check",
        keywords: ["Ampel", "links", "geradeaus", "verstehe", "verstanden", "klar", "danke", "okay", "nochmal", "wiederholen", "langsam", "einmal"],
        reply: "Genau: bis zur Ampel und dann links. Das Gebäude ist dann auf der rechten Seite. Haben Sie noch eine Frage?"
      },
      {
        id: "de-city-directions-thanks",
        keywords: ["danke", "vielen", "nein", "ja", "Frage", "tschüss", "Wiedersehen"],
        reply: "Gern geschehen! Einen schönen Tag noch!"
      }
    ]
  },
  {
    id: "de-dentist-appointment",
    language: "de",
    title: "Prendre rendez-vous chez le dentiste",
    description: "Demander un rendez-vous, choisir un créneau, donner ses coordonnées et signaler une allergie.",
    level: "A2",
    openingPrompt: "Zahnarztpraxis Lehmann, guten Tag. Wie kann ich Ihnen helfen?",
    steps: [
      {
        id: "de-dentist-appointment-request",
        keywords: ["Termin", "Zahnschmerzen", "Schmerzen", "Zahn", "Kontrolle", "Füllung", "Reinigung", "vereinbaren", "brauche"],
        reply: "Verstehe. Wir haben noch einen Termin am Dienstag um zehn Uhr oder am Donnerstag um halb vier. Wann passt es Ihnen besser?"
      },
      {
        id: "de-dentist-appointment-slot",
        keywords: ["Dienstag", "Donnerstag", "zehn", "halb", "vier", "Uhr", "erste", "ersten", "zweite", "zweiten", "nehme", "10", "15"],
        reply: "Gut, das ist notiert. Wie ist Ihr Name, bitte, und haben Sie eine Telefonnummer?"
      },
      {
        id: "de-dentist-appointment-name",
        keywords: ["heiße", "Name", "Nummer", "Telefonnummer", "Telefon", "Handy", "bin", "mein"],
        reply: "Danke. Bitte bringen Sie Ihre Versicherungskarte mit und kommen Sie zehn Minuten früher. Haben Sie Allergien?"
      },
      {
        id: "de-dentist-appointment-allergy",
        keywords: ["Allergie", "Allergien", "allergisch", "keine", "nein", "ja", "Penicillin", "Latex"],
        reply: "Gut, alles ist notiert. Bis zu Ihrem Termin, auf Wiederhören!"
      }
    ]
  },
  {
    id: "de-give-opinion-team",
    language: "de",
    title: "Donner son avis en équipe",
    description: "Exprimer une opinion, réagir à un avis contraire, proposer un compromis et conclure.",
    level: "B1",
    openingPrompt: "Wir diskutieren im Team: Sollen wir unsere Besprechungen künftig online statt vor Ort abhalten? Was ist Ihre Meinung?",
    steps: [
      {
        id: "de-give-opinion-team-view",
        keywords: ["Meinung", "finde", "denke", "glaube", "meiner", "Erachtens", "Ansicht", "dafür", "dagegen", "Vorteil", "besser", "sinnvoll", "online", "vor Ort", "Zeit", "persönlich", "persönlicher", "praktisch"],
        reply: "Interessant. Im Team sind nicht alle einer Meinung: Eine Kollegin sagt, online fehlt der persönliche Kontakt; ein Kollege findet, online spart man viel Zeit. Was antworten Sie den beiden?"
      },
      {
        id: "de-give-opinion-team-react",
        keywords: ["Kontakt", "stimme", "stimmt", "einverstanden", "Meinung", "sehe", "widerspreche", "finde", "denke", "glaube", "anders", "allerdings", "trotzdem", "aber", "richtig", "recht", "Punkt", "Nachteil"],
        reply: "Das ist ein guter Punkt. Wie wäre ein Kompromiss, zum Beispiel eine Besprechung pro Monat vor Ort?"
      },
      {
        id: "de-give-opinion-team-compromise",
        keywords: ["Kompromiss", "einmal", "zweimal", "Monat", "Vorschlag", "vorschlagen", "schlage", "könnten", "Idee", "einverstanden", "klingt", "gut", "ja", "besser", "lieber"],
        reply: "Gut, so machen wir es. Sind Sie damit einverstanden, dass wir das drei Monate lang testen?"
      },
      {
        id: "de-give-opinion-team-conclusion",
        keywords: ["einverstanden", "ja", "nein", "Test", "testen", "Probe", "gern", "dagegen", "klar", "gut", "okay"],
        reply: "Dann halten wir das so fest. Vielen Dank für die offene Diskussion!"
      }
    ]
  },
  {
    id: "de-polite-complaint",
    language: "de",
    title: "Réclamer poliment à l'hôtel",
    description: "Décrire un problème, préciser ce que l'on attend, choisir une solution et conclure courtoisement.",
    level: "B1",
    openingPrompt: "Guten Abend, hier ist die Rezeption. Wie kann ich Ihnen helfen?",
    steps: [
      {
        id: "de-polite-complaint-problem",
        keywords: ["Problem", "Zimmer", "Beschwerde", "beschweren", "laut", "Lärm", "kalt", "Heizung", "Dusche", "defekt", "kaputt", "funktioniert", "sauber", "leider", "geht nicht", "Wasser", "warm", "Klimaanlage", "Fernseher", "Fenster", "WLAN", "schmutzig"],
        reply: "Das tut mir leid. Seit wann besteht das Problem, und welche Lösung wünschen Sie sich?"
      },
      {
        id: "de-polite-complaint-demand",
        keywords: ["seit", "gestern", "heute", "Stunde", "Stunden", "möchte", "wünsche", "erwarte", "hätte", "anderes", "wechseln", "reparieren", "Erstattung", "Rabatt", "Lösung", "Zimmer", "neues", "schicken", "Geld", "zurück", "können", "könnten"],
        reply: "Ich verstehe Sie gut. Ein anderes Zimmer ist leider erst morgen frei, aber ich kann heute Abend einen Techniker schicken oder einen Rabatt von zwanzig Prozent anbieten. Was wäre Ihnen lieber?"
      },
      {
        id: "de-polite-complaint-choice",
        keywords: ["Techniker", "Rabatt", "Prozent", "lieber", "reparieren", "schicken", "anbieten", "einverstanden", "Option", "erste", "zweite"],
        reply: "Gut, ich veranlasse das sofort. Sind Sie damit zufrieden, oder kann ich sonst noch etwas für Sie tun?"
      },
      {
        id: "de-polite-complaint-close",
        keywords: ["zufrieden", "danke", "ja", "nein", "einverstanden", "okay", "vielen", "schriftlich", "Bestätigung"],
        reply: "Vielen Dank für Ihre Geduld. Ich schicke Ihnen die Bestätigung per E-Mail. Einen guten Abend noch!"
      }
    ]
  }
];
