import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { PlayerSetup } from './components/PlayerSetup';
import { Board } from './components/Board';
import { DiceRoller } from './components/DiceRoller';
import { CardDrawer } from './components/CardDrawer';
import { playClick, playFail, playSuccess } from './utils/audio';
import { BottleSpinner } from './components/BottleSpinner';
import { RevealCards } from './components/RevealCards';
import { Shield, AlertTriangle, Users, GlassWater, Flame, Menu, X, Beer, Crown, Trophy, PartyPopper } from 'lucide-react';
import { BAR_SCENARIOS, DUO_CHALLENGES } from './gameData';
import type { Player } from './types';

/**
 * Main App Component.
 * Integrates game state hooks and handles sub-screen routing (setup, board, card flip, bottle spin).
 */
function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [interactiveChoices, setInteractiveChoices] = useState<Record<string, any>>({});
  const {
    state,
    startGame,
    confirmReveal,
    rollDice,
    resolveCard,
    resolveBottle,
    resolveBar,
    resolveBarScenario,
    payJailFine,
    tryJailRoll,
    resolveJailRollResult,
    returnToStartFromJail,
    nextTurn,
    sendToJail,
    usePlayerPower,
    resolveAlcootest,
    paySipsAndNextTurn,
    resolveDuoPenalty,
    resolveTourneeGenerale,
    selectTargetPlayer,
    acceptTransfer,
    refuseTransfer,
    resetGame,
  } = useGameState();

  const {
    players,
    currentPlayerIndex,
    tiles,
    activeCard,
    activeScreen,
    selectedBottleTargetId,
    diceValue,
    logMessages,
    activeBarScenario,
    barScenarioTargetIds,
    barScenarioStage,
    pendingTransfer,
  } = state;

  useEffect(() => {
    if (state.activeScreen === 'minigame' && state.activeDuoChallenge) {
      const initial: Record<string, string> = {};
      const activePlayer = state.players[state.currentPlayerIndex];
      if (activePlayer && state.selectedBottleTargetId) {
        initial[activePlayer.id] = 'gagne';
        initial[state.selectedBottleTargetId] = 'gagne';
      }
      setInteractiveChoices(initial);
    } else if (state.activeBarScenario !== undefined) {
      const initial: Record<string, string> = {};
      if (state.activeBarScenario === 3) {
        state.players.forEach(pl => { initial[pl.id] = 'montre'; });
      } else if (state.activeBarScenario === 22) {
        state.players.forEach(pl => { initial[pl.id] = 'success'; });
      } else if (state.activeBarScenario === 7) {
        const p1Id = state.barScenarioTargetIds?.[0];
        const p2Id = state.barScenarioTargetIds?.[1];
        if (p1Id) initial[p1Id] = 'bisou';
        if (p2Id) initial[p2Id] = 'bisou';
      } else if (state.activeBarScenario === 5) {
        const winner = state.players[state.currentPlayerIndex];
        if (winner) {
          initial['winnerId'] = winner.id;
          state.players.forEach(pl => {
            if (pl.id !== winner.id) initial[pl.id] = 'sip';
          });
        }
      }
      setInteractiveChoices(initial);
    } else {
      setInteractiveChoices({});
    }
  }, [state.activeScreen, state.activeBarScenario, state.activeDuoChallenge, state.activeCard?.id, state.selectedBottleTargetId, state.currentPlayerIndex, state.players, state.barScenarioTargetIds]);

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
        <button onClick={() => usePlayerPower('pique')} className="neon-btn" style={{ width: '100%', borderColor: '#ff007f', color: '#ff007f', marginTop: '10px', boxShadow: '0 0 10px rgba(255, 0, 127, 0.4)' }}>
          🛡️ Bouclier de Pique : Annuler la pénalité !
        </button>
      );
    }
    if (suit === 'coeur' && penaltyAmount > 0) {
      const otherPlayers = players.filter((pl) => pl.id !== currentPlayer.id);
      return (
        <div style={{ marginTop: '10px', width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ opacity: 0.8, color: '#39ff14', textShadow: '0 0 4px #39ff14' }}>💘 Flèche de Cœur (Transférer les {penaltyAmount} gorgées) :</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            {otherPlayers.map((op) => (
              <button key={op.id} onClick={() => usePlayerPower('coeur', op.id, penaltyAmount)} className="neon-btn" style={{ borderColor: op.color, color: op.color }}>
                {op.name} {op.card ? `(${getSuitSymbol(op.card.suit)})` : ''}
              </button>
            ))}
          </div>
        </div>
      );
    }
    if (suit === 'carreau') {
      return (
        <button onClick={() => usePlayerPower('carreau')} className="neon-btn" style={{ width: '100%', borderColor: '#ff6c00', color: '#ff6c00', marginTop: '10px', boxShadow: '0 0 10px rgba(255, 108, 0, 0.4)' }}>
          🎲 Turbo Relance (Relancer le dé)
        </button>
      );
    }
    const landedTile = tiles[currentPlayer.position];
    if (suit === 'trefle' && landedTile && landedTile.type === 'bar') {
      return (
        <button onClick={() => usePlayerPower('trefle')} className="neon-btn" style={{ width: '100%', borderColor: '#39ff14', color: '#39ff14', marginTop: '10px', boxShadow: '0 0 10px rgba(57, 255, 20, 0.4)' }}>
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
    const winner = players.find((p) => (p.laps || 0) >= 1) || players[0];
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


  const getDuoChallengeConfig = (idNum: number) => {
    if ([4, 6, 12, 16, 21].includes(idNum)) return { sips: 2, recul: 2 };
    if ([7, 9, 10, 11, 17, 19, 20, 23, 24].includes(idNum)) return { sips: 2, recul: 3 };
    if ([5, 13, 14].includes(idNum)) return { sips: 2, recul: 4 };
    if ([2, 8, 18, 22, 25].includes(idNum)) return { sips: 3, recul: 4 };
    return { sips: 2, recul: 3 };
  };

  const renderDuoChallengeBody = (challengeId: number, targetPlayer: Player | undefined, _targetName: string) => {
    if (!targetPlayer) return null;

    if (challengeId === 15) {
      return (
        <button onClick={() => { playSuccess(); resolveDuoPenalty('none', 0); }} className="neon-btn success-btn" style={{ width: '100%', marginTop: '10px' }}>
          Valider
        </button>
      );
    }

    if (challengeId === 3) {
      const allFilled = players.every(pl => interactiveChoices[pl.id] !== undefined);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px', marginBottom: '8px' }}>
            {players.map((pl) => {
              const choice = interactiveChoices[pl.id];
              return (
                <div key={pl.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}>
                  <span style={{ color: pl.color, fontSize: '12px', fontWeight: 600 }}>
                    {pl.name}
                    {pl.card && (
                      <span style={{ marginLeft: '4px', opacity: 0.75, fontSize: '10px', padding: '1px 4px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', background: 'rgba(255,255,255,0.03)' }}>
                        {pl.card.cardValue}{getSuitSymbol(pl.card.suit)}
                      </span>
                    )}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'rigole' })); }}
                      className={`neon-btn ${choice === 'rigole' ? 'choice-fail-active' : ''}`}
                      style={{ padding: '4px 6px', fontSize: '9px' }}
                    >
                      Rigole (6G)
                    </button>
                    <button
                      onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'non_rigole' })); }}
                      className={`neon-btn ${choice === 'non_rigole' ? 'choice-success-active' : ''}`}
                      style={{ padding: '4px 6px', fontSize: '9px' }}
                    >
                      Ne rigole pas
                    </button>
                    <button
                      onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'depart' })); }}
                      className={`neon-btn ${choice === 'depart' ? 'choice-fail-active' : ''}`}
                      style={{ padding: '4px 6px', fontSize: '9px' }}
                    >
                      DÉPART 🏁
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            disabled={!allFilled}
            onClick={() => {
              const sips: Record<string, number> = {};
              const movements: Record<string, any> = {};
              players.forEach((pl) => {
                const choice = interactiveChoices[pl.id];
                if (choice === 'rigole') {
                  sips[pl.id] = 6;
                } else if (choice === 'depart') {
                  movements[pl.id] = { position: 0 };
                }
              });
              resolveDuoPenalty('none', 0, { sips, movements });
            }}
            className="neon-btn success-btn"
            style={{ width: '100%' }}
          >
            Valider le Défi
          </button>
        </div>
      );
    }
    const config = getDuoChallengeConfig(challengeId);
    const duoPlayers = [currentPlayer, targetPlayer].filter(Boolean) as Player[];
    const allFilled = duoPlayers.every(pl => interactiveChoices[pl.id] !== undefined);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginBottom: '8px' }}>
          {duoPlayers.map((pl) => {
            const choice = interactiveChoices[pl.id];
            return (
              <div key={pl.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}>
                <span style={{ color: pl.color, fontSize: '12px', fontWeight: 600 }}>
                  {pl.name}
                  {pl.card && (
                    <span style={{ marginLeft: '4px', opacity: 0.75, fontSize: '10px', padding: '1px 4px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', background: 'rgba(255,255,255,0.03)' }}>
                      {pl.card.cardValue}{getSuitSymbol(pl.card.suit)}
                    </span>
                  )}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'gagne' })); }}
                    className={`neon-btn ${choice === 'gagne' ? 'choice-success-active' : ''}`}
                    style={{ padding: '4px 6px', fontSize: '10px' }}
                  >
                    🏆 Gagné
                  </button>
                  <button
                    onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'sip' })); }}
                    className={`neon-btn ${choice === 'sip' ? 'choice-fail-active' : ''}`}
                    style={{ padding: '4px 6px', fontSize: '10px' }}
                  >
                    Boire {config.sips}G 🍺
                  </button>
                  <button
                    onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'recul' })); }}
                    className={`neon-btn ${choice === 'recul' ? 'choice-fail-active' : ''}`}
                    style={{ padding: '4px 6px', fontSize: '10px' }}
                  >
                    Reculer {config.recul}C ⬅️
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          disabled={!allFilled}
          onClick={() => {
            const sips: Record<string, number> = {};
            const movements: Record<string, any> = {};
            duoPlayers.forEach((pl) => {
              const choice = interactiveChoices[pl.id];
              if (choice === 'sip') {
                sips[pl.id] = config.sips;
              } else if (choice === 'recul') {
                movements[pl.id] = { recul: config.recul };
              }
            });
            resolveDuoPenalty('none', 0, { sips, movements });
          }}
          className="neon-btn success-btn"
          style={{ width: '100%' }}
        >
          Valider le Défi
        </button>
      </div>
    );
  };


  /**
   * Renders UI for random interactive bar scenarios (Part 1: Scenarios 1-4).
   */
  const renderBarScenarioUI = (scenarioNum: number) => {
    const landedTile = tiles[currentPlayer.position];
    const scenario = BAR_SCENARIOS.find((s) => s.id === scenarioNum);
    if (!scenario) return null;

    if (scenarioNum === 1) {
      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <Crown size={22} style={{ color: landedTile.color }} />
          <h3 style={{ margin: '2px 0' }}>{scenario.title}</h3>
          <p style={{ marginBottom: '8px', lineHeight: '1.2' }}>{scenario.description}</p>
          <div className="center-actions-row">
            <button onClick={() => { playSuccess(); resolveBarScenario('success'); }} className="neon-btn success-btn">💋 Réussi (Acheter)</button>
            <button onClick={() => { playFail(); resolveBarScenario('fail', { penalty: 6 }); }} className="neon-btn fail-btn">🍺 Couples Cul Sec</button>
          </div>
        </div>
      );
    }

    if (scenarioNum === 2) {
      return (
        <div className="center-action-card border-neon-red">
          <AlertTriangle size={20} className="pulse" color="#ff3333" />
          <h3 style={{ margin: '2px 0' }} className="text-neon-red">{scenario.title}</h3>
          <p style={{ marginBottom: '6px', lineHeight: '1.2' }}>{scenario.description}</p>
          <div style={{ opacity: 0.8, marginBottom: '6px' }}>Qui est le plus jeune ?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            {players.map((p) => (
              <div key={p.id} style={{ display: 'flex', gap: '6px', width: '100%' }}>
                <button onClick={() => { playSuccess(); resolveBarScenario('youngest_success', { youngestId: p.id }); }} className="neon-btn success-btn" style={{ flex: 1, borderColor: p.color, color: p.color }}>
                  🍺 {p.name} boit
                </button>
                <button onClick={() => { playFail(); resolveBarScenario('youngest_fail', { youngestId: p.id }); }} className="neon-btn fail-btn" style={{ flex: 1 }}>
                  ↩️ DÉPART
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (scenarioNum === 3) {
      const allFilled = players.every((pl) => interactiveChoices[pl.id] !== undefined);
      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <Flame size={20} style={{ color: landedTile.color }} />
          <h3 style={{ margin: '2px 0' }}>{scenario.title}</h3>
          <p style={{ marginBottom: '8px', lineHeight: '1.2', fontSize: '12px' }}>{scenario.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px', marginBottom: '8px' }}>
            {players.map((pl) => {
              const choice = interactiveChoices[pl.id];
              return (
                <div key={pl.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}>
                  <span style={{ color: pl.color, fontSize: '12px', fontWeight: 600 }}>
                    {pl.name}
                    {pl.card && (
                      <span style={{ marginLeft: '4px', opacity: 0.75, fontSize: '10px', padding: '1px 4px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', background: 'rgba(255,255,255,0.03)' }}>
                        {pl.card.cardValue}{getSuitSymbol(pl.card.suit)}
                      </span>
                    )}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'montre' })); }}
                      className={`neon-btn ${choice === 'montre' ? 'choice-success-active' : ''}`}
                      style={{ padding: '4px 6px', fontSize: '10px' }}
                    >
                      🩲 Montré
                    </button>
                    <button
                      onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'sip' })); }}
                      className={`neon-btn ${choice === 'sip' ? 'choice-fail-active' : ''}`}
                      style={{ padding: '4px 6px', fontSize: '10px' }}
                    >
                      Boire 3G 🍺
                    </button>
                    <button
                      onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'recul' })); }}
                      className={`neon-btn ${choice === 'recul' ? 'choice-fail-active' : ''}`}
                      style={{ padding: '4px 6px', fontSize: '10px' }}
                    >
                      DÉPART 🏁
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            disabled={!allFilled}
            onClick={() => {
              const sips: Record<string, number> = {};
              const movements: Record<string, any> = {};
              let allMontre = true;
              players.forEach((pl) => {
                const choice = interactiveChoices[pl.id];
                if (choice === 'sip') {
                  sips[pl.id] = 3;
                  allMontre = false;
                } else if (choice === 'recul') {
                  movements[pl.id] = { position: 0 };
                  allMontre = false;
                }
              });
              resolveBarScenario('resolve_custom', {
                buy: allMontre,
                sips,
                movements,
                log: allMontre
                  ? `🏢 ${currentPlayer.name} achète ${landedTile.name} car tout le monde a montré son slip !`
                  : `🩲 Défi slip : pénalités appliquées pour ceux qui ont refusé !`
              });
            }}
            className="neon-btn success-btn"
            style={{ width: '100%' }}
          >
            Valider le Défi
          </button>
        </div>
      );
    }

    if (scenarioNum === 4) {
      const targetId = barScenarioTargetIds?.[0];
      const targetPlayer = players.find((p) => p.id === targetId);
      const targetName = targetPlayer ? targetPlayer.name : "Quelqu'un";
      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <Users size={20} style={{ color: landedTile.color }} />
          <h3 style={{ margin: '2px 0' }}>{scenario.title}</h3>
          <p style={{ marginBottom: '8px', lineHeight: '1.2', fontSize: '13px' }}>
            {scenario.description.replace("Un joueur aléatoire indiqué par l'application", targetName)}
          </p>
          <div className="center-actions-stack" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <button
              onClick={() => {
                if (targetId) {
                  playSuccess();
                  resolveBarScenario('resolve_custom', {
                    buy: true,
                    sips: { [targetId]: 4 },
                    log: `🎯 ${targetName} a bu 4 gorgées ! ${currentPlayer.name} achète ${landedTile.name} !`
                  });
                }
              }}
              className="neon-btn success-btn"
              style={{ width: '100%', borderColor: targetPlayer?.color, color: targetPlayer?.color }}
            >
              🍺 {targetName} boit 4G (Acheter)
            </button>
            <button
              onClick={() => {
                if (targetId) {
                  playFail();
                  resolveBarScenario('resolve_custom', {
                    buy: false,
                    movements: { [targetId]: { recul: 3 } },
                    log: `❌ ${targetName} a refusé et recule de 3 cases ! ${currentPlayer.name} n'achète pas ${landedTile.name}.`
                  });
                }
              }}
              className="neon-btn fail-btn"
              style={{ width: '100%' }}
            >
              ↩️ {targetName} recule de 3 cases (Refuser)
            </button>
          </div>
        </div>
      );
    }

    if (scenarioNum === 5) {
      const winnerId = interactiveChoices['winnerId'];
      const otherPlayers = players.filter(pl => pl.id !== winnerId);
      const allFilled = winnerId !== undefined && otherPlayers.every(pl => interactiveChoices[pl.id] !== undefined);

      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <Crown size={20} style={{ color: landedTile.color }} />
          <h3 style={{ margin: '2px 0' }}>{scenario.title}</h3>
          <p style={{ marginBottom: '8px', lineHeight: '1.2', fontSize: '12px' }}>{scenario.description}</p>
          
          <div style={{ marginBottom: '8px', width: '100%' }}>
            <span style={{ fontSize: '11px', opacity: 0.8 }}>Sélectionnez le Gagnant :</span>
            <select
              value={winnerId || ''}
              onChange={(e) => {
                playClick();
                const newWinner = e.target.value;
                setInteractiveChoices(prev => {
                  const copy: Record<string, any> = { ...prev, winnerId: newWinner };
                  players.forEach(pl => {
                    if (pl.id !== newWinner) copy[pl.id] = 'sip';
                    else delete copy[pl.id];
                  });
                  return copy;
                });
              }}
              className="setup-select"
              style={{ width: '100%', padding: '6px', fontSize: '12px', background: '#050515', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', marginTop: '4px' }}
            >
              <option value="">-- Choisir le gagnant --</option>
              {players.map(pl => (
                <option key={pl.id} value={pl.id}>
                  {pl.name} {pl.card ? `[${pl.card.cardValue} ${getSuitSymbol(pl.card.suit)}]` : ''}
                </option>
              ))}
            </select>
          </div>

          {winnerId && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', maxHeight: '140px', overflowY: 'auto', paddingRight: '4px', marginBottom: '8px' }}>
              {otherPlayers.map((pl) => {
                const choice = interactiveChoices[pl.id];
                return (
                  <div key={pl.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}>
                    <span style={{ color: pl.color, fontSize: '12px', fontWeight: 600 }}>
                      {pl.name}
                      {pl.card && (
                        <span style={{ marginLeft: '4px', opacity: 0.75, fontSize: '10px', padding: '1px 4px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', background: 'rgba(255,255,255,0.03)' }}>
                          {pl.card.cardValue}{getSuitSymbol(pl.card.suit)}
                        </span>
                      )}
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'sip' })); }}
                        className={`neon-btn ${choice === 'sip' ? 'choice-fail-active' : ''}`}
                        style={{ padding: '4px 6px', fontSize: '10px' }}
                      >
                        Boire 2G 🍺
                      </button>
                      <button
                        onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'recul' })); }}
                        className={`neon-btn ${choice === 'recul' ? 'choice-fail-active' : ''}`}
                        style={{ padding: '4px 6px', fontSize: '10px' }}
                      >
                        Reculer 2C ⬅️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            disabled={!allFilled}
            onClick={() => {
              const sips: Record<string, number> = {};
              const movements: Record<string, any> = {};
              otherPlayers.forEach((pl) => {
                const choice = interactiveChoices[pl.id];
                if (choice === 'sip') {
                  sips[pl.id] = 2;
                } else if (choice === 'recul') {
                  movements[pl.id] = { recul: 2 };
                }
              });
              const winnerName = players.find(p => p.id === winnerId)?.name || '';
              resolveBarScenario('resolve_custom', {
                buy: true,
                sips,
                movements,
                log: `🏢 ${currentPlayer.name} achète ${landedTile.name} ! ${winnerName} a gagné, les autres reçoivent leurs pénalités !`
              });
            }}
            className="neon-btn success-btn"
            style={{ width: '100%' }}
          >
            Valider le Défi
          </button>
        </div>
      );
    }

    if (scenarioNum === 6) {
      const showChoices = interactiveChoices['success'] !== undefined;
      const isSuccess = interactiveChoices['success'] === true;
      const otherPlayers = players.filter(pl => pl.id !== currentPlayer.id);
      const targetPlayers = isSuccess ? otherPlayers : players;
      const allFilled = targetPlayers.every(pl => interactiveChoices[pl.id] !== undefined);

      if (showChoices) {
        return (
          <div className="center-action-card" style={{ borderColor: landedTile.color }}>
            <GlassWater size={20} style={{ color: landedTile.color }} />
            <h3 style={{ margin: '2px 0' }}>{scenario.title}</h3>
            <p style={{ marginBottom: '8px', fontSize: '11px', lineHeight: '1.2' }}>
              {isSuccess ? "Choisissez la sentence pour chaque perdant :" : "Choisissez la sentence pour tout le monde (Échec) :"}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', maxHeight: '150px', overflowY: 'auto', paddingRight: '4px', marginBottom: '8px' }}>
              {targetPlayers.map((pl) => {
                const choice = interactiveChoices[pl.id];
                return (
                  <div key={pl.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}>
                    <span style={{ color: pl.color, fontSize: '12px', fontWeight: 600 }}>
                      {pl.name}
                      {pl.card && (
                        <span style={{ marginLeft: '4px', opacity: 0.75, fontSize: '10px', padding: '1px 4px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', background: 'rgba(255,255,255,0.03)' }}>
                          {pl.card.cardValue}{getSuitSymbol(pl.card.suit)}
                        </span>
                      )}
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'sec' })); }}
                        className={`neon-btn ${choice === 'sec' ? 'choice-fail-active' : ''}`}
                        style={{ padding: '4px 6px', fontSize: '10px' }}
                      >
                        Cul Sec 🍺
                      </button>
                      <button
                        onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'depart' })); }}
                        className={`neon-btn ${choice === 'depart' ? 'choice-fail-active' : ''}`}
                        style={{ padding: '4px 6px', fontSize: '10px' }}
                      >
                        DÉPART 🏁
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              disabled={!allFilled}
              onClick={() => {
                const sips: Record<string, number> = {};
                const movements: Record<string, any> = {};
                targetPlayers.forEach((pl) => {
                  const choice = interactiveChoices[pl.id];
                  if (choice === 'sec') {
                    sips[pl.id] = 6;
                  } else if (choice === 'depart') {
                    movements[pl.id] = { position: 0 };
                  }
                });
                resolveBarScenario('resolve_custom', {
                  buy: true,
                  sips,
                  movements,
                  log: isSuccess
                    ? `🏢 ${currentPlayer.name} achète ${landedTile.name} ! Les perdants prennent leurs sentences.`
                    : `🏢 ${currentPlayer.name} achète ${landedTile.name} ! Tout le monde a échoué et prend sa sentence.`
                });
              }}
              className="neon-btn success-btn"
              style={{ width: '100%' }}
            >
              Valider les sentences
            </button>
          </div>
        );
      }

      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <GlassWater size={20} style={{ color: landedTile.color }} />
          <h3 style={{ margin: '2px 0' }}>{scenario.title}</h3>
          <p style={{ marginBottom: '8px', lineHeight: '1.2' }}>{scenario.description}</p>
          <div className="center-actions-row">
            <button
              onClick={() => {
                playClick();
                setInteractiveChoices(prev => {
                  const copy: Record<string, any> = { ...prev, success: true };
                  otherPlayers.forEach(pl => { copy[pl.id] = 'sec'; });
                  return copy;
                });
              }}
              className="neon-btn success-btn"
            >
              👅 Réussi (Acheter)
            </button>
            <button
              onClick={() => {
                playClick();
                setInteractiveChoices(prev => {
                  const copy: Record<string, any> = { ...prev, success: false };
                  players.forEach(pl => { copy[pl.id] = 'sec'; });
                  return copy;
                });
              }}
              className="neon-btn fail-btn"
            >
              ❌ Personne n'a réussi
            </button>
          </div>
        </div>
      );
    }

    if (scenarioNum === 7) {
      const p1Id = barScenarioTargetIds?.[0];
      const p2Id = barScenarioTargetIds?.[1];
      const p1 = players.find((p) => p.id === p1Id);
      const p2 = players.find((p) => p.id === p2Id);
      if (!p1 || !p2) return null;

      const choice1 = interactiveChoices[p1.id];
      const choice2 = interactiveChoices[p2.id];
      const allFilled = choice1 !== undefined && choice2 !== undefined;

      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <PartyPopper size={20} style={{ color: landedTile.color }} />
          <h3 style={{ margin: '2px 0' }}>{scenario.title}</h3>
          <p style={{ marginBottom: '8px', lineHeight: '1.2', fontSize: '13px' }}>
            <strong>{p1.name}</strong> et <strong>{p2.name}</strong> se font des bisous sur le front !
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginBottom: '8px' }}>
            {/* Player 1 Choice */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}>
              <span style={{ color: p1.color, fontSize: '12px', fontWeight: 600 }}>{p1.name}</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [p1.id]: 'bisou' })); }}
                  className={`neon-btn ${choice1 === 'bisou' ? 'success-btn' : ''}`}
                  style={{ padding: '4px 6px', fontSize: '10px' }}
                >
                  😘 Bisou
                </button>
                <button
                  onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [p1.id]: 'recul' })); }}
                  className={`neon-btn ${choice1 === 'recul' ? 'fail-btn' : ''}`}
                  style={{ padding: '4px 6px', fontSize: '10px' }}
                >
                  Reculer 2C ⬅️
                </button>
              </div>
            </div>
            {/* Player 2 Choice */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}>
              <span style={{ color: p2.color, fontSize: '12px', fontWeight: 600 }}>{p2.name}</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [p2.id]: 'bisou' })); }}
                  className={`neon-btn ${choice2 === 'bisou' ? 'success-btn' : ''}`}
                  style={{ padding: '4px 6px', fontSize: '10px' }}
                >
                  😘 Bisou
                </button>
                <button
                  onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [p2.id]: 'recul' })); }}
                  className={`neon-btn ${choice2 === 'recul' ? 'fail-btn' : ''}`}
                  style={{ padding: '4px 6px', fontSize: '10px' }}
                >
                  Reculer 2C ⬅️
                </button>
              </div>
            </div>
          </div>

          <button
            disabled={!allFilled}
            onClick={() => {
              const movements: Record<string, any> = {};
              let success = true;
              if (choice1 === 'recul') {
                movements[p1.id] = { recul: 2 };
                success = false;
              }
              if (choice2 === 'recul') {
                movements[p2.id] = { recul: 2 };
                success = false;
              }
              resolveBarScenario('resolve_custom', {
                buy: success,
                movements,
                log: success
                  ? `🏢 ${currentPlayer.name} achète ${landedTile.name} car le défi bisou a été relevé !`
                  : `😘 Défi bisou : certains ont refusé et reculent de 2 cases ! ${currentPlayer.name} n'achète pas le bar.`
              });
            }}
            className="neon-btn success-btn"
            style={{ width: '100%' }}
          >
            Valider le Défi
          </button>
        </div>
      );
    }

    if (scenarioNum === 8 || scenarioNum === 16) {
      const laughIds = barScenarioTargetIds || [];
      const isResolveStage = interactiveChoices['stage'] === 'resolve';
      const otherPlayers = players.filter(pl => pl.id !== currentPlayer.id);

      if (isResolveStage && (laughIds.length > 0 || scenarioNum === 16)) {
        const rieurs = laughIds.length > 0 ? players.filter(pl => laughIds.includes(pl.id)) : [currentPlayer];
        const allFilled = rieurs.every(pl => interactiveChoices[pl.id] !== undefined);

        return (
          <div className="center-action-card border-neon-red">
            <AlertTriangle size={20} className="pulse" color="#ff3333" />
            <h3 style={{ margin: '2px 0' }} className="text-neon-red">{scenario.title}</h3>
            <p style={{ marginBottom: '8px', fontSize: '11px', lineHeight: '1.2' }}>Choisissez la sentence pour chaque rieur :</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', maxHeight: '150px', overflowY: 'auto', paddingRight: '4px', marginBottom: '8px' }}>
              {rieurs.map((pl) => {
                const choice = interactiveChoices[pl.id];
                return (
                  <div key={pl.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}>
                    <span style={{ color: pl.color, fontSize: '12px', fontWeight: 600 }}>
                      {pl.name}
                      {pl.card && (
                        <span style={{ marginLeft: '4px', opacity: 0.75, fontSize: '10px', padding: '1px 4px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', background: 'rgba(255,255,255,0.03)' }}>
                          {pl.card.cardValue}{getSuitSymbol(pl.card.suit)}
                        </span>
                      )}
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {scenarioNum === 16 ? (
                        <>
                          <button
                            onClick={() => { playClick(); resolveBarScenario('laugh_penalty', { playerId: pl.id, penaltyType: 'cul_sec' }); }}
                            className="neon-btn fail-btn"
                            style={{ padding: '4px 6px', fontSize: '10px' }}
                          >
                            Boire Cul sec 🍺
                          </button>
                          <button
                            onClick={() => { playClick(); resolveBarScenario('laugh_penalty', { playerId: pl.id, penaltyType: 'depart' }); }}
                            className="neon-btn fail-btn"
                            style={{ padding: '4px 6px', fontSize: '10px' }}
                          >
                            Retourner au DÉPART
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'sec' })); }}
                            className={`neon-btn ${choice === 'sec' ? 'choice-fail-active' : ''}`}
                            style={{ padding: '4px 6px', fontSize: '10px' }}
                          >
                            Cul Sec 🍺
                          </button>
                          <button
                            onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'recul' })); }}
                            className={`neon-btn ${choice === 'recul' ? 'choice-fail-active' : ''}`}
                            style={{ padding: '4px 6px', fontSize: '10px' }}
                          >
                            Reculer 4C ⬅️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {scenarioNum !== 16 && (
              <button
                disabled={!allFilled}
                onClick={() => {
                  const sips: Record<string, number> = {};
                  const movements: Record<string, any> = {};
                  rieurs.forEach((pl) => {
                    const choice = interactiveChoices[pl.id];
                    if (choice === 'sec') {
                      sips[pl.id] = 6;
                    } else if (choice === 'recul') {
                      movements[pl.id] = { recul: 4 };
                    }
                  });
                  resolveBarScenario('resolve_custom', {
                    buy: laughIds.length > 0,
                    sips,
                    movements,
                    log: `🏢 ${currentPlayer.name} achète ${landedTile.name} ! Les rieurs prennent leurs sentences.`
                  });
                }}
                className="neon-btn success-btn"
                style={{ width: '100%' }}
              >
                Valider les sentences
              </button>
            )}
          </div>
        );
      }

      return (
        <div className="center-action-card border-neon-red">
          <AlertTriangle size={20} className="pulse" color="#ff3333" />
          <h3 style={{ margin: '2px 0' }} className="text-neon-red">{scenario.title}</h3>
          <p style={{ marginBottom: '6px', lineHeight: '1.2', fontSize: '12px' }}>{scenario.description}</p>
          <div style={{ opacity: 0.8, marginBottom: '6px', fontSize: '11px' }}>Qui a ri ? (Sélection multiple) :</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginBottom: '8px', maxHeight: '140px', overflowY: 'auto' }}>
            {otherPlayers.map((p) => {
              const isSelected = laughIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    const next = isSelected ? laughIds.filter((id) => id !== p.id) : [...laughIds, p.id];
                    playClick();
                    resolveBarScenario('set_targets', { targets: next });
                  }}
                  className={`neon-btn ${isSelected ? 'choice-fail-active' : ''}`}
                  style={{ padding: '8px 10px', fontSize: '12px', borderColor: p.color, color: isSelected ? '#fff' : p.color }}
                >
                  😂 {p.name} {p.card ? `(${getSuitSymbol(p.card.suit)})` : ''}
                </button>
              );
            })}
          </div>
          <div className="center-actions-stack" style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
            {(laughIds.length > 0 || scenarioNum === 16) ? (
              <button
                onClick={() => {
                  playClick();
                  setInteractiveChoices(prev => {
                    const copy: Record<string, any> = { ...prev, stage: 'resolve' };
                    if (scenarioNum === 16 && laughIds.length === 0) {
                      copy[currentPlayer.id] = 'recul';
                    } else {
                      laughIds.forEach(id => { copy[id] = 'sec'; });
                    }
                    return copy;
                  });
                }}
                className="neon-btn success-btn"
                style={{ width: '100%' }}
              >
                {scenarioNum === 16 ? "Valider l'effet" : "⚖️ Définir les sentences"}
              </button>
            ) : (
              <button
                onClick={() => {
                  playSuccess();
                  resolveBarScenario('resolve_custom', {
                    buy: true,
                    log: `🏢 ${currentPlayer.name} achète ${landedTile.name} car personne n'a ri !`
                  });
                }}
                className="neon-btn success-btn"
                style={{ width: '100%' }}
              >
                ✔️ Acheter (Personne n'a ri)
              </button>
            )}
          </div>
        </div>
      );
    }

    if (scenarioNum === 9) {
      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <Shield size={20} style={{ color: landedTile.color }} />
          <h3 style={{ margin: '2px 0' }}>{scenario.title}</h3>
          <p style={{ marginBottom: '8px', lineHeight: '1.2', fontSize: '13px' }}>{scenario.description}</p>
          <div className="center-actions-row">
            <button
              onClick={() => {
                playSuccess();
                const movements: Record<string, any> = {};
                players.forEach((pl) => {
                  if (pl.id !== currentPlayer.id && !pl.isPrisoner) {
                    movements[pl.id] = { recul: 3 };
                  }
                });
                resolveBarScenario('resolve_custom', {
                  buy: true,
                  movements,
                  log: `🏢 ${currentPlayer.name} achète ${landedTile.name} ! Tous les autres reculent de 3 cases ⬅️ !`
                });
              }}
              className="neon-btn success-btn"
            >
              ⬅️ Reculer tout le monde (Acheter)
            </button>
            <button onClick={() => { playFail(); resolveBarScenario('fail'); }} className="neon-btn fail-btn">❌ Annuler</button>
          </div>
        </div>
      );
    }

    if (scenarioNum === 10) {
      const talkerId = interactiveChoices['talkerId'];
      const talker = players.find(p => p.id === talkerId);

      if (talker) {
        return (
          <div className="center-action-card" style={{ borderColor: landedTile.color }}>
            <Crown size={20} style={{ color: landedTile.color }} />
            <h3 style={{ margin: '2px 0' }}>Sentence pour {talker.name} ⚖️</h3>
            <p style={{ marginBottom: '12px', textAlign: 'center', fontSize: '13px' }}>
              {talker.name} a parlé pendant le silence ! Choisissez sa sentence :
            </p>
            <div className="center-actions-stack" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <button
                onClick={() => {
                  playFail();
                  resolveBarScenario('resolve_custom', {
                    buy: false,
                    sips: { [talker.id]: 6 },
                    log: `🤫 ${talker.name} a parlé et boit Cul Sec ! ${currentPlayer.name} n'achète pas le bar.`
                  });
                }}
                className="neon-btn fail-btn"
              >
                🍺 Boire Cul Sec (6G)
              </button>
              <button
                onClick={() => {
                  playFail();
                  resolveBarScenario('resolve_custom', {
                    buy: false,
                    movements: { [talker.id]: { position: 0 } },
                    log: `🏁 ${talker.name} a parlé et retourne au DÉPART ! ${currentPlayer.name} n'achète pas le bar.`
                  });
                }}
                className="neon-btn fail-btn"
              >
                ↩️ Retourner au DÉPART
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <Crown size={20} style={{ color: landedTile.color }} />
          <h3 style={{ margin: '2px 0' }}>{scenario.title}</h3>
          <p style={{ marginBottom: '8px', lineHeight: '1.2', fontSize: '12px' }}>{scenario.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginBottom: '8px' }}>
            <button
              onClick={() => {
                playSuccess();
                resolveBarScenario('resolve_custom', {
                  buy: true,
                  log: `🤫 Le silence a été respecté ! ${currentPlayer.name} achète ${landedTile.name} gratuitement !`
                });
              }}
              className="neon-btn success-btn"
              style={{ width: '100%' }}
            >
              🤫 Silence respecté (Achat gratuit)
            </button>
            <span style={{ fontSize: '11px', opacity: 0.8, textAlign: 'center', marginTop: '4px' }}>Ou désignez le joueur qui a parlé :</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '100px', overflowY: 'auto' }}>
              {players.map(pl => (
                <button
                  key={pl.id}
                  onClick={() => { playClick(); setInteractiveChoices({ talkerId: pl.id }); }}
                  className="neon-btn fail-btn"
                  style={{ padding: '6px', fontSize: '11px', borderColor: pl.color, color: pl.color }}
                >
                  🗣️ {pl.name} a parlé
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (scenarioNum === 11) {
      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <Flame size={20} style={{ color: landedTile.color }} />
          <h3 style={{ margin: '2px 0' }}>{scenario.title}</h3>
          <p style={{ marginBottom: '8px', lineHeight: '1.2', fontSize: '13px' }}>{scenario.description}</p>
          <div className="center-actions-stack" style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
            <button
              onClick={() => {
                playSuccess();
                resolveBarScenario('resolve_custom', {
                  buy: true,
                  log: `🗣️ ${currentPlayer.name} a raconté sa pire honte et achète ${landedTile.name} !`
                });
              }}
              className="neon-btn success-btn"
            >
              🗣️ Raconter (Acheter)
            </button>
            <button
              onClick={() => {
                playFail();
                resolveBarScenario('resolve_custom', {
                  buy: false,
                  sips: { [currentPlayer.id]: 6 },
                  log: `🍺 ${currentPlayer.name} a refusé de raconter sa honte et boit Cul Sec !`
                });
              }}
              className="neon-btn fail-btn"
            >
              🍺 Refuser & Cul Sec (6G)
            </button>
            <button
              onClick={() => {
                playFail();
                resolveBarScenario('resolve_custom', {
                  buy: false,
                  movements: { [currentPlayer.id]: { position: 0 } },
                  log: `🏁 ${currentPlayer.name} a refusé de raconter sa honte et retourne au DÉPART !`
                });
              }}
              className="neon-btn fail-btn"
            >
              ↩️ Refuser & Retour au DÉPART
            </button>
          </div>
        </div>
      );
    }

    if (scenarioNum === 12) {
      // Scenario 12: Object guess
      const targets = barScenarioTargetIds || [];
      const targetNames = targets.map((id) => players.find((p) => p.id === id)?.name || "Quelqu'un");
      const isGuessing = barScenarioStage === 'guess';

      if (isGuessing) {
        return (
          <div className="center-action-card border-neon-blue" style={{ padding: '6px' }}>
            <AlertTriangle size={20} className="pulse" color="#00f2fe" />
            <h3 style={{ fontSize: '11px', margin: '2px 0' }} className="text-neon-blue">{scenario.title}</h3>
            <p style={{ fontSize: '9px', marginBottom: '6px', lineHeight: '1.2' }}>
              {targetNames.join(', ')} cachent un objet. Devinez qui l'a !
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              {targets.map((id, idx) => (
                <button
                  key={id}
                  onClick={() => { playClick(); resolveBarScenario('guess', { guessId: id }); }}
                  className="neon-btn"
                >
                  🔍 Deviner {targetNames[idx]}
                </button>
              ))}
            </div>
          </div>
        );
      }

      // Result screen
      return (
        <div className="center-action-card border-neon-green">
          <PartyPopper size={20} color="#39ff14" />
          <h3 style={{ margin: '2px 0' }} className="text-neon-green">Résultat Devinette</h3>
          <p style={{ marginBottom: '8px', textAlign: 'center', lineHeight: '1.25' }}>
            {logMessages[0]}
          </p>
          <div className="center-actions-row">
            <button
              onClick={() => {
                const correct = state.logMessages[0].includes('juste');
                if (correct) {
                  playSuccess();
                  // 3 players drink cul sec, active buys bar
                  resolveBarScenario('cul_sec_others');
                } else {
                  playFail();
                  // active player drinks cul sec, does NOT buy
                  resolveBarScenario('fail', { penalty: 6 });
                }
              }}
              className="neon-btn success-btn"
            >
              Continuer
            </button>
          </div>
        </div>
      );
    }

    if (scenarioNum === 21) {
      const caughtId = barScenarioTargetIds?.[0];
      const caughtPlayer = players.find((p) => p.id === caughtId);
      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <PartyPopper size={20} style={{ color: landedTile.color }} />
          <h3 style={{ margin: '2px 0' }}>{scenario.title}</h3>
          <p style={{ marginBottom: '6px', lineHeight: '1.2', fontSize: '13px' }}>{scenario.description}</p>
          <div style={{ opacity: 0.8, marginBottom: '6px', fontSize: '11px' }}>Qui a été attrapé ? (Sélection) :</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginBottom: '8px' }}>
            {players.filter(p => p.id !== currentPlayer.id).map((p) => {
              const isSelected = caughtId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    const next = isSelected ? [] : [p.id];
                    playClick();
                    resolveBarScenario('set_targets', { targets: next });
                  }}
                  className={`neon-btn ${isSelected ? 'choice-fail-active' : ''}`}
                  style={{ padding: '6px', fontSize: '12px', borderColor: p.color, color: p.color }}
                >
                  🏃 {p.name} {p.card ? `(${getSuitSymbol(p.card.suit)})` : ''}
                </button>
              );
            })}
          </div>
          <div className="center-actions-stack" style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
            <button
              onClick={() => {
                if (caughtPlayer) {
                  playSuccess();
                  resolveBarScenario('caught_recule', { caughtIds: [caughtPlayer.id] });
                } else {
                  playFail();
                  resolveBarScenario('recule_active', { recul: 3 });
                }
              }}
              className="neon-btn success-btn"
              style={{ width: '100%' }}
            >
              Valider la Capture
            </button>
          </div>
        </div>
      );
    }

    if (scenarioNum === 22) {
      const allFilled = players.every((pl) => interactiveChoices[pl.id] !== undefined);
      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <PartyPopper size={20} style={{ color: landedTile.color }} />
          <h3 style={{ margin: '2px 0' }}>{scenario.title}</h3>
          <p style={{ marginBottom: '8px', lineHeight: '1.2', fontSize: '12px' }}>{scenario.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px', marginBottom: '8px' }}>
            {players.map((pl) => {
              const choice = interactiveChoices[pl.id];
              return (
                <div key={pl.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}>
                  <span style={{ color: pl.color, fontSize: '12px', fontWeight: 600 }}>
                    {pl.name}
                    {pl.card && (
                      <span style={{ marginLeft: '4px', opacity: 0.75, fontSize: '10px', padding: '1px 4px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', background: 'rgba(255,255,255,0.03)' }}>
                        {pl.card.cardValue}{getSuitSymbol(pl.card.suit)}
                      </span>
                    )}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'success' })); }}
                      className={`neon-btn ${choice === 'success' ? 'choice-success-active' : ''}`}
                      style={{ padding: '4px 6px', fontSize: '10px' }}
                    >
                      👍 Réussi
                    </button>
                    <button
                      onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'sip' })); }}
                      className={`neon-btn ${choice === 'sip' ? 'choice-fail-active' : ''}`}
                      style={{ padding: '4px 6px', fontSize: '10px' }}
                    >
                      6G 🧼
                    </button>
                    <button
                      onClick={() => { playClick(); setInteractiveChoices(prev => ({ ...prev, [pl.id]: 'recul' })); }}
                      className={`neon-btn ${choice === 'recul' ? 'choice-fail-active' : ''}`}
                      style={{ padding: '4px 6px', fontSize: '10px' }}
                    >
                      DÉPART 🏁
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            disabled={!allFilled}
            onClick={() => {
              const sips: Record<string, number> = {};
              const movements: Record<string, any> = {};
              players.forEach((pl) => {
                const choice = interactiveChoices[pl.id];
                if (choice === 'sip') {
                  sips[pl.id] = 6;
                } else if (choice === 'recul') {
                  movements[pl.id] = { position: 0 };
                }
              });
              resolveBarScenario('resolve_custom', {
                buy: true,
                sips,
                movements,
                log: `🏢 ${currentPlayer.name} achète ${landedTile.name} ! Les perdants prennent leurs sentences.`
              });
            }}
            className="neon-btn success-btn"
            style={{ width: '100%' }}
          >
            Valider le Défi
          </button>
        </div>
      );
    }

    if (scenarioNum >= 13 && scenarioNum <= 22 && scenarioNum !== 21 && scenarioNum !== 22) {
      let recul = 3;
      if (scenarioNum === 13 || scenarioNum === 20) {
        recul = 2;
      } else if (scenarioNum === 17) {
        recul = 4;
      }

      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <PartyPopper size={20} style={{ color: landedTile.color }} />
          <h3 style={{ margin: '2px 0' }}>{scenario.title}</h3>
          <p style={{ marginBottom: '8px', lineHeight: '1.2' }}>{scenario.description}</p>
          <div className="center-actions-row">
            <button onClick={() => { playSuccess(); resolveBarScenario('success'); }} className="neon-btn success-btn">
              ✔️ Défi Réussi (Acheter)
            </button>
            <button onClick={() => { playFail(); resolveBarScenario('recule_active', { recul }); }} className="neon-btn fail-btn">
              ❌ Échoué (Reculer de {recul})
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  /**
   * Renders the interactive component in the center of the board.
   */
  const renderCenter = () => {
    const landedTile = tiles[currentPlayer.position];

    // 0. Movement animation in progress — show dice + progress
    if (state.isMoving) {
      return (
        <div className="center-roll-view">
          <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>🎲 <span style={{ color: currentPlayer.color, textShadow: `0 0 12px ${currentPlayer.color}` }}>{diceValue}</span></h2>
          <p style={{ fontSize: '12px', opacity: 0.9 }}>{currentPlayer.name} se déplace...</p>
          <div style={{ width: '60%', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)', marginTop: '12px', overflow: 'hidden' }}>
            <div className="moving-progress-bar" style={{ height: '100%', borderRadius: '3px', background: `linear-gradient(90deg, ${currentPlayer.color}, #fff)` }} />
          </div>
        </div>
      );
    }

    // 0.5. Blocked at start check
    if (currentPlayer.position === 0 && currentPlayer.isLockedAtStart) {
      if (diceValue === null) {
        return (
          <div className="center-roll-view">
            <h2>Tour de <span style={{ color: currentPlayer.color, textShadow: `0 0 10px ${currentPlayer.color}` }}>{currentPlayer.name}</span></h2>
            <p style={{ fontSize: '13px', margin: '4px 0 10px', opacity: 0.9 }}>
              Tu es bloqué(e) au DÉPART 🏁. Fais un <strong>6</strong> au dé pour pouvoir démarrer !
            </p>
            <DiceRoller playerColor={currentPlayer.color} onRollComplete={rollDice} />
          </div>
        );
      } else {
        return (
          <div className="center-action-card border-neon-red">
            <AlertTriangle size={24} color="#ff3333" className="bounce" style={{ marginTop: '2px' }} />
            <h3 className="text-neon-red" style={{ margin: '2px 0' }}>Bloqué(e) au DÉPART</h3>
            <p style={{ marginBottom: '12px', fontSize: '13px' }}>
              Résultat du dé : <strong style={{ color: '#ff3333', fontSize: '18px' }}>{diceValue}</strong>. Échec ! Tu restes au DÉPART.
            </p>
            <button onClick={() => { playClick(); nextTurn(); }} className="neon-btn" style={{ width: '100%' }}>
              Finir le tour
            </button>
          </div>
        );
      }
    }

    // 1. Jail state check
    if (currentPlayer.isPrisoner) {
      const attempts = currentPlayer.prisonTurns;
      const rollResult = state.jailRollResult;

      return (
        <div className="center-action-card border-neon-red">
          <Shield size={24} color="#ff3333" className="pulse" style={{ marginTop: '2px' }} />
          <h3 className="text-neon-red" style={{ margin: '2px 0' }}>Cellule de Dégrisement</h3>
          
          {rollResult === undefined || rollResult === null ? (
            <>
              <p style={{ marginBottom: '8px', fontSize: '13px' }}>
                {currentPlayer.name}, tu es en cellule de dégrisement ! Obtiens un <strong>6</strong> au dé pour t'échapper.
              </p>
              <div style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>
                Tentatives : <strong style={{ color: '#ff3333' }}>{attempts} / 3</strong>
              </div>
              <div className="center-actions-stack" style={{ gap: '6px', width: '100%' }}>
                <button onClick={() => { playClick(); tryJailRoll(); }} className="neon-btn" style={{ borderColor: '#39ff14', color: '#39ff14', width: '100%' }}>
                  🎲 Tenter un 6
                </button>
              </div>
            </>
          ) : (
            <>
              <p style={{ marginBottom: '8px', fontSize: '14px' }}>
                Résultat du dé : <strong style={{ color: '#ff3333', fontSize: '18px' }}>{rollResult}</strong>
              </p>
              
              {attempts < 3 ? (
                <>
                  <p style={{ marginBottom: '12px', fontSize: '13px', color: '#ff3333' }}>
                    Échec ! Tu restes en cellule. (Tentatives : {attempts}/3)
                  </p>
                  <button onClick={() => { playClick(); resolveJailRollResult(); }} className="neon-btn" style={{ width: '100%' }}>
                    Finir le tour
                  </button>
                </>
              ) : (
                <>
                  <p style={{ marginBottom: '12px', fontSize: '13px', color: '#ff3333', fontWeight: 'bold' }}>
                    3ème tentative échouée ! Choisis ton option de sortie obligatoire :
                  </p>
                  {/* Choisir de payer la caution libère immédiatement et permet de relancer le dé ce tour-ci. Le retour au départ déplace le joueur et finit son tour. */}
                  <div className="center-actions-stack" style={{ gap: '6px', width: '100%' }}>
                    <button onClick={() => { playFail(); payJailFine(); }} className="neon-btn red-btn">
                      Payer la caution (2 Shots / 6G)
                    </button>
                    <button onClick={() => { playClick(); returnToStartFromJail(); }} className="neon-btn" style={{ borderColor: '#ff6c00', color: '#ff6c00' }}>
                      🏁 Revenir au DÉPART (Gratuit)
                    </button>
                  </div>
                </>
              )}
            </>
          )}
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
      if (landedTile.name.includes('Alcootest')) {
        const isPositive = state.activeDuoChallenge?.includes('POSITIF');
        return (
          <div className="center-action-card" style={{ borderColor: landedTile.color }}>
            <AlertTriangle size={24} style={{ color: landedTile.color, marginTop: '2px' }} className="pulse" />
            <h3 style={{ color: landedTile.color, margin: '2px 0' }}>{landedTile.name}</h3>
            <p style={{ marginBottom: '8px' }}>{state.activeDuoChallenge}</p>
            {isPositive ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                <button onClick={() => { playFail(); paySipsAndNextTurn(3); }} className="neon-btn fail-btn" style={{ borderColor: landedTile.color, color: landedTile.color }}>
                  Payer 3 gorgées
                </button>
                {renderSuperPowerButton(3)}
              </div>
            ) : (
              <button onClick={() => { playSuccess(); paySipsAndNextTurn(0); }} className="neon-btn success-btn" style={{ borderColor: landedTile.color, color: landedTile.color }}>
                Continuer
              </button>
            )}
          </div>
        );
      }

      if (selectedBottleTargetId) {
        const targetPlayer = players.find((p) => p.id === selectedBottleTargetId);
        const targetName = targetPlayer ? targetPlayer.name : 'Adversaire';
        
        const p1Name = currentPlayer.name;
        const p2Name = targetName;
        const challengeObj = DUO_CHALLENGES.find(c => {
          const replaced = c.template.replace(/{p1}/g, p1Name).replace(/{p2}/g, p2Name);
          return replaced === state.activeDuoChallenge;
        });
        const challengeId = challengeObj ? challengeObj.id : 2;
        
        return (
          <div className="center-action-card border-neon-green" style={{ height: 'auto', maxHeight: '100%', justifyContent: 'center', padding: '16px 12px', gap: '8px' }}>
            <PartyPopper size={20} color="#39ff14" />
            <h3 className="text-neon-green" style={{ margin: '0', fontSize: '20px' }}>Défi en Duo 🍾</h3>
            <p style={{ margin: '4px 0', textAlign: 'center', lineHeight: '1.25', fontSize: '14px' }}>{state.activeDuoChallenge}</p>
            {renderDuoChallengeBody(challengeId, targetPlayer, targetName)}
          </div>
        );
      }
    }

    // 5. Standard movement roll button
    if (diceValue === null) {
       return (
        <div className="center-roll-view">
          <h2>Tour de <span style={{ color: currentPlayer.color, textShadow: `0 0 10px ${currentPlayer.color}` }}>{currentPlayer.name}</span></h2>
          <div className="player-turn-laps" style={{ fontSize: '14px', opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', margin: '4px 0 10px' }}>
            🏁 Premier à l'arrivée gagne !
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
            <h3 style={{ color: currentPlayer.color, margin: '2px 0' }}>{landedTile.name} (Le tien)</h3>
            <p style={{ marginBottom: '6px' }}>Améliore en {landedTile.level === 1 ? "Double Dose 🍹" : "Cul Sec ! 🍻"} ! Défi : {landedTile.description}</p>
            <div className="center-actions-row">
              <button onClick={() => { playSuccess(); resolveBar(true); nextTurn(); }} className="neon-btn success-btn">Réussi !</button>
              <button onClick={() => { playFail(); resolveBar(false); nextTurn(); }} className="neon-btn fail-btn">Boire</button>
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
            <h3 style={{ color: owner.color, margin: '2px 0' }}>Chez {owner.name} !</h3>
            <p style={{ marginBottom: '6px' }}>Tu es sur sa propriété. Trinque et prends {rentPrice} gorgées de pénalité !</p>
            <button onClick={() => { playFail(); resolveBar(false); nextTurn(); }} className="neon-btn fail-btn" style={{ borderColor: owner.color, color: owner.color }}>
              Prendre mes {rentPrice} gorgées
            </button>
            {renderSuperPowerButton(rentPrice)}
          </div>
        );
      }

      // Unowned Bar purchase challenge
      if (activeBarScenario !== undefined) {
        return renderBarScenarioUI(activeBarScenario);
      }

      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <Flame size={24} style={{ color: landedTile.color }} />
          <h3 style={{ color: landedTile.color, margin: '2px 0' }}>Acheter {landedTile.name}</h3>
          <p style={{ marginBottom: '6px' }}>{landedTile.description}</p>
          <div className="center-actions-row">
            <button onClick={() => { playSuccess(); resolveBar(true); nextTurn(); }} className="neon-btn success-btn">Défi Réussi !</button>
            <button onClick={() => { playFail(); resolveBar(false); nextTurn(); }} className="neon-btn fail-btn">Boire</button>
          </div>
          {renderSuperPowerButton(landedTile.price || 3)}
        </div>
      );
    }

    if (landedTile.type === 'goto_prison') {
      return (
        <div className="center-action-card border-neon-red">
          <AlertTriangle size={24} color="#ff3333" className="bounce" style={{ marginTop: '2px' }} />
          <h3 className="text-neon-red" style={{ margin: '2px 0' }}>Direct en Dégrisement !</h3>
          <p style={{ marginBottom: '8px' }}>Tu as trop bu, les videurs te jettent en cellule !</p>
          <button onClick={() => { playFail(); sendToJail(currentPlayer.id); nextTurn(); }} className="neon-btn red-btn">
            Aller en Cellule
          </button>
          {renderSuperPowerButton(0)}
        </div>
      );
    }

    // Custom Obstacle render for L'Énigme de l'Apéro (name-based)
    if (landedTile.name.includes('Énigme')) {
      if (!selectedBottleTargetId) {
        const otherPlayers = players.filter((p) => p.id !== currentPlayer.id);
        return (
          <div className="center-action-card" style={{ borderColor: landedTile.color }}>
            <PartyPopper size={24} style={{ color: landedTile.color }} />
            <h3 style={{ color: landedTile.color, margin: '2px 0' }}>{landedTile.name}</h3>
            <p style={{ marginBottom: '6px' }}>{landedTile.description}</p>
            <div style={{ opacity: 0.8, marginBottom: '4px' }}>Choisis ta cible pour l'énigme :</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', width: '100%' }}>
              {otherPlayers.map((op) => (
                <button key={op.id} onClick={() => { playClick(); selectTargetPlayer(op.id); }} className="neon-btn" style={{ flex: 1, borderColor: op.color, color: op.color }}>
                  {op.name} {op.card ? `(${getSuitSymbol(op.card.suit)})` : ''}
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
            <h3 style={{ color: landedTile.color, margin: '2px 0' }}>{landedTile.name}</h3>
            <p style={{ marginBottom: '6px' }}>Énigme posée à <strong>{targetName} {targetPlayer?.card ? `[${targetPlayer.card.cardValue} ${getSuitSymbol(targetPlayer.card.suit)}]` : ''}</strong> ! A-t-il trouvé la réponse ?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
              <div style={{ padding: '4px', border: '1px solid rgba(0, 255, 255, 0.2)', borderRadius: '6px', background: 'rgba(0, 255, 255, 0.02)', display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => { playFail(); resolveDuoPenalty(currentPlayer.id, 3); }} className="neon-btn fail-btn">
                  💡 Réussi (+3 Gor. pour toi, {currentPlayer.name})
                </button>
                {renderSuperPowerButton(3)}
              </div>
              <button onClick={() => { playFail(); resolveDuoPenalty(selectedBottleTargetId, 3); }} className="neon-btn fail-btn" style={{ borderColor: targetPlayer?.color, color: targetPlayer?.color }}>
                ❌ Échoué (+3 Gor. pour {targetName} {targetPlayer?.card ? `(${getSuitSymbol(targetPlayer.card.suit)})` : ''})
              </button>
            </div>
          </div>
        );
      }
    }
    if (landedTile.name.includes('Alcootest')) {
      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <AlertTriangle size={24} style={{ color: landedTile.color, marginTop: '2px' }} className="pulse" />
          <h3 style={{ color: landedTile.color, margin: '2px 0' }}>{landedTile.name}</h3>
          <p style={{ marginBottom: '6px' }}>{landedTile.description}</p>
          <button onClick={() => { playClick(); resolveAlcootest(); }} className="neon-btn" style={{ borderColor: landedTile.color, color: landedTile.color }}>
            🧪 Souffler dans le Ballon
          </button>
          {renderSuperPowerButton(0)}
        </div>
      );
    }

    // Custom Obstacle render for Radar de Vitesse (name-based)
    if (landedTile.name.includes('Radar')) {
      const isFlashed = diceValue !== null && diceValue >= 4;
      return (
        <div className="center-action-card" style={{ borderColor: landedTile.color }}>
          <AlertTriangle size={24} style={{ color: landedTile.color, marginTop: '2px' }} className="bounce" />
          <h3 style={{ color: landedTile.color, margin: '2px 0' }}>{landedTile.name}</h3>
          <p style={{ marginBottom: '6px' }}>{landedTile.description}</p>
          {isFlashed ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
              <button onClick={() => { playFail(); paySipsAndNextTurn(3); }} className="neon-btn fail-btn" style={{ borderColor: landedTile.color, color: landedTile.color }}>
                Payer 3 gorgées d'amende
              </button>
              {renderSuperPowerButton(3)}
            </div>
          ) : (
            <button onClick={() => { playSuccess(); paySipsAndNextTurn(0); }} className="neon-btn success-btn" style={{ borderColor: landedTile.color, color: landedTile.color }}>
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
        <h3 style={{ color: landedTile.color, margin: '2px 0' }}>{landedTile.name}</h3>
        <p style={{ marginBottom: '6px' }}>{landedTile.description}</p>
        {isTax ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginTop: '4px' }}>
            <div style={{ padding: '4px', border: '1px solid rgba(255, 255, 0, 0.15)', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 0, 0.03)', display: 'flex', flexDirection: 'column' }}>
              <button onClick={() => { playFail(); paySipsAndNextTurn(4); }} className="neon-btn fail-btn" style={{ borderColor: landedTile.color, color: landedTile.color }}>
                Option A : Payer 4 gorgées 💸
              </button>
              {renderSuperPowerButton(4)}
            </div>
            
            <div style={{ padding: '4px', border: '1px solid rgba(255, 255, 0, 0.15)', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 0, 0.03)', display: 'flex', flexDirection: 'column' }}>
              <button onClick={() => { playFail(); paySipsAndNextTurn(6); }} className="neon-btn fail-btn" style={{ borderColor: landedTile.color, color: landedTile.color }}>
                Option B : Faire Cul sec ! 🍻
              </button>
              {renderSuperPowerButton(6)}
            </div>
          </div>
        ) : landedTile.name.includes('Tournée') ? (
          <div style={{ padding: '4px', border: '1px solid rgba(0, 255, 255, 0.15)', borderRadius: '8px', backgroundColor: 'rgba(0, 255, 255, 0.03)', width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button onClick={() => { playSuccess(); resolveTourneeGenerale(); }} className="neon-btn success-btn" style={{ borderColor: landedTile.color, color: landedTile.color }}>
              🍻 Tout le monde boit 1 gorgée
            </button>
            {renderSuperPowerButton(1)}
          </div>
        ) : (
          <button onClick={() => { playClick(); nextTurn(); }} className="neon-btn" style={{ borderColor: landedTile.color, color: landedTile.color }}>
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
            players={players}
            activePlayerId={currentPlayer.id}
          />
        </div>
      )}

      {/* Pending Transfer Modal Overlay */}
      {pendingTransfer && (
        <div className="modal-backdrop" id="transfer-modal">
          <div className="center-action-card border-neon-pink" style={{ maxWidth: '320px', padding: '24px', background: 'rgba(5, 5, 21, 0.98)', boxShadow: '0 0 25px rgba(255, 0, 127, 0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <PartyPopper size={32} color="#ff007f" className="pulse" />
            <h3 className="text-neon-pink" style={{ fontSize: '24px', fontWeight: 800 }}>💘 Flèche de Cœur !</h3>
            <p style={{ fontSize: '18px', color: '#f5f5fa', lineHeight: '1.4', textAlign: 'center', margin: '10px 0' }}>
              <strong>{players.find(p => p.id === pendingTransfer.fromId)?.name}</strong> veut transférer <strong>{pendingTransfer.penalty} {pendingTransfer.penalty > 1 ? 'gorgées' : 'gorgée'}</strong> à <strong>{players.find(p => p.id === pendingTransfer.toId)?.name}</strong>.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '10px' }}>
              <button
                onClick={() => acceptTransfer()}
                className="neon-btn success-btn"
                id="accept-transfer-btn"
                style={{ borderColor: '#39ff14', color: '#39ff14', width: '100%' }}
              >
                👍 Accepter & Boire
              </button>
              <button
                onClick={() => refuseTransfer()}
                className="neon-btn fail-btn"
                id="refuse-transfer-btn"
                style={{ borderColor: '#ff3333', color: '#ff3333', width: '100%' }}
              >
                ❌ Refuser & Retour au DÉPART
              </button>
            </div>
          </div>
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
                        <span>🏁 {p.laps || 0}/1 trs</span>
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




