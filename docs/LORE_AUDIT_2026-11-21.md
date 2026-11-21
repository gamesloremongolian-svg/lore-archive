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
   - `knowledge/?entity=<slug>` хэлбэрээр Supabase-ийн нийтлэгдсэн Монгол профайл, дэлгэрэнгүй тайлбар, редакцын тэмдэглэл болон эх сурвалжийг харуулна.
   - Genshin дүрийн жагсаалтын баталгаажсан профайлууд тухайн дэлгэрэнгүй хуудас руу холбоно.

3. **Timeline-ийн хоосон 3 ноорог content талбарыг нөхөв.**
   - Албан ёсны бүлэг/актын дараалал, канон ангилал, огнооны тодорхойгүй байдал, судалгааны төлөв болон редакцын тэмдэглэлийг нэмэв.
   - Эдгээрийг бүрэн үйл явдлын хураангуй гэж үзэхгүй; scene-level fact-check дуусаагүй тул ноорог хэвээр үлдээв.

4. **Сайтын техникийн засварууд.**
   - GitHub Pages canonical URL, Open Graph мэдээлэл, robots.txt болон sitemap-ийг бодит project path-тай тааруулав.
   - Sitemap-д нийтлэгдсэн 28 work, 21 post-ийн динамик дэлгэрэнгүй URL-уудыг нэмэв; noindex удирдлагын хуудсуудыг sitemap-аас хасав.
   - Knowledge нийтлэлийн deep link бүтэн текст, эх сурвалжийг харуулдаг болгож, Genshin entity deep link-ийн browser test нэмэв.
   - 1024px breakpoint, хуучирсан тестийн хүлээлт, Bug Report navigation test-ийг засав.

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
- Нийтлэгдсэн франчайзын cover зураггүй: 17/28; зөвшөөрөлтэй, албан ёсны зураг сонгох шаардлагатай тул placeholder зураг зохиомлоор оноогоогүй.

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
