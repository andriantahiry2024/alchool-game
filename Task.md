# Plan des tâches - Alcooly

## Phase 1 : Initialisation et Configuration
* **Configuration du Projet**
    - [x] Implémentation : Initialiser le projet avec Vite + React + TypeScript et installer les dépendances (lucide-react, playwright).
    - [x] Documentation (JSDoc et commentaires) : Documenter les choix de configuration.
    - [x] Vérification des imports : S'assurer que les fichiers de config sont corrects.
    - [x] Vérification de la syntaxe : S'assurer que tsconfig et vite.config sont valides.
    - [x] Test unitaire (jest DOM) : Configurer l'environnement de test de base.

## Phase 2 : Modèles de Données et Utilitaires
* **Types et Données de Jeu**
    - [x] Implémentation : Créer les types TypeScript dans `src/types.ts` et le jeu de données de cartes/défis originaux dans `src/gameData.ts`.
    - [x] Documentation (JSDoc et commentaires) : JSDoc pour toutes les interfaces et structures de données.
    - [x] Vérification des imports : Pas d'import circulaire.
    - [x] Vérification de la syntaxe : S'assurer du bon typage strict.
    - [x] Test unitaire (jest DOM) : Tester la cohérence de la base de données de cartes (pas de doublons, catégories correctes).

* **Gestionnaire de Sons (Web Audio API)**
    - [x] Implémentation : Créer `src/utils/audio.ts` avec des effets sonores synthétisés pour le dé, les clics et le succès.
    - [x] Documentation (JSDoc et commentaires) : Commenter le fonctionnement des oscillateurs Web Audio.
    - [x] Vérification des imports : Imports propres dans les composants.
    - [x] Vérification de la syntaxe : Pas d'erreurs d'API dépréciées.
    - [x] Test unitaire (jest DOM) : Mock de l'AudioContext pour les tests.

## Phase 3 : Composants de Base
* **Écran de Configuration des Joueurs (PlayerSetup)**
    - [x] Implémentation : Créer `src/components/PlayerSetup.tsx` pour l'ajout de joueurs et choix de couleur néon.
    - [x] Documentation (JSDoc et commentaires) : JSDoc sur les handlers d'ajout de joueurs.
    - [x] Vérification des imports : Nettoyage des composants Lucide React non utilisés.
    - [x] Vérification de la syntaxe : Rendu et gestion des formulaires.
    - [x] Test unitaire (jest DOM) : Tester l'ajout d'un joueur et les limites de validation.

* **Plateau de Jeu Interactif (Board)**
    - [x] Implémentation : Créer `src/components/Board.tsx` affichant 16 cases en disposition responsive carrée et les pions des joueurs.
    - [x] Documentation (JSDoc et commentaires) : Expliquer le calcul du placement des cases sur la grille.
    - [x] Vérification des imports : Imports CSS et icônes valides.
    - [x] Vérification de la syntaxe : Rendu correct de la grille.
    - [x] Test unitaire (jest DOM) : Tester que chaque pion se trouve sur la bonne case.

* **Lanceur de Dé Animé (DiceRoller)**
    - [x] Implémentation : Créer `src/components/DiceRoller.tsx` avec une animation 3D/2D dynamique du dé en CSS et sons.
    - [x] Documentation (JSDoc et commentaires) : Expliquer les déclencheurs d'animation et de callback.
    - [x] Vérification des imports : Intégration propre de l'utilitaire audio.
    - [x] Vérification de la syntaxe : Cycle de vie de l'animation.
    - [x] Test unitaire (jest DOM) : S'assurer que le dé retourne un chiffre aléatoire entre 1 et 6.

* **Bouteille Tournante Interactive (BottleSpinner)**
    - [x] Implémentation : Créer `src/components/BottleSpinner.tsx` avec une bouteille animée en rotation libre et ralentissement progressif.
    - [x] Documentation (JSDoc et commentaires) : Documenter les calculs physiques de friction/décélération.
    - [x] Vérification des imports : Nettoyage des imports.
    - [x] Vérification de la syntaxe : Rendu propre sur mobile.
    - [x] Test unitaire (jest DOM) : Vérifier que la bouteille s'arrête et désigne un joueur.

* **Tirage de Cartes Interactif (CardDrawer)**
    - [x] Implémentation : Créer `src/components/CardDrawer.tsx` affichant les défis de cartes avec animation de flip 3D.
    - [x] Documentation (JSDoc et commentaires) : JSDoc de gestion d'état de retournement.
    - [x] Vérification des imports : Utilisation des icônes thématiques.
    - [x] Vérification de la syntaxe : Rendu du dos et de la face de carte.
    - [x] Test unitaire (jest DOM) : Tester le clic de validation du défi.

## Phase 4 : Assemblage et Logique de Jeu
* **Composant Principal et Système de Jeu (App)**
    - [x] Implémentation : Intégrer tous les composants dans `src/App.tsx`, implémenter le gestionnaire d'état de la partie, les tours, la prison, et le système de bars (propriétés).
    - [x] Documentation (JSDoc et commentaires) : Documenter les fonctions clés (prochain tour, effets de cases, achat de bar).
    - [x] Vérification des imports : Pas d'dépendances inutilisées.
    - [x] Vérification de la syntaxe : Typage et gestion des états React.
    - [x] Test unitaire (jest DOM) : Tester la boucle de jeu de base.

* **Feuille de Styles Globale (index.css)**
    - [x] Implémentation : Définir les variables de couleurs néon, le design system glassmorphism, et les animations globales.
    - [x] Documentation (JSDoc et commentaires) : Expliquer le fonctionnement des effets de lumière et de flou.
    - [x] Vérification des imports : Pas d'imports CSS en doublon.
    - [x] Vérification de la syntaxe : Validation CSS.
    - [x] Test unitaire (jest DOM) : Rendu global sans débordement.

## Phase 5 : Tests d'Intégration et Finitions
* **Tests E2E Playwright**
    - [x] Implémentation : Écrire `tests/game.spec.ts` pour couvrir le flux complet de jeu (inscription, dé, déplacement, mini-jeu, tour suivant).
    - [x] Documentation (JSDoc et commentaires) : Documenter le scénario de test.
    - [x] Vérification des imports : Imports Playwright corrects.
    - [x] Vérification de la syntaxe : Syntaxe async/await valide.
    - [x] Test unitaire (jest DOM) : Lancement et réussite du test E2E.

## Phase 6 : Fenêtre Modale de Pioche (Amélioration UX)
* **Modale Overlay de Pioche**
    - [x] Implémentation : Rendre la pioche sous forme de modale plein écran avec flou d'arrière-plan et carte plus grande dans App.tsx et CardDrawer.tsx.
    - [x] Documentation (JSDoc et commentaires) : JSDoc de gestion d'affichage modal.
    - [x] Vérification des imports : Imports propres et typés.
    - [x] Vérification de la syntaxe : Rendu HTML/CSS sans débordements.
    - [x] Test unitaire (jest DOM) : Mise à jour et validation des tests E2E.

## Phase 7 : Persistance LocalStorage (Base de Données Locale)
* **Persistance & Restauration d'État**
    - [x] Implémentation : Charger l'état depuis localStorage à l'initialisation, sauvegarder automatiquement l'état réactif via useEffect, et ajouter une fonction resetGame dans useGameState.ts et App.tsx.
    - [x] Documentation (JSDoc et commentaires) : JSDoc expliquant le cycle de persistance.
    - [x] Vérification des imports : Imports propres.
    - [x] Vérification de la syntaxe : Pas de plantage si localStorage est vide.
    - [x] Test unitaire (jest DOM) : Ajouter et exécuter des tests validant la persistance.

## Phase 8 : Francisation, Intégration Pseudos et Cartes de Jeu Traditionnelles
* **Intégration du Nom du Joueur & Grammaire**
    - [x] Implémentation : Afficher le nom du joueur sur le recto/verso de la carte dans CardDrawer.tsx avec élision grammaticale correcte (d'/de).
    - [x] Documentation (JSDoc et commentaires) : Commenter la fonction d'élision.
    - [x] Vérification des imports : Imports propres.
    - [x] Vérification de la syntaxe : Rendu correct.
    - [x] Test unitaire (jest DOM) : Relancer et valider les tests.

* **Retrait des Termes Anglais (Francisation)**
    - [x] Implémentation : Traduire en français tous les termes visibles (ex: Lvl -> Niveau, Logs -> Historique/Activité, Catégories de cartes en français).
    - [x] Documentation (JSDoc et commentaires) : Documenter les traductions.
    - [x] Vérification des imports : Nettoyage.
    - [x] Vérification de la syntaxe : Rendu CSS/HTML.
    - [x] Test unitaire (jest DOM) : Relancer les tests Playwright.

* **Scénarios de Cartes de Jeu Traditionnelles (Pique, Cœur, Carreau, Trèfle)**
    - [x] Implémentation : Modifier types.ts et gameData.ts pour associer aux cartes mystères des enseignes de jeu (♠️ Pique, ♥️ Cœur, ♦️ Carreau, ♣️ Trèfle) et leurs règles (Pique = shot, Cœur = duo, Carreau = action, Trèfle = distribution).
    - [x] Documentation (JSDoc et commentaires) : JSDoc sur la structure des cartes de jeu.
    - [x] Vérification des imports : Imports typés.
    - [x] Vérification de la syntaxe : Compilation TypeScript.
    - [x] Test unitaire (jest DOM) : Validation des tests de structure de cartes et E2E.

## Phase 9 : Interface Plein Écran & Modal Tableau de Bord
* **Correction de compilation gameData.ts**
    - [x] Implémentation : Supprimer l'import inutilisé de `SuitType` dans `src/gameData.ts`.
    - [x] Documentation (JSDoc et commentaires) : Aucun changement de doc nécessaire.
    - [x] Vérification des imports : S'assurer que le projet compile avec tsc.
    - [x] Vérification de la syntaxe : Pas de soucis de syntaxe.
    - [x] Test unitaire (jest DOM) : Relancer les tests pour vérifier que tout passe.

* **Menu Flottant et Modal Tableau de Bord**
    - [x] Implémentation : Dans `src/App.tsx`, ajouter un état `showDashboard` pour afficher/masquer le tableau de bord. Déplacer la liste des joueurs, l'historique (logs) et le bouton "Nouvelle Partie" dans une fenêtre modale overlay quand on clique sur le bouton de menu.
    - [x] Documentation (JSDoc et commentaires) : Mettre à jour les JSDoc et ajouter des commentaires explicatifs de l'affichage modal.
    - [x] Vérification des imports : Nettoyer les imports inutilisés ou doublons.
    - [x] Vérification de la syntaxe : Rendu HTML/CSS sans erreur.
    - [x] Test unitaire (jest DOM) : Ajouter/adapter un test Playwright dans `tests/game.spec.ts` pour ouvrir le tableau de bord et valider les fonctionnalités (affichage des joueurs et logs, reset de partie).

* **Ajustements CSS pour le Plein Écran**
    - [x] Implémentation : Dans `src/index.css`, styliser le bouton de menu, la modale du tableau de bord (glassmorphism avec bouton fermer) et ajuster `.game-layout` pour que le plateau de jeu occupe 100% de la hauteur restante du viewport mobile.
    - [x] Documentation (JSDoc et commentaires) : Ajouter des commentaires explicatifs dans le fichier CSS.
    - [x] Vérification des imports : Aucun nouvel import.
    - [x] Vérification de la syntaxe : CSS valide.
    - [x] Test unitaire (jest DOM) : Valider visuellement ou via Playwright la conformité du layout.

## Phase 10 : Rédaction des Règles du Jeu et Scénarios
* **Fichier de Règles du Jeu**
    - [x] Implémentation : Créer un fichier `regles_du_jeu.md` à la racine du projet détaillant le gameplay, les mécaniques (cases, bars, dégrisements, bouteille) et la liste complète des cartes/scénarios classés par enseigne (♠️ Pique, ♥️ Cœur, ♦️ Carreau, ♣️ Trèfle).
    - [x] Documentation (JSDoc et commentaires) : Expliquer clairement chaque règle en français simple.
    - [x] Vérification des imports : Pas d'imports requis.
    - [x] Vérification de la syntaxe : Formatage markdown valide.
    - [x] Test unitaire (jest DOM) : Pas de test requis pour ce fichier texte.

## Phase 11 : Refonte des Scénarios, Cartes Fétiches Initiales et Nettoyage Visuel
* **Refonte de la Logique & de l'Écran de Distribution des Cartes**
    - [x] Implémentation : Mettre à jour `src/types.ts` pour stocker la carte fétiche du joueur (`player.card`) et la nouvelle valeur d'écran `activeScreen: 'reveal'`.
    - [x] Implémentation : Mettre à jour `useGameState.ts` pour distribuer de manière unique et aléatoire une carte fétiche à chaque joueur au début de la partie, et basculer sur l'écran `'reveal'`.
    - [x] Implémentation : Créer un composant ou un écran interactif de retournement de cartes `RevealCards.tsx` (ou l'intégrer dans `App.tsx`) permettant à chaque joueur de retourner sa carte au début de la partie.
    - [x] Documentation (JSDoc et commentaires) : Ajouter des JSDocs et commentaires explicatifs sur les nouvelles méthodes de tirage et de reveal.
    - [x] Vérification des imports : S'assurer que tous les nouveaux types/composants s'importent proprement.
    - [x] Vérification de la syntaxe : Compilation TypeScript stricte.

* **Refonte des Scénarios de Cartes & Propriétés (Bars)**
    - [x] Implémentation : Modifier `src/gameData.ts` pour inclure 16 défis de cartes interactifs et originaux basés sur les cartes fétiches des joueurs (ex: "Tous les joueurs ayant une carte de Pique boivent 2 gorgées").
    - [x] Implémentation : Modifier les descriptions des bars dans `src/gameData.ts` pour enlever les pompes/défis physiques ennuyeux et les remplacer par des gages sociaux/drôles.
    - [x] Implémentation : Remplacer l'affichage "Niveau 1/2/3" des bars par des désignations d'apéro amusantes ("Simple Dose", "Double Dose", "Cul Sec !").
    - [x] Documentation (JSDoc et commentaires) : JSDocs pour les nouvelles cartes et fonctions de libellé de bars.

* **Nettoyage Visuel & Icônes IA (Sparkles)**
    - [x] Implémentation : Remplacer toutes les icônes `Sparkles` et `Award` de type IA dans `App.tsx` par des icônes thématiques appropriées (`Beer`, `Crown`, `Trophy`, `PartyPopper`).
    - [x] Vérification des imports : Nettoyer les icônes inutilisées de `lucide-react`.
    - [x] Vérification de la syntaxe : Validation du rendu visuel en JSX.

* **Ajustements de Tests & E2E**
    - [x] Implémentation : Adapter `tests/game.spec.ts` pour simuler le clic de retournement des cartes fétiches sur l'écran `'reveal'` avant de passer au plateau de jeu.
    - [x] Test unitaire (jest DOM) : S'assurer que les 12 tests Playwright s'exécutent et réussissent.

## Phase 12 : Résolution des Répétitions, Doublons, Animation Bouteille et Énigme

* **Bouteille Tournante (Calcul Cumulative de Rotation et Ciblage)**
    - [x] Implémentation : Exclure le joueur actif dans `BottleSpinner.tsx`.
    - [x] Implémentation : Remplacer la rotation absolue par le calcul cumulatif de rotation dans `BottleSpinner.tsx`.
    - [x] Vérification des imports : Imports inchangés.
    - [x] Vérification de la syntaxe : Syntaxe TypeScript valide.

* **Case Énigme de l'Apéro (Remplacement du Duel de Regards Redondant)**
    - [x] Implémentation : Remplacer le Duel de Regards (case 6) par "L'Énigme de l'Apéro" dans `gameData.ts`.
    - [x] Documentation : Ajouter des descriptions explicatives.
    - [x] Vérification de la syntaxe : Compilation TypeScript correcte.

* **Prévention des Doublons de Pseudos**
    - [x] Implémentation : Ajouter la détection des pseudos en doublon dans `PlayerSetup.tsx` et afficher un message d'erreur stylisé.
    - [x] Documentation : Ajouter des commentaires descriptifs sur la validation.
    - [x] Vérification des imports : Imports Lucide et React propres.
    - [x] Vérification de la syntaxe : Validation JSX/TypeScript.
    - [x] Test unitaire (jest DOM) : Mettre à jour les tests Playwright pour couvrir ce cas.

* **Diversification & Aléatoire des Défis en Duo**
    - [x] Implémentation : Ajouter `activeDuoChallenge` dans `types.ts` et dans l'état de `useGameState.ts`, et l'afficher de manière stable dans `App.tsx`.
    - [x] Implémentation : Remplacer les défis par 20 nouveaux défis variés (incluant le défi Énigme) dans `useGameState.ts` pour enrayer la répétition en boucle.
    - [x] Documentation : Ajouter des JSDocs et commentaires.
    - [x] Vérification des imports : Imports propres.
    - [x] Vérification de la syntaxe : Rendu stable.

* **Cohérence et Fallbacks de toutes les Cartes Mystères**
    - [x] Implémentation : Mettre à jour les 16 cartes de `gameData.ts` pour qu'elles gèrent correctement les pluriels et disposent de solutions de repli (fallbacks) propres.
    - [x] Documentation : JSDoc et commentaires sur la cohérence des règles.
    - [x] Vérification des imports : S'assurer de la bonne compilation du projet.
    - [x] Test unitaire (jest DOM) : Exécuter et valider l'ensemble des tests Playwright.

## Phase 13 : Suivi des Tours (Laps), Fin de Partie (Arrivée) et Mouvements de Recul

* **Structure de Données (Tours & Mouvements)**
    - [x] Implémentation : Mettre à jour `types.ts` avec la catégorie `'movement'` et la propriété `laps: number` dans `Player`.
    - [x] Implémentation : Mettre à jour `PlayerSetup.tsx` pour initialiser `laps: 0`.
    - [x] Vérification de la syntaxe : Typages valides.

* **Logique de Fin de Partie (Laps & Arrivée)**
    - [x] Implémentation : Dans `useGameState.ts`, incrémenter le nombre de tours à chaque franchissement de DÉPART et déclencher `activeScreen: 'gameover'` si 3 tours sont atteints.
    - [x] Documentation : Ajouter des explications sur le comptage des tours.

* **Implémentation des Cartes de Recul et de l'Écran de Victoire**
    - [x] Implémentation : Modifier `s4`, `d3`, `d4` dans `gameData.ts` pour en faire des cartes de mouvement avec reculs.
    - [x] Implémentation : Gérer la résolution et le déplacement rétrograde dans `useGameState.ts`.
    - [x] Implémentation : Adapter `CardDrawer.tsx` pour afficher un bouton unique d'effet pour les cartes de mouvement.
    - [x] Implémentation : Rendre l'écran `gameover` dans `App.tsx` (annonce vainqueur, liste des perdants avec shot, et bouton rejouer) et afficher le compteur de tours.
    - [x] Documentation : JSDocs pour les nouvelles fonctions.
    - [x] Vérification des imports : Tous les imports et types compilent.
    - [x] Test unitaire (jest DOM) : Relancer et valider la suite de tests Playwright après modifications.

## Phase 14 : Super Pouvoirs, Obstacles de Plateau et Nouvelles Énigmes

* **[Obstacle Radar de Vitesse Interactif]**
    - [x] Implémentation : Rendre le Radar de Vitesse (case 3) interactif. Afficher l'amende dans `renderCenter()` si le joueur est flashé (dé >= 4) et proposer le paiement de 3 gorgées via une nouvelle action `paySipsAndNextTurn` ou l'utilisation d'un super pouvoir.
    - [x] Documentation (JSDoc et commentaires) : Documenter les nouvelles actions de paiement générique et de radar.
    - [x] Vérification des imports : S'assurer que tous les hooks de jeu sont importés correctement.
    - [x] Vérification de la syntaxe : Rendu et compilation TypeScript corrects.
    - [x] Test unitaire (jest DOM) : Valider le flux de radar via Playwright.

* **[Obstacle Alcootest Surprise Interactif]**
    - [x] Implémentation : Mettre à jour `resolveAlcootest` pour stocker le résultat ("POSITIF" / "NÉGATIF") dans `activeDuoChallenge` sans changer de tour directement. Dans `App.tsx`, afficher le résultat de l'alcootest et proposer au joueur soit de payer 3 gorgées (si positif, avec possibilité d'utiliser Shield/Cupidon), soit de distribuer 2 gorgées (si négatif), puis de passer son tour via `paySipsAndNextTurn`.
    - [x] Documentation (JSDoc et commentaires) : Documenter le flux de validation d'alcootest par étape.
    - [x] Vérification des imports : Imports propres dans `App.tsx`.
    - [x] Vérification de la syntaxe : Rendu JSX propre et typé.
    - [x] Test unitaire (jest DOM) : Valider le flux complet d'alcootest via Playwright.

* **[Intégration Graphique et Rendu des Super Pouvoirs]**
    - [x] Implémentation : Rendre les boutons néons pour déclencher les pouvoirs (Bouclier, Cible de Cœur, Relancer, Vol de Bar) dans `App.tsx` pour tous les écrans pertinents (Prison, Case Prison, Radar, Alcootest, Taxe Alcool, Bars, etc.). Mettre à jour `usePlayerPower` pour libérer un joueur de prison s'il utilise son pouvoir en cellule.
    - [x] Implémentation : Afficher le statut du pouvoir ("⚡ Pouvoir" / "❌ Utilisé") à côté du nom de chaque joueur dans la modale du tableau de bord.
    - [x] Documentation (JSDoc et commentaires) : JSDoc expliquant la libération de cellule et l'intégration des boutons.
    - [x] Vérification des imports : Vérifier les icônes et hooks utilisés.
    - [x] Vérification de la syntaxe : Pas d'erreurs de rendu sur mobile.
    - [x] Test unitaire (jest DOM) : S'assurer du bon passage des tests Playwright existants et nouveaux.

* **[Scénarios de Pierre-Feuille-Ciseaux (Chifoumi)]**
    - [x] Implémentation : Ajouter 3 défis Pierre-Feuille-Ciseaux aux `DUO_CHALLENGES` dans `useGameState.ts` (en les ajoutant à la fin sans modifier l'existant) et ajouter de nouvelles cartes mystères dans `gameData.ts` (en les rajoutant à la base de données sans modifier les cartes existantes) pour intégrer des scénarios de Pierre-Feuille-Ciseaux.
    - [x] Documentation (JSDoc et commentaires) : Documenter les règles du Pierre-Feuille-Ciseaux de l'apéro.
    - [x] Vérification des imports : S'assurer que tous les fichiers importent les bons types.
    - [x] Vérification de la syntaxe : S'assurer que le texte est en français correct.
    - [x] Test unitaire (jest DOM) : Valider la présence des nouveaux défis dans les données de jeu.

* **[Vérification de Cohérence Globale]**
    - [x] Implémentation : Re-vérifier la cohérence de chaque type de case (Start, Bar, Card, Bottle, Prison, Alcootest, Radar, Taxe, Chill). S'assurer que chaque pénalité est explicitement payable (et non automatique) et que le menu affiche les pouvoirs correctement.
    - [x] Documentation (JSDoc et commentaires) : Expliquer le fonctionnement des transitions de turn et d'état.
    - [x] Vérification des imports : Nettoyer les imports inutilisés ou doublons.
    - [x] Vérification de la syntaxe : Compilation TypeScript et linting sans erreurs.
    - [x] Test unitaire (jest DOM) : Exécuter la suite complète de tests Playwright et corriger toute régression.

* **[Choix Taxe Alcool (Gorgées ou Cul sec)]**
    - [x] Implémentation : Ajouter deux boutons sur l'écran de la case Taxe Alcool : "Boire 4 gorgées 💸" (ajoute 4 gorgées au joueur) et "Faire Cul sec ! 🍻" (ajoute 6 gorgées / 1 shot au joueur). Les deux boutons doivent proposer d'utiliser les super-pouvoirs avec le bon montant de pénalité (4 ou 6 sips) pour le transfert ou l'annulation.
    - [x] Documentation (JSDoc et commentaires) : Expliquer l'alternative cul sec dans le code.
    - [x] Vérification des imports : S'assurer que les boutons utilisent les bonnes fonctions.
    - [x] Vérification de la syntaxe : Rendu et CSS propres en colonnes ou côte à côte.
    - [x] Test unitaire (jest DOM) : Adapter et exécuter les tests Playwright pour couvrir ce double choix.

* **[Résolution de Cohérence Globale (Énigme, Duo, Tournée Générale)]**
    - [x] Implémentation : Implémenter les 3 actions de résolution dans `useGameState.ts` (`resolveDuoPenalty`, `resolveTourneeGenerale`, `selectTargetForEnigme`).
    - [x] Implémentation : Dans `App.tsx`, rendre la case 6 (Énigme) interactive avec sélection de cible et attribution des 3 gorgées, la case 15 (Tournée) avec ajout d'une gorgée à tous, et la modale duo avec sélection du perdant (P1, P2 ou les deux).
    - [x] Documentation (JSDoc et commentaires) : JSDoc documentant les nouvelles méthodes interactives.
    - [x] Vérification des imports : Nettoyer les imports d'icônes ou de fonctions.
    - [x] Vérification de la syntaxe : Rendu responsive et typage strict.
    - [x] Test unitaire (jest DOM) : Adapter et exécuter les tests Playwright pour couvrir ces trois nouveaux choix.

* **[Ajustement Layout BottleSpinner (Bouteille et Bouton overlaps)]**
    - [x] Implémentation : Réduire le rayon `RADIUS` à `85` dans `BottleSpinner.tsx` pour compacter les badges des joueurs.
    - [x] Implémentation : Augmenter la marge inférieure de `.spinner-circle` dans `src/index.css` à `margin: 10px 0 25px 0` pour pousser le bouton vers le bas et éviter toute collision.
    - [x] Documentation (JSDoc et commentaires) : Documenter les contraintes de dimensionnement de la bouteille.
    - [x] Vérification des imports : S'assurer que les styles compilent sans problème.
    - [x] Vérification de la syntaxe : Rendu correct du cercle et du bouton.
    - [x] Test unitaire (jest DOM) : Relancer et vérifier la suite complète de tests Playwright.

* **[Optimisation Espace et Alignement du Plateau (board-center)]**
    - [x] Implémentation : Ajuster `.board-grid` dans `index.css` pour supprimer `aspect-ratio: 1 / 1` et utiliser `height: 100%; max-height: 500px` afin de remplir l'espace vide en haut et agrandir la zone centrale.
    - [x] Implémentation : Modifier `.tile-header` dans `index.css` pour permettre le retour à la ligne (`white-space: normal`) et éviter les troncatures de texte sur les cases.
    - [x] Implémentation : Ajuster `renderCenter()` dans `App.tsx` pour tous les écrans pour agrandir les textes (11px-12px minimum pour la description), optimiser les espaces intérieurs et s'assurer qu'aucun bouton n'est tronqué.
    - [x] Documentation (JSDoc et commentaires) : Documenter l'approche responsive de la grille et de la zone centrale.
    - [x] Vérification des imports : S'assurer de la cohérence des icônes et composants.
    - [x] Vérification de la syntaxe : Valider la syntaxe et la compilation.
    - [x] Test unitaire (jest DOM) : Valider le bon passage de tous les tests Playwright.

## Phase 15 : Support PWA et Mode Hors-ligne Total (Offline)
* **Configuration PWA (Manifest & Meta Tags)**
    - [x] Implémentation : Créer `manifest.json` dans `public/` avec le nom de l'application, le thème néon, l'affichage autonome et les références aux icônes.
    - [x] Implémentation : Ajouter les balises meta mobiles et PWA (theme-color, apple-touch-icon, etc.) dans `index.html` et lier le manifest.
    - [x] Documentation (JSDoc et commentaires) : Documenter la structure du manifest et les balises meta.
    - [x] Vérification de la syntaxe : S'assurer que le fichier manifest.json est valide.

* **Service Worker et Caching Hors-ligne (Offline)**
    - [x] Implémentation : Créer le fichier `sw.js` dans `public/` configuré pour intercepter les requêtes, pré-cacher tous les assets statiques (.html, .js, .css, images, fichiers audio) et servir en mode Cache-First pour une disponibilité 100% hors-ligne.
    - [x] Implémentation : Ajouter le script d'enregistrement du Service Worker dans `src/main.tsx` avec gestion des cycles de mise à jour.
    - [x] Documentation (JSDoc et commentaires) : Documenter la stratégie de caching (Cache-First) et de mise à jour (activation immédiate).
    - [x] Vérification des imports : S'assurer que le service worker est bien servi à la racine.
    - [x] Test unitaire (jest DOM) : Valider que le projet compile et passe les tests Playwright avec le SW actif.

## Phase 16 : Extension du Plateau à 32 Cases, Victoire en 1 Tour et Animation de Déplacement

* **Agrandissement du Plateau à 32 Cases et Grille 9x9**
    - [x] Implémentation : Modifier `src/gameData.ts` pour définir exactement 32 cases génériques avec des descriptions vides (sauf DÉPART et Cellule/Allez en dégrisement).
    - [x] Implémentation : Mettre à jour `getGridPosition` dans `src/components/Board.tsx` et `.board-grid` / `.board-center` dans `src/index.css` pour une grille 9x9.
    - [x] Documentation (JSDoc et commentaires) : Expliquer le positionnement géométrique de la grille 9x9 et la structure des cases génériques.
    - [x] Vérification des imports : S'assurer que le composant compile.
    - [x] Vérification de la syntaxe : S'assurer que le CSS compile correctement.
    - [x] Test unitaire (jest DOM) : Valider les coordonnées renvoyées pour toutes les 32 cases.

* **Logique de Victoire en 1 Tour et Modulos**
    - [x] Implémentation : Mettre à jour `useGameState.ts` et `App.tsx` pour modifier la victoire à 1 tour complet (`laps >= 1`) et adapter les modulos.
    - [x] Documentation (JSDoc et commentaires) : Commenter le changement de limite de tours.
    - [x] Vérification des imports : Vérifier qu'aucun import mort n'est laissé.
    - [x] Vérification de la syntaxe : Vérifier la cohérence de types TypeScript.
    - [x] Test unitaire (jest DOM) : Vérifier que le statut de fin de partie s'active correctement après 1 tour.

* **Animation Pas à Pas du Déplacement du Pion**
    - [x] Implémentation : Modifier `rollDice` dans `useGameState.ts` (déplacement pas-à-pas) et `renderCenter` dans `App.tsx` (affichage intermédiaire avec `isMoving`). Corriger les ID hardcodés d'Alcootest, Énigme et Tournée dans `App.tsx` et `useGameState.ts`.
    - [x] Documentation (JSDoc et commentaires) : JSDoc sur l'intervalle asynchrone et les callbacks de fin de mouvement.
    - [x] Vérification des imports : S'assurer que les icônes nécessaires sont bien importées.
    - [x] Vérification de la syntaxe : S'assurer du non-chevauchement des animations.
    - [x] Test unitaire (jest DOM) : Ajuster et exécuter les tests Playwright (`tests/game.spec.ts`) pour valider la transition pas-à-pas et la fin de partie.


## Phase 17 : Centrage du Dé, Animation Pas-à-Pas Visuelle et Mise à Jour des Tests
* **Centrage et Amélioration Esthétique du Dé 3D (DiceRoller)**
    - [x] Implémentation : Ajouter `top: 0; left: 0;` sur `.dice-face` dans `src/index.css`, agrandir le dé à `80px` (ou `100px`), centrer verticalement et horizontalement la scène du dé et corriger les alignements CSS pour éviter les décalages.
    - [x] Documentation (JSDoc et commentaires) : Documenter les corrections de styles CSS 3D.
    - [x] Vérification des imports : Aucun import mort.
    - [x] Vérification de la syntaxe : CSS et TS valides.
    - [x] Test unitaire (jest DOM) : Simuler le centrage et la visibilité du dé.

* **Déplacement Pas-à-Pas Visible du Pion**
    - [x] Implémentation : S'assurer que le pion du joueur actif passe visiblement par chaque case intermédiaire à intervalle régulier de 300ms sur le plateau 9x9 sans sauts instantanés, et corriger toute désynchronisation d'état dans `src/hooks/useGameState.ts`.
    - [x] Documentation (JSDoc et commentaires) : Expliquer le cycle de rendu React et la gestion d'état asynchrone pour le mouvement.
    - [x] Vérification des imports : Pas d'imports inutilisés dans useGameState.
    - [x] Vérification de la syntaxe : Pas d'erreurs de typage ou de syntaxe.
    - [x] Test unitaire (jest DOM) : Test Playwright simulant le déplacement intermédiaire visible.

* **Correction et Mise à Jour Globale de la Suite de Tests Playwright**
    - [x] Implémentation : Mettre à jour `tests/board.spec.ts` pour la grille 9x9 (32 cases), ajuster les assertions de positions, corriger `tests/gameData.spec.ts` pour 32 cases et adapter `tests/game.spec.ts` avec des attentes suffisantes pour le dé et le déplacement pas-à-pas.
    - [x] Documentation (JSDoc et commentaires) : Commenter les scénarios de test mis à jour.
    - [x] Vérification des imports : Imports propres dans les fichiers de test.
    - [x] Vérification de la syntaxe : Syntaxe de test correcte.
    - [x] Test unitaire (jest DOM) : Exécuter la suite complète et s'assurer que tous les tests passent à 100%.

## Phase 18 : Scénarios Interactifs Aléatoires pour les Bars du Plateau
* **Définition et Typage des Nouveaux Scénarios**
    - [x] Implémentation : Mettre à jour `src/types.ts` avec les nouveaux champs de scénarios de bar (`activeBarScenario` de 1 à 12, `barScenarioTargetIds`, `barScenarioWinnerId`, `barScenarioStage`, etc.). Mettre à jour `src/gameData.ts` pour stocker les 12 scénarios dans une structure de données.
    - [x] Documentation (JSDoc et commentaires) : Documenter les champs optionnels d'état et la structure de données des scénarios.
    - [x] Vérification des imports : Pas d'imports cassés dans types ou gameData.
    - [x] Vérification de la syntaxe : S'assurer du bon typage TS.
    - [x] Test unitaire (jest DOM) : Valider la structure de données des scénarios de bars.

* **Logique Interactive dans useGameState**
    - [x] Implémentation : Mettre à jour `src/hooks/useGameState.ts` pour sélectionner aléatoirement l'un des 12 scénarios lors de l'arrivée sur un bar non possédé (à la fin de `moveOneStep`). Ajouter `resolveBarScenario` pour traiter les actions et pénalités de chaque scénario (recul de 3 cases, disqualification, gorgées aléatoires, devinette).
    - [x] Documentation (JSDoc et commentaires) : JSDoc expliquant la logique du choix aléatoire et le traitement de chaque scénario interactif.
    - [x] Vérification des imports : Imports corrects pour les types.
    - [x] Vérification de la syntaxe : S'assurer de la correction des fonctions.
    - [x] Test unitaire (jest DOM) : Écrire un test Playwright simulant plusieurs scénarios de bar interactifs aléatoires.

* **Composants d'Alignement et UI dans App.tsx**
    - [x] Implémentation : Modifier `renderCenter` dans `src/App.tsx` pour afficher l'interface spécifique du scénario aléatoire actif lors de l'achat d'un bar non possédé.
    - [x] Documentation (JSDoc et commentaires) : Documenter le rendu conditionnel de l'UI.
    - [x] Vérification des imports : Nettoyer les imports inutilisés.
    - [x] Vérification de la syntaxe : S'assurer que le JSX compile correctement.
    - [x] Test unitaire (jest DOM) : S'assurer que les boutons du centre s'affichent et réagissent correctement.

## Phase 19 : Rotation Sans Répétition des Scénarios de Bar et Cartes Mystères
* **Suivi des Scénarios de Bar et Cartes déjà Joués**
    - [x] Implémentation : Ajouter `usedBarScenarios` (indices) et `usedCardIds` (chaînes) dans `types.ts` au niveau de l'interface `GameState`. Les initialiser à `[]` dans `INITIAL_STATE`.
    - [x] Implémentation : Mettre à jour `useGameState.ts` pour filtrer les scénarios et les cartes mystères afin d'exclure ceux déjà joués, et réinitialiser les tableaux respectifs dès que toutes les options ont été épuisées.
    - [x] Documentation (JSDoc et commentaires) : Expliquer le mécanisme d'exclusion et de réinitialisation pour les cartes et bars.
    - [x] Vérification des imports : Nettoyer les imports (importer `CARDS_DATABASE` dans `useGameState.ts` et enlever les dépendances inutiles).
    - [x] Vérification de la syntaxe : S'assurer que le typage TS compile sans avertissement ni erreur.
    - [x] Test unitaire (jest DOM) : Adapter et écrire des tests dans `tests/game.spec.ts` pour vérifier qu'aucun scénario de bar ni aucune carte mystère ne se répète avant la fin d'une rotation complète.

## Phase 20 : Agrandissement des Instructions du Centre du Plateau
* **Optimisation de la Lisibilité du Texte Central**
    - [x] Implémentation : Augmenter la taille de police (`font-size`) pour le titre (`.center-action-card h3`) et la description/instructions (`.center-action-card p`) dans `src/index.css` pour une meilleure visibilité.
    - [x] Documentation (JSDoc et commentaires) : Documenter les choix de design responsive pour le texte central.
    - [x] Vérification des imports : S'assurer que le fichier CSS compile sans problème d'import.
    - [x] Vérification de la syntaxe : S'assurer que les valeurs CSS sont valides.
    - [x] Test unitaire (jest DOM) : Relancer et vérifier que tous les tests Playwright existants passent toujours avec succès.

## Phase 21 : Agrandissement Majeur des Textes et Boutons du Centre
* **Augmentation Importante des Font-Sizes**
    - [x] Implémentation : Augmenter encore plus la taille de police (h3 à `28px`, p à `22px`, boutons à `16px` dans `src/index.css`).
    - [x] Documentation (JSDoc et commentaires) : Expliquer la gestion du défilement et de la hauteur sur les petits viewports.
    - [x] Vérification des imports : S'assurer que les imports restent valides.
    - [x] Vérification de la syntaxe : S'assurer du bon format CSS.
    - [x] Test unitaire (jest DOM) : Valider que tous les tests Playwright s'exécutent avec succès.

## Phase 22 : Surcharges CSS avec !important pour Overrider les Inline Styles
* **Surcharge des Font-Sizes Centraux**
    - [x] Implémentation : Ajouter `!important` sur les tailles de police de `.center-action-card h3`, `.center-action-card p`, `.center-action-card button` et `.center-action-card div` dans `src/index.css`. Modifier `.center-actions-row` pour utiliser `flex-direction: column !important` afin d'empiler tous les boutons verticalement de haut en bas.
    - [x] Documentation (JSDoc et commentaires) : Commenter l'utilisation de `!important` et le changement d'alignement flexbox pour les boutons.
    - [x] Vérification des imports : S'assurer que le fichier CSS compile sans problème d'import.
    - [x] Vérification de la syntaxe : S'assurer que les valeurs CSS sont valides.
    - [x] Test unitaire (jest DOM) : Relancer et vérifier que tous les tests Playwright s'exécutent avec succès.

## Phase 23 : Alignement Vertical et Agrandissement Global de Tous les Boutons du Centre
* **Empilement Vertical et Taille des Boutons**
    - [x] Implémentation : Dans `src/index.css`, cibler globalement `.center-action-card button`, `.center-action-card .neon-btn` pour leur appliquer `font-size: 18px !important` et `padding: 14px 10px !important`.
    - [x] Implémentation : Dans `src/App.tsx`, modifier le conteneur des deux boutons de choix de joueur du Défi en Duo (ligne 524) et le conteneur des cibles de la Flèche de Cœur (ligne 79) en conteneur flex vertical (`flexDirection: 'column'`) pour empiler tous les boutons de choix verticalement de haut en bas.
    - [x] Documentation (JSDoc et commentaires) : Expliquer le passage en affichage vertical des boutons et l'agrandissement général pour l'ergonomie mobile.
    - [x] Vérification des imports : Aucun import cassé.
    - [x] Vérification de la syntaxe : S'assurer de la bonne syntaxe TypeScript et CSS.
    - [ ] Test unitaire (jest DOM) : Relancer et vérifier que tous les tests Playwright s'exécutent avec succès.

## Phase 24 : Agrandissement des Cartes Mystères (Modal Overlay)
* **Agrandissement de la Carte et des Textes**
    - [x] Implémentation : Dans `src/index.css`, augmenter la taille de `.card-3d` (largeur de `240px` à `280px`, hauteur de `310px` à `360px`) et les polices des éléments internes (`.card-category-badge` à `14px`, `.card-player-target` à `16px !important`, `.card-title` à `24px`, `.card-text` à `18px`, `.card-penalty` à `16px`). Agrandir les boutons d'action de carte (`.card-actions button`) à `16px` avec un padding de `12px`.
    - [x] Documentation (JSDoc et commentaires) : Commenter les modifications de design system pour le tiroir de cartes.
    - [x] Vérification des imports : Aucun import cassé.
    - [x] Vérification de la syntaxe : S'assurer du bon format CSS.
    - [ ] Test unitaire (jest DOM) : Relancer et vérifier que tous les tests Playwright s'exécutent avec succès.

## Phase 25 : Agrandissement Général et Ergonomie de tous les boutons
* **Agrandissement des Boutons et Contrôles**
    - [x] Implémentation
    - [x] Documentation (JSDoc et commentaires)
    - [x] Vérification des imports
    - [x] Vérification de la syntaxe
    - [x] Test unitaire (jest DOM)

## Phase 26 : Choix Interactif de Transfert de Gorgées (Flèche de Cœur)
* **Logique de Transfert et Modale de Décision**
    - [x] Implémentation
    - [x] Documentation (JSDoc et commentaires)
    - [x] Vérification des imports
    - [x] Vérification de la syntaxe
    - [x] Test unitaire (jest DOM)

## Phase 27 : Icônes Visuelles pour les Cases du Plateau (Sans Texte)
* **Intégration des Icônes et Nettoyage des Textes**
    - [x] Implémentation
    - [x] Documentation (JSDoc et commentaires)
    - [x] Vérification des imports
    - [x] Vérification de la syntaxe
    - [x] Test unitaire (jest DOM)

## Phase 28 : Colorisation Blanche Initiale et par Appartenance
* **Colorisation Blanche Initiale et par Appartenance**
    - [x] Implémentation
    - [x] Documentation (JSDoc et commentaires)
    - [x] Vérification des imports
    - [x] Vérification de la syntaxe
    - [x] Test unitaire (jest DOM)

## Phase 29 : Correction de la troncature des cartes et style des cellules
* **Correction Troncature et Style des Cellules**
    - [x] Implémentation : Rendre la bordure des cases non possédées complètement transparente (fond noir uni avec l'icône blanc pâle au centre), et rendre le texte des cartes mystères scrollable.
    - [x] Documentation (JSDoc et commentaires)
    - [x] Vérification des imports
    - [x] Vérification de la syntaxe
    - [x] Test unitaire (jest DOM)

## Phase 30 : Vérification agressive et rotation sans répétition des défis de la bouteille (Duo)
* **Vérification Agressive et Rotation Duo**
    - [x] Implémentation : Ajouter usedDuoChallenges au state, créer drawDuoChallengeWithoutRepetition, et l'intégrer lors du tirage de bouteille (resolveBottle).
    - [x] Documentation (JSDoc et commentaires)
    - [x] Vérification des imports
    - [x] Vérification de la syntaxe
    - [x] Test unitaire (jest DOM)

## Phase 31 : Résolution du problème de répétition des scénarios (localStorage & initialisation)
* **Résolution Répétition Scénarios**
    - [x] Implémentation : Mettre à jour getInitialState pour fusionner l'état localStorage avec les valeurs par défaut (evitant les undefined d'anciennes versions), et mettre à jour startGame pour réinitialiser les tableaux usedBarScenarios, usedCardIds et usedDuoChallenges à [] au début de chaque nouvelle partie.
    - [x] Documentation (JSDoc et commentaires)
    - [x] Vérification des imports
    - [x] Vérification de la syntaxe
    - [x] Test unitaire (jest DOM)

## Phase 32 : Limitation des déplacements rétrogrades pour ne pas dépasser la case DÉPART
* **Limitation Déplacements Rétrogrades**
    * [x] Implémentation : Remplacer les calculs de wrap-around modulo %32 par Math.max(0, oldPos - recul) dans useGameState.ts pour les cartes d4, s4 et le scénario recule3.
    * [x] Documentation (JSDoc et commentaires) : Expliquer que la case de départ 0 est la limite minimale en marche arrière.
    * [x] Vérification des imports : S'assurer que les imports sont valides et aucun import mort n'est laissé.
    * [x] Vérification de la syntaxe : S'assurer de la conformité du code TypeScript.
    * [x] Test unitaire (jest DOM) : Ajouter un test Playwright pour vérifier qu'un joueur ne recule jamais sous l'index 0 et ne wrap-around pas.

## Phase 33 : Ajout de 10 nouveaux scénarios de bar axés sur le recul
* **Nouveaux Scénarios de Recul**
    * [x] Implémentation : Ajouter 10 scénarios de bar rigolos et sans alcool (avec des reculs de cases) dans gameData.ts et useGameState.ts, puis gérer leur résolution.
    * [x] Documentation (JSDoc et commentaires) : Documenter les nouvelles actions de scénario et leurs règles de recul.
    * [x] Vérification des imports : S'assurer du bon import des icônes et composants.
    * [x] Vérification de la syntaxe : S'assurer de la conformité du code TypeScript et JSX.
    * [x] Test unitaire (jest DOM) : Ajouter/mettre à jour des tests dans gameData.spec.ts pour vérifier la présence des 22 scénarios au total et le bon tirage sans répétition.

## Phase 34 : Rendre le scénario 21 (Le chat et la souris) pleinement cohérent et interactif
* **Correction Scénario 21 et Cohérence Globale**
    - [x] Implémentation :
        1. Ajouter l'action 'caught_recule' dans useGameState.ts et implémenter la sélection de la personne attrapée dans App.tsx pour le scénario 21.
        2. Corriger le scénario 4 pour que le joueur ciblé reçoive effectivement les 4 gorgées de pénalité lors de l'achat.
        3. Réinitialiser systématiquement `barScenarioTargetIds`, `barScenarioWinnerId` et `barScenarioStage` à chaque pioche de scénario de bar pour éviter toute pollution d'état.
    - [x] Documentation (JSDoc et commentaires) : Documenter les corrections de cohérence et réinitialisation d'état dans le code.
    - [x] Vérification des imports : S'assurer du bon import des icônes et hooks.
    - [x] Vérification de la syntaxe : S'assurer de la validité syntaxique et du typage.
    - [x] Test unitaire (jest DOM) : Adapter et ajouter des E2E tests pour valider le scénario 21 et le scénario 4.

## Phase 35 : Résolution des bugs de sélection de cibles de scénarios et vérification de cohérence globale
* **Cohérence et Sélection des Scénarios de Bar (8, 16, 21)**
    - [x] Implémentation :
        1. Ajouter l'action 'set_targets' à resolveBarScenario dans useGameState.ts pour mettre à jour les cibles interactives sans déclencher d'effets secondaires indésirables ou finir le tour.
        2. Remplacer les appels hackés resolveBarScenario('youngest_fail', ...) par resolveBarScenario('set_targets', ...) dans App.tsx pour les scénarios 8, 16 et 21.
        3. Passer en revue tous les scénarios de 1 à 22 dans App.tsx et useGameState.ts pour vérifier qu'aucune incohérence logique ne subsiste.
    - [x] Documentation (JSDoc et commentaires) : Documenter la nouvelle action 'set_targets' et les raisons pour lesquelles la modification résout les régressions d'E2E.
    - [x] Vérification des imports : Vérifier qu'aucun import mort n'est laissé.
    - [x] Vérification de la syntaxe : Vérifier que le typage de l'action 'set_targets' est correct et compile.
    - [x] Test unitaire (jest DOM) : S'assurer que les E2E tests Playwright passent à 100%.

## Phase 36 : Résolution et vérification de la marche arrière des cartes fétiches (d4, s4, d3)
* **Vérification et Animation du Recul des Cartes Fétiches**
    - [x] Implémentation :
        1. Vérifier si pl.card?.suit est correctement accessible lors du tirage de d4.
        2. Assurer que le déplacement rétrograde (recul de cases) sur les cartes mystères met bien à jour la position du joueur ciblé de manière visible, et qu'il n'y a pas d'écrasement d'état.
        3. Mettre à jour s4 (Le 10 de Pique ♠️) pour reculer le joueur possédant la carte fétiche de Pique ♠️ (ou le joueur actif si aucun Pique en jeu) de 2 cases, pour la cohérence avec d4.
    - [x] Documentation (JSDoc et commentaires) : Documenter les règles de résolution et de ciblage des cartes de mouvement.
    - [x] Vérification des imports : S'assurer du bon import des icônes et composants.
    - [x] Vérification de la syntaxe : S'assurer de la conformité du code TypeScript et JSX.
    - [x] Test unitaire (jest DOM) : Écrire un test E2E Playwright spécifique pour la carte d4 (recul du détenteur de carreau) et s'assurer qu'il passe à 100%.

## Phase 37 : Réforme des règles de sortie de la Cellule de Dégrisement
* **Nouvelles règles de Cellule (Roller un 6, caution ou DÉPART)**
    - [x] Implémentation :
        1. Modifier nextTurn dans useGameState.ts pour ne pas libérer automatiquement le joueur en prison au tour suivant.
        2. Implémenter tryJailRoll, resolveJailRollResult, et returnToStartFromJail dans useGameState.ts.
        3. Mettre à jour l'affichage de la Cellule de Dégrisement dans App.tsx pour offrir le choix d'essayer d'avoir un 6 (jusqu'à 3 essais), de payer la caution, ou de retourner au DÉPART (après 3 échecs).
    - [x] Documentation (JSDoc et commentaires) : Documenter les nouvelles fonctions de gestion de cellule dans useGameState.ts.
    - [x] Vérification des imports : S'assurer du bon import des icônes et composants.
    - [x] Vérification de la syntaxe : S'assurer de la conformité du code TypeScript et JSX.
    - [x] Test unitaire (jest DOM) : Ajouter/adapter les tests Playwright pour couvrir les nouveaux scénarios de cellule de dégrisement.

## Phase 38 : Résolution de la compilation et amélioration de la sortie de cellule
* **Résolution de la compilation et amélioration de la sortie de cellule**
    - [x] Implémentation :
        1. Supprimer le retour de `payJailFineAndNextTurn` de `useGameState.ts` et sa destructuration dans `App.tsx`.
        2. Remplacer `payJailFineAndNextTurn` par `payJailFine` sur le bouton de caution de la 3ème tentative dans `App.tsx`.
        3. S'assurer qu'après avoir payé la caution (boire cul sec), le joueur est libéré et peut lancer le dé et avancer immédiatement.
    - [x] Documentation (JSDoc et commentaires) : Ajouter des commentaires descriptifs de la libération et du relancer de dé.
    - [x] Vérification des imports : Nettoyer les variables et fonctions obsolètes de `App.tsx` et `useGameState.ts`.
    - [x] Vérification de la syntaxe : Lancer `npm run build` et corriger toutes les erreurs de type / compilation.
    - [x] Test unitaire (jest DOM) : Exécuter tous les tests Playwright et vérifier qu'ils réussissent.
## Phase 39 : Masquage du paiement de la caution avant la 3ème tentative
* **Masquage du paiement de la caution avant la 3ème tentative**
    - [x] Implémentation :
        1. Retirer le bouton "Payer la caution" de l'écran initial de cellule (lorsque `rollResult === null`) dans `App.tsx` pour empêcher le joueur de payer volontairement avant 3 essais.
        2. S'assurer que le choix de payer la caution n'apparaît qu'après 3 essais échoués.
    - [x] Documentation (JSDoc et commentaires) : Mettre à jour les commentaires explicatifs dans `App.tsx`.
    - [x] Vérification des imports : Vérifier l'absence de régression ou d'icône non utilisée.
    - [x] Vérification de la syntaxe : Compiler avec `npm run build`.
    - [x] Test unitaire (jest DOM) : Adapter et exécuter les tests Playwright pour vérifier la visibilité conditionnelle du bouton de caution.

## Phase 40 : Résolution des incohérences de la base de cartes mystères et de l'UI
* **Ajustement des Couleurs et Données de Cartes**
    - [x] Implémentation
    - [x] Documentation (JSDoc et commentaires)
    - [x] Vérification des imports
    - [x] Vérification de la syntaxe
    - [x] Test unitaire (jest DOM)

* **Logique et État du Jeu Interactifs (useGameState.ts)**
    - [x] Implémentation
    - [x] Documentation (JSDoc et commentaires)
    - [x] Vérification des imports
    - [x] Vérification de la syntaxe
    - [x] Test unitaire (jest DOM)

* **Interface Utilisateur Dynamique et Interactive (CardDrawer.tsx & App.tsx) et Compilation**
    - [x] Implémentation : Passer les props manquantes (players, activePlayerId) dans App.tsx, nettoyer les imports lucide-react inutilisés dans CardDrawer.tsx, assouplir la signature de addSips et réconcilier activeCard dans useGameState.ts.
    - [x] Documentation (JSDoc et commentaires) : Ajouter les commentaires explicatifs JSDoc pour les signatures et props mis à jour.
    - [x] Vérification des imports : S'assurer que lucide-react et les props sont propres et exempts d'import mort.
    - [x] Vérification de la syntaxe : Lancer tsc pour s'assurer de l'absence d'erreur TypeScript.
    - [x] Test unitaire (jest DOM) : Valider les tests Playwright existants ou les adapter si nécessaire.


## Phase 41 : Cohérence des défis en duo (Bouteille) et correction du layout
* **Modélisation des Défis Duo et Logique de Résolution**
    - [x] Implémentation : Créer la constante DUO_CHALLENGES structurée dans src/gameData.ts avec type ('duel' | 'group') et penalty, adapter drawDuoChallengeWithoutRepetition et resolveBottle dans useGameState.ts, et ajouter activeDuoChallengeType et activeDuoChallengePenalty à l'état GameState.
    - [x] Documentation (JSDoc et commentaires) : Documenter les nouveaux types et propriétés dans types.ts et gameData.ts.
    - [x] Vérification des imports : Pas d'import circulaire.
    - [x] Vérification de la syntaxe : S'assurer du bon typage strict.
    - [x] Test unitaire (jest DOM) : Ajouter/adapter les tests de structure des défis duo.

* **Interface Utilisateur Dynamique et Interactive (App.tsx)**
    - [x] Implémentation : Afficher conditionnellement les boutons de résolution dans App.tsx (Boutons individuels pour duel, ou boutons collectifs pour groupe) et ajuster le style du conteneur pour éviter tout défilement/scrollbar.
    - [x] Documentation (JSDoc et commentaires) : Commenter les conditions de rendu.
    - [x] Vérification des imports : Nettoyer les imports.
    - [x] Vérification de la syntaxe : Lancer tsc pour valider la compilation.


## Phase 42 : Réconciliation robuste des défis duo (Bouteille) sauvegardés dans localStorage
* **Détection Dynamique et Fallbacks de Typage**
    - [x] Implémentation : Créer getDuoChallengeDetails dans src/gameData.ts pour analyser le texte et déterminer le type/pénalité, l'intégrer dans getInitialState de useGameState.ts, et dans App.tsx comme fallback.
    - [x] Documentation (JSDoc et commentaires) : Documenter la fonction getDuoChallengeDetails.
    - [x] Vérification des imports : S'assurer du bon import de la fonction.
    - [x] Vérification de la syntaxe : Lancer tsc pour s'assurer du typage.
    - [x] Test unitaire (jest DOM) : Valider les tests Playwright.

## Phase 43 : Correction du Scénario 16 (La Blague Carambar)
* **Pénalités Interactives et Sélection Multiple**
    - [x] Implémentation :
        1. Ajouter les classes CSS `.success-btn` et `.fail-btn` dans `src/index.css` pour résoudre les boutons sans style de sélection.
        2. Mettre à jour `resolveBarScenario` dans `src/hooks/useGameState.ts` pour ajouter l'action `'laugh_penalty'` permettant d'appliquer séparément les sentences "Cul Sec" (6 gorgées) ou "DÉPART" (position 0, isLockedAtStart = true) à n'importe quel joueur.
        3. Dans `src/App.tsx`, ajouter la gestion de `barScenarioStage === 'resolve_penalties'` pour le Scénario 16. Proposer à l'utilisateur de choisir pour chaque joueur ayant ri (ou pour le joueur actif si personne n'a ri) entre "Boire Cul sec 🍺" et "Retourner au DÉPART ↩️".
    - [x] Documentation (JSDoc et commentaires) : Ajouter JSDoc/Docstrings sur la nouvelle action et la résolution interactive par joueur.
    - [x] Vérification des imports : S'assurer du bon import des composants et icônes.
    - [x] Vérification de la syntaxe : S'assurer du typage TypeScript strict.
    - [x] Test unitaire (jest DOM) : Mettre à jour les tests Playwright dans `tests/game.spec.ts` pour valider ce flux interactif.

## Phase 44 : Commentaires de spécification de l'UI pour la carte s3
* **Spécification des effets de la carte s3 (Valet de Pique ♠️)**
    - [x] Implémentation : Ajouter un commentaire détaillé expliquant les cas et les boutons à afficher dans l'UI pour la carte `s3` dans `src/gameData.ts`.
    - [x] Documentation (JSDoc et commentaires) : Documenter les règles d'UI et de sentences.
    - [x] Vérification des imports : Aucun import modifié.
    - [x] Vérification de la syntaxe : S'assurer du bon format du fichier gameData.ts.
    - [x] Test unitaire (jest DOM) : Aucun test requis pour les commentaires.

## Phase 45 : Commentaires de spécification de l'UI pour les 22 scénarios de bar
* **Spécification de l'UI pour BAR_SCENARIOS**
    - [x] Implémentation : Ajouter les commentaires détaillant les cas et boutons d'UI correspondants pour chaque scénario dans `src/gameData.ts`.
    - [x] Documentation (JSDoc et commentaires) : Documenter le comportement attendu des composants pour tous les scénarios de bar.
    - [x] Vérification des imports : Pas de changement d'import.
    - [x] Vérification de la syntaxe : S'assurer que le fichier gameData.ts compile correctement sans erreurs.
    - [x] Test unitaire (jest DOM) : Aucun test requis pour les commentaires.

## Phase 46 : Mise à jour des commentaires des boutons de scénarios dans gameData.ts
* **Mise à jour des commentaires d'UI dans BAR_SCENARIOS**
    - [x] Implémentation : Mettre à jour les commentaires des scénarios 13 à 22 dans `src/gameData.ts` pour correspondre précisément aux boutons réels de `App.tsx` (boutons de réussite de défi et de recul de cases).
    - [x] Documentation (JSDoc et commentaires) : Corriger et documenter les commentaires d'UI pour une cohérence parfaite.
    - [x] Vérification des imports : Aucun import modifié.
    - [x] Vérification de la syntaxe : Lancer `npm run build` pour vérifier que tout compile.
    - [x] Test unitaire (jest DOM) : Aucun test nécessaire.

## Phase 47 : Ajout des commentaires spécifiant les boutons de l'UI pour CARDS_DATABASE et DUO_CHALLENGES dans gameData.ts
* **Commentaires de spécification de l'UI pour CARDS_DATABASE**
    - [x] Implémentation : Ajouter un commentaire détaillé en bas de chaque carte de la base de données de cartes `CARDS_DATABASE` dans `src/gameData.ts` décrivant les boutons d'UI correspondants.
    - [x] Documentation (JSDoc et commentaires) : Expliquer clairement les boutons d'UI affichés par le jeu pour chaque carte.
    - [x] Vérification des imports : Aucun import modifié.
    - [x] Vérification de la syntaxe : S'assurer du bon formatage du fichier gameData.ts.
    - [x] Test unitaire (jest DOM) : Relancer les tests existants pour s'assurer qu'aucun n'est rompu.

* **Commentaires de spécification de l'UI pour DUO_CHALLENGES**
    - [x] Implémentation : Ajouter un commentaire détaillé en bas de chaque défi duo de `DUO_CHALLENGES` dans `src/gameData.ts` décrivant les boutons d'UI correspondants.
    - [x] Documentation (JSDoc et commentaires) : Expliquer clairement les boutons d'UI affichés pour chaque défi duo.
    - [x] Vérification des imports : Aucun import modifié.
    - [x] Vérification de la syntaxe : Lancer `npm run build` pour vérifier que le projet compile.
    - [x] Test unitaire (jest DOM) : Exécuter `npm run test` pour s'assurer que tous les tests Playwright passent.

## Phase 48 : Corrections des Incohérences des Boutons de l'UI
* **Résolution des Erreurs de Compilation dans App.tsx**
    - [/] Implémentation : Corriger les types dans setInteractiveChoices et supprimer getDuoChallengeConfig en double, renommer targetName inutilisé.
    - [x] Implémentation : Corriger les types dans setInteractiveChoices et supprimer getDuoChallengeConfig en double, renommer targetName inutilisé.
    - [x] Documentation (JSDoc et commentaires) : Ajouter des commentaires descriptifs sur le typage explicite de copy dans setInteractiveChoices.
    - [x] Vérification des imports : Pas d'import mort.
    - [x] Vérification de la syntaxe : S'assurer du bon typage strict et faire tourner npm run build.
* **Vérification et Corrections des Cartes (Cards) dans CardDrawer.tsx**
    - [x] Implémentation : Ajouter les commentaires `// [CORRIGÉ]` sur les IDs des cartes et vérifier l'affichage des boutons selon les spécifications.
    - [x] Documentation : JSDoc pour les nouvelles signatures et méthodes.
    - [x] Vérification de la syntaxe : Compilation TypeScript et rendu OK.
* **Vérification et Corrections des Scénarios de Bar (Bar) dans App.tsx**
    - [x] Implémentation : Ajouter les commentaires `// [CORRIGÉ]` sur les IDs de bars et vérifier les boutons de scénarios interactifs selon les spécifications.
    - [x] Documentation : Commentaires de code et explications.
    - [x] Vérification de la syntaxe : Compilation TypeScript OK.
* **Vérification et Corrections des Défis Duo (Duo) dans App.tsx**
    - [x] Implémentation : Ajouter les commentaires `// [CORRIGÉ]` sur les IDs de duo et vérifier l'affichage des boutons selon les spécifications.
    - [x] Documentation : Commentaires de code et explications.
    - [x] Vérification de la syntaxe : Compilation TypeScript OK.
* **Tests et Validation Playwright**
    - [x] Implémentation : Lancer et exécuter toute la suite de tests Playwright.
    - [x] Documentation : Mettre à jour si nécessaire les assertions de tests.
    - [x] Test unitaire (jest/Playwright E2E) : S'assurer que npx playwright test passe avec succès.

## Phase 49 : Correction des Scénarios de Cartes et Validation E2E
* **Correction des Scénarios de Cartes et Validation E2E**
    - [x] Implémentation : Résoudre le bug de traitement de payload pour les cartes de mouvement et d'écrasement de position dans `useGameState.ts`.
    - [x] Implémentation : Mettre à jour la détection du fétiche Carreau pour `d4` dans `CardDrawer.tsx`.
    - [x] Implémentation : Mettre à jour les choix pré-remplis de duo, les classes CSS des boutons, et corriger les scénarios 4, 16 et 21 dans `App.tsx`.
    - [x] Documentation (JSDoc et commentaires) : Documenter les corrections apportées.
    - [x] Vérification des imports : Pas d'import mort.
    - [x] Vérification de la syntaxe : Compilation TypeScript OK.
    - [x] Test unitaire (Playwright E2E) : S'assurer que tous les tests passent à 100%.



## Phase 50 : Correction des Affichages Tronqués et Remplacement des Pseudos

* **[Correction des Styles CSS de la Zone Centrale]**
    - [x] Implémentation : Retirer `!important` des polices de `.neon-btn` (ligne 128, 134) et de `.center-action-card h3`, `.center-action-card p`, `.center-action-card div`. Utiliser le sélecteur d'enfant direct `>` pour `.center-action-card > button` et `.center-action-card > .neon-btn` afin d'éviter d'appliquer les dimensions globales de bouton aux listes de choix imbriquées.
    - [x] Documentation (JSDoc et commentaires) : Documenter les corrections de style et l'usage de sélecteurs d'enfants directs dans `src/index.css`.
    - [x] Vérification des imports : Aucun import mort introduit.
    - [x] Vérification de la syntaxe : S'assurer que le fichier CSS compile et est valide.
    - [x] Test unitaire (jest DOM) : Relancer les tests Playwright pour valider que le design reste intègre.

* **[Correction du Remplacement de {p1} et {p2} dans les Défis Duo]**
    - [x] Implémentation : Remplacer l'usage de `.replace` par des expressions régulières globales `/{p1}/g` et `/{p2}/g` dans `src/hooks/useGameState.ts`, `src/App.tsx`, et `src/gameData.ts` pour garantir que toutes les occurrences des placeholders `{p1}` et `{p2}` sont remplacées par les vrais pseudos des joueurs.
    - [x] Documentation (JSDoc et commentaires) : Ajouter des commentaires explicatifs de ce choix de remplacement global.
    - [x] Vérification des imports : Valider les imports TypeScript.
    - [x] Vérification de la syntaxe : Lancer `npm run build` pour garantir qu'aucune erreur TypeScript n'est introduite.
    - [x] Test unitaire (jest DOM) : Valider que les 24 tests Playwright passent avec succès.

* **[Correction des Styles CSS du Tiroir de Cartes (CardDrawer)]**
    - [x] Implémentation : Remplacer le sélecteur global de boutons `.card-actions button` par `.card-actions > button, .card-actions > div > button` pour éviter d'appliquer les dimensions des boutons principaux de carte aux listes de choix de joueurs imbriquées.
    - [x] Documentation (JSDoc et commentaires) : Expliquer l'ajustement du sélecteur CSS dans `src/index.css`.
    - [x] Vérification des imports : S'assurer qu'aucun style ou import tiers n'est cassé.
    - [x] Vérification de la syntaxe : Lancer la compilation via `npm run build`.
    - [x] Test unitaire (jest DOM) : Exécuter les tests Playwright pour vérifier l'absence de régression.

* **[Correction du Rendu Interactif du Scénario 6 (Le Coude Improbable)]**
    - [x] Implémentation : Modifier `src/App.tsx` pour le Scénario 6 afin que le bouton "Personne n'a réussi" n'applique pas automatiquement les gorgées mais bascule vers un écran de choix pour l'ensemble des joueurs (dont le joueur actif). Permettre à l'utilisateur de choisir entre "Cul Sec 🍺" et "DÉPART 🏁" pour chaque joueur avant de valider. (Déjà présent dans App.tsx)
    - [x] Implémentation : Mettre à jour `tests/game.spec.ts` pour injecter un mock déterministe de Math.random et s'assurer que le test de cycle de jeu clique sur le bouton "Valider" si un scénario de bar interactif s'ouvre, évitant ainsi les échecs de test intermittents.
    - [x] Documentation (JSDoc et commentaires) : Commenter le flux de choix interactif pour le scénario 6 et le mécanisme de robustesse dans le fichier de test.
    - [x] Vérification des imports : S'assurer que les variables et fonctions requises sont importées.
    - [x] Vérification de la syntaxe : Lancer la compilation via `npm run build`.
    - [x] Test unitaire (jest DOM) : Relancer Playwright pour valider le bon fonctionnement de tous les tests.

* **[Affichage des Cartes Fétiches dans les Listes de Choix et Dropdowns]**
    - [x] Implémentation : Dans `CardDrawer.tsx` et `App.tsx`, ajouter l'affichage de la carte fétiche (valeur et enseigne) à côté du nom de chaque joueur dans les listes de choix interactifs et les dropdowns de sélection. (Déjà présent)
    - [x] Documentation (JSDoc et commentaires) : Commenter les modifications de rendu des noms de joueurs avec leur carte.
    - [x] Vérification des imports : Valider les imports des symboles ou fonctions requis.
    - [x] Vérification de la syntaxe : Lancer la compilation via `npm run build`.
    - [x] Test unitaire (jest DOM) : Relancer Playwright pour valider qu'aucun test n'est brisé.

## Phase 51 : Agrandissement des sélections de joueurs et couleurs blanches pour Pique/Trèfle
* **[Agrandissement des Lignes de Choix de Joueurs et Boutons]**
    - [x] Implémentation : Dans `src/index.css`, définir la classe `.player-fetiche-badge` avec des styles blancs et agrandis.
    - [x] Implémentation : Dans `src/components/CardDrawer.tsx` et `src/App.tsx`, remplacer les badges de cartes inline par la classe `.player-fetiche-badge`, agrandir la police des noms à 14px, augmenter le padding des lignes et agrandir les boutons de choix.
    - [x] Implémentation : Dans `src/App.tsx` et `src/components/CardDrawer.tsx`, modifier `getSuitSymbol` pour retourner des caractères textes de pique (♠) et trèfle (♣) au lieu d'émojis afin d'honorer la coloration blanche CSS.
    - [x] Documentation (JSDoc et commentaires) : Documenter les choix d'agrandissement et l'usage de caractères texte pour la couleur.
    - [x] Vérification des imports : Aucun import mort.
    - [x] Vérification de la syntaxe : Lancer `npm run build`.
    - [x] Test unitaire (jest DOM) : Relancer Playwright pour valider que tous les tests passent.

## Phase 52 : Correction et cohérence du Scénario 21 (Le chat et la souris)
* **[Correction Scénario 21 et Option de Prison]**
    - [x] Implémentation :
        1. Modifier `useGameState.ts` dans `caught_recule` pour que le joueur attrapé soit envoyé en cellule de dégrisement (position 8, isPrisoner: true, prisonTurns: 0) au lieu de reculer de 3 cases.
        2. Modifier `App.tsx` (scénario 21) pour afficher le bouton "Aucune capture (Aller en dégrisement 🚨)" quand aucun joueur n'est sélectionné, qui appelle `resolveBarScenario('resolve_custom', ...)` pour envoyer le joueur actif en cellule. Si un joueur est sélectionné, le bouton affiche "Valider la Capture de [Nom]".
    - [x] Documentation (JSDoc et commentaires) : Expliquer dans `App.tsx` et `useGameState.ts` la mise en conformité du scénario avec les règles (envoi en cellule).
    - [x] Vérification des imports : Nettoyer ou vérifier tous les imports.
    - [x] Vérification de la syntaxe : S'assurer de la conformité TypeScript/JSX et compiler via `npm run build`.
    - [x] Test unitaire (jest DOM) : Adapter le test de capture existant dans `tests/game.spec.ts` pour valider que le joueur attrapé va en prison, et ajouter un test validant que si personne n'est capturé, le joueur actif va en prison.
