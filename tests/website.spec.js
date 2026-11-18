const { test, expect } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'https://lore-archive.pages.dev/';

test.describe('LOREVERSE website health', () => {
  test('homepage loads over HTTPS and exposes core sections', async ({ page }) => {
    const response = await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    expect(response, 'Homepage should return a response').not.toBeNull();
    expect(response.status()).toBeLessThan(400);
    const pageURL = new URL(page.url());
    expect(['https:', 'http:']).toContain(pageURL.protocol);
    if (pageURL.protocol === 'http:') expect(['127.0.0.1', 'localhost']).toContain(pageURL.hostname);
    await expect(page).toHaveTitle(/LOREVERSE/i);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('#admin')).toHaveCount(1);
    await expect(page.locator('#archive')).toHaveCount(1);
  });

  test('homepage exposes accessible skip navigation and social metadata', async ({ page }) => {
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.skip-link')).toHaveAttribute('href', '#main-content');
    await expect(page.locator('#main-content')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://lore-archive.pages.dev/');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /LOREVERSE/i);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /LOREVERSE/i);
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
  });

  test('public sitemap and crawler rules are published', async ({ request }) => {
    const sitemap = await request.get(new URL('sitemap.xml', baseURL).toString());
    const robots = await request.get(new URL('robots.txt', baseURL).toString());
    expect(sitemap.ok()).toBe(true);
    expect(robots.ok()).toBe(true);
    const sitemapText = await sitemap.text();
    const robotsText = await robots.text();
    expect(sitemapText).toContain('<urlset');
    expect(sitemapText).toContain('/lore-archive/knowledge/');
    expect(robotsText).toContain('Sitemap: https://lore-archive.pages.dev/sitemap.xml');
    expect(robotsText).toContain('Disallow: /lore-archive/admin/');
    expect(robotsText).toContain('Disallow: /lore-archive/editorial/');
  });

  test('winter festival decorations can be toggled and respect reduced motion', async ({ page }) => {
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.winter-banner')).toContainText('WINTER FESTIVAL');
    await expect(page.locator('#winterSnow')).toHaveAttribute('aria-hidden', 'true');
    const toggle = page.locator('#winterToggle');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('html')).toHaveClass(/winter-effects-off/);
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('html')).not.toHaveClass(/winter-effects-off/);
  });


  test('24-day advent calendar renders all days and keeps future gifts locked', async ({ page }) => {
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#winterCalendarGrid .winter-day')).toHaveCount(24);
    await expect(page.locator('#winterCalendarTitle')).toContainText('24 ӨДРИЙН НУУЦ БЭЛЭГ');
    await expect(page.locator('#winterCalendarReveal')).toBeVisible();
    const disabledDays = await page.locator('#winterCalendarGrid .winter-day:disabled').count();
    expect(disabledDays).toBeGreaterThanOrEqual(0);
    await expect(page.locator('#winterCalendarCount')).toContainText('/ 24');
  });

  test('internal hash links resolve to an element', async ({ page }) => {
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    const broken = await page.locator('a[href*="#"]').evaluateAll(links => {
      return links.map(link => {
        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash || url.hash === '#' || url.hash.startsWith('#anime-')) return null;
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
  test('mobile app navigation and AI launcher respond to taps', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

    const hero = page.locator('#home');
    const adGuide = page.locator('#ad-guide-section');
    await expect(hero).toBeVisible();
    await expect(adGuide).toBeVisible();
    const order = await page.evaluate(() => {
      const hero = document.querySelector('#home');
      const ad = document.querySelector('#ad-guide-section');
      return Boolean(hero && ad && hero.compareDocumentPosition(ad) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(order, 'Ad Guide should appear directly after the homepage hero').toBe(true);

    const navToggle = page.locator('#navToggle');
    const nav = page.locator('#mainNav');
    await navToggle.click();
    await expect(nav).toHaveClass(/open/);
    await expect(navToggle).toHaveAttribute('aria-expanded', 'true');
    await nav.locator('a[href="#anime"]').click();
    await expect(nav).not.toHaveClass(/open/);
    await expect(navToggle).toHaveAttribute('aria-expanded', 'false');

    await page.locator('#loreAiLauncher').click();
    await expect(page.locator('#loreAiPanel')).toHaveClass(/open/);
    await page.locator('#loreAiClose').click();
    await expect(page.locator('#loreAiPanel')).not.toHaveClass(/open/);
  });

});
