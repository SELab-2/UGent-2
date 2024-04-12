import { test, expect } from '@playwright/test';

// make only this test run
test('base url without backend leads to login screen root element', async ({ page }) => {
  await page.goto('https://localhost:8080');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveTitle(/Delphi/);

  const loginButton = page.getByRole('link', { name: 'Log in' })
  // await retryButton.waitFor({ timeout: 10000 });
  await expect(loginButton).toBeVisible();
  await loginButton.click();
  await page.waitForURL(/^https:\/\/login\.microsoftonline\.com\//);
});

test.skip('base url with backend leads to login page', async ({ page }) => {
    await page.goto('https://localhost:8080');
    await expect(page).toHaveTitle(/Delphi/);

    const loginButton = page.getByRole('link', { name: 'Log in' })
    expect(loginButton).toBeNull();

    const retryButton = page.getByRole('link', { name: 'Retry' })
    await expect(retryButton).toBeVisible();
});