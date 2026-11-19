const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const admin = fs.readFileSync(path.join(__dirname, '..', 'admin', 'index.html'), 'utf8');
const migration = fs.readFileSync(
  path.join(__dirname, '..', 'supabase', 'migrations', '20261120130000_align_admin_community_support_rls.sql'),
  'utf8'
);

function roleTabs(role) {
  const match = admin.match(new RegExp(role + ':\\[([^\\]]*)\\]'));
  if (!match) throw new Error('Missing roleTabs entry: ' + role);
  return [...match[1].matchAll(/'([^']+)'/g)].map(item => item[1]);
}

function permissionMap(role) {
  const match = admin.match(/function can\\(action\\)\\{const map=\\{([\\s\\S]*?)\\};return/);
  if (!match) throw new Error('Could not locate can() permission map');
  const roleMatch = match[1].match(new RegExp(role + ':\\[([^\\]]*)\\]'));
  if (!roleMatch) return [];
  return [...roleMatch[1].matchAll(/'([^']+)'/g)].map(item => item[1]);
}

test.describe('LOREVERSE community/support role contract', () => {
  test('Owner and Admin see community and support; Editor does not', () => {
    for (const role of ['owner', 'admin']) {
      expect(roleTabs(role), role + ' tabs').toContain('community');
      expect(roleTabs(role), role + ' tabs').toContain('support');
      expect(permissionMap(role), role + ' permissions').toContain('community');
      expect(permissionMap(role), role + ' permissions').toContain('support');
    }
    expect(roleTabs('editor')).not.toContain('community');
    expect(roleTabs('editor')).not.toContain('support');
    expect(permissionMap('editor')).not.toContain('community');
    expect(permissionMap('editor')).not.toContain('support');
  });

  test('All privileged community/support handlers enforce the same role gate', () => {
    const guardedHandlers = [
      /async function loadCommunity\\(\\)\\{\\s*if\\(!can\\('community'\\)\\)return;/,
      /if\\(!can\\('community'\\)\\)return;[^\\n]*supabase\\.from\\('chat_messages'\\)\\.update/,
      /if\\(!can\\('community'\\)\\)return;[^\\n]*supabase\\.from\\('chat_moderation'\\)\\.insert/,
      /async function loadAdminTickets\\(\\)\\{\\s*if\\(!can\\('support'\\)\\)return;/,
      /async function openAdminTicket\\(id\\)\\{\\s*if\\(!can\\('support'\\)\\)return;/,
      /saveAdminTicketStatus'\\]\\.onclick=async\\(\\)=>\\{if\\(!can\\('support'\\)\\)return;/,
      /sendAdminTicketReply'\\]\\.onclick=async\\(\\)=>\\{if\\(!can\\('support'\\)\\)return;/
    ];
    for (const pattern of guardedHandlers) expect(admin).toMatch(pattern);
  });

  test('Migration restricts every staff moderation/support policy to Owner/Admin', () => {
    const policies = [
      'Staff moderate chat messages',
      'Staff manage chat moderation',
      'Staff update reports',
      'Users read own reports and staff read all',
      'Staff update support tickets',
      'Users read own support tickets',
      'Ticket participants read replies',
      'Staff reply to tickets'
    ];
    for (const policy of policies) {
      const start = migration.indexOf('create policy "' + policy + '"');
      expect(start, 'policy exists: ' + policy).toBeGreaterThanOrEqual(0);
      const next = migration.indexOf(';', start);
      const statement = migration.slice(start, next + 1);
      expect(statement, policy).toContain("public.is_staff(array['owner','admin'])");
      expect(statement, policy).not.toContain("'editor'");
    }
  });

  test('Migration preserves reporter and ticket-owner self access', () => {
    expect(migration).toMatch(/reporter_id = \\(select auth\\.uid\\(\\)\\) or public\\.is_staff/);
    expect(migration).toMatch(/user_id = \\(select auth\\.uid\\(\\)\\) or public\\.is_staff/);
    expect(migration).toMatch(/t\\.user_id = \\(select auth\\.uid\\(\\)\\)/);
  });
});
