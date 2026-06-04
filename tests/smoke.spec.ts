import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  // Basic smoke test to verify application loads
  await expect(page).toHaveTitle(/Alcooly/);
});
