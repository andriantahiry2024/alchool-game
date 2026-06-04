import React, { useState } from 'react';
import type { Player } from '../types';
import { playClick } from '../utils/audio';
import { UserPlus, Trash2, Play } from 'lucide-react';

interface PlayerSetupProps {
  onStartGame: (players: Player[]) => void;
}

const NEON_COLORS = [
  '#ff007f', // Pink
  '#39ff14', // Green
  '#00f2fe', // Blue
  '#ffff00', // Yellow
  '#a015ff', // Purple
  '#ff6c00', // Orange
];

/**
 * Component for setting up the players and their neon avatar colors.
 */
export const PlayerSetup: React.FC<PlayerSetupProps> = ({ onStartGame }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState(NEON_COLORS[0]);
  const [error, setError] = useState('');

  // Handle adding a new player
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    // Validation des pseudos en doublon (insensible à la casse)
    if (players.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError('Ce nom est déjà utilisé par un autre joueur !');
      return;
    }

    playClick();
    const newPlayer: Player = {
      id: Math.random().toString(36).substr(2, 9),
      name: trimmedName,
      color,
      position: 0,
      sipsCount: 0,
      challengesCompleted: 0,
      isPrisoner: false,
      prisonTurns: 0,
      laps: 0,
      powerUsed: false,
    };
    setPlayers([...players, newPlayer]);
    setName('');
    setError('');
    // Auto-select next color for convenience
    const nextColorIndex = (NEON_COLORS.indexOf(color) + 1) % NEON_COLORS.length;
    setColor(NEON_COLORS[nextColorIndex]);
  };

  const handleRemovePlayer = (id: string) => {
    playClick();
    setPlayers(players.filter((p) => p.id !== id));
  };

  const handleStart = () => {
    if (players.length < 2) return;
    playClick();
    onStartGame(players);
  };

  return (
    <div className="setup-container">
      <h1 className="logo-title">ALCOOLY</h1>
      <p className="logo-subtitle">Le Monopoly de l'apéro 🍻</p>

      <form onSubmit={handleAddPlayer} className="setup-form">
        <div style={{ width: '100%', position: 'relative' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); if (error) setError(''); }}
            placeholder="Nom du joueur..."
            maxLength={15}
            className="setup-input"
          />
          {error && (
            <div className="setup-error" style={{ color: '#ff3333', fontSize: '14px', marginTop: '4px', textAlign: 'left', paddingLeft: '8px', textShadow: '0 0 5px rgba(255, 51, 51, 0.4)' }}>
              ⚠️ {error}
            </div>
          )}
        </div>
        <div className="color-selector">
          {NEON_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`color-dot ${color === c ? 'active' : ''}`}
              style={{ backgroundColor: c, boxShadow: `0 0 10px ${c}` }}
            />
          ))}
        </div>
        <button type="submit" className="neon-btn add-btn">
          <UserPlus size={20} /> Ajouter
        </button>
      </form>

      <div className="players-list">
        {players.map((p) => (
          <div key={p.id} className="player-badge" style={{ borderColor: p.color, boxShadow: `0 0 8px ${p.color}` }}>
            <span style={{ color: p.color }}>{p.name}</span>
            <button onClick={() => handleRemovePlayer(p.id)} className="delete-btn">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleStart}
        disabled={players.length < 2}
        className="neon-btn start-btn"
        style={{ marginTop: 'auto' }}
      >
        <Play size={20} /> Lancer la Soirée ({players.length}/2+)
      </button>
    </div>
  );
};

