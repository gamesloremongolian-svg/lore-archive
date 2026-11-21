# LOREVERSE Lore мэдээллийн аудит — 2026-11-21

## Аудитын хамрах хүрээ

GitHub `loreverse-ctrl/lore-archive` репозиторын `main` салбар, GitHub Pages deployment, Playwright browser tests болон Supabase `nfacspfctvunwbxtvvyi` төслийн `public` схемийг шалгав.

Энэ тайлан нь бүтцийн, холбоосын болон редакцын төлөвийн аудит юм. Нийтлэгдсэн бүх франчайзын бүх өгүүлбэрийг тоглоом/манганы эх хувилбартай нэг бүрчлэн тулгасан бүрэн канон аудит гэж ойлгож болохгүй.

## Өгөгдлийн сангийн одоогийн тооллого

| Хэсэг | Нийт | Нийтлэгдсэн | Ноорог |
|---|---:|---:|---:|
| Франчайз / ертөнц | 28 | 28 | 0 |
| Бүтээл | 107 | 28 | 79 |
| Дүр, газар, бүлэглэл зэрэг entity | 167 | 55 | 112 |
| Timeline event | 34 | 6 | 28 |
| Нийтлэл (`content_posts`) | 27 | 21 | 6 |

## Энэ удаа хийсэн засвар

1. **Genshin Impact-ийн дүрийн архивыг өргөжүүлэв.**
   - 8 шинэ дүрийн бүртгэл үүсгэж, Монгол орчуулга, тайлбар, metadata, дэлгэрэнгүй профайл хэсэг болон HoYoverse-ийн албан ёсны эх сурвалжтай холбов: Albedo, Alhaitham, Arataki Itto, Baizhu, Barbara, Bennett, Cyno, Diluc.
   - Өмнө байсан 12 дүрийн мэдээллээс Amber, Jean, Lisa, Kaeya, Xiao, Beidou, Ningguang, Xiangling, Zhongli, Ganyu, Hu Tao, Keqing-ийн профайлыг албан эх сурвалжаар шинэчилж нийтлэв.
   - Genshin Impact-ийн нийтлэгдсэн entity: 25 (20 дүр, 3 faction, 2 location). Traveler болон Paimon нь эх сурвалжийн гүнзгий нягтлал шаардах тул ноорог хэвээр үлдэв.
   - Нүүр хуудсан дахь эхний 12 дүрийн жагсаалтаас 10 нь дэлгэрэнгүй профайл руу шилжинэ. Aino болон Aloy нь нэмэлт эх сурвалжийн нягтлал хүлээж байна.

2. **Динамик дүр/entity дэлгэрэнгүй хуудас нэмэв.**
   - `knowledge/?entity=<slug>&franchise=<slug>` хэлбэрээр Supabase-ийн нийтлэгдсэн Монгол профайл, дэлгэрэнгүй тайлбар, редакцын тэмдэглэл болон эх сурвалжийг харуулна. Ижил entity slug-тэй өөр франчайзын бичлэгүүдийг франчайзын slug-аар ялгана.
   - Genshin дүрийн жагсаалтын баталгаажсан профайлууд тухайн дэлгэрэнгүй хуудас руу холбоно.

3. **Timeline-ийн хоосон 3 ноорог content талбарыг нөхөв.**
   - Албан ёсны бүлэг/актын дараалал, канон ангилал, огнооны тодорхойгүй байдал, судалгааны төлөв болон редакцын тэмдэглэлийг нэмэв.
   - Эдгээрийг бүрэн үйл явдлын хураангуй гэж үзэхгүй; scene-level fact-check дуусаагүй тул ноорог хэвээр үлдээв.

4. **Сайтын техникийн засварууд.**
   - GitHub Pages canonical URL, Open Graph мэдээлэл, robots.txt болон sitemap-ийг бодит project path-тай тааруулав.
   - Sitemap-д нийтлэгдсэн 28 work, 21 post, 55 entity-ийн динамик дэлгэрэнгүй URL-уудыг нэмэв; noindex удирдлагын хуудсуудыг sitemap-аас хасав.
   - Knowledge нийтлэлийн deep link бүтэн текст, эх сурвалжийг харуулдаг болгож, Genshin entity deep link-ийн browser test нэмэв.
   - 1024px breakpoint, хуучирсан тестийн хүлээлт, Bug Report navigation test-ийг засав. Cover зураг бүртгэгдээгүй франчайзуудад нэрийн эхний үсэгтэй LOREVERSE fallback cover харуулдаг болгосон.

## Баталгаажсан шалгалтууд

- Франчайзын slug давхардал: 0
- Бүтээлийн slug давхардал: 0
- Франчайз доторх entity slug давхардал: 0
- Нийтлэгдсэн бүтээлд Монгол хэлний нийтлэгдсэн орчуулга дутсан тохиолдол: 0
- Нийтлэгдсэн entity-д Монгол орчуулга дутсан тохиолдол: 0
- Нийтлэгдсэн timeline event-д Монгол орчуулга дутсан тохиолдол: 0
- Entity relation-ийн эвдэрсэн foreign key холбоос: 0
- Эх сурвалжгүй нийтлэгдсэн content post: 0
- Ноорог entity-ийн тайлбар/эх сурвалж/content хоосон: 0
- Ноорог timeline event-ийн хоосон content: 0 (өмнө 3 байсан, одоо редакцын хяналтын metadata-гаар нөхсөн)
- Ноорог work-ийн эх сурвалжгүй: 76/79; эдгээрийг зохиомол холбоосоор нөхөөгүй, нийтлэхгүй хэвээр үлдээв.
- Нийтлэгдсэн франчайзын бодит cover зураггүй: 17/28; эдгээрт хоосон зай үлдээхгүй branded fallback cover харуулдаг. Бодит зургийг лиценз/албан эх сурвалж баталгаажсаны дараа оруулна.

## Үлдсэн редакцын ажил

- 79 ноорог бүтээлээс 76 нь эх сурвалжгүй. Албан ёсны эх сурвалжийг бүтээл тус бүрээр шалгаж байж нийтэлнэ.
- 112 ноорог entity-ийн канон үнэн зөв байдал, франчайз/бүтээлтэй холбоос, spoiler түвшин болон эх сурвалжийн чанарыг тус бүрээр хянах шаардлагатай.
- 28 timeline event-ээс 6 нь нийтлэгдсэн. Үлдсэн 28-ыг тоглоомын үйл явдлын эх хувилбар, хувилбарын дараалал, spoiler-ийн хүрээгээр нягтална.
- 17 франчайзын cover зурагт ашиглах эрх, эх сурвалжийн шалгалт шаардлагатай.
- 21 нийтлэгдсэн постын өгүүлбэрийн түвшний баримт шалгалт, хувилбар/канон ялгалт үргэлжилнэ.
- Genshin-ийн эхний 12 жагсаалтын Aino, Aloy профайлд тусгай эх сурвалжийн нягтлал шаардлагатай.

## Редакцын зарчим

Эх сурвалжаар батлагдаагүй мэдээллийг батлагдсан канон гэж нийтлэхгүй. Ноорог өгөгдлийг автоматаар нийтлэхгүй. Тоглоомын доторх өгүүлэмж, албан ёсны танилцуулга, сурталчилгааны материал, фэн онолыг ялгаж тэмдэглэнэ.

## Гол албан ёсны эх сурвалж

- Genshin Impact — Mondstadt: https://genshin.hoyoverse.com/en/character/mondstadt?char=11&lang=en
- Genshin Impact — Liyue: https://genshin.hoyoverse.com/en/character/liyue?char=3
- Genshin Impact — Inazuma: https://genshin.hoyoverse.com/en/character/inazuma?char=1&lang=en
- Genshin Impact — Sumeru: https://genshin.hoyoverse.com/en/character/sumeru?char=11
- Genshin Impact — Teyvat Map: https://genshin.hoyoverse.com/en/map
- ANANTA: https://www.anantagame.com/en/
- Arknights: https://www.arknights.global/
- Blue Archive: https://bluearchive.nexon.com/
- Honkai: Star Rail: https://hsr.hoyoverse.com/en-us/
- Wuthering Waves: https://wutheringwaves.kurogames.com/en/
- Zenless Zone Zero: https://zenless.hoyoverse.com/en-us/world/102173

## Гүнзгий Lore судалгааны эхний багц — 2026-11-21

Дараах 5 франчайзын бүртгэлийг шинээр үүсгэж, 6 ноорог бүтээлийг зөв франчайзтай холбон, Монгол тайлбар, эх сурвалж болон судалгааны бүтцийг баяжуулав:

- **20th Century Boys** — VIZ-ийн цуврал, эхний боть, шууд үргэлжлэл 21st Century Boys.
- **A Silent Voice** — Kodansha-ийн албан ёсны цувралын танилцуулга.
- **Ajin: Demi-Human** — Kodansha-ийн албан ёсны цуврал болон 1-р ботийн танилцуулга.
- **AKIRA** — Kodansha-ийн албан ёсны цуврал болон боть 1–6-ын хөтөч.
- **Black Clover** — VIZ-ийн манга танилцуулга, албан ёсны анимэ сайт, Studio Pierrot-ийн production archive. Манга ба анимэг тусдаа бүтээл хэвээр хадгалсан.

Эдгээр 6 work translation нь одоогоор **draft** хэвээр. Энэ нь санаатай: эхний албан ёсны эх сурвалжийн тойм нэмэгдсэн боловч дүр тус бүрийн бүрэн намтар, бүлэг/ангиар задалсан үйл явдлын дараалал, хүчний систем, adaptation comparison бүрэн шалгагдаагүй тул шууд нийтлээгүй.

Эхний багцын дараах баталгаажуулалт:
- 5 шинэ франчайзын draft бүртгэл үүсгэсэн; нийтлэгдсэн франчайз 28 хэвээр. Эдгээрийг хоосон архивын хуудас болгон шууд нийтлээгүй.
- Ноорог бүтээл франчайзгүй: 73 (өмнө 79).
- Эх сурвалжгүй ноорог бүтээл: 72.
- Placeholder synopsis-той ноорог бүтээл: 71.
- 6 бүтээлд research gaps, canon scope, source scope болон суурь Lore бүтэц нэмсэн.

Дараагийн багцад үлдсэн франчайзгүй бүтээлүүдийг зөв франчайзад холбож, албан ёсны хэвлэн нийтлэгч/студи/тоглоомын эх сурвалжаас мэдээлэл авч, manga/anime/game continuity-г хооронд нь хутгахгүй.

## Гүнзгий Lore судалгааны хоёр дахь багц — 2026-11-21

Нэмэлт 5 франчайзын draft бүртгэл үүсгэж, 8 бүтээлийг зөв франчайзтай нь холбон Монгол тайлбар, эх сурвалж, судалгааны бүтэц нэмэв:

- **BLEACH** — VIZ-ийн манга цувралын мэдээлэл, Thousand-Year Blood War-ийн албан ёсны story сайт.
- **BLUE LOCK** — Kodansha-ийн манга болон лицензийн албан ёсны мэдээлэл; TV анимэгийн албан ёсны сайт.
- **Blue Period** — Kodansha-ийн цуврал болон боть мэдээлэл.
- **Bocchi the Rock!** — албан ёсны анимэ introduction болон episode story.
- **Boruto: Naruto Next Generations** — VIZ-ийн албан ёсны цуврал болон бүлгийн портал; Naruto франчайзтай холбосон.
- **Chainsaw Man** — албан ёсны TV anime introduction болон VIZ-ийн франчайзын танилцуулга.

8 бүтээл бүгд draft хэвээр. Manga ба Anime бүртгэлийг тусад нь хадгалж, anime adaptation, filler болон manga continuity-ийн ялгааг судалгааны тэмдэглэлд оруулсан. Blue Lock-ийн анимэ албан ёсны сайт 3-р улирлын үйлдвэрлэл эхэлснийг тэмдэглэсэн; энэ нь анимэгийн өнөөгийн үйлдвэрлэлийн мэдээлэл болохоос манганы канон үйл явдал биш.

Хоёр дахь багцын дараах Supabase баталгаажуулалт:
- Нийтлэгдсэн франчайз: 28.
- Draft франчайз: 10.
- Draft work: 79.
- Франчайзтай холбоогүй draft work: 65 (өмнө 73).
- Эх сурвалжгүй draft work: 63 (өмнө 72).
- Placeholder synopsis-той draft work: 63 (өмнө 71).
- Судалгааны хязгаар/дутуу хэсгийн бүтэцтэй draft work: 14 (өмнө 6).
- Энэ багцын 8 work бүгд эх сурвалжийн холбоостой, зөв franchise_id-тэй.

Эх сурвалжийн тоо нь албан ёсны publisher/studio хуудсуудыг бүртгэсэн тоо; бүтээлийн бүх бүлэг, анги, дүрийн мэдээллийг бүрэн тулгасан гэсэн үг биш. Нийтлэхийн өмнө canon, timeline, дүр/байгууллагын холбоос, adaptation ялгааг гүнзгий шалгана.

## Гүнзгий Lore судалгааны гурав дахь багц — 2026-11-21

Дараагийн 3 франчайзын draft бүртгэл үүсгэж, 7 бүтээлийн Монгол тайлбар, эх сурвалж, canon scope болон судалгааны дутуу хэсгийг баяжуулав:

- **DANDADAN** — Shueisha Shonen Jump+ мангагийн албан ёсны бүлэг, анимэгийн албан ёсны портал. Manga/Anime тусдаа.
- **DEATH NOTE** — VIZ-ийн албан ёсны цувралын танилцуулга; одоо байгаа Death Note франчайзтай холбож, ангиллыг mixed болгосон.
- **Dr. STONE** — VIZ-ийн манга, албан ёсны анимэ episode archive, 2026 оны TERRAFORMING үргэлжлэлийн үйлдвэрлэлийн зар. Manga/Anime тусдаа.
- **Dragon Ball** — VIZ-ийн манга, Toei Animation-ийн анхны 1986 оны TV цувралын албан ёсны мэдээлэл. Manga/Anime тусдаа; энэ anime work зөвхөн анхны Dragon Ball TV цувралд хамаарна.

Баталгаажуулалт:
- Энэ багцын 7 work бүгд зөв франчайзтай холбогдсон.
- 7/7 work эх сурвалжийн холбоостой.
- Manga ба Anime continuity тусдаа хадгалагдсан.
- Dr. STONE TERRAFORMING-ийн 2026 оны зарлалыг цацагдсан анги бус, үйлдвэрлэлийн мэдэгдэл гэж тэмдэглэсэн.
- DANDADAN-ийн 3-р улирлын 2027 оны төлөвийг албан ёсны анимэ сайтаас авч, одоогийн манганы канон өрнөлтэй хутгаагүй.

Гурав дахь багцын дараах нийт өгөгдлийн баталгаажуулалт:
- Нийтлэгдсэн франчайз: 28.
- Draft франчайз: 13.
- Draft work: 79.
- Франчайзгүй draft work: 58 (өмнө 65).
- Эх сурвалжгүй draft work: 56 (өмнө 63).
- Placeholder synopsis-той draft work: 56 (өмнө 63).
- Research gaps/canon scope бүтэцтэй draft work: 21 (өмнө 14).

Эдгээр нэмэлт бүртгэлүүд нийтлэхэд бэлэн гэж тооцогдохгүй; draft хэвээр байна. Бүлэг/анги тус бүрийн үйл явдал, бүх дүрийн профайл, хүчний систем, timeline болон adaptation ялгааг эх бүтээлтэй тулгасны дараа редакцын шалгалтад оруулна.

## Нийтлэхийн өмнөх бэлтгэл — 2026-11-21

### Өмнө нэмсэн контентын төлөв

Эхний Genshin Impact багцын 8 дүрийн entity (Albedo, Alhaitham, Arataki Itto, Baizhu, Barbara, Bennett, Cyno, Diluc) өмнө нь нийтлэгдсэн хэвээр байна. Баталгаажуулалтаар 8/8 нь published entity + published Mongolian translation, эх сурвалжтай, дор хаяж 2 profile section-тэй.

Хоёр дахь болон гурав дахь багцын 15 work дараах байдлаар нийтлэхийн өмнөх шатанд бэлтгэгдэв:
- BLEACH — manga (2001), anime (2004)
- BLUE LOCK — manga (2018), anime (2022)
- Blue Period — manga (2017)
- Bocchi the Rock! — anime (2022)
- Boruto: Naruto Next Generations — manga (2016), Naruto франчайзтай холбосон
- Chainsaw Man — anime (2022)
- DANDADAN — manga (2021), anime (2024)
- Death Note — manga (2003), одоо байгаа Death Note франчайзтай холбосон
- Dr. STONE — manga (2017), anime (2019)
- Dragon Ball — manga (1984), анхны TV anime (1986)

### Бэлтгэлийн өөрчлөлт

- 15/15 work-д release year, Монгол synopsis, 1–3 албан ёсны publisher/studio эх сурвалж нэмсэн.
- 15/15-д world_context, 4–5 core concepts, characters, factions, canon/adaptation scope, spoiler policy, редакцын тэмдэглэл бүртгэсэн.
- Manga бүтээлүүдийг canon; anime adaptation-уудыг canon_status=unknown гэж ялгасан. Manga болон anime continuity-г нэг work болгон нийлүүлээгүй.
- Editorial status-ийг `review` болгосон. Archive work болон шинээр үүссэн franchise-ийн үндсэн status нь `draft` хэвээр тул public site-ийн published query-д харагдахгүй.
- Blue Lock-ийн 3-р улирлыг албан ёсны сайтаар дахин баталгаажуулсан: `BLUE LOCK: NEO EGOIST LEAGUE` нэртэй, 2026-06-09-нд зарлагдсан; 2026-11-21-ний байдлаар албан ёсны сайт үйлдвэрлэл явагдаж байгааг харуулж байгаа боловч нэвтрүүлгийн огноо зарлаагүй.
- Dr. STONE-ийн үндсэн TV цувралын төгсгөл болон 2026-10-10-нд зарлагдсан TERRAFORMING үргэлжлэлийг ялгасан.
- DANDADAN-ийн 3-р улирлыг 2027 оны төлөвлөсөн улирал гэж тэмдэглэсэн; цацагдсан контент гэж тооцоогүй.
- `knowledge/index.html` detail view-ийг шинэчилж, world context, core concepts, characters, factions, power system, locations/items, timeline, relationships, canon/adaptation, research limits болон редакцын тэмдэглэлийг харуулах болгосон.

### Supabase-ийн эцсийн баталгаажуулалт

- Нийтлэхийн өмнөх editorial review: 15/15.
- Албан ёсны эх сурвалжтай: 15/15.
- Дэлгэрэнгүй профайлтай (world context 200+ тэмдэгт, 4+ core concepts): 15/15.
- Work status: 15/15 draft; franchise-ийн status ч мөн draft хэвээр (Boruto болон Death Note нь аль хэдийн published franchise-д холбогдсон).
- 8 Genshin entity: 8/8 published, 8/8 эх сурвалжтай, 8/8 дор хаяж 2 profile section-тэй.

### Нийтлэхийн өмнө үлдсэн хаалт

Эдгээр нь автомат нийтлэхийг хориглох шалгалтын цэгүүд:
1. Редакторын эцсийн уншлага, Монгол найруулга ба нэр томьёоны жигдрүүлэлт.
2. Дүр, бүлэг/анги, timeline-ийн бүрэн canon mapping нь энэ товч танилцуулгын хүрээнд хийгдээгүй.
3. Шинэ франчайзын заримд эрхтэй cover art одоогоор байхгүй. Зөвшөөрөлгүй official poster/character art хуулж оруулаагүй; сайтын gradient fallback-ийг ашиглана.
4. Нийтлэх үед шинэ франчайз болон work status-ийг нэг deployment багцаар published болгох, sitemap болон public detail route-ийг шалгах шаардлагатай.

Иймээс 15 work нь редакцын хяналтын шатанд бэлтгэгдсэн; нийтэд автоматаар publish хийгдээгүй.

## Өмнө оруулсан мэдээллийн аудит — 2026-11-21

Энэ шалгалт нь сүүлийн 15 work-ийн шинэчлэлээс тусдаа, өмнө нь байсан бүх archive бүртгэл болон content_posts-ийг хамарсан.

### Одоогийн бүртгэлийн хэмжээ

| Хэсэг | Нийт | Нийтлэгдсэн | Draft / Review |
|---|---:|---:|---:|
| Franchises | 43 | 28 | 15 draft |
| Works | 107 | 28 | 79 draft |
| Entities | 167 | 55 | 112 draft |
| Timeline events | 34 | 5 | 29 draft |
| Content posts | 27 | 21 | 6 review |

### Илэрсэн бүтцийн асуудал ба хийсэн засвар

1. **Entity → Franchise холбоос тасарсан.** Анхны аудитад 36 entity franchise_id-гүй байсан. 20th Century Boys-ийн 14 entity-г өөрийн work-ийн franchise-аас зөв холбосон. Monster болон Pluto-ийн entity-үүдэд харгалзах franchise бүртгэл байгаагүй тул хоёр шинэ draft franchise үүсгэж, Monster-ийн 7, Pluto-ийн 14 entity болон хоёр work-ийг холбосон. Одоо 167/167 entity franchise-тай бөгөөд entity.franchise_id нь холбоотой work.franchise_id-тэй 100% таарч байна.
2. **Timeline canon/хувилбарын зөрүү.** Overlord-ийн `half-elf-demigod` event нь Light Novel-ийн 15–16-р ботийн үйл явдлыг тайлбарласан мөртлөө зөвхөн Overlord Anime work-д холбогдсон байсан. Энэ event-ийг нийтэд харагдах published төлөвөөс draft болгож буулгасан. Light Novel work тусад нь бүртгэсний дараа зөв холбоосоор дахин нийтлэх шаардлагатай.
3. **Франчайзын давхардал.** Ижил нэртэй 6 хос franchise илэрсэн:
   - Chainsaw Man: `chainsaw-man` (draft) / `chainsaw-man-manga` (published)
   - Demon Slayer: `demon-slayer-kimetsu-no-yaiba` / `demon-slayer-manga`
   - Frieren: `frieren-beyond-journeys-end` / `frieren-manga`
   - Jujutsu Kaisen: `jujutsu-kaisen` / `jujutsu-kaisen-manga`
   - Naruto: `naruto` / `naruto-manga`
   - One Piece: `one-piece` / `one-piece-manga`
   
   Эдгээрийн manga/anime work-ууд тусдаа franchise record-д холбогдсон байна. Энэ нь franchise түвшний давхардал; URL болон entity холбоосыг алдагдуулахгүйгээр нэгтгэх/redirect хийх тусгай migration шаардлагатай. Энэ аудитын хүрээнд эдгээрийг устгаж, нэгтгээгүй.
4. **Work-ийн холбоос дутуу.** 56 draft work franchise_id-гүй хэвээр; бүгдэд нь placeholder synopsis, албан ёсны source байхгүй. Эдгээр нь одоогоор бүрэн lore биш, зөвхөн каталогийн хоосон draft бүртгэл тул эх сурвалж болон зөв franchise-ийг баталгаажуулж байж холбох ёстой.
5. **Franchise cover зураг.** 28 published franchise-ийн 17 нь, 15 draft franchise-ийн 15 нь cover зураггүй. Нийт 43-аас 32 нь зураггүй. Зөвшөөрөлгүй poster/artwork ашиглаагүй; placeholder cover fallback хэвээр.
6. **Нийтлэгдсэн work-ийн гүнзгийрүүлэлт.** 28/28 published work эх сурвалжтай боловч 27/28 canon_status нь `unknown`. Зөвхөн 5/28 нь 200+ тэмдэгтийн world_context болон 3+ core concepts-тэй; 6/28 synopsis нь 150 тэмдэгтээс богино. Overlord work нь 5 section-тэй ч бусад 27 work-д ийм түвшний дэлгэрэнгүй lore бүтэц харагдахгүй. Иймээс source link байгаа нь бүрэн lore баталгаажсан гэсэн үг биш.
7. **Entity профайлын ялгаа.** 55/55 published entity эх сурвалжтай. Genshin Impact-ийн 25/25 entity тайлбар 100+ тэмдэгттэй, 20/25 нь дор хаяж 2 profile section-тэй. Overlord-ийн 30/30 entity эх сурвалжтай боловч 23/30 description 100 тэмдэгтээс богино, 0/30 нь profile_sections-тэй; тэдний content ихэвчлэн metadata төдий. Overlord-ийн дүрүүдийг тус тусад нь гүнзгийрүүлэх шаардлагатай.
8. **Timeline-ийн хэмжээ.** 5 published, 29 draft event байна. Published 5 event-ийн дотор in_universe_date талбар хоосон; одоогоор sort_order-оор эрэмбэлдэг. Он цагийн тодорхойгүй хэсгийг зохиомлоор бөглөж болохгүй.
9. **Content posts.** 27 нийтлэлээс 21 published, 6 review. 27/27 эх сурвалжтай боловч 27/27 cover_image_url хоосон. ANANTA-ийн 18 нийтлэлийн дотор Nova City/Lingyun-ийн газарзүйн сэдвээр 3 нийтлэл ихээхэн давхцаж байна: `ananta-nova-city-lingyun-regions`, `ananta-two-cities-cultural-contrast`, `ananta-two-cities-nova-chongxiao`. Эдгээрийг нэг үндсэн газрын зураглалын нийтлэл болгож, үлдсэн хоёрын өнцгийг ялгаж дахин засварлах хэрэгтэй.
10. **Relation graph.** 109 entity relation байна; 17 published, 92 draft. Self-link илрээгүй. Published relation-уудын description хоосон биш.

### ANANTA-ийн өмнөх мэдээллийн дахин шалгалт

- 2027-01-15 дэлхийн нээлтийн огноо албан ёсны ANANTA сайт болон PlayStation-ийн хуудсанд одоо ч хэвээр байна.
- Nova City ба Chongxiao-ийн Lingyun City хоёр хотын бүтэц албан ёсны PlayStation болон ANANTA сайтаар баталгаажсан.
- 2026 оны нээлтийн огнооны хэвлэлийн мэдээнд “Go Viral. Save the World.”, influencer/social influence, A.C.D. багийг дахин бүрдүүлэх, олон дүр солих, хотын даалгаврын системийн талаар тайлбарласан.
- Эдгээр нь тоглоом гарахаас өмнөх publisher/studio танилцуулга. Тоглоомын доторх бүрэн өгүүлэмж, дүрийн нууц, Chaos-ийн үүсэл зэрэг баталгаажаагүй lore-г нийтлэгдсэн факт мэт бичиж болохгүй.

### Эцсийн дүгнэлт

- Entity → Franchise холбоосын одоогийн алдаа: 0.
- Entity → Work → Franchise холбоосын зөрүү: 0.
- 2 шинэ draft franchise (Monster, Pluto) нэмэгдсэн.
- 1 Overlord timeline event-ийг буруу anime scope-оос draft болгон буулгасан.
- 6 franchise давхардал, 56 work-ийн франчайз/эх сурвалжийн дутуу байдал, Overlord entity профайлын гүнзгийрүүлэлт, published work-ийн canon шошго ба lore-ийн гүн, нийтлэлүүдийн cover болон давхардсан ANANTA сэдэв үлдсэн.

Энэ аудит нь өмнө оруулсан бүх мэдээллийг бүрэн өгүүлбэр бүрээр fact-check хийсэн гэсэн баталгаа биш. Энэ бол өгөгдлийн бүтэц, эх сурвалжийн бүртгэл, нийтлэлийн бэлэн байдлын аудит бөгөөд дээрх үлдсэн ажлуудыг тусад нь редакцын судалгаагаар дуусгана.

## Цэгцлэлтийн дараах баталгаажуулалт — 2026-11-21

Хэрэглэгчийн хүсэлтээр өгөгдлийн бүтцийн засвар хийв.

### Хийгдсэн засварууд

1. **6 давхардсан франчайзыг нэгтгэв.** Manga/anime work-уудыг нэг canonical franchise record-ийн дор шилжүүлж, хуучин франчайзын бүртгэлийг устгалгүйгээр `archived` болгосон. Work-ийн өөрийн slug болон орчуулга хэвээр хадгалагдсан.
   - Chainsaw Man: `chainsaw-man-manga` canonical; anime draft work-г шилжүүлэв.
   - Demon Slayer: `demon-slayer-kimetsu-no-yaiba` canonical.
   - Frieren: `frieren-beyond-journeys-end` canonical.
   - Jujutsu Kaisen: `jujutsu-kaisen` canonical.
   - Naruto: `naruto` canonical; Naruto anime/manga болон Boruto work нэг franchise-д холбогдов.
   - One Piece: `one-piece` canonical.
   - Canonical franchise category-г `mixed` болгож, Anime/Manga ангилалд хоёуланд нь харагдахаар тохируулсан.
2. **56 franchise-гүй work-ийг холбов.** Байгаа франчайзтай нэр таарсан бүтээлүүдийг тухайн франчайзад холбосон; бусад бүтээлд тус тусын draft франчайз үүсгэж, anime/manga төрлөөр ангилсан. Бүгд draft хэвээр, placeholder synopsis болон эх сурвалжгүй байдлыг бодит lore мэт нийтлээгүй.
3. **Overlord-ийн 30 entity профайлыг бүтэцжүүлэв.** 30/30 entity-д дор хаяж хоёр profile section нэмсэн. 11 гол дүрийн профайлыг албан ёсны тоглоом/анимэний дүрийн мэдээллээр баяжуулж, бусад дүр болон faction/concept/location/item-д одоо баталгаатай байгаа мэдээлэл ба судалгааны хязгаарыг ил тод ялгасан. 12 entity-д нэмэлт албан ёсны эх сурвалжийн холбоос нэмсэн.
4. **Нүүр хуудасны архивын тоолуурыг засав.** Нийт ертөнцийн тоо published franchise-ийг бүхэлд нь тоолно. Anime болон Manga тоолуурт `mixed` франчайзыг хоёуланд нь хамруулна; Game тоолуур зөвхөн game ангиллыг тоолно.

### Засварын дараах Supabase шалгалт

| Шалгалт | Үр дүн |
|---|---:|
| Нийт franchise | 85 |
| Published franchise | 23 |
| Draft franchise | 56 |
| Archived duplicate franchise | 6 |
| Franchise холбоосгүй work | 0 |
| Franchise холбоосгүй entity | 0 |
| Entity ↔ Work franchise mismatch | 0 |
| Published franchise нэрийн давхардал | 0 |
| Overlord entity profile_sections ≥ 2 | 30/30 |
| Published timeline event | 5 |
| Draft timeline event | 29 |

### Үлдсэн ажил

- 56 draft franchise/work-ийн албан ёсны эх сурвалж, release year, бүрэн Монгол lore судалгааг тус тусад нь хийх.
- 28 published work-ийн canon_status, synopsis, world_context болон дэлгэрэнгүй lore-г бүтээл тус бүрээр нягтлах; `unknown` утгыг таамгаар солихгүй.
- Overlord-ийн 6 дүрийн (Aureole Omega, Gazef, Jircniv, Renner, Rubedo, Victim) тусгай анхдагч эх сурвалжийн судалгааг үргэлжлүүлэх; одоогийн профайлд баталгаагүй мэдээллийг зориуд нэмээгүй.
- 17 published franchise-ийн cover зураг болон 27 нийтлэлийн cover зурагт зөвшөөрөлтэй/албан ёсны artwork сонгох.
- ANANTA-ийн Nova City/Lingyun гурван нийтлэлийн агуулгын давхардлыг редакцын түвшинд бууруулах.
- 29 draft timeline event-ийг эх сурвалжтайгаар шалгах; үйл явдлын огноо тодорхойгүй бол таамгаар бөглөхгүй.
- GitHub Pages-ийн шинэ commit-уудын deploy болон browser E2E шалгалтыг тусад нь баталгаажуулах.

**Анхааруулга:** DB-ийн холбоос, статуст хийсэн засварууд Supabase-д шууд хадгалагдсан. Нүүр хуудасны тоолуурын код GitHub-д commit хийгдсэн боловч энэ commit-ийн GitHub Pages deployment болон E2E үр дүн одоогоор баталгаажаагүй.
