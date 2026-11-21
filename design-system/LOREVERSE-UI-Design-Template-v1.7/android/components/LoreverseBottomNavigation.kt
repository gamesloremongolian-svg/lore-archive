package com.loreverse.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Gamepad
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Tv
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.vector.ImageVector
import com.loreverse.ui.theme.LoreverseColors

data class LoreverseDestination(val label: String, val icon: ImageVector, val route: String)

val loreverseDestinations = listOf(
    LoreverseDestination("Нүүр", Icons.Filled.Home, "home"),
    LoreverseDestination("Анимэ", Icons.Filled.Tv, "anime"),
    LoreverseDestination("Манга", Icons.Filled.Bookmark, "manga"),
    LoreverseDestination("Тоглоом", Icons.Filled.Gamepad, "games"),
    LoreverseDestination("Профайл", Icons.Filled.Person, "profile")
)

@Composable
fun LoreverseBottomNavigation(
    selectedRoute: String,
    onDestinationSelected: (String) -> Unit
) {
    NavigationBar(containerColor = LoreverseColors.Surface) {
        loreverseDestinations.forEach { destination ->
            NavigationBarItem(
                selected = selectedRoute == destination.route,
                onClick = { onDestinationSelected(destination.route) },
                icon = { Icon(destination.icon, contentDescription = destination.label) },
                label = { Text(destination.label) }
            )
        }
    }
}
