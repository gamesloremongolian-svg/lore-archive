package com.loreverse.ui.theme

import androidx.compose.ui.graphics.Color

/** Values traced to the supplied APK CSS. Compose values are an Android adaptation. */
object LoreverseColors {
    // App Dark — loreverse-theme.css
    val Background = Color(0xFF101827)
    val Surface = Color(0xFF192437)
    val SurfaceElevated = Color(0xFF22324A)
    val Border = Color(0xFF34465E)
    val TextPrimary = Color(0xFFEDF2F7)
    val TextSecondary = Color(0xFFAAB8C8)
    val Primary = Color(0xFF35B6A4)
    val Accent = Color(0xFFE5B96B)
    val Info = Color(0xFF6688A8)
    val Success = Color(0xFF35B6A4)
    val Warning = Color(0xFFE5B96B)
    val Error = Color(0xFFEF4444)

    // Guest Home Dark — home-redesign.css
    val GuestBackground = Color(0xFF080D1B)
    val GuestSurface = Color(0xFF151F39)
    val GuestSurfaceElevated = Color(0xFF1A2743)
    val GuestBorder = Color(0xFF35476B)
    val GuestPrimary = Color(0xFF6657DF)
    val GuestAccent = Color(0xFFB34BE5)

    // Content Light — index.html inline palette
    val LightBackground = Color(0xFFFFFFFF)
    val LightSurface = Color(0xFFF5F7F4)
    val LightSurfaceElevated = Color(0xFFEDF1EB)
    val LightBorder = Color(0xFFDCE3DA)
    val LightTextPrimary = Color(0xFF202820)
    val LightTextSecondary = Color(0xFF667166)
    val LightPrimary = Color(0xFF78985D)
}
