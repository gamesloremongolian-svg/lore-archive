# LOREVERSE Android Release

This workflow creates an Android App Bundle (AAB) for Google Play.

## Build

1. Open the repository's **Actions** tab.
2. Select **LOREVERSE Android Release AAB**.
3. Select **Run workflow** on the `main` branch.
4. Download the artifact from the completed run.

The workflow sets both `compileSdkVersion` and `targetSdkVersion` to API 36, which is required for new Google Play apps from August 31, 2026.

## Signing key setup

A Google Play upload must be signed. Keep the upload keystore and passwords private. Never commit the keystore to this repository or send it in chat.

Create a dedicated upload key on a trusted computer with Java's `keytool`:

```bash
keytool -genkeypair -v -keystore loreverse-upload-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias loreverse-upload
```

Back up `loreverse-upload-key.jks securely in at least two private locations. Losing it can complicate app updates. Do not regenerate it for later releases.

Convert the keystore to Base64:

- macOS/Linux: `base64 -w 0 loreverse-upload-key.jks` (on macOS use `base64 loreverse-upload-key.jks | tr -d '\\n'`).
- Windows PowerShell: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("loreverse-upload-key.jks")) | Set-Clipboard`

In GitHub, open **Settings → Secrets and variables → Actions → New repository secret** and add these four secrets:

- `ANDROID_KEYSTORE_BASE64` — the Base64 output
- `ANDROID_KEYSTORE_PASSWORD` — the keystore password
- `ANDROID_KEY_ALIAS` — for the command above, `loreverse-upload`
- `ANDROID_KEY_PASSWORD` — the key password

Run the workflow again. It signs the AAB and verifies the signature. The artifact name will be `LOREVERSE-release-signed`.

If the secrets are not configured, the workflow still creates an **unsigned test-only AAB**. It is useful for checking that the release build works, but it must not be uploaded to Google Play.

## Before production

- Test the app on real Android devices, including login, Supabase, uploads, chat, links and payment/membership flows.
- Complete Play Console app content, privacy policy, Data safety, content rating, target audience and store listing.
- For new personal developer accounts created after November 13, 2023, Google requires a closed test with at least 12 testers opted in continuously for 14 days before applying for production access.
- Keep the `applicationId` as `mn.loreverse.app` for future updates.
