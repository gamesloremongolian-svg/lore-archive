const { test, expect } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'https://lore-archive.pages.dev/';

test.describe('LOREVERSE website health', () => {
  test('homepage loads over HTTPS and exposes the current LOREVERSE sections', async ({ page }) => {
    const response = await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    expect(response, 'Homepage should return a response').not.toBeNull();
    expect(response.status()).toBeLessThan(400);
    const pageURL = new URL(page.url());
    expect(['https:', 'http:']).toContain(pageURL.protocol);
    if (pageURL.protocol === 'http:') expect(['127.0.0.1', 'localhost']).toContain(pageURL.hostname);
    await expect(page).toHaveTitle(/LOREVERSE/i);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('.brand')).toContainText('LOREVERSE');
    await expect(page.locator('.hero h1')).toContainText('Дуртай ертөнцөө');
    await expect(page.locator('.cards .card')).toHaveCount(3);
    await expect(page.locator('.cards [data-category="all"]')).toHaveCount(0);
    await expect(page.locator('.feature').first()).toBeVisible();
    await expect(page.locator('.feature').nth(1)).toContainText('BUG HUNTER');
  });

  test('homepage exposes a description, primary navigation and working mobile menu', async ({ page }) => {
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /LOREVERSE/i);
    // The homepage now uses one responsive MENU dropdown; the retired Universe Hub
    // submenu is no longer part of the current navigation.
    await expect(page.locator('#menuBtn')).toHaveCount(1);
    await expect(page.locator('#mainNav')).toHaveCount(1);
    // Staff-only editorial and archive management routes are intentionally not exposed in public navigation.
    await expect(page.locator('#mainNav a[href="./knowledge/"]')).toHaveCount(1);
    await expect(page.locator('#mainNav a[href="./ai/"]')).toHaveCount(1);
    await expect(page.locator('#mainNav a[href="./community/"]')).toHaveCount(1);
    await expect(page.locator('#mainNav a[href="./store/"]')).toHaveCount(1);
    await expect(page.locator('#mainNav a[href="./profile/"]')).toHaveCount(1);
    await expect(page.locator('#mainNav a[href="./bug-report/"]')).toContainText('Алдаа мэдээлэх');
    await expect(page.locator('a[href="./bug-report/"]').filter({ hasText: 'Алдаа мэдээлэх' }).first()).toBeVisible();
    await expect(page.locator('#themeToggle')).toHaveCount(1);

    await page.setViewportSize({ width: 390, height: 844 });
    const toggle = page.locator('#menuBtn');
    const nav = page.locator('#mainNav');
    await toggle.click();
    await expect(nav).toHaveClass(/open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await toggle.click();
    await expect(nav).not.toHaveClass(/open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('public sitemap and crawler rules are published', async ({ request }) => {
    const sitemap = await request.get(new URL('sitemap.xml', baseURL).toString());
    const robots = await request.get(new URL('robots.txt', baseURL).toString());
    expect(sitemap.ok()).toBe(true);
    expect(robots.ok()).toBe(true);
    const sitemapText = await sitemap.text();
    const robotsText = await robots.text();
    expect(sitemapText).toContain('<urlset');
    expect(sitemapText).toContain('/knowledge/');
    expect(robotsText).toContain('Sitemap: https://lore-archive.pages.dev/sitemap.xml');
    expect(robotsText).toContain('Disallow: /admin/');
    expect(robotsText).toContain('Disallow: /editorial/');
  });

  test('internal hash links resolve to an element', async ({ page }) => {
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    const broken = await page.locator('a[href*="#"]').evaluateAll(links => {
      return links.map(link => {
        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash || url.hash === '#') return null;
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
    await expect(page.locator('#signup')).toHaveCount(0);
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

  test('browser-facing Supabase Edge Functions allow both production Pages origins', async ({ request }) => {
    const functions = [
      'admin-user-management',
      'delete-my-account',
      'translate-to-english',
      'translate-to-mongolian',
      'qpay-payment',
      'lore-ai',
      'editorial-ai-draft'
    ];
    const origins = ['https://e-archive.pages.dev', 'https://lore-archive.pages.dev'];
    for (const name of functions) {
      for (const origin of origins) {
        const response = await request.fetch(
          'https://nfacspfctvunwbxtvvyi.supabase.co/functions/v1/' + name,
          {
            method: 'OPTIONS',
            headers: {
              Origin: origin,
              'Access-Control-Request-Method': 'POST',
              'Access-Control-Request-Headers': 'authorization,apikey,content-type,x-client-info'
            }
          }
        );
        expect(response.status(), name + ' CORS preflight for ' + origin).toBe(200);
        expect(response.headers()['access-control-allow-origin']).toBe(origin);
        const allowedHeaders = response.headers()['access-control-allow-headers'] || '';
        for (const header of ['authorization', 'apikey', 'content-type', 'x-client-info']) {
          expect(allowedHeaders.toLowerCase()).toContain(header);
        }
      }
    }
  });

  test('critical public routes return valid HTML on desktop and mobile', async ({ page, request }) => {
    const routes = [
      ['archive/', /LOREVERSE/i],
      ['knowledge/', /LOREVERSE/i],
      ['games/', /LOREVERSE/i],
      ['games/genshin-impact/', /Genshin/i],
      ['games/genshin-impact/characters/', /Genshin|дүр/i],
      ['community/', /LOREVERSE/i],
      ['community/feed/', /LOREVERSE/i],
      ['chat/', /LOREVERSE/i],
      ['store/', /LOREVERSE/i],
      ['marketplace/', /LOREVERSE/i],
      ['profile/', /LOREVERSE/i],
      ['rank/', /LOREVERSE/i],
      ['bug-report/', /Bug Hunter|LOREVERSE/i],
      ['ai/', /LOREVERSE/i],
      ['legal/', /LOREVERSE/i],
      ['status/', /LOREVERSE/i],
      ['account-deletion/', /LOREVERSE/i]
    ];

    for (const [route, titlePattern] of routes) {
      const url = new URL(route, baseURL).toString();
      const response = await request.get(url);
      expect(response.status(), route + ' should be available').toBe(200);
      expect(response.headers()['content-type'] || '', route + ' should return HTML').toContain('text/html');

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('body')).toBeVisible();
      await expect(page).toHaveTitle(titlePattern);
    }
  });

  test('bug report page keeps submission behind authentication', async ({ page }) => {
    const response = await page.goto(new URL('bug-report/', baseURL).toString(), { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    expect(response.status()).toBe(200);
    await expect(page.locator('#authPanel')).toBeVisible();
    await expect(page.locator('#appPanel')).toBeHidden();
    await expect(page.locator('#formPanel')).toBeHidden();
    await expect(page.locator('#bugForm')).toHaveCount(1);
  });

  test('mobile homepage navigation is keyboard accessible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    const toggle = page.locator('#menuBtn');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#mainNav')).toHaveClass(/open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Enter');
    await expect(page.locator('#mainNav')).not.toHaveClass(/open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('public staff-only pages are not indexed', async ({ request }) => {
    for (const route of ['admin/', 'editorial/', 'archive/manage.html']) {
      const response = await request.get(new URL(route, baseURL).toString());
      expect(response.status(), route + ' should be reachable for its login gate').toBe(200);
      const html = await response.text();
      expect(html, route + ' should contain a noindex directive').toMatch(/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i);
    }
  });

  test('primary public pages have no uncaught JavaScript exceptions at startup', async ({ browser }) => {
    const routes = ['/', 'bug-report/', 'store/', 'profile/', 'community/'];
    for (const route of routes) {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(new URL(route, baseURL).toString(), { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);
      expect(errors, route + ' should not throw uncaught JavaScript exceptions').toEqual([]);
      await page.close();
    }
  });

});
