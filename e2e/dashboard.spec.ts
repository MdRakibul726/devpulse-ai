import { test, expect } from '@playwright/test';

test.describe('DevPulse AI Dashboard E2E Flows', () => {
  test('loads home page and displays profile dashboard', async ({ page }) => {
    await page.goto('/');

    // Check title and brand
    await expect(page).toHaveTitle(/DevPulse AI/i);
    await expect(page.locator('text=DevPulse')).toBeVisible();

    // Check hero profile and stats
    await expect(page.locator('text=Public Profile')).toBeVisible();
    await expect(page.locator('text=Total Stars')).toBeVisible();
    await expect(page.locator('text=Total Forks')).toBeVisible();
  });

  test('switches between feature tabs cleanly', async ({ page }) => {
    await page.goto('/');

    // Repositories Tab
    await page.click('button:has-text("Repositories")');
    await expect(page.locator('text=Showing')).toBeVisible();

    // Health Analyzer Tab
    await page.click('button:has-text("Health Analyzer")');
    await expect(page.locator('text=Health Index')).toBeVisible();
    await expect(page.locator('text=Actionable Improvements')).toBeVisible();

    // AI Career Copilot Tab
    await page.click('button:has-text("AI Career Copilot")');
    await expect(page.locator('text=Evidence-Based CV Bullet Points')).toBeVisible();

    // README Cards Tab
    await page.click('button:has-text("README Cards")');
    await expect(page.locator('text=README Badge & Card Generator')).toBeVisible();
    await expect(page.locator('text=Live Interactive SVG Preview')).toBeVisible();
  });

  test('SVG card endpoint returns valid SVG markup', async ({ request }) => {
    const res = await request.get('/api/cards/stats?username=shadcn&theme=dark');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('image/svg+xml');

    const body = await res.text();
    expect(body).toContain('<svg');
    expect(body).toContain('Total Stars Earned');
    expect(body).toContain('DevPulse AI');
  });
});
