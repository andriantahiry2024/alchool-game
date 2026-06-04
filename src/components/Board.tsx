import React from 'react';
import type { Tile, Player } from '../types';
import { getBarLevelLabel } from '../gameData';

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
  return (
    <div className="board-grid">
      {tiles.map((tile) => {
        const gridPos = getGridPosition(tile.id);
        const tilePlayers = players.filter((p) => p.position === tile.id);
        const owner = tile.ownerId ? players.find((p) => p.id === tile.ownerId) : null;

        return (
          <div
            key={tile.id}
            className={`board-tile tile-${tile.type}`}
            style={{
              ...gridPos,
              borderColor: tile.color,
              boxShadow: owner ? `inset 0 0 10px ${owner.color}, 0 0 8px ${owner.color}` : 'none',
            }}
          >
            <div className="tile-header" style={{ color: tile.color }}>
              {tile.name}
            </div>
            {tile.type === 'bar' && (
              <div className="tile-sub">
                {owner ? getBarLevelLabel(tile.level || 1) : `${tile.price} Gor.`}
              </div>
            )}
            
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

