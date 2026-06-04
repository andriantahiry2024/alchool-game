import { test, expect } from '@playwright/test';
import { getGridPosition } from '../src/components/Board';

test.describe('Board Coordinate Mapping', () => {
  test('should map top edge tiles (0 to 4) correctly', () => {
    expect(getGridPosition(0)).toEqual({ gridRow: 1, gridColumn: 1 });
    expect(getGridPosition(2)).toEqual({ gridRow: 1, gridColumn: 3 });
    expect(getGridPosition(4)).toEqual({ gridRow: 1, gridColumn: 5 });
  });

  test('should map right edge tiles (5 to 7) correctly', () => {
    expect(getGridPosition(5)).toEqual({ gridRow: 2, gridColumn: 5 });
    expect(getGridPosition(6)).toEqual({ gridRow: 3, gridColumn: 5 });
    expect(getGridPosition(7)).toEqual({ gridRow: 4, gridColumn: 5 });
  });

  test('should map bottom edge tiles (8 to 12) correctly', () => {
    expect(getGridPosition(8)).toEqual({ gridRow: 5, gridColumn: 5 });
    expect(getGridPosition(10)).toEqual({ gridRow: 5, gridColumn: 3 });
    expect(getGridPosition(12)).toEqual({ gridRow: 5, gridColumn: 1 });
  });

  test('should map left edge tiles (13 to 15) correctly', () => {
    expect(getGridPosition(13)).toEqual({ gridRow: 4, gridColumn: 1 });
    expect(getGridPosition(14)).toEqual({ gridRow: 3, gridColumn: 1 });
    expect(getGridPosition(15)).toEqual({ gridRow: 2, gridColumn: 1 });
  });
});
