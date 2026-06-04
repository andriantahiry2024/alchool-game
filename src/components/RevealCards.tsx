import React, { useState } from 'react';
import type { Player } from '../types';
import { playClick } from '../utils/audio';
import { HelpCircle } from 'lucide-react';

interface RevealCardsProps {
  players: Player[];
  onConfirmReveal: () => void;
}

/**
 * RevealCards skeleton.
 * Displays playing cards for each player to flip before the game starts.
 */
export const RevealCards: React.FC<RevealCardsProps> = ({ players, onConfirmReveal }) => {
  const [flippedIds, setFlippedIds] = useState<string[]>([]);

  const handleCardClick = (id: string) => {
    if (flippedIds.includes(id)) return;
    playClick();
    setFlippedIds([...flippedIds, id]);
  };

  const allFlipped = flippedIds.length === players.length;

  const getSuitSymbol = (suit: string) => {
    if (suit === 'pique') return '♠️';
    if (suit === 'coeur') return '♥️';
    if (suit === 'carreau') return '♦️';
    return '♣️';
  };

  const getSuitLabel = (suit: string) => {
    if (suit === 'pique') return 'Pique';
    if (suit === 'coeur') return 'Cœur';
    if (suit === 'carreau') return 'Carreau';
    return 'Trèfle';
  };

  return (
    <div className="reveal-container">
      <h2 className="reveal-title">Cartes Fétiches 🃏</h2>
      <p className="reveal-subtitle">
        Chaque joueur clique sur sa carte pour révéler son enseigne fétiche !
      </p>
      <div className="reveal-cards-grid">
        {players.map((p) => {
          const isFlipped = flippedIds.includes(p.id);
          const pCard = p.card || { suit: 'pique', cardValue: 'As' };
          const isRed = pCard.suit === 'coeur' || pCard.suit === 'carreau';
          return (
            <div key={p.id} className="reveal-card-wrapper">
              <span className="player-reveal-name" style={{ color: p.color }}>{p.name}</span>
              <div className={`card-3d reveal-card-3d ${isFlipped ? 'flipped' : ''}`} onClick={() => handleCardClick(p.id)}>
                <div className="card-side card-back" style={{ borderColor: p.color }}>
                  <HelpCircle size={28} style={{ color: p.color }} />
                  <span className="reveal-tap-hint">Cliquer</span>
                </div>
                <div className="card-side card-front" style={{ borderColor: isRed ? '#ff007f' : '#00f2fe' }}>
                  <div className="reveal-card-suit" style={{ color: isRed ? '#ff007f' : '#00f2fe' }}>{getSuitSymbol(pCard.suit)}</div>
                  <div className="reveal-card-val">{pCard.cardValue}</div>
                  <div className="reveal-card-suit-label" style={{ opacity: 0.6 }}>{getSuitLabel(pCard.suit)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={onConfirmReveal} disabled={!allFlipped} className="neon-btn start-btn reveal-confirm-btn" style={{ marginTop: '20px' }}>
        Lancer la Soirée 🚀
      </button>
    </div>
  );
};
