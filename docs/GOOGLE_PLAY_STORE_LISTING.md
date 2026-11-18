# LOREVERSE — Google Play Store Listing Draft

## App details
- App name: **LOREVERSE: Anime & Lore** (23/30 characters)
- Package ID: `mn.loreverse.app`
- Default language: Mongolian (mn)
- Category suggestion: Entertainment
- App type: App

## Short description (≤80 characters)
Анимэ, манга, тоглоомын lore, дүрүүд, хөтөч ба нийгэмлэгийг нэг дороос.

## Full description
LOREVERSE бол анимэ, манга, тоглоомын ертөнцийн мэдлэгийг Монгол хэлээр нэг дороос нээх нэгдсэн платформ юм.

**Судалж, нээ**
- Дуртай бүтээл, ертөнц, дүрүүдийн мэдээлэл
- Lore, түүхэн дараалал, холбоо хамаарал
- Судалгаа, тайлбар, хөтөч болон мэдээ

**Тоглоомын булан**
- Тоглоомын мэдээлэл, зөвлөмж, хөтөч
- Дүр, build болон тоглоомын мэдлэгийн сан

**Нийгэмлэг**
- Профайл, нийтлэл, сэтгэгдэл болон хэлэлцүүлэг
- Найзуудаа дагаж, сонирхлоо хуваалцах

**LORE AI**
- Lore болон платформын мэдээлэлтэй холбоотой асуулт асуух
- AI-ийн хариултыг эх сурвалжтай нь нягталж ашиглах

LOREVERSE нь хэрэглэгчийн үүсгэсэн контент агуулж болно. Нийтлэл, сэтгэгдэл болон харилцаанд платформын дүрэм үйлчилнэ.

Нэвтрэх болон зарим боломжийг ашиглахын тулд хэрэглэгчийн бүртгэл шаардлагатай.

Privacy Policy: https://lore-archive.pages.dev/legal/#privacy
Account deletion: https://lore-archive.pages.dev/account-deletion/

## Graphics
- App icon PNG (512 × 512): generated from `assets/loreverse-app-icon.svg`
- Feature graphic PNG (1024 × 500): generated from `store-assets/feature-graphic.svg`
- Phone screenshots: must be captured from the final Android app on real devices or a verified emulator. Do not use promotional mockups as screenshots.

## Play Console declarations — must be confirmed by the account owner
- Data Safety: verify actual data collection, sharing, retention and security against Supabase, QPay and analytics configuration before submitting.
- Content rating: complete the IARC questionnaire based on actual user-generated content, chat, AI, and media.
- Target audience: select only the audience the app is actually designed for.
- Ads: declare whether ads are shown in the app and whether third-party ad SDKs are used.
- App access: provide reviewer access instructions and a test account if login is required; never put credentials in public documentation.
- Contact email and developer identity: enter the actual monitored contact details and legal developer name in Play Console.

## Release gates
- Signed AAB built with the intended upload key.
- Package ID verified as `mn.loreverse.app`.
- Target API 36 verified.
- 64-bit native library coverage verified if native libraries are bundled.
- Account deletion works from inside the app and through the public URL.
- Privacy policy and Data Safety declarations are consistent.
- Closed testing completed if the account is subject to Google's 12 testers / 14 consecutive days requirement.
