package com.loreverse.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.loreverse.ui.components.LoreverseContentCard

private data class CategoryItem(val title: String, val subtitle: String)

@Composable
fun LoreverseCategoryScreen(
    title: String,
    modifier: Modifier = Modifier,
    onOpenContent: (String) -> Unit = {}
) {
    var selectedFilter by remember { mutableStateOf("Бүгд") }
    val filters = listOf("Бүгд", "Үргэлжилж буй", "Дууссан")
    val items = when (title) {
        "Манга" -> listOf(
            CategoryItem("Berserk", "Манга · Dark Fantasy · Үргэлжилж буй"),
            CategoryItem("One Piece", "Манга · Адал явдал · Үргэлжилж буй"),
            CategoryItem("Chainsaw Man", "Манга · Action · Үргэлжилж буй"),
            CategoryItem("Vagabond", "Манга · Түүхэн · Завсарласан")
        )
        "Тоглоом" -> listOf(
            CategoryItem("Genshin Impact", "Тоглоом · Action RPG · Үргэлжилж буй"),
            CategoryItem("Honkai: Star Rail", "Тоглоом · Turn-based RPG · Үргэлжилж буй"),
            CategoryItem("Wuthering Waves", "Тоглоом · Action RPG · Үргэлжилж буй"),
            CategoryItem("Zenless Zone Zero", "Тоглоом · Action RPG · Үргэлжилж буй")
        )
        else -> listOf(
            CategoryItem("Attack on Titan", "Анимэ · 4 улирал · Дууссан"),
            CategoryItem("Jujutsu Kaisen", "Анимэ · 2 улирал · Одоо гарч буй"),
            CategoryItem("Demon Slayer", "Анимэ · 4 улирал · Одоо гарч буй"),
            CategoryItem("Sousou no Frieren", "Анимэ · 1 улирал · Дууссан")
        )
    }
    Column(modifier = modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text(title, style = MaterialTheme.typography.headlineSmall)
        androidx.compose.foundation.layout.Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            filters.forEach { filter ->
                FilterChip(
                    selected = selectedFilter == filter,
                    onClick = { selectedFilter = filter },
                    label = { Text(filter) }
                )
            }
        }
        LazyColumn(contentPadding = PaddingValues(bottom = 20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(items.filter {
                selectedFilter == "Бүгд" ||
                (selectedFilter == "Үргэлжилж буй" && (it.subtitle.contains("Одоо гарч буй") || it.subtitle.contains("Үргэлжилж буй"))) ||
                (selectedFilter == "Дууссан" && (it.subtitle.contains("Дууссан") || it.subtitle.contains("Завсарласан")))
            }) { item ->
                LoreverseContentCard(item.title, title, item.subtitle, onClick = { onOpenContent(item.title) })
            }
        }
    }
}
