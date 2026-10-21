import type { CefrLevel, ConversationScenario, LanguageCode } from "./types.js";

export const CONVERSATION_SCENARIOS: ConversationScenario[] = [
  {
    id: "en-travel-hotel",
    language: "en",
    title: "Arrivée à l'hôtel",
    description: "S'enregistrer, préciser sa réservation et demander les informations essentielles.",
    level: "A2",
    openingPrompt: "Good evening! Welcome to the Riverside Hotel. How can I help you?",
    steps: [
      {
        id: "en-travel-hotel-booking",
        keywords: ["reservation", "booking", "room"],
        reply: "Of course. What name is the reservation under?"
      },
      {
        id: "en-travel-hotel-name",
        keywords: ["name", "under", "booked"],
        reply: "Thank you. I found your reservation for two nights. May I see your passport, please?"
      },
      {
        id: "en-travel-hotel-passport",
        keywords: ["passport", "here", "sure"],
        reply: "Everything is in order. Breakfast is served from seven to ten. Would you like to know the Wi-Fi password?"
      },
      {
        id: "en-travel-hotel-wifi",
        keywords: ["wifi", "wi-fi", "password", "yes"],
        reply: "The password is RIVERSIDE24. Here is your key. Your room is on the third floor. Enjoy your stay!"
      }
    ]
  },
  {
    id: "en-daily-cafe",
    language: "en",
    title: "Commander dans un café",
    description: "Commander une boisson et un encas, puis demander l'addition.",
    level: "A1",
    openingPrompt: "Hi! What would you like to drink?",
    steps: [
      {
        id: "en-daily-cafe-drink",
        keywords: ["coffee", "tea", "water", "juice", "would like"],
        reply: "Certainly. Would you like it hot or iced?"
      },
      {
        id: "en-daily-cafe-temperature",
        keywords: ["hot", "iced", "cold"],
        reply: "Great. Would you like something to eat with that?"
      },
      {
        id: "en-daily-cafe-food",
        keywords: ["sandwich", "cake", "croissant", "nothing", "no thanks"],
        reply: "Perfect. Is that for here or to take away?"
      },
      {
        id: "en-daily-cafe-place",
        keywords: ["for here", "take away", "to go"],
        reply: "That will be six pounds, please. You can pay by card or in cash."
      }
    ]
  },
  {
    id: "en-work-project-update",
    language: "en",
    title: "Faire un point projet",
    description: "Présenter son avancement, signaler un obstacle et convenir d'une prochaine étape.",
    level: "B1",
    openingPrompt: "Let's review the project. What have you completed since our last meeting?",
    steps: [
      {
        id: "en-work-project-progress",
        keywords: ["completed", "finished", "done", "progress"],
        reply: "Good progress. Is anything currently blocking you?"
      },
      {
        id: "en-work-project-blocker",
        keywords: ["blocked", "waiting", "issue", "problem", "need"],
        reply: "I understand. What support would help you move forward?"
      },
      {
        id: "en-work-project-support",
        keywords: ["help", "support", "review", "access", "feedback"],
        reply: "That sounds reasonable. When do you expect to complete the next step?"
      },
      {
        id: "en-work-project-deadline",
        keywords: ["tomorrow", "monday", "friday", "week", "date", "by"],
        reply: "Agreed. Please send me a short update by then, and let me know sooner if the deadline is at risk."
      }
    ]
  },
  {
    id: "de-travel-station",
    language: "de",
    title: "Acheter un billet de train",
    description: "Demander un billet, choisir l'horaire et trouver le quai de départ.",
    level: "A2",
    openingPrompt: "Guten Tag! Wohin möchten Sie fahren?",
    steps: [
      {
        id: "de-travel-station-destination",
        keywords: ["nach", "fahren", "berlin", "hamburg", "münchen", "munchen"],
        reply: "Möchten Sie eine einfache Fahrt oder eine Hin- und Rückfahrt?"
      },
      {
        id: "de-travel-station-ticket",
        keywords: ["einfach", "hinfahrt", "rückfahrt", "ruckfahrt", "hin und zurück"],
        reply: "Wann möchten Sie abfahren? Der nächste Zug fährt um 14:20 Uhr."
      },
      {
        id: "de-travel-station-time",
        keywords: ["uhr", "nächste", "nachste", "vierzehn", "14", "später", "spater"],
        reply: "Gut. Die Fahrkarte kostet 32 Euro. Möchten Sie mit Karte oder bar bezahlen?"
      },
      {
        id: "de-travel-station-payment",
        keywords: ["karte", "bar", "bezahlen", "zahlen"],
        reply: "Vielen Dank. Ihr Zug fährt von Gleis sieben. Gute Reise!"
      }
    ]
  },
  {
    id: "de-daily-grocery",
    language: "de",
    title: "Faire des courses",
    description: "Demander un produit, préciser une quantité et régler ses achats.",
    level: "A1",
    openingPrompt: "Guten Morgen! Kann ich Ihnen helfen?",
    steps: [
      {
        id: "de-daily-grocery-product",
        keywords: ["suche", "brauche", "möchte", "mochte", "brot", "käse", "kase"],
        reply: "Natürlich. Wie viel möchten Sie davon?"
      },
      {
        id: "de-daily-grocery-quantity",
        keywords: ["kilo", "gramm", "stück", "stuck", "halb", "500", "zwei", "drei"],
        reply: "Gern. Möchten Sie sonst noch etwas?"
      },
      {
        id: "de-daily-grocery-more",
        keywords: ["ja", "nein", "noch", "alles", "danke"],
        reply: "Das macht zusammen zwölf Euro. Brauchen Sie eine Tüte?"
      },
      {
        id: "de-daily-grocery-bag",
        keywords: ["tüte", "tute", "tasche", "keine", "bitte"],
        reply: "Hier sind Ihre Einkäufe und der Kassenbon. Vielen Dank und einen schönen Tag!"
      }
    ]
  },
  {
    id: "de-work-meeting",
    language: "de",
    title: "Organiser une réunion",
    description: "Proposer un rendez-vous professionnel et confirmer les modalités.",
    level: "B1",
    openingPrompt: "Wir sollten diese Woche über das neue Projekt sprechen. Wann haben Sie Zeit?",
    steps: [
      {
        id: "de-work-meeting-day",
        keywords: ["montag", "dienstag", "mittwoch", "donnerstag", "freitag", "zeit"],
        reply: "Der Tag passt mir. Wäre der Vormittag oder der Nachmittag besser für Sie?"
      },
      {
        id: "de-work-meeting-time",
        keywords: ["vormittag", "nachmittag", "uhr", "morgens", "nachmittags"],
        reply: "Einverstanden. Sollen wir uns im Büro treffen oder eine Videokonferenz machen?"
      },
      {
        id: "de-work-meeting-place",
        keywords: ["büro", "buro", "online", "video", "videokonferenz", "teams"],
        reply: "Gut. Welche Punkte sollen auf die Tagesordnung?"
      },
      {
        id: "de-work-meeting-agenda",
        keywords: ["budget", "planung", "termine", "aufgaben", "fortschritt", "projekt"],
        reply: "Perfekt. Ich schicke Ihnen gleich die Einladung mit der Tagesordnung."
      }
    ]
  },
  {
    id: "es-travel-restaurant",
    language: "es",
    title: "Dîner au restaurant",
    description: "Demander une table, commander un repas et régler l'addition.",
    level: "A2",
    openingPrompt: "Buenas noches. ¿Tienen una reserva?",
    steps: [
      {
        id: "es-travel-restaurant-table",
        keywords: ["reserva", "mesa", "personas", "nombre"],
        reply: "Muy bien. Su mesa está lista. ¿Quieren ver la carta?"
      },
      {
        id: "es-travel-restaurant-menu",
        keywords: ["carta", "menú", "menu", "sí", "si", "por favor"],
        reply: "Aquí tienen. ¿Qué desean tomar?"
      },
      {
        id: "es-travel-restaurant-order",
        keywords: ["quiero", "quisiera", "tomar", "agua", "vino", "paella", "ensalada"],
        reply: "Perfecto. ¿Desean algo más?"
      },
      {
        id: "es-travel-restaurant-bill",
        keywords: ["nada más", "nada mas", "cuenta", "pagar", "gracias"],
        reply: "Claro. Les traigo la cuenta enseguida. Pueden pagar con tarjeta o en efectivo."
      }
    ]
  },
  {
    id: "es-daily-neighbours",
    language: "es",
    title: "Rencontrer un voisin",
    description: "Se présenter, parler de son lieu d'origine et échanger ses coordonnées.",
    level: "A1",
    openingPrompt: "¡Hola! Soy Marta, tu vecina. ¿Cómo te llamas?",
    steps: [
      {
        id: "es-daily-neighbours-name",
        keywords: ["me llamo", "soy", "nombre"],
        reply: "Mucho gusto. ¿De dónde eres?"
      },
      {
        id: "es-daily-neighbours-origin",
        keywords: ["soy de", "vengo de", "francia", "españa", "espana", "alemania", "inglaterra"],
        reply: "Qué bien. ¿Hace mucho que vives aquí?"
      },
      {
        id: "es-daily-neighbours-duration",
        keywords: ["día", "dia", "semana", "mes", "año", "ano", "desde", "hace"],
        reply: "Espero que te guste el barrio. ¿Necesitas ayuda con algo?"
      },
      {
        id: "es-daily-neighbours-help",
        keywords: ["ayuda", "supermercado", "autobús", "autobus", "no gracias", "teléfono", "telefono"],
        reply: "Cuando quieras, puedes preguntarme. ¡Nos vemos pronto!"
      }
    ]
  },
  {
    id: "es-work-interview",
    language: "es",
    title: "Entretien professionnel",
    description: "Présenter son expérience, ses compétences et ses motivations.",
    level: "B1",
    openingPrompt: "Buenos días. Para empezar, ¿puede hablarme un poco de su experiencia profesional?",
    steps: [
      {
        id: "es-work-interview-experience",
        keywords: ["experiencia", "trabajé", "trabaje", "trabajo", "años", "anos", "empresa"],
        reply: "Gracias. ¿Qué habilidades considera más importantes para este puesto?"
      },
      {
        id: "es-work-interview-skills",
        keywords: ["habilidad", "equipo", "comunicación", "comunicacion", "organización", "organizacion", "resolver"],
        reply: "Muy interesante. ¿Por qué le gustaría trabajar con nosotros?"
      },
      {
        id: "es-work-interview-motivation",
        keywords: ["gustaría", "gustaria", "interesa", "proyecto", "aprender", "crecer", "valores"],
        reply: "Entiendo. ¿Cuándo podría incorporarse?"
      },
      {
        id: "es-work-interview-availability",
        keywords: ["puedo", "podría", "podria", "mañana", "manana", "semana", "mes", "disponible"],
        reply: "Perfecto. Muchas gracias por su tiempo. Nos pondremos en contacto con usted muy pronto."
      }
    ]
  },
  {
    id: "en-work-service-recovery",
    language: "en",
    title: "Résoudre un incident avec un client",
    description: "Expliquer un contretemps, reconnaître son impact et négocier une solution.",
    level: "B2",
    openingPrompt: "The delivery did not arrive as agreed. Could you explain what happened?",
    steps: [
      {
        id: "en-work-service-recovery-cause",
        keywords: ["because", "delay", "supplier", "issue", "happened"],
        reply: "I understand the cause. What could have prevented this delay?"
      },
      {
        id: "en-work-service-recovery-alternative",
        keywords: ["could have", "should have", "if", "earlier", "prevented"],
        reply: "Thank you for clarifying. What solution can you offer now?"
      },
      {
        id: "en-work-service-recovery-solution",
        keywords: ["offer", "replace", "refund", "deliver", "solution"],
        reply: "That may work. Under what conditions can you guarantee it?"
      },
      {
        id: "en-work-service-recovery-commitment",
        keywords: ["guarantee", "by", "provided", "confirm", "will"],
        reply: "Agreed. Please confirm the solution and deadline in writing today."
      }
    ]
  },
  {
    id: "de-travel-disruption",
    language: "de",
    title: "Gérer un train supprimé",
    description: "Comprendre l'incident, envisager une alternative et confirmer le nouvel itinéraire.",
    level: "B2",
    openingPrompt: "Ihr Zug fällt heute aus. Wie möchten Sie Ihre Reise fortsetzen?",
    steps: [
      {
        id: "de-travel-disruption-reaction",
        keywords: ["würde", "mochte", "möchte", "alternative", "fahren"],
        reply: "Es gibt einen Ersatzzug in einer Stunde. Wäre das für Sie möglich?"
      },
      {
        id: "de-travel-disruption-condition",
        keywords: ["wenn", "wäre", "ware", "könnte", "konnte", "möglich"],
        reply: "Ja. Sie müssten allerdings in Köln umsteigen. Wäre das in Ordnung?"
      },
      {
        id: "de-travel-disruption-transfer",
        keywords: ["umsteigen", "ordnung", "verbindung", "anschluss", "zeit"],
        reply: "Der Anschluss wartet zehn Minuten. Soll ich Ihre Fahrkarte umbuchen?"
      },
      {
        id: "de-travel-disruption-confirmation",
        keywords: ["umbuchen", "bitte", "bestätigen", "bestatigen", "fahrkarte"],
        reply: "Ihre Fahrkarte ist umgebucht. Die neue Verbindung finden Sie auch in der App."
      }
    ]
  },
  {
    id: "es-work-negotiation",
    language: "es",
    title: "Négocier un délai de livraison",
    description: "Exprimer des conditions, analyser un retard et convenir d'un compromis.",
    level: "B2",
    openingPrompt: "No podemos entregar el proyecto en la fecha prevista. ¿Qué alternativa propone?",
    steps: [
      {
        id: "es-work-negotiation-proposal",
        keywords: ["propongo", "podríamos", "podriamos", "alternativa", "entregar"],
        reply: "La propuesta es interesante, pero necesitamos una primera entrega esta semana."
      },
      {
        id: "es-work-negotiation-condition",
        keywords: ["si", "siempre que", "con tal de", "podemos", "semana"],
        reply: "De acuerdo. ¿Qué habría cambiado si hubieran detectado el problema antes?"
      },
      {
        id: "es-work-negotiation-past",
        keywords: ["habríamos", "habriamos", "hubiéramos", "hubieramos", "antes", "podido"],
        reply: "Entiendo. ¿Cómo evitarán que vuelva a ocurrir?"
      },
      {
        id: "es-work-negotiation-commitment",
        keywords: ["evitar", "revisar", "garantizar", "control", "confirmar"],
        reply: "Aceptamos el nuevo plan. Envíenos hoy la confirmación con las dos fechas."
      }
    ]
  }
];

export function getScenarios(language: LanguageCode, level?: CefrLevel): ConversationScenario[] {
  return CONVERSATION_SCENARIOS.filter(
    (scenario) => scenario.language === language && (!level || scenario.level === level)
  );
}
