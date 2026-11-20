const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const admin = fs.readFileSync(path.join(__dirname, '..', 'admin', 'index.html'), 'utf8');
const migration = fs.readFileSync(
  path.join(__dirname, '..', 'supabase', 'migrations', '20261120130000_align_admin_community_support_rls.sql'),
  'utf8'
);

function extractRoleArray(source, marker) {
  const start = source.indexOf(marker);
  expect(start, 'role marker exists: ' + marker).toBeGreaterThanOrEqual(0);
  const open = source.indexOf('[', start);
  const close = source.indexOf(']', open);
  expect(open).toBeGreaterThanOrEqual(0);
  expect(close).toBeGreaterThan(open);
  return [...source.slice(open + 1, close).matchAll(/'([^']+)'/g)].map(x => x[1]);
}

function roleTabs(role) {
  return extractRoleArray(admin, role + ':');
}

function permissionMap(role) {
  const start = admin.indexOf('function can(action)');
  expect(start, 'can() function exists').toBeGreaterThanOrEqual(0);
  return extractRoleArray(admin.slice(start), role + ':');
}

function canRole(role, action) {
  const permissions = permissionMap(role);
  return permissions.includes('*') || permissions.includes(action);
}

test.describe('LOREVERSE community/support role contract', () => {
  test('Owner and Admin see community and support; Editor does not', () => {
    for (const role of ['owner', 'admin']) {
      expect(roleTabs(role), role + ' tabs').toContain('community');
      expect(roleTabs(role), role + ' tabs').toContain('support');
      expect(canRole(role, 'community'), role + ' community permission').toBe(true);
      expect(canRole(role, 'support'), role + ' support permission').toBe(true);
    }
    expect(roleTabs('editor')).not.toContain('community');
    expect(roleTabs('editor')).not.toContain('support');
    expect(canRole('editor', 'community')).toBe(false);
    expect(canRole('editor', 'support')).toBe(false);
  });

  test('Privileged community/support loaders and mutation handlers enforce role gates', () => {
    const requiredGuards = [
      "async function loadCommunity(){\n if(!can('community'))return;",
      "if(!can('community'))return;const {error}=await supabase.rpc('set_chat_message_pin'",
      "box.querySelectorAll('[data-resolve]').forEach(b=>b.onclick=async()=>{if(!can('community'))return;",
      "box.querySelectorAll('[data-delete-message]').forEach(b=>b.onclick=async()=>{if(!can('community'))return;",
      "if(!can('community')||!b.dataset.muteUser)return;",
      "async function loadAdminTickets(){\n if(!can('support'))return;",
      "async function openAdminTicket(id){\n if(!can('support'))return;",
      "saveAdminTicketStatus').onclick=async()=>{if(!can('support'))return;",
      "sendAdminTicketReply').onclick=async()=>{if(!can('support'))return;"
    ];
    for (const guard of requiredGuards) expect(admin).toContain(guard);
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
    expect(migration).toContain('reporter_id = (select auth.uid()) or public.is_staff');
    expect(migration).toContain('user_id = (select auth.uid()) or public.is_staff');
    expect(migration).toContain('t.user_id = (select auth.uid())');
  });
});
