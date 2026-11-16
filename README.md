# Lore Archive

**The Unified Lore Encyclopedia** — тоглоом, анимэ, манга, Light Novel, Web Novel болон тэдгээрийн зохиомол ертөнцийн мэдлэгийг нэг дор цуглуулах олон хэлний архив.

## Нэгдсэн ангилал

- **Game Lore** — тоглоомын ертөнц, түүх, дүр, байршил, фракц, чадвар, үйл явдал
- **Anime** — цуврал, улирал, анги, дүр, үйл явдал
- **Manga** — цуврал, бүлэг, дүр, зохиолын хувилбар
- **Light Novel** — боть, бүлэг, дүр, үйл явдал
- **Web Novel** — цахим зохиол, бүлэг, хувилбар
- **Universe Archive** — ертөнц, цаг хугацааны шугам, дүрүүдийн холбоо, канон хувилбар

## Одоогийн боломжууд

- Нэгдсэн ангиллын нүүр хэсэг болон үндсэн навигаци.
- Анимэ, манга, Light Novel, Web Novel хайлт — AniList GraphQL каталогоор.
- Тоглоомын lore хайлт — Supabase дахь content_posts хүснэгтийн нийтлэгдсэн бичлэгээр.
- Одоогийн нийтлэл, хэрэглэгчийн болон community функцуудыг хэвээр хадгалсан.

**Каталогийн хязгаарлалт:** AniList-ийн өгөгдлийн сан дахь media төрөл, эх сурвалжийн ангилал төгс биш. Light Novel болон Web Novel-ийн ялгалт нь AniList-ийн format / source талбарт тулгуурладаг тул бүх бүтээлийг бүрэн зөв ангилна гэж батлахгүй. Тоглоомын хайлт нь зөвхөн Lore Archive-д аль хэдийн нийтлэгдсэн бичлэгийг харуулна; гаднын тоглоомын бүрэн мэдээллийн сан биш.

## Мэдээллийн стандарт

Нийтлэл, архивын бичлэг бүр боломжтой тохиолдолд анхдагч болон албан ёсны эх сурвалж, Canon / Non-canon / Theory төлөв, spoiler түвшин, хэл болон орчуулгын төлөв, зохиогч, редактор, шинэчилсэн огноо, засварын түүхийг хадгална.

AI-аар үүсгэсэн ноорог болон орчуулгыг редакторын хяналтгүйгээр баталгаатай баримт гэж нийтлэхгүй. Бүтэн манга бүлэг, анимэ анги болон зохиогчийн эрхээр хамгаалагдсан материалыг зөвшөөрөлгүй хуулбарлахгүй.

## Хэлний төлөвлөгөө

Монгол (MN), English (EN), 日本語 (JA), 한국어 (KO). Олон хэлний интерфейс ба агуулгын бүрэн удирдлага нь дараагийн хөгжүүлэлтийн шатанд хамаарна.

## Хөгжүүлэлтийн дараагийн шат

1. Universe / Franchise / Work / Character / Timeline өгөгдлийн нэгдсэн загвар.
2. Supabase migration, өгөгдлийн эрхийн бодлого (RLS), редакторын CMS.
3. Нэг бүтээлийн олон хэлний агуулга, орчуулгын төлөв, хувилбарын түүх.
4. Редакторын батлах урсгал, эх сурвалжийн бүртгэл.
5. Хүртээмж, аюулгүй байдал, бодит орчны шалгалт ба GitHub Pages deployment.

## Хөгжүүлэлт ба байршуулалт

Одоогийн веб нь index.html дээр суурилсан статик сайт бөгөөд Supabase болон AniList-ийн нийтийн API-тай холбогдоно. Supabase-ийн publishable key нь браузерт ашиглахад зориулагдсан; өгөгдлийн аюулгүй байдал нь зөв тохируулсан RLS policy болон сервер талын эрхийн шалгалтаас хамаарна. Service-role key болон бусад нууц түлхүүрийг frontend кодод хэзээ ч байрлуулахгүй.

GitHub Pages-ийн эх сурвалж болон домэйн тохиргоог GitHub repository-ийн Settings → Pages хэсэгт удирдана. Кодын өөрчлөлт үндсэн салбарт нэгтгэгдэж, Pages deployment амжилттай болсны дараа л нийтэд шинэ хувилбар харагдана.

## Хамтын ажиллагаа

Судлаач, зохиогч, редактор, орчуулагч, дизайнер, хөгжүүлэгчид ажлын санал болон засварын хүсэлтээ issue / pull request хэлбэрээр илгээж болно. Нийтлэхийн өмнө редакцын хяналт хийнэ.


## Editorial CMS foundation

A separate `/editorial/` workspace is provided for staff members with `owner`, `admin`, or `editor` roles. It supports creating franchise records, works, and language-specific work translations in Mongolian, English, Japanese, and Korean. New records default to draft; publication is controlled by the editorial status and Supabase RLS policies. The workspace is an initial foundation, not a complete production CMS: entity editing, timeline editing, review queues, revision history, media upload, and audit logs remain future work.

The unified archive schema is applied to the linked Supabase project and its migration is tracked at `supabase/migrations/20261116104042_create_unified_lore_archive_schema.sql`.
