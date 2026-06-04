import React, { useState } from 'react';
import { playDiceRoll } from '../utils/audio';

interface DiceRollerProps {
  onRollComplete: (value: number) => void;
  playerColor: string;
}

const ROTATIONS = [
  { x: 0, y: 0 },       // Face 1 (unused index 0)
  { x: 0, y: 0 },       // Face 1
  { x: 0, y: 90 },      // Face 2
  { x: -90, y: 0 },     // Face 3
  { x: 90, y: 0 },      // Face 4
  { x: 0, y: -90 },     // Face 5
  { x: 180, y: 0 },     // Face 6
];

/**
 * 3D Animated CSS Dice Roller component.
 * Triggers realistic rolling audio and passes the rolled value to the parent.
 */
export const DiceRoller: React.FC<DiceRollerProps> = ({ onRollComplete, playerColor }) => {
  const [rolling, setRolling] = useState(false);
  const [value, setValue] = useState(1);

  // Triggers the dice rolling animation and sound
  const handleRoll = () => {
    if (rolling) return;
    setRolling(true);
    playDiceRoll(1200);

    // Roll duration is 1.2s
    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      setValue(newValue);
      setRolling(false);
      onRollComplete(newValue);
    }, 1200);
  };

  const rotation = ROTATIONS[value];
  const diceStyle = rolling
    ? {}
    : { transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` };

  return (
    <div className="dice-container">
      <div className="dice-scene" onClick={handleRoll}>
        <div
          className={`dice ${rolling ? 'rolling' : ''}`}
          style={{
            ...diceStyle,
            '--glow-color': playerColor,
          } as any}
        >
          <div className="dice-face face-1">
            <span className="dot"></span>
          </div>
          <div className="dice-face face-2">
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="dice-face face-3">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="dice-face face-4">
            <div className="dot-row">
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
            <div className="dot-row">
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
          <div className="dice-face face-5">
            <div className="dot-row">
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
            <div className="dot-row">
              <span className="dot"></span>
            </div>
            <div className="dot-row">
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
          <div className="dice-face face-6">
            <div className="dot-row">
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
            <div className="dot-row">
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
            <div className="dot-row">
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleRoll}
        disabled={rolling}
        className="neon-btn roll-btn"
        style={{ borderColor: playerColor, boxShadow: `0 0 12px ${playerColor}`, color: playerColor }}
      >
        {rolling ? 'Lancement...' : 'Lancer le Dé'}
      </button>
    </div>
  );
};

