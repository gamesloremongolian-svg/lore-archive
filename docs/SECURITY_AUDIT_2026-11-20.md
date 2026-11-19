# LOREVERSE site and Android audit — 2026-11-20

## Scope and method

Reviewed the public repository tree and source for the landing page, site validation scripts, Playwright configuration, GitHub Actions workflows, Capacitor configuration/release documentation, admin user-management and account-deletion Edge Functions, QPay payment verification, AI Edge Functions, and community MOD migration. Inspected all seven user-supplied APKs by SHA-256 and embedded signing certificate.

This is a repository/source audit. A live authenticated end-to-end test against production Supabase/QPay, device install/upgrade test, and Play Console upload test were not possible in this review. Findings distinguish verified source/file evidence from items requiring production validation.

## Changes applied on this branch

1. **QPay payment verification**
   - Confirmation now accepts only pending MNT payment records with a finite positive amount.
   - It sums provider rows explicitly marked PAID and denominated in MNT, requiring that verified row total to cover the recorded invoice amount. It no longer relies on the provider aggregate paid_amount alone.
   - This reduces the risk of activating membership from an unrelated aggregate total, wrong-currency record, or non-pending payment.
   - Remaining limitation: robust concurrent/idempotent activation should ultimately be implemented in a database transaction/RPC with a unique payment-to-membership activation guard. This patch does not claim to solve that race.

2. **Admin Edge Function**
   - Unexpected Supabase/Auth exceptions are logged server-side and callers receive a generic error instead of raw exception text.
   - Authorization checks and role rules were left intact.

3. **Playwright configuration**
   - The default test base URL now matches the canonical production URL declared in the site's canonical metadata and sitemap: https://lore-archive.pages.dev/.
   - CI can still override it with BASE_URL for local tests.

## Verified findings and cautions

### Android signing certificate mismatch — release blocker to resolve before changing workflow
All seven uploaded APKs contain the same embedded certificate SHA-256 fingerprint:

`BA74E8D5E0650850DE90B08A53AFAB78040726C07BBF0EF14E20FB0066570550`

The six files named LOREVERSE (1).apk through LOREVERSE (6).apk are byte-identical by SHA-256:

`d68578f47d8cc48973dd37747baaed0e3096fcb53dd8e57df3633793e0f7cb8a`

`LOREVERSE.apk` is a different binary:

`6fa73bef6e745a28074c918f32f9f97fb467b2ff726870607573c6e1d94ad23a`,

but its embedded signing certificate is the same.

The existing .github/workflows/android-release.yml originally pinned a different certificate (`165119...D343`) and its latest run failed after the configured candidate keystore opened but did not match that pin. The seven APKs supplied in this conversation share the certificate fingerprint shown above (`BA74...0550`). Based on the prior confirmation that the user installed the new-key LOREVERSE app after uninstalling the previous version, the release workflow pin has been updated on this PR branch to `BA74E8D5E0650850DE90B08A53AFAB78040726C07BBF0EF14E20FB0066570550`. The workflow itself will perform the decisive keystore and generated-APK fingerprint checks when the PR is merged and the Android release job runs. If the app currently installed on the phone was instead installed from Google Play with a different Play App Signing certificate, this pin must not be treated as verified for that Play-distributed installation. Never run the new-key workflow for routine updates; a different signing key prevents in-place Android updates.

### New-key release workflow
The manually dispatched .github/workflows/android-release-newkey.yml documents that its APK uses a new signing key and requires uninstalling the old app. Treat it as a migration-only workflow, not a normal update workflow. Do not run it for routine releases.

### Other production validation still required
- Confirm deployed Supabase migrations match the repository, and review live RLS policies with the Supabase advisor.
- Exercise owner/admin/editor/moderator permissions using separate test accounts.
- Test QPay sandbox invoices, exact/partial/multiple payment rows, wrong currency, failed invoices, and repeated confirmation.
- Install and upgrade the Android app on a real device using the verified original signing key; verify login, uploads, chat, external links, keyboard resizing, and payment return flow.
- Confirm Play Console target API, app signing/upload-key relationship, privacy disclosures, and store listing.

## Checks not claimed as passed

The GitHub Actions workflows define JavaScript syntax, HTML/site-structure, Playwright, and Android build checks. Those checks have not yet run against this branch in this audit session. Use the pull request Actions results as the authoritative validation record.
