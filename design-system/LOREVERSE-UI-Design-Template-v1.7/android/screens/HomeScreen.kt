package com.loreverse.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.loreverse.ui.components.LoreverseContentCard
import com.loreverse.ui.components.LoreversePrimaryButton
import com.loreverse.ui.theme.LoreverseColors

private data class DemoContent(val title: String, val category: String, val subtitle: String)

@Composable
fun LoreverseHomeScreen(
    onOpenContent: (String) -> Unit,
    onSeeAll: () -> Unit,
    modifier: Modifier = Modifier
) {
    val featured = listOf(
        DemoContent("Genshin Impact", "Онцлох Lore", "Тейватын ертөнцийн нууцууд"),
        DemoContent("ANANTA LORE #012", "Lore судалгаа", "Chaos хэрхэн үүсдэг вэ?"),
        DemoContent("Attack on Titan", "Анимэ", "Дэлгэрэнгүй мэдээлэл")
    )

    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("LOREVERSE", style = MaterialTheme.typography.headlineMedium, color = LoreverseColors.TextPrimary)
                Text("Anime · Manga · Game · Lore", style = MaterialTheme.typography.bodyMedium, color = LoreverseColors.TextSecondary)
            }
        }
        item { LoreversePrimaryButton("Бүх контент үзэх", onSeeAll) }
        item { Text("Онцлох контент", style = MaterialTheme.typography.titleLarge) }
        items(featured) { item ->
            LoreverseContentCard(
                title = item.title,
                category = item.category,
                subtitle = item.subtitle,
                onClick = { onOpenContent(item.title) }
            )
        }
    }
}
