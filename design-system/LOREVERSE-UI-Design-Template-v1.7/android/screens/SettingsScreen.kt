package com.loreverse.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.TextButton
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.loreverse.ui.theme.LoreverseColors

@Composable
fun LoreverseSettingsScreen(modifier: Modifier = Modifier, onBack: () -> Unit = {}) {
    var notifications by remember { mutableStateOf(true) }
    var darkMode by remember { mutableStateOf(true) }
    Column(modifier = modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        TextButton(onClick = onBack) { Text("← Буцах") }
        Text("Тохиргоо", style = MaterialTheme.typography.headlineSmall)
        SettingsToggle("Мэдэгдэл", notifications) { notifications = it }
        SettingsToggle("Dark Mode", darkMode) { darkMode = it }
        listOf("Хэл · Монгол", "Данс ба аюулгүй байдал", "Тусламж / Дэмжлэг", "Аппын тухай · LOREVERSE v1.0.0").forEach { label ->
            Card(colors = CardDefaults.cardColors(containerColor = LoreverseColors.Surface)) {
                Text(label, modifier = Modifier.padding(18.dp))
            }
        }
    }
}

@Composable
private fun SettingsToggle(label: String, checked: Boolean, onCheckedChange: (Boolean) -> Unit) {
    Card(colors = CardDefaults.cardColors(containerColor = LoreverseColors.Surface)) {
        androidx.compose.foundation.layout.Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(label, modifier = Modifier.weight(1f).padding(top = 12.dp))
            Switch(checked = checked, onCheckedChange = onCheckedChange)
        }
    }
}
