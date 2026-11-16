(()=>{"use strict";
const dict={
"Миний профайл":["My profile","マイプロフィール","내 프로필"],
"Ангилал":["Categories","カテゴリー","카테고리"],"Анимэ":["Anime","アニメ","애니메이션"],"Тоглоом":["Games","ゲーム","게임"],"Манга":["Manga","マンガ","만화"],"Мэдээллийн сан":["Database","データベース","데이터베이스"],"Нийтийн чат":["Community chat","コミュニティチャット","커뮤니티 채팅"],"Мэдэгдэл":["Notifications","通知","알림"],"Хаах":["Close","閉じる","닫기"],"Бүртгэл / Нэвтрэх":["Sign up / Log in","登録 / ログイン","가입 / 로그인"],"Имэйл":["Email","メールアドレス","이메일"],"Нууц үг":["Password","パスワード","비밀번호"],"Нэвтрэх":["Log in","ログイン","로그인"],"Бүртгүүлэх":["Sign up","新規登録","회원가입"],"Гарах":["Log out","ログアウト","로그아웃"],"Харагдах нэр":["Display name","表示名","표시 이름"],"Профайл хадгалах":["Save profile","プロフィールを保存","프로필 저장"],"Нэвтэрч орно уу.":["Please log in.","ログインしてください。","로그인해 주세요."],
"Ертөнцүүдийг нээх ↗":["Explore universes ↗","世界を探索 ↗","세계 탐험 ↗"],"Lore архив үзэх":["Browse lore archive","Loreアーカイブを見る","Lore 아카이브 보기"],"Эхний тоглоомын ертөнц":["Initial game universes","初期ゲーム世界","초기 게임 세계"],"Нэгдсэн lore архив":["Unified lore archive","統合Loreアーカイブ","통합 Lore 아카이브"],"Интерфэйсийн хэл":["Interface languages","インターフェース言語","인터페이스 언어"],
"Анимэ ертөнц":["Anime universes","アニメの世界","애니메이션 세계"],"Онцлох анимэ болон тэдгээрийн түүхийн сан.":["Featured anime and their story archive.","注目アニメとその物語アーカイブ。","주요 애니메이션과 스토리 아카이브."],"Тоглоомын ертөнц":["Game universes","ゲームの世界","게임 세계"],"Тоглоом тус бүрийн lore архив руу шууд нэвтэр.":["Explore each game's lore archive.","各ゲームのLoreアーカイブへ。","각 게임의 Lore 아카이브로 이동하세요."],
"Сувгууд":["Channels","チャンネル","채널"],"Сувгууд ачаалж байна…":["Loading channels…","チャンネルを読み込み中…","채널 불러오는 중…"],"Дүрэм: доромжлол, спам, давтан мессеж хориглоно.":["Rules: harassment, spam and repeated messages are prohibited.","ルール：嫌がらせ、スパム、連投は禁止です。","규칙: 괴롭힘, 스팸, 반복 메시지는 금지됩니다."],"Чат холбогдож байна…":["Connecting to chat…","チャットに接続中…","채팅 연결 중…"],"Энэ сувгийн мессеж хайх…":["Search messages in this channel…","このチャンネルのメッセージを検索…","이 채널의 메시지 검색…"],"Цэвэрлэх":["Clear","クリア","지우기"],"Онлайн: —":["Online: —","オンライン：—","온라인: —"],"Мессеж ачаалж байна…":["Loading messages…","メッセージを読み込み中…","메시지 불러오는 중…"],"Мессеж бичих...":["Write a message…","メッセージを入力…","메시지 작성…"],"Илгээх":["Send","送信","보내기"],"Нэр болон Rank таны профайлаас харагдана":["Your name and rank appear from your profile","名前とランクはプロフィールに表示されます","이름과 랭크는 프로필에 표시됩니다"],
"Rank ба Bonus":["Rank & Bonuses","ランク＆ボーナス","랭크 및 보너스"],"Зочин хэрэглэгч":["Guest user","ゲストユーザー","게스트 사용자"],"Бонусын дэлгүүр":["Bonus store","ボーナスストア","보너스 상점"],"Цуглуулсан Coins-оор Premium хөнгөлөлт болон профайлын гоёл авна.":["Use collected Coins for Premium discounts and profile cosmetics.","集めたCoinsでPremium割引やプロフィール装飾を交換できます。","모은 코인으로 프리미엄 할인과 프로필 꾸미기를 구매하세요."],"Шилдэг Lorekeepers":["Top Lorekeepers","トップLorekeeper","최고 Lorekeeper"],"Өдрийн бонус авах · +5 XP / +2 Coins":["Claim daily bonus · +5 XP / +2 Coins","デイリーボーナス · +5 XP / +2 Coins","일일 보너스 받기 · +5 XP / +2 Coins"],"Дараагийн Rank босго":["Next rank threshold","次のランクの条件","다음 랭크 기준"],"Дараагийн Rank хүртэл 100 XP":["100 XP to the next rank","次のランクまであと100 XP","다음 랭크까지 100 XP"],
"Сайтын идэвх":["Site activity","サイトのアクティビティ","사이트 활동"],"Орон нутгийн цаг болон хэрэглэгчийн идэвхийн хэмжүүр.":["Local time and user activity metrics.","現地時刻とユーザーアクティビティ指標。","현지 시간 및 사용자 활동 지표."],"Одоогийн цаг · Улаанбаатар":["Current time · Ulaanbaatar","現在時刻 · ウランバートル","현재 시간 · 울란바토르"],"Яг одоо онлайн":["Online now","現在オンライン","현재 접속 중"],"Нийт зочлол":["Total visits","総訪問数","총 방문 수"],
"Бүх ертөнцийн мэдлэг нэг дор":["Knowledge from every universe in one place","あらゆる世界の知識をひとつに","모든 세계의 지식을 한곳에"],"Тоглоом, анимэ, манга, роман болон тэдгээрийн холбоотой ертөнцийн мэдээллийг нэг архивт нэгтгэнэ.":["A unified archive for games, anime, manga, novels and connected universes.","ゲーム、アニメ、マンガ、小説と関連世界の情報をひとつのアーカイブに集約。","게임, 애니메이션, 만화, 소설 및 관련 세계 정보를 하나의 아카이브로 통합합니다."],
"Тоглоомын түүх, дүр, газар нутаг, хүчний систем, фракц.":["Game stories, characters, locations, power systems and factions.","ゲームの物語、キャラクター、地域、能力体系、勢力。","게임 스토리, 캐릭터, 지역, 능력 체계 및 세력."],"Анимэ цуврал, улирал, анги, дүр болон үйл явдал.":["Anime series, seasons, episodes, characters and events.","アニメシリーズ、シーズン、エピソード、キャラクター、出来事。","애니메이션 시리즈, 시즌, 에피소드, 캐릭터 및 사건."],"Манга цуврал, бүлэг, дүр, зохиолын хувилбар.":["Manga series, chapters, characters and story versions.","マンガシリーズ、章、キャラクター、物語の各版。","만화 시리즈, 챕터, 캐릭터 및 스토리 버전."],"Боть, бүлэг, зохиолын үйл явдал болон дүрүүд.":["Volumes, chapters, story events and characters.","巻、章、物語の出来事とキャラクター。","권, 챕터, 스토리 사건 및 캐릭터."],"Цахим зохиол, бүлэг, хувилбар болон цуврал түүх.":["Web novels, chapters, versions and serialized stories.","Web小説、章、バージョン、連載ストーリー。","웹소설, 챕터, 버전 및 연재 스토리."],"Ертөнц, цаг хугацаа, дүрүүдийн холбоо, канон хувилбар.":["Universes, timelines, character relationships and canon versions.","世界、時系列、キャラクターの関係、正史バージョン。","세계관, 타임라인, 캐릭터 관계 및 정식 설정 버전."],
"Анимэ · Тоглоом · Манга каталог":["Anime · Games · Manga catalog","アニメ・ゲーム・マンガカタログ","애니메이션 · 게임 · 만화 카탈로그"],"Нэрээр хайж, танилцуулга, төрөл, бүтээгч, дүр болон үндсэн мэдээллийг нээнэ.":["Search by title and explore summaries, genres, creators, characters and key details.","タイトルで検索し、概要、ジャンル、制作者、キャラクター、基本情報を確認。","제목으로 검색해 줄거리, 장르, 제작자, 캐릭터 및 주요 정보를 확인하세요."],"Нэрээр хайх...":["Search by title…","タイトルで検索…","제목으로 검색…"],"Хайх":["Search","検索","검색"],"Дараагийн үр дүн":["Next results","次の結果","다음 결과"],"Бүх төрөл":["All types","すべての種類","모든 유형"],"Бүх ертөнц":["All universes","すべての世界","모든 세계"],"Бүгд":["All","すべて","전체"],"Нэгдсэн Lore Archive":["Unified Lore Archive","統合Loreアーカイブ","통합 Lore 아카이브"],"Редакторын баталж нийтэлсэн франчайз, бүтээл, олон хэлний мэдээлэл.":["Franchises, works and multilingual information approved by editors.","編集者が承認・公開したフランチャイズ、作品、多言語情報。","편집자가 승인하고 게시한 프랜차이즈, 작품 및 다국어 정보."],"Ертөнц, бүтээлийн нэрээр хайх...":["Search universes or titles…","世界・作品名で検索…","세계 또는 작품명 검색…"],"Монгол":["Mongolian","モンゴル語","몽골어"],"Нийтлэгдсэн архивын мэдээлэл ачаалж байна...":["Loading published archive…","公開済みアーカイブを読み込み中…","게시된 아카이브 불러오는 중…"],
"Lore архив":["Lore archive","Loreアーカイブ","Lore 아카이브"],"Нийтлэл, дүр, ертөнцийн мэдээллийг хайж үзээрэй.":["Search articles, characters and universe information.","記事、キャラクター、世界の情報を検索。","게시글, 캐릭터 및 세계관 정보를 검색하세요."],"Шинэ нь эхэнд":["Newest first","新着順","최신순"],"Нэрээр A–Z":["Title A–Z","タイトル A–Z","이름 A–Z"],"Тохирох нийтлэл олдсонгүй.":["No matching articles found.","該当する記事が見つかりません。","일치하는 게시글이 없습니다."],"Нийтлэл, дүр, сэдэв хайх...":["Search articles, characters or topics…","記事、キャラクター、トピックを検索…","게시글, 캐릭터 또는 주제 검색…"],
"Нэгдсэн мэдээлэл ба Lore сан":["Unified information & Lore archive","統合情報・Loreアーカイブ","통합 정보 및 Lore 아카이브"],"Тоглоом, анимэ, дүр, ертөнцийн судалгаа, мэдээ, гарын авлагыг нэг дороос хайж уншина. Нийтлэл бүр эх сурвалжтай байна.":["Search game and anime lore, characters, universe research, news and guides in one place. Every article includes sources.","ゲーム・アニメのLore、キャラクター、世界観研究、ニュース、ガイドをまとめて検索。すべての記事に出典があります。","게임 및 애니메이션 Lore, 캐릭터, 세계관 연구, 뉴스, 가이드를 한곳에서 검색하세요. 모든 게시글에는 출처가 포함됩니다."],"Гарчиг, дүр, тоглоом, агуулгаар хайх...":["Search title, character, game or content…","タイトル、キャラクター、ゲーム、内容で検索…","제목, 캐릭터, 게임 또는 내용 검색…"],"Бүх төрөл":["All types","すべての種類","모든 유형"],"Lore судалгаа":["Lore research","Lore研究","Lore 연구"],"Гарын авлага":["Guide","ガイド","가이드"],"Зөвхөн хадгалсан":["Bookmarks only","ブックマークのみ","북마크만"],"Нийтлэл ачаалж байна…":["Loading articles…","記事を読み込み中…","게시글 불러오는 중…"],
"Нийтлэлд санал өгөх":["Send article feedback","記事にフィードバック","게시글 의견 보내기"],"Саналын төрөл":["Feedback type","フィードバックの種類","의견 유형"],"Алдаа засвар":["Correction","修正","수정"],"Эх сурвалж санал болгох":["Suggest a source","出典を提案","출처 제안"],"Асуулт":["Question","質問","질문"],"Бусад":["Other","その他","기타"],"Тайлбар":["Details","詳細","설명"],"Эх сурвалжийн холбоос (заавал биш)":["Source link (optional)","出典リンク（任意）","출처 링크 (선택 사항)"],"Санал илгээх":["Submit feedback","フィードバックを送信","의견 제출"],
"Community Event":["Community events","コミュニティイベント","커뮤니티 이벤트"],"Lore Quiz, тэмцээн, хэлэлцүүлэгт бүртгүүлээрэй.":["Join Lore quizzes, competitions and discussions.","Loreクイズ、コンテスト、ディスカッションに参加しましょう。","Lore 퀴즈, 대회 및 토론에 참여하세요."],"Туслах цэс ба үйлчилгээ":["Help & services","ヘルプとサービス","도움말 및 서비스"],"Админтай холбогдох":["Contact support","管理者に問い合わせ","관리자에게 문의"],"Аккаунт / нэвтрэх":["Account / login","アカウント / ログイン","계정 / 로그인"],"Төлбөр":["Payment","支払い","결제"],"Premium эрх":["Premium membership","Premium会員","프리미엄 멤버십"],"Техникийн алдаа":["Technical issue","技術的な問題","기술 문제"],"Асуудлын төрөл":["Issue category","問題の種類","문제 유형"],"Гарчиг":["Subject","件名","제목"],"Дэлгэрэнгүй тайлбар":["Detailed description","詳細説明","상세 설명"],"Админд хүсэлт илгээх":["Send support request","サポートリクエストを送信","지원 요청 보내기"],"Миний хүсэлтүүд":["My requests","自分のリクエスト","내 요청"],"Шинэчлэх":["Refresh","更新","새로고침"],"Хүсэлт харах / хариулах":["View / reply to request","リクエストを表示 / 返信","요청 보기 / 답변"],"Хариу бичих":["Write a reply","返信を書く","답변 작성"],"Хариу илгээх":["Send reply","返信を送信","답변 보내기"],"Хавсралт нээх":["Open attachment","添付ファイルを開く","첨부 파일 열기"],
"Нэвтрэхийн тулд имэйлээр бүртгүүлж нэвтэрнэ үү.":["Please register with your email and log in.","メールで登録してログインしてください。","이메일로 가입한 후 로그인하세요."],"Нэвтэрсний дараа мэдэгдлүүд харагдана.":["Notifications appear after you log in.","ログイン後に通知が表示されます。","로그인하면 알림이 표시됩니다."],"Хариулт боловсруулж байна…":["Preparing answer…","回答を作成中…","답변 작성 중…"],"Дахин оролдоно уу.":["Please try again.","もう一度お試しください。","다시 시도해 주세요."],
"Бүх нийтлэл":["All articles","すべての記事","모든 게시글"],"Дэлгэрэнгүй":["Details","詳細","자세히"],"Оролцох":["Join","参加","참여"],"Бүртгүүлсэн":["Joined","参加済み","참여 완료"],"Одоогоор нийтлэгдсэн арга хэмжээ алга.":["No published events at this time.","現在公開中のイベントはありません。","현재 게시된 이벤트가 없습니다."],
"Нэвтрэхийн тулд имэйлээ ашиглана уу.":["Please use your email to log in.","メールアドレスでログインしてください。","이메일을 사용해 로그인하세요."]
};

// Additional translations for game, character and Rank subpages.
Object.assign(dict,{
"Нүүр хуудас":["Home","ホーム","홈"],"Бүх ангилал":["All categories","すべてのカテゴリー","모든 카테고리"],
"Бүс бүрийн соёл, түүх, Архон, гол дүрүүд, газар орны нууц, даалгаврын холбоосыг тусад нь эмхэтгэнэ.":["Explore each region's culture, history, Archons, characters, mysteries and quest connections.","各地域の文化、歴史、執政、主要人物、謎、任務のつながりを整理します。","각 지역의 문화, 역사, 집정관, 주요 인물, 비밀 및 퀘스트 연결을 정리합니다."],
"Ертөнцийн тухай":["About the universe","世界について","세계관 소개"],"Судалгааны ангиллууд":["Research categories","研究カテゴリー","연구 카테고리"],"Баримт ба таамгийг ялгана":["Separating facts from theories","事実と考察を区別","사실과 추측 구분"],"Дүрүүдийн архив":["Character archive","キャラクターアーカイブ","캐릭터 아카이브"],"Дүрийн мэдээллийг сонгон дэлгэрүүлж үзнэ.":["Select a character to view more details.","キャラクターを選択して詳細を確認できます。","캐릭터를 선택해 자세한 정보를 확인하세요."],"Бүх бүс нутаг":["All regions","すべての地域","모든 지역"],"Бүх элемент":["All elements","すべての元素","모든 원소"],"Тохирох дүр олдсонгүй.":["No matching characters found.","該当するキャラクターが見つかりません。","일치하는 캐릭터가 없습니다."],"Хайлтын үгээ өөрчилнө үү.":["Try changing your search.","検索語を変更してください。","검색어를 변경해 보세요."],
"Дүрийн танилцуулга":["Character profile","キャラクタープロフィール","캐릭터 프로필"],"Гарал үүсэл ба багш":["Origins and mentor","出自と師匠","기원과 스승"],"Чухал холбоо харилцаа":["Key relationships","重要な関係","주요 관계"],"Нэгдсэн Lore сан":["Unified Lore archive","統合Loreアーカイブ","통합 Lore 아카이브"],"Архив үзэх ↓":["Explore archive ↓","アーカイブを見る ↓","아카이브 보기 ↓"],"Судалгааны бүх ангилал":["All research categories","すべての研究カテゴリー","모든 연구 카테고리"],
"Өдөр тутмын бонус":["Daily reward","デイリーボーナス","일일 보상"],"Өнөөдрийн бонус авах":["Claim today's reward","今日の報酬を受け取る","오늘의 보상 받기"],"Нийт XP":["Total XP","合計XP","총 XP"],"Lore Coins":["Lore Coins","Lore Coins","Lore Coins"],"Нэвтрэх":["Log in","ログイン","로그인"],"Нүүр хуудсанд нэвтэрсэн бол энэ хуудсанд автоматаар танигдана.":["If you are logged in on the home page, you will be recognized automatically here.","ホームページでログイン済みの場合、このページでも自動的に認識されます。","홈페이지에 로그인되어 있으면 이 페이지에서도 자동으로 인식됩니다。"],
"Үндэстэн ба бүс нутаг":["Nations and regions","国と地域","국가 및 지역"],"Судалгааны бүх ангилал":["All research categories","すべての研究カテゴリー","모든 연구 카테고리"],"Эх сурвалж":["Sources","出典","출처"],"Спойлерын анхааруулга:":["Spoiler warning:","ネタバレ注意：","스포일러 주의:"],
"Нууцлаг хотын амьдрал, дүрүүд болон ертөнцийн нууцыг нэг дороос судал.":["Explore the mysterious city's life, characters and secrets in one place.","謎めいた都市の暮らし、キャラクター、世界の秘密をまとめて調べましょう。","수수께끼의 도시 생활, 캐릭터 및 세계의 비밀을 한곳에서 살펴보세요."],
"Оддын аялал, Aeon, Path болон галактик даяарх түүхийн холбоосыг тайл.":["Explore the Astral Express journey, Aeons, Paths and stories across the galaxy.","星穹列車の旅、星神、運命の道、銀河各地の物語を探ります。","은하 열차의 여정, 에이언즈, 운명의 길과 은하 전역의 이야기를 살펴보세요."],
"New Eridu, Hollow үзэгдэл болон хотын нууцлаг амьдралын цаадах түүхийг нээ.":["Uncover the stories behind New Eridu, Hollows and the city's mysterious life.","新エリー都、ホロウ現象、都市の謎めいた暮らしの裏にある物語を探ります。","뉴에리두, 공동 현상과 도시의 신비로운 삶 뒤에 숨은 이야기를 밝혀보세요."],
"Terra-ийн улс орнууд, Catastrophe, Originium болон түүхэн зөрчлийг судал.":["Explore Terra's nations, Catastrophes, Originium and historical conflicts.","テラの国々、カタストロフィ、源石、歴史的な対立を研究します。","테라의 국가, 재앙, 오리지늄 및 역사적 갈등을 연구합니다."],
"Kivotos-ийн сургуулиуд, клубүүд, сурагчид болон хотын нууцыг судал.":["Explore Kivotos' schools, clubs, students and urban mysteries.","キヴォトスの学園、部活、生徒、都市の謎を調べます。","키보토스의 학교, 동아리, 학생 및 도시의 비밀을 살펴봅니다."]
});


Object.assign(dict,{
"Арга хэмжээнүүд ачаалж байна…":["Loading events…","イベントを読み込み中…","이벤트를 불러오는 중…"],
"Нийтлэл ачаалж байна…":["Loading articles…","記事を読み込み中…","게시글을 불러오는 중…"],
"Нийтлэгдсэн архивын мэдээлэл ачаалж байна...":["Loading published archive…","公開済みアーカイブを読み込み中…","게시된 아카이브 정보를 불러오는 중…"],
"Тайлбар: Эхний нийтлэлүүд нь архивын танилцуулга контент. Албан ёсны эх сурвалжаар нягталсан судалгааг редакцын шалгалтын дараа нийтэлнэ.":["Note: Initial entries are introductory archive content. Research verified against official sources will be published after editorial review.","注：初期の記事はアーカイブの紹介コンテンツです。公式情報を確認した研究記事は編集審査後に公開します。","안내: 초기 게시글은 아카이브 소개용 콘텐츠입니다. 공식 출처를 확인한 연구 글은 편집 검토 후 게시됩니다."],
"Тайлбар: Ангиллуудыг платформын эхний хувилбарт нэгдсэн бүтэц болгон харуулж байна. Light Novel болон Web Novel-ийн тусгай каталог, өгөгдлийн холболтыг дараагийн хөгжүүлэлтээр нэмнэ.":["Note: Categories are presented in a unified structure in this initial platform release. Dedicated Light Novel and Web Novel catalogs and data integrations will be added in a future update.","注：初期リリースではカテゴリーを統合形式で表示しています。ライトノベルとWeb小説の専用カタログおよびデータ連携は今後追加予定です。","안내: 초기 플랫폼 버전에서는 카테고리를 통합 구조로 제공합니다. 라이트 노벨 및 웹소설 전용 카탈로그와 데이터 연동은 추후 추가됩니다."],
"Үндсэн мэдээлэл, архивын дараа гишүүнчлэл болон платформын нэмэлт үйлчилгээг эндээс сонгоорой.":["Explore membership and additional platform services here, alongside the archive and core information.","アーカイブや基本情報に加え、会員プランやプラットフォームの追加サービスはこちらからご確認ください。","아카이브와 기본 정보 외에 멤버십 및 플랫폼 추가 서비스를 여기에서 확인하세요."],
"Заргүй унших, тусгай нийтлэл болон гишүүдэд зориулсан боломжууд. Сарын багц 5,000₮ · Жилийн багц 60,000₮.":["Ad-free reading, exclusive articles and member benefits. Monthly plan: ₮5,000 · Annual plan: ₮60,000.","広告なしでの閲覧、限定記事、会員向け特典をご利用いただけます。月額：5,000₮ · 年額：60,000₮。","광고 없는 열람, 독점 게시글 및 회원 전용 혜택을 이용하세요. 월간 요금제: 5,000₮ · 연간 요금제: 60,000₮."],
"Платформд зар байршуулах":["Advertise on the platform","プラットフォームに広告を掲載","플랫폼에 광고 게재"],
"Брэнд, тоглоом, үйлчилгээний сурталчилгаагаа LOREVERSE-ийн уншигчдад хүргэх хүсэлт илгээнэ.":["Submit a request to promote your brand, game or service to LOREVERSE readers.","ブランド、ゲーム、サービスをLOREVERSEの読者に紹介する広告掲載をお申し込みいただけます。","브랜드, 게임 및 서비스를 LOREVERSE 독자에게 홍보하는 요청을 제출하세요."],
"Хамтын ажиллагаа":["Partnership","パートナーシップ","제휴 문의"],
"Админтай холбогдох":["Contact support","サポートに問い合わせ","관리자에게 문의"],
"Аккаунт, төлбөр, Premium болон техникийн асуудлаа хүсэлтээр илгээнэ. Хариуг энэ хэсгээс хянах боломжтой.":["Submit requests about your account, payments, Premium membership or technical issues. Track replies here.","アカウント、支払い、Premium、技術的な問題についてお問い合わせください。回答はこのセクションで確認できます。","계정, 결제, 프리미엄 및 기술 문제를 문의하세요. 답변은 이 섹션에서 확인할 수 있습니다."],
"Асуудлын төрөл":["Issue type","お問い合わせ種別","문의 유형"],
"Аккаунт / нэвтрэх":["Account / login","アカウント / ログイン","계정 / 로그인"],
"Төлбөр":["Payment","お支払い","결제"],
"Premium эрх":["Premium membership","Premium会員","프리미엄 멤버십"],
"Техникийн алдаа":["Technical issue","技術的な問題","기술 문제"],
"Community / чат":["Community / chat","コミュニティ / チャット","커뮤니티 / 채팅"],
"Гарчиг":["Subject","件名","제목"],
"Дэлгэрэнгүй тайлбар":["Detailed description","詳細","상세 설명"],
"Зураг / баримтын холбоос (заавал биш)":["Image / document link (optional)","画像 / 資料リンク（任意）","이미지 / 문서 링크 (선택 사항)"],
"Асуудлаа товч бичнэ үү":["Briefly describe the issue","問題の概要を入力してください","문제를 간단히 설명해 주세요"],
"Юу болсон, хэзээнээс эхэлсэн, ямар төхөөрөмж ашиглаж байгаагаа бичнэ үү.":["Describe what happened, when it started and which device you are using.","何が起きたか、いつから発生しているか、使用している端末を記入してください。","문제가 발생한 상황과 시작 시점, 사용 중인 기기를 적어 주세요."],
"Админд хүсэлт илгээх":["Send support request","サポートリクエストを送信","관리자에게 문의 보내기"],
"Миний хүсэлтүүд":["My requests","自分のお問い合わせ","내 문의"],
"Нэвтэрсний дараа хүсэлтүүд харагдана.":["Your requests will appear after you log in.","ログインするとお問い合わせ内容が表示されます。","로그인하면 문의 내역이 표시됩니다."],
"Хүсэлт илгээж, хариугаа харахын тулд имэйлээр бүртгүүлж нэвтэрнэ үү.":["Register with your email and log in to submit requests and view replies.","お問い合わせの送信と返信の確認には、メールアドレスで登録してログインしてください。","문의 제출 및 답변 확인을 위해 이메일로 가입하고 로그인하세요."],
"Нэвтэрч орно уу.":["Please log in.","ログインしてください。","로그인해 주세요."],
"Туслах цэс":["Help","ヘルプ","도움말"],
"Нэг платформ. Олон ертөнц.":["One platform. Many universes.","ひとつのプラットフォームに、無数の世界。","하나의 플랫폼, 수많은 세계."],
"Тоглоом, анимэ сонирхогчдод зориулсан lore, дүр, түүх, судалгааны нэгдсэн сан бүтээнэ.":["A unified archive of lore, characters, stories and research for game and anime fans.","ゲーム・アニメファンのために、Lore、キャラクター、物語、研究を集約したアーカイブを構築します。","게임 및 애니메이션 팬을 위한 Lore, 캐릭터, 스토리 및 연구 통합 아카이브를 만듭니다."],
"Баримт ба таамгийг ялгана.":["Separate facts from theories.","事実と考察を明確に区別します。","사실과 추측을 구분합니다."],
"Албан ёсны өгүүлэмж, тоглоом доторх эшлэл, баталгаажаагүй онолыг тусад нь тэмдэглэж, эх сурвалжийг ил тод дурдана.":["Official narrative, in-game quotations and unverified theories are labeled separately, with sources clearly identified.","公式設定、ゲーム内の引用、未確認の考察を区別し、出典を明記します。","공식 서사, 게임 내 인용 및 검증되지 않은 추측을 구분하고 출처를 명확히 표시합니다."],
"Фэнүүдийн бүтээсэн, албан бус мэдлэгийн платформ.":["An unofficial, fan-created knowledge platform.","ファンが運営する非公式の知識プラットフォームです。","팬이 만든 비공식 지식 플랫폼입니다."],
"Эх сурвалжийг нийтлэхийн өмнө редакцаар нягтална.":["Sources are reviewed by editors before publication.","出典は公開前に編集チームが確認します。","출처는 게시 전에 편집팀의 검토를 거칩니다."],
"Дахин ачаалах":["Reload","再読み込み","새로고침"],
"Дахин оролдох":["Try again","再試行","다시 시도"],
"Чат сервертэй холбогдож чадсангүй.":["Could not connect to the chat server.","チャットサーバーに接続できませんでした。","채팅 서버에 연결할 수 없습니다."],
"Энэ хэл болон ангилалд нийтлэгдсэн мэдээлэл одоогоор алга.":["There is no published content in this language and category yet.","この言語とカテゴリーで公開されている情報はまだありません。","이 언어 및 카테고리에 게시된 정보가 아직 없습니다."],
"Энэ хэлний орчуулга хараахан нийтлэгдээгүй.":["A translation in this language has not been published yet.","この言語の翻訳はまだ公開されていません。","이 언어의 번역은 아직 게시되지 않았습니다."],
"Одоогоор нийтлэгдсэн арга хэмжээ алга.":["No events have been published yet.","現在公開中のイベントはありません。","아직 게시된 이벤트가 없습니다."],
"Арга хэмжээнд бүртгүүллээ.":["You have registered for the event.","イベントへの参加登録が完了しました。","이벤트 참가 신청이 완료되었습니다."],
"Оролцохын тулд нэвтэрнэ үү.":["Please log in to join.","参加するにはログインしてください。","참여하려면 로그인하세요."],
"Одоогоор мэдэгдэл алга.":["There are no notifications yet.","通知はまだありません。","아직 알림이 없습니다."],
"Хариу бичиж байна:":["Replying to:","返信先：","답장 대상:"],
"Болих":["Cancel","キャンセル","취소"],
"Бүртгэл үүсгэх эсвэл багийн бүртгэлээр нэвтэрнэ. Админ эрхийг эзэмшигч баталгаажуулсны дараа нээнэ.":["Create an account or sign in with your team account. Administrator access is granted after owner approval.","アカウントを作成するか、チームアカウントでログインしてください。管理者権限はオーナーの承認後に付与されます。","계정을 만들거나 팀 계정으로 로그인하세요. 관리자 권한은 소유자의 승인 후 부여됩니다."],
"Редактор нэвтрэх":["Editor login","編集者ログイン","편집자 로그인"],
"Франчайз, бүтээл, орчуулга. Нийтлэх эрхийг Supabase RLS шалгана.":["Manage franchises, works and translations. Publishing permissions are enforced by Supabase RLS.","フランチャイズ、作品、翻訳を管理します。公開権限はSupabase RLSで制御されます。","프랜차이즈, 작품 및 번역을 관리합니다. 게시 권한은 Supabase RLS가 적용합니다."]
});


Object.assign(dict,{
"Төлбөрийн хэсэг рүү":["Go to payment section","お支払いセクションへ","결제 섹션으로 이동"],
"Эхний нийтлэлүүд нь архивын танилцуулга контент. Албан ёсны эх сурвалжаар нягталсан судалгааг редакцын шалгалтын дараа нийтэлнэ.":["The initial articles are introductory archive content. Research verified against official sources will be published after editorial review.","初期の記事はアーカイブの紹介コンテンツです。公式情報を確認した研究記事は編集審査後に公開します。","초기 게시글은 아카이브 소개 콘텐츠입니다. 공식 출처를 확인한 연구 글은 편집 검토 후 게시됩니다."],
"Эхний нийтлэлүүд нь архивын танилцуулга контент. Албан ёсны эх сурвалжаар нягталсан судалгааг редакц шалгалтын дараа нийтэлнэ.":["The initial articles are introductory archive content. Research verified against official sources will be published after editorial review.","初期の記事はアーカイブの紹介コンテンツです。公式情報を確認した研究記事は編集審査後に公開します。","초기 게시글은 아카이브 소개 콘텐츠입니다. 공식 출처를 확인한 연구 글은 편집 검토 후 게시됩니다."],
"Асуудлаа товч бичнэ үү":["Briefly describe your issue","問題の概要を入力してください","문제를 간단히 설명해 주세요"],
"Юу болсон, хэзээнээс эхэлсэн, ямар төхөөрөмж ашиглаж байгаагаа бичнэ үү.":["Describe what happened, when it started, and which device you are using.","何が起きたか、いつから発生しているか、使用している端末を記入してください。","문제가 발생한 상황과 시작 시점, 사용 중인 기기를 적어 주세요."],
"Зураг / баримтын холбоос (заавал биш)":["Image / document link (optional)","画像 / 資料リンク（任意）","이미지 / 문서 링크 (선택 사항)"],
"Гарчиг":["Subject","件名","제목"],
"Дэлгэрэнгүй тайлбар":["Detailed description","詳細説明","상세 설명"],
"Админд хүсэлт илгээх":["Send support request","サポートリクエストを送信","관리자에게 문의 보내기"],
"Админтай холбогдох":["Contact support","管理者に問い合わせ","관리자에게 문의"],
"Аккаунт, төлбөр, Premium болон техникийн асуудлаа хүсэлтээр илгээнэ. Хариуг энэ хэсгээс хянах боломжтой.":["Submit requests about your account, payments, Premium membership, or technical issues. Track replies here.","アカウント、支払い、Premium、技術的な問題についてお問い合わせください。回答はこのセクションで確認できます。","계정, 결제, 프리미엄 및 기술 문제를 문의하세요. 답변은 이 섹션에서 확인할 수 있습니다."],
"Тайлбар:":["Details:","詳細：","안내:"],
"Тайлбар: Эхний нийтлэлүүд нь архивын танилцуулга контент.":["Note: The initial articles are introductory archive content.","注：初期の記事はアーカイブの紹介コンテンツです。","안내: 초기 게시글은 아카이브 소개 콘텐츠입니다."]
});


Object.assign(dict,{
"Community Feed":["Community Feed","コミュニティフィード","커뮤니티 피드"],
"Бүх тоглоомын нэгдсэн урсгал болон тоглоом тус бүрийн тусгай community.":["One global feed for all games, plus a dedicated community for each game.","全ゲーム共通のフィードと、ゲームごとの専用コミュニティ。","모든 게임을 위한 통합 피드와 게임별 전용 커뮤니티."],
"Юу хуваалцмаар байна? Lore, мэдээ, асуулт эсвэл fanart...":["What would you like to share? Lore, news, a question, or fan art…","何を共有しますか？Lore、ニュース、質問、ファンアートなど…","무엇을 공유하고 싶으신가요? Lore, 뉴스, 질문 또는 팬아트…"],
"Нийтлэхийн тулд бүртгэлтэй хэрэглэгчээр нэвтэрнэ.":["Log in with a registered account to publish.","投稿するには登録済みアカウントでログインしてください。","게시하려면 등록된 계정으로 로그인하세요."],
"Тоглоом сонгох":["Choose a game","ゲームを選択","게임 선택"],
"Нэг профайл, нэг Rank — бүх тоглоомын community-д.":["One profile, one rank — across every game community.","ひとつのプロフィール、ひとつのランクで、すべてのゲームコミュニティに参加。","하나의 프로필, 하나의 랭크로 모든 게임 커뮤니티에 참여하세요."],
"Нийтлэлүүд ачаалж байна…":["Loading posts…","投稿を読み込み中…","게시글 불러오는 중…"],
"Одоогоор нийтлэл алга. Эхний нийтлэлийг чи оруулаарай.":["No posts yet. Be the first to publish.","まだ投稿はありません。最初の投稿をしてみましょう。","아직 게시글이 없습니다. 첫 게시글을 작성해 보세요."],
"Following feed үзэхийн тулд нэвтэрнэ үү.":["Log in to view your Following feed.","フォロー中のフィードを見るにはログインしてください。","팔로잉 피드를 보려면 로그인하세요."],
"Одоогоор дагадаг хэрэглэгч алга.":["You are not following anyone yet.","まだ誰もフォローしていません。","아직 팔로우하는 사용자가 없습니다."],
"Нийтлэл амжилттай нийтлэгдлээ.":["Your post has been published.","投稿を公開しました。","게시글이 게시되었습니다。"],
"Сэтгэгдэл бичих…":["Write a comment…","コメントを書く…","댓글 작성…"],
"Нийтлэл оруулахын тулд профайлаасаа бүртгүүлж эсвэл нэвтэрнэ үү.":["Create an account or log in from your profile to publish.","投稿するにはプロフィールから登録またはログインしてください。","게시하려면 프로필에서 가입하거나 로그인하세요."]
});


Object.assign(dict,{
"Бүх ертөнцийн мэдлэг":["Knowledge of All Universes","すべての世界の知識","모든 세계의 지식"],
"Нэгдсэн мэдлэгийн сан руу ↗":["Explore the unified knowledge archive ↗","統合ナレッジアーカイブへ ↗","통합 지식 아카이브로 이동 ↗"],
"Тоглоомын ертөнц":["Game Worlds","ゲームの世界","게임 세계"],
"Тоглоом, анимэ, манга, роман болон зохиомол ертөнц бүрийн түүх, дүр, газар нутаг, онол, судалгааг нэг нэгдсэн архиваас нээ.":["Explore the histories, characters, places, theories and research of games, anime, manga, novels and fictional universes in one unified archive.","ゲーム、アニメ、マンガ、小説など、あらゆる架空世界の歴史、キャラクター、場所、考察、研究をひとつのアーカイブで探索できます。","게임, 애니메이션, 만화, 소설 등 다양한 가상 세계의 역사, 캐릭터, 장소, 이론 및 연구를 하나의 통합 아카이브에서 살펴보세요."],
"Цуврал, дүрүүд, үйл явдал, ертөнцийн түүх":["Series, characters, stories and world histories","シリーズ、キャラクター、物語、世界の歴史","시리즈, 캐릭터, 스토리 및 세계관"],
"Манга, бүлэг, дүр, зохиолын судалгаа":["Manga, chapters, characters and story analysis","マンガ、各話、キャラクター、物語考察","만화, 에피소드, 캐릭터 및 스토리 분석"],
"Роман, зохиолын ертөнц ба дүрүүд":["Novels, fictional worlds and characters","小説、作品世界、キャラクター","소설, 작품 세계 및 캐릭터"],
"Вэб роман, цуврал өгүүлэмж, lore":["Web novels, serialized stories and lore","Web小説、連載ストーリー、Lore","웹소설, 연재 이야기 및 Lore"],
"Нэгдсэн хайлт, эх сурвалжтай Lore судалгаа":["Unified search and sourced lore research","統合検索と出典付きLore研究","통합 검색 및 출처가 명시된 Lore 연구"],
"Нэг платформ. Олон ертөнц. Хязгааргүй мэдлэг.":["One platform. Many universes. Unlimited knowledge.","ひとつのプラットフォームに、無数の世界と尽きない知識。","하나의 플랫폼, 수많은 세계, 끝없는 지식."],
"Бүх мэдээллийг хайх":["Search all knowledge","すべての情報を検索","모든 정보 검색"]
});


Object.assign(dict,{
"Үндсэн нүүр":["Home","ホーム","홈"],
"Нэгдсэн Lore Archive":["Unified Lore Archive","統合Loreアーカイブ","통합 Lore 아카이브"],
"Тоглоом, анимэ, манга, зохиолын ертөнц, бүтээл, дүр, тэдгээрийн холбоо болон timeline мэдээллийг нэг дороос хайж судлаарай.":["Explore games, anime, manga, fictional worlds, works, characters, their relationships and timelines in one place.","ゲーム、アニメ、マンガ、架空の世界、作品、キャラクター、その関係性や年表を一か所で検索・調査できます。","게임, 애니메이션, 만화, 가상 세계, 작품, 캐릭터, 관계 및 타임라인 정보를 한곳에서 검색하고 살펴보세요."],
"Ертөнц, бүтээлийн нэрээр хайх...":["Search worlds or titles...","世界・作品名で検索...","세계 또는 작품명 검색..."],
"Хэл":["Language","言語","언어"],
"Бүгд":["All","すべて","전체"],
"Нийтлэгдсэн архивын мэдээлэл ачаалж байна...":["Loading published archive entries...","公開済みアーカイブを読み込み中...","게시된 아카이브 정보를 불러오는 중..."],
"Нүүр хуудас":["Home","ホーム","홈"],
"Хувийн чат руу нэвтрэх":["Sign in to private chat","プライベートチャットにログイン","비공개 채팅 로그인"],
"Бусад гишүүдтэй хувийн мессежээр харилцахын тулд бүртгэлтэй аккаунтаараа нэвтэрнэ үү.":["Sign in to exchange private messages with other members.","他のメンバーとプライベートメッセージをやり取りするには、アカウントでログインしてください。","다른 회원과 비공개 메시지를 주고받으려면 계정으로 로그인하세요."],
"Таны нэр":["Your name","お名前","이름"],
"Шинэ аккаунт үүсгэх":["Create a new account","新しいアカウントを作成","새 계정 만들기"],
"Хувийн зурвасыг зөвхөн тухайн ярианд оролцож буй хоёр хэрэглэгч уншина. Зочин / anonymous аккаунтаар хувийн чат ашиглах боломжгүй.":["Only the two participants can read a private conversation. Guest/anonymous accounts cannot use private chat.","プライベートメッセージを読めるのは会話に参加している2人だけです。ゲスト／匿名アカウントでは利用できません。","비공개 대화는 참여자 두 명만 읽을 수 있습니다. 게스트/익명 계정은 비공개 채팅을 이용할 수 없습니다."],
"Шууд мессеж":["Direct messages","ダイレクトメッセージ","다이렉트 메시지"],
"Гишүүдтэй хувийн чатлах":["Chat privately with members","メンバーとプライベートチャット","회원과 비공개 채팅"],
"ГИШҮҮН ХАЙХ":["FIND MEMBERS","メンバーを検索","회원 검색"],
"Нэрээр хайх...":["Search by name...","名前で検索...","이름으로 검색..."],
"Гишүүд ачаалж байна…":["Loading members…","メンバーを読み込み中…","회원 불러오는 중…"],
"ТАНЫ ЯРИАНУУД":["YOUR CONVERSATIONS","あなたの会話","내 대화"],
"Одоогоор чат алга.":["No conversations yet.","まだ会話はありません。","아직 대화가 없습니다."],
"Профайл засах":["Edit profile","プロフィールを編集","프로필 수정"],
"Харилцах гишүүнээ сонгоно уу":["Select a member to chat with","チャットするメンバーを選択してください","대화할 회원을 선택하세요"],
"Шууд харилцаа":["Direct conversation","ダイレクトメッセージ","다이렉트 대화"],
"Зүүн талаас гишүүн сонгоод шинэ яриа эхлүүлээрэй. Таны хувийн зурвас бусдад харагдахгүй.":["Choose a member on the left to start a conversation. Your private messages are not visible to others.","左側からメンバーを選んで会話を始めてください。プライベートメッセージは他の人には表示されません。","왼쪽에서 회원을 선택해 대화를 시작하세요. 비공개 메시지는 다른 사람에게 보이지 않습니다."],
"Мессежээ бичнэ үү… (илгээхийн тулд эхлээд гишүүн сонгоно)":["Write a message… (select a member first)","メッセージを入力…（先にメンバーを選択）","메시지를 입력하세요… (먼저 회원을 선택하세요)"],
"Илгээх":["Send","送信","보내기"],
"Профайл тохируулах":["Edit profile","プロフィール設定","프로필 설정"],
"Гишүүдэд харагдах нэр болон профайл зургаа өөрчилнө үү.":["Change the name and profile picture visible to members.","メンバーに表示される名前とプロフィール画像を変更してください。","회원에게 표시되는 이름과 프로필 사진을 변경하세요."],
"Профайл зураг":["Profile picture","プロフィール画像","프로필 사진"],
"Болих":["Cancel","キャンセル","취소"],
"Хадгалах":["Save","保存","저장"],
"Game Lore Archive":["Game Lore Archive","ゲームLoreアーカイブ","게임 Lore 아카이브"],
"Тоглоом бүрийн ертөнц, дүрүүд, түүх, фракц болон нууцыг тус тусын архиваас судлаарай.":["Explore each game's world, characters, stories, factions and mysteries in its dedicated archive.","各ゲームの専用アーカイブで、世界観、キャラクター、物語、派閥、謎を調べましょう。","각 게임 전용 아카이브에서 세계관, 캐릭터, 이야기, 세력 및 비밀을 살펴보세요."],
"← Нүүр хуудас":["← Home","← ホーム","← 홈"],
"Тивүүд, Архонууд, дүрүүд болон Тейватын нууц.":["The nations, Archons, characters and secrets of Teyvat.","テイワットの国々、七神、キャラクター、そして謎。","티바트의 지역, 집정관, 캐릭터와 비밀."],
"Оддын аялал, гаргууд, фракц болон дүрүүд.":["Starfaring journeys, planets, factions and characters.","星々を巡る旅、惑星、派閥、キャラクター。","별을 향한 여정, 행성, 세력 및 캐릭터."],
"Сонирхолтой бүсүүд, Resonator болон түүх.":["Regions, Resonators and the story.","地域、共鳴者、そして物語。","지역, 공명자 및 이야기."],
"New Eridu, Hollows болон агентууд.":["New Eridu, Hollows and agents.","ニューエリドゥ、ホロウ、エージェント。","뉴에리두, 공동 및 에이전트."],
"Terra ертөнц, улс төр, операторуудын түүх.":["The world of Terra, its politics and Operators.","テラの世界、政治、オペレーターたちの物語。","테라 세계, 정치 및 오퍼레이터들의 이야기."],
"Kivotos хот, академиуд болон сурагчдын түүх.":["The city of Kivotos, its academies and students.","キヴォトスの街、学園、生徒たちの物語。","키보토스 도시, 학원 및 학생들의 이야기."],
"Ертөнц, хот, дүрүүд болон судалгааны архив.":["Worlds, cities, characters and research archive.","世界、都市、キャラクター、研究アーカイブ。","세계, 도시, 캐릭터 및 연구 아카이브."],
"АРХИВ НЭЭХ ↗":["OPEN ARCHIVE ↗","アーカイブを開く ↗","아카이브 열기 ↗"]
});


Object.assign(dict,{
"Хувийн чат":["Private chat","プライベートチャット","비공개 채팅"],
"Avatar зурагны HTTPS холбоос":["Avatar image HTTPS URL","アバター画像のHTTPS URL","아바타 이미지 HTTPS URL"],
"БҮХ ЕРТӨНЦИЙН МЭДЛЭГ НЭГ ДОР.":["KNOWLEDGE FROM EVERY UNIVERSE, IN ONE PLACE.","あらゆる世界の知識を、ひとつに。","모든 세계의 지식을 한곳에."],
"Дуртай анимэ, тоглоом, манга ертөнцийнхөө түүх, дүрүүд, нууц, онолыг нэг дороос нээ.":["Explore the stories, characters, mysteries and theories of your favorite anime, games and manga in one place.","お気に入りのアニメ、ゲーム、マンガの物語、キャラクター、謎、考察をひとつの場所で。","좋아하는 애니메이션, 게임, 만화의 이야기, 캐릭터, 비밀과 이론을 한곳에서 만나보세요."],
"Android APK татах ↓":["Download Android APK ↓","Android APKをダウンロード ↓","Android APK 다운로드 ↓"],
"Онцлох анимэ":["Featured anime","注目のアニメ","추천 애니메이션"],
"Light Novel мэдээлэл ↗":["Light Novel archive ↗","ライトノベルアーカイブ ↗","라이트 노벨 아카이브 ↗"],
"Web Novel мэдээлэл ↗":["Web Novel archive ↗","Web小説アーカイブ ↗","웹소설 아카이브 ↗"],
"Гишүүнчлэл ба тусгай архив":["Membership & exclusive archive","メンバーシップと限定アーカイブ","멤버십 및 전용 아카이브"],
"Нээлттэй нийтлэлүүд үнэгүй. Premium судалгаа, дэлгэрэнгүй lore-г гишүүнчлэлээр нээнэ.":["Public posts are free. Unlock premium research and in-depth lore with a membership.","公開記事は無料です。メンバーシップでプレミアム研究や詳細なLoreを閲覧できます。","공개 게시물은 무료입니다. 멤버십으로 프리미엄 연구와 심층 Lore를 이용하세요."],
"Бүртгүүлсний дараа имэйл баталгаажуулалт шаардагдаж болно.":["Email verification may be required after signing up.","登録後、メール認証が必要になる場合があります。","가입 후 이메일 인증이 필요할 수 있습니다."],
"Premium багцууд":["Premium plans","Premiumプラン","Premium 요금제"],
"Багцын мэдээлэл ачаалж байна…":["Loading plans…","プランを読み込み中…","요금제 불러오는 중…"],
"Premium lore сан":["Premium lore library","Premium Loreライブラリ","Premium Lore 라이브러리"],
"Таны эрхэд нийцсэн Premium нийтлэлүүд энд харагдана.":["Premium posts available to your membership will appear here.","メンバーシップで閲覧できるPremium記事がここに表示されます。","멤버십으로 이용할 수 있는 Premium 게시물이 여기에 표시됩니다."],
"Нэвтэрсний дараа эрхтэй нийтлэлүүдийг шалгана.":["Sign in to check which posts you can access.","ログインすると閲覧可能な記事を確認できます。","로그인하면 이용 가능한 게시물을 확인할 수 있습니다."],
"Бүх Lore — нэгдсэн архив":["All Lore — unified archive","すべてのLore — 統合アーカイブ","모든 Lore — 통합 아카이브"],
"Мэдээ":["News","ニュース","뉴스"],
"Бүтээл":["Work","作品","작품"],
"Дүр":["Character","キャラクター","캐릭터"],
"Байршил":["Location","場所","장소"],
"Фракц":["Faction","派閥","세력"],
"Үйл явдал":["Event","イベント","이벤트"],
"Өнөөдрийн анимэ":["Anime today","今日のアニメ","오늘의 애니메이션"],
"Алдартай, трэнд болж буй болон шинээр гарсан анимэ бүтээлүүд.":["Popular, trending and newly released anime.","人気・話題作・新作アニメ。","인기작, 트렌드 및 신작 애니메이션."],
"Бүх анимэ ↗":["All anime ↗","すべてのアニメ ↗","모든 애니메이션 ↗"],
"АЛДАРТАЙ ЦУВРАЛ":["POPULAR SERIES","人気シリーズ","인기 시리즈"],
"АНИМЭ КИНО":["ANIME MOVIES","アニメ映画","애니메이션 영화"],
"Киноны постеруудыг ачаалж байна…":["Loading movie posters…","映画ポスターを読み込み中…","영화 포스터 불러오는 중…"],
"ТРЭНД БОЛЖ БУЙ":["TRENDING","トレンド","트렌딩"],
"Шинэ мэдээлэл ачаалж байна…":["Loading latest updates…","最新情報を読み込み中…","최신 정보 불러오는 중…"],
"Зургийн мэдээлэл AniList каталогоос автоматаар татагдана.":["Image data is automatically retrieved from the AniList catalog.","画像情報はAniListカタログから自動取得されます。","이미지 정보는 AniList 카탈로그에서 자동으로 가져옵니다."],
"Teyvat-ийн долоон үндэстэн":["The seven nations of Teyvat","テイワットの七つの国","티바트의 일곱 국가"],
"Solaris-3-ийн ертөнц":["The world of Solaris-3","ソラリス-3の世界","솔라리스-3의 세계"],
"Нууцлаг хотын амьдрал":["Life in a mysterious city","謎めいた都市の暮らし","미스터리한 도시의 삶"],
"Оддын аялал":["Starfaring journey","星々を巡る旅","별을 향한 여정"],
"Terra-ийн түүх":["The history of Terra","テラの歴史","테라의 역사"],
"Kivotos-ийн архив":["Kivotos archive","キヴォトスアーカイブ","키보토스 아카이브"],
"Нийтлэл оруулах эрх одоогоор танд олгогдоогүй байна. Эрх хүсэх бол LOREVERSE админтай холбогдоно уу.":["You do not currently have permission to publish posts. Contact a LOREVERSE admin to request access.","現在、記事を投稿する権限がありません。権限を申請するにはLOREVERSE管理者にお問い合わせください。","현재 게시물 작성 권한이 없습니다. 권한을 요청하려면 LOREVERSE 관리자에게 문의하세요."],
"Lifetime Rank тогтмол хадгалагдана. Seasonal Rank улирал бүр шинэчлэгдэнэ.":["Lifetime Rank is permanent. Seasonal Rank resets each season.","Lifetime Rankは永久に保持され、Seasonal Rankはシーズンごとに更新されます。","Lifetime Rank는 유지되며 Seasonal Rank는 시즌마다 갱신됩니다."],
"Дэлгүүр ачаалж байна…":["Loading shop…","ショップを読み込み中…","상점 불러오는 중…"],
"Жагсаалт ачаалж байна…":["Loading list…","リストを読み込み中…","목록 불러오는 중…"],
"Хуучин танилцуулгын жишээ хэсэг. Нийтлэгдсэн бүх материал үндсэн нэгдсэн архивт байна.":["Legacy preview section. All published materials are available in the main unified archive.","旧プレビューセクションです。公開済みの資料はすべてメイン統合アーカイブにあります。","이전 미리보기 영역입니다. 게시된 모든 자료는 기본 통합 아카이브에서 확인할 수 있습니다."],
"Олон ертөнцийн мэдлэгээ сорьж, бусад Lorekeeper-тэй нэгдээрэй.":["Test your knowledge across universes and connect with other Lorekeepers.","さまざまな世界の知識を試し、ほかのLorekeeperとつながりましょう。","여러 세계의 지식을 시험하고 다른 Lorekeeper와 교류하세요."],
"Дуртай ертөнц, дүр, онол болон түүхийн талаар бусадтай санал бодлоо солилц.":["Share your thoughts on favorite worlds, characters, theories and stories.","お気に入りの世界、キャラクター、考察、物語について意見を交換しましょう。","좋아하는 세계, 캐릭터, 이론과 이야기에 대해 의견을 나누세요."],
"Нээлттэй арга хэмжээнүүд":["Upcoming events","開催予定イベント","예정된 이벤트"],
"Оролцооны урамшуулал":["Participation rewards","参加報酬","참여 보상"],
"Багт нэгдэх хүсэлт":["Join the team","チームへの参加申請","팀 합류 신청"],
"Ажилд орох хүсэлт, бүтээлийн жишээ болон туршлагын мэдээллээ манай үндсэн Gmail хаяг руу илгээнэ үү.":["Send your application, work samples and experience details to our official Gmail address.","応募書類、作品サンプル、経験情報を公式Gmailアドレスにお送りください。","지원서, 작업 샘플 및 경력 정보를 공식 Gmail 주소로 보내주세요."],
"Gmail-ээр хүсэлт илгээх ↗":["Apply via Gmail ↗","Gmailで応募 ↗","Gmail로 지원하기 ↗"],
"Товчийг дарахад Gmail-ийн шинэ захидал нээгдэнэ. Мэдээллээ бөглөж, өөрөө Send дарж илгээнэ.":["The button opens a new Gmail message. Fill in your details and press Send to submit it.","ボタンを押すとGmailの新規メールが開きます。必要事項を入力し、Sendを押して送信してください。","버튼을 누르면 새 Gmail 메일이 열립니다. 내용을 작성한 뒤 Send를 눌러 제출하세요."],
"Premium төлбөр":["Premium payment","Premium決済","Premium 결제"],
"QPay автомат төлбөр":["QPay automatic payment","QPay自動決済","QPay 자동 결제"],
"Сарын болон жилийн багцынхаа төлбөрийг QPay апп-аар уншуулна.":["Pay for your monthly or yearly plan by scanning with the QPay app.","QPayアプリでQRコードを読み取り、月額または年額プランをお支払いください。","QPay 앱으로 QR 코드를 스캔해 월간 또는 연간 요금제를 결제하세요."],
"Сарын багц · 5,000₮":["Monthly plan · MNT 5,000","月額プラン · 5,000₮","월간 요금제 · 5,000₮"],
"Жилийн багц · 60,000₮":["Yearly plan · MNT 60,000","年額プラン · 60,000₮","연간 요금제 · 60,000₮"],
"QPay нэхэмжлэл":["QPay invoice","QPay請求書","QPay 청구서"],
"Хаан Банк · Шилжүүлэг":["Khan Bank · Bank transfer","ハーン銀行 · 振込","칸 은행 · 계좌 이체"],
"Данс эзэмшигч:":["Account holder:","口座名義：","예금주:"],
"Дансны дугаар:":["Account number:","口座番号：","계좌번호:"],
"Банк:":["Bank:","銀行：","은행:"],
"Гүйлгээний утгад LOREVERSE хэрэглэгчийн имэйл болон сонгосон багцаа бичнэ үү.":["Enter your LOREVERSE account email and selected plan in the transfer description.","振込内容にLOREVERSEアカウントのメールアドレスと選択したプランを入力してください。","이체 메모에 LOREVERSE 계정 이메일과 선택한 요금제를 입력하세요."],
"Дансны дугаар хуулах":["Copy account number","口座番号をコピー","계좌번호 복사"],
"QPay төлбөрийн төлөвийг зөвхөн QPay серверээс шалгаж баталгаажуулна. QR код үүссэн нь төлбөр амжилттай болсон гэсэн үг биш.":["Payment status is verified by the QPay server. Generating a QR code does not mean payment has succeeded.","QPayの支払い状況はQPayサーバーで確認されます。QRコードの生成は支払い完了を意味しません。","결제 상태는 QPay 서버에서 확인됩니다. QR 코드 생성만으로 결제가 완료된 것은 아닙니다."],
"Сайт руу буцах":["Back to site","サイトに戻る","사이트로 돌아가기"],
"Гишүүн":["Member","メンバー","회원"],
"Яриагаа эхлүүлээрэй":["Start a conversation","会話を始めましょう","대화를 시작하세요"],
"Эхний мессежээ илгээнэ үү. Энэ яриаг зөвхөн та хоёр уншина.":["Send the first message. Only the two of you can read this conversation.","最初のメッセージを送信してください。この会話を読めるのは2人だけです。","첫 메시지를 보내세요. 이 대화는 두 사람만 읽을 수 있습니다."],
"Бүртгэлээрээ нэвтэрнэ үү":["Please sign in to your account","アカウントにログインしてください","계정에 로그인하세요"],
"Lifetime Rank буурахгүй. Season Rank улирал солигдоход шинэчлэгдэнэ.":["Lifetime Rank never decreases. Season Rank resets when the season changes.","Lifetime Rankは下がりません。Season Rankはシーズン変更時に更新されます。","Lifetime Rank는 하락하지 않습니다. Season Rank는 시즌이 바뀔 때 갱신됩니다."],
"Lifetime Rank шатлал":["Lifetime Rank ladder","Lifetime Rankのランク表","Lifetime Rank 등급표"],
"Идэвхтэй улирал":["Current season","開催中のシーズン","현재 시즌"],
"Улирлын XP тусдаа тооцогдоно. Улирлын шагнал, зорилтууд дараагийн хувилбарт нэмэгдэнэ.":["Seasonal XP is tracked separately. Seasonal rewards and goals will be added in a future update.","Seasonal XPは別途集計されます。シーズン報酬と目標は今後のアップデートで追加予定です。","시즌 XP는 별도로 계산됩니다. 시즌 보상과 목표는 추후 업데이트에서 추가됩니다."],
"Худалдан авалт шууд баталгаажиж, үлдэгдэл сервер дээр шинэчлэгдэнэ.":["Purchases are confirmed immediately and your balance is updated on the server.","購入は即時に確定し、残高はサーバー上で更新されます。","구매가 즉시 확인되며 잔액은 서버에서 업데이트됩니다."],
"Авах":["Buy","購入","구매"],
"Одоогоор мэдээлэл алга.":["No information available yet.","現在、情報はありません。","아직 정보가 없습니다."]
});


Object.assign(dict,{
"Админ нэвтрэх":["Admin sign in","管理者ログイン","관리자 로그인"],
"Supabase холболт бэлдэж байна…":["Connecting to Supabase…","Supabaseに接続中…","Supabase 연결 중…"],
"Шинэ нууц үг":["New password","新しいパスワード","새 비밀번호"],
"Шинэ нууц үг давтах":["Confirm new password","新しいパスワードを再入力","새 비밀번호 확인"],
"Шинэ нууц үг хадгалах":["Save new password","新しいパスワードを保存","새 비밀번호 저장"],
"Удирдлагын самбар":["Control panel","管理ダッシュボード","관리 대시보드"],
"Нийтлэл":["Posts","記事","게시물"],
"Хүлээгдэж буй зар":["Pending ads","審査待ち広告","대기 중인 광고"],
"Гишүүнчлэл":["Membership","メンバーシップ","멤버십"],
"✦ AI редактор нээх":["✦ Open AI editor","✦ AIエディターを開く","✦ AI 편집기 열기"],
"Зар":["Ads","広告","광고"],
"Баг":["Team","チーム","팀"],
"Бүртгэлүүд":["Accounts","アカウント","계정"],
"Туслах авах":["Recruit staff","スタッフ募集","직원 모집"],
"Санал хүсэлт":["Feedback","フィードバック","피드백"],
"Системийн шалгалт":["System check","システムチェック","시스템 점검"],
"Стикер үүсгэгчийг Admin дотроос шууд ашиглана. Шинэ цонхоор нээх шаардлагагүй.":["Use the sticker creator directly inside Admin. No new window is required.","ステッカー作成ツールはAdmin内で直接利用できます。新しいウィンドウを開く必要はありません。","스티커 제작기는 Admin 안에서 바로 사용할 수 있습니다. 새 창을 열 필요가 없습니다."],
"Стикер PNG хэлбэрээр таны төхөөрөмжид татагдана. Энэ нь нийтлэлд автоматаар нийтлэхгүй.":["The sticker is downloaded to your device as a PNG. It is not published automatically.","ステッカーはPNG形式で端末に保存されます。記事へ自動公開はされません。","스티커는 PNG 형식으로 기기에 다운로드됩니다. 게시물에 자동 게시되지 않습니다."],
"Нийтлэл үүсгэх":["Create post","記事を作成","게시물 만들기"],
"Ерөнхий / хамаарахгүй":["General / not applicable","一般／該当なし","일반 / 해당 없음"],
"Дүр / сэдэв (заавал биш)":["Character / topic (optional)","キャラクター／トピック（任意）","캐릭터 / 주제 (선택 사항)"],
"Агуулгын төрөл":["Content type","コンテンツ種別","콘텐츠 유형"],
"URL slug (латин)":["URL slug (Latin)","URLスラッグ（英数字）","URL 슬러그 (영문)"],
"Товч тайлбар":["Short summary","概要","간단한 설명"],
"Үндсэн агуулга (текст)":["Main content (text)","本文（テキスト）","본문 (텍스트)"],
"Нүүр зургийн URL":["Cover image URL","カバー画像URL","표지 이미지 URL"],
"Premium гишүүдэд зориулсан нийтлэл":["Post for Premium members","Premium会員向け記事","Premium 회원 전용 게시물"],
"Ноорог хадгалах":["Save draft","下書きを保存","임시 저장"],
"Нийтлэх":["Publish","公開","게시"],
"Зарын хүсэлтүүд":["Ad requests","広告申請","광고 요청"],
"Зар татаж байна…":["Loading ads…","広告を読み込み中…","광고 불러오는 중…"],
"Owner/Admin нь багийн гишүүдийг удирдана. Шинэ гишүүнийг эхлээд хэрэглэгчээр бүртгүүлсний дараа эрх олгоно.":["Owners/Admins manage team members. A new member must first register as a user before permissions can be granted.","Owner/Adminがチームメンバーを管理します。新しいメンバーは先にユーザー登録する必要があります。","Owner/Admin이 팀원을 관리합니다. 새 팀원은 먼저 사용자로 가입해야 권한을 부여할 수 있습니다."],
"Багийн гишүүний хэрэглэгчийн UUID":["Team member user UUID","チームメンバーのユーザーUUID","팀원 사용자 UUID"],
"Эрх":["Role","権限","권한"],
"Editor — нийтлэл":["Editor — posts","Editor — 記事","Editor — 게시물"],
"Ads manager — зар":["Ads manager — ads","Ads manager — 広告","Ads manager — 광고"],
"Admin — удирдлага":["Admin — management","Admin — 管理","Admin — 관리"],
"Эрх олгох":["Grant role","権限を付与","권한 부여"],
"Premium багцын үнэ":["Premium plan prices","Premiumプラン料金","Premium 요금 가격"],
"Үнэ MNT-ээр тохируулна. QPay автомат нэхэмжлэл хараахан холбогдоогүй.":["Prices are set in MNT. QPay automatic invoicing is not connected yet.","価格はMNTで設定します。QPay自動請求はまだ接続されていません。","가격은 MNT로 설정합니다. QPay 자동 청구는 아직 연결되지 않았습니다."],
"Багцуудыг ачаалж байна…":["Loading plans…","プランを読み込み中…","요금제 불러오는 중…"],
"Туслах ажилтан авах":["Recruit staff","スタッフ募集","직원 모집"],
"Хүсэлт шинэчлэх":["Refresh applications","申請を更新","지원서 새로고침"],
"Хүсэлтүүдийг ачаалж байна…":["Loading applications…","申請を読み込み中…","지원서 불러오는 중…"],
"Хэрэглэгчийн бүртгэл":["User accounts","ユーザーアカウント","사용자 계정"],
"Бүртгэлүүдийг харах болон шаардлагатай үед Auth бүртгэлийг устгах. Идэвхтэй багийн гишүүд болон өөрийн админ бүртгэлийг устгах боломжгүй. Устгал буцаах боломжгүй.":["View accounts and delete Auth accounts when necessary. Active team members and your own admin account cannot be deleted. Deletion cannot be undone.","アカウントを確認し、必要に応じてAuthアカウントを削除します。アクティブなチームメンバーと自分の管理者アカウントは削除できません。削除は取り消せません。","계정을 확인하고 필요한 경우 Auth 계정을 삭제합니다. 활성 팀원과 본인 관리자 계정은 삭제할 수 없습니다. 삭제는 되돌릴 수 없습니다."],
"Жагсаалт шинэчлэх":["Refresh list","リストを更新","목록 새로고침"],
"Хэрэглэгчдийн жагсаалтыг ачаална уу.":["Load the user list.","ユーザー一覧を読み込んでください。","사용자 목록을 불러오세요."],
"Өдрийн статистик · сүүлийн 14 мөр":["Daily statistics · latest 14 entries","日別統計 · 最新14件","일별 통계 · 최근 14개"],
"Арга хэмжээний нэр":["Event name","イベント名","이벤트 이름"],
"Төрөл":["Type","種類","유형"],
"Үндсэн админ":["Primary admin","メイン管理者","기본 관리자"],
"Editorial CMS — Архивын өгөгдөл":["Editorial CMS — Archive data","Editorial CMS — アーカイブデータ","Editorial CMS — 아카이브 데이터"],
"Нэр":["Name","名前","이름"],
"Франчайз":["Franchise","フランチャイズ","프랜차이즈"],
"Үндсэн нэр":["Original title","原題","원제"],
"Орчуулга / Lore":["Translation / Lore","翻訳／Lore","번역 / Lore"],
"Төлөв":["Status","ステータス","상태"],
"Дүр, газар, фракц / Entity":["Character, place, faction / Entity","キャラクター・場所・派閥／Entity","캐릭터, 장소, 세력 / Entity"],
"Хамаарах бүтээл (сонголтоор)":["Related work (optional)","関連作品（任意）","관련 작품 (선택 사항)"],
"Франчайзын түвшинд":["Franchise-wide","フランチャイズ全体","프랜차이즈 전체"],
"Байршил":["Location","場所","장소"],
"Эд зүйл":["Item","アイテム","아이템"],
"Зүйл / угсаатан":["Species / race","種族","종족"],
"Ойлголт":["Concept","概念","개념"],
"Хяналтад":["In review","審査中","검토 중"],
"Entity хадгалах":["Save entity","Entityを保存","Entity 저장"],
"Орчуулга хадгалах":["Save translation","翻訳を保存","번역 저장"],
"Дүрүүдийн холбоо / Relations":["Character relationships / Relations","キャラクター関係／Relations","캐릭터 관계 / Relations"],
"Эх entity":["Source entity","元Entity","원본 Entity"],
"Холбогдох entity":["Related entity","関連Entity","관련 Entity"],
"Холбооны төрөл":["Relationship type","関係の種類","관계 유형"],
"Холбооны тайлбар":["Relationship description","関係の説明","관계 설명"],
"Холбоос хадгалах":["Save relationship","関係を保存","관계 저장"],
"Үйл явдлын Timeline":["Event timeline","イベント年表","이벤트 타임라인"],
"Үйл явдлын түлхүүр":["Event key","イベントキー","이벤트 키"],
"Дараалал":["Order","順序","순서"],
"Ертөнц доторх огноо":["In-universe date","作中の日付","세계관 내 날짜"],
"Үйл явдал хадгалах":["Save event","イベントを保存","이벤트 저장"],
"Timeline орчуулга хадгалах":["Save timeline translation","年表の翻訳を保存","타임라인 번역 저장"],
"Франчайзын жагсаалт":["Franchise list","フランチャイズ一覧","프랜차이즈 목록"],
"Тойм":["Overview","概要","개요"],
"Дүрүүд":["Characters","キャラクター","캐릭터"],
"Баг":["Staff","スタッフ","스태프"],
"Холбоотой":["Related","関連","관련"],
"Танилцуулга":["Synopsis","あらすじ","줄거리"],
"Гол дүрүүд":["Main characters","主要キャラクター","주요 캐릭터"],
"Бүтээлч баг":["Creative team","制作チーム","제작진"],
"Холбоотой бүтээл":["Related works","関連作品","관련 작품"],
"Үндсэн мэдээлэл":["Basic information","基本情報","기본 정보"],
"Мэдээллийн эх сурвалж: AniList · LOREVERSE нь албан ёсны лиценз эзэмшигч биш.":["Source: AniList · LOREVERSE is not an official license holder.","情報源：AniList · LOREVERSEは公式ライセンス保有者ではありません。","출처: AniList · LOREVERSE는 공식 라이선스 보유자가 아닙니다."]
});

const langNames={mn:"Монгол",en:"English",ja:"日本語",ko:"한국어"};
let active="mn";
const pairs=Object.entries(dict).sort((a,b)=>b[0].length-a[0].length);
const originalText=new WeakMap();
const originalAttrs=new WeakMap();
const skipSelector='script,style,code,pre,svg,[data-no-i18n],[contenteditable="true"],.bubble,.message-name,.conversation,.member';
function translateText(s,lang){if(!s||lang==="mn")return s;let out=s;for(const [src,vals] of pairs){const to=vals[({en:0,ja:1,ko:2})[lang]];if(out===src)return to;if(out.includes(src))out=out.split(src).join(to);}return out;}
function translateNode(node){
 if(!node||!node.nodeValue?.trim()||node.parentElement?.closest(skipSelector))return;
 if(!originalText.has(node))originalText.set(node,node.nodeValue);
 node.nodeValue=translateText(originalText.get(node),active);
}
function translateAttributes(root){
 root.querySelectorAll?.("input[placeholder],textarea[placeholder],button[aria-label],select[aria-label],img[alt],[title]").forEach(el=>{
  if(el.closest(skipSelector))return;
  let saved=originalAttrs.get(el);if(!saved){saved=new Map();originalAttrs.set(el,saved);}
  for(const attr of ["placeholder","aria-label","alt","title"]){
   if(!el.hasAttribute(attr))continue;
   if(!saved.has(attr))saved.set(attr,el.getAttribute(attr));
   el.setAttribute(attr,translateText(saved.get(attr),active));
  }
 });
}
function walk(root){
 if(!root)return;
 if(root.nodeType===Node.TEXT_NODE){translateNode(root);return;}
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
 while((n=walker.nextNode()))translateNode(n);
 translateAttributes(root);
}
function apply(lang){
 active=["mn","en","ja","ko"].includes(lang)?lang:"mn";
 document.documentElement.lang=active;
 // Preserve each page's own descriptive document title.
 walk(document.body);
 document.querySelectorAll("#lang option,#publicArchiveLang option,#siteLang option").forEach(o=>{o.textContent=langNames[o.value]||o.textContent;});
 document.querySelectorAll("#lang,#publicArchiveLang,#siteLang").forEach(sel=>{if(sel.value!==active)sel.value=active;});
}
window.LOREVERSE_I18N={apply,get language(){return active;},t:(s)=>translateText(s,active)};
const selectors=[...document.querySelectorAll("#lang,#publicArchiveLang,#siteLang")];
if(selectors.length){
 const saved=localStorage.getItem("loreverse-language")||selectors[0].value||"mn";
 selectors.forEach(sel=>{sel.value=saved;sel.addEventListener("change",()=>{const lang=sel.value;localStorage.setItem("loreverse-language",lang);apply(lang);});});
 apply(saved);
}
new MutationObserver(records=>{if(active==="mn")return;for(const r of records)for(const n of r.addedNodes)walk(n);}).observe(document.body,{childList:true,subtree:true});
})();