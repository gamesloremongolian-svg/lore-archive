package com.loreverse.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.AssistChip
import androidx.compose.material3.TextButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.loreverse.ui.components.LoreversePrimaryButton

@Composable
fun LoreverseDetailScreen(
    title: String,
    modifier: Modifier = Modifier,
    onSave: () -> Unit = {},
    onBack: () -> Unit = {}
) {
    val tabs = listOf("Тойм", "Lore", "Түүх", "Холбоо", "Медиа")
    var selectedTab by remember { mutableIntStateOf(0) }
    Column(modifier = modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        TextButton(onClick = onBack) { Text("← Буцах") }
        Text(title, style = MaterialTheme.typography.headlineMedium)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            AssistChip(onClick = {}, label = { Text("Genshin Impact") })
            AssistChip(onClick = {}, label = { Text("Дүрийн Lore") })
        }
        LoreversePrimaryButton("Хадгалах", onSave)
        TabRow(selectedTabIndex = selectedTab) {
            tabs.forEachIndexed { index, label ->
                Tab(selected = selectedTab == index, onClick = { selectedTab = index }, text = { Text(label) })
            }
        }
        Text(
            when (selectedTab) {
                0 -> "Товч танилцуулга болон үндсэн мэдээлэл."
                1 -> "Lore мэдээлэл болон ертөнцийн тайлбар."
                2 -> "Үйл явдлын дараалал болон түүх."
                3 -> "Холбоотой дүр, газар, үйл явдал."
                else -> "Зураг болон бусад медиа."
            },
            style = MaterialTheme.typography.bodyLarge
        )
    }
}
