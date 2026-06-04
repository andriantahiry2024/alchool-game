/**
 * Suits for standard playing cards.
 */
export type SuitType = 'pique' | 'coeur' | 'carreau' | 'trefle';

/**
 * Category of drinking cards.
 */
export type CardCategory = 'action' | 'truth' | 'never' | 'rule' | 'movement';

/**
 * Interface representing a game card containing a challenge or rule.
 */
export interface Card {
  id: string;
  category: CardCategory;
  suit: SuitType;
  cardValue: string; // e.g. "As", "Roi", "Dame", "Valet", "10", "8", "7"
  title: string;
  text: string;
  penalty: number; // Number of sips (gorgées)
}

/**
 * Types of tiles on the board.
 */
export type TileType =
  | 'start'
  | 'bar'
  | 'card'
  | 'bottle'
  | 'prison'
  | 'goto_prison'
  | 'minigame'
  | 'tax'
  | 'chill';

/**
 * Interface representing a tile on the 32-space board.
 */
export interface Tile {
  id: number; // 0 to 31
  name: string;
  type: TileType;
  description: string;
  color?: string; // Hex or CSS color variable
  ownerId?: string; // Player ID who owns this bar (only for 'bar' types)
  level?: number; // Level of the bar (e.g. 0 to 3 upgrades)
  price?: number; // Price to purchase/upgrade in sips
}

/**
 * Interface representing a player.
 */
export interface Player {
  id: string;
  name: string;
  color: string; // Neon hex code or class name
  position: number; // Index of the tile (0 to 31)
  sipsCount: number; // Number of sips taken
  challengesCompleted: number; // Count of successful challenges
  isPrisoner: boolean;
  prisonTurns: number; // Remaining turns to stay in jail (max 1 or 2)
  card?: {
    suit: SuitType;
    cardValue: string;
  };
  laps: number;
  powerUsed: boolean;
}

/**
 * Interface representing the overall game state.
 */
export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  tiles: Tile[];
  activeCard: Card | null;
  activeScreen: 'setup' | 'reveal' | 'board' | 'bottle' | 'card' | 'dice' | 'minigame' | 'gameover';
  selectedBottleTargetId: string | null;
  activeDuoChallenge: string | null;
  diceValue: number | null;
  logMessages: string[];
  isMoving?: boolean;
  activeBarScenario?: number; // Random scenario index (1 to 12)
  barScenarioTargetIds?: string[]; // Player IDs targeted by the active scenario
  barScenarioWinnerId?: string; // Winner or correct target player ID for the scenario
  barScenarioStage?: 'guess' | 'result'; // Stage for interactive scenarios (like Scenario 12)
  usedBarScenarios?: number[]; // Scenario indices that were already played
  usedCardIds?: string[]; // Mystery card IDs that were already drawn
  pendingTransfer?: {
    fromId: string;
    toId: string;
    penalty: number;
  } | null;
}

