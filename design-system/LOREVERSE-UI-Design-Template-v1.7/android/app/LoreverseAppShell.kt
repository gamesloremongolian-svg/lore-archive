package com.loreverse.ui.app

import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.saveable.rememberSaveable
import com.loreverse.ui.components.LoreverseBottomNavigation
import com.loreverse.ui.screens.LoreverseCategoryScreen
import com.loreverse.ui.screens.LoreverseDetailScreen
import com.loreverse.ui.screens.LoreverseHomeScreen
import com.loreverse.ui.screens.LoreverseProfileScreen
import com.loreverse.ui.screens.LoreverseSettingsScreen
import com.loreverse.ui.theme.LoreverseTheme

/**
 * A small in-template navigation shell.
 * Replace this state-based router with the host app's NavHost when integrating
 * into an existing application with deep links, saved state or nested graphs.
 */
@Composable
fun LoreverseAppShell(modifier: Modifier = Modifier) {
    var selectedRoute by rememberSaveable { mutableStateOf("home") }
    var showSettings by rememberSaveable { mutableStateOf(false) }
    var selectedContent by rememberSaveable { mutableStateOf<String?>(null) }

    LoreverseTheme {
        Scaffold(
            modifier = modifier,
            bottomBar = {
                if (!showSettings && selectedContent == null) {
                    LoreverseBottomNavigation(
                        selectedRoute = selectedRoute,
                        onDestinationSelected = { selectedRoute = it }
                    )
                }
            }
        ) { innerPadding ->
            when {
                showSettings -> LoreverseSettingsScreen(
                    modifier = Modifier.padding(innerPadding),
                    onBack = { showSettings = false }
                )
                selectedContent != null -> LoreverseDetailScreen(
                    title = selectedContent!!,
                    modifier = Modifier.padding(innerPadding),
                    onSave = { /* Connect to repository/bookmark use case */ },
                    onBack = { selectedContent = null }
                )
                selectedRoute == "home" -> LoreverseHomeScreen(
                    onOpenContent = { selectedContent = it },
                    onSeeAll = { selectedRoute = "anime" },
                    modifier = Modifier.padding(innerPadding)
                )
                selectedRoute == "anime" -> LoreverseCategoryScreen(
                    title = "Анимэ",
                    modifier = Modifier.padding(innerPadding),
                    onOpenContent = { selectedContent = it }
                )
                selectedRoute == "manga" -> LoreverseCategoryScreen(
                    title = "Манга",
                    modifier = Modifier.padding(innerPadding),
                    onOpenContent = { selectedContent = it }
                )
                selectedRoute == "games" -> LoreverseCategoryScreen(
                    title = "Тоглоом",
                    modifier = Modifier.padding(innerPadding),
                    onOpenContent = { selectedContent = it }
                )
                selectedRoute == "profile" -> LoreverseProfileScreen(
                    modifier = Modifier.padding(innerPadding),
                    onOpenSettings = { showSettings = true }
                )
                else -> LoreverseHomeScreen(
                    onOpenContent = { selectedContent = it },
                    onSeeAll = { selectedRoute = "anime" },
                    modifier = Modifier.padding(innerPadding)
                )
            }
        }
    }
}
