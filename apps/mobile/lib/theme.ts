// Daily AI Lab design tokens — "Riri's Sticker Lab".
// Faithful port of the web app's DESIGN.md: a bright, playful LIGHT theme on a
// lavender-tinted page, hero violet + sun yellow, rounded everything, tactile
// 3D-key buttons, violet-tinted soft shadows. Never pure black, never cold gray.
import type { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  // Surfaces
  bg: '#F7F5FC', // page — near-white lavender
  bgElevated: '#FFFFFF', // headers / nav
  card: '#FFFFFF', // surface
  cardAlt: '#F1ECFC', // soft violet tint panel
  border: '#E0DAEF', // hairline (violet-tinted)

  // Ink ("Cloud" neutrals — violet-tinted, never gray-by-default)
  text: '#1B1729', // ink — strongest text
  body: '#463F58', // default body copy
  textMuted: '#5E5775', // accessible secondary (≥4.5:1 on white)
  textFaint: '#8B83A3', // tiny meta only

  // Brand
  primary: '#6C3CF5', // hero violet — actions, links, brand chrome
  primaryDark: '#5728E0', // cape core (pressed)
  primaryInk: '#481FB8', // cape ink — text on yellow + key shadow
  accent: '#6C3CF5',
  sun: '#FFD43A', // surface/accent only — never text
  sunDeep: '#E0A800',
  punch: '#FD7302', // sparingly — dots, hot tags

  // Semantic seasoning
  success: '#14A871', // mint
  danger: '#EE5A52', // berry
  warn: '#F4A100', // amber
  sky: '#2A8CF0', // info
  pink: '#F45C97',

  // Role aliases used across screens
  heart: '#EE5A52',
  xp: '#6C3CF5',
  streak: '#FD7302',

  // Tints (for soft fills behind icons / states)
  heroTint: '#EEE8FE',
  sunTint: '#FFF4D1',
  mintTint: '#DCF5EC',
  berryTint: '#FCE4E3',
  skyTint: '#E2EFFD',
  pinkTint: '#FDE6EF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

// Font families (loaded in app/_layout via @expo-google-fonts).
export const fonts = {
  display: 'Baloo2_800ExtraBold', // headlines, big numbers
  title: 'Baloo2_700Bold', // card titles, wordmark
  bodyRegular: 'Anuphan_400Regular',
  bodyMedium: 'Anuphan_500Medium',
  bodySemibold: 'Anuphan_600SemiBold',
  bodyBold: 'Anuphan_700Bold',
  mono: 'monospace',
} as const;

export const font = {
  h1: 30,
  h2: 23,
  h3: 18,
  body: 15,
  small: 13,
  tiny: 11,
} as const;

// Violet-tinted soft shadows (the brand never uses black/gray shadows).
export const shadow = {
  card: {
    shadowColor: '#271060',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  } as ViewStyle,
  soft: {
    shadowColor: '#271060',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  } as ViewStyle,
} as const;

// Helpers so screens read like the web's type ramp.
export const display = (size: number, color = colors.text): TextStyle => ({
  fontFamily: fonts.display,
  fontSize: size,
  color,
});
export const titleText = (size: number, color = colors.text): TextStyle => ({
  fontFamily: fonts.title,
  fontSize: size,
  color,
});
