import type { CefrLevel } from "../../types.js";
import type { ExerciseTopic, VocabSet } from "../types.js";

/**
 * Listes de vocabulaire complémentaires (22/10/2026).
 * ATTENTION : dans VocabItem, le champ `en` contient ici le texte ESPAGNOL.
 */
const vocab = (
  id: string, topic: ExerciseTopic, level: CefrLevel, title: string, skill: string, items: Array<[string, string]>
): VocabSet => ({ id, topic, level, title, skill, items: items.map(([en, fr]) => ({ en, fr })) });

export const ES_VOCAB_EXTRA: VocabSet[] = [
  // MÉDICAL
  vocab("es-v-x-corps-organes", "medical", "A2", "Corps et organes", "health-vocabulary", [
    ["el corazón", "le cœur"], ["el pulmón", "le poumon"], ["el hígado", "le foie"], ["el riñón", "le rein"],
    ["el cerebro", "le cerveau"], ["el hueso", "l'os"], ["el músculo", "le muscle"], ["la piel", "la peau"],
    ["la sangre", "le sang"], ["la espalda", "le dos"], ["la rodilla", "le genou"], ["el hombro", "l'épaule"],
    ["la mano", "la main"], ["el pie", "le pied"], ["el ojo", "l'œil"]
  ]),
  vocab("es-v-x-medicaments-pharmacie", "medical", "A2", "Médicaments et pharmacie", "health-vocabulary", [
    ["la pastilla", "le comprimé"], ["el jarabe", "le sirop"], ["la pomada", "la pommade"], ["la inyección", "la piqûre"],
    ["la dosis", "la dose"], ["el antibiótico", "l'antibiotique"], ["el analgésico", "l'antidouleur"], ["la vacuna", "le vaccin"],
    ["el prospecto", "la notice"], ["la caja", "la boîte"], ["el efecto secundario", "l'effet secondaire"], ["el farmacéutico", "le pharmacien"],
    ["tomar", "prendre"], ["con receta", "sur ordonnance"], ["sin receta", "sans ordonnance"]
  ]),
  vocab("es-v-x-examens-laboratoire", "medical", "B1", "Examens et laboratoire", "health-vocabulary", [
    ["el análisis de sangre", "la prise de sang"], ["la radiografía", "la radiographie"], ["la ecografía", "l'échographie"], ["el escáner", "le scanner"],
    ["la resonancia magnética", "l'IRM"], ["el electrocardiograma", "l'électrocardiogramme"], ["la muestra", "l'échantillon"], ["el resultado", "le résultat"],
    ["la orina", "l'urine"], ["la tensión arterial", "la tension artérielle"], ["el diagnóstico", "le diagnostic"], ["en ayunas", "à jeun"],
    ["el laboratorio", "le laboratoire"], ["la biopsia", "la biopsie"], ["el pinchazo", "la piqûre"]
  ]),
  vocab("es-v-x-hopital-soins", "medical", "A2", "Hôpital et soins", "health-vocabulary", [
    ["el hospital", "l'hôpital"], ["la enfermera", "l'infirmière"], ["el paciente", "le patient"], ["la consulta", "la consultation"],
    ["la sala de espera", "la salle d'attente"], ["ingresar", "hospitaliser"], ["el alta", "la sortie d'hôpital"], ["la camilla", "le brancard"],
    ["la silla de ruedas", "le fauteuil roulant"], ["el seguro médico", "l'assurance maladie"], ["el tratamiento", "le traitement"], ["el servicio", "le service"],
    ["la visita", "la visite"], ["el historial médico", "le dossier médical"], ["curar", "soigner"]
  ]),
  vocab("es-v-x-chirurgie", "medical", "B1", "Chirurgie", "health-vocabulary", [
    ["la operación", "l'opération"], ["el cirujano", "le chirurgien"], ["el quirófano", "le bloc opératoire"], ["la anestesia", "l'anesthésie"],
    ["la cicatriz", "la cicatrice"], ["el bisturí", "le scalpel"], ["la sutura", "la suture"], ["el postoperatorio", "les suites opératoires"],
    ["la recuperación", "le rétablissement"], ["el injerto", "la greffe (de tissu)"], ["el trasplante", "la transplantation (d'organe)"], ["la prótesis", "la prothèse"],
    ["operar", "opérer"], ["la hemorragia", "l'hémorragie"], ["la infección", "l'infection"]
  ]),
  vocab("es-v-x-urgences", "medical", "B1", "Urgences", "health-vocabulary", [
    ["la urgencia", "l'urgence"], ["la ambulancia", "l'ambulance"], ["el accidente", "l'accident"], ["la herida", "la blessure"],
    ["la quemadura", "la brûlure"], ["la fractura", "la fracture"], ["el desmayo", "l'évanouissement"], ["el infarto", "l'infarctus"],
    ["la reanimación", "la réanimation"], ["la respiración", "la respiration"], ["el pulso", "le pouls"], ["inconsciente", "inconscient"],
    ["grave", "grave"], ["llamar al 112", "appeler le 112"], ["los primeros auxilios", "les premiers secours"]
  ]),
  // VOYAGE
  vocab("es-v-x-aeroport", "travel", "A1", "À l'aéroport", "hotel-travel-vocabulary", [
    ["el vuelo", "le vol"], ["la puerta de embarque", "la porte d'embarquement"], ["la tarjeta de embarque", "la carte d'embarquement"], ["facturar", "enregistrer (les bagages)"],
    ["el equipaje de mano", "le bagage à main"], ["el control de seguridad", "le contrôle de sécurité"], ["la aduana", "la douane"], ["la llegada", "l'arrivée"],
    ["el despegue", "le décollage"], ["el aterrizaje", "l'atterrissage"], ["la cinta de equipajes", "le tapis à bagages"], ["la escala", "l'escale"],
    ["el pasajero", "le passager"], ["la azafata", "l'hôtesse de l'air"], ["cancelado", "annulé"]
  ]),
  vocab("es-v-x-voiture-route", "travel", "A2", "Voiture et route", "hotel-travel-vocabulary", [
    ["la gasolina", "l'essence"], ["la gasolinera", "la station-service"], ["el carné de conducir", "le permis de conduire"], ["el alquiler", "la location"],
    ["la carretera", "la route"], ["la autopista", "l'autoroute"], ["el peaje", "le péage"], ["el aparcamiento", "le parking"],
    ["el neumático", "le pneu"], ["el volante", "le volant"], ["el freno", "le frein"], ["la multa", "l'amende"],
    ["conducir", "conduire"], ["aparcar", "garer"], ["el atasco", "l'embouteillage"]
  ]),
  vocab("es-v-x-demander-chemin", "travel", "A1", "Demander son chemin", "everyday-vocabulary", [
    ["perdido", "perdu"], ["girar", "tourner"], ["seguir", "continuer"], ["cruzar", "traverser"],
    ["la manzana", "le pâté de maisons (Espagne)"], ["la cuadra", "le pâté de maisons (Amérique latine)"], ["enfrente", "en face"], ["al lado", "à côté"],
    ["detrás", "derrière"], ["delante", "devant"], ["la dirección", "l'adresse"], ["a pie", "à pied"],
    ["la rotonda", "le rond-point"], ["la acera", "le trottoir"], ["¿Cómo se llega?", "Comment y arrive-t-on ?"]
  ]),
  vocab("es-v-x-problemes-voyage", "travel", "A2", "Problèmes en voyage", "hotel-travel-vocabulary", [
    ["perder", "perdre"], ["robar", "voler (dérober)"], ["el robo", "le vol (délit)"], ["la denuncia", "la plainte"],
    ["la comisaría", "le commissariat"], ["la avería", "la panne"], ["el equipaje perdido", "le bagage perdu"], ["la cartera", "le portefeuille"],
    ["el seguro de viaje", "l'assurance voyage"], ["el consulado", "le consulat"], ["la ayuda", "l'aide"], ["perder el vuelo", "rater son vol"],
    ["estropeado", "en panne"], ["la reclamación", "la réclamation"], ["el intérprete", "l'interprète"]
  ]),
  // QUOTIDIEN
  vocab("es-v-x-vetements", "everyday", "A1", "Vêtements", "everyday-vocabulary", [
    ["la camisa", "la chemise"], ["la camiseta", "le T-shirt"], ["el pantalón", "le pantalon"], ["la falda", "la jupe"],
    ["el vestido", "la robe"], ["el abrigo", "le manteau"], ["la chaqueta", "la veste"], ["los zapatos", "les chaussures"],
    ["los calcetines", "les chaussettes"], ["el sombrero", "le chapeau"], ["la corbata", "la cravate"], ["el jersey", "le pull"],
    ["los guantes", "les gants"], ["el cinturón", "la ceinture"], ["las gafas", "les lunettes"]
  ]),
  vocab("es-v-x-maison", "everyday", "A1", "La maison", "everyday-vocabulary", [
    ["la casa", "la maison"], ["el piso", "l'appartement (Espagne)"], ["el salón", "le salon"], ["el dormitorio", "la chambre à coucher"],
    ["la cocina", "la cuisine"], ["el jardín", "le jardin"], ["la puerta", "la porte"], ["la ventana", "la fenêtre"],
    ["la escalera", "l'escalier"], ["el techo", "le plafond"], ["el suelo", "le sol"], ["la pared", "le mur"],
    ["el sofá", "le canapé"], ["la silla", "la chaise"], ["el armario", "l'armoire"]
  ]),
  vocab("es-v-x-cuisine", "everyday", "A2", "Cuisine et cuisiner", "everyday-vocabulary", [
    ["cocinar", "cuisiner"], ["freír", "frire"], ["hervir", "faire bouillir"], ["asar", "rôtir"],
    ["cortar", "couper"], ["la sartén", "la poêle"], ["la olla", "la marmite"], ["el horno", "le four"],
    ["la nevera", "le réfrigérateur"], ["el plato", "l'assiette"], ["el vaso", "le verre"], ["la cuchara", "la cuillère"],
    ["la sal", "le sel"], ["el aceite", "l'huile"], ["la receta de cocina", "la recette de cuisine"]
  ]),
  vocab("es-v-x-meteo", "everyday", "A1", "La météo", "everyday-vocabulary", [
    ["el tiempo", "le temps"], ["el sol", "le soleil"], ["la lluvia", "la pluie"], ["la nieve", "la neige"],
    ["el viento", "le vent"], ["la nube", "le nuage"], ["la tormenta", "l'orage"], ["la niebla", "le brouillard"],
    ["el calor", "la chaleur"], ["el frío", "le froid"], ["la temperatura", "la température"], ["el paraguas", "le parapluie"],
    ["llover", "pleuvoir"], ["nevar", "neiger"], ["la previsión", "la prévision"]
  ]),
  vocab("es-v-x-banque-argent", "everyday", "A2", "Banque et argent", "everyday-vocabulary", [
    ["la cuenta bancaria", "le compte bancaire"], ["el cajero automático", "le distributeur de billets"], ["sacar dinero", "retirer de l'argent"], ["depositar", "déposer (sur un compte)"],
    ["la transferencia", "le virement"], ["el préstamo", "le prêt"], ["el saldo", "le solde"], ["la comisión", "les frais"],
    ["el billete de euro", "le billet (de banque)"], ["la moneda", "la pièce de monnaie"], ["pagar", "payer"], ["el ahorro", "l'épargne"],
    ["la deuda", "la dette"], ["el impuesto", "l'impôt"], ["la factura", "la facture"]
  ]),
  vocab("es-v-x-telephone-courriel", "everyday", "B1", "Téléphone et courriel pro", "work-vocabulary", [
    ["el teléfono móvil", "le téléphone portable"], ["marcar", "composer"], ["colgar", "raccrocher"], ["contestar", "répondre (au téléphone)"],
    ["dejar un mensaje", "laisser un message"], ["el adjunto", "la pièce jointe"], ["enviar", "envoyer"], ["reenviar", "transférer"],
    ["el destinatario", "le destinataire"], ["el asunto", "l'objet"], ["Estimado señor", "Cher Monsieur"], ["Un cordial saludo", "Cordialement"],
    ["la cobertura", "le réseau"], ["la bandeja de entrada", "la boîte de réception"], ["responder", "répondre (à un message)"]
  ]),
  vocab("es-v-x-loisirs", "everyday", "A2", "Loisirs", "everyday-vocabulary", [
    ["el deporte", "le sport"], ["la música", "la musique"], ["leer", "lire"], ["la película", "le film"],
    ["el cine", "le cinéma"], ["bailar", "danser"], ["nadar", "nager"], ["correr", "courir"],
    ["pasear", "se promener"], ["la excursión", "l'excursion"], ["el partido", "le match"], ["el aficionado", "le passionné"],
    ["el juego", "le jeu"], ["cantar", "chanter"], ["el tiempo libre", "le temps libre"]
  ])
];
