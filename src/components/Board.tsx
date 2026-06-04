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
 * Calculates the 5x5 grid position (row, col) for a given tile ID (0 to 15).
 *
 * @param id - The tile ID (0 to 15)
 * @returns An object with gridRow and gridColumn values (1-indexed for CSS Grid)
 */
export const getGridPosition = (id: number) => {
  let row = 0;
  let col = 0;

  if (id >= 0 && id <= 4) {
    row = 0;
    col = id;
  } else if (id >= 5 && id <= 7) {
    col = 4;
    row = id - 4;
  } else if (id >= 8 && id <= 12) {
    row = 4;
    col = 4 - (id - 8);
  } else if (id >= 13 && id <= 15) {
    col = 0;
    row = 4 - (id - 12);
  }

  // CSS grid lines are 1-indexed, so we add 1
  return {
    gridRow: row + 1,
    gridColumn: col + 1,
  };
};

/**
 * Interactive 5x5 grid board. Displays tiles around the perimeter and renders
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

