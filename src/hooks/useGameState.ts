import { useState, useEffect } from 'react';
import type { GameState, Player, SuitType, Card } from '../types';
import { INITIAL_TILES, CARDS_DATABASE, DUO_CHALLENGES, getDuoChallengeDetails } from '../gameData';

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
  let available = Array.from({ length: 22 }, (_, i) => i + 1).filter((s) => !usedScenarios.includes(s));
  let newUsedScenarios = [...usedScenarios];
  if (available.length === 0) {
    available = Array.from({ length: 22 }, (_, i) => i + 1);
    newUsedScenarios = [];
  }
  const randomIndex = Math.floor(Math.random() * available.length);
  const selectedScenario = available[randomIndex];
  newUsedScenarios.push(selectedScenario);
  return { scenario: selectedScenario, newUsedScenarios: newUsedScenarios };
}

/**
 * Selects a random duo challenge index (0 to totalCount-1) without repeating until all have been played.
 *
 * @param usedIndices - Array of duo challenge indices already played
 * @param totalCount - Total number of duo challenges
 * @returns An object with the selected index and the updated array of used indices
 */
export function drawDuoChallengeWithoutRepetition(usedIndices: number[], totalCount: number): { index: number; newUsedIndices: number[] } {
  const allIndices = Array.from({ length: totalCount }, (_, i) => i);
  let available = allIndices.filter((idx) => !usedIndices.includes(idx));
  let newUsedIndices = [...usedIndices];
  if (available.length === 0) {
    available = allIndices;
    newUsedIndices = [];
  }
  const randomIndex = Math.floor(Math.random() * available.length);
  const selectedIndex = available[randomIndex];
  newUsedIndices.push(selectedIndex);
  return { index: selectedIndex, newUsedIndices: newUsedIndices };
}

/**
 * Helper to add sips to a player and also propagate to a linked partner if active.
 */
export function addSips(
  players: Player[],
  playerId: string,
  amount: number,
  linkedPlayers?: [string, string] | null,
  linkedTurns?: number | null
): Player[] {
  if (amount <= 0) return players;
  let nextPlayers = players.map((p) => {
    if (p.id === playerId) {
      return { ...p, sipsCount: p.sipsCount + amount };
    }
    return p;
  });

  if (linkedPlayers && linkedTurns && linkedTurns > 0 && linkedPlayers.includes(playerId)) {
    const partnerId = linkedPlayers.find((id) => id !== playerId);
    if (partnerId) {
      nextPlayers = nextPlayers.map((p) => {
        if (p.id === partnerId) {
          return { ...p, sipsCount: p.sipsCount + amount };
        }
        return p;
      });
    }
  }
  return nextPlayers;
}

/**
 * Returns updates to GameState when advancing the turn, decrementing linked players and rules.
 */
export function getNextTurnState(prev: GameState, nextIndex: number): Partial<GameState> {
  const updates: Partial<GameState> = {
    currentPlayerIndex: nextIndex,
    diceValue: null,
    selectedBottleTargetId: null,
    activeDuoChallenge: null,
    activeDuoChallengeType: null,
    activeDuoChallengePenalty: null,
    jailRollResult: null,
  };

  // Decrement round-based active rule and linked players when wrapping back to index 0
  if (nextIndex === 0) {
    if (prev.linkedTurns && prev.linkedTurns > 0) {
      const nextLinkedTurns = prev.linkedTurns - 1;
      if (nextLinkedTurns <= 0) {
        updates.linkedPlayers = null;
        updates.linkedTurns = null;
      } else {
        updates.linkedTurns = nextLinkedTurns;
      }
    }
    if (prev.activeRule && prev.activeRule.turns > 0) {
      const nextRuleTurns = prev.activeRule.turns - 1;
      if (nextRuleTurns <= 0) {
        updates.activeRule = null;
      } else {
        updates.activeRule = { ...prev.activeRule, turns: nextRuleTurns };
      }
    }
  }
  return updates;
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
  activeDuoChallengeType: null,
  activeDuoChallengePenalty: null,
  diceValue: null,
  logMessages: ['Bienvenue sur Alcooly ! configurez la partie.'],
  usedBarScenarios: [],
  usedCardIds: [],
  usedDuoChallenges: [],
  pendingTransfer: null,
  jailRollResult: null,
  activeRule: null,
  linkedPlayers: null,
  linkedTurns: null,
};

/**
 * Loads the initial state from localStorage if it exists, otherwise returns INITIAL_STATE.
 */
const getInitialState = (): GameState => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('alcooly_game_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        let activeCard = parsed.activeCard;
        if (activeCard) {
          const dbCard = CARDS_DATABASE.find((c) => c.id === activeCard.id);
          if (dbCard) {
            activeCard = dbCard;
          }
        }
        let activeDuoChallengeType = parsed.activeDuoChallengeType;
        let activeDuoChallengePenalty = parsed.activeDuoChallengePenalty;
        if (parsed.activeDuoChallenge && (!activeDuoChallengeType || activeDuoChallengePenalty === undefined || activeDuoChallengePenalty === null)) {
          const details = getDuoChallengeDetails(parsed.activeDuoChallenge);
          if (!activeDuoChallengeType) activeDuoChallengeType = details.type;
          if (activeDuoChallengePenalty === undefined || activeDuoChallengePenalty === null) activeDuoChallengePenalty = details.penalty;
        }
        return {
          ...INITIAL_STATE,
          ...parsed,
          activeCard,
          usedBarScenarios: parsed.usedBarScenarios || [],
          usedCardIds: parsed.usedCardIds || [],
          usedDuoChallenges: parsed.usedDuoChallenges || [],
          activeDuoChallengeType: activeDuoChallengeType !== undefined ? activeDuoChallengeType : null,
          activeDuoChallengePenalty: activeDuoChallengePenalty !== undefined ? activeDuoChallengePenalty : null,
          jailRollResult: parsed.jailRollResult !== undefined ? parsed.jailRollResult : null,
          activeRule: parsed.activeRule !== undefined ? parsed.activeRule : null,
          linkedPlayers: parsed.linkedPlayers !== undefined ? parsed.linkedPlayers : null,
          linkedTurns: parsed.linkedTurns !== undefined ? parsed.linkedTurns : null,
        };
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
      isLockedAtStart: true,
    }));
    setState((prev) => ({
      ...prev,
      players: playersWithCards,
      activeScreen: 'reveal',
      usedBarScenarios: [],
      usedCardIds: [],
      usedDuoChallenges: [],
      activeDuoChallenge: null,
      activeDuoChallengeType: null,
      activeDuoChallengePenalty: null,
      jailRollResult: null,
      activeRule: null,
      linkedPlayers: null,
      linkedTurns: null,
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
    const activePlayer = state.players[state.currentPlayerIndex];
    if (activePlayer.position === 0 && activePlayer.isLockedAtStart) {
      if (diceValue === 6) {
        setState((prev) => {
          const players = [...prev.players];
          const p = { ...players[prev.currentPlayerIndex] };
          p.isLockedAtStart = false;
          players[prev.currentPlayerIndex] = p;
          const log = `🔓 ${p.name} fait un 6 et est débloqué(e) de la case DÉPART ! Relance le dé pour avancer.`;
          return {
            ...prev,
            players,
            diceValue: null,
            isMoving: false,
            logMessages: [log, ...prev.logMessages].slice(0, 15),
          };
        });
      } else {
        setState((prev) => {
          const log = `🚨 ${activePlayer.name} fait un ${diceValue} et reste bloqué(e) à la case DÉPART.`;
          return {
            ...prev,
            diceValue,
            isMoving: false,
            logMessages: [log, ...prev.logMessages].slice(0, 15),
          };
        });
      }
      return;
    }

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

        if (stepsRemaining === 0 && newPos === 0) {
          p.isLockedAtStart = true;
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
            let barScenarioWinnerId: string | undefined = undefined;
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
              
              // Réinitialisation des propriétés de scénario pour éviter toute pollution
              barScenarioTargetIds = [];
              barScenarioWinnerId = undefined;
              barScenarioStage = undefined;

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
  const resolveCard = (success: boolean, penalty: number, payload?: any) => {
    setState((prev) => {
      let players = [...prev.players];
      const currentPlayerIndex = prev.currentPlayerIndex;
      const p = { ...players[currentPlayerIndex] };
      const card = prev.activeCard;
      let log = '';

      let activeRule = prev.activeRule;
      let linkedPlayers = prev.linkedPlayers;
      let linkedTurns = prev.linkedTurns;

      let nextScreen: GameState['activeScreen'] = 'board';
      let activeCard: any = null;
      let usedCardIds: string[] = prev.usedCardIds || [];

      // Helper to handle retrograde movement and update screens
      const movePlayerRetrograde = (playerIdx: number, steps: number) => {
        const target = { ...players[playerIdx] };
        if (target.isPrisoner) {
          log += ` (Mais ${target.name} est en cellule de dégrisement et ne bouge pas)`;
          return;
        }
        const oldPos = target.position;
        const newPos = Math.max(0, oldPos - steps);
        target.position = newPos;
        if (newPos === 0) {
          target.isLockedAtStart = true;
        }
        players[playerIdx] = target;
        log += ` ⬅️ ${target.name} recule de ${steps} case(s) sur : ${prev.tiles[newPos].name} !`;

        const landedTile = prev.tiles[newPos];
        if (landedTile.type === 'card') {
          nextScreen = 'card';
          const drawRes = drawCardWithoutRepetition(usedCardIds);
          activeCard = drawRes.card;
          usedCardIds = drawRes.newUsedIds;
        } else if (landedTile.type === 'bottle') {
          nextScreen = 'bottle';
        }
      };

      // Helper to add sips with Âmes Sœurs logic
      const applySips = (playersList: Player[], targetId: string, amount: number): Player[] => {
        return addSips(playersList, targetId, amount, linkedPlayers, linkedTurns);
      };

      if (payload) {
        log = `🎬 Effet de carte : ${card?.title}. `;
        if (payload.type === 'resolve_custom') {
          log = payload.log || '';
          if (payload.sips) {
            Object.entries(payload.sips).forEach(([pid, amount]) => {
              players = applySips(players, pid, amount as number);
            });
          }
          if (payload.movements) {
            Object.entries(payload.movements).forEach(([pid, move]: [string, any]) => {
              const idx = players.findIndex((pl) => pl.id === pid);
              if (idx !== -1) {
                if (move.position !== undefined) {
                  const target = { ...players[idx] };
                  target.position = move.position;
                  if (move.position === 0) target.isLockedAtStart = true;
                  players[idx] = target;
                  if (idx === currentPlayerIndex) {
                    p.position = move.position;
                    p.isLockedAtStart = target.isLockedAtStart;
                  }
                } else if (move.recul !== undefined) {
                  movePlayerRetrograde(idx, move.recul);
                }
              }
            });
          }
          if (payload.linkedIds) {
            linkedPlayers = payload.linkedIds;
            linkedTurns = 2;
          }
          p.challengesCompleted += 1;
          // Synchroniser la position et isLockedAtStart au cas où le joueur actif a reculé
          p.position = players[currentPlayerIndex].position;
          p.isLockedAtStart = players[currentPlayerIndex].isLockedAtStart;
          players[currentPlayerIndex] = p;
        } else if (
          payload.type === 'group_pique' ||
          payload.type === 'group_black' ||
          payload.type === 'group_carreau' ||
          payload.type === 'group_chifoumi'
        ) {
          const targetIds: string[] = payload.targetIds || [];
          const amount = payload.penalty;
          if (targetIds.length > 0) {
            targetIds.forEach((id) => {
              players = applySips(players, id, amount);
            });
            const names = targetIds.map((id) => players.find((pl) => pl.id === id)?.name).join(', ');
            log += `🍻 ${names} boivent ${amount} gorgée(s) !`;
          } else {
            players = applySips(players, p.id, payload.fallbackPenalty || 1);
            log += `🍺 Personne n'est affecté, ${p.name} boit ${payload.fallbackPenalty || 1} gorgée(s) !`;
          }
        } else if (payload.type === 'distribute') {
          const distributions: { playerId: string; amount: number }[] = payload.distributions || [];
          distributions.forEach((d) => {
            players = applySips(players, d.playerId, d.amount);
          });
          const summary = distributions.map((d) => `${players.find((pl) => pl.id === d.playerId)?.name} (+${d.amount}G)`).join(', ');
          log += `🎁 Distribution : ${summary} !`;
          const perfIdx = players.findIndex((pl) => pl.id === (payload.performerId || p.id));
          if (perfIdx !== -1) {
            players[perfIdx] = { ...players[perfIdx], challengesCompleted: players[perfIdx].challengesCompleted + 1 };
          }
        } else if (payload.type === 'solo_challenge') {
          const performerId = payload.performerId;
          const perfIdx = players.findIndex((pl) => pl.id === performerId);
          if (perfIdx !== -1) {
            if (payload.success) {
              players[perfIdx] = { ...players[perfIdx], challengesCompleted: players[perfIdx].challengesCompleted + 1 };
              log += `✅ ${players[perfIdx].name} a réussi son défi !`;
            } else {
              players = applySips(players, performerId, payload.penalty);
              log += `🍺 ${players[perfIdx].name} a échoué et boit ${payload.penalty} gorgée(s) !`;
            }
          }
        } else if (payload.type === 'link_coeur') {
          linkedPlayers = payload.linkedIds;
          linkedTurns = 2;
          const name1 = players.find((pl) => pl.id === linkedPlayers?.[0])?.name || '';
          const name2 = players.find((pl) => pl.id === linkedPlayers?.[1])?.name || '';
          log += `💘 ${name1} et ${name2} sont désormais Âmes Sœurs pour 2 tours !`;
          p.challengesCompleted += 1;
          players[currentPlayerIndex] = p;
        } else if (payload.type === 'absurd_rule') {
          activeRule = {
            text: payload.ruleText,
            turns: 2,
            ownerName: payload.ownerName,
          };
          log += `📜 Nouvelle règle absurde : "${payload.ruleText}" !`;
          p.challengesCompleted += 1;
          players[currentPlayerIndex] = p;
        } else if (payload.type === 'as_trefle_duel') {
          const { highestId, lowestId, highestAction } = payload;
          const highIdx = players.findIndex((pl) => pl.id === highestId);
          const lowIdx = players.findIndex((pl) => pl.id === lowestId);

          if (highIdx !== -1) {
            if (highestAction === 'sip') {
              players = applySips(players, highestId, 6);
              log += `🍺 ${players[highIdx].name} (le plus fort) boit cul sec ! `;
            } else {
              players[highIdx] = { ...players[highIdx], position: 0, isLockedAtStart: true };
              log += `🏁 ${players[highIdx].name} (le plus fort) retourne au DÉPART ! `;
            }
          }
          if (lowIdx !== -1) {
            players[lowIdx] = { ...players[lowIdx], position: 0, isLockedAtStart: true };
            log += `🏁 ${players[lowIdx].name} (le plus faible) retourne au DÉPART !`;
          }
        } else if (payload.type === 'silence_loser') {
          const loserId = payload.loserId;
          const loserIdx = players.findIndex((pl) => pl.id === loserId);
          if (loserIdx !== -1) {
            players = applySips(players, loserId, 3);
            log += `🤫 ${players[loserIdx].name} a rompu le silence et boit 3 gorgées !`;
          } else {
            log += `🤫 Le silence s'est terminé sans pénalité.`;
          }
        } else if (payload.type === 's3_choices') {
          const choices: { [playerId: string]: 'cul_sec' | 'depart' } = payload.choices || {};
          Object.entries(choices).forEach(([pid, choice]) => {
            const idx = players.findIndex((pl) => pl.id === pid);
            if (idx !== -1) {
              if (choice === 'cul_sec') {
                players = applySips(players, pid, 6);
                log += `🍺 ${players[idx].name} boit cul sec ! `;
              } else if (choice === 'depart') {
                players[idx] = { ...players[idx], position: 0, isLockedAtStart: true };
                log += `🏁 ${players[idx].name} retourne au DÉPART ! `;
              }
            }
          });
        } else if (payload.type === 's4_movement') {
          const targetIds: string[] = payload.targetIds || [];
          targetIds.forEach(id => {
            const idx = players.findIndex((pl) => pl.id === id);
            if (idx !== -1) movePlayerRetrograde(idx, 2);
          });
        } else if (payload.type === 's4_movement_all') {
          players.forEach((pl, idx) => {
            if (!pl.isPrisoner) {
              movePlayerRetrograde(idx, 2);
            }
          });
          log += `⬅️ Tout le monde recule (sauf en cellule) !`;
        } else if (payload.type === 's5_action') {
          const { playerId, action } = payload;
          const idx = players.findIndex((pl) => pl.id === playerId);
          if (idx !== -1) {
            if (action === 'sip') {
              players = applySips(players, playerId, 3);
              log += `🍺 ${players[idx].name} perd et boit 3 gorgées !`;
            } else if (action === 'recul') {
              movePlayerRetrograde(idx, 3);
            }
          }
        } else if (payload.type === 'recul_active') {
          const amount = payload.amount || 0;
          movePlayerRetrograde(currentPlayerIndex, amount);
        } else if (payload.type === 'h5_action') {
          const { status, action, targetId } = payload;
          const activeIdx = currentPlayerIndex;
          const leftPlayer = players[(activeIdx - 1 + players.length) % players.length];
          if (status === 'gagne') {
            if (action === 'sip') {
              players = applySips(players, leftPlayer.id, 2);
              log += `✅ ${p.name} gagne le duel ! ${leftPlayer.name} boit 2 gorgées !`;
            } else if (action === 'depart') {
              const lIdx = players.findIndex(pl => pl.id === leftPlayer.id);
              if (lIdx !== -1) {
                players[lIdx] = { ...players[lIdx], position: 0, isLockedAtStart: true };
              }
              log += `✅ ${p.name} gagne le duel ! ${leftPlayer.name} retourne au DÉPART !`;
            }
          } else if (status === 'perdu') {
            if (action === 'sip') {
              players = applySips(players, p.id, 1);
              players = applySips(players, leftPlayer.id, 1);
              log += `❌ ${p.name} perd le duel ! Les deux boivent 1 gorgée !`;
            } else if (action === 'depart' && targetId) {
              const tIdx = players.findIndex(pl => pl.id === targetId);
              if (tIdx !== -1) {
                players[tIdx] = { ...players[tIdx], position: 0, isLockedAtStart: true };
              }
              const targetName = players.find(pl => pl.id === targetId)?.name || '';
              log += `❌ ${p.name} perd le duel ! ${targetName} retourne au DÉPART !`;
            }
          }
        } else if (payload.type === 'recul_player') {
          const { playerId, amount } = payload;
          const idx = players.findIndex(pl => pl.id === playerId);
          if (idx !== -1) movePlayerRetrograde(idx, amount);
        } else if (payload.type === 'd5_recul') {
          const { targetId } = payload;
          const idx = players.findIndex((pl) => pl.id === targetId);
          if (idx !== -1) movePlayerRetrograde(idx, 3);
        } else if (payload.type === 'c1_sip') {
          const { targetId } = payload;
          players = applySips(players, targetId, 5);
          const name = players.find(pl => pl.id === targetId)?.name || '';
          log += `🎁 ${p.name} distribue 5 gorgées à ${name} !`;
        } else if (payload.type === 'c1_depart') {
          const { targetId } = payload;
          const idx = players.findIndex(pl => pl.id === targetId);
          if (idx !== -1) {
            players[idx] = { ...players[idx], position: 0, isLockedAtStart: true };
            log += `🏁 ${players[idx].name} refuse et retourne au DÉPART !`;
          }
        } else if (payload.type === 'c3_depart') {
          const { targetId } = payload;
          const idx = players.findIndex(pl => pl.id === targetId);
          if (idx !== -1) {
            players[idx] = { ...players[idx], position: 0, isLockedAtStart: true };
            log += `🏁 ${players[idx].name} retourne au DÉPART !`;
          }
        } else if (payload.type === 'c4_recul') {
          const { targetId } = payload;
          const idx = players.findIndex(pl => pl.id === targetId);
          if (idx !== -1) movePlayerRetrograde(idx, 4);
        } else if (payload.type === 'c5_choices') {
          const choices: { [playerId: string]: 'sip' | 'recul' } = payload.choices || {};
          Object.entries(choices).forEach(([pid, choice]) => {
            const idx = players.findIndex((pl) => pl.id === pid);
            if (idx !== -1) {
              if (choice === 'sip') {
                players = applySips(players, pid, 2);
                log += `🍺 ${players[idx].name} boit 2 gorgées ! `;
              } else if (choice === 'recul') {
                movePlayerRetrograde(idx, 5);
              }
            }
          });
        } else if (payload.type === 'depart_active') {
          p.position = 0;
          p.isLockedAtStart = true;
          players[currentPlayerIndex] = p;
          log += `🏁 ${p.name} retourne au DÉPART !`;
        } else if (payload.type === 'sip_active') {
          const amount = payload.amount || 6;
          players = applySips(players, p.id, amount);
          log += `🍺 ${p.name} boit cul sec (${amount} gorgées) !`;
        } else if (payload.type === 'd4_recul') {
          const targetIndex = players.findIndex((pl) => pl.card?.suit === 'carreau');
          const finalIndex = targetIndex !== -1 ? targetIndex : currentPlayerIndex;
          movePlayerRetrograde(finalIndex, 3);
        }
      } else if (card && card.category === 'movement') {
        log = `🎬 Effet de carte : ${card.title}. `;
      } else if (success) {
        p.challengesCompleted += 1;
        log = `✅ ${p.name} a réussi son défi !`;
        players[currentPlayerIndex] = p;
      } else {
        players = applySips(players, p.id, penalty);
        log = `🍺 ${p.name} n'a pas relevé le défi et boit ${penalty} gorgée(s) !`;
      }

      if (card && !payload) {
        if (card.id === 'd3') {
          p.position = 0;
          p.isLockedAtStart = true;
          log += `🔄 ${p.name} est renvoyé à la case DÉPART !`;
          players[currentPlayerIndex] = p;
        } else if (card.id === 'd4') {
          const targetIndex = players.findIndex((pl) => pl.card?.suit === 'carreau');
          const finalIndex = targetIndex !== -1 ? targetIndex : currentPlayerIndex;
          const target = { ...players[finalIndex] };
          if (target.isPrisoner) {
            log += ` (Mais ${target.name} est en cellule de dégrisement et ne bouge pas)`;
          } else {
            const oldPos = target.position;
            const newPos = Math.max(0, oldPos - 3);
            target.position = newPos;
            if (newPos === 0) {
              target.isLockedAtStart = true;
            }
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
          }
        } else if (card.id === 's4') {
          const targetIndex = players.findIndex((pl) => pl.card?.suit === 'pique');
          const finalIndex = targetIndex !== -1 ? targetIndex : currentPlayerIndex;
          const target = { ...players[finalIndex] };
          if (target.isPrisoner) {
            log += ` (Mais ${target.name} est en cellule de dégrisement et ne bouge pas)`;
          } else {
            const oldPos = target.position;
            const newPos = Math.max(0, oldPos - 2);
            target.position = newPos;
            if (newPos === 0) {
              target.isLockedAtStart = true;
            }
            players[finalIndex] = target;
            log += ` ⬅️ ${target.name} recule de 2 cases sur : ${prev.tiles[newPos].name} !`;

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
      }

      return {
        ...prev,
        players,
        activeCard,
        activeScreen: nextScreen,
        usedCardIds,
        activeRule,
        linkedPlayers,
        linkedTurns,
        logMessages: [log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  // Resolves the bottle spin target selection
  const resolveBottle = (target: Player) => {
    setState((prev) => {
      const p1 = prev.players[prev.currentPlayerIndex].name;
      const p2 = target.name;
      let usedDuoChallenges = prev.usedDuoChallenges || [];
      const drawRes = drawDuoChallengeWithoutRepetition(usedDuoChallenges, DUO_CHALLENGES.length);
      const challengeObj = DUO_CHALLENGES[drawRes.index];
      const challengeText = challengeObj.template.replace(/{p1}/g, p1).replace(/{p2}/g, p2);
      usedDuoChallenges = drawRes.newUsedIndices;
      const log = `🍾 Bouteille : ${p1} doit effectuer une action avec ${p2} !`;
      
      return {
        ...prev,
        selectedBottleTargetId: target.id,
        activeDuoChallenge: challengeText,
        activeDuoChallengeType: challengeObj.type,
        activeDuoChallengePenalty: challengeObj.penalty,
        activeScreen: 'minigame',
        usedDuoChallenges,
        logMessages: [log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  // Buy or upgrade the bar the player landed on
  const resolveBar = (success: boolean) => {
    setState((prev) => {
      let players = [...prev.players];
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
        players[prev.currentPlayerIndex] = currentPlayer;
      } else {
        const penalty = currentTile.price || 3;
        players = addSips(players, currentPlayer.id, penalty, prev.linkedPlayers, prev.linkedTurns);
        log = `🍺 ${currentPlayer.name} rate le défi pour ${currentTile.name} et boit ${penalty} gorgées !`;
      }

      tiles[currentTile.id] = currentTile;

      return {
        ...prev,
        players,
        tiles,
        logMessages: [log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  /**
   * Résout une action ou étape d'un scénario de bar interactif aléatoire.
   *
   * @param action Le type de résolution (achat réussi, échec, reculs, devinette, etc.)
   * @param payload Données additionnelles requises pour la résolution (cibles, types de sentence, etc.)
   */
  const resolveBarScenario = (
    action: 'success' | 'fail' | 'recule3' | 'youngest_fail' | 'youngest_success' | 'cul_sec_others' | 'cul_sec_all' | 'guess' | 'laugh' | 'recule_active' | 'laugh_recule' | 'caught_recule' | 'set_targets' | 'laugh_penalty' | 'resolve_custom',
    payload?: any
  ) => {
    setState((prev) => {
      if (action === 'set_targets') {
        return {
          ...prev,
          barScenarioTargetIds: payload?.targets || [],
          barScenarioStage: payload?.stage !== undefined ? payload.stage : prev.barScenarioStage,
        };
      }

      const players = [...prev.players];
      const currentPlayerIndex = prev.currentPlayerIndex;
      const currentPlayer = { ...players[currentPlayerIndex] };
      const tiles = [...prev.tiles];
      const currentTile = { ...tiles[currentPlayer.position] };
      let log = '';
      let nextIndex = currentPlayerIndex;
      let barScenarioStage = prev.barScenarioStage;

      const penalty = currentTile.price || 3;
      const sipsToAdd: { [playerId: string]: number } = {};

      if (action === 'resolve_custom') {
        const buy = payload?.buy;
        if (buy) {
          currentTile.ownerId = currentPlayer.id;
          currentTile.level = 1;
          currentPlayer.challengesCompleted += 1;
        }
        log = payload?.log || '';
        if (payload?.sips) {
          Object.entries(payload.sips).forEach(([pid, amount]) => {
            if ((amount as number) > 0) sipsToAdd[pid] = amount as number;
          });
        }
        if (payload?.movements) {
          Object.entries(payload.movements).forEach(([pid, move]: [string, any]) => {
            const idx = players.findIndex((pl) => pl.id === pid);
            if (idx !== -1) {
              const pl = { ...players[idx] };
              if (!pl.isPrisoner || move.isPrisoner) {
                if (move.position !== undefined) {
                  pl.position = move.position;
                  if (move.position === 0) pl.isLockedAtStart = true;
                } else if (move.recul !== undefined) {
                  const newPos = Math.max(0, pl.position - move.recul);
                  pl.position = newPos;
                  if (newPos === 0) pl.isLockedAtStart = true;
                }
                if (move.isPrisoner !== undefined) {
                  pl.isPrisoner = move.isPrisoner;
                  pl.prisonTurns = 0;
                }
                players[idx] = pl;
                if (idx === currentPlayerIndex) {
                  currentPlayer.position = pl.position;
                  currentPlayer.isLockedAtStart = pl.isLockedAtStart;
                  currentPlayer.isPrisoner = pl.isPrisoner;
                  currentPlayer.prisonTurns = pl.prisonTurns;
                }
              }
            }
          });
        }
        nextIndex = (currentPlayerIndex + 1) % players.length;
      } else if (action === 'success') {
        currentTile.ownerId = currentPlayer.id;
        currentTile.level = 1;
        currentPlayer.challengesCompleted += 1;
        log = `🏢 ${currentPlayer.name} réussit le défi et achète ${currentTile.name} !`;
        // Pour le scénario 4, le joueur désigné boit ses 4 gorgées
        if (prev.activeBarScenario === 4 && prev.barScenarioTargetIds?.[0]) {
          const targetId = prev.barScenarioTargetIds[0];
          sipsToAdd[targetId] = 4;
          const targetName = players.find(pl => pl.id === targetId)?.name || '';
          log += ` 🍺 ${targetName} boit 4 gorgées !`;
        }
        nextIndex = (currentPlayerIndex + 1) % players.length;
      } else if (action === 'fail') {
        const actualPenalty = payload?.penalty !== undefined ? payload.penalty : penalty;
        sipsToAdd[currentPlayer.id] = actualPenalty;
        log = `🍺 ${currentPlayer.name} rate le défi et boit ${actualPenalty} gorgée(s) !`;
        nextIndex = (currentPlayerIndex + 1) % players.length;
      } else if (action === 'youngest_success') {
        currentTile.ownerId = currentPlayer.id;
        currentTile.level = 1;
        currentPlayer.challengesCompleted += 1;
        const youngestId = payload?.youngestId;
        const youngestPlayer = players.find((pl) => pl.id === youngestId);
        if (youngestPlayer) {
          sipsToAdd[youngestId] = 6;
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
          players[yIdx] = { ...youngestPlayer, position: 0, isLockedAtStart: true };
          if (yIdx === currentPlayerIndex) {
            currentPlayer.position = 0;
            currentPlayer.isLockedAtStart = true;
          }
          log = `🚨 Le plus jeune (${youngestPlayer.name}) a refusé et retourne au DÉPART ! ${currentPlayer.name} achète ${currentTile.name}.`;
        }
        nextIndex = (currentPlayerIndex + 1) % players.length;
      } else if (action === 'cul_sec_others') {
        currentTile.ownerId = currentPlayer.id;
        currentTile.level = 1;
        currentPlayer.challengesCompleted += 1;
        players.forEach((pl, idx) => {
          if (idx !== currentPlayerIndex) {
            sipsToAdd[pl.id] = 6;
          }
        });
        log = `🏢 ${currentPlayer.name} achète ${currentTile.name}. Tous les autres boivent un Cul Sec 🍻 !`;
        nextIndex = (currentPlayerIndex + 1) % players.length;
      } else if (action === 'cul_sec_all') {
        currentTile.ownerId = currentPlayer.id;
        currentTile.level = 1;
        currentPlayer.challengesCompleted += 1;
        players.forEach((pl) => {
          sipsToAdd[pl.id] = 6;
        });
        log = `🏢 ${currentPlayer.name} achète ${currentTile.name}. Tout le monde boit un Cul Sec 🍻 !`;
        nextIndex = (currentPlayerIndex + 1) % players.length;
      } else if (action === 'recule3') {
        currentTile.ownerId = currentPlayer.id;
        currentTile.level = 1;
        currentPlayer.challengesCompleted += 1;
        players.forEach((pl, idx) => {
          if (idx !== currentPlayerIndex) {
            if (pl.isPrisoner) {
              return;
            }
            const oldPos = pl.position;
            const newPos = Math.max(0, oldPos - 3);
            players[idx] = { 
              ...pl, 
              position: newPos,
              isLockedAtStart: newPos === 0 ? true : pl.isLockedAtStart
            };
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
          sipsToAdd[id] = 6;
        });
        log = `🏢 ${currentPlayer.name} achète ${currentTile.name}. Les rieurs boivent un Cul Sec 🍻 !`;
        nextIndex = (currentPlayerIndex + 1) % players.length;
      } else if (action === 'recule_active') {
        const recul = payload?.recul !== undefined ? payload.recul : 2;
        const oldPos = currentPlayer.position;
        const newPos = Math.max(0, oldPos - recul);
        currentPlayer.position = newPos;
        if (newPos === 0) {
          currentPlayer.isLockedAtStart = true;
        }
        log = `⬅️ ${currentPlayer.name} rate le défi et recule de ${recul} cases sur : ${prev.tiles[newPos].name} !`;
        nextIndex = (currentPlayerIndex + 1) % players.length;
      } else if (action === 'laugh_recule') {
        currentTile.ownerId = currentPlayer.id;
        currentTile.level = 1;
        currentPlayer.challengesCompleted += 1;
        const laughIds: string[] = payload?.laughIds || [];
        laughIds.forEach((id) => {
          const idx = players.findIndex((pl) => pl.id === id);
          if (idx !== -1 && !players[idx].isPrisoner) {
            const oldPos = players[idx].position;
            const newPos = Math.max(0, oldPos - 3);
            players[idx] = { 
              ...players[idx], 
              position: newPos,
              isLockedAtStart: newPos === 0 ? true : players[idx].isLockedAtStart
            };
          }
        });
        log = `🏢 ${currentPlayer.name} achète ${currentTile.name} ! Les rieurs reculent de 3 cases ⬅️ !`;
        nextIndex = (currentPlayerIndex + 1) % players.length;
      } else if (action === 'caught_recule') {
        currentTile.ownerId = currentPlayer.id;
        currentTile.level = 1;
        currentPlayer.challengesCompleted += 1;
        const caughtIds: string[] = payload?.caughtIds || [];
        caughtIds.forEach((id) => {
          const idx = players.findIndex((pl) => pl.id === id);
          if (idx !== -1 && !players[idx].isPrisoner) {
            const oldPos = players[idx].position;
            const newPos = Math.max(0, oldPos - 3);
            players[idx] = { 
              ...players[idx], 
              position: newPos,
              isLockedAtStart: newPos === 0 ? true : players[idx].isLockedAtStart
            };
          }
        });
        const caughtNames = caughtIds.map(id => players.find(p => p.id === id)?.name).join(', ');
        log = `🏢 ${currentPlayer.name} achète ${currentTile.name} ! ${caughtNames} est attrapé(e) et recule de 3 cases ⬅️ !`;
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
      } else if (action === 'laugh_penalty') {
        const { playerId, penaltyType } = payload;
        const targetIdx = players.findIndex((pl) => pl.id === playerId);
        if (targetIdx !== -1) {
          if (penaltyType === 'cul_sec') {
            sipsToAdd[playerId] = 6;
            log = `🍺 ${players[targetIdx].name} boit Cul Sec !`;
          } else {
            players[targetIdx] = { ...players[targetIdx], position: 0, isLockedAtStart: true };
            if (targetIdx === currentPlayerIndex) {
              currentPlayer.position = 0;
              currentPlayer.isLockedAtStart = true;
            }
            log = `🚨 ${players[targetIdx].name} retourne au DÉPART !`;
          }
        }
        const remainingTargets = (prev.barScenarioTargetIds || []).filter(id => id !== playerId);
        if (remainingTargets.length > 0) {
          let finalPlayers = players;
          Object.entries(sipsToAdd).forEach(([pid, amount]) => {
            finalPlayers = addSips(finalPlayers, pid, amount, prev.linkedPlayers, prev.linkedTurns);
          });
          return {
            ...prev,
            players: finalPlayers,
            barScenarioTargetIds: remainingTargets,
            logMessages: [log, ...prev.logMessages].slice(0, 15),
          };
        } else {
          const isSuccess = playerId !== currentPlayer.id;
          if (isSuccess) {
            currentTile.ownerId = currentPlayer.id;
            currentTile.level = 1;
            currentPlayer.challengesCompleted += 1;
            log += ` 🏢 ${currentPlayer.name} réussit le défi et achète ${currentTile.name} !`;
          } else {
            log += ` ❌ Défi raté ! ${currentPlayer.name} n'achète pas le bar.`;
          }
          nextIndex = (currentPlayerIndex + 1) % players.length;
        }
      }

      tiles[currentTile.id] = currentTile;
      players[currentPlayerIndex] = currentPlayer;

      // Apply sips additions with linking logic
      let finalPlayers = players;
      Object.entries(sipsToAdd).forEach(([pid, amount]) => {
        finalPlayers = addSips(finalPlayers, pid, amount, prev.linkedPlayers, prev.linkedTurns);
      });

      let nextLog = `C'est au tour de ${finalPlayers[nextIndex].name}.`;
      if (finalPlayers[nextIndex].isPrisoner) {
        nextLog = `🚨 ${finalPlayers[nextIndex].name} est en cellule de dégrisement ! (Tentative ${finalPlayers[nextIndex].prisonTurns}/3)`;
      }

      return {
        ...prev,
        ...getNextTurnState(prev, nextIndex),
        players: finalPlayers,
        tiles,
        activeBarScenario: undefined,
        barScenarioTargetIds: undefined,
        barScenarioWinnerId: undefined,
        barScenarioStage: undefined,
        logMessages: [nextLog, log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  /**
   * Pay jail fine (2 shots / 6 sips) to exit jail immediately.
   * This can be done at the beginning of the turn, or as a forced option after 3 failed attempts.
   * Freeing the player keeps the turn active so they can roll the dice and move on the same turn.
   */
  const payJailFine = () => {
    setState((prev) => {
      let players = [...prev.players];
      const p = { ...players[prev.currentPlayerIndex] };
      p.isPrisoner = false;
      p.prisonTurns = 0;
      players[prev.currentPlayerIndex] = p;
      players = addSips(players, p.id, 6, prev.linkedPlayers, prev.linkedTurns);
      const log = `🔓 ${p.name} paye sa caution de 2 shots (6 gorgées) et sort de dégrisement !`;
      return {
        ...prev,
        players,
        jailRollResult: null,
        logMessages: [log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  // Roll dice while in jail to try and get a 6
  const tryJailRoll = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    if (roll === 6) {
      // Free player, they can roll normally to move
      setState((prev) => {
        const players = [...prev.players];
        const p = { ...players[prev.currentPlayerIndex] };
        p.isPrisoner = false;
        p.prisonTurns = 0;
        players[prev.currentPlayerIndex] = p;
        const log = `🎲 ${p.name} obtient un 6, est libéré(e) de dégrisement et peut relancer le dé !`;
        return {
          ...prev,
          players,
          jailRollResult: null,
          logMessages: [log, ...prev.logMessages].slice(0, 15),
        };
      });
    } else {
      // Failed attempt
      setState((prev) => {
        const players = [...prev.players];
        const p = { ...players[prev.currentPlayerIndex] };
        p.prisonTurns += 1;
        players[prev.currentPlayerIndex] = p;
        const log = `🎲 ${p.name} tente de faire un 6 mais obtient ${roll}. (Tentative ${p.prisonTurns}/3)`;
        return {
          ...prev,
          players,
          jailRollResult: roll,
          logMessages: [log, ...prev.logMessages].slice(0, 15),
        };
      });
    }
  };

  // Resolve roll in jail (non-6) and advance turn
  const resolveJailRollResult = () => {
    nextTurn();
  };

  // Choose to go back to START (position 0) after failing 3 times
  const returnToStartFromJail = () => {
    setState((prev) => {
      const players = [...prev.players];
      const p = { ...players[prev.currentPlayerIndex] };
      p.isPrisoner = false;
      p.prisonTurns = 0;
      p.position = 0; // case DÉPART
      p.isLockedAtStart = true;
      players[prev.currentPlayerIndex] = p;
      const log = `🏁 ${p.name} refuse de boire et retourne à la case DÉPART.`;

      const nextIndex = (prev.currentPlayerIndex + 1) % players.length;
      let nextLog = `C'est au tour de ${players[nextIndex].name}.`;
      if (players[nextIndex].isPrisoner) {
        nextLog = `🚨 ${players[nextIndex].name} est en cellule de dégrisement ! (Tentative ${players[nextIndex].prisonTurns}/3)`;
      }

      return {
        ...prev,
        ...getNextTurnState(prev, nextIndex),
        players,
        activeScreen: 'board',
        logMessages: [nextLog, log, ...prev.logMessages].slice(0, 15),
      };
    });
  };

  // Advanced to the next player's turn
  const nextTurn = () => {
    setState((prev) => {
      const nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      const nextPlayer = prev.players[nextIndex];
      let log = `C'est au tour de ${nextPlayer.name}.`;
      if (nextPlayer.isPrisoner) {
        log = `🚨 ${nextPlayer.name} est en cellule de dégrisement ! (Tentative ${nextPlayer.prisonTurns}/3)`;
      }

      return {
        ...prev,
        ...getNextTurnState(prev, nextIndex),
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

      return {
        ...prev,
        players,
        tiles,
        currentPlayerIndex: nextIndex,
        diceValue,
        activeScreen: nextScreen,
        selectedBottleTargetId: null,
        activeDuoChallenge: null,
        jailRollResult: null,
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
      let players = [...prev.players];
      const currentPlayerIndex = prev.currentPlayerIndex;
      const p = prev.players[currentPlayerIndex];

      players = addSips(players, p.id, amount, prev.linkedPlayers, prev.linkedTurns);

      const log = amount > 0 
        ? `🍺 ${p.name} paye sa pénalité de ${amount} gorgée(s).`
        : `✅ ${p.name} continue sa route sans pénalité.`;

      const nextIndex = (currentPlayerIndex + 1) % prev.players.length;
      let nextLog = `C'est au tour de ${players[nextIndex].name}.`;
      if (players[nextIndex].isPrisoner) {
        nextLog = `🚨 ${players[nextIndex].name} est en cellule de dégrisement ! (Tentative ${players[nextIndex].prisonTurns}/3)`;
      }

      return {
        ...prev,
        ...getNextTurnState(prev, nextIndex),
        players,
        activeScreen: 'board',
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
  const resolveDuoPenalty = (
    loserId: string,
    penalty: number,
    payload?: {
      sips?: { [playerId: string]: number };
      movements?: { [playerId: string]: { recul?: number; position?: number } };
    }
  ) => {
    setState((prev) => {
      let players = [...prev.players];
      let log = '';

      if (payload) {
        // Apply custom sips
        if (payload.sips) {
          Object.entries(payload.sips).forEach(([pid, amount]) => {
            if (amount > 0) {
              players = addSips(players, pid, amount, prev.linkedPlayers, prev.linkedTurns);
              const name = players.find(p => p.id === pid)?.name || '';
              log += `🍺 ${name} boit ${amount} G. `;
            }
          });
        }

        // Apply custom movements
        if (payload.movements) {
          Object.entries(payload.movements).forEach(([pid, move]) => {
            const idx = players.findIndex((pl) => pl.id === pid);
            if (idx !== -1) {
              const pl = { ...players[idx] };
              if (!pl.isPrisoner) {
                if (move.position !== undefined) {
                  pl.position = move.position;
                  if (move.position === 0) {
                    pl.isLockedAtStart = true;
                  }
                  log += `🏁 ${pl.name} retourne au DÉPART. `;
                } else if (move.recul !== undefined) {
                  const newPos = Math.max(0, pl.position - move.recul);
                  pl.position = newPos;
                  if (newPos === 0) {
                    pl.isLockedAtStart = true;
                  }
                  log += `⬅️ ${pl.name} recule de ${move.recul} cases sur ${prev.tiles[newPos].name}. `;
                }
                players[idx] = pl;
              } else {
                log += `(Mais ${pl.name} est en cellule et ne recule pas) `;
              }
            }
          });
        }
      } else {
        if (loserId === 'both') {
          const p1Id = prev.players[prev.currentPlayerIndex].id;
          const p2Id = prev.selectedBottleTargetId;
          players = addSips(players, p1Id, penalty, prev.linkedPlayers, prev.linkedTurns);
          if (p2Id) {
            players = addSips(players, p2Id, penalty, prev.linkedPlayers, prev.linkedTurns);
          }
          log = `🍻 ${prev.players[prev.currentPlayerIndex].name} et ${p2Id ? players.find(p => p.id === p2Id)?.name : 'Adversaire'} boivent ${penalty} gorgée(s) !`;
        } else if (loserId !== 'none' && loserId !== '') {
          players = addSips(players, loserId, penalty, prev.linkedPlayers, prev.linkedTurns);
          log = `🍺 ${players.find(p => p.id === loserId)?.name} boit ${penalty} gorgée(s) !`;
        } else {
          log = `🤝 Défi réussi, personne ne boit !`;
        }
      }

      const nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      let nextLog = `C'est au tour de ${players[nextIndex].name}.`;
      if (players[nextIndex].isPrisoner) {
        nextLog = `🚨 ${players[nextIndex].name} est en cellule de dégrisement ! (Tentative ${players[nextIndex].prisonTurns}/3)`;
      }

      return {
        ...prev,
        ...getNextTurnState(prev, nextIndex),
        players,
        activeScreen: 'board',
        logMessages: [nextLog, log.trim(), ...prev.logMessages].filter(Boolean).slice(0, 15),
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
      let players = prev.players;
      players.forEach((p) => {
        players = addSips(players, p.id, 1, prev.linkedPlayers, prev.linkedTurns);
      });

      const log = `🥂 Tournée Générale ! Tout le monde prend 1 gorgée !`;

      const nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      let nextLog = `C'est au tour de ${players[nextIndex].name}.`;
      if (players[nextIndex].isPrisoner) {
        nextLog = `🚨 ${players[nextIndex].name} est en cellule de dégrisement ! (Tentative ${players[nextIndex].prisonTurns}/3)`;
      }

      return {
        ...prev,
        ...getNextTurnState(prev, nextIndex),
        players,
        activeScreen: 'board',
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
      let players = [...prev.players];
      players = addSips(players, toId, penalty, prev.linkedPlayers, prev.linkedTurns);

      const nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      let nextLog = `C'est au tour de ${players[nextIndex].name}.`;
      if (players[nextIndex].isPrisoner) {
        nextLog = `🚨 ${players[nextIndex].name} est en cellule de dégrisement ! (Tentative ${players[nextIndex].prisonTurns}/3)`;
      }

      const log = `💘 ${players.find((p) => p.id === toId)?.name} a ACCEPTÉ le transfert et boit ${penalty} ${penalty > 1 ? 'gorgées' : 'gorgée'}.`;

      return {
        ...prev,
        ...getNextTurnState(prev, nextIndex),
        players,
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
          return { ...p, position: 0, isLockedAtStart: true };
        }
        return p;
      });

      const nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      let nextLog = `C'est au tour de ${players[nextIndex].name}.`;
      if (players[nextIndex].isPrisoner) {
        nextLog = `🚨 ${players[nextIndex].name} est en cellule de dégrisement ! (Tentative ${players[nextIndex].prisonTurns}/3)`;
      }

      const log = `❌ ${players.find((p) => p.id === toId)?.name} a REFUSÉ le transfert et retourne à la case DÉPART 🏁 !`;

      return {
        ...prev,
        ...getNextTurnState(prev, nextIndex),
        players,
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
    tryJailRoll,
    resolveJailRollResult,
    returnToStartFromJail,
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



