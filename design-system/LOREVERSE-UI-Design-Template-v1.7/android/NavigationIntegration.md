# Navigation integration guide

The template supplies screen composables and a five-item bottom navigation component. Connect them to the app's existing navigation framework.

Suggested route mapping:
- `home` → `LoreverseHomeScreen`
- `anime` → `LoreverseCategoryScreen(title = "Анимэ")`
- `manga` → `LoreverseCategoryScreen(title = "Манга")`
- `games` → `LoreverseCategoryScreen(title = "Тоглоом")`
- `profile` → `LoreverseProfileScreen`

Additional destinations:
- content detail → `LoreverseDetailScreen(title = selectedTitle)`
- settings → `LoreverseSettingsScreen`

Important:
- Add `androidx.compose.material:material-icons-extended` if using the bottom-navigation icons.
- Add the Material 3 Compose dependency.
- The sample screens use local demo content and local UI state. They are not connected to Supabase or a production content API.
- Verify imports and package namespace against the destination app before integrating.
