import { test, expect } from '@playwright/test';
import { CARDS_DATABASE, INITIAL_TILES } from '../src/gameData';
import { drawCardWithoutRepetition, drawBarScenarioWithoutRepetition, drawDuoChallengeWithoutRepetition } from '../src/hooks/useGameState';

test.describe('Game Data Verification', () => {
  test('should have 32 tiles on the board', () => {
    expect(INITIAL_TILES.length).toBe(32);
  });

  test('each tile should have a valid ID, type and name', () => {
    INITIAL_TILES.forEach((tile) => {
      expect(tile.id).toBeGreaterThanOrEqual(0);
      expect(tile.id).toBeLessThan(32);
      expect(tile.name.length).toBeGreaterThan(0);
      expect(tile.type).toBeTruthy();
    });
  });

  test('cards database should have unique IDs', () => {
    const ids = CARDS_DATABASE.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('each card should have a title, text and non-negative penalty', () => {
    CARDS_DATABASE.forEach((card) => {
      expect(card.title.length).toBeGreaterThan(0);
      expect(card.text.length).toBeGreaterThan(0);
      expect(card.penalty).toBeGreaterThanOrEqual(0);
    });
  });

  test('should draw cards and bar scenarios without repetition until all are used', () => {
    let usedCardIds: string[] = [];
    const totalCards = CARDS_DATABASE.length;
    const drawnIds = new Set<string>();

    for (let i = 0; i < totalCards; i++) {
      const { card, newUsedIds } = drawCardWithoutRepetition(usedCardIds);
      expect(drawnIds.has(card.id)).toBe(false);
      drawnIds.add(card.id);
      usedCardIds = newUsedIds;
      expect(usedCardIds.length).toBe(i + 1);
    }

    const { card: nextCard, newUsedIds: nextUsedCardIds } = drawCardWithoutRepetition(usedCardIds);
    expect(nextUsedCardIds.length).toBe(1);
    expect(nextUsedCardIds[0]).toBe(nextCard.id);

    let usedScenarios: number[] = [];
    const drawnScenarios = new Set<number>();

    for (let i = 0; i < 22; i++) {
      const { scenario, newUsedScenarios } = drawBarScenarioWithoutRepetition(usedScenarios);
      expect(drawnScenarios.has(scenario)).toBe(false);
      drawnScenarios.add(scenario);
      usedScenarios = newUsedScenarios;
      expect(usedScenarios.length).toBe(i + 1);
    }

    const { scenario: nextScenario, newUsedScenarios: nextUsedScenarios } = drawBarScenarioWithoutRepetition(usedScenarios);
    expect(nextUsedScenarios.length).toBe(1);
    expect(nextUsedScenarios[0]).toBe(nextScenario);

    // Verify duo challenge drawing without repetition
    let usedDuoChallenges: number[] = [];
    const drawnDuoChallenges = new Set<number>();
    const totalDuoCount = 26;

    for (let i = 0; i < totalDuoCount; i++) {
      const { index, newUsedIndices } = drawDuoChallengeWithoutRepetition(usedDuoChallenges, totalDuoCount);
      expect(drawnDuoChallenges.has(index)).toBe(false);
      drawnDuoChallenges.add(index);
      usedDuoChallenges = newUsedIndices;
      expect(usedDuoChallenges.length).toBe(i + 1);
    }

    const { index: nextDuo, newUsedIndices: nextUsedDuo } = drawDuoChallengeWithoutRepetition(usedDuoChallenges, totalDuoCount);
    expect(nextUsedDuo.length).toBe(1);
    expect(nextUsedDuo[0]).toBe(nextDuo);
  });
});
