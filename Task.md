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










