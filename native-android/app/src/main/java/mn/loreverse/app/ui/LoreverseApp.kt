package mn.loreverse.app.ui

import mn.loreverse.app.BuildConfig

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
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoStories
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Store
import androidx.compose.material.icons.filled.Newspaper
import androidx.compose.material.icons.filled.BugReport
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Forum
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
    Destination("store", "Дэлгүүр", Icons.Filled.Store),
    Destination("news", "Мэдээлэл", Icons.Filled.Newspaper),
    Destination("report", "Алдаа мэдээлэх", Icons.Filled.BugReport),
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
    var openAuthFromProfile by remember { mutableStateOf(false) }

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
                    settings -> SettingsScreen(onBack = { settings = false; openAuthFromProfile = false }, onAuthSuccess = { signedInEmail = it; settings = false; openAuthFromProfile = false }, openAccountOnStart = openAuthFromProfile)
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
                        onCategory = { selectedCategory = it; selected = when (it) { "Анимэ" -> "anime"; "Манга" -> "manga"; "Тоглоом" -> "games"; "Community" -> "community"; else -> "lore" } },
                        onSearch = { searchOpen = !searchOpen },
                        searchOpen = searchOpen,
                        query = query,
                        onQuery = { query = it },
                        modifier = Modifier.padding(padding)
                    )
                    selected == "community" -> CommunityScreen(modifier = Modifier.padding(padding))
                    selected == "store" -> StoreScreen(modifier = Modifier.padding(padding))
                    selected == "news" -> NewsScreen(modifier = Modifier.padding(padding))
                    selected == "report" -> BugReportScreen(modifier = Modifier.padding(padding))
                    selected == "profile" -> ProfileScreen(email = signedInEmail, onSettings = { settings = true }, onAuth = { openAuthFromProfile = true; settings = true }, modifier = Modifier.padding(padding))
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
                CategoryTile("Community", Icons.Filled.Forum, Modifier.weight(1f)) { onCategory("Community") }
            }
        }
    }
}

@Composable
private fun StoreScreen(modifier: Modifier = Modifier) {
    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(18.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text("Дэлгүүр", color = TextMain, fontSize = 27.sp, fontWeight = FontWeight.Bold)
            Text("LOREVERSE-ийн бараа, цуглуулга", color = TextMuted)
        }
        item {
            Card(colors = CardDefaults.cardColors(containerColor = Panel)) {
                Column(Modifier.fillMaxWidth().padding(20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Icon(Icons.Filled.Store, contentDescription = null, tint = Violet, modifier = Modifier.size(34.dp))
                    Text("Дэлгүүр бэлтгэгдэж байна", color = TextMain, fontWeight = FontWeight.Bold, fontSize = 19.sp)
                    Text("Барааны каталог, захиалга болон төлбөрийн үйлчилгээг дараагийн хөгжүүлэлтийн шатанд холбоно.", color = TextMuted)
                }
            }
        }
    }
}

@Composable
private fun NewsScreen(modifier: Modifier = Modifier) {
    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(18.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text("Мэдээлэл", color = TextMain, fontSize = 27.sp, fontWeight = FontWeight.Bold)
            Text("LOREVERSE-ийн мэдээ, зарлал, шинэчлэлт", color = TextMuted)
        }
        item {
            Card(colors = CardDefaults.cardColors(containerColor = Panel)) {
                Column(Modifier.fillMaxWidth().padding(20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Icon(Icons.Filled.Newspaper, contentDescription = null, tint = Violet, modifier = Modifier.size(34.dp))
                    Text("Одоогоор мэдээлэл алга", color = TextMain, fontWeight = FontWeight.Bold, fontSize = 19.sp)
                    Text("Шинэ мэдээ болон аппын зарлалууд нийтлэгдэхэд энд харагдана.", color = TextMuted)
                }
            }
        }
    }
}

@Composable
private fun BugReportScreen(modifier: Modifier = Modifier) {
    val context = androidx.compose.ui.platform.LocalContext.current
    val scope = rememberCoroutineScope()
    val repository = remember { mn.loreverse.app.data.FeedbackRepository() }
    var category by remember { mutableStateOf("bug") }
    var section by remember { mutableStateOf("Ерөнхий") }
    var subject by remember { mutableStateOf("") }
    var details by remember { mutableStateOf("") }
    var attachmentUri by remember { mutableStateOf<android.net.Uri?>(null) }
    var attachmentName by remember { mutableStateOf<String?>(null) }
    var attachmentMime by remember { mutableStateOf<String?>(null) }
    var busy by remember { mutableStateOf(false) }
    var message by remember { mutableStateOf<String?>(null) }
    var selectedTab by remember { mutableStateOf("new") }
    var tickets by remember { mutableStateOf<List<mn.loreverse.app.data.AppFeedback>>(emptyList()) }
    var loadingTickets by remember { mutableStateOf(false) }
    var adminMode by remember { mutableStateOf(false) }
    var canReview by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) { canReview = withContext(Dispatchers.IO) { repository.isStaff() } }
    var replyTarget by remember { mutableStateOf<mn.loreverse.app.data.AppFeedback?>(null) }
    var adminReply by remember { mutableStateOf("") }
    val imagePicker = androidx.activity.compose.rememberLauncherForActivityResult(
        androidx.activity.result.contract.ActivityResultContracts.GetContent()
    ) { uri ->
        attachmentUri = uri
        attachmentName = uri?.lastPathSegment ?: "image"
        attachmentMime = uri?.let { context.contentResolver.getType(it) }
    }
    val videoPicker = androidx.activity.compose.rememberLauncherForActivityResult(
        androidx.activity.result.contract.ActivityResultContracts.GetContent()
    ) { uri ->
        attachmentUri = uri
        attachmentName = uri?.lastPathSegment ?: "video"
        attachmentMime = uri?.let { context.contentResolver.getType(it) }
    }
    fun loadTickets(admin: Boolean = adminMode) {
        loadingTickets = true
        scope.launch {
            val result = withContext(Dispatchers.IO) {
                if (admin) repository.getAllForStaff() else repository.getMine()
            }
            result.onSuccess { tickets = it; message = null }
                .onFailure { message = it.message ?: "Хүсэлтүүдийг татаж чадсангүй." }
            loadingTickets = false
        }
    }

    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(18.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text("Алдаа мэдээлэх", color = TextMain, fontSize = 27.sp, fontWeight = FontWeight.Bold)
            Text("Асуудал, санал хүсэлтээ илгээж шийдвэрлэлтийг нь хянаарай.", color = TextMuted)
        }
        item {
            Row(
                modifier = Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FilterChip(selected = selectedTab == "new", onClick = { selectedTab = "new" }, label = { Text("Шинэ хүсэлт", maxLines = 1) })
                FilterChip(selected = selectedTab == "mine", onClick = { selectedTab = "mine"; adminMode = false; loadTickets(false) }, label = { Text("Миний хүсэлтүүд", maxLines = 1) })
                if (canReview) FilterChip(selected = selectedTab == "admin", onClick = { selectedTab = "admin"; adminMode = true; loadTickets(true) }, label = { Text("Админ хяналт", maxLines = 1) })
            }
        }
        if (selectedTab == "new") {
            item { Text("Төрөл", color = TextMain, fontWeight = FontWeight.SemiBold) }
            item {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    FilterChip(selected = category == "bug", onClick = { category = "bug" }, label = { Text("Аппын алдаа") })
                    FilterChip(selected = category == "suggestion", onClick = { category = "suggestion" }, label = { Text("Санал хүсэлт") })
                }
            }
            item {
                Text("Аль хэсэгт гарсан бэ?", color = TextMain, fontWeight = FontWeight.SemiBold)
                Row(modifier = Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    listOf("Нүүр", "Дэлгүүр", "Мэдээлэл", "Профайл", "Алдаа", "Ерөнхий").forEach { value ->
                        FilterChip(selected = section == value, onClick = { section = value }, label = { Text(value) })
                    }
                }
            }
            item {
                OutlinedTextField(
                    value = subject, onValueChange = { subject = it },
                    modifier = Modifier.fillMaxWidth(), label = { Text("Гарчиг") },
                    placeholder = { Text("Жишээ: Дэлгүүр нээгдэхгүй байна") }, singleLine = true
                )
            }
            item {
                OutlinedTextField(
                    value = details, onValueChange = { details = it },
                    modifier = Modifier.fillMaxWidth(), label = { Text("Дэлгэрэнгүй тайлбар") },
                    placeholder = { Text("Алдаа гарсан алхам, хүлээж байсан үр дүн, бодит үр дүнг бичнэ үү...") },
                    minLines = 4
                )
            }
            item {
                Text("Нотлох зураг эсвэл видео (заавал биш)", color = TextMain, fontWeight = FontWeight.SemiBold)
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedButton(onClick = { imagePicker.launch("image/*") }) { Text("Зураг сонгох") }
                    OutlinedButton(onClick = { videoPicker.launch("video/mp4") }) { Text("Видео сонгох") }
                }
                attachmentName?.let { Text("Хавсаргасан: $it", color = Violet, fontSize = 12.sp) }
                Text("Зураг 10 MB хүртэл, MP4 видео 10 MB хүртэл.", color = TextMuted, fontSize = 11.sp)
            }
            item {
                Text("Автоматаар хавсаргах төхөөрөмжийн мэдээлэл", color = TextMain, fontWeight = FontWeight.SemiBold)
                Text("Android ${android.os.Build.VERSION.RELEASE} · ${android.os.Build.MODEL} · App 2.0.0", color = TextMuted, fontSize = 12.sp)
            }
            item {
                Button(
                    enabled = !busy,
                    onClick = {
                        if (subject.trim().length < 3 || details.trim().length < 10) {
                            message = "Гарчиг 3-аас, тайлбар 10-аас доошгүй тэмдэгт байна."
                        } else {
                            busy = true
                            message = null
                            scope.launch {
                                val bytes = attachmentUri?.let { uri ->
                                    withContext(Dispatchers.IO) { context.contentResolver.openInputStream(uri)?.use { it.readBytes() } }
                                }
                                val result = withContext(Dispatchers.IO) {
                                    repository.submit(
                                        category = category,
                                        title = subject.trim(),
                                        description = details.trim(),
                                        section = section,
                                        appVersion = "2.0.0",
                                        androidVersion = android.os.Build.VERSION.RELEASE ?: "unknown",
                                        deviceModel = android.os.Build.MODEL ?: "unknown",
                                        attachmentBytes = bytes,
                                        attachmentMime = attachmentMime
                                    )
                                }
                                result.onSuccess { ticket ->
                                    message = "Амжилттай илгээлээ. Хүсэлтийн дугаар: #${ticket.ticketNumber}"
                                    subject = ""; details = ""; attachmentUri = null; attachmentName = null; attachmentMime = null
                                }.onFailure { message = it.message ?: "Илгээхэд алдаа гарлаа." }
                                busy = false
                            }
                        }
                    },
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Purple)
                ) { Text(if (busy) "Илгээж байна..." else "Илгээх") }
            }
        } else {
            item {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(if (selectedTab == "admin") "Ирсэн хүсэлтүүд" else "Миний хүсэлтүүд", color = TextMain, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                    TextButton(onClick = { loadTickets(selectedTab == "admin") }) { Text("Шинэчлэх") }
                }
            }
            if (loadingTickets) item { Text("Ачаалж байна...", color = TextMuted) }
            else if (tickets.isEmpty()) item { Text("Одоогоор хүсэлт алга.", color = TextMuted) }
            else items(tickets, key = { it.id }) { ticket ->
                Card(colors = CardDefaults.cardColors(containerColor = Panel), shape = RoundedCornerShape(18.dp)) {
                    Column(Modifier.fillMaxWidth().padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("#${ticket.ticketNumber}", color = Violet, fontWeight = FontWeight.Bold)
                            Spacer(Modifier.weight(1f))
                            Text(ticket.statusLabel, color = TextMuted, fontSize = 12.sp)
                        }
                        Text(ticket.title, color = TextMain, fontWeight = FontWeight.SemiBold)
                        Text(ticket.description, color = TextMuted, fontSize = 13.sp)
                        Text("${ticket.categoryLabel} · ${ticket.section} · ${ticket.createdAt.take(10)}", color = TextMuted, fontSize = 11.sp)
                        if (!ticket.attachmentPath.isNullOrBlank()) {
                            OutlinedButton(onClick = {
                                scope.launch {
                                    val link = withContext(Dispatchers.IO) { repository.createAttachmentLink(ticket.attachmentPath).getOrThrow() }
                                    runCatching {
                                        context.startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(link)))
                                    }.onFailure { message = "Хавсралтыг нээж чадсангүй." }
                                }
                            }) { Text("Зураг / видео үзэх") }
                        }
                        if (!ticket.adminReply.isNullOrBlank()) {
                            Card(colors = CardDefaults.cardColors(containerColor = PanelRaised)) {
                                Column(Modifier.fillMaxWidth().padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                    Text("Админы хариу", color = Violet, fontWeight = FontWeight.SemiBold)
                                    Text(ticket.adminReply, color = TextMain, fontSize = 13.sp)
                                }
                            }
                        }
                        if (selectedTab == "admin") {
                            OutlinedButton(onClick = { replyTarget = ticket; adminReply = ticket.adminReply.orEmpty() }) { Text("Хариу / төлөв өөрчлөх") }
                        }
                    }
                }
            }
        }
        message?.let { item { Text(it, color = if (it.startsWith("Амжилттай")) Violet else ColorHex(0xFFFBBF24)) } }
    }

    replyTarget?.let { target ->
        var newStatus by remember(target.id) { mutableStateOf(target.status) }
        AlertDialog(
            onDismissRequest = { replyTarget = null },
            title = { Text("Хүсэлт #${target.ticketNumber}", color = TextMain) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf("pending" to "Хүлээгдэж байна", "reviewing" to "Шалгаж байна", "resolved" to "Зассан", "rejected" to "Татгалзсан").forEach { (value, label) ->
                        FilterChip(selected = newStatus == value, onClick = { newStatus = value }, label = { Text(label) })
                    }
                    OutlinedTextField(value = adminReply, onValueChange = { adminReply = it }, label = { Text("Админы хариу") }, minLines = 3)
                }
            },
            confirmButton = {
                TextButton(onClick = {
                    busy = true
                    scope.launch {
                        val result = withContext(Dispatchers.IO) { repository.updateAsStaff(target.id, newStatus, adminReply.trim()) }
                        result.onSuccess { replyTarget = null; loadTickets(true); message = "Хүсэлт шинэчлэгдлээ." }
                            .onFailure { message = it.message ?: "Шинэчлэхэд алдаа гарлаа." }
                        busy = false
                    }
                }, enabled = !busy) { Text("Хадгалах") }
            },
            dismissButton = { TextButton(onClick = { replyTarget = null }) { Text("Болих") } },
            containerColor = Panel
        )
    }
}

@Composable
private fun CommunityScreen(modifier: Modifier = Modifier) {
    var posts by remember { mutableStateOf<List<CommunityPost>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var failed by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        val result = withContext(Dispatchers.IO) { CommunityRepository().getLatestPosts() }
        result.onSuccess { posts = it; failed = false }
            .onFailure { failed = true }
        loading = false
    }

    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text("Community", color = TextMain, fontSize = 25.sp, fontWeight = FontWeight.Bold)
            Text("Сонирхлоо хуваалцаж, хамтдаа хэлэлцье.", color = TextMuted)
        }
        when {
            loading -> item { Text("Нийтлэлүүдийг ачаалж байна...", color = TextMuted) }
            failed -> item {
                Card(colors = CardDefaults.cardColors(containerColor = Panel)) {
                    Text("Нийтлэл татахад алдаа гарлаа. Дараа дахин оролдоно уу.", color = TextMuted, modifier = Modifier.padding(18.dp))
                }
            }
            posts.isEmpty() -> item {
                Card(colors = CardDefaults.cardColors(containerColor = Panel)) {
                    Column(Modifier.fillMaxWidth().padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("Одоогоор нийтлэл алга", color = TextMain, fontWeight = FontWeight.Bold)
                        Text("Эхний хэлэлцүүлгийг эхлүүлэхийн тулд бүртгэлтэй хэрэглэгчээр нэвтэрнэ үү.", color = TextMuted)
                    }
                }
            }
            else -> items(posts, key = { it.id }) { post ->
                Card(colors = CardDefaults.cardColors(containerColor = Panel)) {
                    Column(Modifier.fillMaxWidth().padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(post.category.replace('_', ' ').uppercase(), color = Violet, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Spacer(Modifier.weight(1f))
                            Text(post.gameSlug.replace('-', ' ').uppercase(), color = TextMuted, fontSize = 10.sp)
                        }
                        Text(post.body, color = TextMain)
                        if (post.spoilerLevel != "none") {
                            Text("Спойлер: " + post.spoilerLevel, color = ColorHex(0xFFFBBF24), fontSize = 11.sp)
                        }
                    }
                }
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
    var detail by remember(item.title) { mutableStateOf<mn.loreverse.app.data.FranchiseDetail?>(null) }
    var loading by remember(item.title) { mutableStateOf(true) }
    var failed by remember(item.title) { mutableStateOf(false) }

    LaunchedEffect(item.title) {
        val result = withContext(Dispatchers.IO) {
            ArchiveRepository().getPublishedFranchiseDetail(item.title)
        }
        result.onSuccess { detail = it; failed = false }
            .onFailure { failed = true }
        loading = false
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize().navigationBarsPadding(),
        contentPadding = PaddingValues(18.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Box(
                modifier = Modifier.fillMaxWidth().height(190.dp).clip(RoundedCornerShape(22.dp))
                    .background(Brush.linearGradient(listOf(Purple, PanelRaised, Void))),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Filled.AutoStories, null, tint = TextMain, modifier = Modifier.size(70.dp))
            }
        }
        item {
            Text(item.category, color = Violet, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            Text(item.title, color = TextMain, fontSize = 26.sp, fontWeight = FontWeight.Bold)
            Text(detail?.franchise?.description ?: item.description, color = TextMuted)
        }
        item {
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
        }
        item {
            Text("Нийтлэгдсэн дэлгэрэнгүй", color = TextMain, fontWeight = FontWeight.Bold, fontSize = 18.sp)
            when {
                loading -> Text("Мэдээлэл ачаалж байна...", color = TextMuted)
                failed -> Text("Серверийн мэдээлэл ачаалж чадсангүй. Дараа дахин оролдоно уу.", color = TextMuted)
                detail == null -> Text("Энэ бүтээлийн нийтлэгдсэн архивын мэдээлэл одоогоор алга.", color = TextMuted)
                detail!!.works.isEmpty() -> Text("Монгол хэл дээр нийтлэгдсэн дэлгэрэнгүй бичлэг одоогоор алга.", color = TextMuted)
            }
        }
        if (!loading && !failed && detail != null) {
            items(detail!!.works) { (work, translation) ->
                Card(colors = CardDefaults.cardColors(containerColor = Panel), shape = RoundedCornerShape(18.dp)) {
                    Column(Modifier.fillMaxWidth().padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(translation.title, color = TextMain, fontWeight = FontWeight.Bold, fontSize = 17.sp)
                        Text(work.canonicalTitle + " · " + work.workType, color = Violet, fontSize = 11.sp)
                        if (translation.synopsis.isNotBlank()) {
                            Text(translation.synopsis, color = TextMuted, fontSize = 13.sp)
                        }
                        Text(
                            "Канон: ${translation.canonStatus} · Спойлер: ${translation.spoilerLevel}",
                            color = TextMuted,
                            fontSize = 10.sp
                        )
                    }
                }
            }
        }
        item {
            OutlinedButton(onClick = onBack, modifier = Modifier.fillMaxWidth()) {
                Text("← Буцах")
            }
        }
    }
}

@Composable
private fun ProfileScreen(
    email: String?,
    onSettings: () -> Unit,
    onAuth: () -> Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(18.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text("Миний профайл", color = TextMain, fontSize = 25.sp, fontWeight = FontWeight.Bold)
        }
        if (email.isNullOrBlank()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Panel)
                ) {
                    Column(
                        modifier = Modifier.fillMaxWidth().padding(22.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Box(
                            modifier = Modifier.size(88.dp).clip(CircleShape)
                                .background(Brush.linearGradient(listOf(Purple, Violet))),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Filled.Person, null, tint = TextMain, modifier = Modifier.size(46.dp))
                        }
                        Text("LOREVERSE-д тавтай морил", color = TextMain, fontSize = 21.sp, fontWeight = FontWeight.Bold)
                        Text(
                            "Нэвтэрч эсвэл бүртгүүлж өөрийн цуглуулга, дуртай контент болон үнэлгээгээ хадгалаарай.",
                            color = TextMuted,
                            fontSize = 13.sp
                        )
                        Button(
                            onClick = onAuth,
                            modifier = Modifier.fillMaxWidth().height(50.dp),
                            shape = RoundedCornerShape(24.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Purple)
                        ) {
                            Text("Нэвтрэх / Бүртгүүлэх", fontWeight = FontWeight.Bold)
                        }
                        OutlinedButton(
                            onClick = onSettings,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(Icons.Filled.Settings, null)
                            Text("  Тохиргоо")
                        }
                    }
                }
            }
            item {
                Card(colors = CardDefaults.cardColors(containerColor = Panel), shape = RoundedCornerShape(18.dp)) {
                    Column(Modifier.fillMaxWidth().padding(18.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text("Зочны горим", color = Violet, fontWeight = FontWeight.SemiBold)
                        Text("Та анимэ, манга, тоглоом болон Lore мэдээллийг үзэх боломжтой. Нийтлэл бичих, үнэлгээ өгөх, цуглуулгаа хадгалахын тулд бүртгэл үүсгэнэ үү.", color = TextMuted, fontSize = 13.sp)
                    }
                }
            }
        } else {
            item {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Box(
                        modifier = Modifier.size(72.dp).clip(CircleShape)
                            .background(Brush.linearGradient(listOf(Purple, Violet))),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Filled.Person, null, tint = TextMain, modifier = Modifier.size(38.dp))
                    }
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(email, color = TextMain, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                        Text("Бүртгэлтэй хэрэглэгч", color = Violet, fontSize = 12.sp)
                    }
                }
            }
            item {
                Card(colors = CardDefaults.cardColors(containerColor = Panel), shape = RoundedCornerShape(18.dp)) {
                    Column(Modifier.fillMaxWidth().padding(18.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text("Таны LOREVERSE профайл", color = TextMain, fontWeight = FontWeight.SemiBold)
                        Text("Цуглуулга, үнэлгээ болон хэрэглэгчийн статистикийг таны бүртгэлтэй холбосны дараа энд харуулна.", color = TextMuted, fontSize = 13.sp)
                    }
                }
            }
            item {
                Button(onClick = onSettings, modifier = Modifier.fillMaxWidth(), colors = ButtonDefaults.buttonColors(containerColor = PanelRaised)) {
                    Icon(Icons.Filled.Settings, null)
                    Text("  Данс ба тохиргоо")
                }
            }
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
private fun SettingsScreen(onBack: () -> Unit, onAuthSuccess: (String) -> Unit, openAccountOnStart: Boolean = false) {
    var notifications by remember { mutableStateOf(true) }
    var darkMode by remember { mutableStateOf(true) }
    var dialog by remember { mutableStateOf<String?>(if (openAccountOnStart) "account" else null) }
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
            "Аппын тухай · v${BuildConfig.VERSION_NAME}" to { dialog = "LOREVERSE Native Android\nХувилбар: ${BuildConfig.VERSION_NAME}\nBuild: ${BuildConfig.VERSION_CODE}\nМонгол хэл дээрх анимэ, манга, тоглоом, Lore архив." }
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
