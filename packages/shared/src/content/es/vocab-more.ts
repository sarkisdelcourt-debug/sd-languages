import type { CefrLevel } from "../../types.js";
import type { ExerciseTopic, VocabSet } from "../types.js";

/**
 * Listes de vocabulaire et de verbes complémentaires (24/10/2026).
 * ATTENTION : dans VocabItem, le champ `en` contient ici le texte ESPAGNOL (infinitif pour les verbes).
 */
const vocab = (
  id: string, topic: ExerciseTopic, level: CefrLevel, title: string, skill: string, items: Array<[string, string]>
): VocabSet => ({ id, topic, level, title, skill, items: items.map(([en, fr]) => ({ en, fr })) });

export const ES_VOCAB_MORE: VocabSet[] = [
  vocab("es-v-x-ecole", "everyday", "A2", "École et études", "everyday-vocabulary", [
    ["el colegio", "l'école"], ["el profesor", "le professeur"], ["el alumno", "l'élève"], ["la nota", "la note"],
    ["los deberes", "les devoirs"], ["la pizarra", "le tableau"], ["el cuaderno", "le cahier"], ["el bolígrafo", "le stylo"],
    ["la universidad", "l'université"], ["el curso", "l'année scolaire"], ["la beca", "la bourse d'études"], ["el título", "le diplôme"],
    ["la asignatura", "la matière"], ["el recreo", "la récréation"], ["la matrícula", "l'inscription"]
  ]),
  vocab("es-v-x-sport", "everyday", "A2", "Sport et forme", "everyday-vocabulary", [
    ["el balonmano", "le handball"], ["el entrenamiento", "l'entraînement"], ["el entrenador", "l'entraîneur"], ["el equipo", "l'équipe"],
    ["la pelota", "le ballon"], ["la natación", "la natation"], ["el ciclismo", "le cyclisme"], ["el gimnasio", "la salle de sport"],
    ["el árbitro", "l'arbitre"], ["la victoria", "la victoire"], ["la derrota", "la défaite"], ["el campeonato", "le championnat"],
    ["la zapatilla", "la chaussure de sport"], ["la lesión", "la blessure"], ["la portería", "le but (la cage)"]
  ]),
  vocab("es-v-x-informatique", "everyday", "B1", "Ordinateur et internet", "everyday-vocabulary", [
    ["el portátil", "l'ordinateur portable"], ["la pantalla", "l'écran"], ["el teclado", "le clavier"], ["el ratón", "la souris"],
    ["la contraseña", "le mot de passe"], ["el archivo", "le fichier"], ["la red", "le réseau"], ["el enlace", "le lien"],
    ["la aplicación", "l'application"], ["el cargador", "le chargeur"], ["la impresora", "l'imprimante"], ["la descarga", "le téléchargement"],
    ["el navegador", "le navigateur"], ["la copia de seguridad", "la sauvegarde"], ["la actualización", "la mise à jour"]
  ]),
  vocab("es-v-x-administration", "everyday", "B1", "Administration et papiers", "work-vocabulary", [
    ["el formulario", "le formulaire"], ["la firma", "la signature"], ["el sello", "le tampon"], ["la cita previa", "le rendez-vous à prendre"],
    ["el trámite", "la démarche"], ["la solicitud", "la demande écrite"], ["el certificado", "le certificat"], ["la ventanilla", "le guichet"],
    ["la declaración de la renta", "la déclaration de revenus"], ["la notificación", "la notification"], ["el permiso", "l'autorisation"], ["el vencimiento", "l'échéance"],
    ["el justificante", "le justificatif"], ["la fotocopia", "la photocopie"], ["el DNI", "la carte d'identité"]
  ]),
  vocab("es-v-x-logement", "everyday", "B1", "Logement et location", "everyday-vocabulary", [
    ["el arrendamiento", "le bail"], ["el casero", "le propriétaire"], ["el inquilino", "le locataire"], ["la fianza", "la caution"],
    ["la escritura", "l'acte de propriété"], ["la calefacción", "le chauffage"], ["la lavadora", "la machine à laver"], ["el congelador", "le congélateur"],
    ["el grifo", "le robinet"], ["la cerradura", "la serrure"], ["la mudanza", "le déménagement"], ["el portal", "l'entrée de l'immeuble"],
    ["el vecino", "le voisin"], ["la humedad", "l'humidité"], ["la gotera", "la fuite d'eau (plafond)"]
  ]),
  vocab("es-v-x-emotions", "everyday", "B1", "Émotions et caractère", "everyday-vocabulary", [
    ["la alegría", "la joie"], ["la tristeza", "la tristesse"], ["el miedo", "la peur"], ["la vergüenza", "la honte"],
    ["el enfado", "la colère"], ["la esperanza", "l'espoir"], ["los nervios", "la nervosité, le trac"], ["la sorpresa", "la surprise"],
    ["el orgullo", "la fierté"], ["la envidia", "l'envie"], ["la soledad", "la solitude"], ["la paciencia", "la patience"],
    ["el cariño", "l'affection"], ["la confianza", "la confiance"], ["el estrés", "le stress"]
  ]),
  vocab("es-v-x-nature", "travel", "A2", "Nature et paysages", "everyday-vocabulary", [
    ["la montaña", "la montagne"], ["el río", "la rivière, le fleuve"], ["el bosque", "la forêt"], ["el lago", "le lac"],
    ["el campo", "la campagne"], ["el valle", "la vallée"], ["la isla", "l'île"], ["el desierto", "le désert"],
    ["el árbol", "l'arbre"], ["la flor", "la fleur"], ["la roca", "le rocher"], ["la hierba", "l'herbe"],
    ["la costa", "la côte"], ["la cascada", "la cascade"], ["el paisaje", "le paysage"]
  ]),
  vocab("es-v-x-douane", "travel", "B1", "Douane et frontière", "hotel-travel-vocabulary", [
    ["el aduanero", "le douanier"], ["el visado", "le visa"], ["la frontera", "la frontière"], ["el control", "le contrôle"],
    ["la declaración", "la déclaration"], ["el artículo prohibido", "l'objet interdit"], ["la mercancía", "la marchandise"], ["el viajero", "le voyageur"],
    ["el extranjero", "l'étranger"], ["la tasa", "la taxe"], ["el equipaje facturado", "le bagage en soute"], ["el tránsito", "le transit"],
    ["el detector de metales", "le détecteur de métaux"], ["la cola", "la file d'attente"], ["la inspección", "l'inspection"]
  ]),
  vocab("es-v-x-tourisme", "travel", "A2", "Tourisme et visites", "hotel-travel-vocabulary", [
    ["el monumento", "le monument"], ["la catedral", "la cathédrale"], ["el castillo", "le château"], ["el guía", "le guide"],
    ["el folleto", "la brochure"], ["la exposición", "l'exposition"], ["el recuerdo", "le souvenir"], ["la fuente", "la fontaine"],
    ["la muralla", "la muraille"], ["el palacio", "le palais"], ["la ruta", "l'itinéraire"], ["el mirador", "le point de vue"],
    ["la visita guiada", "la visite guidée"], ["el casco antiguo", "le centre historique"], ["el barrio", "le quartier"]
  ]),
  vocab("es-v-x-fetes", "everyday", "A2", "Fêtes et traditions", "everyday-vocabulary", [
    ["la Navidad", "Noël"], ["la boda", "le mariage"], ["el cumpleaños", "l'anniversaire"], ["el regalo", "le cadeau"],
    ["la fiesta", "la fête"], ["el desfile", "le défilé"], ["los fuegos artificiales", "le feu d'artifice"], ["la Nochevieja", "le réveillon du Nouvel An"],
    ["el brindis", "le toast"], ["la tarta", "le gâteau"], ["la vela", "la bougie"], ["la feria", "la foire"],
    ["la procesión", "la procession"], ["el aniversario", "l'anniversaire (d'un événement, de mariage)"], ["el invitado", "l'invité"]
  ]),
  vocab("es-v-x-cardiologie", "medical", "B1", "Cardiologie et circulation", "health-vocabulary", [
    ["la taquicardia", "la tachycardie"], ["el latido", "le battement"], ["la arteria", "l'artère"], ["la vena", "la veine"],
    ["la angina de pecho", "l'angine de poitrine"], ["la arritmia", "l'arythmie"], ["el marcapasos", "le stimulateur cardiaque"], ["el colesterol", "le cholestérol"],
    ["el ictus", "l'AVC"], ["el coágulo", "le caillot"], ["la hipertensión", "l'hypertension"], ["la ecocardiografía", "l'échographie cardiaque"],
    ["la insuficiencia cardíaca", "l'insuffisance cardiaque"], ["la palpitación", "la palpitation"], ["el soplo", "le souffle au cœur"]
  ]),
  vocab("es-v-x-pediatrie", "medical", "B1", "Pédiatrie et nourrissons", "health-vocabulary", [
    ["el bebé", "le bébé"], ["el niño", "l'enfant"], ["la guardería", "la crèche"], ["el pediatra", "le pédiatre"],
    ["la varicela", "la varicelle"], ["el sarampión", "la rougeole"], ["la otitis", "l'otite"], ["el biberón", "le biberon"],
    ["el pañal", "la couche"], ["la lactancia", "l'allaitement"], ["el crecimiento", "la croissance"], ["el carnet de vacunación", "le carnet de vaccination"],
    ["la fontanela", "la fontanelle"], ["el cólico", "la colique"], ["el chupete", "la tétine"]
  ]),
  // VERBES
  vocab("es-v-verbs-deplacement", "travel", "A2", "Verbes : se déplacer", "hotel-travel-vocabulary", [
    ["trotar", "trotter, faire du jogging"], ["saltar", "sauter"], ["rodear", "contourner"], ["atravesar", "traverser (un pays)"], ["retroceder", "reculer"],
    ["torcer", "tourner (virer)"], ["acercarse", "s'approcher"], ["alejarse", "s'éloigner"], ["avanzar", "avancer"], ["vagar", "errer"],
    ["frenar", "freiner"], ["arrastrarse", "ramper"], ["embarcar", "embarquer"], ["adelantar", "doubler"], ["tropezar", "trébucher"]
  ]),
  vocab("es-v-verbs-echanges", "everyday", "B1", "Verbes : échanger et convaincre", "everyday-vocabulary", [
    ["objetar", "objecter"], ["comentar", "commenter"], ["opinar", "donner son avis"], ["aconsejar", "conseiller"], ["sugerir", "suggérer"],
    ["proponer", "proposer"], ["mencionar", "mentionner"], ["anunciar", "annoncer"], ["quejarse", "se plaindre"], ["disculparse", "s'excuser"],
    ["insistir", "insister"], ["acordar", "convenir de, se mettre d'accord"], ["confesar", "avouer"], ["negar", "nier"], ["convencer", "convaincre"]
  ]),
  vocab("es-v-verbs-raisonnement", "everyday", "B1", "Verbes : réfléchir et décider", "everyday-vocabulary", [
    ["decidir", "décider"], ["elegir", "choisir"], ["comparar", "comparer"], ["analizar", "analyser"], ["suponer", "supposer"],
    ["sospechar", "soupçonner"], ["considerar", "considérer"], ["concluir", "conclure"], ["demostrar", "démontrer"], ["reflexionar", "réfléchir"],
    ["adivinar", "deviner"], ["planear", "planifier, projeter"], ["valorar", "évaluer"], ["deducir", "déduire"], ["descubrir", "découvrir"]
  ]),
  vocab("es-v-verbs-bureau", "everyday", "B1", "Verbes : au bureau", "work-vocabulary", [
    ["archivar", "classer"], ["remitir", "transmettre"], ["imprimir", "imprimer"], ["redactar", "rédiger"], ["revisar", "relire"],
    ["aprobar", "approuver"], ["rechazar", "refuser"], ["negociar", "négocier"], ["presentar", "présenter"], ["supervisar", "superviser"],
    ["tramitar", "traiter (un dossier)"], ["calcular", "calculer"], ["cumplir", "respecter (un délai, une règle)"], ["adjuntar", "joindre"], ["programar", "programmer"]
  ]),
  vocab("es-v-verbs-soins", "medical", "B1", "Verbes : gestes de soin", "health-vocabulary", [
    ["sanar", "guérir"], ["aliviar", "soulager"], ["extirpar", "extraire (chirurgie)"], ["inyectar", "injecter"], ["vigilar", "surveiller"],
    ["hospitalizar", "hospitaliser"], ["sufrir", "souffrir"], ["cicatrizar", "cicatriser"], ["hincharse", "enfler"], ["auscultar", "ausculter"],
    ["anestesiar", "anesthésier"], ["suturar", "suturer"], ["lesionarse", "se blesser"], ["ayunar", "jeûner"], ["palpar", "palper"]
  ]),
  vocab("es-v-verbs-transformation", "everyday", "B1", "Verbes : transformer et évoluer", "everyday-vocabulary", [
    ["transformar", "transformer"], ["reducir", "réduire"], ["ampliar", "agrandir"], ["adaptarse", "s'adapter"], ["evolucionar", "évoluer"],
    ["madurar", "mûrir"], ["envejecer", "vieillir"], ["engordar", "grossir"], ["adelgazar", "maigrir"], ["acostumbrarse", "s'habituer"],
    ["desarrollar", "développer"], ["renovar", "rénover"], ["reparar", "réparer"], ["romper", "casser"], ["mantener", "maintenir"]
  ]),
  vocab("es-v-verbs-vie-sociale", "everyday", "A2", "Verbes : la vie sociale", "everyday-vocabulary", [
    ["invitar", "inviter"], ["quedar", "se donner rendez-vous"], ["conocer", "connaître"], ["felicitar", "féliciter"], ["charlar", "bavarder"],
    ["bromear", "plaisanter"], ["acompañar", "accompagner"], ["compartir", "partager"], ["celebrar", "fêter"], ["abrazar", "serrer dans ses bras"],
    ["apoyar", "soutenir"], ["confiar", "faire confiance"], ["reírse", "rire"], ["perdonar", "pardonner"], ["despedirse", "dire au revoir"]
  ]),
  vocab("es-v-verbs-maison", "everyday", "A2", "Verbes : la maison et les courses", "everyday-vocabulary", [
    ["tender", "étendre (le linge)"], ["fregar", "faire la vaisselle"], ["barrer", "balayer"], ["planchar", "repasser"], ["regar", "arroser"],
    ["tirar", "jeter"], ["guardar", "garder, mettre de côté"], ["ordenar", "ranger (une pièce)"], ["regatear", "marchander"], ["alquilar", "louer"],
    ["vender", "vendre"], ["coser", "coudre"], ["apagar", "éteindre"], ["encender", "allumer"], ["lavar", "laver"]
  ])
];
