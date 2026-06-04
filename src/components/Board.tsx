import React from 'react';
import type { Tile, Player } from '../types';
import { 
  Flag, 
  Beer, 
  HelpCircle, 
  RotateCw, 
  Lock, 
  AlertTriangle, 
  FlaskConical, 
  Camera, 
  Lightbulb, 
  DollarSign, 
  Wine, 
  Smile 
} from 'lucide-react';

interface BoardProps {
  tiles: Tile[];
  players: Player[];
  currentPlayerIndex: number;
  centerComponent: React.ReactNode;
}

/**
 * Calculates the 9x9 grid position (row, col) for a given tile ID (0 to 31).
 * 32 tiles are placed around the perimeter of a 9x9 grid:
 * - Top row:    id 0–8   → row=0, col=id
 * - Right col:  id 9–15  → col=8, row=id-8
 * - Bottom row: id 16–24 → row=8, col=8-(id-16)
 * - Left col:   id 25–31 → col=0, row=8-(id-24)
 *
 * @param id - The tile ID (0 to 31)
 * @returns An object with gridRow and gridColumn values (1-indexed for CSS Grid)
 */
export const getGridPosition = (id: number) => {
  let row = 0;
  let col = 0;

  if (id >= 0 && id <= 8) {
    row = 0;
    col = id;
  } else if (id >= 9 && id <= 15) {
    col = 8;
    row = id - 8;
  } else if (id >= 16 && id <= 24) {
    row = 8;
    col = 8 - (id - 16);
  } else if (id >= 25 && id <= 31) {
    col = 0;
    row = 8 - (id - 24);
  }

  // CSS grid lines are 1-indexed, so we add 1
  return {
    gridRow: row + 1,
    gridColumn: col + 1,
  };
};

/**
 * Interactive 9x9 grid board. Displays 32 tiles around the perimeter and renders
 * active gameplay components in the center.
 */
export const Board: React.FC<BoardProps> = ({ tiles, players, currentPlayerIndex, centerComponent }) => {
  /**
   * Returns the JSX Element for the tile's icon, styled with the given dynamic color.
   *
   * @param tile - The Tile object
   * @param color - The dynamic color (owner's color or white fallback)
   * @param isOwned - Whether the tile is owned by a player
   * @returns The lucide-react icon component
   */
  const getTileIcon = (tile: Tile, color: string, isOwned: boolean) => {
    const name = tile.name.toLowerCase();
    const type = tile.type;
    const iconClass = isOwned ? 'tile-icon owned-glow' : 'tile-icon';

    if (type === 'start') {
      return <Flag size={20} className={iconClass} style={{ color }} />;
    }
    if (name.includes('alcootest')) {
      return <FlaskConical size={18} className={iconClass} style={{ color }} />;
    }
    if (name.includes('radar')) {
      return <Camera size={18} className={iconClass} style={{ color }} />;
    }
    if (name.includes('énigme')) {
      return <Lightbulb size={18} className={iconClass} style={{ color }} />;
    }
    if (name.includes('tournée')) {
      return <Wine size={18} className={iconClass} style={{ color }} />;
    }
    if (type === 'goto_prison') {
      return <AlertTriangle size={18} className={iconClass} style={{ color }} />;
    }
    if (type === 'prison') {
      return <Lock size={18} className={iconClass} style={{ color }} />;
    }
    if (type === 'tax') {
      return <DollarSign size={18} className={iconClass} style={{ color }} />;
    }
    if (type === 'bottle') {
      return <RotateCw size={18} className={iconClass} style={{ color }} />;
    }
    if (type === 'card') {
      return <HelpCircle size={18} className={iconClass} style={{ color }} />;
    }
    if (type === 'chill') {
      return <Smile size={18} className={iconClass} style={{ color }} />;
    }
    if (type === 'bar') {
      return <Beer size={18} className={iconClass} style={{ color }} />;
    }
    return null;
  };

  return (
    <div className="board-grid">
      {tiles.map((tile) => {
        const gridPos = getGridPosition(tile.id);
        const tilePlayers = players.filter((p) => p.position === tile.id);
        const owner = tile.ownerId ? players.find((p) => p.id === tile.ownerId) : null;
        const color = owner ? owner.color : '#cccccc';

        return (
          <div
            key={tile.id}
            className={`board-tile tile-${tile.type}`}
            style={{
              ...gridPos,
              borderColor: owner ? owner.color : 'transparent',
              boxShadow: owner ? `inset 0 0 10px ${owner.color}, 0 0 8px ${owner.color}` : 'none',
            }}
            title={`${tile.name} ${tile.description ? `- ${tile.description}` : ''}`}
          >
            <div className="tile-icon-container">
              {getTileIcon(tile, color, !!owner)}
            </div>
            
            <div className="tile-tokens">
              {tilePlayers.map((p) => (
                <div
                  key={p.id}
                  className={`player-token ${players[currentPlayerIndex].id === p.id ? 'active-token' : ''}`}
                  style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}` }}
                  title={p.name}
                >
                  {p.name.substring(0, 2).toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="board-center">
        {centerComponent}
      </div>
    </div>
  );
};

