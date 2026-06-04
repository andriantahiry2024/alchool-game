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
});
