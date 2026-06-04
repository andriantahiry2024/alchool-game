import { test, expect } from '@playwright/test';
import * as audio from '../src/utils/audio';

test.describe('Audio Manager Exports', () => {
  test('should export all required sound functions', () => {
    expect(typeof audio.playClick).toBe('function');
    expect(typeof audio.playSuccess).toBe('function');
    expect(typeof audio.playFail).toBe('function');
    expect(typeof audio.playDiceRoll).toBe('function');
    expect(typeof audio.playSpinTick).toBe('function');
  });
});
