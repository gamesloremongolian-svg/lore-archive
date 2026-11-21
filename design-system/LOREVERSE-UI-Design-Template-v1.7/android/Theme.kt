package com.loreverse.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

enum class LoreverseThemeMode { AppDark, GuestHomeDark, ContentLight }

private val AppDarkScheme = darkColorScheme(
    primary = LoreverseColors.Primary,
    secondary = LoreverseColors.Info,
    tertiary = LoreverseColors.Accent,
    background = LoreverseColors.Background,
    surface = LoreverseColors.Surface,
    surfaceVariant = LoreverseColors.SurfaceElevated,
    outline = LoreverseColors.Border,
    onPrimary = LoreverseColors.Background,
    onBackground = LoreverseColors.TextPrimary,
    onSurface = LoreverseColors.TextPrimary,
    onSurfaceVariant = LoreverseColors.TextSecondary,
    error = LoreverseColors.Error
)

private val GuestHomeScheme = darkColorScheme(
    primary = LoreverseColors.GuestPrimary,
    secondary = LoreverseColors.GuestAccent,
    background = LoreverseColors.GuestBackground,
    surface = LoreverseColors.GuestSurface,
    surfaceVariant = LoreverseColors.GuestSurfaceElevated,
    outline = LoreverseColors.GuestBorder,
    onPrimary = LoreverseColors.TextPrimary,
    onBackground = LoreverseColors.TextPrimary,
    onSurface = LoreverseColors.TextPrimary,
    error = LoreverseColors.Error
)

private val ContentLightScheme = lightColorScheme(
    primary = LoreverseColors.LightPrimary,
    secondary = LoreverseColors.Info,
    background = LoreverseColors.LightBackground,
    surface = LoreverseColors.LightSurface,
    surfaceVariant = LoreverseColors.LightSurfaceElevated,
    outline = LoreverseColors.LightBorder,
    onPrimary = LoreverseColors.LightBackground,
    onBackground = LoreverseColors.LightTextPrimary,
    onSurface = LoreverseColors.LightTextPrimary,
    onSurfaceVariant = LoreverseColors.LightTextSecondary,
    error = LoreverseColors.Error
)

@Composable
fun LoreverseTheme(
    mode: LoreverseThemeMode = LoreverseThemeMode.AppDark,
    content: @Composable () -> Unit
) {
    val scheme = when (mode) {
        LoreverseThemeMode.AppDark -> AppDarkScheme
        LoreverseThemeMode.GuestHomeDark -> GuestHomeScheme
        LoreverseThemeMode.ContentLight -> ContentLightScheme
    }
    MaterialTheme(colorScheme = scheme, content = content)
}
