# LOREVERSE Native Android v2.0

A standalone Android application built with Kotlin and Jetpack Compose. It is not a WebView or Capacitor wrapper.

## Project
- Application ID: `mn.loreverse.app`
- Minimum Android: API 26
- Compile / target SDK: API 36
- JDK: 17
- UI: Jetpack Compose + Material 3
- Language: Mongolian

## Build a debug APK
From this directory:
```bash
gradle assembleDebug
```
The debug build intentionally uses the `.debug` application ID suffix so it can be installed beside the current production app during testing. The release variant retains `mn.loreverse.app`.

## Current scope
This initial native foundation includes onboarding, Home, Anime, Manga, Games, Lore, detail, Profile and Settings screens, plus working local navigation and sample data.

## Not yet production-connected
Authentication, Supabase data repositories, chat, payment/membership, remote content images, push notifications and production signing are not included in this initial foundation. Do not distribute this build as a production replacement until these integrations and device tests are complete.

## Upgrade compatibility
A release update over an existing installation requires the same application ID and the original signing certificate/private key. The debug build uses a separate package ID. Never commit keystores or passwords.
