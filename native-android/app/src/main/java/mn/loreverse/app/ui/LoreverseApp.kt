package mn.loreverse.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoStories
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Movie
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.SportsEsports
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Tv
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.TextButton
import androidx.compose.material3.Switch
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import mn.loreverse.app.ui.theme.Panel
import mn.loreverse.app.ui.theme.PanelRaised
import mn.loreverse.app.ui.theme.Purple
import mn.loreverse.app.ui.theme.TextMain
import mn.loreverse.app.ui.theme.TextMuted
import mn.loreverse.app.ui.theme.Violet
import mn.loreverse.app.ui.theme.Void
import mn.loreverse.app.data.ArchiveRepository
import mn.loreverse.app.data.PublishedFranchise
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.coroutines.launch
import mn.loreverse.app.data.AuthRepository
import mn.loreverse.app.data.CommunityRepository
import mn.loreverse.app.data.CommunityPost

private data class Destination(val id: String, val label: String, val icon: ImageVector)
private data class LoreItem(val title: String, val category: String, val description: String, val imageUrl: String? = null)

private val destinations = listOf(
    Destination("home", "Нүүр", Icons.Filled.Home),
    Destination("anime", "Анимэ", Icons.Filled.Movie),
    Destination("manga", "Манга", Icons.Filled.MenuBook),
    Destination("games", "Тоглоом", Icons.Filled.SportsEsports),
    Destination("profile", "Профайл", Icons.Filled.Person)
)

private val sampleItems = listOf(
    LoreItem("Genshin Impact", "Тоглоом · Lore", "Тейватын ертөнц, долоон үндэстэн ба тэдний нууц."),
    LoreItem("ANANTA LORE #012", "Судалгаа · Lore", "Chaos хэрхэн үүсдэг вэ?"),
    LoreItem("Attack on Titan", "Анимэ", "Титан, хананууд болон Eldia-гийн түүх."),
    LoreItem("Jujutsu Kaisen", "Анимэ", "Хараалын энерги ба шидтэнүүдийн ертөнц."),
    LoreItem("Sousou no Frieren", "Анимэ", "Адал явдлын дараах урт аялал.")
)

@Composable
fun LoreverseApp() {
    var entered by remember { mutableStateOf(false) }
    var selected by remember { mutableStateOf("home") }
    var selectedCategory by remember { mutableStateOf("Бүгд") }
    var detail by remember { mutableStateOf<LoreItem?>(null) }
    var settings by remember { mutableStateOf(false) }
    var searchOpen by remember { mutableStateOf(false) }
    var query by remember { mutableStateOf("") }
    var savedTitles by remember { mutableStateOf<Set<String>>(emptySet()) }
    var favoriteTitles by remember { mutableStateOf<Set<String>>(emptySet()) }
    var signedInEmail by remember { mutableStateOf<String?>(null) }

    Surface(modifier = Modifier.fillMaxSize(), color = Void) {
        if (!entered) {
            WelcomeScreen(onEnter = { entered = true })
        } else {
            Scaffold(
                containerColor = Void,
                bottomBar = {
                    if (detail == null && !settings) {
                        NavigationBar(containerColor = Panel) {
                            destinations.forEach { destination ->
                                NavigationBarItem(
                                    selected = selected == destination.id,
                                    onClick = { selected = destination.id },
                                    icon = { Icon(destination.icon, contentDescription = destination.label) },
                                    label = { Text(destination.label, fontSize = 10.sp) }
                                )
                            }
                        }
                    }
                }
            ) { padding ->
                when {
                    settings -> SettingsScreen(onBack = { settings = false }, onAuthSuccess = { signedInEmail = it; settings = false })
                    detail != null -> DetailScreen(
                        item = detail!!,
                        isSaved = detail!!.title in savedTitles,
                        isFavorite = detail!!.title in favoriteTitles,
                        onToggleSaved = { savedTitles = if (detail!!.title in savedTitles) savedTitles - detail!!.title else savedTitles + detail!!.title },
                        onToggleFavorite = { favoriteTitles = if (detail!!.title in favoriteTitles) favoriteTitles - detail!!.title else favoriteTitles + detail!!.title },
                        onBack = { detail = null }
                    )
                    selected == "home" -> HomeScreen(
                        onOpen = { detail = it },
                        onCategory = { selectedCategory = it; selected = if (it == "Анимэ") "anime" else if (it == "Манга") "manga" else if (it == "Тоглоом") "games" else "lore" },
                        onSearch = { searchOpen = !searchOpen },
                        searchOpen = searchOpen,
                        query = query,
                        onQuery = { query = it },
                        modifier = Modifier.padding(padding)
                    )
                    selected == "profile" -> ProfileScreen(email = signedInEmail, onSettings = { settings = true }, modifier = Modifier.padding(padding))
                    else -> CategoryScreen(
                        title = when (selected) { "anime" -> "Анимэ"; "manga" -> "Манга"; "games" -> "Тоглоом"; else -> "Lore" },
                        category = when (selected) { "anime" -> "anime"; "manga" -> "manga"; "games" -> "game"; else -> null },
                        onOpen = { detail = it },
                        modifier = Modifier.padding(padding)
                    )
                }
            }
        }
    }
}

@Composable
private fun WelcomeScreen(onEnter: () -> Unit) {
    Box(
        modifier = Modifier.fillMaxSize().background(
            Brush.verticalGradient(listOf(ColorHex(0xFF211044), Void, ColorHex(0xFF090914)))
        ).padding(28.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(18.dp)) {
            Box(
                modifier = Modifier.size(112.dp).clip(CircleShape)
                    .background(Brush.linearGradient(listOf(Purple, Violet))),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Filled.AutoStories, null, tint = TextMain, modifier = Modifier.size(58.dp))
            }
            Text("LOREVERSE", fontSize = 34.sp, fontWeight = FontWeight.ExtraBold, color = TextMain)
            Text("Anime · Manga · Game · Lore", color = TextMuted, fontSize = 14.sp)
            Spacer(Modifier.height(28.dp))
            Button(
                onClick = onEnter,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape = RoundedCornerShape(28.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Purple)
            ) { Text("Эхлэх", fontWeight = FontWeight.Bold) }
            OutlinedButton(onClick = onEnter, modifier = Modifier.fillMaxWidth().height(50.dp)) {
                Text("Зочны эрхээр үргэлжлүүлэх", color = TextMain)
            }
            Text("Монгол хэл дээрх анимэ, манга, тоглоомын ертөнц", color = TextMuted, fontSize = 11.sp)
        }
    }
}

@Composable
private fun HomeScreen(
    onOpen: (LoreItem) -> Unit,
    onCategory: (String) -> Unit,
    onSearch: () -> Unit,
    searchOpen: Boolean,
    query: String,
    onQuery: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var communityPosts by remember { mutableStateOf<List<CommunityPost>>(emptyList()) }
    var communityLoading by remember { mutableStateOf(true) }
    var communityError by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) {
        val communityResult = withContext(Dispatchers.IO) { CommunityRepository().getLatestPosts() }
        communityResult.onSuccess { communityPosts = it; communityError = false }
            .onFailure { communityError = true }
        communityLoading = false
    }
    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(modifier = Modifier.weight(1f)) {
                    Text("LOREVERSE", fontSize = 25.sp, fontWeight = FontWeight.ExtraBold, color = TextMain)
                    Text("Таны дуртай ертөнц нэг дор", color = TextMuted, fontSize = 12.sp)
                }
                IconButton(onClick = onSearch) { Icon(Icons.Filled.Search, "Хайх", tint = TextMain) }
                IconButton(onClick = {}) { Icon(Icons.Filled.Bookmark, "Хадгалсан", tint = TextMain) }
            }
        }
        if (searchOpen) {
            item {
                TextField(
                    value = query, onValueChange = onQuery,
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text("Анимэ, манга, Lore хайх...") },
                    singleLine = true,
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = Panel,
                        unfocusedContainerColor = Panel,
                        focusedTextColor = TextMain,
                        unfocusedTextColor = TextMain
                    )
                )
            }
        }
        item {
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = PanelRaised)
            ) {
                Column(
                    modifier = Modifier.fillMaxWidth().background(
                        Brush.linearGradient(listOf(ColorHex(0xFF3A176E), ColorHex(0xFF17152D), Panel))
                    ).padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text("LOREVERSE COMMUNITY", color = ColorHex(0xFFD8B4FE), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Text("Сонирхлоо хуваалц.\nХамтдаа хэлэлцье.", color = TextMain, fontSize = 25.sp, fontWeight = FontWeight.Bold)
                    Text("Анимэ, манга, тоглоомын ертөнцийн шинэ нийтлэл, асуулт, хэлэлцүүлэг.", color = TextMuted)
                    Text("Нийгэмлэгийн нийтлэлүүд", color = Violet, fontWeight = FontWeight.SemiBold)
                }
            }
        }
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Community", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextMain, modifier = Modifier.weight(1f))
                Text("Шинэ нийтлэлүүд", color = Violet, fontSize = 12.sp)
            }
        }
        if (communityLoading) {
            item { Text("Нийтлэлүүдийг ачаалж байна...", color = TextMuted) }
        } else if (communityError) {
            item { Text("Community мэдээлэл ачаалж чадсангүй. Дараа дахин оролдоно уу.", color = TextMuted) }
        } else if (communityPosts.isEmpty()) {
            item {
                Card(colors = CardDefaults.cardColors(containerColor = Panel), shape = RoundedCornerShape(18.dp)) {
                    Column(Modifier.fillMaxWidth().padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("Одоогоор нийтлэл алга", color = TextMain, fontWeight = FontWeight.SemiBold)
                        Text("Эхний хэлэлцүүлгийг эхлүүлэхийн тулд бүртгэлтэй хэрэглэгчээр нэвтэрнэ үү.", color = TextMuted)
                    }
                }
            }
        } else {
            items(communityPosts) { post ->
                Card(colors = CardDefaults.cardColors(containerColor = Panel), shape = RoundedCornerShape(18.dp)) {
                    Column(Modifier.fillMaxWidth().padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(post.category.uppercase(), color = Violet, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Spacer(Modifier.weight(1f))
                            Text(post.gameSlug.replace('-', ' ').uppercase(), color = TextMuted, fontSize = 10.sp)
                        }
                        Text(post.body, color = TextMain, maxLines = 5, overflow = TextOverflow.Ellipsis)
                        if (post.spoilerLevel != "none") {
                            Text("Спойлер: " + post.spoilerLevel, color = ColorHex(0xFFFBBF24), fontSize = 11.sp)
                        }
                    }
                }
            }
        }
        item { Text("Ангилал", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextMain) }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                CategoryTile("Анимэ", Icons.Filled.Movie, Modifier.weight(1f)) { onCategory("Анимэ") }
                CategoryTile("Манга", Icons.Filled.MenuBook, Modifier.weight(1f)) { onCategory("Манга") }
            }
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                CategoryTile("Тоглоом", Icons.Filled.SportsEsports, Modifier.weight(1f)) { onCategory("Тоглоом") }
                Spacer(Modifier.weight(1f))
            }
        }
    }
}

@Composable
private fun CategoryTile(label: String, icon: ImageVector, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Card(
        modifier = modifier.clickable(onClick = onClick),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = Panel)
    ) {
        Column(
            modifier = Modifier.fillMaxWidth().padding(vertical = 18.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(icon, null, tint = Violet, modifier = Modifier.size(28.dp))
            Text(label, color = TextMain, fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
private fun CategoryScreen(title: String, category: String?, onOpen: (LoreItem) -> Unit, modifier: Modifier = Modifier) {
    var remoteItems by remember { mutableStateOf<List<PublishedFranchise>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var loadError by remember { mutableStateOf<String?>(null) }
    LaunchedEffect(category) {
        loading = true
        val result = withContext(Dispatchers.IO) { ArchiveRepository().getPublishedFranchises(category) }
        result.onSuccess { remoteItems = it; loadError = null }
            .onFailure { loadError = "Серверээс мэдээлэл авч чадсангүй." }
        loading = false
    }
    val fallback = when (title) {
        "Манга" -> listOf(
            LoreItem("Berserk", "Манга", "Dark Fantasy · Үргэлжилж буй"),
            LoreItem("One Piece", "Манга", "Адал явдал · Үргэлжилж буй"),
            LoreItem("Chainsaw Man", "Манга", "Action · Үргэлжилж буй")
        )
        "Тоглоом" -> listOf(
            LoreItem("Genshin Impact", "Тоглоом", "Open-world Action RPG"),
            LoreItem("Honkai: Star Rail", "Тоглоом", "Turn-based RPG"),
            LoreItem("Wuthering Waves", "Тоглоом", "Action RPG")
        )
        "Lore" -> listOf(
            LoreItem("ANANTA LORE #012", "Lore", "Chaos хэрхэн үүсдэг вэ?"),
            LoreItem("Genshin Lore", "Lore", "Дүрүүд ба Тейватын түүх"),
            LoreItem("World Archive", "Lore", "Ертөнцийн нууц, он дараалал")
        )
        else -> sampleItems.filter { it.category.contains("Анимэ") }
    }
    val list = if (remoteItems.isNotEmpty()) remoteItems.map {
        LoreItem(it.name, title, it.description.ifBlank { "Тайлбар удахгүй нэмэгдэнэ." }, it.coverImageUrl)
    } else fallback
    Column(modifier = modifier.fillMaxSize().padding(16.dp)) {
        Text(title, fontSize = 26.sp, fontWeight = FontWeight.Bold, color = TextMain)
        Spacer(Modifier.height(12.dp))
        if (loading) {
            Text("Мэдээлэл ачаалж байна...", color = TextMuted, modifier = Modifier.padding(top = 12.dp))
        } else if (loadError != null) {
            Text(loadError!!, color = TextMuted, modifier = Modifier.padding(top = 12.dp))
        } else if (remoteItems.isEmpty()) {
            Text("Одоогоор нийтлэгдсэн мэдээлэл алга. Жишээ контент харуулж байна.", color = TextMuted, fontSize = 11.sp, modifier = Modifier.padding(top = 8.dp))
        }
        LazyColumn(
            contentPadding = PaddingValues(top = 14.dp, bottom = 20.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(list) {
                ContentCard(item = it, onClick = { onOpen(it) })
            }
        }
    }
}

@Composable
private fun ContentCard(item: LoreItem, onClick: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth().clickable(onClick = onClick),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = Panel)
    ) {
        Row(modifier = Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier.size(66.dp).clip(RoundedCornerShape(14.dp))
                    .background(Brush.linearGradient(listOf(Purple, PanelRaised))),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Filled.AutoStories, null, tint = TextMain, modifier = Modifier.size(30.dp))
            }
            Column(modifier = Modifier.weight(1f).padding(start = 12.dp), verticalArrangement = Arrangement.spacedBy(5.dp)) {
                Text(item.category.uppercase(), color = Violet, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                Text(item.title, color = TextMain, fontWeight = FontWeight.Bold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                Text(item.description, color = TextMuted, fontSize = 12.sp, maxLines = 2, overflow = TextOverflow.Ellipsis)
            }
            Icon(Icons.Filled.Bookmark, null, tint = TextMuted, modifier = Modifier.size(18.dp))
        }
    }
}

@Composable
private fun DetailScreen(
    item: LoreItem,
    isSaved: Boolean,
    isFavorite: Boolean,
    onToggleSaved: () -> Unit,
    onToggleFavorite: () -> Unit,
    onBack: () -> Unit
) {
    Column(modifier = Modifier.fillMaxSize().navigationBarsPadding().padding(18.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Box(
            modifier = Modifier.fillMaxWidth().height(190.dp).clip(RoundedCornerShape(22.dp))
                .background(Brush.linearGradient(listOf(Purple, PanelRaised, Void))),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Filled.AutoStories, null, tint = TextMain, modifier = Modifier.size(70.dp))
        }
        Text(item.category, color = Violet, fontSize = 12.sp, fontWeight = FontWeight.Bold)
        Text(item.title, color = TextMain, fontSize = 26.sp, fontWeight = FontWeight.Bold)
        Text(item.description, color = TextMuted)
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Button(onClick = onToggleSaved, colors = ButtonDefaults.buttonColors(containerColor = Purple)) {
                Icon(Icons.Filled.Bookmark, null, modifier = Modifier.size(16.dp))
                Text(if (isSaved) "  Хадгалсан" else "  Хадгалах")
            }
            OutlinedButton(onClick = onToggleFavorite) {
                Icon(Icons.Filled.Favorite, null, modifier = Modifier.size(16.dp))
                Text(if (isFavorite) "  Дуртайд нэмсэн" else "  Дуртай")
            }
        }
        Text("Дэлгэрэнгүй мэдээлэл", color = TextMain, fontWeight = FontWeight.Bold, fontSize = 18.sp)
        Text("Энэ хэсэгт тухайн контентын танилцуулга, Lore, түүхэн дараалал болон холбоотой мэдээлэл байрлана.", color = TextMuted)
        Spacer(Modifier.weight(1f))
        OutlinedButton(onClick = onBack, modifier = Modifier.fillMaxWidth()) {
            Text("← Буцах")
        }
    }
}

@Composable
private fun ProfileScreen(email: String?, onSettings: () -> Unit, modifier: Modifier = Modifier) {
    Column(modifier = modifier.fillMaxSize().padding(18.dp), verticalArrangement = Arrangement.spacedBy(18.dp)) {
        Text("Миний профайл", color = TextMain, fontSize = 25.sp, fontWeight = FontWeight.Bold)
        Box(
            modifier = Modifier.fillMaxWidth().padding(top = 10.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Box(
                    modifier = Modifier.size(88.dp).clip(CircleShape).background(Brush.linearGradient(listOf(Purple, Violet))),
                    contentAlignment = Alignment.Center
                ) { Icon(Icons.Filled.Person, null, tint = TextMain, modifier = Modifier.size(48.dp)) }
                Text(email ?: "Зочин хэрэглэгч", color = TextMain, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Text(if (email == null) "Зочны эрх" else "Нэвтэрсэн хэрэглэгч", color = Violet, fontSize = 12.sp)
            }
        }
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Metric("0", "Нийтлэл", Modifier.weight(1f))
            Metric("0", "Дуртай", Modifier.weight(1f))
            Metric("0", "Жагсаалт", Modifier.weight(1f))
        }
        listOf("Миний цуглуулга", "Үнэлгээ өгсөн", "Түүх (History)").forEach { label ->
            Card(colors = CardDefaults.cardColors(containerColor = Panel)) {
                Text(label, color = TextMain, modifier = Modifier.fillMaxWidth().clickable { }.padding(18.dp))
            }
        }
        Button(onClick = onSettings, modifier = Modifier.fillMaxWidth(), colors = ButtonDefaults.buttonColors(containerColor = PanelRaised)) {
            Icon(Icons.Filled.Settings, null)
            Text("  Тохиргоо")
        }
    }
}

@Composable
private fun Metric(value: String, label: String, modifier: Modifier = Modifier) {
    Card(modifier = modifier, colors = CardDefaults.cardColors(containerColor = Panel)) {
        Column(modifier = Modifier.padding(14.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Text(value, color = TextMain, fontSize = 21.sp, fontWeight = FontWeight.Bold)
            Text(label, color = TextMuted, fontSize = 11.sp)
        }
    }
}

@Composable
private fun SettingsScreen(onBack: () -> Unit, onAuthSuccess: (String) -> Unit) {
    var notifications by remember { mutableStateOf(true) }
    var darkMode by remember { mutableStateOf(true) }
    var dialog by remember { mutableStateOf<String?>(null) }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var authMode by remember { mutableStateOf("signin") }
    var authMessage by remember { mutableStateOf<String?>(null) }
    var busy by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val auth = remember { AuthRepository() }

    Column(modifier = Modifier.fillMaxSize().navigationBarsPadding().padding(18.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        Text("Тохиргоо", color = TextMain, fontSize = 25.sp, fontWeight = FontWeight.Bold)
        Card(colors = CardDefaults.cardColors(containerColor = Panel)) {
            Row(Modifier.fillMaxWidth().padding(18.dp), verticalAlignment = Alignment.CenterVertically) {
                Text("Мэдэгдэл", color = TextMain, modifier = Modifier.weight(1f))
                Switch(checked = notifications, onCheckedChange = { notifications = it })
            }
        }
        Card(colors = CardDefaults.cardColors(containerColor = Panel)) {
            Row(Modifier.fillMaxWidth().padding(18.dp), verticalAlignment = Alignment.CenterVertically) {
                Text("Харанхуй загвар", color = TextMain, modifier = Modifier.weight(1f))
                Switch(checked = darkMode, onCheckedChange = { darkMode = it })
            }
        }
        listOf(
            "Хэл · Монгол" to { dialog = "Монгол хэл одоогоор үндсэн интерфэйсийн хэл байна." },
            "Данс ба аюулгүй байдал" to { dialog = "account" },
            "Тусламж / Дэмжлэг" to { dialog = "Тусламжийн албан ёсны холбоос хараахан тохируулагдаагүй байна." },
            "Аппын тухай · v2.0.0" to { dialog = "LOREVERSE Native Android\nХувилбар: 2.0.0\nМонгол хэл дээрх анимэ, манга, тоглоом, Lore архив." }
        ).forEach { (label, action) ->
            Card(modifier = Modifier.clickable { action() }, colors = CardDefaults.cardColors(containerColor = Panel)) {
                Text(label, color = TextMain, modifier = Modifier.fillMaxWidth().padding(18.dp))
            }
        }
        Spacer(Modifier.weight(1f))
        OutlinedButton(onClick = onBack, modifier = Modifier.fillMaxWidth()) {
            Text("← Буцах")
        }
    }

    if (dialog == "account") {
        AlertDialog(
            onDismissRequest = { if (!busy) dialog = null },
            title = { Text("Данс ба аюулгүй байдал", color = TextMain) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(value = email, onValueChange = { email = it }, label = { Text("Имэйл") }, singleLine = true)
                    OutlinedTextField(value = password, onValueChange = { password = it }, label = { Text("Нууц үг") }, singleLine = true)
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        TextButton(onClick = { authMode = "signin"; authMessage = null }) { Text("Нэвтрэх") }
                        TextButton(onClick = { authMode = "signup"; authMessage = null }) { Text("Бүртгүүлэх") }
                    }
                    authMessage?.let { Text(it, color = TextMuted, fontSize = 12.sp) }
                }
            },
            confirmButton = {
                TextButton(enabled = !busy, onClick = {
                    busy = true
                    scope.launch {
                        val result = if (authMode == "signin") auth.signIn(email, password) else auth.signUp(email, password)
                        result.onSuccess {
                            if (authMode == "signin") {
                                authMessage = "Нэвтрэлт амжилттай. Профайл руу шилжиж байна."
                                onAuthSuccess(email.trim())
                            } else {
                                authMessage = "Бүртгэлийн хүсэлт амжилттай. Имэйл баталгаажуулах шаардлагатай байж болно."
                            }
                        }.onFailure {
                            authMessage = it.message ?: "Үйлдэл амжилтгүй. Дахин оролдоно уу."
                        }
                        busy = false
                    }
                }) { Text(if (busy) "Түр хүлээнэ үү..." else if (authMode == "signin") "Нэвтрэх" else "Бүртгүүлэх") }
            },
            dismissButton = { TextButton(onClick = { if (!busy) dialog = null }) { Text("Хаах") } },
            containerColor = Panel
        )
    } else if (dialog != null) {
        AlertDialog(
            onDismissRequest = { dialog = null },
            title = { Text("Мэдээлэл", color = TextMain) },
            text = { Text(dialog!!, color = TextMuted) },
            confirmButton = { TextButton(onClick = { dialog = null }) { Text("Ойлголоо") } },
            containerColor = Panel
        )
    }
}

@Composable
private fun ColorHex(value: Long) = androidx.compose.ui.graphics.Color(value)
