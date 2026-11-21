# Android build integration checklist

This template contains Compose UI source files, not a standalone Gradle project or APK.

## Required app dependencies
Use versions aligned with the destination project's existing Compose BOM and Kotlin/Compose plugin:
- `androidx.compose.material3:material3`
- `androidx.compose.material:material-icons-extended`
- `androidx.activity:activity-compose`
- Compose runtime, UI and foundation artifacts (normally provided by the Compose BOM setup)

## Integration
1. Copy the `android/` Kotlin source into the destination app's source set.
2. Change `com.loreverse` package declarations to match the app namespace if needed.
3. Add the dependencies above using the project's existing version catalog.
4. Set the app's root content to `LoreverseAppShell()`.
5. Run Gradle sync, compile, and test on a physical Android device or emulator.
6. Replace demo lists and placeholder callbacks with repository/use-case calls.

## Current behavior
- Bottom navigation changes the selected local screen.
- Home "Бүх контент үзэх" opens the Anime category.
- Category filter chips filter the local demo list.
- Detail tabs switch local text panels.
- Settings switches update local UI state only.

## Not yet implemented
- Supabase data loading, authentication, persistence and Row Level Security.
- Production navigation/deep links/back-stack behavior.
- Real image loading, search, notifications, bookmarks and user settings persistence.
- Build configuration, signing, APK generation and device QA.

## v1.6 integration audit
- `ProfileMetric` now receives its width modifier from the enclosing `RowScope`; this avoids calling `weight` from a non-RowScope composable.
- Category sample data now changes by destination (anime, manga, games) instead of reusing anime entries everywhere.
- The category filter uses a shared “Үргэлжилж буй” label.
- This template still does not contain a complete Gradle project, AndroidManifest.xml, launcher Activity, or a lockfile/version catalog. Copy the source into an existing Compose app and resolve dependencies there before building.
- The bottom navigation uses Material icons from the extended icon set; include `androidx.compose.material:material-icons-extended` or replace those icons with assets already present in the host project.
- No APK build or emulator/device test is claimed by this template package.
