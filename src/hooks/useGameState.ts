import { useState, useEffect } from 'react';
import type { GameState, Player, SuitType, Card } from '../types';
import { INITIAL_TILES, CARDS_DATABASE } from '../gameData';

/**
 * Draws a random card from the database without repeating cards that were already drawn in the current rotation.
 */
export function drawCardWithoutRepetition(usedIds: string[]): { card: Card; newUsedIds: string[] } {
  let available = CARDS_DATABASE.filter((c) => !usedIds.includes(c.id));
  let newUsedIds = [...usedIds];
  if (available.length === 0) {
    available = CARDS_DATABASE;
    newUsedIds = [];
  }
  const randomIndex = Math.floor(Math.random() * available.length);
  const selectedCard = available[randomIndex];
  newUsedIds.push(selectedCard.id);
  return { card: selectedCard, newUsedIds: newUsedIds };
}

/**
 * Selects a random bar scenario index (1 to 12) without repeating until all 12 have been played.
 */
export function drawBarScenarioWithoutRepetition(usedScenarios: number[]): { scenario: number; newUsedScenarios: number[] } {
  let available = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((s) => !usedScenarios.includes(s));
  let newUsedScenarios = [...usedScenarios];
  if (available.length === 0) {
    available = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    newUsedScenarios = [];
  }
  const randomIndex = Math.floor(Math.random() * available.length);
  const selectedScenario = available[randomIndex];
  newUsedScenarios.push(selectedScenario);
  return { scenario: selectedScenario, newUsedScenarios: newUsedScenarios };
}


/**
 * Shuffles a 32-card traditional deck and returns a card fétiche for each player.
 */
function drawInitialPlayerCards(playerCount: number): { suit: SuitType; cardValue: string }[] {
  const suits: SuitType[] = ['pique', 'coeur', 'carreau', 'trefle'];
  const values = ['As', 'Roi', 'Dame', 'Valet', '10', '9', '8', '7'];
  const deck: { suit: SuitType; cardValue: string }[] = [];
  for (const suit of suits) {
    for (const val of values) {
      deck.push({ suit, cardValue: val });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, playerCount);
}

const INITIAL_STATE: GameState = {
  players: [],
  currentPlayerIndex: 0,
  tiles: INITIAL_TILES,
  activeCard: null,
  activeScreen: 'setup',
  selectedBottleTargetId: null,
  activeDuoChallenge: null,
  diceValue: null,
  logMessages: ['Bienvenue sur Alcooly ! configurez la partie.'],
  usedBarScenarios: [],
  usedCardIds: [],
  pendingTransfer: null,
};

/**
 * Loads the initial state from localStorage if it exists, otherwise returns INITIAL_STATE.
 */
const getInitialState = (): GameState => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('alcooly_game_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved state:', e);
      }
    }
  }
  return INITIAL_STATE;
};

/**
 * Custom React hook to manage Alcooly game state.
 * Encapsulates setup, movement, tile effects, property purchases, and turns.
 */
export function useGameState() {
  const [state, setState] = useState<GameState>(getInitialState);

  // Auto-save game state to localStorage whenever it changes
  useEffect(() => {
    if (state.players.length > 0) {
      localStorage.setItem('alcooly_game_state', JSON.stringify(state));
    }
  }, [state]);


  // Starts the game with configured players and draws initial fétiche cards
  const startGame = (configuredPlayers: Player[]) => {
    const cards = drawInitialPlayerCards(configuredPlayers.length);
    const playersWithCards = configuredPlayers.map((p, idx) => ({
      ...p,
      card: cards[idx],
      laps: 0,
      powerUsed: false,
    }));
    setState((prev) => ({
      ...prev,
      players: playersWithCards,
      activeScreen: 'reveal',
      logMessages: ['Chaque joueur tire sa carte fétiche !', 'La soirée commence !'],
    }));
  };

  // Switch from card reveal screen to main board game screen
  const confirmReveal = () => {
    setState((prev) => ({
      ...prev,
      activeScreen: 'board',
      logMessages: ['C\'est au tour de ' + prev.players[0].name + '.', ...prev.logMessages],
    }));
  };

  /**
   * Handles dice roll: first stores the dice value and sets isMoving,
   * then animates the token step-by-step using chained setTimeout calls.
   * Once the movement is complete, resolves the final tile effect.
   *
   * @param diceValue - The result of the dice roll (1-6)
   */
  const rollDice = (diceValue: number) => {
    // Phase 1: Show the dice result and flag isMoving
    setState((prev) => ({
      ...prev,
      diceValue,
      isMoving: true,
    }));

    // Phase 2: Animate step-by-step after a short delay
    const STEP_DELAY_MS = 300;
    let stepsRemaining = diceValue;

    const moveOneStep = () => {
      stepsRemaining--;

      setState((prev) => {
        const players = [...prev.players];
        const p = { ...players[prev.currentPlayerIndex] };
        const newPos = (p.position + 1) % 32;
        p.position = newPos;

        // Check lap completion when crossing tile 0
        if (newPos === 0 && !p.isPrisoner) {
          p.laps = (p.laps || 0) + 1;
        }

        players[prev.currentPlayerIndex] = p;
        return { ...prev, players };
      });

      if (stepsRemaining > 0) {
        setTimeout(moveOneStep, STEP_DELAY_MS);
      } else {
        // Phase 3: Movement finished — resolve destination
        setTimeout(() => {
          setState((prev) => {
            const players = [...prev.players];
            const p = { ...players[prev.currentPlayerIndex] };
            const landedTile = prev.tiles[p.position];

            let log = `${p.name} fait un ${diceValue} et arrive sur : ${landedTile.name}.`;

            // Check victory (1 lap)
            if ((p.laps || 0) >= 1) {
              return {
                ...prev,
                players,
                isMoving: false,
                activeScreen: 'gameover',
                logMessages: [`🏆 ${p.name} a franchi l'arrivée et gagne la partie !`, log, ...prev.logMessages].slice(0, 15),
              };
            }

            // Radar check
            if (landedTile.name.includes('Radar') && diceValue >= 4) {
              log += ` 📸 FLASHÉ !`;
            }

            let nextScreen: GameState['activeScreen'] = 'board';
            let activeCard = prev.activeCard;
            let activeBarScenario: number | undefined = undefined;
            let barScenarioTargetIds: string[] = [];
            let barScenarioWinnerId = '';
            let barScenarioStage: GameState['barScenarioStage'] = undefined;
            let usedCardIds = prev.usedCardIds || [];
            let usedBarScenarios = prev.usedBarScenarios || [];

            if (landedTile.type === 'card') {
              nextScreen = 'card';
              const drawRes = drawCardWithoutRepetition(usedCardIds);
              activeCard = drawRes.card;
              usedCardIds = drawRes.newUsedIds;
            } else if (landedTile.type === 'bottle') {
              nextScreen = 'bottle';
            } else if (landedTile.type === 'bar' && !landedTile.ownerId) {
              const drawRes = drawBarScenarioWithoutRepetition(usedBarScenarios);
              activeBarScenario = drawRes.scenario;
              usedBarScenarios = drawRes.newUsedScenarios;
              const otherPlayers = players.filter((pl) => pl.id !== p.id);

              if (activeBarScenario === 4) { // Target player boit 4
                const randIdx = Math.floor(Math.random() * players.length);
                barScenarioTargetIds = [players[randIdx].id];
              } else if (activeBarScenario === 7) { // 2 players bisou front
                if (players.length >= 2) {
                  const shuffled = [...players].sort(() => 0.5 - Math.random());
                  barScenarioTargetIds = [shuffled[0].id, shuffled[1].id];
                } else {
                  barScenarioTargetIds = [p.id];
                }
              } else if (activeBarScenario === 12) { // 3 players devinette
                const shuffledOthers = [...otherPlayers].sort(() => 0.5 - Math.random());
                const targets = shuffledOthers.slice(0, 3);
                barScenarioTargetIds = targets.map((t) => t.id);
                if (targets.length > 0) {
                  const winnerIdx = Math.floor(Math.random() * targets.length);
                  barScenarioWinnerId = targets[winnerIdx].id;
                }
                barScenarioStage = 'guess';
              }
            }

            return {
              ...prev,
              players,
              isMoving: false,
              activeScreen: nextScreen,
              activeCard,
              activeBarScenario,
              barScenarioTargetIds,
              barScenarioWinnerId,
              barScenarioStage,
              usedCardIds,
              usedBarScenarios,
              logMessages: [log, ...prev.logMessages].slice(0, 15),
            };
          });
        }, STEP_DELAY_MS);
      }
    };

    // Start the first step immediately (DiceRoller already paused 1.5s)
    setTimeout(moveOneStep, 100);
  };

  // Resolves the drawn card challenge
  const resolveCard = (success: boolean, penalty: number) => {
    setState((prev) => {
      const players = [...prev.players];
      const currentPlayerIndex = prev.currentPlayerIndex;
      const p = { ...players[currentPlayerIndex] };
      const card = prev.activeCard;
      let log = '';

      if (card && card.category === 'movement') {
        log = `🎬 Effet de carte : ${card.title}. `;
      } else if (success) {
        p.challengesCompleted += 1;
        log = `✅ ${p.name} a réussi son défi !`;
      } else {
        p.sipsCount += penalty;
        log = `🍺 ${p.name} n'a pas relevé le défi et boit ${penalty} gorgée(s) !`;
      }

      players[currentPlayerIndex] = p;

      let nextScreen: GameState['activeScreen'] = 'board';
      let activeCard = null;
      let usedCardIds = prev.usedCardIds || [];

      if (card) {
        if (card.id === 'd3') {
          p.position = 0;
          log += `🔄 ${p.name} est renvoyé à la case DÉPART !`;
          players[currentPlayerIndex] = p;
        } else if (card.id === 'd4') {
          const targetIndex = players.findIndex((pl) => pl.card?.suit === 'carreau');
          const finalIndex = targetIndex !== -1 ? targetIndex : currentPlayerIndex;
          const target = { ...players[finalIndex] };
          const oldPos = target.position;
          const newPos = (oldPos - 3 + 32) % 32;
          target.position = newPos;
          players[finalIndex] = target;
          log += ` ⬅️ ${target.name} recule de 3 cases sur : ${prev.tiles[newPos].name} !`;
          
          const landedTile = prev.tiles[newPos];
          if (landedTile.type === 'card') {
            nextScreen = 'card';
            const drawRes = drawCardWithoutRepetition(usedCardIds);
            activeCard = drawRes.card;
            usedCardIds = drawRes.newUsedIds;
          } else if (landedTile.type === 'bottle') {
            nextScreen = 'bottle';
          }
        } else if (card.id === 's4') {
          const oldPos = p.position;
          const newPos = (oldPos - 2 + 32) % 32;
          p.position = newPos;
          players[currentPlayerIndex] = p;
          log += ` ⬅️ ${p.name} recule de 2 cases sur : ${prev.tiles[newPos].name} !`;

          const landedTile = prev.tiles[newPos];
          if (landedTile.type === 'card') {
            nextScreen = 'card';
            const drawRes = drawCardWithoutRepetition(usedCardIds);
            activeCard = drawRes.card;
            usedCardIds = drawRes.newUsedIds;
          } else if (landedTile.type === 'bottle') {
            nextScreen = 'bottle';
          }
        }
      }

      return {
        ...prev,
        players,
        activeCard,
        activeScreen: nextScreen,
        usedCardIds,
        logMessages: [log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  // Resolves the bottle spin target selection
  const resolveBottle = (target: Player) => {
    setState((prev) => {
      const p1 = prev.players[prev.currentPlayerIndex].name;
      const p2 = target.name;
      const DUO_CHALLENGES = [
        `🤝 Check Secret : ${p1} et ${p2} doivent inventer une poignée de main secrète complexe en 15 secondes. Échec = 2 gorgées chacun !`,
        `👁️ Duel de regards : ${p1} et ${p2} se fixent dans les yeux. Le premier qui rit ou cligne boit 3 gorgées !`,
        `🗣️ Chuchotement : ${p1} doit chuchoter à l'oreille de ${p2} un secret rigolo ou inavouable. Si l'un refuse : 1 shot !`,
        `🥂 Les Bras Croisés : ${p1} et ${p2} doivent boire une gorgée en ayant leurs bras croisés l'un dans l'autre.`,
        `🎭 Mime Chrono : ${p1} mime une action de soirée pour ${p2}. Si ${p2} ne trouve pas en 20s, ils boivent 2 gorgées chacun !`,
        `🧠 Capitales Express : ${p1} et ${p2} citent des capitales d'Europe à tour de rôle. Le premier qui bloque boit 2 gorgées !`,
        `🤫 Jeu des Synonymes : ${p1} donne un mot lié à la fête, ${p2} doit donner un synonyme en moins de 3s. Le perdant boit 2 gorgées.`,
        `🍎 Dos à dos : ${p1} et ${p2} se tiennent dos à dos et doivent s'asseoir au sol puis se relever sans les mains. Raté = 3 gorgées chacun !`,
        `👑 Flatterie mutuelle : ${p1} et ${p2} se font des compliments exagérés à tour de rôle sans rire. Le premier qui rit boit 2 gorgées.`,
        `🤥 Vérité ou Mensonge : ${p1} raconte une anecdote folle. Si ${p2} devine correctement si c'est vrai, ${p1} boit 2 gorgées, sinon ${p2} boit 2.`,
        `🕴️ Miroir Humain : ${p2} doit copier tous les mouvements de ${p1} pendant 15 secondes. Si l'un d'eux rit, il boit 2 gorgées.`,
        `🦁 Cris sauvages : ${p1} et ${p2} imitent un cri d'animal en même temps. Le reste du groupe vote pour le plus ridicule. Le perdant boit 2.`,
        `🤐 Sans les mains : ${p1} doit faire boire une gorgée à ${p2} directement au verre sans que ${p2} n'utilise ses mains. Échec = 2 gorgées chacun.`,
        `🍿 Célébrité Mystère : ${p1} fait deviner une célébrité à ${p2} uniquement avec des adjectifs en 30s. Échec = 2 gorgées chacun.`,
        `🤠 Shérif et Adjoint : ${p1} devient le shérif et ${p2} son adjoint pour 1 tour. Quand le shérif boit, l'adjoint boit aussi !`,
        `🎈 Souffle magique : ${p1} et ${p2} maintiennent un papier en l'air en soufflant dessus alternativement. Le premier qui échoue boit 2.`,
        `🤐 Questions rapides : ${p1} pose 3 questions rapides à ${p2}. ${p2} doit répondre sans dire "oui", "non" ni hésiter. Sinon, il boit 2 !`,
        `🎯 Énigme de l'Apéro : ${p1} doit poser une énigme à ${p2}. Si ${p2} trouve, ${p1} boit 3 gorgées. Sinon, c'est ${p2} qui boit 3 !`,
        `🎶 Duo de Karaoké : ${p1} commence à chanter une chanson connue, ${p2} doit chanter la suite immédiate sans hésiter. Sinon : 2 gorgées.`,
        `🍦 Choix cornélien : ${p1} demande à ${p2} de choisir entre deux dilemmes horribles. Le reste du groupe vote. La minorité boit 2 gorgées.`,
        `🧠 Quiz Culture : ${p1} pose une question de culture générale à ${p2}. Si ${p2} répond faux en 5s, il boit 3 gorgées. Sinon, ${p1} boit 3 !`,
        `⚡ Suite Logique : ${p1} donne 3 nombres d'une suite logique (ex: 3, 6, 12...), ${p2} doit deviner le 4ème en moins de 5 secondes. Échec = 3 gorgées pour ${p2} !`,
        `🧪 Énigme du Sphinx : ${p1} demande à ${p2} : "Qu'est-ce qui a des clés mais ne peut ouvrir aucune serrure ?" (Réponse : Un piano / une chanson). Échec = 2 gorgées pour ${p2} !`,
        `✊ Chifoumi de l'Apéro : ${p1} et ${p2} s'affrontent au Pierre-Feuille-Ciseaux en un coup gagnant. Le perdant boit 2 gorgées !`,
        `✌️ Chifoumi de la Vengeance : ${p1} et ${p2} jouent au Pierre-Feuille-Ciseaux en 3 manches. Le perdant boit 3 gorgées !`,
        `✋ Chifoumi Aléatoire : ${p1} et ${p2} jouent au Pierre-Feuille-Ciseaux. Celui qui perd boit 2 gorgées, et le gagnant distribue 1 gorgée !`
      ];
      const randomChallenge = DUO_CHALLENGES[Math.floor(Math.random() * DUO_CHALLENGES.length)];
      const log = `🍾 Bouteille : ${p1} doit effectuer une action avec ${p2} !`;
      
      return {
        ...prev,
        selectedBottleTargetId: target.id,
        activeDuoChallenge: randomChallenge,
        activeScreen: 'minigame',
        logMessages: [log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  // Buy or upgrade the bar the player landed on
  const resolveBar = (success: boolean) => {
    setState((prev) => {
      const players = [...prev.players];
      const currentPlayer = { ...players[prev.currentPlayerIndex] };
      const tiles = [...prev.tiles];
      const currentTile = { ...tiles[currentPlayer.position] };
      let log = '';

      if (success) {
        if (!currentTile.ownerId) {
          currentTile.ownerId = currentPlayer.id;
          currentTile.level = 1;
          log = `🏢 ${currentPlayer.name} réussit le défi et achète ${currentTile.name} !`;
        } else if (currentTile.ownerId === currentPlayer.id) {
          currentTile.level = (currentTile.level || 1) + 1;
          log = `⭐ ${currentPlayer.name} améliore ${currentTile.name} au Niveau ${currentTile.level} !`;
        }
        currentPlayer.challengesCompleted += 1;
      } else {
        const penalty = currentTile.price || 3;
        currentPlayer.sipsCount += penalty;
        log = `🍺 ${currentPlayer.name} rate le défi pour ${currentTile.name} et boit ${penalty} gorgées !`;
      }

      tiles[currentTile.id] = currentTile;
      players[prev.currentPlayerIndex] = currentPlayer;

      return {
        ...prev,
        players,
        tiles,
        logMessages: [log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  // Part 1 of resolveBarScenario: Handles success, fail, youngest_success, youngest_fail
  const resolveBarScenario = (
    action: 'success' | 'fail' | 'recule3' | 'youngest_fail' | 'youngest_success' | 'cul_sec_others' | 'cul_sec_all' | 'guess' | 'laugh',
    payload?: any
  ) => {
    setState((prev) => {
      const players = [...prev.players];
      const currentPlayerIndex = prev.currentPlayerIndex;
      const currentPlayer = { ...players[currentPlayerIndex] };
      const tiles = [...prev.tiles];
      const currentTile = { ...tiles[currentPlayer.position] };
      let log = '';
      let nextIndex = currentPlayerIndex;
      let barScenarioStage = prev.barScenarioStage;

      const penalty = currentTile.price || 3;

      if (action === 'success') {
        currentTile.ownerId = currentPlayer.id;
        currentTile.level = 1;
        currentPlayer.challengesCompleted += 1;
        log = `🏢 ${currentPlayer.name} réussit le défi et achète ${currentTile.name} !`;
        nextIndex = (currentPlayerIndex + 1) % players.length;
      } else if (action === 'fail') {
        const actualPenalty = payload?.penalty !== undefined ? payload.penalty : penalty;
        currentPlayer.sipsCount += actualPenalty;
        log = `🍺 ${currentPlayer.name} rate le défi et boit ${actualPenalty} gorgée(s) !`;
        nextIndex = (currentPlayerIndex + 1) % players.length;
      } else if (action === 'youngest_success') {
        currentTile.ownerId = currentPlayer.id;
        currentTile.level = 1;
        currentPlayer.challengesCompleted += 1;
        const youngestId = payload?.youngestId;
        const youngestPlayer = players.find((pl) => pl.id === youngestId);
        if (youngestPlayer) {
          const yIdx = players.findIndex((pl) => pl.id === youngestId);
          players[yIdx] = { ...youngestPlayer, sipsCount: youngestPlayer.sipsCount + 6 };
          log = `🏢 ${currentPlayer.name} achète ${currentTile.name}. Cul Sec 🍺 pour le plus jeune (${youngestPlayer.name}) !`;
        }
        nextIndex = (currentPlayerIndex + 1) % players.length;
      } else if (action === 'youngest_fail') {
        currentTile.ownerId = currentPlayer.id;
        currentTile.level = 1;
        currentPlayer.challengesCompleted += 1;
        const youngestId = payload?.youngestId;
        const youngestPlayer = players.find((pl) => pl.id === youngestId);
        if (youngestPlayer) {
          const yIdx = players.findIndex((pl) => pl.id === youngestId);
          players[yIdx] = { ...youngestPlayer, position: 0 };
          log = `🚨 Le plus jeune (${youngestPlayer.name}) a refusé et retourne au DÉPART ! ${currentPlayer.name} achète ${currentTile.name}.`;
        }
        nextIndex = (currentPlayerIndex + 1) % players.length;
      } else if (action === 'cul_sec_others') {
        currentTile.ownerId = currentPlayer.id;
        currentTile.level = 1;
        currentPlayer.challengesCompleted += 1;
        players.forEach((pl, idx) => {
          if (idx !== currentPlayerIndex) {
            players[idx] = { ...pl, sipsCount: pl.sipsCount + 6 };
          }
        });
        log = `🏢 ${currentPlayer.name} achète ${currentTile.name}. Tous les autres boivent un Cul Sec 🍻 !`;
        nextIndex = (currentPlayerIndex + 1) % players.length;
      } else if (action === 'cul_sec_all') {
        currentTile.ownerId = currentPlayer.id;
        currentTile.level = 1;
        currentPlayer.challengesCompleted += 1;
        players.forEach((pl, idx) => {
          players[idx] = { ...pl, sipsCount: pl.sipsCount + 6 };
        });
        log = `🏢 ${currentPlayer.name} achète ${currentTile.name}. Tout le monde boit un Cul Sec 🍻 !`;
        nextIndex = (currentPlayerIndex + 1) % players.length;
      } else if (action === 'recule3') {
        currentTile.ownerId = currentPlayer.id;
        currentTile.level = 1;
        currentPlayer.challengesCompleted += 1;
        players.forEach((pl, idx) => {
          if (idx !== currentPlayerIndex) {
            const oldPos = pl.position;
            const newPos = (oldPos - 3 + 32) % 32;
            players[idx] = { ...pl, position: newPos };
          }
        });
        log = `🏢 ${currentPlayer.name} achète ${currentTile.name} ! Tous les autres reculent de 3 cases ⬅️ !`;
        nextIndex = (currentPlayerIndex + 1) % players.length;
      } else if (action === 'laugh') {
        currentTile.ownerId = currentPlayer.id;
        currentTile.level = 1;
        currentPlayer.challengesCompleted += 1;
        const laughIds: string[] = payload?.laughIds || [];
        laughIds.forEach((id) => {
          const idx = players.findIndex((pl) => pl.id === id);
          if (idx !== -1) {
            players[idx] = { ...players[idx], sipsCount: players[idx].sipsCount + 6 };
          }
        });
        log = `🏢 ${currentPlayer.name} achète ${currentTile.name}. Les rieurs boivent un Cul Sec 🍻 !`;
        nextIndex = (currentPlayerIndex + 1) % players.length;
      } else if (action === 'guess') {
        const guessId = payload?.guessId;
        const correct = guessId === prev.barScenarioWinnerId;
        barScenarioStage = 'result';
        if (correct) {
          log = `🔍 ${currentPlayer.name} devine juste ! C'est bien ${players.find(pl => pl.id === guessId)?.name} qui avait l'objet.`;
        } else {
          log = `🔍 ${currentPlayer.name} se trompe ! L'objet était chez ${players.find(pl => pl.id === prev.barScenarioWinnerId)?.name}.`;
        }
        return {
          ...prev,
          barScenarioStage,
          logMessages: [log, ...prev.logMessages].slice(0, 15),
        };
      }

      tiles[currentTile.id] = currentTile;
      players[currentPlayerIndex] = currentPlayer;

      let nextLog = `C'est au tour de ${players[nextIndex].name}.`;

      const finalPlayers = players.map((pl, idx) => {
        if (idx === nextIndex && pl.isPrisoner) {
          const updated = { ...pl };
          if (updated.prisonTurns >= 1) {
            updated.isPrisoner = false;
            updated.prisonTurns = 0;
            nextLog = `🔓 ${pl.name} a fini de cuver et sort !`;
          } else {
            updated.prisonTurns += 1;
            nextLog = `🚨 ${pl.name} est en cellule et passe son tour !`;
          }
          return updated;
        }
        return pl;
      });

      return {
        ...prev,
        players: finalPlayers,
        tiles,
        currentPlayerIndex: nextIndex,
        diceValue: null,
        activeScreen: 'board',
        activeBarScenario: undefined,
        barScenarioTargetIds: undefined,
        barScenarioWinnerId: undefined,
        barScenarioStage: undefined,
        logMessages: [nextLog, log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  // Pay jail fine of 2 shots to get out immediately
  const payJailFine = () => {
    setState((prev) => {
      const players = [...prev.players];
      const p = { ...players[prev.currentPlayerIndex] };
      p.isPrisoner = false;
      p.sipsCount += 6; // 2 shots roughly = 6 sips in penalty weight
      players[prev.currentPlayerIndex] = p;
      const log = `🔓 ${p.name} paye sa caution de 2 shots (6 gorgées) et sort de dégrisement !`;
      return {
        ...prev,
        players,
        logMessages: [log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  // Advanced to the next player's turn
  const nextTurn = () => {
    setState((prev) => {
      const nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      const nextPlayer = prev.players[nextIndex];
      let log = `C'est au tour de ${nextPlayer.name}.`;

      const players = prev.players.map((p, idx) => {
        if (idx === nextIndex && p.isPrisoner) {
          const updated = { ...p };
          if (updated.prisonTurns >= 1) {
            updated.isPrisoner = false;
            updated.prisonTurns = 0;
            log = `🔓 ${p.name} a fini de cuver et sort de dégrisement !`;
          } else {
            updated.prisonTurns += 1;
            log = `🚨 ${p.name} est en cellule de dégrisement et passe son tour (ou paye sa caution) !`;
          }
          return updated;
        }
        return p;
      });

      return {
        ...prev,
        players,
        currentPlayerIndex: nextIndex,
        diceValue: null,
        selectedBottleTargetId: null,
        activeDuoChallenge: null,
        activeScreen: 'board',
        logMessages: [log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  // Send a player directly to prison (tile 8 = CELLULE DÉGRISEMENT)
  const sendToJail = (playerId: string) => {
    setState((prev) => {
      const players = prev.players.map((p) => {
        if (p.id === playerId) {
          return { ...p, position: 8, isPrisoner: true, prisonTurns: 0 };
        }
        return p;
      });
      const targetPlayer = prev.players.find((p) => p.id === playerId);
      const log = `🚨 ${targetPlayer?.name} est envoyé direct en cellule de dégrisement !`;
      return {
        ...prev,
        players,
        logMessages: [log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  // Activate player super power
  const usePlayerPower = (powerType: 'pique' | 'coeur' | 'carreau' | 'trefle', targetId?: string, penaltyAmount?: number) => {
    setState((prev) => {
      const players = [...prev.players];
      const activePlayer = { ...players[prev.currentPlayerIndex] };
      activePlayer.powerUsed = true;
      if (activePlayer.isPrisoner) {
        activePlayer.isPrisoner = false;
        activePlayer.prisonTurns = 0;
      }
      players[prev.currentPlayerIndex] = activePlayer;
      
      let log = `⚡ ${activePlayer.name} active son Super Pouvoir : `;
      let nextScreen = prev.activeScreen;
      let nextIndex = prev.currentPlayerIndex;
      let diceValue = prev.diceValue;
      const tiles = [...prev.tiles];

      if (powerType === 'pique') {
        log += `🛡️ Bouclier d'Acier ! Pénalité annulée.`;
        nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
        nextScreen = 'board';
      } else if (powerType === 'coeur' && targetId && penaltyAmount) {
        const target = players.find((p) => p.id === targetId);
        log += `💘 Flèche de Cœur envoyée à ${target ? target.name : 'Adversaire'} (${penaltyAmount} gorgées) !`;
        return {
          ...prev,
          players,
          pendingTransfer: {
            fromId: activePlayer.id,
            toId: targetId,
            penalty: penaltyAmount,
          },
          logMessages: [log, ...prev.logMessages].slice(0, 15),
        };
      } else if (powerType === 'carreau') {
        log += `🎲 Turbo Dé ! Relance autorisée.`;
        diceValue = null;
        nextScreen = 'board';
      } else if (powerType === 'trefle') {
        const currentTile = { ...tiles[activePlayer.position] };
        if (currentTile.type === 'bar') {
          currentTile.ownerId = activePlayer.id;
          currentTile.level = 1;
          tiles[currentTile.id] = currentTile;
          log += `🌿 Pacte de Trèfle ! ${currentTile.name} acquis gratuitement.`;
        }
        nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
        nextScreen = 'board';
        diceValue = null;
      }

      const finalPlayers = players.map((p, idx) => {
        if (idx === nextIndex && p.isPrisoner && nextIndex !== prev.currentPlayerIndex) {
          const updated = { ...p };
          if (updated.prisonTurns >= 1) {
            updated.isPrisoner = false;
            updated.prisonTurns = 0;
          } else {
            updated.prisonTurns += 1;
          }
          return updated;
        }
        return p;
      });

      return {
        ...prev,
        players: finalPlayers,
        tiles,
        currentPlayerIndex: nextIndex,
        diceValue,
        activeScreen: nextScreen,
        selectedBottleTargetId: null,
        activeDuoChallenge: null,
        logMessages: [log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  /**
   * Resolves the Alcootest surprise check by rolling a 6-sided die.
   * Sets the active screen to minigame and stores the outcome message.
   */
  const resolveAlcootest = () => {
    setState((prev) => {
      const p = prev.players[prev.currentPlayerIndex];
      const roll = Math.floor(Math.random() * 6) + 1;
      const isOdd = roll % 2 !== 0;
      let log = '';

      if (isOdd) {
        log = `🧪 Alcootest POSITIF (${roll}) ! ${p.name} souffle positif et doit prendre 3 gorgées !`;
      } else {
        log = `🧪 Alcootest NÉGATIF (${roll}) ! ${p.name} souffle négatif et distribue 2 gorgées !`;
      }

      return {
        ...prev,
        activeScreen: 'minigame',
        activeDuoChallenge: log,
        logMessages: [log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  /**
   * Pays a generic sips penalty and advances to the next player's turn.
   * Handles releasing any jailed next player.
   * 
   * @param amount The number of sips to add to the active player's score.
   */
  const paySipsAndNextTurn = (amount: number) => {
    setState((prev) => {
      const players = [...prev.players];
      const currentPlayerIndex = prev.currentPlayerIndex;
      const p = { ...players[currentPlayerIndex] };
      p.sipsCount += amount;
      players[currentPlayerIndex] = p;

      const log = amount > 0 
        ? `🍺 ${p.name} paye sa pénalité de ${amount} gorgée(s).`
        : `✅ ${p.name} continue sa route sans pénalité.`;

      const nextIndex = (currentPlayerIndex + 1) % prev.players.length;
      let nextLog = `C'est au tour de ${players[nextIndex].name}.`;

      const finalPlayers = players.map((pl, idx) => {
        if (idx === nextIndex && pl.isPrisoner) {
          const updated = { ...pl };
          if (updated.prisonTurns >= 1) {
            updated.isPrisoner = false;
            updated.prisonTurns = 0;
            nextLog = `🔓 ${pl.name} a fini de cuver et sort !`;
          } else {
            updated.prisonTurns += 1;
            nextLog = `🚨 ${pl.name} est en cellule et passe son tour !`;
          }
          return updated;
        }
        return pl;
      });

      return {
        ...prev,
        players: finalPlayers,
        currentPlayerIndex: nextIndex,
        diceValue: null,
        activeScreen: 'board',
        selectedBottleTargetId: null,
        activeDuoChallenge: null,
        logMessages: [nextLog, log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  /**
   * Resolves a duo challenge penalty by adding sips to the loser(s).
   * 
   * @param loserId The ID of the player who lost, or 'both' for both players.
   * @param penalty The number of sips to apply as penalty.
   */
  const resolveDuoPenalty = (loserId: string, penalty: number) => {
    setState((prev) => {
      const players = prev.players.map((p) => {
        if (loserId === 'both') {
          if (p.id === prev.players[prev.currentPlayerIndex].id || p.id === prev.selectedBottleTargetId) {
            return { ...p, sipsCount: p.sipsCount + penalty };
          }
        } else if (p.id === loserId) {
          return { ...p, sipsCount: p.sipsCount + penalty };
        }
        return p;
      });

      const nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      let nextLog = `C'est au tour de ${players[nextIndex].name}.`;

      const finalPlayers = players.map((pl, idx) => {
        if (idx === nextIndex && pl.isPrisoner) {
          const updated = { ...pl };
          if (updated.prisonTurns >= 1) {
            updated.isPrisoner = false;
            updated.prisonTurns = 0;
            nextLog = `🔓 ${pl.name} a fini de cuver et sort !`;
          } else {
            updated.prisonTurns += 1;
            nextLog = `🚨 ${pl.name} est en cellule et passe son tour !`;
          }
          return updated;
        }
        return pl;
      });

      return {
        ...prev,
        players: finalPlayers,
        currentPlayerIndex: nextIndex,
        diceValue: null,
        activeScreen: 'board',
        selectedBottleTargetId: null,
        activeDuoChallenge: null,
        logMessages: [nextLog, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  /**
   * Sets the targeted player ID for specific challenges like Case 6.
   * 
   * @param targetId The ID of the targeted player.
   */
  const selectTargetPlayer = (targetId: string) => {
    setState((prev) => ({
      ...prev,
      selectedBottleTargetId: targetId,
    }));
  };

  /**
   * Resolves the Tournée Générale tile effect by adding 1 sip to all players.
   */
  const resolveTourneeGenerale = () => {
    setState((prev) => {
      const players = prev.players.map((p) => ({
        ...p,
        sipsCount: p.sipsCount + 1,
      }));

      const log = `🥂 Tournée Générale ! Tout le monde prend 1 gorgée !`;

      const nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      let nextLog = `C'est au tour de ${players[nextIndex].name}.`;

      const finalPlayers = players.map((pl, idx) => {
        if (idx === nextIndex && pl.isPrisoner) {
          const updated = { ...pl };
          if (updated.prisonTurns >= 1) {
            updated.isPrisoner = false;
            updated.prisonTurns = 0;
            nextLog = `🔓 ${pl.name} a fini de cuver et sort !`;
          } else {
            updated.prisonTurns += 1;
            nextLog = `🚨 ${pl.name} est en cellule et passe son tour !`;
          }
          return updated;
        }
        return pl;
      });

      return {
        ...prev,
        players: finalPlayers,
        currentPlayerIndex: nextIndex,
        diceValue: null,
        activeScreen: 'board',
        selectedBottleTargetId: null,
        activeDuoChallenge: null,
        logMessages: [nextLog, log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  /**
   * Accepts the pending sip transfer.
   * Target player drinks the designated sips, pending state is cleared, and turn advances to the next player.
   */
  const acceptTransfer = () => {
    setState((prev) => {
      if (!prev.pendingTransfer) return prev;
      const { toId, penalty } = prev.pendingTransfer;
      const players = prev.players.map((p) => {
        if (p.id === toId) {
          return { ...p, sipsCount: p.sipsCount + penalty };
        }
        return p;
      });

      const nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      const nextPlayer = players[nextIndex];
      const log = `💘 ${players.find((p) => p.id === toId)?.name} a ACCEPTÉ le transfert et boit ${penalty} ${penalty > 1 ? 'gorgées' : 'gorgée'}.`;
      let nextLog = `C'est au tour de ${nextPlayer.name}.`;

      const finalPlayers = players.map((p, idx) => {
        if (idx === nextIndex && p.isPrisoner) {
          const updated = { ...p };
          if (updated.prisonTurns >= 1) {
            updated.isPrisoner = false;
            updated.prisonTurns = 0;
            nextLog = `🔓 ${p.name} a fini de cuver et sort de dégrisement !`;
          } else {
            updated.prisonTurns += 1;
            nextLog = `🚨 ${p.name} est en cellule de dégrisement et passe son tour (ou paye sa caution) !`;
          }
          return updated;
        }
        return p;
      });

      return {
        ...prev,
        players: finalPlayers,
        currentPlayerIndex: nextIndex,
        diceValue: null,
        selectedBottleTargetId: null,
        activeDuoChallenge: null,
        activeScreen: 'board',
        pendingTransfer: null,
        logMessages: [nextLog, log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  /**
   * Refuses the pending sip transfer.
   * Target player refuses to drink but is sent back to the starting tile (position 0).
   * Pending state is cleared, and turn advances to the next player.
   */
  const refuseTransfer = () => {
    setState((prev) => {
      if (!prev.pendingTransfer) return prev;
      const { toId } = prev.pendingTransfer;
      const players = prev.players.map((p) => {
        if (p.id === toId) {
          return { ...p, position: 0 };
        }
        return p;
      });

      const nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      const nextPlayer = players[nextIndex];
      const log = `❌ ${players.find((p) => p.id === toId)?.name} a REFUSÉ le transfert et retourne à la case DÉPART 🏁 !`;
      let nextLog = `C'est au tour de ${nextPlayer.name}.`;

      const finalPlayers = players.map((p, idx) => {
        if (idx === nextIndex && p.isPrisoner) {
          const updated = { ...p };
          if (updated.prisonTurns >= 1) {
            updated.isPrisoner = false;
            updated.prisonTurns = 0;
            nextLog = `🔓 ${p.name} a fini de cuver et sort de dégrisement !`;
          } else {
            updated.prisonTurns += 1;
            nextLog = `🚨 ${p.name} est en cellule de dégrisement et passe son tour (ou paye sa caution) !`;
          }
          return updated;
        }
        return p;
      });

      return {
        ...prev,
        players: finalPlayers,
        currentPlayerIndex: nextIndex,
        diceValue: null,
        selectedBottleTargetId: null,
        activeDuoChallenge: null,
        activeScreen: 'board',
        pendingTransfer: null,
        logMessages: [nextLog, log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  // Resets the game state and clears localStorage
  const resetGame = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('alcooly_game_state');
    }
    setState(INITIAL_STATE);
  };

  return {
    state,
    startGame,
    confirmReveal,
    rollDice,
    resolveCard,
    resolveBottle,
    resolveBar,
    resolveBarScenario,
    payJailFine,
    nextTurn,
    sendToJail,
    usePlayerPower,
    resolveAlcootest,
    paySipsAndNextTurn,
    resolveDuoPenalty,
    resolveTourneeGenerale,
    selectTargetPlayer,
    acceptTransfer,
    refuseTransfer,
    resetGame,
  };
}



