import type { Tile, Card } from './types';

/**
 * List of 16 tiles forming the Alcooly board.
 * All texts are in French, and properties are labelled with "Gorgées" instead of sips.
 */
export const INITIAL_TILES: Tile[] = [
  { id: 0, name: 'DÉPART', type: 'start', description: 'Chaque passage distribue 2 gorgées !', color: '#00f2fe' },
  { id: 1, name: 'Bar 1', type: 'bar', description: '', color: '#ff007f', price: 3, level: 0 },
  { id: 2, name: 'Carte Mystère', type: 'card', description: '', color: '#a015ff' },
  { id: 3, name: 'Radar de Vitesse 📸', type: 'chill', description: '', color: '#ff3333' },
  { id: 4, name: 'Bar 2', type: 'bar', description: '', color: '#ff007f', price: 4, level: 0 },
  { id: 5, name: 'L\'Énigme de l\'Apéro', type: 'minigame', description: '', color: '#00ffff' },
  { id: 6, name: 'Carte Mystère', type: 'card', description: '', color: '#a015ff' },
  { id: 7, name: 'Bar 3', type: 'bar', description: '', color: '#ff007f', price: 4, level: 0 },
  { id: 8, name: 'CELLULE DÉGRISEMENT', type: 'prison', description: 'Bloqué ! Payer la caution (2 shots / 6G) ou passer son tour.', color: '#ff3333' },
  { id: 9, name: 'Bar 4', type: 'bar', description: '', color: '#ff007f', price: 5, level: 0 },
  { id: 10, name: 'Carte Mystère', type: 'card', description: '', color: '#a015ff' },
  { id: 11, name: 'Alcootest Surprise 🧪', type: 'minigame', description: '', color: '#ffff00' },
  { id: 12, name: 'La Bouteille Inversée', type: 'bottle', description: '', color: '#39ff14' },
  { id: 13, name: 'Bar 5', type: 'bar', description: '', color: '#ff007f', price: 6, level: 0 },
  { id: 14, name: 'Carte Mystère', type: 'card', description: '', color: '#a015ff' },
  { id: 15, name: 'Bar 6', type: 'bar', description: '', color: '#ff007f', price: 3, level: 0 },
  { id: 16, name: 'Pause Chill', type: 'chill', description: '', color: '#00f2fe' },
  { id: 17, name: 'Bar 7', type: 'bar', description: '', color: '#ff007f', price: 5, level: 0 },
  { id: 18, name: 'Carte Mystère', type: 'card', description: '', color: '#a015ff' },
  { id: 19, name: 'Tournée Générale', type: 'minigame', description: '', color: '#00ffff' },
  { id: 20, name: 'Bar 8', type: 'bar', description: '', color: '#ff007f', price: 5, level: 0 },
  { id: 21, name: 'Taxe Alcool', type: 'tax', description: '', color: '#ffff00' },
  { id: 22, name: 'Carte Mystère', type: 'card', description: '', color: '#a015ff' },
  { id: 23, name: 'Bar 9', type: 'bar', description: '', color: '#ff007f', price: 4, level: 0 },
  { id: 24, name: 'ALLEZ EN DÉGRISEMENT', type: 'goto_prison', description: 'File directement en cellule de dégrisement sans passer par DÉPART.', color: '#ff3333' },
  { id: 25, name: 'Bar 10', type: 'bar', description: '', color: '#ff007f', price: 6, level: 0 },
  { id: 26, name: 'Carte Mystère', type: 'card', description: '', color: '#a015ff' },
  { id: 27, name: 'La Bouteille Inversée', type: 'bottle', description: '', color: '#39ff14' },
  { id: 28, name: 'Bar 11', type: 'bar', description: '', color: '#ff007f', price: 4, level: 0 },
  { id: 29, name: 'Carte Mystère', type: 'card', description: '', color: '#a015ff' },
  { id: 30, name: 'Alcootest Surprise 🧪', type: 'minigame', description: '', color: '#ffff00' },
  { id: 31, name: 'Bar 12', type: 'bar', description: '', color: '#ff007f', price: 6, level: 0 }
];

/**
 * Deck of 16 traditional playing cards.
 * - Spades (Pique ♠️) = Penalties & Shots
 * - Hearts (Coeur ♥️) = Duos & Toasts
 * - Diamonds (Carreau ♦️) = Actions & Challenges
 * - Clubs (Trèfle ♣️) = Distributions & Rules
 */
export const CARDS_DATABASE: Card[] = [
  // --- ♠️ PIQUE (Pénalités & Shots) ---
  {
    id: 's1',
    category: 'action',
    suit: 'pique',
    cardValue: 'As',
    title: 'L\'As de Pique ♠️',
    text: 'Le pic de la mort ! Tous les joueurs possédant une carte fétiche de Pique ♠️ doivent boire un shot (cul sec). Si personne n\'a de Pique, tout le monde boit 1 gorgée.',
    penalty: 6,
    // Bouton UI :
    // - Si au moins un joueur a la carte fétiche Pique ♠️ : "🍻 Faire boire cul sec à : {noms}"
    // - Sinon : "🍻 Tout le monde boit 1G"
  },
  {
    id: 's2',
    category: 'action',
    suit: 'pique',
    cardValue: '7',
    title: 'Le 7 de Pique ♠️',
    text: 'Tempête Noire ! Tous les joueurs ayant une carte fétiche noire (♠️ Pique ou ♣️ Trèfle) boivent 3 gorgées. Si personne n\'a de carte noire, le joueur actif en boit 2 !',
    penalty: 3,
    // Bouton UI :
    // - Si au moins un joueur a une carte fétiche noire (Pique/Trèfle) : "🍻 Faire boire 3G à : {noms}"
    // - Sinon : "🍺 Je bois 2G (car aucun fétiche noir)"
  },
  {
    id: 's3', // [CORRIGÉ]
    category: 'action',
    suit: 'pique',
    cardValue: 'Valet',
    title: 'Le Valet de Pique ♠️',
    text: 'Le poids des âges ! Tous les joueurs ayant une carte fétiche de Pique ♠️ boivent 3 gorgées. Si personne n\'a de Pique, tout le monde cul sec sinon case départ.',
    penalty: 3,
    // Bouton UI :
    // - Si au moins un joueur a la carte fétiche Pique ♠️ : "🍻 Faire boire 3G à : {noms}"
    // - Sinon : "🍻 Tout le monde boit 1G"
    //correction: affiche un choix sur chaque joueur de faire cul sec ou cas depart (bouton multiple avec effet de recul pour les joueurs choisissant la case depart ou boir cul sec)
  },
  {
    id: 's4', // [CORRIGÉ]
    category: 'movement',
    suit: 'pique',
    cardValue: '10',
    title: 'Le 10 de Pique ♠️',
    text: "Pression policière ! Les flics font une descente de routine. Le joueur possédant la carte fétiche de Pique ♠️ (ou le joueur actif si aucun Pique n'est en jeu) recule de 2 cases immédiatement ! (Pas de pénalité de boisson).",
    penalty: 0,
    // Boutons UI :
    // -correction si pas de pique: "✔️ Tout le monde recule sauf dans le degrepissement"
    // - correction si pique : "{joueurs} recule de 2 cases à effet de recul immédiat🔥"
  },

  // --- ♥️ CŒUR (Duos & Alliances) ---
  {
    id: 'h1', // [CORRIGÉ]
    category: 'truth',
    suit: 'coeur',
    cardValue: 'Dame',
    title: 'La Dame de Cœur ♥️',
    text: 'L\'amour partagé ! Tous les joueurs ayant une carte fétiche de Cœur ♥️ choisissent un partenaire. Ils trinquent et boivent 2 gorgées chacun les bras croisés. Si personne n\'a de Cœur, le joueur actif recule de 3 cases.',
    penalty: 2,
    // Boutons UI :
    // - Si au moins un joueur a la carte fétiche Cœur ♥️ : Boutons de sélection de chaque joueur qui trinque, puis "Valider (2G chacun)"
    // - correction : Sinon : Boutons "joueur actif recule de 3 cases"
  },
  {
    id: 'h2', // [CORRIGÉ]
    category: 'truth',
    suit: 'coeur',
    cardValue: '10',
    title: 'Le 10 de Cœur ♥️',
    text: 'Dossier embarrassant ! Le joueur possédant la carte fétiche du 10 de Cœur ♥️ doit raconter un secret marrant sur son voisin de gauche, sinon il boit 3 gorgées. Si personne ne l\'a, le joueur actif recule de 4 cases',
    penalty: 3,
    // Boutons UI :
    // - "Réussi"
    // - correction :"Je recule de 4 cases"
  },
  {
    //correction sur le texte:
    id: 'h3', // [CORRIGÉ]
    category: 'truth',
    suit: 'coeur',
    cardValue: 'As',
    title: 'L\'As de Cœur ♥️',
    text: 'Âmes Sœurs ! Le joueur avec la carte fétiche de Cœur ♥️ la plus forte lie deux joueurs. Chaque fois que l\'un boit, l\'autre prend la même dose pendant 2 tours. Si pas de coeur, le joueurs actif recule de 2 cases',
    penalty: 2,
    // Boutons UI :
    // - Deux listes déroulantes pour sélectionner les deux joueurs à lier
    // - correction :"Je recule de deux cases"
  },
  {
    id: 'h4',
    category: 'truth',
    suit: 'coeur',
    cardValue: '8',
    title: 'Le 8 de Cœur ♥️',
    text: 'Confession intime ! Le joueur possédant la carte fétiche du 8 de Cœur ♥️ doit chuchoter un secret marrant à son voisin de droite, sinon il boit 3 gorgées. Si personne ne l\'a, le joueur actif s\'y colle !',
    penalty: 3,
    // Boutons UI :
    // - "Réussi"
    // - "Je Bois 3G"
  },

  // --- ♦️ CARREAU (Défis & Mimes) ---
  {
    //correction sur le texte:
    id: 'd1', // [CORRIGÉ]
    category: 'rule',
    suit: 'carreau',
    cardValue: 'Roi',
    title: 'Le Roi de Carreau ♦️',
    text: 'Le Roi du mime ! Le joueur possédant la carte fétiche du Roi de Carreau ♦️ doit mimer un objet choisi par le groupe en 30s. Si raté, il recule de 3 cases. Si personne ne l\'a, le joueur actif recule de 3 cases',
    penalty: 3,
    // Boutons UI :
    // - correction:"{joueur} possedant le roi de carreau mime sinon recule de 3 cases"
    // - correction:"Je recule de 3 cases"
  },
  {
    id: 'd2', // [CORRIGÉ]
    category: 'rule',
    suit: 'carreau',
    cardValue: 'Valet',
    title: 'Le Valet de Carreau ♦️',
    text: 'Équilibre précaire ! Tous les joueurs possédant une carte fétiche de Carreau ♦️ doivent tenir en équilibre sur une jambe pendant 20 secondes. Ceux qui tombent boivent 3 gorgées. Si personne n\'a de Carreau, le joueur actif s\'y colle !',
    penalty: 3,
    // Boutons UI :
    // - Correction: afficher la liste des joueurs ayant le carreau
    // -correction : si pas de joueur ayant le carreau le joueur actif boit 3 gorgées
  },
  {
    id: 'd3', // [CORRIGÉ]
    category: 'movement',
    suit: 'carreau',
    cardValue: '9',
    title: 'Le 9 de Carreau ♦️',
    text: 'Retour aux sources ! Faux départ ou nostalgie ? Retourne directement sur la case DÉPART. Aucun bonus de passage n\'est accordé.',
    penalty: 0,
    // Boutons UI :
    // - correction:"✔️ Je retourne à la case départ"
    // - correction:"🔥 je bois cul sec"
  },
  {
    id: 'd4', // [CORRIGÉ]
    category: 'movement',
    suit: 'carreau',
    cardValue: '7',
    title: 'Le 7 de Carreau ♦️',
    text: 'Marche arrière ! Le joueur possédant la carte fétiche de Carreau ♦️ (ou le joueur actif si aucun Carreau n\'est en jeu) recule de 3 cases immédiatement !',
    penalty: 0,
    // Boutons UI :
    // - "✔️ Réussi"
    // - correction:"🔥 Je recule de 3 cases"
  },

  // --- ♣️ TRÈFLE (Distributions & Règles) ---
  {
    //correction dans le texte:
    id: 'c1', // [CORRIGÉ]
    category: 'never',
    suit: 'trefle',
    cardValue: 'Roi',
    title: 'Le Roi de Trèfle ♣️',
    text: 'Générosité Royale ! Le joueur possédant la carte fétiche du Roi de Trèfle ♣️ distribue 1 shot de pénalité librement à qui il/elle veut. Si personne ne l\'a, le joueur actif distribue 1 shot à qui il/elle veut. si la personne choisi refuse de boire, il retourne à la case départ',
    penalty: 5,
    // Boutons UI :
    // - correction:"c'est fait!"
    // - correction:"affiche la liste des joueurs et un bouton pour retourner le joueur selectionner à la case départ"

  },
  {
    id: 'c2',
    category: 'never',
    suit: 'trefle',
    cardValue: 'As',
    title: 'L\'As de Trèfle ♣️',
    text: 'Grand Duel ! Le joueur ayant la carte fétiche de plus grande valeur (As > Roi > Dame > Valet > 10 > 9 > 8 > 7 ; en cas d\'égalité de valeur, l\'ordre de priorité est Pique > Cœur > Carreau > Trèfle) bois cul sec ou revien à la case départ. Celui avec la plus basse case départ aussi !',
    penalty: 6,
    // Boutons UI :
    // - Pour le joueur ayant la plus forte carte : "Boire Cul Sec" et "Retour au DÉPART"
    // - "Appliquer les sentences" (le joueur avec la plus faible retourne d'office au DÉPART)
  },
  {
    //correction dans le texte:
    id: 'c3', // [CORRIGÉ]
    category: 'never',
    suit: 'trefle',
    cardValue: '10',
    title: 'Le 10 de Trèfle ♣️',
    text: 'Le Roi du silence ! Lancez un jeu de verre d\'eau. le premier qui fait deborder le verre boit cul sec ou revient à la case départ',
    penalty: 3,
    // Boutons UI :
    // correction: Liste les joueurs et un bouton de case départ chacun
    //correction: "c'est fait!" pour valider
  },
  {
    //correction dans le texte:
    id: 'c4', // [CORRIGÉ]
    category: 'never',
    suit: 'trefle',
    cardValue: '8',
    title: 'Le 8 de Trèfle ♣️',
    text: 'Choisi un personne de ton choix, action ou verité, si la personne ne veut ni l\'action ni la verité, il boit cul sec, sinon il recule de 4 cases',
    penalty: 1,
    // Boutons UI :
    // correction: affiche la liste des joueurs et un bouton recule de 4 cases pour le joueur à effet immédiat!
    //correction "c'est fait!"
  },
  // --- NOUVELLES CARTES CHIFOUMI ---
  {
    //correction dans le texte:
    id: 's5', // [CORRIGÉ]
    category: 'action',
    suit: 'pique',
    cardValue: '9',
    title: 'Le 9 de Pique ♠️',
    text: 'Chifoumi des Ténèbres ! Lance un duel de Pierre-Feuille-Ciseaux avec le joueur à ta droite. Le perdant boit 3 gorgées, sinon recule de 4 cases !',
    penalty: 3,
    // Boutons UI :
    // - correction : "Je perds (Moi) ou un bouton recule de 3 cases à effets immédiat !"
    // - correction : "{Nom_voisin_droite} perd ou recule de 3 cases à effet immédiat"
  },
  {
    //correction dans le texte:
    id: 'h5', // [CORRIGÉ]
    category: 'truth',
    suit: 'coeur',
    cardValue: '9',
    title: 'Le 9 de Cœur ♥️',
    text: 'Chifoumi Amoureux ! Affronte ton voisin de gauche au Pierre-Feuille-Ciseaux. Si tu gagnes, il boit 2 gorgées. Si tu perds, vous buvez 1 gorgée tous les deux ! sinon les deux reviennt à la case départ !',
    penalty: 2,
    // Boutons UI :
    // - correction : "Gagné ({Nom_voisin_gauche} boit 2G) et un bouton revenir à la case depart"
    // - correction : "Perdu (Les deux boivent 1G) et un bouton revenir à la case depart en listant les joueurs"
  },
  {
    //correction dans le texte:
    id: 'd5', // [CORRIGÉ]
    category: 'rule',
    suit: 'carreau',
    cardValue: '8',
    title: 'Le 8 de Carreau ♦️',
    text: 'Le Roi du Chifoumi ! Le joueur possédant la carte fétiche de Carreau ♦️ affronte qui il veut au Pierre-Feuille-Ciseaux. Le perdant prend 3 gorgées sinon recules de 3 cases. Si personne ne l\'a, le joueur actif recule de 5 cases',
    penalty: 3,
    // Boutons UI :
    // - correction : liste des joueurs avec bouton reculer de 3 cases à effet immediat!
    // -correction : "C'est fait" pour valider
  },
  {
    //correction dans le texte:
    id: 'c5', // [CORRIGÉ]
    category: 'never',
    suit: 'trefle',
    cardValue: '9',
    title: 'Le 9 de Trèfle ♣️',
    text: 'Chifoumi Général ! Tout le monde joue un coup de Pierre-Feuille-Ciseaux en même temps. Tous ceux qui font le signe minoritaire boivent 2 gorgées ou reculer de 5 cases!',
    penalty: 2,
    // Boutons UI :
    // - Boutons de sélection individuelle pour chaque joueur faisant le signe minoritaire avec un bouton de recule de 5 cases
    // - "Valider"
  },
];

/**
 * Retrieves a random card from the traditional deck database.
 *
 * @returns A random playing Card object.
 */
export function getRandomCard(): Card {
  const randomIndex = Math.floor(Math.random() * CARDS_DATABASE.length);
  return CARDS_DATABASE[randomIndex];
}

/**
 * Returns a friendly French drinking label for bar upgrade levels.
 */
export function getBarLevelLabel(level: number): string {
  if (level === 1) return 'Simple Dose';
  if (level === 2) return 'Double Dose';
  if (level === 3) return 'Cul Sec !';
  return `Niveau ${level}`;
}

export interface BarScenario {
  id: number;
  title: string;
  description: string;
}

export const BAR_SCENARIOS: BarScenario[] = [
  {
    id: 1,
    title: "Scénario des Couples 💋",
    description: "Les personnes en couple s'embrassent pendant 5 secondes, sinon les couples boivent un cul sec chacun !",
    // UI : Boutons [💋 Réussi (Acheter)] et [🍺 Couples Cul Sec] (Échec)
  },
  {
    id: 2,
    title: "Le Plus Jeune 👶",
    description: "Le plus jeune d'entre vous boit un cul sec, sinon il est disqualifié et retourne à la case départ.",
    // UI : Liste des joueurs. Pour chacun : bouton [🍺 [Nom] boit] et bouton [↩️ DÉPART] (Échec)
  },
  {
    //correction dans le texte:
    id: 3, // [CORRIGÉ]
    title: "Couleur de Slip 🩲",
    description: "Tout le monde montre son slip sinon boit cul sec sinon retour case départ !",
    // correction : liste des utilisateurs avec Boutons [🩲 Montré (Acheter)] et [🍺 Boire XG] ou reculer case depart à effet immediat!
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 4, // [CORRIGÉ]
    title: "Cible Aléatoire 🎯",
    description: "Un joueur aléatoire indiqué par l'application doit boire 4 gorgées, sinon recule de 3 cases à effet immediat!",
    // correction : Affiche la personne choisi par l'app et un bouton Boire et un bouton retour 3 cases à effet immédiat
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 5, // [CORRIGÉ]
    title: "Écartement des Doigts ✌️",
    description: "Écartez votre index et votre majeur. Tout le monde boit, sauf celui qui a l'écartement le plus grand. Sinon recule de 2 cases à effet immediat!",
    // correction UI : Affiche la liste des joueurs avec boutons boire ou reculer de 2 cases à effet immédiat
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 6, // [CORRIGÉ]
    title: "Le Coude Improbable 👅",
    description: "Tout le monde essaie de lécher son coude. Si quelqu'un y parvient, les autres boivent cul sec, sinon tout le monde boit cul sec ou revenir à la case départ!",
    // correction UI : Afficher la liste des joueurs et Boutons Acheter pour le joueur actif, boire cul sec et bouton revenir à la case départ pour tout le monde sauf le joueur actif
  },
  {
    //correction dans le texte:
    id: 7, // [CORRIGÉ]
    title: "Bisou sur le Front 😘",
    description: "L'application choisit deux joueurs au hasard qui doivent se faire un bisou sur le front. Sinon les deux joueurs boivent cul sec ou reviennent à la case départ!",
    //correction UI : liste tous les utilisateurs et deux boutons choix multiple pour les deux utilisateurs [😘 Bisous] et [↩️ recul de 2 cases]
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 8, // [CORRIGÉ]
    title: "Duel du Regard 👀",
    description: "Tout le monde se regarde dans les yeux. Les trois premiers à rire boivent un cul sec ! ou recule de 4 cases",
    // correction UI : Lister les joueurs et à coté de chaque joueur un bouton Boire et un bouton retour de 4 cases à effet immédiat. Pour le joueur actif mettre un bouton acheter
    //correction: bouton valider si tout est rempli
  },
  {
    id: 9, // [CORRIGÉ]
    title: "Marche Arrière Collective ⬅️",
    description: "Tout le monde recule de 3 cases sauf le joueur actif !",
    // correction UI : affiche un bouton recule pour tout le monde de 3 cases sauf pour ce qui sont dans le degrepissage et le joueur actif
    // correction : Bouton valider
  },
  {
    //correction dans le texte:
    id: 10, // [CORRIGÉ]
    title: "Le Silence est d'Or 🤫",
    description: "Tout le monde reste muet durant toute la partie jusqu'à ce que quelqu'un rit. Le premier qui rit boit un gorgé obligatoire !",
    // correction UI : Boutons valider
  },
  {
    //correction dans le texte:
    id: 11, // [CORRIGÉ]
    title: "Honte de Soirée 🗣️",
    description: "Le joueur actif doit avouer devant tout le monde un secret (vérité), sinon il boit cul sec ou retour à la case départ!",
    // correction UI : Boutons [🗣️ Raconter (Acheter)] et [🍺 Refuser & Cul Sec] et retour à la case départ à effet immédiat (Échec)
    // correction : Bouton valider
  },
  {
    id: 12,
    title: "La Devinette de l'Objet 🔍",
    description: "Trois joueurs cachent un objet dans leur main. Le joueur actif devine qui l'a. S'il a raison, les 3 boivent cul sec, sinon l'actif boit cul sec.",
    // UI - Étape 1 : Liste des 3 autres joueurs pour deviner. Bouton [🔍 Deviner [Nom]]
    // UI - Étape 2 (Résultat) : Bouton [Continuer] (Applique le résultat)
  },
  {
    id: 13,
    title: "Scénario du Sommelier 🍷",
    description: "Citez 5 animaux aquatiques mangeables en 5 secondes.",
    // UI : Boutons [✔️ Défi Réussi (Acheter)] et [❌ Échoué (Reculer de 2)]
  },
  {
    id: 14,
    title: "Le Défi de la Statue 🗿",
    description: "Restez immobile sans cligner des yeux pendant 20 secondes. Vos adversaires peuvent faire des grimaces (sans vous toucher).",
    // UI : Boutons [✔️ Défi Réussi (Acheter)] et [❌ Échoué (Reculer de 3)]
  },
  {
    id: 15,
    title: "Le Chanteur Né pour Briller 🎤",
    description: "Chantez le refrain d'une chanson connue. Vos adversaires votent pour la chanson et pour valider votre performance.",
    // UI : Boutons [✔️ Défi Réussi (Acheter)] et [❌ Échoué (Reculer de 3)]
  },
  {
    id: 16, // [CORRIGÉ]
    title: "La Blague Carambar 🍬",
    description: "Racontez une blague en moins de 15 secondes. Si personne ne sourit ou ne rit, c'est raté !",
    // correction UI - Bouton valider et acheter ou bouton recule de 3 cases à effet immédiat (Échec)
  },
  {
    //correction dans le texte il faut un texte aléatoire choisi par l'app:
    id: 17,
    title: "Le Rimeur de l'Apéro 📝",
    description: "Faites une poésie de 3 phrases qui riment avec '{texte}' sans hésiter, top 5s chrono avant de se lancer.",
    // UI : Boutons [✔️ Défi Réussi (Acheter)] et [❌ Échoué (Reculer de 4)]
  },
  {
    id: 18,
    title: "Le Ninja Silencieux 🥷",
    description: "Bande tes yeux et touche quelqu'un, devine qui c'est.",
    // UI : Boutons [✔️ Défi Réussi (Acheter)] et [❌ Échoué (Reculer de 3)]
  },
  {
    id: 19,
    title: "La Gymnastique Cérébrale 🧠",
    description: "Donne un nom de pays dont 3 joueurs choisiront l'emplacement du continent.",
    // UI : Boutons [✔️ Défi Réussi (Acheter)] et [❌ Échoué (Reculer de 3)]
  },
  {
    id: 20,
    title: "Le Mime Alcoolisé 🧮",
    description: "Imite le son d'un animal que le groupe choisira pour toi en moins de 5 secondes.",
    // UI : Boutons [✔️ Défi Réussi (Acheter)] et [❌ Échoué (Reculer de 2)]
  },
  {
    //correction dans le texte:
    id: 21, // [CORRIGÉ]
    title: "Le chat et la souris 🎭",
    description: "Attrape quelqu'un en moins de 15 secondes. Laisse les joueurs prendre de l'élan pendant 3s. Si quelqu'un attrapé il retourne au degrepissement, sinon le joueur actif retourne au degrepissement",
    // correction UI : Boutons de sélection [🏃 [Nom]] et bouton d'action [au degerpissement!]
  },
  {
    id: 22, // [CORRIGÉ]
    title: "lavage du Dimanche 🦆",
    description: "Lave le visage de la personne en face de toi avec du savon. Si la personne ne veut pas il retourne à la case depart",
    // correction UI : liste tout les joueurs et deux boutons à coté de chaque joueur [🍺 lavage à sec !] et [🏠 Retour en enfance à la case départ à effet immédiat]
    //correction: bouton valider si tout est rempli
  }
];

export interface DuoChallenge {
  id: number;
  type: 'duel' | 'group';
  penalty: number;
  template: string;
}

export const DUO_CHALLENGES: DuoChallenge[] = [
  {
    id: 1,
    type: 'group',
    penalty: 2,
    template: "🤝 Check Secret : {p1} et {p2} doivent inventer une poignée de main secrète complexe en 15 secondes. Échec = 2 gorgées chacun !",
    // UI : Boutons [🤝 Défi Réussi / Personne ne boit] et [🍻 Échec / Boire les deux (2G)]
  },
  {
    //correction dans le texte:
    id: 2, // [CORRIGÉ]
    type: 'duel',
    penalty: 3,
    template: "👁️ Duel de regards : {p1} et {p2} se fixent dans les yeux. Le premier qui rit ou cligne boit 3 gorgées ou recule de 4 cases!",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 3 gorgées', 'reculer de 4 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 3, // [CORRIGÉ]
    type: 'group',
    penalty: 6,
    template: "🗣️ Chuchotement : {p1} doit chuchoter à l'oreille de {p2} un secret rigolo ou inavouable. Si quelqu'un rit one shot, sinon retour à la case départ",
    // correction UI : affiche la liste des joueurs avec chacun trois boutons 'je rigole' 'je ne rigole pas' 'retour à la case départ'
    //correction: bouton valider si tout est rempli  
  },
  {
    id: 4, // [CORRIGÉ]
    type: 'group',
    penalty: 1,
    template: "🥂 Les Bras Croisés : {p1} et {p2} doivent boire une gorgée en ayant leurs bras croisés l'un dans l'autre.",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 1 gorgée', 'reculer de 2 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 5, // [CORRIGÉ]
    type: 'group',
    penalty: 2,
    template: "🎭 Mime Chrono : {p1} mime une action de soirée pour {p2} ({p1} déssine dans une feuille ce qu'il va mimer et montre aux autres joueurs). Si {p2} ne trouve pas en 20s, {p2} boit 2 gorgées ou recule de 4 cases !",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 2 gorgées', 'reculer de 4 cases' 
    //correction: bouton valider si tout est rempli 
  },
  {
    //correction dans le texte:
    id: 6, // [CORRIGÉ]
    type: 'duel',
    penalty: 2,
    template: "🧠 Capitales Express : {p1} et {p2} citent des capitales d'un continent choisi au hasard à tour de rôle par l'application. Le premier qui bloque boit 2 gorgées ou recule de deux cases!",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 2 gorgées', 'reculer de 2 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 7, // [CORRIGÉ]
    type: 'duel',
    penalty: 2,
    template: "🤫 Jeu des Synonymes : {p1} donne un mot lié à la fête, {p2} doit donner un synonyme en moins de 3s. Le perdant boit 2 gorgées soit recule de 3 cases.",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 2 gorgées', 'reculer de 3 cases' 
    //correction: bouton valider si tout est rempli   
  },
  {
    //correction dans le texte:
    id: 8, // [CORRIGÉ]
    type: 'group',
    penalty: 3,
    template: "🍎 Dos à dos : {p1} et {p2} se tiennent dos à dos et doivent s'asseoir au sol puis se relever sans les mains. Raté = 3 gorgées chacun ou les deux joueurs doit reculer de 4 cases!",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 3 gorgées', 'reculer de 4 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 9, // [CORRIGÉ]
    type: 'duel',
    penalty: 2,
    template: "👑 Flatterie mutuelle : {p1} et {p2} se font des compliments exagérés à tour de rôle sans limite et sans rire. Le premier qui rit boit 2 gorgées soit recule de 3 cases!",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 2 gorgées', 'reculer de 3 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 10, // [CORRIGÉ]
    type: 'duel',
    penalty: 2,
    template: "🤥 Vérité ou Mensonge : {p1} raconte une anecdote folle à propos de lui. Si {p2} devine correctement si c'est vrai, {p1} boit 2 gorgées, sinon {p2} boit 2. Si l'un d'eux ne veut pas boire ou recule de 3 cases!",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 2 gorgées', 'reculer de 3 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 11, // [CORRIGÉ]
    type: 'duel',
    penalty: 2,
    template: "🕴️ Miroir Humain : {p2} doit copier tous les mouvements de {p1} pendant 15 secondes. Si l'un d'eux rit, il boit 2 gorgées soit recule de 3 cases!",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 2 gorgées', 'reculer de 3 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 12, // [CORRIGÉ]
    type: 'duel',
    penalty: 2,
    template: "🦁 Cris sauvages : {p1} et {p2} imitent un cri d'animal en même temps. Le reste du groupe vote pour le plus ridicule. Le perdant choisi par le groupe boit 2 gorgées ou recule de 2 cases!",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 2 gorgées', 'reculer de 2 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 13, // [CORRIGÉ]
    type: 'group',
    penalty: 2,
    template: "🤐 Sans les yeux : {p1} bande ces yeux et tourne autour de lui, puis essaiede trouver {p2} en le pointant du doigt. Échec = 2 gorgées pour {p1}, si réussite 2 gorgées pour {p2} , si l'un des deux refuse de boire ou recule de 4 cases!",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 2 gorgées', 'reculer de 4 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 14, // [CORRIGÉ]
    type: 'group',
    penalty: 2,
    template: "🍿 Célébrité Mystère : {p1} fait deviner une célébrité à {p2} uniquement avec des indices en 30s. Échec = 2 gorgées pour {p1}, si réussite 2 gorgées pour {p2} , si l'un des deux refuse de boire ou recule de 4 cases!",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 2 gorgées', 'reculer de 4 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 15, // [CORRIGÉ]
    type: 'group',
    penalty: 0,
    template: "🤠 Shérif et Adjoint : {p1} devient le shérif et {p2} son adjoint pour 1 tour. Quand le shérif boit, l'adjoint boit aussi ! si pendant le tour l'un des deux joueurs refusent de boir action ou vérité",
    // correction UI : Bouton [🤝valider])
  },
  {
    //correction dans le texte:
    id: 16, // [CORRIGÉ]
    type: 'duel',
    penalty: 2,
    template: "🎈 Souffle magique : {p1} et {p2} maintiennent un papier en l'air en soufflant dessus alternativement. Le premier qui échoue boit 2 gorgées sinon recule de 3 cases!",
    // correction UI : Affichage des deux joueurs avec des boutons à cotés 'Gagné', 'boire 2 gorgées', 'reculer de 3 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 17, // [CORRIGÉ]
    type: 'duel',
    penalty: 2,
    template: "🤐 Questions rapides : {p1} pose 3 questions rapides à {p2}. {p2} doit répondre sans dire \"oui\", \"non\" ni hésiter. Sinon, il boit 2 gorgées ou recule de 3 cases!",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 2 gorgées', 'reculer de 3 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 18, // [CORRIGÉ]
    type: 'duel',
    penalty: 3,
    template: "🎯 Énigme de l'Apéro : {p1} doit poser une énigme à {p2}. Si {p2} trouve, {p1} boit 3 gorgées. Sinon, c'est {p2} qui boit 3 ! Si la personne perdante ne veux pas boire alors recule de 4 cases!",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 3 gorgées', 'reculer de 4 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 19, // [CORRIGÉ]
    type: 'duel',
    penalty: 2,
    template: "🎶 Duo de Karaoké : {p1} commence à chanter une chanson connue, {p2} doit chanter la suite immédiate sans hésiter. Sinon : 2 gorgées ou retour à la case départ",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 2 gorgées', 'reculer de 3 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 20, // [CORRIGÉ]
    type: 'duel',
    penalty: 2,
    template: "🍦 Choix cornélien : {p1} demande à {p2} de choisir entre deux dilemmes horribles. Le reste du groupe vote. La minorité boit 2 gorgées ou recule de 3 cases!",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 2 gorgées', 'reculer de 3 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 21, // [CORRIGÉ]
    type: 'duel',
    penalty: 3,
    template: "🧠 Quiz Culture : {p1} pose une question de culture générale à {p2}. Si {p2} répond faux en 5s, il boit 3 gorgées. Sinon, {p1} boit 3 gorgées ou recule de 4 cases!",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'boire 3 gorgées', 'reculer de 4 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 22, // [CORRIGÉ]
    type: 'duel',
    penalty: 3,
    template: "⚡ Suite Logique : {p1} écris un nombre entre 1 et 4, {p2} doit deviner le nombre en moins de 5 secondes. Si {p2} devine juste, {p1} boit 3 gorgées. Sinon, {p2} boit 3 gorgées ou recule de 4 cases!",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 3 gorgées', 'reculer de 4 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    //correction dans le texte:
    id: 23, // [CORRIGÉ]
    type: 'duel',
    penalty: 2,
    template: "🧪 Énigme du Sphinx : {p1} demande à {p2} : \"Qu'est-ce qui a des clés mais ne peut ouvrir aucune serrure ?\" (Réponse : Un piano / une chanson). Échec = 2 gorgées pour {p2} !",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 2 gorgées', 'reculer de 3 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    id: 24, // [CORRIGÉ]
    type: 'duel',
    penalty: 2,
    template: "✊ Chifoumi de l'Apéro : {p1} et {p2} s'affrontent au Pierre-Feuille-Ciseaux en un coup gagnant. Le perdant boit 2 gorgées !",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 2 gorgées', 'reculer de 3 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    id: 25, // [CORRIGÉ]
    type: 'duel',
    penalty: 3,
    template: "✌️ Chifoumi de la Vengeance : {p1} et {p2} jouent au Pierre-Feuille-Ciseaux en 3 manches. Le perdant boit 3 gorgées !",
    // correction UI : Affichage des deux joueurs avec chacun des boutons à cotés 'Gagné', 'boire 3 gorgées', 'reculer de 4 cases' 
    //correction: bouton valider si tout est rempli
  },
  {
    id: 26,
    type: 'duel',
    penalty: 2,
    template: "✋ Chifoumi Aléatoire : {p1} et {p2} jouent au Pierre-Feuille-Ciseaux. Celui qui perd boit 2 gorgées, et le gagnant distribue 1 gorgée !",
    // UI : Boutons [🏆 {Adversaire} gagne ({JoueurActif} boit 2G)] et [🏆 {JoueurActif} gagne ({Adversaire} boit 2G)]
  },
];

/**
 * Resolves a duo challenge details (type and penalty) dynamically from its text description.
 * This is used as a fallback to support backward compatibility with old save files.
 */
export function getDuoChallengeDetails(text: string | null): { type: 'duel' | 'group'; penalty: number } {
  if (!text) return { type: 'group', penalty: 2 };
  const matched = DUO_CHALLENGES.find((ch) => {
    const escaped = ch.template
      .replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')
      .replace(/\\\{p1\\\}/g, '.*?')
      .replace(/\\\{p2\\\}/g, '.*?');
    const regex = new RegExp('^' + escaped + '$');
    return regex.test(text);
  });
  if (matched) {
    return { type: matched.type, penalty: matched.penalty };
  }
  // Fallbacks based on text markers if no exact template match found
  if (text.includes('chacun') || text.includes('les deux') || text.includes('chacune')) {
    return { type: 'group', penalty: 2 };
  }
  return { type: 'duel', penalty: 2 };
}
