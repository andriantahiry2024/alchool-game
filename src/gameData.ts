import type { Tile, Card } from './types';

/**
 * List of 16 tiles forming the Alcooly board.
 * All texts are in French, and properties are labelled with "Gorgées" instead of sips.
 */
export const INITIAL_TILES: Tile[] = [
  {
    id: 0,
    name: 'DÉPART',
    type: 'start',
    description: 'Chaque passage distribue 2 gorgées !',
    color: '#00f2fe',
  },
  {
    id: 1,
    name: 'Bar de la Plage',
    type: 'bar',
    description: 'Raconte ta pire anecdote de vacances d\'été ou bois 2 gorgées. Propriété achetable.',
    color: '#ff007f',
    price: 3,
    level: 0,
  },
  {
    id: 2,
    name: 'Carte Mystère',
    type: 'card',
    description: 'Tire une carte de jeu traditionnelle (Pique, Cœur, Carreau, Trèfle) !',
    color: '#a015ff',
  },
  {
    id: 3,
    name: 'Radar de Vitesse 📸',
    type: 'chill',
    description: 'Radar de soirée ! Si tu es arrivé ici avec un score de 4+ au dé, tu es flashé : bois 3 gorgées d\'amende !',
    color: '#ff3333',
  },
  {
    id: 4,
    name: 'Pub Irlandais',
    type: 'bar',
    description: 'Parle avec un accent bizarre jusqu\'à ton prochain tour ou bois 2 gorgées. Propriété achetable.',
    color: '#ff007f',
    price: 4,
    level: 0,
  },
  {
    id: 5,
    name: 'CELLULE DÉGRISEMENT',
    type: 'prison',
    description: 'Bloqué ! Bois 2 shots pour sortir immédiatement ou passe ton tour.',
    color: '#ff3333',
  },
  {
    id: 6,
    name: "L'Énigme de l'Apéro",
    type: 'minigame',
    description: "Donne une énigme au joueur de ton choix. S'il trouve la réponse, tu bois 3 gorgées. S'il échoue, c'est lui qui boit 3 gorgées !",
    color: '#00ffff',
  },
  {
    id: 7,
    name: 'Carte Mystère',
    type: 'card',
    description: 'Tire une carte de jeu traditionnelle (Pique, Cœur, Carreau, Trèfle) !',
    color: '#a015ff',
  },
  {
    id: 8,
    name: 'Taxe Alcool',
    type: 'tax',
    description: 'Cul sec ou 4 gorgées directes !',
    color: '#ffff00',
  },
  {
    id: 9,
    name: 'Club Techno',
    type: 'bar',
    description: 'Imite un DJ en plein set avec des bruitages à la bouche pendant 30 secondes ou bois 3 gorgées. Propriété achetable.',
    color: '#ff007f',
    price: 5,
    level: 0,
  },
  {
    id: 10,
    name: 'Alcootest Surprise 🧪',
    type: 'minigame',
    description: 'Contrôle de gendarmerie ! Clique sur "Souffler" : Impair = tu es positif et bois 3. Pair = négatif, tu distribues 2 !',
    color: '#ffff00',
  },
  {
    id: 11,
    name: 'Carte Mystère',
    type: 'card',
    description: 'Tire une carte de jeu traditionnelle (Pique, Cœur, Carreau, Trèfle) !',
    color: '#a015ff',
  },
  {
    id: 12,
    name: 'La Bouteille Inversée',
    type: 'bottle',
    description: 'Fais tourner la bouteille. Le désigné distribue 3 gorgées.',
    color: '#39ff14',
  },
  {
    id: 13,
    name: 'Palais VIP',
    type: 'bar',
    description: 'Fais un toast digne d\'un grand discours présidentiel officiel ou bois 4 gorgées. Propriété achetable.',
    color: '#ff007f',
    price: 6,
    level: 0,
  },
  {
    id: 14,
    name: 'ALLEZ EN DÉGRISEMENT',
    type: 'goto_prison',
    description: 'File directement en cellule de dégrisement sans passer par la case DÉPART.',
    color: '#ff3333',
  },
  {
    id: 15,
    name: 'Tournée Générale',
    type: 'minigame',
    description: 'Tout le monde trinque et boit 1 gorgée ! Le lanceur en distribue 2.',
    color: '#00ffff',
  },
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
    text: 'Le pic de la mort ! Tous les joueurs possédant une carte fétiche de Pique ♠️ doivent boire un shot (ou 6 gorgées). Si personne n\'a de Pique, tout le monde boit 1 gorgée.',
    penalty: 6,
  },
  {
    id: 's2',
    category: 'action',
    suit: 'pique',
    cardValue: '7',
    title: 'Le 7 de Pique ♠️',
    text: 'Tempête Noire ! Tous les joueurs ayant une carte fétiche noire (♠️ Pique ou ♣️ Trèfle) boivent 3 gorgées. Si personne n\'a de carte noire, le joueur actif en boit 2 !',
    penalty: 3,
  },
  {
    id: 's3',
    category: 'action',
    suit: 'pique',
    cardValue: 'Valet',
    title: 'Le Valet de Pique ♠️',
    text: 'Le poids des âges ! Tous les joueurs ayant une carte fétiche de Pique ♠️ boivent 3 gorgées. Si personne n\'a de Pique, tout le monde prend 1 gorgée de consolation.',
    penalty: 2,
  },
  {
    id: 's4',
    category: 'movement',
    suit: 'pique',
    cardValue: '10',
    title: 'Le 10 de Pique ♠️',
    text: 'Pression policière ! Les flics font une descente de routine. Recule immédiatement de 2 cases ! (Pas de pénalité de boisson).',
    penalty: 0,
  },

  // --- ♥️ CŒUR (Duos & Alliances) ---
  {
    id: 'h1',
    category: 'truth',
    suit: 'coeur',
    cardValue: 'Dame',
    title: 'La Dame de Cœur ♥️',
    text: 'L\'amour partagé ! Tous les joueurs ayant une carte fétiche de Cœur ♥️ choisissent un partenaire. Ils trinquent et boivent 2 gorgées chacun. Si personne n\'a de Cœur, le joueur actif distribue 2 gorgées.',
    penalty: 2,
  },
  {
    id: 'h2',
    category: 'truth',
    suit: 'coeur',
    cardValue: '10',
    title: 'Le 10 de Cœur ♥️',
    text: 'Dossier embarrassant ! Le joueur possédant la carte fétiche du 10 de Cœur ♥️ doit raconter un secret marrant sur son voisin de gauche, sinon il boit 3 gorgées. Si personne ne l\'a, le joueur actif s\'y colle !',
    penalty: 3,
  },
  {
    id: 'h3',
    category: 'truth',
    suit: 'coeur',
    cardValue: 'As',
    title: 'L\'As de Cœur ♥️',
    text: 'Âmes Sœurs ! Le joueur avec la carte fétiche de Cœur ♥️ la plus forte (ou le joueur actif si aucun Cœur n\'est en jeu) lie deux joueurs. Chaque fois que l\'un boit, l\'autre prend la même dose pendant 2 tours.',
    penalty: 2,
  },
  {
    id: 'h4',
    category: 'truth',
    suit: 'coeur',
    cardValue: '8',
    title: 'Le 8 de Cœur ♥️',
    text: 'Confession intime ! Le joueur possédant la carte fétiche du 8 de Cœur ♥️ doit chuchoter un secret marrant à son voisin de droite, sinon il boit 3 gorgées. Si personne ne l\'a, le joueur actif s\'y colle !',
    penalty: 3,
  },

  // --- ♦️ CARREAU (Défis & Mimes) ---
  {
    id: 'd1',
    category: 'rule',
    suit: 'carreau',
    cardValue: 'Roi',
    title: 'Le Roi de Carreau ♦️',
    text: 'Le Roi du mime ! Le joueur possédant la carte fétiche du Roi de Carreau ♦️ doit mimer un objet ou métier choisi par le groupe en 30s. Si raté, il boit 3 gorgées. Si personne ne l\'a, le joueur actif s\'y colle !',
    penalty: 3,
  },
  {
    id: 'd2',
    category: 'rule',
    suit: 'carreau',
    cardValue: 'Valet',
    title: 'Le Valet de Carreau ♦️',
    text: 'Équilibre précaire ! Tous les joueurs possédant une carte fétiche de Carreau ♦️ doivent tenir en équilibre sur une jambe pendant 20 secondes. Ceux qui tombent boivent 3 gorgées. Si personne n\'a de Carreau, le joueur actif s\'y colle !',
    penalty: 3,
  },
  {
    id: 'd3',
    category: 'movement',
    suit: 'carreau',
    cardValue: '9',
    title: 'Le 9 de Carreau ♦️',
    text: 'Retour aux sources ! Faux départ ou nostalgie ? Retourne directement sur la case DÉPART. Aucun bonus de passage n\'est accordé.',
    penalty: 0,
  },
  {
    id: 'd4',
    category: 'movement',
    suit: 'carreau',
    cardValue: '7',
    title: 'Le 7 de Carreau ♦️',
    text: 'Marche arrière ! Le joueur possédant la carte fétiche de Carreau ♦️ (ou le joueur actif si aucun Carreau n\'est en jeu) recule de 3 cases immédiatement !',
    penalty: 0,
  },

  // --- ♣️ TRÈFLE (Distributions & Règles) ---
  {
    id: 'c1',
    category: 'never',
    suit: 'trefle',
    cardValue: 'Roi',
    title: 'Le Roi de Trèfle ♣️',
    text: 'Générosité Royale ! Le joueur possédant la carte fétiche du Roi de Trèfle ♣️ distribue 5 gorgées de pénalité librement. Si personne ne l\'a, le joueur actif distribue 3 gorgées.',
    penalty: 1,
  },
  {
    id: 'c2',
    category: 'never',
    suit: 'trefle',
    cardValue: 'As',
    title: 'L\'As de Trèfle ♣️',
    text: 'Grand Duel ! Le joueur ayant la carte fétiche de plus grande valeur (As > Roi > Dame > Valet > 10 > 9 > 8 > 7 ; en cas d\'égalité de valeur, l\'ordre de priorité est Pique > Cœur > Carreau > Trèfle) distribue 4 gorgées. Celui avec la plus basse en boit 2 !',
    penalty: 2,
  },
  {
    id: 'c3',
    category: 'never',
    suit: 'trefle',
    cardValue: '10',
    title: 'Le 10 de Trèfle ♣️',
    text: 'Le Roi du silence ! Le joueur possédant la carte fétiche du 10 de Trèfle ♣️ lance le silence général. Le premier qui rit, parle ou fait du bruit boit 3 gorgées. Si personne ne l\'a, le joueur actif lance le jeu.',
    penalty: 3,
  },
  {
    id: 'c4',
    category: 'never',
    suit: 'trefle',
    cardValue: '8',
    title: 'Le 8 de Trèfle ♣️',
    text: 'Règle Absurde ! Le joueur possédant la carte fétiche du 8 de Trèfle ♣️ impose une règle absurde pour 2 tours (ex: pas de mot "je", boire de la main gauche). Faute = 1 gorgée. Si personne ne l\'a, le joueur actif l\'impose.',
    penalty: 1,
  },
  // --- NOUVELLES CARTES CHIFOUMI ---
  {
    id: 's5',
    category: 'action',
    suit: 'pique',
    cardValue: '9',
    title: 'Le 9 de Pique ♠️',
    text: 'Chifoumi des Ténèbres ! Lance un duel de Pierre-Feuille-Ciseaux avec le joueur à ta droite. Le perdant boit 3 gorgées !',
    penalty: 3,
  },
  {
    id: 'h5',
    category: 'truth',
    suit: 'coeur',
    cardValue: '9',
    title: 'Le 9 de Cœur ♥️',
    text: 'Chifoumi Amoureux ! Affronte ton voisin de gauche au Pierre-Feuille-Ciseaux. Si tu gagnes, il boit 2 gorgées. Si tu perds, vous buvez 1 gorgée tous les deux !',
    penalty: 2,
  },
  {
    id: 'd5',
    category: 'rule',
    suit: 'carreau',
    cardValue: '8',
    title: 'Le 8 de Carreau ♦️',
    text: 'Le Roi du Chifoumi ! Le joueur possédant la carte fétiche de Carreau ♦️ affronte qui il veut au Pierre-Feuille-Ciseaux. Le perdant prend 3 gorgées. Si personne ne l\'a, le joueur actif s\'y colle.',
    penalty: 3,
  },
  {
    id: 'c5',
    category: 'never',
    suit: 'trefle',
    cardValue: '9',
    title: 'Le 9 de Trèfle ♣️',
    text: 'Chifoumi Général ! Tout le monde joue un coup de Pierre-Feuille-Ciseaux en même temps. Tous ceux qui font le signe minoritaire boivent 2 gorgées !',
    penalty: 2,
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
