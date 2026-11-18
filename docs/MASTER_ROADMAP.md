# LOREVERSE MASTER ROADMAP
Version: 1.0
Status: Active planning baseline
Owner: LOREVERSE
Last updated: 2026-11-18

## Product vision
LOREVERSE is one integrated Anime, Manga, Lore, Gaming, AI and Community platform. Users have one account, one profile, one permission model and a consistent experience across web and Android.

## Product principles
1. Reliability before feature count.
2. One canonical source of truth for each data domain.
3. Server-side authorization and validation for rewards, payments and privileged actions.
4. Published knowledge must have editorial review and source attribution.
5. Mobile-first UX and feature parity for core user journeys.
6. Ship in measurable phases; do not start every module at once.

## Scope decision: payments and wallet
- EXCLUDED: direct QPay wallet top-up / direct LORE Coins recharge.
- LORE Coins are earned through approved platform activity and reward rules; no direct cash-to-coin purchase in this roadmap.
- QPay may be considered later only for explicit checkout transactions such as Premium membership or a digital product, after merchant credentials, server-side callback verification, refunds and reconciliation are validated.
- Do not represent a payment as successful based only on a browser redirect or client-side status.

## Existing foundation (to verify in Phase 0)
- Static web app hosted through GitHub Pages / Cloudflare Pages workflow.
- Supabase Auth, Postgres, Storage, RLS.
- Lore Archive: franchises, works, entities, relations, timeline and translations.
- Editorial and AI draft workflow.
- Gaming UID lookup, chat, community, profiles, rewards, memberships and payment-related tables.
- Capacitor Android application.
- Bug Hunter reporting and staff review workflow.

Existing modules are not considered production-ready until tested using real user roles and end-to-end scenarios.

## Delivery plan

### Phase 0 — Stabilization and audit (Weeks 1–2)
Deliverables:
- Inventory all routes, forms, Edge Functions, tables, storage buckets and GitHub workflows.
- Fix static smoke-test drift (including the current catalogTabs check mismatch) and add route-level checks.
- Run database/RLS audit for public, authenticated, editor, admin and owner roles.
- Verify Storage access rules and upload limits.
- Verify Android build, package ID, signing certificate and upgrade path independently.
- Add backup/restore and migration rollback procedures.
Acceptance:
- Main branch checks pass.
- Critical pages load and their core flows pass.
- No privileged key in client assets.
- No production APK update is advertised unless package ID and signing certificate are verified.

### Phase 1 — Unified identity and platform shell (Weeks 3–4)
Deliverables:
- One profile contract across web, chat, community and gaming.
- Consistent account settings, avatar, username, privacy and notification preferences.
- Shared navigation and design tokens for mobile and desktop.
- Central role/permission checks.
- User blocking, reporting and account safety controls.
Acceptance:
- One login works across all modules.
- Profile changes appear consistently.
- Permission tests confirm users cannot access staff-only actions.

### Phase 2 — Lore Knowledge Platform (Weeks 5–8)
Deliverables:
- Complete Franchise → Work → Entity → Relation → Timeline navigation.
- Character/entity profile pages and related-content links.
- Canon / theory / speculation separation.
- Source references, spoiler level and language metadata.
- Editorial workflow with draft, review, publish, revision history and audit trail.
- Lore AI retrieval limited to published, source-attributed archive content; answers distinguish evidence from theory.
Acceptance:
- A reader can navigate from a franchise to a work, character, relations and timeline.
- Every AI factual answer can show supporting archive references or explicitly say sources are insufficient.
- Unreviewed AI drafts are never public.

### Phase 3 — Gaming Hub (Weeks 9–11)
Deliverables:
- Game landing pages and game catalog.
- UID lookup integrations with documented supported games and limits.
- Guides, characters, builds, equipment and game update/event content.
- Clear source attribution and stale-data indicators.
- User game profiles only where official/authorized APIs permit.
Acceptance:
- Every UID provider has timeout, error and rate-limit handling.
- Unsupported games are clearly identified rather than returning fabricated results.

### Phase 4 — Community 2.0 (Weeks 12–14)
Deliverables:
- Posts, comments, reactions, follows and topic channels.
- Direct messages and group/community channels.
- Events, quizzes and moderated discussions.
- Staff moderation queue, user reports, blocks, mute and ban.
- Bug Hunter workflow and anti-duplicate reward controls.
Acceptance:
- Users can report abuse and moderators can resolve it.
- Moderation actions are audited.
- Reward issuance is server-side, idempotent and review-gated.

### Phase 5 — Membership and commerce (Weeks 15–17)
Deliverables:
- Premium plan entitlements and expiry handling.
- Order and payment state machine for specific purchases only.
- If QPay is enabled: server-side invoice creation, callback handling, payment verification, idempotency, refunds and reconciliation.
- Digital product catalog and delivery rules.
- Revenue and conversion dashboard.
Explicit non-deliverable:
- No direct QPay wallet/LORE Coins top-up.
Acceptance:
- No entitlement is granted from a client-only signal.
- Duplicate callbacks cannot duplicate an order or entitlement.
- Refund and failed-payment cases are tested.

### Phase 6 — Android and release quality (Weeks 18–20)
Deliverables:
- Core web journeys verified in Capacitor Android.
- Push notifications and deep links where supported.
- Offline caching for selected read-only content.
- Crash/error telemetry and performance checks.
- Production signing and release checklist.
Acceptance:
- Production update is signed with the verified existing key or a documented official recovery path.
- Test builds remain separate from production package.
- Core flows pass on representative Android devices.

### Phase 7 — Growth and optimization (Weeks 21–24)
Deliverables:
- Search quality, recommendations and personalization.
- Localization expansion.
- SEO and share previews.
- Analytics for activation, retention, content quality and revenue.
- Performance, accessibility and security improvements.
Acceptance:
- Product decisions are based on measured usage, not feature count.

## First 30-day execution checklist
- [ ] Complete repository and route inventory.
- [ ] Resolve smoke-test failures and make checks reflect actual UI.
- [ ] Complete Supabase RLS and Storage policy review.
- [ ] Document current Android signing status and safe upgrade path.
- [ ] Define canonical user profile and permission model.
- [ ] Define LORE Coins ledger and server-side reward rules.
- [ ] Normalize mobile navigation and design tokens.
- [ ] Confirm Lore Archive data model and editorial acceptance criteria.

## Operating model
- Work in small pull requests/commits with one concern per change.
- Every schema change uses a versioned migration.
- Every privileged action is checked server-side.
- Every feature has acceptance criteria and a rollback plan.
- Keep staging/test and production data and app identifiers separate.
- Do not claim a feature is complete until its end-to-end test passes.

## Core product KPIs (initial targets, not current results)
- 1,000 registered users.
- 300 monthly active users.
- 25%+ 7-day returning-user rate.
- 200 reviewed/published high-quality lore entries.
- 100 monthly community contributors.
- 3–5% Premium conversion after paid plans are launched.
- 98%+ successful payment completion for supported checkout flows.

## Immediate next action
Execute Phase 0 only. Do not expand into additional feature work until stabilization, security review and Android signing status are documented.
