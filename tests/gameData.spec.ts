import { test, expect } from '@playwright/test';
import { CARDS_DATABASE, INITIAL_TILES } from '../src/gameData';

test.describe('Game Data Verification', () => {
  test('should have 16 tiles on the board', () => {
    expect(INITIAL_TILES.length).toBe(16);
  });

  test('each tile should have a valid ID, type and name', () => {
    INITIAL_TILES.forEach((tile) => {
      expect(tile.id).toBeGreaterThanOrEqual(0);
      expect(tile.id).toBeLessThan(16);
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
});
