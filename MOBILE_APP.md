# LOREVERSE Mobile App

Android and iOS wrapper for the existing LOREVERSE website, using Capacitor. The site remains the single source of truth: homepage, anime catalogue, lore archive, games, manga, membership, Premium, Supabase-backed member profiles, community and chat are copied into the native app bundle.

## Requirements

- Node.js 20+
- Android Studio + Android SDK for Android builds
- macOS + Xcode for iOS builds (iOS builds cannot be produced on Windows)
- Google Play Console developer account for Play Store distribution
- Apple Developer Program membership for App Store distribution

## Local setup

```bash
npm install
npm run build
npx cap add android
npx cap add ios
npx cap sync
```

If the native platform folders already exist, use `npx cap sync android` or `npx cap sync ios` after `npm run build`.

## Open native projects

```bash
npx cap open android
npx cap open ios
```

Android: in Android Studio, test on a device/emulator, then use **Build > Generate Signed Bundle / APK** to create a signed Android App Bundle (AAB) for Google Play.

iOS: on macOS, open the Xcode workspace, set the Apple Developer Team and signing profile, select an iOS device/archive destination, then **Product > Archive** and upload through App Store Connect.

## App identity

- Display name: LOREVERSE
- Bundle ID / Application ID: `mn.loreverse.app`
- Web content: `www/` generated from the existing website
- Theme: near-black with orange/gold accents

Do not change the app ID after publishing; store listings and upgrades depend on it.

## Release checklist

- Create production app icons in required PNG sizes (Android adaptive icon and iOS AppIcon set).
- Add launch/splash artwork and verify safe areas on real devices.
- Test sign-in, Supabase Auth, profile photo uploads, chat, stickers, Premium/payment flows, links, search, and external AniList poster loading on Android and iOS.
- Add a public privacy policy URL and support contact.
- Complete Google Play Data safety, content rating, target audience, app access, and store listing.
- Complete App Store privacy details, age rating, review notes, screenshots, and App Store Connect metadata.
- Verify third-party artwork, logos, and any streaming/video rights. The app must not imply it has distribution rights to copyrighted anime episodes.
- Use HTTPS endpoints only. Never embed Supabase service-role keys or other secrets in the app.

## Important

This repository change prepares the Capacitor project configuration and build source. It does not create signed APK/AAB/IPA files or publish either store listing. Those steps require the platform toolchains, developer accounts, signing credentials, device testing, and store review.
