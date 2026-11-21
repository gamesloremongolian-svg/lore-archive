# LOREVERSE Native Android v1.0.0

Standalone Kotlin + Jetpack Compose application (not a WebView / Capacitor wrapper).

## Project
- Application ID: `mn.loreverse.app`
- Debug application ID: `mn.loreverse.app.debug` (can coexist with the installed production app)
- Minimum Android: API 26; compile / target SDK: API 36
- JDK: 17; Jetpack Compose + Material 3
- Supabase Kotlin SDK: Auth + PostgREST modules

## Build a debug APK
From this directory run `gradle assembleDebug`. The GitHub Actions workflow builds the debug APK and publishes it as an artifact when the build and tests pass.

## Connected functionality
- Supabase Auth email/password sign-in and sign-up.
- Session restoration for the signed-in profile.
- Published franchise and Mongolian lore translation reads.
- Published news and store product reads.
- Community feed and feedback submission / ticket views.
- Owner visibility is gated by an active `owner` row in `staff_members`.
- Coil image loading includes SVG decoder support for the archive's original SVG covers.

## Known release limitations
- Owner Control Center is currently an access-gated placeholder, not a complete admin console.
- Chat, payment processing / membership, push notifications, persistent favorites/bookmarks, and production signing are not complete.
- Community posting and store checkout are not implemented in the native app.
- Physical-device testing has not been completed. GitHub Actions success is a build check, not proof of device behavior.
- Production release requires the original signing key for `mn.loreverse.app`; never commit keystores or passwords.

## Version
The app version is set to `1.0.0`. The debug variant appends `-debug` to the displayed version and uses the separate debug application ID.
