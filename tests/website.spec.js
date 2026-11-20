const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

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
    await expect(page.locator('.lv-shell-brand')).toContainText('LOREVERSE');
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
    await expect(page.locator('.lv-shell-toggle')).toHaveCount(1);
    await expect(page.locator('.lv-shell-nav')).toHaveCount(1);
    const shellNav = page.locator('.lv-shell-nav');
    for (const href of ['./ai/', './community/', './store/', './profile/', './games/']) {
      await expect(shellNav.locator(`a[href="${href}"]`)).toHaveCount(1);
    }
    await expect(shellNav.locator('.lv-shell-more summary')).toContainText('Бусад');
    await shellNav.locator('.lv-shell-more summary').click();
    await expect(shellNav.locator('a[href="./archive/"]')).toBeVisible();
    await expect(shellNav.locator('a[href="./marketplace/"]')).toBeVisible();
    await expect(shellNav.locator('a[href="./bug-report/"]')).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    const toggle = page.locator('.lv-shell-toggle');
    const nav = page.locator('.lv-shell-nav');
    await toggle.click();
    await expect(nav).toHaveAttribute('data-open', 'true');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await toggle.click();
    await expect(nav).toHaveAttribute('data-open', 'false');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('desktop navigation is visible, fits the header and does not show the mobile MENU button', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

    const nav = page.locator('.lv-shell-nav');
    const menuButton = page.locator('.lv-shell-toggle');
    await expect(nav).toBeVisible();
    await expect(menuButton).toBeHidden();

    for (const href of ['./', './games/', './ai/', './community/', './store/', './profile/']) {
      await expect(nav.locator(`a[href="${href}"]`).first(), href + ' should be visible in desktop navigation').toBeVisible();
    }
    await nav.locator('.lv-shell-more summary').click();
    for (const href of ['./archive/', './marketplace/', './rank/', './uid-lookup/', './bug-report/', './status/', './legal/']) {
      await expect(nav.locator(`a[href="${href}"]:visible`).first(), href + ' should be available in the More menu').toBeVisible();
    }
    await nav.locator('.lv-shell-more summary').click();

    const layout = await page.evaluate(() => {
      const header = document.querySelector('.lv-shell-header');
      const nav = document.querySelector('.lv-shell-nav');
      const brand = document.querySelector('.lv-shell-brand');
      const toggle = document.querySelector('.lv-shell-toggle');
      const rect = element => {
        const r = element.getBoundingClientRect();
        return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};
      };
      return {
        viewportWidth: document.documentElement.clientWidth,
        documentWidth: document.documentElement.scrollWidth,
        header: rect(header),
        nav: rect(nav),
        brand: rect(brand),
        themeToggle: toggle ? rect(toggle) : null
      };
    });
    expect(layout.documentWidth, 'Desktop header must not create horizontal page overflow').toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.nav.left).toBeGreaterThanOrEqual(layout.header.left);
    expect(layout.nav.right).toBeLessThanOrEqual(layout.header.right + 1);

    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(nav).toBeVisible();
    await expect(menuButton).toBeHidden();
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
    await expect(page.locator('#aiDoctorNavTab')).toHaveCount(1);
    await expect(page.locator('#aiDoctorTab')).toBeHidden();
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
    const toggle = page.locator('.lv-shell-toggle');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.lv-shell-nav')).toHaveAttribute('data-open', 'true');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Enter');
    await expect(page.locator('.lv-shell-nav')).toHaveAttribute('data-open', 'false');
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


  test('store purchase flow updates inventory and balance after a successful RPC', async ({ page }) => {
    await page.route('https://esm.sh/@supabase/supabase-js@2.119.0', route => route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `
        let coins = 100, purchased = false;
        const user = { id: 'test-user', email: 'test@loreverse.invalid' };
        const item = { id: 'test-frame', name: 'Test Frame', description: 'Automated test item', coin_cost: 40, item_type: 'profile_frame', icon: '✦', sort_order: 1, created_at: new Date().toISOString(), is_featured: false, is_limited: false };
        const query = table => {
          const q = { select(){return q}, eq(){return q}, order(){return q}, single(){return Promise.resolve({data:{lore_coins:coins},error:null})}, then(resolve,reject){let data=[];if(table==='lore_coin_items')data=[item];if(table==='user_reward_inventory'&&purchased)data=[{item_id:item.id}];return Promise.resolve({data,error:null}).then(resolve,reject)} };
          return q;
        };
        export function createClient(){
          return {
            auth:{getSession:async()=>({data:{session:{user}},error:null}),signOut:async()=>({error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},
            from:query,
            rpc:async(name,args)=>{if(name!=='redeem_lore_coins'||args.p_item_id!==item.id)return {data:null,error:{message:'Unexpected RPC'}};if(purchased)return {data:null,error:{message:'Already purchased'}};if(coins<item.coin_cost)return {data:null,error:{message:'Not enough LORE Coins'}};coins-=item.coin_cost;purchased=true;return {data:{success:true},error:null}}
          };
        }
      `
    }));
    await page.goto(new URL('store/', baseURL).toString(), { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#balance')).toContainText('100', { timeout: 10000 });
    await expect(page.locator('#items [data-preview="test-frame"]').first()).toBeVisible({ timeout: 10000 });
    await page.locator('#items [data-preview="test-frame"]').first().click();
    await expect(page.locator('#previewActions [data-modal-buy="test-frame"]')).toBeVisible();
    await page.locator('#previewActions [data-modal-buy="test-frame"]').click();
    await expect(page.locator('#balance')).toContainText('60');
    await expect(page.locator('#ownedCount')).toContainText('1');
    await expect(page.locator('#status')).toContainText('Худалдан авалт амжилттай');
  });

  test('store shows an RPC rejection without granting the item', async ({ page }) => {
    await page.route('https://esm.sh/@supabase/supabase-js@2.119.0', route => route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `
        const user={id:'test-user',email:'test@loreverse.invalid'};
        const item={id:'test-frame',name:'Test Frame',description:'Test',coin_cost:400,item_type:'profile_frame',icon:'✦',sort_order:1,created_at:new Date().toISOString()};
        const q=table=>{const x={select(){return x},eq(){return x},order(){return x},single(){return Promise.resolve({data:{lore_coins:20},error:null})},then(a,b){return Promise.resolve({data:table==='lore_coin_items'?[item]:[],error:null}).then(a,b)}};return x};
        export function createClient(){return {auth:{getSession:async()=>({data:{session:{user}},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:q,rpc:async()=>({data:null,error:{message:'Not enough LORE Coins'}})}}
      `
    }));
    await page.goto(new URL('store/', baseURL).toString(), { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#items [data-preview="test-frame"]').first()).toBeVisible({ timeout: 10000 });
    await page.locator('#items [data-preview="test-frame"]').first().click();
    await expect(page.locator('#previewActions [data-modal-buy="test-frame"]')).toBeVisible();
    await page.locator('#previewActions [data-modal-buy="test-frame"]').click();
    await expect(page.locator('#status')).toContainText('Not enough LORE Coins');
    await expect(page.locator('#ownedCount')).toContainText('0');
  });

  test('community sign-in reveals the authenticated app and handles an empty server list', async ({ page }) => {
    await page.route('https://esm.sh/@supabase/supabase-js@2.119.0', route => route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `
        const user={id:'test-user',email:'test@loreverse.invalid'};
        const emptyQuery=()=>{const q={select(){return q},eq(){return q},in(){return q},order(){return q},limit(){return q},then(a,b){return Promise.resolve({data:[],error:null}).then(a,b)}};return q};
        let session=null;
        export function createClient(){return {
          auth:{getSession:async()=>({data:{session},error:null}),signInWithPassword:async({email,password})=>{if(email!=='test@loreverse.invalid'||password!=='test-password')return {data:null,error:{message:'Invalid login credentials'}};session={user};return {data:{session},error:null}},onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},
          from:emptyQuery,channel:()=>({on(){return this},subscribe(){return this}}),removeChannel:async()=>{}
        }}
      `
    }));
    await page.goto(new URL('community/', baseURL).toString(), { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#auth')).toBeVisible();
    await page.locator('#email').fill('test@loreverse.invalid');
    await page.locator('#password').fill('test-password');
    await page.locator('#login button[type="submit"]').click();
    await expect(page.locator('#auth')).toHaveClass(/hidden/);
    await expect(page.locator('#app')).not.toHaveClass(/hidden/);
    await expect(page.locator('#message')).toBeDisabled();
    await expect(page.locator('#channels')).toContainText(/НЭЭЛТТЭЙ СЕРВЕРҮҮД|нээлттэй сервер алга/i);
  });


  test('native Android bottom navigation is visible and routes correctly in the built app', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.addInitScript(() => {
      Object.defineProperty(window, 'Capacitor', {
        configurable: true,
        value: { isNativePlatform: () => true, getPlatform: () => 'android' }
      });
    });

    for (const [route, active] of [
      ['/', 'home'],
      ['/community/', 'community'],
      ['/store/', 'store'],
      ['/profile/', 'profile']
    ]) {
      await page.goto(new URL(route, baseURL).toString(), { waitUntil: 'domcontentloaded' });
      const nav = page.locator('#loreverseAppNav');
      await expect(nav, route + ' should render the native bottom menu').toBeVisible();
      await expect(nav.locator('a[data-app-route]')).toHaveCount(5);
      await expect(nav.locator('[data-app-route="' + active + '"]')).toHaveAttribute('aria-current', 'page');
      const bounds = await nav.evaluate(element => {
        const r = element.getBoundingClientRect();
        return { left: r.left, right: r.right, bottom: r.bottom };
      });
      expect(bounds.left).toBeGreaterThanOrEqual(0);
      expect(bounds.right).toBeLessThanOrEqual(361);
      expect(bounds.bottom).toBeLessThanOrEqual(801);
    }

    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    await page.locator('#loreverseAppNav [data-app-route="community"]').click();
    await expect(page).toHaveURL(/\/community\/$/);
    await expect(page.locator('#loreverseAppNav')).toBeVisible();

    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    await page.locator('#loreverseAppNav [data-app-route="bug"]').click();
    await expect(page).toHaveURL(/openBugReport=1/);
  });

  test('QPay invoice creation requires idempotency and blocks duplicate invoice creation', () => {
    const migration = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20261120100000_add_qpay_idempotency.sql'), 'utf8');
    const handler = fs.readFileSync(path.join(__dirname, '../supabase/functions/qpay-payment/index.ts'), 'utf8');
    expect(migration).toMatch(/unique index if not exists payment_records_qpay_idempotency_uidx/i);
    expect(migration).toMatch(/user_id, purpose, idempotency_key/i);
    expect(handler).toMatch(/body\.idempotency_key/);
    expect(handler).toMatch(/invoice_creation_status === "created"/);
    expect(handler).toMatch(/existingMembership\.plan_code !== planCode/);
    expect(handler).toMatch(/existingReadError/);
    expect(handler).toMatch(/retry_safe: false/);
    expect(handler).toMatch(/invoice_creation_status: "unknown"/);
    expect(handler).toMatch(/QPay invoice outcome ambiguous/);
    expect(handler).toMatch(/invoice_response: responsePayload/);
    expect(handler).toMatch(/settle_qpay_membership_payment/);
    expect(handler).toMatch(/already_settled/);
    expect(handler).toMatch(/create_ebarimt/);
    expect(handler).toMatch(/payment.status !== "pending"/);
    expect(handler).toMatch(/\/v2\/ebarimt_v3\/create/);
    expect(handler).toMatch(/ebarimt_receiver_type/);
    expect(handler).toContain('String(ebarimt.barimt_status || "").toUpperCase() !== "REGISTERED"');
    expect(handler).toContain('ebarimt_receiver: receiver,');
    expect(handler).toContain('receiverType === "CITIZEN" && receiver');
    expect(handler).toMatch(/ebarimt_status: "unknown"/);
    expect(handler).toMatch(/qpay_payment_id/);
    expect(migration).toMatch(/ebarimt_status/);
    expect(migration).toMatch(/payment_records_qpay_payment_id_uidx/);
    expect(migration).toMatch(/pg_advisory_xact_lock/);
    expect(migration).toMatch(/for update/i);
    expect(migration).toMatch(/revoke all on function public\.settle_qpay_membership_payment/i);
    expect(migration).toMatch(/grant execute on function public\.settle_qpay_membership_payment.*service_role/i);
    const homepage = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
    expect(homepage).toMatch(/crypto\.randomUUID\(\)/);
    expect(homepage).toMatch(/idempotency_key:currentInvoiceIdempotencyKey/);
    expect(homepage).toMatch(/currentInvoiceIdempotencyKey=null/);
    expect(homepage).toMatch(/sessionStorage\.setItem\("loreverse_qpay_idempotency_key"/);
    expect(homepage).toMatch(/sessionStorage\.getItem\("loreverse_qpay_idempotency_key"/);
    expect(homepage).toMatch(/if\(data\?\.payment_id\)currentPaymentId=data\.payment_id/);
    expect(homepage).toMatch(/Төлбөрийн лавлах дугаар/);
    expect(homepage).toMatch(/Давхар нэхэмжлэлээс сэргийлж шинэ invoice автоматаар үүсгэхгүй/);
  });

});
