import type { ConversationScenario, GuidedLessonDefinition } from "./types.js";

/** Leçons guidées complémentaires (novembre 2026), ES. La révision (1) et le nombre de tours sont ajoutés par lessons.ts. */
export type NewLesson = Omit<GuidedLessonDefinition, "revision" | "conversationTurnGoal">;

export const ES_NEW_LESSONS: NewLesson[] = [
  {
    id: "lesson-es-ask-the-way", language: "es", level: "A1", sequence: 4,
    title: "Demander son chemin et se repérer",
    objective: "Aborder un passant poliment, situer un lieu et comprendre des indications simples (tout droit, à droite, à gauche).",
    focus: "Estar pour situer, genre des lieux et impératif de politesse (usted)",
    goalAffinity: ["travel", "basics"], prerequisiteLessonId: "lesson-es-arrive-at-a-hotel", estimatedMinutes: 10,
    microCourse: {
      title: "Demander, comprendre, repérer",
      introduction: "Dans la rue, on interpelle poliment un inconnu, on pose une question courte sur un lieu, puis on repère quelques mots-clés dans la réponse.",
      points: [
        "Ser ou estar : pour situer un lieu, on emploie estar (¿Dónde está el museo?) ; ser sert à dire ce que c'est (Es un museo).",
        "Genre : la calle, la plaza, la esquina sont féminins ; el semáforo, el puente, el banco sont masculins. La préposition a + el devient al, de + el devient del.",
        "Registre : à un inconnu, on dit usted. Les indications reprennent l'impératif de politesse : siga (continuez), gire (tournez), cruce (traversez). Entre amis, on dirait sigue et gira."
      ],
      examples: [
        { target: "Perdone, ¿dónde está la farmacia?", translation: "Excusez-moi, où est la pharmacie ?" },
        { target: "Siga todo recto y gire a la izquierda en el semáforo.", translation: "Continuez tout droit et tournez à gauche au feu." }
      ]
    },
    exerciseIds: [
      "es-v-ville-indications-pairs-3", "es-s-034-build", "es-s-035-listen",
      "es-v-ville-indications-art-esquina", "es-le-chemin-gap-estar", "es-le-chemin-tr-banque"
    ],
    scenarioId: "es-find-the-way",
    relevance: {
      keywords: ["derecha", "izquierda", "recto", "plaza", "esquina", "semáforo", "indications", "chemin", "está", "banco", "museo"],
      topics: ["travel"]
    }
  },
  {
    id: "lesson-es-market-shopping", language: "es", level: "A1", sequence: 5,
    title: "Au marché et au supermarché",
    objective: "Demander un fruit ou un légume en précisant la quantité, demander le prix et comprendre la réponse du vendeur.",
    focus: "Quantité + de, genre des fruits et légumes, cuesta / cuestan",
    goalAffinity: ["travel", "basics", "fluency"], prerequisiteLessonId: "lesson-es-introduce-a-group", estimatedMinutes: 10,
    microCourse: {
      title: "Acheter ce qu'il faut, au bon prix",
      introduction: "Au marché, on nomme le produit, on dit la quantité, on demande le prix. Trois mots reviennent sans cesse : quiero, kilo et cuánto.",
      points: [
        "Quantité : après un kilo, medio kilo, una docena, una botella, on met toujours de (dos kilos de naranjas). Pour demander : Quiero, Quisiera ou Póngame (donnez-moi).",
        "Genre : la fresa, la naranja, la patata sont féminins ; el tomate, el limón, el plátano sont masculins. Les noms en -a sont souvent féminins, mais pas tous.",
        "Ser ou estar : le prix se demande avec costar (cuesta pour un, cuestan pour plusieurs) ; pour le goût ou la fraîcheur, on emploie estar : las fresas están muy buenas (là, maintenant)."
      ],
      examples: [
        { target: "Quiero un kilo de tomates y dos naranjas, por favor.", translation: "Je voudrais un kilo de tomates et deux oranges, s'il vous plaît." },
        { target: "¿Cuánto cuestan las patatas? — Dos euros el kilo.", translation: "Combien coûtent les pommes de terre ? — Deux euros le kilo." }
      ]
    },
    exerciseIds: [
      "es-v-m2-fruits-pairs-1", "es-s-032-build", "es-s-028-listen",
      "es-v-m2-legumes-art-tomate", "es-le-marche-gap-estar", "es-le-marche-tr-fraises"
    ],
    scenarioId: "es-at-the-market",
    relevance: {
      keywords: ["kilo", "cuesta", "cuestan", "fruits", "legumes", "fresa", "naranja", "tomate"],
      topics: ["everyday"]
    }
  },
  {
    id: "lesson-es-doctor-pharmacy", language: "es", level: "A2", sequence: 9,
    title: "Chez le médecin ou à la pharmacie",
    objective: "Dire où l'on a mal, depuis quand, comprendre une question du médecin et demander un médicament.",
    focus: "Doler, tener + symptôme, estar pour un état, desde hace",
    goalAffinity: ["travel", "basics", "fluency"], prerequisiteLessonId: "lesson-es-find-and-identify", estimatedMinutes: 12,
    microCourse: {
      title: "Décrire un symptôme avec précision",
      introduction: "Chez le médecin, on décrit trois choses : où ça fait mal, depuis quand, et ce qu'on a déjà pris.",
      points: [
        "Ser ou estar : un état passager se dit avec estar (estoy mareado, estoy cansado) ; ser dit une caractéristique durable (soy alérgico a la penicilina). Pour la fièvre ou la toux : tengo fiebre, tengo tos (sans article). Durée : desde + point de départ (desde ayer), mais desde hace + durée (desde hace dos días), jamais « desde dos días ».",
        "Genre : la fiebre, la tos, la cabeza, la garganta sont féminins ; el dolor, el pecho, el medicamento sont masculins. Doler s'accorde avec la partie du corps : me duele la cabeza, me duelen los pies.",
        "Registre : le médecin dit usted (¿Dónde le duele?), vous aussi à un professionnel ; entre amis, on dit ¿Qué te duele? À la pharmacie, ¿Tiene algo para… ? est naturel et poli."
      ],
      examples: [
        { target: "Me duele la garganta y tengo fiebre desde ayer.", translation: "J'ai mal à la gorge et de la fièvre depuis hier." },
        { target: "¿Puede darme algo para el dolor, por favor?", translation: "Pouvez-vous me donner quelque chose contre la douleur, s'il vous plaît ?" }
      ]
    },
    exerciseIds: [
      "es-v-x-medicaments-pharmacie-pairs-4", "es-s-x-044-build", "es-s-x-042-listen",
      "es-le-sante-mcq-estoy", "es-le-sante-gap-duelen", "es-le-sante-tr-fievre-gorge"
    ],
    scenarioId: "es-at-the-doctor",
    relevance: {
      keywords: ["duele", "duelen", "dolor", "fiebre", "garganta", "receta", "estoy", "medicaments-pharmacie", "tomar"],
      topics: ["medical"]
    }
  },
  {
    id: "lesson-es-complain-and-opine", language: "es", level: "B1", sequence: 13,
    title: "Réclamer poliment et donner son avis",
    objective: "Exprimer un désaccord ou une réclamation avec tact, donner son avis et nuancer avec des connecteurs.",
    focus: "Creo que + indicatif, no creo que + subjonctif, quisiera + infinitif, connecteurs",
    goalAffinity: ["work", "fluency", "travel"], prerequisiteLessonId: "lesson-es-tell-career-story", estimatedMinutes: 14,
    microCourse: {
      title: "Dire non sans froisser",
      introduction: "Une réclamation efficace reste polie : on décrit le problème, on nuance, on demande une solution précise.",
      points: [
        "Ser ou estar : une caractéristique se dit avec ser (el servicio es lento), un état du moment avec estar (la habitación está sucia, la ducha está rota).",
        "Genre : el problema et el sistema sont masculins malgré leur terminaison ; la queja (la plainte) est féminin. En Espagne, on peut demander la hoja de reclamaciones (le registre de réclamations).",
        "Opinion et registre : creo que, me parece que + indicatif ; no creo que + subjonctif (no creo que sea justo). Adoucissez avec quisiera, me gustaría, ¿podría… ?, et nuancez avec sin embargo ou aunque."
      ],
      examples: [
        { target: "Quisiera presentar una queja: la habitación no está limpia.", translation: "Je voudrais déposer une réclamation : la chambre n'est pas propre." },
        { target: "Me parece que el servicio es lento; sin embargo, el personal es muy amable.", translation: "Je trouve que le service est lent ; cependant, le personnel est très aimable." }
      ]
    },
    exerciseIds: [
      "es-v-verbs-echanges-pairs-3", "es-s-x-138-build", "es-v-m2-connecteurs-sin-embargo",
      "es-le-avis-mcq-parece", "es-le-avis-gap-sea", "es-le-avis-tr-clim"
    ],
    scenarioId: "es-complain-politely",
    relevance: {
      keywords: ["quejarse", "devolveremos", "sin embargo", "me parece", "no creo", "quejarme", "echanges"],
      topics: ["everyday", "grammar"]
    }
  }
];

export const ES_NEW_SCENARIOS: ConversationScenario[] = [
  {
    id: "es-find-the-way",
    language: "es",
    title: "Demander son chemin dans la rue",
    description: "Interpeller un passant, dire où l'on veut aller et comprendre les indications.",
    level: "A1",
    openingPrompt: "Buenas tardes. ¿Necesita ayuda? ¿Adónde va?",
    steps: [
      {
        id: "es-find-the-way-destination",
        keywords: ["busco", "buscando", "estación", "museo", "farmacia", "hotel", "plaza", "banco", "catedral", "iglesia", "hospital", "ayuntamiento", "dónde está", "donde esta", "dónde queda", "donde queda", "dónde hay", "donde hay", "cómo llego", "como llego", "llegar", "quiero ir", "ir al", "ir a la", "voy al", "voy a la", "perdido", "perdida", "centro", "calle", "playa", "supermercado", "aeropuerto", "parada"],
        reply: "Claro, está cerca de aquí. Siga todo recto por esta calle hasta la plaza."
      },
      {
        id: "es-find-the-way-directions",
        keywords: ["todo recto", "recto", "plaza", "entiendo", "entendido", "vale", "de acuerdo", "repetir", "repita", "despacio", "derecha", "izquierda", "entonces", "luego", "y luego", "hasta la", "después", "despues"],
        reply: "Claro. Todo recto hasta la plaza; allí, gire a la derecha en el semáforo. Está enfrente de la iglesia."
      },
      {
        id: "es-find-the-way-distance",
        keywords: ["lejos", "cerca", "minutos", "a pie", "andando", "caminando", "taxi", "tarda", "tardo", "cuánto", "cuanto", "autobús", "autobus", "metro", "tiempo", "distancia"],
        reply: "Claro que no, no está lejos: a cinco minutos a pie."
      },
      {
        id: "es-find-the-way-thanks",
        keywords: ["gracias", "muchas gracias", "agradezco", "amable", "adiós", "adios", "hasta luego", "buen día", "buen dia", "perfecto", "genial"],
        reply: "Gracias a usted. ¡Que tenga un buen día!"
      }
    ]
  },
  {
    id: "es-at-the-market",
    language: "es",
    title: "Faire ses courses au marché",
    description: "Commander des fruits et légumes, demander le prix et payer.",
    level: "A1",
    openingPrompt: "¡Buenos días! ¿Qué le pongo?",
    steps: [
      {
        id: "es-at-the-market-order",
        keywords: ["quiero", "quisiera", "póngame", "pongame", "deme", "me pone", "ponme", "me da", "tiene", "kilo", "kilos", "medio kilo", "docena", "gramos", "tomates", "fresas", "naranjas", "manzanas", "patatas", "limones", "plátanos", "platanos", "uvas", "zanahorias", "huevos", "pimientos", "melón", "melon", "fruta", "lechuga", "cebollas"],
        reply: "Muy bien, ahora mismo. Las fresas están muy buenas hoy. ¿Algo más?"
      },
      {
        id: "es-at-the-market-price",
        keywords: ["cuánto", "cuanto", "cuesta", "cuestan", "precio", "vale", "valen", "euros", "total", "debo", "también", "tambien", "además", "ademas", "nada más", "nada mas", "es todo", "eso es todo", "fresas", "kilo", "medio kilo"],
        reply: "Muy bien. Son tres euros el kilo. En total, seis euros."
      },
      {
        id: "es-at-the-market-more",
        keywords: ["nada más", "nada mas", "es todo", "eso es todo", "basta", "ya está", "ya esta", "pagar", "cobrar", "tarjeta", "efectivo", "aquí tiene", "aqui tiene", "tome", "cóbreme", "cobreme", "vale", "perfecto", "de acuerdo"],
        reply: "Perfecto. Son seis euros. ¿Paga con tarjeta o en efectivo?"
      },
      {
        id: "es-at-the-market-pay",
        keywords: ["tarjeta", "efectivo", "móvil", "movil", "metálico", "metalico", "billete", "pago", "aquí tiene", "aqui tiene", "tiene cambio", "gracias", "adiós", "adios", "hasta luego"],
        reply: "Gracias. Aquí tiene su bolsa y su ticket. ¡Hasta pronto!"
      }
    ]
  },
  {
    id: "es-at-the-doctor",
    language: "es",
    title: "Décrire ses symptômes au médecin",
    description: "Dire où l'on a mal, depuis quand, répondre aux questions et comprendre l'ordonnance.",
    level: "A2",
    openingPrompt: "Buenos días. Siéntese, por favor. ¿Qué le pasa?",
    steps: [
      {
        id: "es-at-the-doctor-symptom",
        keywords: ["duele", "duelen", "dolor", "fiebre", "tos", "toso", "cabeza", "garganta", "espalda", "estómago", "estomago", "mareado", "mareada", "cansado", "cansada", "enfermo", "enferma", "resfriado", "resfriada", "gripe", "náuseas", "nauseas", "vómitos", "vomitos", "pica", "me encuentro", "me siento", "mal", "tengo"],
        reply: "Entiendo. ¿Desde cuándo tiene estos síntomas?"
      },
      {
        id: "es-at-the-doctor-duration",
        keywords: ["desde", "hace", "llevo", "día", "dia", "días", "dias", "semana", "mes", "ayer", "hoy", "anoche", "horas", "esta mañana", "esta manana", "esta tarde", "empezó", "empezo", "lunes", "martes", "miércoles", "miercoles", "jueves", "viernes", "sábado", "sabado", "domingo"],
        reply: "Entiendo. ¿Tiene alguna alergia a los medicamentos? ¿Ha tomado algo?"
      },
      {
        id: "es-at-the-doctor-allergy",
        keywords: ["alergia", "alérgico", "alergico", "alérgica", "alergica", "penicilina", "aspirina", "antibiótico", "antibiotico", "jarabe", "nunca", "no tengo", "ninguna", "nada", "ibuprofeno", "paracetamol", "pastilla", "pastillas", "he tomado", "tomé", "tome", "medicamento"],
        reply: "Muy bien, lo anoto en su historia. Le voy a recetar un analgésico. Tome una pastilla cada ocho horas, después de las comidas."
      },
      {
        id: "es-at-the-doctor-prescription",
        keywords: ["gracias", "receta", "farmacia", "vuelvo", "de acuerdo", "vale", "entiendo", "perfecto", "repetir", "repita", "cada", "dosis", "cuántos", "cuantos", "cuántas", "cuantas", "comer", "comidas", "días", "dias"],
        reply: "Perfecto. Con la receta, puede ir a la farmacia hoy mismo. Si no mejora en tres días, vuelva a la consulta."
      }
    ]
  },
  {
    id: "es-complain-politely",
    language: "es",
    title: "Réclamer poliment à l'hôtel",
    description: "Signaler un problème, donner son avis avec tact et obtenir une solution.",
    level: "B1",
    openingPrompt: "Buenas noches. Recepción, dígame. ¿En qué puedo ayudarle?",
    steps: [
      {
        id: "es-complain-politely-problem",
        keywords: ["quejarme", "queja", "reclamación", "reclamacion", "problema", "no funciona", "no va", "aire acondicionado", "sucia", "sucio", "ruido", "ruidosa", "rota", "roto", "no hay", "agua caliente", "limpia", "limpio", "calor", "frío", "frio", "ducha", "calefacción", "calefaccion"],
        reply: "Entiendo, lamento mucho el inconveniente. ¿Puede explicarme exactamente qué ocurre en su habitación?"
      },
      {
        id: "es-complain-politely-opinion",
        keywords: ["creo que", "me parece", "pienso que", "no creo", "opino", "en mi opinión", "en mi opinion", "para mí", "para mi", "desde", "desde hace", "desde ayer", "no funciona", "no va", "ruido", "sucia", "sucio", "sucias", "sucios", "rota", "roto", "inaceptable", "no puedo dormir", "agua", "demasiado", "lento", "frío", "frio", "calor"],
        reply: "Entiendo. Tiene razón y le pido disculpas. Vamos a revisarlo ahora mismo."
      },
      {
        id: "es-complain-politely-solution",
        keywords: ["podría", "podria", "cambiar", "cambien", "cambie", "otra habitación", "otra habitacion", "descuento", "rebaja", "compensación", "compensacion", "devolver", "devuelvan", "reembolso", "solución", "solucion", "arreglar", "arreglen", "arregle", "técnico", "tecnico", "mandar", "enviar", "pueden", "puede", "exijo", "pido"],
        reply: "Claro. Le podemos ofrecer otra habitación esta noche y un descuento del veinte por ciento."
      },
      {
        id: "es-complain-politely-closing",
        keywords: ["gracias", "aceptamos", "acepto", "de acuerdo", "vale", "me parece bien", "está bien", "esta bien", "buena solución", "buena solucion", "muy amable", "sin embargo", "aunque", "agradezco", "aprecio", "perfecto", "adelante"],
        reply: "Gracias a usted por su comprensión. Un botones le llevará las maletas enseguida."
      }
    ]
  }
];
