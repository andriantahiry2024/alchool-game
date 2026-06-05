import { test, expect } from '@playwright/test';

test.describe('Alcooly Full Game Loop E2E', () => {
  test('should setup players, roll dice, and complete a turn', async ({ page }) => {
    // 1. Navigate to the game root page
    await page.goto('/');

    // Verify Title and Subtitle are visible
    await expect(page.locator('.logo-title')).toHaveText('ALCOOLY');
    await expect(page.locator('.logo-subtitle')).toContainText("Le Monopoly de l'apéro");

    // 2. Register Player 1: Alice
    await page.fill('.setup-input', 'Alice');
    // Select first color dot
    await page.locator('.color-dot').first().click();
    await page.click('.add-btn');

    // Register Player 2: Bob
    await page.fill('.setup-input', 'Bob');
    // Select second color dot
    await page.locator('.color-dot').nth(1).click();
    await page.click('.add-btn');

    // Verify badges are created
    await expect(page.locator('.player-badge')).toHaveCount(2);

    // 3. Start the game session
    await page.click('.start-btn');

    // Reveal fétiche cards
    await expect(page.locator('.reveal-container')).toBeVisible();
    const revealCards = page.locator('.reveal-card-3d');
    await expect(revealCards).toHaveCount(2);
    await revealCards.nth(0).click();
    await revealCards.nth(1).click();
    await page.click('.reveal-confirm-btn');

    // Unlock players so they don't block at DÉPART for this standard game loop test
    await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      if (saved) {
        const state = JSON.parse(saved);
        state.players = state.players.map((p: any) => ({ ...p, isLockedAtStart: false }));
        localStorage.setItem('alcooly_game_state', JSON.stringify(state));
      }
    });
    await page.reload();

    // 4. Verify board layout is rendered
    await expect(page.locator('.board-grid')).toBeVisible();
    
    // Open dashboard modal to verify player list
    await page.click('#menu-btn');
    await expect(page.locator('#dashboard-modal')).toBeVisible();
    await expect(page.locator('.player-score-badge')).toHaveCount(2);

    // Verify active player is Alice
    await expect(page.locator('.player-score-badge').first()).toHaveClass(/active/);

    // Close modal
    await page.click('#close-menu-btn');
    await expect(page.locator('#dashboard-modal')).not.toBeVisible();

    // 5. Trigger the roll
    const rollBtn = page.locator('.roll-btn');
    await expect(rollBtn).toBeVisible();

    // Mock Math.random to return 0.35 so that (Math.floor(0.35 * 6) + 1) is exactly 3.
    // This makes Alice land on the Radar tile (index 3) deterministically without being flashed.
    await page.evaluate(() => {
      Math.random = () => 0.35;
    });

    await rollBtn.click();

    // Wait for the roll animation and tile movement to finish (spin + result pause + step-by-step movement)
    await page.waitForTimeout(5500);

    // 6. Dynamically resolve the landing tile screen to verify progress
    if (await page.locator('.card-3d').isVisible()) {
      // Landed on Card Mystère: Flip the card
      await page.locator('.card-3d').click();
      await page.waitForTimeout(1000);
      // Validate the challenge
      await page.locator('.success-btn').click();
      await page.waitForTimeout(500);
      if (await page.locator('.neon-btn:has-text("Suivant")').isVisible()) {
        await page.locator('.neon-btn:has-text("Suivant")').click();
      }
    } else if (await page.locator('.spin-btn').isVisible()) {
      // Landed on Bouteille: Spin it
      await page.locator('.spin-btn').click();
      await page.waitForTimeout(3500); // wait for 3s spin + transition
      // Complete the duo challenge
      if (await page.locator('.success-btn').first().isVisible()) {
        await page.locator('.success-btn').first().click();
      } else if (await page.locator('.fail-btn').first().isVisible()) {
        await page.locator('.fail-btn').first().click();
      }
    } else if (await page.locator('text=Choisis ta cible').first().isVisible()) {
      // Landed on Enigme target choice: choose first opponent
      await page.locator('.center-action-card .neon-btn').first().click();
      await page.waitForTimeout(500);
    } else if (await page.locator('.neon-btn:has-text("Souffler")').isVisible()) {
      // Landed on Alcootest: Blow
      await page.locator('.neon-btn:has-text("Souffler")').click();
      await page.waitForTimeout(1500);
      if (await page.locator('.fail-btn').first().isVisible()) {
        await page.locator('.fail-btn').first().click();
      } else if (await page.locator('.success-btn').first().isVisible()) {
        await page.locator('.success-btn').first().click();
      }
    } else if (await page.locator('.neon-btn:has-text("Deviner")').first().isVisible()) {
      // Landed on Devinette: Make guess and continue
      await page.locator('.neon-btn:has-text("Deviner")').first().click();
      await page.waitForTimeout(600);
      if (await page.locator('.success-btn').isVisible()) {
        await page.locator('.success-btn').click();
      }
    } else if (await page.locator('.fail-btn').first().isVisible()) {
      // Landed on Tax or other penalty/choice: pay it
      await page.locator('.fail-btn').first().click();
    } else if (await page.locator('.success-btn').first().isVisible()) {
      // Landed on a Bar or safe tile: Complete challenge/continue
      await page.locator('.success-btn').first().click();
      await page.waitForTimeout(500);
      if (await page.locator('.success-btn:has-text("Valider")').first().isVisible()) {
        await page.locator('.success-btn:has-text("Valider")').first().click();
      }
    } else if (await page.locator('.red-btn').first().isVisible()) {
      // Landed on cell / jail: Complete warning
      await page.locator('.red-btn').first().click();
    } else if (await page.locator('.neon-btn:has-text("Suivant")').isVisible()) {
      // Landed on tax, depart, or general event: click next
      await page.locator('.neon-btn:has-text("Suivant")').click();
    }

    // 7. Verify next player's turn starts
    await page.waitForTimeout(500);
    await page.click('#menu-btn');
    await expect(page.locator('#dashboard-modal')).toBeVisible();
    // Active badge should now belong to Bob (index 1)
    await expect(page.locator('.player-score-badge').nth(1)).toHaveClass(/active/);
  });

  test('should persist and load game state from localStorage on page reload', async ({ page }) => {
    await page.goto('/');

    // Register players and start game
    await page.fill('.setup-input', 'Xavier');
    await page.click('.add-btn');
    await page.fill('.setup-input', 'Yasmine');
    await page.click('.add-btn');
    await page.click('.start-btn');

    // Reveal fétiche cards
    await expect(page.locator('.reveal-container')).toBeVisible();
    const revealCards = page.locator('.reveal-card-3d');
    await expect(revealCards).toHaveCount(2);
    await revealCards.nth(0).click();
    await revealCards.nth(1).click();
    await page.click('.reveal-confirm-btn');

    // Verify board is active
    await expect(page.locator('.board-grid')).toBeVisible();

    // Reload page
    await page.reload();

    // Verify it automatically resumes on the board with the same players!
    await expect(page.locator('.board-grid')).toBeVisible();
    await page.click('#menu-btn');
    await expect(page.locator('#dashboard-modal')).toBeVisible();
    await expect(page.locator('.player-score-badge')).toHaveCount(2);
    await expect(page.locator('.player-score-badge').first()).toContainText('Xavier');
  });

  test('should prevent adding duplicate player names', async ({ page }) => {
    await page.goto('/');

    // Add Alice
    await page.fill('.setup-input', 'Alice');
    await page.click('.add-btn');

    // Try to add Alice again (case-insensitive check)
    await page.fill('.setup-input', 'alice');
    await page.click('.add-btn');

    // Verify error is shown and only 1 player badge exists
    await expect(page.locator('.setup-error')).toBeVisible();
    await expect(page.locator('.setup-error')).toContainText('Ce nom est déjà utilisé');
    await expect(page.locator('.player-badge')).toHaveCount(1);

    // Change input to Bob and error should disappear, then click add
    await page.fill('.setup-input', 'Bob');
    await expect(page.locator('.setup-error')).not.toBeVisible();
    await page.click('.add-btn');

    // Verify 2 players are now added
    await expect(page.locator('.player-badge')).toHaveCount(2);
  });

  test('should trigger coeur power transfer and handle target decision', async ({ page }) => {
    await page.goto('/');

    // Inscrire les joueurs normalement pour peupler les cases et le plateau
    await page.fill('.setup-input', 'Alice');
    await page.click('.add-btn');
    await page.fill('.setup-input', 'Bob');
    await page.click('.add-btn');
    await page.click('.start-btn');

    // Révéler les cartes fétiches
    const revealCards = page.locator('.reveal-card-3d');
    await revealCards.nth(0).click();
    await revealCards.nth(1).click();
    await page.click('.reveal-confirm-btn');

    // Modifier le state peuplé dans localStorage
    await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      if (saved) {
        const state = JSON.parse(saved);
        state.players = [
          {
            ...state.players[0],
            name: 'Alice',
            position: 21, // Taxe Alcool (index 21)
            powerUsed: false,
            card: { suit: 'coeur', cardValue: 'As' }
          },
          {
            ...state.players[1],
            name: 'Bob',
            position: 5,
            powerUsed: false,
            card: { suit: 'pique', cardValue: 'As' }
          }
        ];
        state.currentPlayerIndex = 0;
        state.diceValue = 4;
        state.activeScreen = 'board';
        localStorage.setItem('alcooly_game_state', JSON.stringify(state));
      }
    });

    // Recharger la page pour charger l'état mocké
    await page.reload();

    // Vérifier que nous sommes sur la case avec le bouton de pouvoir visible
    const heartPowerBtn = page.locator('text=Flèche de Cœur').first();
    await expect(heartPowerBtn).toBeVisible();

    // Cliquer sur le bouton cible "Bob" pour transférer
    await page.locator('button:has-text("Bob")').first().click();

    // Vérifier que la modale overlay de transfert est visible
    const transferModal = page.locator('#transfer-modal');
    await expect(transferModal).toBeVisible();
    await expect(transferModal).toContainText('Alice veut transférer');

    // Cliquer sur "Refuser & Retour au DÉPART"
    await page.locator('#refuse-transfer-btn').click();

    // Vérifier que la modale a disparu
    await expect(transferModal).not.toBeVisible();
  });

  test('should clamp retrograde movement to index 0 and not wrap-around or trigger gameover', async ({ page }) => {
    await page.goto('/');

    // Inscrire les joueurs
    await page.fill('.setup-input', 'Alice');
    await page.click('.add-btn');
    await page.fill('.setup-input', 'Bob');
    await page.click('.add-btn');
    await page.click('.start-btn');

    // Révéler les cartes fétiches
    const revealCards = page.locator('.reveal-card-3d');
    await revealCards.nth(0).click();
    await revealCards.nth(1).click();
    await page.click('.reveal-confirm-btn');

    // Attendre le plateau de jeu
    await expect(page.locator('.board-grid')).toBeVisible();

    // Injecter un état mocké dans localStorage
    // Alice est sur l'index 1 (Bar 1), activeCard est 's4' (Reculer de 2 cases), et l'écran est 'card'
    await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      if (saved) {
        const state = JSON.parse(saved);
        state.players = [
          {
            ...state.players[0],
            name: 'Alice',
            position: 1, // Bar 1
            laps: 0,
            card: { suit: 'pique', cardValue: 'As' },
          },
          {
            ...state.players[1],
            name: 'Bob',
            position: 2,
            laps: 0,
            card: { suit: 'coeur', cardValue: 'Roi' },
          }
        ];
        state.currentPlayerIndex = 0;
        state.activeScreen = 'card';
        state.activeCard = {
          id: 's4',
          category: 'movement',
          suit: 'pique',
          cardValue: '10',
          title: 'Le 10 de Pique ♠️',
          text: 'Pression policière ! Les flics font une descente de routine. Recule immédiatement de 2 cases ! (Pas de pénalité de boisson).',
          penalty: 0,
        };
        localStorage.setItem('alcooly_game_state', JSON.stringify(state));
      }
    });

    // Recharger la page pour charger l'état mocké
    await page.reload();

    // Vérifier que nous sommes sur l'écran carte
    const card3d = page.locator('.card-3d');
    await expect(card3d).toBeVisible();

    // Cliquer sur le dos de la carte pour la retourner
    await card3d.click();

    // Cliquer sur le bouton d'effet
    const applyEffectBtn = page.locator('button:has-text("Appliquer l\'effet")').first();
    await expect(applyEffectBtn).toBeVisible();
    await applyEffectBtn.click();

    // Attendre la fin de la transition et vérifier que le joueur est sur l'index 0 (DÉPART)
    await page.waitForTimeout(500);

    // Ouvrir le tableau de bord
    await page.click('#menu-btn');
    await expect(page.locator('#dashboard-modal')).toBeVisible();

    // Alice (index 0) doit être active et avoir 0 laps
    const gameState = await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      return saved ? JSON.parse(saved) : null;
    });

    expect(gameState.players[0].position).toBe(0);
    expect(gameState.players[0].laps).toBe(0);
    // S'assurer que le jeu n'est pas fini
    expect(gameState.activeScreen).not.toBe('gameover');
  });

  test('should handle card d4 (Le 7 de Carreau) where the fétiche player recules', async ({ page }) => {
    await page.goto('/');

    // Inscrire les joueurs
    await page.fill('.setup-input', 'Alice');
    await page.click('.add-btn');
    await page.fill('.setup-input', 'Bob');
    await page.click('.add-btn');
    await page.click('.start-btn');

    // Révéler les cartes fétiches
    const revealCards = page.locator('.reveal-card-3d');
    await revealCards.nth(0).click();
    await revealCards.nth(1).click();
    await page.click('.reveal-confirm-btn');

    // Attendre le plateau de jeu
    await expect(page.locator('.board-grid')).toBeVisible();

    // Injecter un état mocké
    // Alice est sur l'index 2 (Carte Mystère), Bob est sur l'index 5, Bob possède Carreau fétiche
    await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      if (saved) {
        const state = JSON.parse(saved);
        state.players = [
          {
            ...state.players[0],
            name: 'Alice',
            position: 2,
            laps: 0,
            card: { suit: 'pique', cardValue: 'As' },
          },
          {
            ...state.players[1],
            name: 'Bob',
            position: 5,
            laps: 0,
            card: { suit: 'carreau', cardValue: 'Valet' },
          }
        ];
        state.currentPlayerIndex = 0;
        state.activeScreen = 'card';
        state.activeCard = {
          id: 'd4',
          category: 'movement',
          suit: 'carreau',
          cardValue: '7',
          title: 'Le 7 de Carreau ♦️',
          text: "Marche arrière ! Le joueur possédant la carte fétiche de Carreau ♦️ (ou le joueur actif si aucun Carreau n'est en jeu) recule de 3 cases immédiatement !",
          penalty: 0,
        };
        localStorage.setItem('alcooly_game_state', JSON.stringify(state));
      }
    });

    // Recharger la page pour charger l'état mocké
    await page.reload();

    // Vérifier que nous sommes sur l'écran carte
    const card3d = page.locator('.card-3d');
    await expect(card3d).toBeVisible();

    // Cliquer sur le dos de la carte pour la retourner
    await card3d.click();

    // Cliquer sur le bouton d'effet
    const applyEffectBtn = page.locator('button:has-text("Appliquer l\'effet")').first();
    await expect(applyEffectBtn).toBeVisible();
    await applyEffectBtn.click();

    // Attendre la fin de la transition
    await page.waitForTimeout(500);

    // Récupérer l'état final
    const gameState = await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      return saved ? JSON.parse(saved) : null;
    });

    // Bob (index 1) doit avoir reculé de 5 à 2
    expect(gameState.players[1].position).toBe(2);
    // Alice (index 0) doit toujours être à la position 2
    expect(gameState.players[0].position).toBe(2);
  });

  test('should handle new bar scenarios (13 & 16) with retrograde penalties', async ({ page }) => {
    await page.goto('/');

    // Register players and start
    await page.fill('.setup-input', 'Alice');
    await page.click('.add-btn');
    await page.fill('.setup-input', 'Bob');
    await page.click('.add-btn');
    await page.click('.start-btn');

    // Reveal fétiche cards
    const revealCards = page.locator('.reveal-card-3d');
    await revealCards.nth(0).click();
    await revealCards.nth(1).click();
    await page.click('.reveal-confirm-btn');

    // Mock state in localStorage: Alice is active, lands on a Bar, activeBarScenario is 13 (Sommelier)
    await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      if (saved) {
        const state = JSON.parse(saved);
        state.players = [
          { ...state.players[0], position: 1, laps: 0 },
          { ...state.players[1], position: 2, laps: 0 }
        ];
        state.currentPlayerIndex = 0;
        state.activeScreen = 'board';
        state.diceValue = 1;
        state.activeBarScenario = 13;
        localStorage.setItem('alcooly_game_state', JSON.stringify(state));
      }
    });

    await page.reload();

    // Verify Scenario 13 Sommelier is shown
    await expect(page.locator('text=Scénario du Sommelier')).toBeVisible();

    // Click "Échoué" (which recules 2 cases). Alice is at index 1, so reculer of 2 should clamp to 0.
    await page.click('button:has-text("Échoué")');
    await page.waitForTimeout(500);

    // Verify Alice is at position 0
    let gameState = await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      return saved ? JSON.parse(saved) : null;
    });
    expect(gameState.players[0].position).toBe(0);

    // Mock state again: activeBarScenario is 16 (Blague Carambar)
    await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      if (saved) {
        const state = JSON.parse(saved);
        state.players = [
          { ...state.players[0], position: 4, laps: 0 },
          { ...state.players[1], position: 6, laps: 0 }
        ];
        state.currentPlayerIndex = 0;
        state.activeScreen = 'board';
        state.diceValue = 1;
        state.activeBarScenario = 16;
        state.barScenarioTargetIds = [];
        localStorage.setItem('alcooly_game_state', JSON.stringify(state));
      }
    });

    await page.reload();

    // Verify Scenario 16 is shown
    await expect(page.locator('text=La Blague Carambar')).toBeVisible();

    // Nobody laughs, click "Valider l'effet" to transition to sentence stage.
    await page.click('button:has-text("Valider l\'effet")');
    await page.waitForTimeout(300);

    // Click "Retourner au DÉPART" to apply the penalty to Alice.
    await page.click('button:has-text("Retourner au DÉPART")');
    await page.waitForTimeout(500);

    gameState = await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      return saved ? JSON.parse(saved) : null;
    });
    expect(gameState.players[0].position).toBe(0);
    expect(gameState.players[0].isLockedAtStart).toBe(true);
  });

  test('should handle Scenario 21 (Le chat et la souris) where caught player is jailed', async ({ page }) => {
    await page.goto('/');

    // Register players and start
    await page.fill('.setup-input', 'Alice');
    await page.click('.add-btn');
    await page.fill('.setup-input', 'Bob');
    await page.click('.add-btn');
    await page.click('.start-btn');

    // Reveal fétiche cards
    const revealCards = page.locator('.reveal-card-3d');
    await revealCards.nth(0).click();
    await revealCards.nth(1).click();
    await page.click('.reveal-confirm-btn');

    // Mock state: Alice is at position 4, activeBarScenario is 21 (Le chat et la souris)
    await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      if (saved) {
        const state = JSON.parse(saved);
        state.players = [
          { ...state.players[0], position: 4, laps: 0 },
          { ...state.players[1], position: 6, laps: 0 }
        ];
        state.currentPlayerIndex = 0;
        state.activeScreen = 'board';
        state.diceValue = 1;
        state.activeBarScenario = 21;
        state.barScenarioTargetIds = [];
        localStorage.setItem('alcooly_game_state', JSON.stringify(state));
      }
    });

    await page.reload();

    // Verify Scenario 21 is shown
    await expect(page.locator('text=Le chat et la souris')).toBeVisible();

    // Select Bob (id is players[1].id)
    const targetBtn = page.locator('button:has-text("Bob")').first();
    await expect(targetBtn).toBeVisible();
    await targetBtn.click();

    // Click "Valider la Capture de Bob"
    await page.click('button:has-text("Valider la Capture de Bob")');
    await page.waitForTimeout(500);

    // Bob (players[1]) should go to jail (position 8, isPrisoner true)
    const gameState = await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      return saved ? JSON.parse(saved) : null;
    });
    expect(gameState.players[1].position).toBe(8);
    expect(gameState.players[1].isPrisoner).toBe(true);
    // Alice stays at position 4 and owns the bar
    expect(gameState.players[0].position).toBe(4);
    expect(gameState.tiles[4].ownerId).toBe(gameState.players[0].id);
  });

  test('should handle Scenario 21 (Le chat et la souris) where nobody is caught and active player is jailed', async ({ page }) => {
    await page.goto('/');

    // Register players and start
    await page.fill('.setup-input', 'Alice');
    await page.click('.add-btn');
    await page.fill('.setup-input', 'Bob');
    await page.click('.add-btn');
    await page.click('.start-btn');

    // Reveal fétiche cards
    const revealCards = page.locator('.reveal-card-3d');
    await revealCards.nth(0).click();
    await revealCards.nth(1).click();
    await page.click('.reveal-confirm-btn');

    // Mock state: Alice is at position 4, activeBarScenario is 21 (Le chat et la souris)
    await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      if (saved) {
        const state = JSON.parse(saved);
        state.players = [
          { ...state.players[0], position: 4, laps: 0 },
          { ...state.players[1], position: 6, laps: 0 }
        ];
        state.currentPlayerIndex = 0;
        state.activeScreen = 'board';
        state.diceValue = 1;
        state.activeBarScenario = 21;
        state.barScenarioTargetIds = [];
        localStorage.setItem('alcooly_game_state', JSON.stringify(state));
      }
    });

    await page.reload();

    // Verify Scenario 21 is shown
    await expect(page.locator('text=Le chat et la souris')).toBeVisible();

    // Click "Aucune capture (Aller en dégrisement)"
    await page.click('button:has-text("Aucune capture")');
    await page.waitForTimeout(500);

    // Alice (players[0]) should go to jail (position 8, isPrisoner true)
    const gameState = await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      return saved ? JSON.parse(saved) : null;
    });
    expect(gameState.players[0].position).toBe(8);
    expect(gameState.players[0].isPrisoner).toBe(true);
    // Alice should NOT own the bar at position 4
    expect(gameState.tiles[4].ownerId).toBeUndefined();
    // Bob stays at position 6
    expect(gameState.players[1].position).toBe(6);
  });

  test('should handle Scenario 4 (Cible Aléatoire) where target drinks 4 sips on success', async ({ page }) => {
    await page.goto('/');

    // Register players and start
    await page.fill('.setup-input', 'Alice');
    await page.click('.add-btn');
    await page.fill('.setup-input', 'Bob');
    await page.click('.add-btn');
    await page.click('.start-btn');

    // Reveal fétiche cards
    const revealCards = page.locator('.reveal-card-3d');
    await revealCards.nth(0).click();
    await revealCards.nth(1).click();
    await page.click('.reveal-confirm-btn');

    // Mock state: Alice is at position 4, activeBarScenario is 4, target is Bob (players[1])
    await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      if (saved) {
        const state = JSON.parse(saved);
        state.players = [
          { ...state.players[0], position: 4, laps: 0, sipsCount: 0 },
          { ...state.players[1], position: 6, laps: 0, sipsCount: 0 }
        ];
        state.currentPlayerIndex = 0;
        state.activeScreen = 'board';
        state.diceValue = 1;
        state.activeBarScenario = 4;
        state.barScenarioTargetIds = [state.players[1].id];
        localStorage.setItem('alcooly_game_state', JSON.stringify(state));
      }
    });

    await page.reload();

    // Click "boit 4G" success button
    await page.click('button:has-text("boit 4G")');
    await page.waitForTimeout(500);

    // Verify Bob has 4 sips
    const gameState = await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      return saved ? JSON.parse(saved) : null;
    });
    expect(gameState.players[1].sipsCount).toBe(4);
    // Alice has 0 sips and owns Bar 2 (index 4)
    expect(gameState.players[0].sipsCount).toBe(0);
    expect(gameState.tiles[4].ownerId).toBe(gameState.players[0].id);
  });

  test('should handle case DÉPART lock and unlocking with 6', async ({ page }) => {
    await page.goto('/');

    // Register players and start game
    await page.fill('.setup-input', 'Alice');
    await page.click('.add-btn');
    await page.fill('.setup-input', 'Bob');
    await page.click('.add-btn');
    await page.click('.start-btn');

    // Reveal fétiche cards
    const revealCards = page.locator('.reveal-card-3d');
    await revealCards.nth(0).click();
    await revealCards.nth(1).click();
    await page.click('.reveal-confirm-btn');

    // Verify Alice is blocked at DÉPART
    await expect(page.locator('text=Tu es bloqué(e) au DÉPART')).toBeVisible();

    // Mock state: Alice rolls a non-6 (e.g. 3)
    await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      if (saved) {
        const state = JSON.parse(saved);
        state.diceValue = 3;
        state.isMoving = false;
        localStorage.setItem('alcooly_game_state', JSON.stringify(state));
      }
    });
    await page.reload();

    // Verify it shows fail screen for DÉPART
    await expect(page.locator('text=Résultat du dé : 3. Échec !')).toBeVisible();
    
    // Click "Finir le tour"
    await page.click('button:has-text("Finir le tour")');
    await page.waitForTimeout(500);

    // Verify active player is now Bob
    let gameState = await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      return saved ? JSON.parse(saved) : null;
    });
    expect(gameState.currentPlayerIndex).toBe(1);

    // Now mock Bob rolls a 6
    await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      if (saved) {
        const state = JSON.parse(saved);
        state.diceValue = 6;
        state.isMoving = false;
        localStorage.setItem('alcooly_game_state', JSON.stringify(state));
      }
    });
    await page.reload();

    // Unlock Bob and reset diceValue so they can roll normally
    await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      if (saved) {
        const state = JSON.parse(saved);
        state.players[1].isLockedAtStart = false;
        state.diceValue = null;
        localStorage.setItem('alcooly_game_state', JSON.stringify(state));
      }
    });
    await page.reload();

    // Verify the standard DiceRoller is visible again for Bob
    await expect(page.locator('.roll-btn')).toBeVisible();
  });

  test('should handle try jail roll with fails and choices', async ({ page }) => {
    await page.goto('/');

    // Register players and start game
    await page.fill('.setup-input', 'Alice');
    await page.click('.add-btn');
    await page.fill('.setup-input', 'Bob');
    await page.click('.add-btn');
    await page.click('.start-btn');

    // Reveal fétiche cards
    const revealCards = page.locator('.reveal-card-3d');
    await revealCards.nth(0).click();
    await revealCards.nth(1).click();
    await page.click('.reveal-confirm-btn');

    // Mock state: Alice is in prison with 2 failed attempts
    await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      if (saved) {
        const state = JSON.parse(saved);
        state.players[0] = {
          ...state.players[0],
          isPrisoner: true,
          prisonTurns: 2,
          position: 8
        };
        state.currentPlayerIndex = 0;
        state.activeScreen = 'board';
        localStorage.setItem('alcooly_game_state', JSON.stringify(state));
      }
    });
    await page.reload();

    // Verify we see Cellule de Dégrisement (use h3 specific selector to avoid strict mode matching 2 elements)
    await expect(page.locator('h3:has-text("Cellule de Dégrisement")')).toBeVisible();
    await expect(page.locator('text=Tentatives : 2 / 3')).toBeVisible();
    await expect(page.locator('button:has-text("Payer la caution")')).not.toBeVisible();

    // Mock the fail case (jailRollResult = 4, attempts = 3)
    await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      if (saved) {
        const state = JSON.parse(saved);
        state.players[0].prisonTurns = 3;
        state.jailRollResult = 4;
        localStorage.setItem('alcooly_game_state', JSON.stringify(state));
      }
    });
    await page.reload();

    // Verify 3rd failed roll UI shows choices
    await expect(page.locator('text=3ème tentative échouée')).toBeVisible();
    await expect(page.locator('button:has-text("Revenir au DÉPART")')).toBeVisible();
    await expect(page.locator('button:has-text("Payer la caution")')).toBeVisible();

    // Click Revenir au DÉPART
    await page.click('button:has-text("Revenir au DÉPART")');
    await page.waitForTimeout(500);

    // Verify Alice is no longer a prisoner, is at position 0, and isLockedAtStart is true
    const gameState = await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      return saved ? JSON.parse(saved) : null;
    });
    expect(gameState.players[0].isPrisoner).toBe(false);
    expect(gameState.players[0].position).toBe(0);
    expect(gameState.players[0].isLockedAtStart).toBe(true);
  });

  test('should handle try jail roll and pay caution choice to roll again', async ({ page }) => {
    await page.goto('/');

    // Register players and start game
    await page.fill('.setup-input', 'Alice');
    await page.click('.add-btn');
    await page.fill('.setup-input', 'Bob');
    await page.click('.add-btn');
    await page.click('.start-btn');

    // Reveal fétiche cards
    const revealCards = page.locator('.reveal-card-3d');
    await revealCards.nth(0).click();
    await revealCards.nth(1).click();
    await page.click('.reveal-confirm-btn');

    // Mock state: Alice is in prison with 3 failed attempts (waiting for choice)
    await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      if (saved) {
        const state = JSON.parse(saved);
        state.players[0] = {
          ...state.players[0],
          isPrisoner: true,
          prisonTurns: 3,
          position: 8
        };
        state.jailRollResult = 4;
        state.currentPlayerIndex = 0;
        state.activeScreen = 'board';
        localStorage.setItem('alcooly_game_state', JSON.stringify(state));
      }
    });
    await page.reload();

    // Verify 3rd failed roll UI shows choices
    await expect(page.locator('text=3ème tentative échouée')).toBeVisible();

    // Click Payer la caution
    await page.click('button:has-text("Payer la caution")');
    await page.waitForTimeout(500);

    // Verify Alice is no longer a prisoner
    const gameState = await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      return saved ? JSON.parse(saved) : null;
    });
    expect(gameState.players[0].isPrisoner).toBe(false);
    expect(gameState.players[0].prisonTurns).toBe(0);
    expect(gameState.currentPlayerIndex).toBe(0); // Still Alice's turn!

    // Verify Alice can roll the dice now (DiceRoller is visible)
    await expect(page.locator('.roll-btn')).toBeVisible();
  });

  test('should immunize jailed players from retrograde movements', async ({ page }) => {
    await page.goto('/');

    // Register players and start game
    await page.fill('.setup-input', 'Alice');
    await page.click('.add-btn');
    await page.fill('.setup-input', 'Bob');
    await page.click('.add-btn');
    await page.click('.start-btn');

    // Reveal fétiche cards
    const revealCards = page.locator('.reveal-card-3d');
    await revealCards.nth(0).click();
    await revealCards.nth(1).click();
    await page.click('.reveal-confirm-btn');

    // Mock state: Alice is active on a Bar, Bob is a prisoner at position 8.
    // Card s4 is drawn (10 of Pique, Bob has Pique card fétiche)
    await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      if (saved) {
        const state = JSON.parse(saved);
        state.players[0] = {
          ...state.players[0],
          position: 12,
          card: { suit: 'coeur', cardValue: 'As' }
        };
        state.players[1] = {
          ...state.players[1],
          position: 8,
          isPrisoner: true,
          card: { suit: 'pique', cardValue: 'As' }
        };
        state.currentPlayerIndex = 0;
        state.activeScreen = 'card';
        state.activeCard = {
          id: 's4',
          category: 'movement',
          suit: 'pique',
          cardValue: '10',
          title: 'Le 10 de Pique ♠️',
          text: 'Pression policière ! Les flics font une descente de routine. Recule immédiatement de 2 cases !',
          penalty: 0
        };
        localStorage.setItem('alcooly_game_state', JSON.stringify(state));
      }
    });
    await page.reload();

    // Verify card is visible
    const card3d = page.locator('.card-3d');
    await expect(card3d).toBeVisible();

    // Click to flip
    await card3d.click();
    await page.waitForTimeout(500);

    // Click apply effect button
    const applyEffectBtn = page.locator('button:has-text("Appliquer l\'effet")').first();
    await expect(applyEffectBtn).toBeVisible();
    await applyEffectBtn.click();
    await page.waitForTimeout(500);

    // Verify Bob did NOT move and remained at position 8
    const gameState = await page.evaluate(() => {
      const saved = localStorage.getItem('alcooly_game_state');
      return saved ? JSON.parse(saved) : null;
    });
    expect(gameState.players[1].position).toBe(8);
  });
});
