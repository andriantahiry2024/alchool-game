import React, { useState, useRef } from 'react';
import type { Player } from '../types';
import { playSpinTick, playSuccess } from '../utils/audio';

interface BottleSpinnerProps {
  players: Player[];
  currentPlayerId: string;
  onSpinComplete: (targetPlayer: Player) => void;
}

/**
 * Interactive Spin the Bottle component.
 * Uses trigonometry to position players in a circle and CSS rotation for the bottle.
 */
export const BottleSpinner: React.FC<BottleSpinnerProps> = ({
  players,
  currentPlayerId,
  onSpinComplete,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const audioIntervalRef = useRef<number | null>(null);

  // Radius of the circle of players (in px)
  const RADIUS = 85;
  const numPlayers = players.length;

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);

    // Pick a random player as the target, excluding the spinner
    const otherPlayers = players.filter((p) => p.id !== currentPlayerId);
    const pool = otherPlayers.length > 0 ? otherPlayers : players;
    const pickedPlayer = pool[Math.floor(Math.random() * pool.length)];

    const targetIndex = players.findIndex((p) => p.id === pickedPlayer.id);

    // Each player is separated by (360 / numPlayers) degrees
    const anglePerPlayer = 360 / numPlayers;
    const baseAngle = targetIndex * anglePerPlayer;
    
    // Calculate next rotation cumulatively so it always spins forward by at least 5 full turns
    setRotation((prevRotation) => {
      const currentAngle = prevRotation % 360;
      let diff = baseAngle - currentAngle;
      if (diff <= 0) diff += 360;
      return prevRotation + 1800 + diff;
    });

    // Play ticking sounds during spin (fast at first, then slow)
    let ticks = 0;
    const maxTicks = 15;
    const playTickSequence = () => {
      if (ticks >= maxTicks) {
        if (audioIntervalRef.current) clearTimeout(audioIntervalRef.current);
        return;
      }
      playSpinTick();
      ticks++;
      // Quadratic delay increase to simulate friction/slowing down
      const delay = 50 + Math.pow(ticks, 2.3) * 2;
      audioIntervalRef.current = window.setTimeout(playTickSequence, delay);
    };
    playTickSequence();

    // Transition duration is 3s (3000ms)
    setTimeout(() => {
      setSpinning(false);
      playSuccess();
      onSpinComplete(pickedPlayer);
    }, 3000);
  };

  return (
    <div className="bottle-spinner-container">
      <div className="spinner-circle">
        {/* Render bottle in the center */}
        <div
          className="spinning-bottle"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 3.0s cubic-bezier(0.1, 0.8, 0.1, 1)' : 'none',
          }}
          onClick={handleSpin}
        >
          {/* Custom SVG Bottle */}
          <svg viewBox="0 0 100 100" width="80" height="80">
            <path d="M45,10 h10 v15 h-10 z" fill="#00f2fe" />
            <path d="M35,25 h30 c5,0 10,5 10,10 v50 c0,5 -5,10 -10,10 h-30 c-5,0 -10,-5 -10,-10 v-50 c0,-5 5,-10 10,-10 z" fill="#39ff14" />
            <circle cx="50" cy="50" r="10" fill="#ffffff" opacity="0.3" />
          </svg>
        </div>

        {/* Position players dynamically around the circle */}
        {players.map((p, idx) => {
          const angle = (idx * (360 / numPlayers) * Math.PI) / 180 - Math.PI / 2; // offset by -90deg to start at top
          const x = RADIUS * Math.cos(angle);
          const y = RADIUS * Math.sin(angle);

          return (
            <div
              key={p.id}
              className={`spinner-player-badge ${p.id === currentPlayerId ? 'active-player' : ''}`}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                borderColor: p.color,
                boxShadow: `0 0 8px ${p.color}`,
                color: p.color,
              }}
            >
              {p.name.substring(0, 8)}
            </div>
          );
        })}
      </div>
      
      <button onClick={handleSpin} disabled={spinning} className="neon-btn spin-btn">
        {spinning ? 'Sélection...' : 'Faire Tourner'}
      </button>
    </div>
  );
};

