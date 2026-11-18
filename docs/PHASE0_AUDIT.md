# LOREVERSE Phase 0 — Initial Audit Snapshot

Date: 2026-11-18
Repository: loreverse-ctrl/lore-archive
Branch reviewed: main

## Scope and evidence

This is a static repository review of the files listed below. It is not a live penetration test, a Supabase project inspection, a production browser test, or a locally executed Android build. Findings are therefore separated into confirmed repository facts and items that still require runtime verification.

Reviewed:
- `package.json`
- `scripts/check-web.mjs`
- `playwright.config.js`
- `tests/website.spec.js`
- `.github/workflows/website-auto-test.yml`
- `.github/workflows/android-release.yml`
- `capacitor.config.ts`
- Community feed and registered-user migration SQL files

## Confirmed positive controls

1. Capacitor package ID is `mn.loreverse.app`.
2. The Android release workflow checks the APK package ID and verifies the APK signing certificate against a fixed SHA-256 fingerprint before copying the APK into the release artifact directory.
3. The workflow fails closed if it cannot open a configured keystore or if the signing certificate does not match the expected fingerprint.
4. The web source contains a Supabase publishable key, and the inspected `index.html` does not contain the literal `service_role` string.
5. Community tables have RLS enabled. The registered-user migration adds an explicit check that social actions are not performed by anonymous Auth sessions.
6. The website has Playwright end-to-end tests and a JavaScript syntax-check script.

## Findings and required follow-up

### P0-01 — Run the syntax checker in CI
- Evidence: `package.json` defines `check:web` as `node scripts/check-web.mjs`.
- Evidence: `.github/workflows/website-auto-test.yml` runs `npm run test:e2e`, but does not run `npm run check:web`.
- Risk: inline JavaScript syntax regressions may not be caught by the current CI job.
- Action: add the syntax-check step after dependency installation, then confirm the workflow passes before merging further UI changes.

### P0-02 — Confirm live E2E target and crawler URLs
- Evidence: `tests/website.spec.js` defaults to the GitHub Pages URL, while its canonical-link assertion expects `https://lore-archive.pages.dev/`. The workflow overrides the base URL to a local HTTP server.
- Risk: local CI can pass while the configured default/manual target or deployed sitemap/robots host is inconsistent.
- Action: verify the actual production host and align the test default, sitemap and robots expectations to that single canonical deployment.

### P0-03 — Community moderation controls are incomplete at the database layer
- Evidence: the inspected community schema supports post/comment status values and staff checks. It has no user-report table in the reviewed migration. The comment policies allow creation and deletion, but the reviewed SQL does not provide a moderator comment-status update policy.
- Risk: users cannot rely on a complete report-to-review-to-resolution workflow based on these migrations alone.
- Action: design a versioned migration for user reports, staff-only review/update permissions, and an append-only moderation audit log. Do not apply until the actual Supabase schema and current policies are reconciled.

### P0-04 — Community media is intentionally public; validate the privacy model
- Evidence: the community-media bucket is created as public, and a public read policy is added for that bucket. Uploads are restricted to a user-owned storage folder and selected image MIME types.
- Risk: anything uploaded to this bucket may be publicly retrievable. It must not be used for private messages, private profile media, or sensitive files.
- Action: confirm this is the intended public-post-media behavior and verify file-size/type enforcement and deletion behavior in the live Supabase project.

### P0-05 — Android signing needs an independent installed-app comparison
- Evidence: the workflow checks package ID `mn.loreverse.app` and expects certificate SHA-256 `1651193714a7e5610bbdc20fa228374db1728a955bc2e880b55e9def2f5ad343`.
- Risk: repository configuration alone does not prove that the APK currently installed on the user's phone has that same certificate.
- Action: compare the installed APK's signing certificate with the expected fingerprint, then build and verify a test APK. Do not uninstall the installed app or publish an update until the match is confirmed.

## Not verified yet

- Actual Supabase tables, deployed RLS policies, Storage bucket configuration, Auth roles, Edge Functions and secrets.
- Whether the production site currently serves the expected canonical domain, sitemap and robots file.
- Current GitHub Actions run status and test results.
- Actual Android APK package ID, signing certificate and in-place upgrade compatibility on the user's device.
- Backup/restore and migration rollback procedures.

## Next safe sequence

1. Add `npm run check:web` to website CI and verify the run.
2. Reconcile the production host and E2E URL expectations.
3. Inspect the live Supabase policies before writing or applying moderation migrations.
4. Verify the installed Android app's signing certificate before any APK replacement.
5. Only then proceed with Community 2.0 implementation.

No production database, user data, installed APK, or release artifact was modified during this static review.
