import React, { useState } from 'react';
import type { Card, Player } from '../types';
import { playClick, playSuccess, playFail } from '../utils/audio';
import { HelpCircle } from 'lucide-react';

interface CardDrawerProps {
  card: Card;
  playerName: string;
  playerColor: string;
  onActionComplete: (success: boolean, penalty: number, payload?: any) => void;
  powerButton?: React.ReactNode;
  players: Player[];
  activePlayerId: string;
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
  players,
  activePlayerId,
}) => {
  const [flipped, setFlipped] = useState(false);

  // Selected player IDs for h3 link coeur special card
  const [selectedId1, setSelectedId1] = useState<string>('');
  const [selectedId2, setSelectedId2] = useState<string>('');

  // Selected choices for each player
  const [cardChoices, setCardChoices] = useState<Record<string, 'ok' | 'sip' | 'recul' | 'cul_sec' | 'depart'>>({});

  const handleFlip = () => {
    if (flipped) return;
    playClick();
    setFlipped(true);
  };

  const handleCustomComplete = (success: boolean, payload?: any) => {
    playClick();
    if (success) {
      playSuccess();
    } else {
      playFail();
    }
    onActionComplete(success, card.penalty, payload);
  };

  // Formate le nom du joueur avec l'élision française correcte (de vs d')
  const getDeName = (name: string) => {
    const vowels = ['a', 'e', 'i', 'o', 'u', 'y', 'h', 'é', 'è', 'à', 'ù'];
    const firstChar = name.trim().charAt(0).toLowerCase();
    return vowels.includes(firstChar) ? `d'${name}` : `de ${name}`;
  };
  const getSuitSymbol = (suit: string) => {
    if (suit === 'pique') return '♠';
    if (suit === 'coeur') return '♥️';
    if (suit === 'carreau') return '♦️';
    return '♣';
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
      case 'pique': return '#00f2fe';
      case 'coeur': return '#ff007f';
      case 'carreau': return '#ff6c00';
      case 'trefle': return '#39ff14';
      default: return '#ffffff';
    }
  };

  const suitColor = getSuitColor();
  const suitName = getSuitName();

  const getCardConfig = (cardId: string) => {
    const blackPlayers = players.filter((pl) => pl.card?.suit === 'pique' || pl.card?.suit === 'trefle');
    const carreauPlayers = players.filter((pl) => pl.card?.suit === 'carreau');

    switch (cardId) {
      // Pique
      case 's1': return { sips: 1, recul: 0, culSec: true, depart: false };
      case 's2': return { sips: blackPlayers.length > 0 ? 3 : 2, recul: 0, culSec: false, depart: false };
      case 's3': return { sips: 3, recul: 0, culSec: true, depart: true };
      case 's4': return { sips: 0, recul: 2, culSec: false, depart: false };
      case 's5': return { sips: 3, recul: 4, culSec: false, depart: false };
      // Coeur
      case 'h1': return { sips: 2, recul: 3, culSec: false, depart: false };
      case 'h2': return { sips: 3, recul: 4, culSec: false, depart: false };
      case 'h3': return { sips: 2, recul: 2, culSec: false, depart: false };
      case 'h4': return { sips: 3, recul: 0, culSec: false, depart: false };
      case 'h5': return { sips: 2, recul: 0, culSec: false, depart: true };
      // Carreau
      case 'd1': return { sips: 0, recul: 3, culSec: false, depart: false };
      case 'd2': return { sips: 3, recul: 0, culSec: false, depart: false };
      case 'd3': return { sips: 0, recul: 0, culSec: true, depart: true };
      case 'd4': return { sips: 0, recul: 3, culSec: false, depart: false };
      case 'd5': return { sips: 3, recul: carreauPlayers.length > 0 ? 3 : 5, culSec: false, depart: false };
      // Trèfle
      case 'c1': return { sips: 0, recul: 0, culSec: true, depart: true };
      case 'c2': return { sips: 0, recul: 0, culSec: true, depart: true };
      case 'c3': return { sips: 0, recul: 0, culSec: true, depart: true };
      case 'c4': return { sips: 0, recul: 4, culSec: true, depart: false };
      case 'c5': return { sips: 2, recul: 5, culSec: false, depart: false };
      default: return { sips: card.penalty, recul: 0, culSec: false, depart: false };
    }
  };

  React.useEffect(() => {
    const initial: Record<string, 'ok' | 'sip' | 'recul' | 'cul_sec' | 'depart'> = {};
    players.forEach(pl => {
      initial[pl.id] = 'ok';
    });

    const piquePlayers = players.filter((pl) => pl.card?.suit === 'pique');
    const heartPlayers = players.filter((pl) => pl.card?.suit === 'coeur');
    const carreauPlayers = players.filter((pl) => pl.card?.suit === 'carreau');
    const blackPlayers = players.filter((pl) => pl.card?.suit === 'pique' || pl.card?.suit === 'trefle');

    if (card.id === 's1') {
      if (piquePlayers.length > 0) piquePlayers.forEach(pl => { initial[pl.id] = 'cul_sec'; });
      else players.forEach(pl => { initial[pl.id] = 'sip'; });
    } else if (card.id === 's2') {
      if (blackPlayers.length > 0) blackPlayers.forEach(pl => { initial[pl.id] = 'sip'; });
      else initial[activePlayerId] = 'sip';
    } else if (card.id === 's3') {
      if (piquePlayers.length > 0) piquePlayers.forEach(pl => { initial[pl.id] = 'sip'; });
    } else if (card.id === 's4') {
      if (piquePlayers.length > 0) piquePlayers.forEach(pl => { initial[pl.id] = 'recul'; });
      else initial[activePlayerId] = 'recul';
    } else if (card.id === 'h1') {
      if (heartPlayers.length > 0) heartPlayers.forEach(pl => { initial[pl.id] = 'sip'; });
      else initial[activePlayerId] = 'recul';
    } else if (card.id === 'h2') {
      const owner = players.find(pl => pl.card?.suit === 'coeur' && pl.card?.cardValue === '10');
      if (owner) initial[owner.id] = 'sip';
      else initial[activePlayerId] = 'recul';
    } else if (card.id === 'h3') {
      const hasHeart = heartPlayers.length > 0;
      if (!hasHeart) initial[activePlayerId] = 'recul';
    } else if (card.id === 'h4') {
      const owner = players.find(pl => pl.card?.suit === 'coeur' && pl.card?.cardValue === '8');
      if (owner) initial[owner.id] = 'sip';
      else initial[activePlayerId] = 'sip';
    } else if (card.id === 'd1') {
      const owner = players.find(pl => pl.card?.suit === 'carreau' && pl.card?.cardValue === 'Roi');
      if (owner) initial[owner.id] = 'recul';
      else initial[activePlayerId] = 'recul';
    } else if (card.id === 'd2') {
      if (carreauPlayers.length > 0) carreauPlayers.forEach(pl => { initial[pl.id] = 'sip'; });
      else initial[activePlayerId] = 'sip';
    } else if (card.id === 'd3') {
      initial[activePlayerId] = 'depart';
    } else if (card.id === 'd4') {
      const owner = players.find(pl => pl.card?.suit === 'carreau');
      if (owner) initial[owner.id] = 'recul';
      else initial[activePlayerId] = 'recul';
    } else if (card.id === 'd5') {
      const owner = players.find(pl => pl.card?.suit === 'carreau');
      if (!owner) initial[activePlayerId] = 'recul';
    }

    setCardChoices(initial);
  }, [card.id, flipped, players, activePlayerId]);

  const renderActions = () => {
    const config = getCardConfig(card.id);
    const heartPlayers = players.filter((pl) => pl.card?.suit === 'coeur');
    const isSpecialH3Link = card.id === 'h3' && heartPlayers.length > 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        {isSpecialH3Link && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', opacity: 0.8, textAlign: 'center' }}>
              Sélectionnez les deux joueurs à lier (Âmes Sœurs) :
            </span>
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              <select
                value={selectedId1}
                onChange={(e) => setSelectedId1(e.target.value)}
                className="setup-select"
                style={{ flex: 1, background: '#050515', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px', borderRadius: '8px' }}
              >
                <option value="">Joueur 1</option>
                {players.map(pl => (
                  <option key={pl.id} value={pl.id}>
                    {pl.name} {pl.card ? `[${pl.card.cardValue} ${getSuitSymbol(pl.card.suit)}]` : ''}
                  </option>
                ))}
              </select>
              <select
                value={selectedId2}
                onChange={(e) => setSelectedId2(e.target.value)}
                className="setup-select"
                style={{ flex: 1, background: '#050515', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px', borderRadius: '8px' }}
              >
                <option value="">Joueur 2</option>
                {players.map(pl => (
                  <option key={pl.id} value={pl.id}>
                    {pl.name} {pl.card ? `[${pl.card.cardValue} ${getSuitSymbol(pl.card.suit)}]` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
          {players.map((pl) => {
            const choice = cardChoices[pl.id] || 'ok';
            return (
              <div key={pl.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}>
                <span style={{ color: pl.color, fontSize: '14px', fontWeight: 600 }}>
                  {pl.name}
                  {pl.card && (
                    <span className="player-fetiche-badge">
                      {pl.card.cardValue}{getSuitSymbol(pl.card.suit)}
                    </span>
                  )}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => { playClick(); setCardChoices(prev => ({ ...prev, [pl.id]: 'ok' })); }}
                    className={`neon-btn ${choice === 'ok' ? 'choice-success-active' : ''}`}
                    style={{ padding: '5px 8px', fontSize: '11px' }}
                  >
                    🏆 OK
                  </button>

                  {config.sips > 0 && (
                    <button
                      onClick={() => { playClick(); setCardChoices(prev => ({ ...prev, [pl.id]: 'sip' })); }}
                      className={`neon-btn ${choice === 'sip' ? 'choice-fail-active' : ''}`}
                      style={{ padding: '5px 8px', fontSize: '11px' }}
                    >
                      Boire {config.sips}G 🍺
                    </button>
                  )}

                  {config.recul > 0 && (
                    <button
                      onClick={() => { playClick(); setCardChoices(prev => ({ ...prev, [pl.id]: 'recul' })); }}
                      className={`neon-btn ${choice === 'recul' ? 'choice-fail-active' : ''}`}
                      style={{ padding: '5px 8px', fontSize: '11px' }}
                    >
                      Reculer {config.recul}C ⬅️
                    </button>
                  )}

                  {config.culSec && (
                    <button
                      onClick={() => { playClick(); setCardChoices(prev => ({ ...prev, [pl.id]: 'cul_sec' })); }}
                      className={`neon-btn ${choice === 'cul_sec' ? 'choice-fail-active' : ''}`}
                      style={{ padding: '5px 8px', fontSize: '11px' }}
                    >
                      Cul Sec 🍺
                    </button>
                  )}

                  {config.depart && (
                    <button
                      onClick={() => { playClick(); setCardChoices(prev => ({ ...prev, [pl.id]: 'depart' })); }}
                      className={`neon-btn ${choice === 'depart' ? 'choice-fail-active' : ''}`}
                      style={{ padding: '5px 8px', fontSize: '11px' }}
                    >
                      DÉPART 🏁
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            const sips: Record<string, number> = {};
            const movements: Record<string, any> = {};
            players.forEach(pl => {
              const choice = cardChoices[pl.id] || 'ok';
              if (choice === 'sip') {
                sips[pl.id] = config.sips;
              } else if (choice === 'recul') {
                movements[pl.id] = { recul: config.recul };
              } else if (choice === 'cul_sec') {
                sips[pl.id] = 6;
              } else if (choice === 'depart') {
                movements[pl.id] = { position: 0 };
              }
            });

            // Build custom log message
            let logPart = `Effet de la carte ${card.title} appliqué. `;
            const sipsList = Object.entries(sips).map(([pid, amt]) => {
              const name = players.find(p => p.id === pid)?.name;
              return `${name} boit ${amt}G`;
            });
            const movesList = Object.entries(movements).map(([pid, move]: [string, any]) => {
              const name = players.find(p => p.id === pid)?.name;
              if (move.position === 0) return `${name} retourne au DÉPART`;
              return `${name} recule de ${move.recul} cases`;
            });

            if (sipsList.length > 0) logPart += `🍻 ${sipsList.join(', ')}. `;
            if (movesList.length > 0) logPart += `⬅️ ${movesList.join(', ')}. `;

            const payload: any = {
              type: 'resolve_custom',
              sips,
              movements,
              log: logPart
            };

            if (isSpecialH3Link) {
              payload.linkedIds = [selectedId1, selectedId2];
            }

            handleCustomComplete(true, payload);
          }}
          disabled={isSpecialH3Link && (!selectedId1 || !selectedId2 || selectedId1 === selectedId2)}
          className="neon-btn success-btn"
          style={{ width: '100%', marginTop: '4px' }}
        >
          Appliquer l'effet
        </button>
      </div>
    );
  };

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
          <div className="card-player-target" style={{ color: playerColor, textShadow: `0 0 5px ${playerColor}`, fontWeight: 800, fontSize: '16px !important', margin: '4px 0' }}>
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
          <div className="card-actions" style={{ width: '100%', flexDirection: 'column', gap: '8px' }}>
            {renderActions()}
          </div>
          {powerButton}
        </div>
      )}
    </div>
  );
};

export default CardDrawer;
