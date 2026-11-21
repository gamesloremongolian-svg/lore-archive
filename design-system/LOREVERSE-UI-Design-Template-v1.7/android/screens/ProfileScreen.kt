package com.loreverse.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.loreverse.ui.theme.LoreverseColors

@Composable
fun LoreverseProfileScreen(
    username: String = "LoreMaster",
    modifier: Modifier = Modifier,
    onOpenSettings: () -> Unit = {}
) {
    Column(modifier = modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("Миний профайл", style = MaterialTheme.typography.headlineSmall)
        Text(username, style = MaterialTheme.typography.headlineMedium, color = LoreverseColors.Accent)
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            ProfileMetric("128", "Нийтлэл", Modifier.weight(1f))
            ProfileMetric("46", "Дуртай", Modifier.weight(1f))
            ProfileMetric("12", "Жагсаалт", Modifier.weight(1f))
        }
        listOf("Миний цуглуулга", "Үнэлгээ өгсөн", "Түүх (History)").forEach { label ->
            Card(colors = CardDefaults.cardColors(containerColor = LoreverseColors.Surface)) {
                Text(label, modifier = Modifier.padding(18.dp))
            }
        }
        Card(colors = CardDefaults.cardColors(containerColor = LoreverseColors.Surface)) {
            TextButton(onClick = onOpenSettings) { Text("Тохиргоо") }
        }
    }
}

@Composable
private fun ProfileMetric(value: String, label: String, modifier: Modifier = Modifier) {
    Card(modifier = modifier, colors = CardDefaults.cardColors(containerColor = LoreverseColors.Surface)) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(value, style = MaterialTheme.typography.titleLarge)
            Text(label, style = MaterialTheme.typography.labelSmall, color = LoreverseColors.TextSecondary)
        }
    }
}
