import type { PhraseFix } from "./phrase-fixes.js";

/**
 * Corrections issues de la relecture indépendante des phrases du quotidien (26/10/2026), langue par langue.
 * Elles resserrent les mots-clés qui laissaient passer un sens contraire ou voisin, élargissent ceux qui refusaient une
 * formulation courante, et corrigent quelques notes. Les fautes de frappe d'un mot ne sont plus tolérées quand elles changent
 * la fin du mot (derecho/derecha) : voir `conceptsCovered`.
 */
export const EN_FIXES: Record<string, PhraseFix> = {
  "en-ph-shops-001": { setKeys: [["how much", "cost*", "price", "worth"]], setFrKeys: [["combien", "prix", "coute", "cout*"]] },
  "en-ph-intro-010": { setKeys: [["what"], ["do you do", "job", "work", "living", "profession"]] },
  "en-ph-greet-004": {
    setKeys: [["could", "can", "would", "please"], ["help me", "helping me", "hand", "help us"]],
    setFrKeys: [["pouvez", "pourriez", "auriez", "peux", "plait"], ["m'aider", "aidez moi", "aidez", "coup de main"]]
  },
  "en-ph-transport-010": { setKeys: [["left", "forgot", "forgotten", "lost"], ["bag"], ["train"], ["where"]] },
  "en-ph-medical-003": { setKeys: [["pain*"], ["painkiller*", "medic*", "something", "anything", "relief", "tablet*", "pill*"]] },
  "en-ph-cafe-010": { keys: [{ swap: ["too", ["too cooked"]] }] },
  "en-ph-weather-001": { setKeys: [["nice", "lovely", "beautiful", "good", "great", "sunny", "fine"], ["today", "weather", "sunny"]] },
  "en-ph-friends-001": { keys: [{ swap: ["how", ["how are", "how's", "how have"]] }] },
  "en-ph-shops-003": { setKeys: [["shirt"], ["medium", "an m", "size m"], ["have", "got"]], setFrKeys: [["chemise"], ["moyenne", "taille m", "en m"]] },
  "en-ph-understand-001": { setKeys: [["don't", "not", "didn't", "can't", "cannot", "couldn't"], ["underst*", "get", "follow"]] },
  "en-ph-understand-002": { keys: [{ add: ["could", ["please"]] }] },
  "en-ph-understand-003": {
    addTargets: ["More slowly, please.", "Slower, please."],
    setKeys: [["slow*"], ["speak", "talk", "down", "please", "more"]],
    note: "« more slowly » est le comparatif soigné de l'adverbe ; « slower » est courant à l'oral."
  },
  "en-ph-intro-002": { addFrVariants: ["Enchanté.", "Enchantée."], setFrKeys: [["enchante", "enchantee", "ravi", "ravie", "heureux", "heureuse", "content", "contente", "plaisir"]], keys: [{ add: ["nice", ["pleasure", "delighted", "great"]] }] },
  "en-ph-directions-007": { frKeys: [{ drop: "rue" }] },
  "en-ph-money-008": { setKeys: [["mistake", "error", "wrong"], ["bill", "check"]], setFrKeys: [["erreur", "fausse", "faute"], ["addition", "note", "facture"]] },
  "en-ph-understand-007": { keys: [{ drop: "down" }] },
  "en-ph-shops-007": {
    setKeys: [["cheaper", "less expensive", "cheap"]],
    note: "« cheaper » est neutre ; « less expensive » évite la nuance « bon marché, de mauvaise qualité » de « cheap »."
  },
  "en-ph-phone-004": { keys: [{ add: ["make", ["like", "want", "have", "get", "need"]] }] },
  "en-ph-emergency-001": { setKeys: [["call", "get", "phone", "ring"], ["ambulance"], ["quick*", "urgent", "fast", "now", "emergency", "hurry"]] },
  "en-ph-greet-003": { keys: [{ add: ["past", ["pass"]] }] },
  "en-ph-weather-006": { keys: [{ swap: ["rain", ["rain*"]] }] },
  "en-ph-hobbies-009": { keys: [{ swap: ["surf", ["surf*"]] }] },
  "en-ph-hobbies-008": { keys: [{ swap: ["camping", ["camp*"]] }], dropFrVariants: ["L'été prochain, nous ferons du camping en Écosse."] },
  "en-ph-emergency-007": { keys: [{ add: ["hit", ["hurt"]] }] },
  "en-ph-hotel-005": { keys: [{ swap: ["air", ["air*"]] }] },
  "en-ph-hotel-008": { keys: [{ swap: ["bags", ["bags", "bag"]] }] },
  "en-ph-understand-008": { keys: [{ add: ["didn't", ["not", "did not"]] }, { add: ["hear", ["heard"]] }] },
  "en-ph-friends-005": { keys: [{ add: ["great", ["amazing", "brilliant", "wonderful"]] }, { add: ["evening", ["party"]] }] },
  "en-ph-shops-002": { keys: [{ add: ["looking", ["browsing"]] }], addTargets: ["Just browsing, thanks."] },
  "en-ph-money-006": { keys: [{ add: ["please", ["i'd", "would", "like", "need"]] }] },
  "en-ph-cafe-008": { keys: [{ swap: ["waiting", ["wait*"]] }] },
  "en-ph-phone-009": { keys: [{ add: ["rebook", ["postpone*", "put off", "change"]] }] },
  "en-ph-shops-010": { keys: [{ add: ["refund*", ["reimburs*"]] }] },
  "en-ph-phone-010": { keys: [{ add: ["line", ["connection", "signal"]] }] },
  "en-ph-transport-009": { keys: [{ add: ["another", ["new", "alternative"]] }] },
  "en-ph-phone-007": { keys: [{ drop: "back" }] },
  "en-ph-medical-010": { keys: [{ add: ["down", ["still", "drop*", "better"]] }] },
  "en-ph-weather-009": { keys: [{ add: ["cool*", ["fresh*", "cold*"]] }], note: "Present perfect pour une situation qui dure depuis le début de la semaine." },
  "en-ph-weather-008": { keys: [{ add: ["say", ["says", "weather", "according"]] }] },
  "en-ph-work-007": { keys: [{ add: ["turn", ["switch*", "boot*", "work*"]] }] },
  "en-ph-emergency-006": { keys: [{ add: ["died", ["flat"]] }] },
  "en-ph-medical-005": { keys: [{ add: ["medication", ["treatment", "pill*", "tablet*"]] }] },
  "en-ph-hobbies-005": { keys: [{ add: ["free", ["leisure"]] }] },
  "en-ph-directions-002": { keys: [{ swap: ["walk", ["walk*"]] }] },
  "en-ph-hobbies-002": { frKeys: [{ add: ["joue", ["fais"]] }] },
  "en-ph-money-001": { dropTargets: ["Can I pay by card?"] },
  "en-ph-work-001": { note: "Lieu de travail : « at the hospital » ou « in a hospital ». Attention : « in hospital » sans article (britannique) veut dire « hospitalisé »." },
  "en-ph-emergency-008": { note: "« hurt » est courant à l'oral ; « injured » est plus formel (police, assurance)." }
};

export const DE_FIXES: Record<string, PhraseFix> = {
  "de-ph-intro-001": { setKeys: [["heiße", "heisse", "name", "bin"], ["marc"]], setFrKeys: [["appelle", "nom", "c'est", "suis"], ["marc"]] },
  "de-ph-intro-002": { setKeys: [["komme", "bin", "stamme"], ["aus"], ["frankreich"]], setFrKeys: [["viens", "originaire", "suis"], ["de france", "francais", "francaise"]] },
  "de-ph-intro-005": { addTargets: ["Freut mich."] },
  "de-ph-polite-005": { setKeys: [["gern*", "bitte", "ursache", "nichts", "problem"], ["tag"]] },
  "de-ph-polite-008": { setKeys: [["duzen", "per du"], ["wir", "uns"]] },
  "de-ph-compr-001": { setKeys: [["wiederholen", "noch einmal", "nochmal"], ["bitte"]], addTargets: ["Wie bitte?"], frKeys: [{ swap: ["repeter", ["repet*", "redi*"]] }] },
  "de-ph-intro-010": { frKeys: [{ swap: ["medical", ["medical*", "medecin*"]] }] },
  "de-ph-money-009": { frKeys: [{ swap: ["refuse", ["refus*"]] }] },
  "de-ph-weather-004": { frKeys: [{ swap: ["neige", ["neig*"]] }] },
  "de-ph-compr-005": { setKeys: [["sagt", "heißt"], ["deutsch", "deutschen"], ["wie", "was"]] },
  "de-ph-cafe-006": {
    setKeys: [["bin", "esse", "ernähre"], ["vegetarier*", "vegetarisch", "kein fleisch", "keine fleisch", "ohne fleisch"]],
    setFrKeys: [["suis", "mange"], ["vegetarien*", "pas de viande", "sans viande"]]
  },
  "de-ph-cafe-008": { setKeys: [["rechnung", "zahlen", "zahle", "bezahl*"], ["bitte"]] },
  "de-ph-urgence-004": { addTargets: ["Mir wurde meine Brieftasche gestohlen."], keys: [{ add: ["geldbörse", ["brieftasche"]] }] },
  "de-ph-family-007": { setFrKeys: [["trois", "3"], ["plus", "age", "aine"], ["moi"]] },
  "de-ph-work-002": { keys: [{ drop: "facharzt*" }] },
  "de-ph-weather-009": {
    setKeys: [["spät", "uhr"], ["halb neun", "halb 9", "acht uhr dreißig", "acht uhr dreissig", "8 uhr 30", "acht uhr 30", "8 30"]],
    frKeys: [{ add: ["demie", ["30"]] }]
  },
  "de-ph-urgence-007": { keys: [{ swap: ["nicht", ["nicht", "schlecht", "übel"]] }] },
  "de-ph-family-006": { setKeys: [["sonntag", "sonntags"], ["jed*", "sonntags"], ["großeltern", "grosseltern"], ["sehen", "treffen", "besuchen"]] },
  "de-ph-medical-007": { keys: [{ add: ["atmen", ["einatmen"]] }] },
  "de-ph-money-010": { keys: [{ add: ["zwanzig*", ["20"]] }] },
  "de-ph-money-007": { keys: [{ swap: ["stimmt", ["stimmt nicht"]] }] },
  "de-ph-phone-008": { frKeys: [{ addGroup: ["trompe", "faux", "mauvais", "erreur"] }] },
  "de-ph-phone-003": { keys: [{ addGroup: ["sie", "können", "könnten", "bitte"] }] },
  "de-ph-phone-006": { keys: [{ addGroup: ["vereinbaren", "möchte", "hätte", "machen", "kann", "brauche", "bräuchte"] }] },
  "de-ph-transport-010": { keys: [{ add: ["annulliert", ["storniert", "abgesagt", "gecancelt"]] }] },
  "de-ph-work-005": { keys: [{ swap: ["spät", ["spät", "verspät*"]] }] },
  "de-ph-direction-008": { keys: [{ add: ["karte", ["plan"]] }] }
};

export const ES_FIXES: Record<string, PhraseFix> = {
  "es-ph-understand-001": { setKeys: [["no", "ni"], ["entiend*", "entend*", "comprend*"]], setFrKeys: [["ne", "n", "pas"], ["comprend*", "compris", "saisis"]] },
  "es-ph-understand-003": { setFrKeys: [["lentement", "doucement", "moins vite", "pas si vite", "ralenti*"]] },
  "es-ph-shop-003": { setKeys: [["tiene", "tienen", "hay"], ["talla"], ["grande", "mayor"]], setFrKeys: [["taille"], ["grande", "dessus"]] },
  "es-ph-basics-010": { setKeys: [["ayud*"], ["puedo", "necesita", "en que"]] },
  "es-ph-work-007": {
    setKeys: [["semana"], ["vacaciones", "libre", "permiso", "licencia"], ["que viene", "proxima", "siguiente"]],
    setFrKeys: [["semaine"], ["conge", "vacances"], ["prochaine"]],
    dropFrVariants: ["La semaine prochaine, je ne travaille pas."]
  },
  "es-ph-cafe-003": { keys: [{ add: ["ver", ["quisiera", "quiero", "queria", "da", "dame"]] }] },
  "es-ph-understand-009": { setKeys: [["entiend*", "entend*", "comprend*"], ["gracias"]] },
  "es-ph-shop-010": { keys: [{ swap: ["cambiar", ["cambi*"]] }] },
  "es-ph-phone-007": { keys: [{ add: ["quiero", ["pedir", "gustaria", "puedo", "concertar", "agendar"]] }] },
  "es-ph-greet-005": { setKeys: [["disculpe", "disculpa", "perdón", "perdone", "permiso"], ["pasar", "permiso"]] },
  "es-ph-numbers-008": { setKeys: [["número", "numero", "teléfono", "telefono", "móvil", "movil"], ["612", "seis uno dos"], ["345", "tres cuatro cinco"], ["678", "seis siete ocho"]] },
  "es-ph-cafe-007": { keys: [{ add: ["tomar*", ["para mi"]] }] },
  "es-ph-weather-006": { keys: [{ add: ["tiempo", ["sol"]] }] },
  "es-ph-work-004": { keys: [{ add: ["doce", ["12"]] }] },
  "es-ph-numbers-009": { keys: [{ add: ["dos y media", ["14 30", "14h30", "dos y treinta"]] }] },
  "es-ph-understand-006": { keys: [{ drop: "dice" }] },
  "es-ph-money-004": { setKeys: [["dónde", "donde"], ["sacar", "retirar", "cajero", "efectivo"]] },
  "es-ph-intro-002": { setKeys: [["gusto", "encantado", "encantada", "placer"]] },
  "es-ph-cafe-004": { keys: [{ swap: ["cuenta", ["la cuenta"]] }], note: "On dit « la cuenta » ; « la adición » existe en Argentine et en Uruguay." }
};
