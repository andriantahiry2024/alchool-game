import React, { useState } from 'react';
import type { Card } from '../types';
import { playClick, playSuccess, playFail } from '../utils/audio';
import { HelpCircle, Check, Flame } from 'lucide-react';

interface CardDrawerProps {
  card: Card;
  playerName: string;
  playerColor: string;
  onActionComplete: (success: boolean, penalty: number) => void;
  powerButton?: React.ReactNode;
}

/**
 * 3D Flipping Card Drawer component.
 * Displays the card back, animates a 3D flip on click, and presents success/fail options.
 */
export const CardDrawer: React.FC<CardDrawerProps> = ({
  card,
  playerName,
  playerColor,
  onActionComplete,
  powerButton,
}) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    if (flipped) return;
    playClick();
    setFlipped(true);
  };

  const handleComplete = (success: boolean) => {
    playClick();
    if (success) {
      playSuccess();
    } else {
      playFail();
    }
    onActionComplete(success, card.penalty);
  };

  // Formate le nom du joueur avec l'élision française correcte (de vs d')
  const getDeName = (name: string) => {
    const vowels = ['a', 'e', 'i', 'o', 'u', 'y', 'h', 'é', 'è', 'à', 'ù'];
    const firstChar = name.trim().charAt(0).toLowerCase();
    return vowels.includes(firstChar) ? `d'${name}` : `de ${name}`;
  };

  const getSuitName = () => {
    switch (card.suit) {
      case 'pique': return '♠️ Pique';
      case 'coeur': return '♥️ Cœur';
      case 'carreau': return '♦️ Carreau';
      case 'trefle': return '♣️ Trèfle';
      default: return '';
    }
  };

  const getSuitColor = () => {
    switch (card.suit) {
      case 'pique': return '#ff3333';
      case 'coeur': return '#ff007f';
      case 'carreau': return '#ff6c00';
      case 'trefle': return '#39ff14';
      default: return '#ffffff';
    }
  };

  const suitColor = getSuitColor();
  const suitName = getSuitName();

  return (
    <div className="card-drawer-container">
      <div className={`card-3d ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
        {/* Card Back */}
        <div className="card-side card-back" style={{ borderColor: playerColor, boxShadow: `0 0 15px ${playerColor}` }}>
          <HelpCircle size={48} style={{ color: playerColor }} className="pulse" />
          <div className="card-back-title" style={{ color: playerColor }}>ALCOOLY</div>
          <p className="card-back-hint">Appuie pour piocher la carte {getDeName(playerName)}</p>
        </div>

        {/* Card Front */}
        <div className="card-side card-front" style={{ borderColor: suitColor, boxShadow: `0 0 15px ${suitColor}` }}>
          <div className="card-category-badge" style={{ backgroundColor: suitColor, color: '#050515' }}>
            {suitName}
          </div>
          <div className="card-player-target" style={{ color: playerColor, textShadow: `0 0 5px ${playerColor}`, fontWeight: 800, fontSize: '13px', margin: '4px 0' }}>
            Pour {playerName}
          </div>
          <h2 className="card-title">{card.title}</h2>
          <div className="card-text-container">
            <p className="card-text">{card.text}</p>
          </div>
          <div className="card-penalty" style={{ color: suitColor }}>
            Pénalité : {card.penalty} {card.penalty > 1 ? 'gorgées' : 'gorgée'} 🍺
          </div>
        </div>
      </div>

      {flipped && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="card-actions" style={{ width: '100%' }}>
            {card.category === 'movement' ? (
              <button onClick={() => handleComplete(true)} className="neon-btn success-btn" style={{ borderColor: '#39ff14', color: '#39ff14', boxShadow: '0 0 10px rgba(57, 255, 20, 0.4)', width: '100%' }}>
                <Check size={18} /> Appliquer l'effet
              </button>
            ) : (
              <>
                <button onClick={() => handleComplete(true)} className="neon-btn success-btn" style={{ borderColor: '#39ff14', color: '#39ff14', boxShadow: '0 0 10px rgba(57, 255, 20, 0.4)' }}>
                  <Check size={18} /> Réussi
                </button>
                <button onClick={() => handleComplete(false)} className="neon-btn fail-btn" style={{ borderColor: '#ff3333', color: '#ff3333', boxShadow: '0 0 10px rgba(255, 51, 51, 0.4)' }}>
                  <Flame size={18} /> Je Bois...
                </button>
              </>
            )}
          </div>
          {powerButton}
        </div>
      )}
    </div>
  );
};

