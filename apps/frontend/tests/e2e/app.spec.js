import { test, expect } from '@playwright/test';

test('homepage has title and scraper selector', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Job Scraper' })).toBeVisible();
  await expect(page.getByText('Select Website to Scrape')).toBeVisible();
});

test('can select a scraper', async ({ page }) => {
  await page.goto('/');

  const freeworkButton = page.getByRole('button', { name: /freework/i });
  await freeworkButton.click();

  await expect(freeworkButton).toHaveClass(/selected/);
});
