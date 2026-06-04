import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { PlayerSetup } from './components/PlayerSetup';
import { Board } from './components/Board';
import { DiceRoller } from './components/DiceRoller';
import { CardDrawer } from './components/CardDrawer';
import { playClick, playFail, playSuccess } from './utils/audio';
import { BottleSpinner } from './components/BottleSpinner';
import { RevealCards } from './components/RevealCards';
import { Shield, AlertTriangle, Users, GlassWater, Flame, Menu, X, Beer, Crown, Trophy, PartyPopper } from 'lucide-react';

/**
 * Main App Component.
 * Integrates game state hooks and handles sub-screen routing (setup, board, card flip, bottle spin).
 */
function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const {
    state,
    startGame,
    confirmReveal,
    rollDice,
    resolveCard,
    resolveBottle,
    resolveBar,
    payJailFine,
    nextTurn,
    sendToJail,
    usePlayerPower,
    resolveAlcootest,
    paySipsAndNextTurn,
    resolveDuoPenalty,
    resolveTourneeGenerale,
    selectTargetPlayer,
    resetGame,
  } = useGameState();

  const { players, currentPlayerIndex, tiles, activeCard, activeScreen, selectedBottleTargetId, diceValue, logMessages } = state;

  const getSuitSymbol = (suit: string) => {
    if (suit === 'pique') return '♠️';
    if (suit === 'coeur') return '♥️';
    if (suit === 'carreau') return '♦️';
    return '♣️';
  };

  // Active player object
  const currentPlayer = players[currentPlayerIndex];

  const renderSuperPowerButton = (penaltyAmount: number = 0) => {
    if (!currentPlayer || currentPlayer.powerUsed) return null;
    const suit = currentPlayer.card?.suit;
    if (suit === 'pique') {
      return (
        <button onClick={() => usePlayerPower('pique')} className="neon-btn" style={{ width: '100%', borderColor: '#ff007f', color: '#ff007f', marginTop: '10px', boxShadow: '0 0 10px rgba(255, 0, 127, 0.4)', fontSize: '10px', padding: '6px' }}>
          🛡️ Bouclier de Pique : Annuler la pénalité !
        </button>
      );
    }
    if (suit === 'coeur' && penaltyAmount > 0) {
      const otherPlayers = players.filter((pl) => pl.id !== currentPlayer.id);
      return (
        <div style={{ marginTop: '10px', width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '9px', opacity: 0.8, color: '#39ff14', textShadow: '0 0 4px #39ff14' }}>💘 Flèche de Cœur (Transférer les {penaltyAmount} gorgées) :</div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {otherPlayers.map((op) => (
              <button key={op.id} onClick={() => usePlayerPower('coeur', op.id, penaltyAmount)} className="neon-btn" style={{ flex: 1, padding: '4px 6px', fontSize: '9px', borderColor: op.color, color: op.color }}>
                {op.name}
              </button>
            ))}
          </div>
        </div>
      );
    }
    if (suit === 'carreau') {
      return (
        <button onClick={() => usePlayerPower('carreau')} className="neon-btn" style={{ width: '100%', borderColor: '#ff6c00', color: '#ff6c00', marginTop: '10px', boxShadow: '0 0 10px rgba(255, 108, 0, 0.4)', fontSize: '10px', padding: '6px' }}>
          🎲 Turbo Relance (Relancer le dé)
        </button>
      );
    }
    const landedTile = tiles[currentPlayer.position];
    if (suit === 'trefle' && landedTile && landedTile.type === 'bar') {
      return (
        <button onClick={() => usePlayerPower('trefle')} className="neon-btn" style={{ width: '100%', borderColor: '#39ff14', color: '#39ff14', marginTop: '10px', boxShadow: '0 0 10px rgba(57, 255, 20, 0.4)', fontSize: '10px', padding: '6px' }}>
          🌿 Pacte de Trèfle : Acquérir ce bar gratuitement !
        </button>
      );
    }
    return null;
  };

  if (activeScreen === 'setup') {
    return <PlayerSetup onStartGame={startGame} />;
  }

  if (activeScreen === 'reveal') {
    return <RevealCards players={players} onConfirmReveal={confirmReveal} />;
  }

  if (activeScreen === 'gameover') {
    const winner = players.find((p) => (p.laps || 0) >= 3) || players[0];
    const losers = players.filter((p) => p.id !== winner.id);
    
    return (
      <div className="setup-container gameover-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', textAlign: 'center' }}>
        <h1 className="logo-title text-neon-green" style={{ fontSize: '36px', marginBottom: '10px' }}>
          🏁 L'ARRIVÉE ! 🏁
        </h1>
        <p className="logo-subtitle" style={{ fontSize: '18px', color: winner.color, textShadow: `0 0 10px ${winner.color}`, marginBottom: '20px' }}>
          👑 {winner.name} gagne la partie !
        </p>

        <div className="gameover-card" style={{ background: 'rgba(5, 5, 21, 0.6)', border: `2px solid ${winner.color}`, borderRadius: '16px', padding: '24px', margin: '20px 0', maxWidth: '340px', boxShadow: `0 0 15px ${winner.color}`, backdropFilter: 'blur(10px)' }}>
          <h2 style={{ fontSize: '15px', color: '#ff3333', textShadow: '0 0 5px rgba(255, 51, 51, 0.4)', margin: '0 0 12px 0', fontWeight: 800 }}>
            🥃 SENTENCE DE FIN 🥃
          </h2>
          <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#ffffff', opacity: 0.9, margin: '0 0 16px 0' }}>
            Tous les autres joueurs doivent boire <strong>1 SHOT</strong> immédiatement et sans exception !
          </p>
          <div className="losers-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            {losers.map((l) => (
              <div key={l.id} style={{ color: l.color, fontWeight: 700, fontSize: '13px', textShadow: `0 0 4px ${l.color}` }}>
                🥃 {l.name} (Boit 1 Shot)
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => { playClick(); resetGame(); }} className="neon-btn start-btn" style={{ borderColor: winner.color, color: winner.color, boxShadow: `0 0 10px ${winner.color}`, width: '100%', maxWidth: '280px', marginTop: '10px' }}>
          🔄 Nouvelle Partie
        </button>
      </div>
    );
  }


  /**
   * Renders the interactive component in the center of the board.
   */
  const renderCenter = () => {
    const landedTile = tiles[currentPlayer.position];

    // 1. Jail state check
    if (currentPlayer.isPrisoner) {
      return (
        <div className="center-action-card border-neon-red">
          <Shield size={24} color="#ff3333" className="pulse" style={{ marginTop: '2px' }} />
          <h3 className="text-neon-red" style={{ fontSize: '13px', margin: '2px 0' }}>Cellule de Dégrisement</h3>
          <p style={{ fontSize: '10px', marginBottom: '8px' }}>{currentPlayer.name}, tu es trop ivre ! Tu passes ton tour pour cuver ton alcool.</p>
          <div className="center-actions-stack" style={{ gap: '4px' }}>
            <button onClick={() => { playFail(); payJailFine(); }} className="neon-btn red-btn" style={{ fontSize: '9px', padding: '4px' }}>
              Payer Caution (2 Shots / 6G)
            </button>
            <button onClick={() => { playClick(); nextTurn(); }} className="neon-btn" style={{ fontSize: '9px', padding: '4px' }}>
              Passer mon tour
            </button>
          </div>
          {renderSuperPowerButton(6)}
        </div>
      );
    }

    // 2. Card draw view placeholder
    if (activeScreen === 'card') {
      return (
        <div className="center-roll-view">
          <h2>Mystère... 🃏</h2>
          <p>{currentPlayer.name} pioche une carte !</p>
        </div>
      );
    }

    // 3. Bottle spin view
    if (activeScreen === 'bottle') {
      return (
        <BottleSpinner
          players={players}
          currentPlayerId={currentPlayer.id}
          onSpinComplete={resolveBottle}
        />
      );
    }

    // 4. Duo Bottle Spin challenge resolution / Alcootest result
    if (activeScreen === 'minigame') {
      if (landedTile.id === 10) {
        const isPositive = state.activeDuoChallenge?.includes('POSITIF');
        return (
          <div className="center-action-card" style={{ borderColor: landedTile.color }}>
            <AlertTriangle size={24} style={{ color: landedTile.color, marginTop: '2px' }} className="pulse" />
            <h3 style={{ color: landedTile.color, fontSize: '13px', margin: '2px 0' }}>{landedTile.name}</h3>
            <p style={{ fontSize: '10px', marginBottom: '8px' }}>{state.activeDuoChallenge}</p>
            {isPositive ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                <button onClick={() => { playFail(); paySipsAndNextTurn(3); }} className="neon-btn fail-btn" style={{ borderColor: landedTile.color, color: landedTile.color, width: '100%', fontSize: '9px', padding: '4px' }}>
                  Payer 3 gorgées
                </button>
                {renderSuperPowerButton(3)}
              </div>
            ) : (
              <button onClick={() => { playSuccess(); paySipsAndNextTurn(0); }} className="neon-btn success-btn" style={{ borderColor: landedTile.color, color: landedTile.color, width: '100%', fontSize: '9px', padding: '4px' }}>
                Continuer
              </button>
            )}
          </div>
        );
      }

      if (selectedBottleTargetId) {
        const targetPlayer = players.find((p) => p.id === selectedBottleTargetId);
        const targetName = targetPlayer ? targetPlayer.name : 'Adversaire';
        const penalty = state.activeDuoChallenge?.includes('3 gorgées') ? 3 : 2;
        
        return (
          <div className="center-action-card border-neon-green" style={{ height: '100%', justifyContent: 'flex-start', padding: '8px' }}>
            <PartyPopper size={20} color="#39ff14" style={{ marginTop: '2px' }} />
            <h3 className="text-neon-green" style={{ fontSize: '13px', margin: '2px 0' }}>Défi en Duo 🍾</h3>
            <p style={{ fontSize: '10px', marginBottom: '8px', textAlign: 'center', lineHeight: '1.25' }}>{state.activeDuoChallenge}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              <button onClick={() => { playSuccess(); resolveDuoPenalty('none', 0); }} className="neon-btn success-btn" style={{ fontSize: '9px', padding: '4px' }}>
                🤝 Défi Réussi / Personne ne boit
              </button>
              
              <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                <div style={{ flex: 1, padding: '4px', border: '1px solid rgba(57, 255, 20, 0.2)', borderRadius: '6px', background: 'rgba(57, 255, 20, 0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <button onClick={() => { playFail(); resolveDuoPenalty(currentPlayer.id, penalty); }} className="neon-btn fail-btn" style={{ width: '100%', fontSize: '9px', padding: '4px' }}>
                    🍺 {currentPlayer.name}
                  </button>
                  {renderSuperPowerButton(penalty)}
                </div>
                
                <button onClick={() => { playFail(); resolveDuoPenalty(selectedBottleTargetId, penalty); }} className="neon-btn fail-btn" style={{ flex: 1, fontSize: '9px', padding: '4px', borderColor: targetPlayer?.color, color: targetPlayer?.color }}>
                  🍺 {targetName}
                </button>
              </div>
              
              <button onClick={() => { playFail(); resolveDuoPenalty('both', penalty); }} className="neon-btn fail-btn" style={{ fontSize: '9px', padding: '4px' }}>
                🍻 Boire les deux !
              </button>
            </div>
          </div>
        );
      }
    }

    // 5. Standard movement roll button
    if (diceValue === null) {
       return (
        <div className="center-roll-view">
          <h2>Tour de <span style={{ color: currentPlayer.color, textShadow: `0 0 10px ${currentPlayer.color}` }}>{currentPlayer.name}</span></h2>
          <div className="player-turn-laps" style={{ fontSize: '11px', opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', margin: '4px 0 10px' }}>
            🏁 Tours complétés : <strong style={{ color: currentPlayer.color }}>{currentPlayer.laps || 0} / 3</strong>
          </div>
          <DiceRoller playerColor={currentPlayer.color} onRollComplete={rollDice} />
        </div>
      );
    }

    // 6. Handle tile effects after roll
    const hasOwner = landedTile.ownerId !== undefined;
    const isSelfOwned = landedTile.ownerId === currentPlayer.id;

    if (landedTile.type === 'bar') {
      if (isSelfOwned) {
        return (
          <div className="center-action-card" style={{ borderColor: currentPlayer.color }}>
            <Crown size={24} style={{ color: currentPlayer.color }} />
            <h3 style={{ color: currentPlayer.color, fontSize: '13px', margin: '2px 0' }}>{landedTile.name} (Le tien)</h3>
            <p style={{ fontSize: '10px', marginBottom: '6px' }}>Améliore en {landedTile.level === 1 ? "Double Dose 🍹" : "Cul Sec ! 🍻"} ! Défi : {landedTile.description}</p>
            <div className="center-actions-row">
              <button onClick={() => { playSuccess(); resolveBar(true); nextTurn(); }} className="neon-btn success-btn" style={{ fontSize: '10px', padding: '6px' }}>Réussi !</button>
              <button onClick={() => { playFail(); resolveBar(false); nextTurn(); }} className="neon-btn fail-btn" style={{ fontSize: '10px', padding: '6px' }}>Boire</button>
            </div>
            {renderSuperPowerButton(landedTile.price || 3)}
          </div>
        );
      }

      if (hasOwner) {
        const owner = players.find((p) => p.id === landedTile.ownerId)!;
        const rentPrice = (landedTile.level || 1) * 2;
        return (
          <div className="center-action-card" style={{ borderColor: owner.color }}>
            <AlertTriangle size={24} style={{ color: owner.color }} />
            <h3 style={{ color: owner.color, fontSize: '13px', margin: '2px 0' }}>Chez {owner.name} !</h3>
            <p style={{ fontSize: '10px', marginBottom: '6px' }}>Tu es sur sa propriété. Trinque et prends {rentPrice} gorgées de pénalité !</p>
            <button onClick={() => { playFail(); resolveBar(false); nextTurn(); }} className="neon-btn fail-btn" style={{ borderColor: owner.color, color: owner.color, fontSize: '10px', padding: '6px', width: '100%' }}>
              Prendre mes {rentPrice} gorgées
            </button>
            {renderSuperPowerButton(rentPrice)}
          </div>
        );
      }

      // Unowned Bar purchase challenge
      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <Flame size={24} style={{ color: landedTile.color }} />
          <h3 style={{ color: landedTile.color, fontSize: '13px', margin: '2px 0' }}>Acheter {landedTile.name}</h3>
          <p style={{ fontSize: '10px', marginBottom: '6px' }}>{landedTile.description}</p>
          <div className="center-actions-row">
            <button onClick={() => { playSuccess(); resolveBar(true); nextTurn(); }} className="neon-btn success-btn" style={{ fontSize: '10px', padding: '6px' }}>Défi Réussi !</button>
            <button onClick={() => { playFail(); resolveBar(false); nextTurn(); }} className="neon-btn fail-btn" style={{ fontSize: '10px', padding: '6px' }}>Boire</button>
          </div>
          {renderSuperPowerButton(landedTile.price || 3)}
        </div>
      );
    }

    if (landedTile.type === 'goto_prison') {
      return (
        <div className="center-action-card border-neon-red">
          <AlertTriangle size={24} color="#ff3333" className="bounce" style={{ marginTop: '2px' }} />
          <h3 className="text-neon-red" style={{ fontSize: '13px', margin: '2px 0' }}>Direct en Dégrisement !</h3>
          <p style={{ fontSize: '10px', marginBottom: '8px' }}>Tu as trop bu, les videurs te jettent en cellule !</p>
          <button onClick={() => { playFail(); sendToJail(currentPlayer.id); nextTurn(); }} className="neon-btn red-btn" style={{ width: '100%', fontSize: '10px', padding: '6px' }}>
            Aller en Cellule
          </button>
          {renderSuperPowerButton(0)}
        </div>
      );
    }

    // Custom Obstacle render for L'Énigme de l'Apéro (case 6)
    if (landedTile.id === 6) {
      if (!selectedBottleTargetId) {
        const otherPlayers = players.filter((p) => p.id !== currentPlayer.id);
        return (
          <div className="center-action-card" style={{ borderColor: landedTile.color }}>
            <PartyPopper size={24} style={{ color: landedTile.color }} />
            <h3 style={{ color: landedTile.color, fontSize: '13px', margin: '2px 0' }}>{landedTile.name}</h3>
            <p style={{ fontSize: '10px', marginBottom: '6px' }}>{landedTile.description}</p>
            <div style={{ fontSize: '9px', opacity: 0.8, marginBottom: '4px' }}>Choisis ta cible pour l'énigme :</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', width: '100%' }}>
              {otherPlayers.map((op) => (
                <button key={op.id} onClick={() => { playClick(); selectTargetPlayer(op.id); }} className="neon-btn" style={{ flex: 1, padding: '4px 6px', fontSize: '9px', borderColor: op.color, color: op.color }}>
                  {op.name}
                </button>
              ))}
            </div>
          </div>
        );
      } else {
        const targetPlayer = players.find((p) => p.id === selectedBottleTargetId);
        const targetName = targetPlayer ? targetPlayer.name : 'Adversaire';
        return (
          <div className="center-action-card" style={{ borderColor: landedTile.color }}>
            <PartyPopper size={24} style={{ color: landedTile.color }} />
            <h3 style={{ color: landedTile.color, fontSize: '13px', margin: '2px 0' }}>{landedTile.name}</h3>
            <p style={{ fontSize: '10px', marginBottom: '6px' }}>Énigme posée à <strong>{targetName}</strong> ! A-t-il trouvé la réponse ?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
              <div style={{ padding: '4px', border: '1px solid rgba(0, 255, 255, 0.2)', borderRadius: '6px', background: 'rgba(0, 255, 255, 0.02)', display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => { playFail(); resolveDuoPenalty(currentPlayer.id, 3); }} className="neon-btn fail-btn" style={{ width: '100%', fontSize: '9px', padding: '4px' }}>
                  💡 Réussi (+3 Gor. pour toi, {currentPlayer.name})
                </button>
                {renderSuperPowerButton(3)}
              </div>
              <button onClick={() => { playFail(); resolveDuoPenalty(selectedBottleTargetId, 3); }} className="neon-btn fail-btn" style={{ fontSize: '9px', padding: '4px', borderColor: targetPlayer?.color, color: targetPlayer?.color }}>
                ❌ Échoué (+3 Gor. pour {targetName})
              </button>
            </div>
          </div>
        );
      }
    }
    if (landedTile.id === 10) {
      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <AlertTriangle size={24} style={{ color: landedTile.color, marginTop: '2px' }} className="pulse" />
          <h3 style={{ color: landedTile.color, fontSize: '13px', margin: '2px 0' }}>{landedTile.name}</h3>
          <p style={{ fontSize: '10px', marginBottom: '6px' }}>{landedTile.description}</p>
          <button onClick={() => { playClick(); resolveAlcootest(); }} className="neon-btn" style={{ borderColor: landedTile.color, color: landedTile.color, boxShadow: `0 0 10px ${landedTile.color}`, width: '100%', fontSize: '10px', padding: '6px' }}>
            🧪 Souffler dans le Ballon
          </button>
          {renderSuperPowerButton(0)}
        </div>
      );
    }

    // Custom Obstacle render for Radar de Vitesse (case 3)
    if (landedTile.id === 3) {
      const isFlashed = diceValue !== null && diceValue >= 4;
      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <AlertTriangle size={24} style={{ color: landedTile.color, marginTop: '2px' }} className="bounce" />
          <h3 style={{ color: landedTile.color, fontSize: '13px', margin: '2px 0' }}>{landedTile.name}</h3>
          <p style={{ fontSize: '10px', marginBottom: '6px' }}>{landedTile.description}</p>
          {isFlashed ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
              <button onClick={() => { playFail(); paySipsAndNextTurn(3); }} className="neon-btn fail-btn" style={{ borderColor: landedTile.color, color: landedTile.color, width: '100%', fontSize: '10px', padding: '6px' }}>
                Payer 3 gorgées d'amende
              </button>
              {renderSuperPowerButton(3)}
            </div>
          ) : (
            <button onClick={() => { playSuccess(); paySipsAndNextTurn(0); }} className="neon-btn success-btn" style={{ borderColor: landedTile.color, color: landedTile.color, width: '100%', fontSize: '10px', padding: '6px' }}>
              Continuer sans amende
            </button>
          )}
        </div>
      );
    }

    // Default fall-through for start, taxes, general mini-games and chill tiles
    const isTax = landedTile.type === 'tax';
    return (
      <div className="center-action-card" style={{ borderColor: landedTile.color }}>
        {isTax ? <GlassWater size={24} style={{ color: landedTile.color }} /> : <PartyPopper size={24} style={{ color: landedTile.color }} />}
        <h3 style={{ color: landedTile.color, fontSize: '13px', margin: '2px 0' }}>{landedTile.name}</h3>
        <p style={{ fontSize: '10px', marginBottom: '6px' }}>{landedTile.description}</p>
        {isTax ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginTop: '4px' }}>
            <div style={{ padding: '4px', border: '1px solid rgba(255, 255, 0, 0.15)', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 0, 0.03)', display: 'flex', flexDirection: 'column' }}>
              <button onClick={() => { playFail(); paySipsAndNextTurn(4); }} className="neon-btn fail-btn" style={{ borderColor: landedTile.color, color: landedTile.color, width: '100%', fontSize: '9px', padding: '4px' }}>
                Option A : Payer 4 gorgées 💸
              </button>
              {renderSuperPowerButton(4)}
            </div>
            
            <div style={{ padding: '4px', border: '1px solid rgba(255, 255, 0, 0.15)', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 0, 0.03)', display: 'flex', flexDirection: 'column' }}>
              <button onClick={() => { playFail(); paySipsAndNextTurn(6); }} className="neon-btn fail-btn" style={{ borderColor: landedTile.color, color: landedTile.color, width: '100%', fontSize: '9px', padding: '4px' }}>
                Option B : Faire Cul sec ! 🍻
              </button>
              {renderSuperPowerButton(6)}
            </div>
          </div>
        ) : landedTile.id === 15 ? (
          <div style={{ padding: '4px', border: '1px solid rgba(0, 255, 255, 0.15)', borderRadius: '8px', backgroundColor: 'rgba(0, 255, 255, 0.03)', width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button onClick={() => { playSuccess(); resolveTourneeGenerale(); }} className="neon-btn success-btn" style={{ borderColor: landedTile.color, color: landedTile.color, width: '100%', fontSize: '10px', padding: '4px' }}>
              🍻 Tout le monde boit 1 gorgée
            </button>
            {renderSuperPowerButton(1)}
          </div>
        ) : (
          <button onClick={() => { playClick(); nextTurn(); }} className="neon-btn" style={{ borderColor: landedTile.color, color: landedTile.color, width: '100%', fontSize: '10px', padding: '6px' }}>
            Suivant
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="game-layout">
      {/* En-tête de jeu avec bouton Menu */}
      <div className="game-header">
        <h1 className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Alcooly <Beer size={22} className="text-neon-blue" style={{ filter: 'drop-shadow(0 0 5px var(--neon-blue))' }} />
        </h1>
        <button
          onClick={() => { playClick(); setShowDashboard(true); }}
          className="neon-btn menu-trigger-btn"
          id="menu-btn"
        >
          <Menu size={16} />
          <span>Menu</span>
        </button>
      </div>

      {/* Main Board view */}
      <div className="board-container">
        <Board
          tiles={tiles}
          players={players}
          currentPlayerIndex={currentPlayerIndex}
          centerComponent={renderCenter()}
        />
      </div>

      {/* Card Drawer Modal Overlay */}
      {activeScreen === 'card' && activeCard && (
        <div className="modal-backdrop">
          <CardDrawer
            card={activeCard}
            playerName={currentPlayer.name}
            playerColor={currentPlayer.color}
            onActionComplete={resolveCard}
            powerButton={renderSuperPowerButton(activeCard.penalty)}
          />
        </div>
      )}

      {/* Tableau de Bord Modal */}
      {showDashboard && (
        <div className="modal-backdrop dashboard-modal" id="dashboard-modal">
          <div className="dashboard-content">
            <div className="dashboard-header">
              <h2>📊 Tableau de Bord</h2>
              <button
                onClick={() => { playClick(); setShowDashboard(false); }}
                className="close-modal-btn"
                id="close-menu-btn"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="dashboard-body">
              <div className="sidebar-section">
                <h3>
                  <Users size={18} /> Joueurs
                </h3>
                <div className="players-scores">
                  {players.map((p, idx) => (
                    <div
                      key={p.id}
                      className={`player-score-badge ${currentPlayerIndex === idx ? 'active' : ''}`}
                      style={{
                        borderColor: p.color,
                        boxShadow: currentPlayerIndex === idx ? `0 0 10px ${p.color}` : 'none',
                      }}
                    >
                      <div className="player-score-header" style={{ color: p.color }}>
                        <span>{p.name} {p.card ? `[${p.card.cardValue} ${getSuitSymbol(p.card.suit)}]` : ''}</span>
                        {p.isPrisoner && <Shield size={12} color="#ff3333" />}
                      </div>
                      <div className="player-score-stats">
                        <span>🍺 {p.sipsCount} Gor.</span>
                        <span>🏆 {p.challengesCompleted} déf.</span>
                        <span>🏁 {p.laps || 0}/3 trs</span>
                        <span style={{ color: p.powerUsed ? '#777777' : '#ffea00', textShadow: p.powerUsed ? 'none' : '0 0 5px #ffea00', fontWeight: 600 }}>
                          {p.powerUsed ? '❌ Pouvoir' : '⚡ Pouvoir'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sidebar-section log-section">
                <h3>
                  <Trophy size={18} /> Historique
                </h3>
                <div className="logs-container">
                  {logMessages.map((msg, idx) => (
                    <div key={idx} className="log-message">
                      {msg}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="dashboard-footer">
              <button
                onClick={() => {
                  if (window.confirm("Voulez-vous réinitialiser la partie ?")) {
                    resetGame();
                    setShowDashboard(false);
                  }
                }}
                className="neon-btn reset-btn"
                id="reset-btn"
              >
                🔄 Nouvelle Partie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;




