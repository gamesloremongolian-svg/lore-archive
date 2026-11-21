# LOREVERSE v1.7 — эх сурвалжийн аудит

## Баталгаажсан эх файлууд

1. `assets/public/assets/css/loreverse-theme.css`
   - `--bg #101827`, `--panel #192437`, `--panel2 #22324a`, `--line #34465e`
   - `--text #edf2f7`, `--muted #aab8c8`, `--cyan #35b6a4`, `--blue #6688a8`, `--gold #e5b96b`
2. `assets/public/assets/css/loreverse-home-redesign.css`
   - `html,body` суурь `#080d1b`; hero нь purple gradient; үндсэн panel `#151f39`; CTA gradient `#6657df` → `#b34be5`.
3. `assets/public/index.html`
   - inline light palette `#ffffff`, `#f5f7f4`, `#edf1eb`, `#dce3da`, `#202820`, `#667166`, `#78985d`.
4. `assets/public/assets/css/loreverse-shell.css`
   - sticky shell, dark navigation shell, responsive mobile menu, active route styling.
5. `assets/public/assets/js/loreverse-shell.js`
   - shared shell interaction script; interaction must still be runtime-tested.

## Тайлбар ба болгоомжлол

- Эдгээр нь эх CSS/HTML-д илэрсэн literal утгууд. Token-ийн semantic mapping (primary, accent гэх мэт) нь дизайн системийн ангилал бөгөөд эх сурвалжийн нэршилтэй яг адил байх албагүй.
- `content-light` нь `index.html`-ийн inline light palette; харин home redesign CSS түүнийг guest home дээр dark purple layout болгон override хийдэг. Иймээс theme-үүдийг бүх route-д автоматаар оноож болохгүй.
- APK доторх CSS файлууд байгаа нь бүх дэлгэц дээр ижил өнгө ашиглагддаг гэсэн баталгаа биш.
- Энэ багц нь дизайн систем ба Compose starter; runtime QA, Android build, accessibility audit, production backend wiring хийгдсэн гэж үзэхгүй.
