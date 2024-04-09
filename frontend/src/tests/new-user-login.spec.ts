import { test, expect } from '@playwright/test';

test('base url without backend leads to login error page', async ({ page }) => {
  await page.goto('https://localhost:8080/login');

  await expect(page).toHaveTitle(/Delphi/);

    // // Count the number of buttons with the text "retry"
    // const retryButtonCount = await page.locator('button:has-text("retry")').count();
    //
    // // Assert that the count is zero, meaning the button is not present
    // expect(retryButtonCount).toBe(1);

  await page.waitForLoadState('networkidle');
  const retryButton = page.locator(':text-matches("Retry", "i")')
  await retryButton.waitFor({ timeout: 50000 });

  await expect(page.getByRole('button', {name: /retry/i})).toBeVisible();
});

test('base url with backend leads to login page', async ({ page }) => {
    await page.goto('https://localhost:8080/login');

    await expect(page).toHaveTitle(/Delphi/);

    // Count the number of buttons with the text "retry"
    await page.waitForSelector('button:has-text("Retry")', { timeout: 10000 });
    const retryButtonCount = await page.locator('button:has-text("Retry")').count();

    // Assert that the count is zero, meaning the button is not present (THIS SHOULD CURRENTLY FAIL)
    expect(retryButtonCount).toBe(0);
});