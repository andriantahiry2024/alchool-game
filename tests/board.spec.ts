import { test, expect } from '@playwright/test';
import { getGridPosition } from '../src/components/Board';

test.describe('Board Coordinate Mapping', () => {
  test('should map top edge tiles (0 to 8) correctly', () => {
    expect(getGridPosition(0)).toEqual({ gridRow: 1, gridColumn: 1 });
    expect(getGridPosition(4)).toEqual({ gridRow: 1, gridColumn: 5 });
    expect(getGridPosition(8)).toEqual({ gridRow: 1, gridColumn: 9 });
  });

  test('should map right edge tiles (9 to 15) correctly', () => {
    expect(getGridPosition(9)).toEqual({ gridRow: 2, gridColumn: 9 });
    expect(getGridPosition(12)).toEqual({ gridRow: 5, gridColumn: 9 });
    expect(getGridPosition(15)).toEqual({ gridRow: 8, gridColumn: 9 });
  });

  test('should map bottom edge tiles (16 to 24) correctly', () => {
    expect(getGridPosition(16)).toEqual({ gridRow: 9, gridColumn: 9 });
    expect(getGridPosition(20)).toEqual({ gridRow: 9, gridColumn: 5 });
    expect(getGridPosition(24)).toEqual({ gridRow: 9, gridColumn: 1 });
  });

  test('should map left edge tiles (25 to 31) correctly', () => {
    expect(getGridPosition(25)).toEqual({ gridRow: 8, gridColumn: 1 });
    expect(getGridPosition(28)).toEqual({ gridRow: 5, gridColumn: 1 });
    expect(getGridPosition(31)).toEqual({ gridRow: 2, gridColumn: 1 });
  });
});
