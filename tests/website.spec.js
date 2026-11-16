const { test, expect } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'https://loreverse-ctrl.github.io/lore-archive/';

test.describe('LOREVERSE website health', () => {
  test('homepage loads over HTTPS and exposes core sections', async ({ page }) => {
    const response = await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    expect(response, 'Homepage should return a response').not.toBeNull();
    expect(response.status()).toBeLessThan(400);
    expect(new URL(page.url()).protocol).toBe('https:');
    await expect(page).toHaveTitle(/LOREVERSE/i);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('#admin')).toHaveCount(1);
    await expect(page.locator('#archive')).toHaveCount(1);
  });

  test('internal hash links resolve to an element', async ({ page }) => {
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    const broken = await page.locator('a[href*="#"]').evaluateAll(links => {
      return links.map(link => {
        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin || !url.hash || url.hash === '#' || url.hash.startsWith('#anime-')) return null;
        let id;
        try { id = decodeURIComponent(url.hash.slice(1)); } catch { return link.getAttribute('href'); }
        return document.getElementById(id) ? null : link.getAttribute('href');
      }).filter(Boolean);
    });
    expect(broken, 'Every same-page anchor should have a target').toEqual([]);
  });

  test('admin login page exposes authentication controls', async ({ page }) => {
    const adminURL = new URL('admin/', baseURL).toString();
    const response = await page.goto(adminURL, { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    expect(response.status()).toBeLessThan(400);
    await expect(page.locator('#authPanel')).toBeVisible();
    await expect(page.locator('#email')).toHaveAttribute('type', 'email');
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
    await expect(page.locator('#login')).toBeVisible();
    await expect(page.locator('#signup')).toBeVisible();
    await expect(page.locator('[data-tab="system"]')).toHaveCount(1);
    await expect(page.locator('#runSystemCheck')).toHaveCount(1);
  });

  test('admin page has no uncaught page errors during startup', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(new URL('admin/', baseURL).toString(), { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(1500);
    expect(errors).toEqual([]);
  });
});
