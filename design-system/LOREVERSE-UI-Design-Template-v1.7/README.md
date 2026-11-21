# LOREVERSE UI / DESIGN TEMPLATE v1.7.0

This is a reusable UI design-system reference bundle derived from the existing LOREVERSE Capacitor UI. It is not a standalone Android project or an installable APK.

## Contents
- `AUDIT-v1.7.md` — source palette audit and caveats
- `FINAL-QA.md` — package validation and limitations
- `tokens/design-tokens.json` — canonical design tokens
- `web/theme.css` and `web/preview.html` — three theme variants and browser preview
- `android/` — Jetpack Compose adaptation starter
- `screens/` and `components/` — UI specifications
- `reference/` — design reference board

## Themes
- `app-dark`: shared internal UI
- `guest-home-dark`: guest home redesign
- `content-light`: light content palette

Select themes by screen/context; do not merge these into one global palette.

## Android integration
Copy the Compose sources into the existing Android app, align package declarations and dependencies, then build and test in the host project. This package does not include Gradle settings, AndroidManifest, launcher Activity, backend wiring, or a built APK. See `android/Build-Integration.md` and `android/NavigationIntegration.md`.

## Verification
The source ZIP passed integrity checks; its three JSON specifications parsed successfully and the HTML preview parsed. No Gradle build, emulator run, or physical-device test is claimed.
