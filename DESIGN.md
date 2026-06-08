---
name: Daily AI Lab
description: A playful, mascot-led brand for learning AI tools 15 minutes a day.
colors:
  sun: "#FFD43A"
  sun-deep: "#E0A800"
  hero: "#6C3CF5"
  hero-deep: "#5728E0"
  hero-ink: "#481FB8"
  punch: "#FD7302"
  ink: "#1B1729"
  body: "#463F58"
  muted: "#7F779A"
  page: "#F7F5FC"
  surface: "#FFFFFF"
  border: "#E0DAEF"
  mint: "#14A871"
  berry: "#EE5A52"
  amber: "#F4A100"
  sky: "#2A8CF0"
  pink: "#F45C97"
typography:
  display:
    fontFamily: "Baloo 2, Anuphan, system-ui, sans-serif"
    fontSize: "clamp(46px, 6vw, 80px)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Baloo 2, Anuphan, system-ui, sans-serif"
    fontSize: "clamp(32px, 4vw, 48px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Baloo 2, Anuphan, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "normal"
  body:
    fontFamily: "Anuphan, system-ui, -apple-system, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Anuphan, system-ui, sans-serif"
    fontSize: "12.5px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.14em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "0.01em"
rounded:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "20px"
  xl: "28px"
  2xl: "40px"
  pill: "999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "24px"
  6: "32px"
  7: "40px"
  8: "48px"
  9: "64px"
components:
  button-violet:
    backgroundColor: "{colors.hero}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "0 34px"
    height: "62px"
  button-violet-active:
    backgroundColor: "{colors.hero}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "0 34px"
    height: "62px"
  button-sun:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.hero-ink}"
    rounded: "{rounded.pill}"
    padding: "0 34px"
    height: "62px"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.hero-deep}"
    rounded: "{rounded.pill}"
    padding: "0 34px"
    height: "62px"
  pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.hero-ink}"
    rounded: "{rounded.pill}"
    padding: "8px 18px"
  card-glass:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    rounded: "{rounded.xl}"
    padding: "24px"
  quiz-option:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    rounded: "{rounded.md}"
    padding: "15px 16px"
---

# Design System: Daily AI Lab

## 1. Overview

**Creative North Star: "Riri's Sticker Lab"**

Daily AI Lab is an AI-for-everyone brand that turns learning AI tools into a daily, game-like habit. The whole identity hangs off one character: **Riri**, a round yellow cockatiel in a violet superhero cape. The interface should feel like Riri's world rendered as a soft, pillowy sticker book, a friendly mobile game crossed with a learning app. Everything is rounded, lifted, and tactile; nothing is sharp or flat. High-energy color (sun yellow, hero violet) sits on calm violet-tinted neutrals so the brand feels bright without shouting. It is Thai-first: copy mixes Thai and English, and every typeface ships full Thai coverage.

The system explicitly rejects: corporate SaaS minimalism, bluish dashboard gradients, cold gray neutrals, pure black, glassmorphism-as-decoration, and noisy textures. Warmth comes from the mascot, the rounded type, and the color, not from beige backgrounds or drop-shadow soup.

**Key Characteristics:**
- Pillowy and rounded: pills for every button and chip, 20–28px on cards and panels, nothing boxy.
- Tactile 3D controls: buttons carry a solid colored "key" offset that depresses on press (Duolingo-style).
- Mascot-led: Riri's emotional poses are the brand's illustrations; reach for a pose before a generic spot graphic.
- Bright on calm: saturated sun/hero accents over a near-white lavender page (`#F7F5FC`).
- Playful, bouncy motion that respects `prefers-reduced-motion`.

## 2. Colors

A two-engine palette sampled straight from the mascot art: sun-yellow optimism and hero-violet action, grounded on violet-tinted neutrals, with orange and a small semantic set as seasoning.

### Primary
- **Hero Violet** (#6C3CF5): The cape. The action color, primary buttons, links, focus, brand chrome. Pressed/active deepens to the **Cape Core** (#5728E0) and the **Cape Ink** key shadow (#481FB8).
- **Sun Yellow** (#FFD43A): Riri's body. Big surfaces of optimism, the brand badge, streak/"today" energy, the sunny button. A *surface and accent color, never a text color.* Deepens to **Sun Deep** (#E0A800) for the sunny button's key shadow.

### Secondary
- **Punch Orange** (#FD7302): The cheeks and beak. Sparingly: notification dots, hot tags, small highlights. Never a primary button.

### Tertiary (semantic seasoning, used in feature accents and quiz states)
- **Mint** (#14A871): success, correct answers.
- **Berry** (#EE5A52): danger, wrong answers, the broken-heart red.
- **Amber** (#F4A100): warning.
- **Sky** (#2A8CF0): info.
- **Pink** (#F45C97): playful accent for streaks and sparkles.

### Neutral — "Cloud" (violet-tinted, never gray-by-default)
- **Ink** (#1B1729): deepest text and the footer surface. The darkest the system ever goes.
- **Body** (#463F58): default body text.
- **Muted** (#7F779A): secondary text, captions, meta.
- **Border** (#E0DAEF): hairline borders and dividers.
- **Page** (#F7F5FC): the near-white lavender page background.
- **Surface** (#FFFFFF): cards and panels.

### Named Rules
**The Violet-Ink-on-Yellow Rule.** Yellow is a surface, not a typeface. Violet ink (`#481FB8`) reads on sun yellow; white reads on hero violet. Never put yellow text on white.

**The No-Pure-Black Rule.** The darkest value in the system is Ink `#1B1729`. Pure `#000` is forbidden anywhere, including shadows (shadows are tinted violet).

## 3. Typography

**Display Font:** Baloo 2 (with Anuphan, system-ui fallback)
**Body Font:** Anuphan (with system-ui fallback)
**Label/Mono Font:** JetBrains Mono (code, prompts, tokens, model names)

**Character:** Baloo 2 is rounded and bubbly, it carries Riri's friendly voice in headlines, big numbers, and speech. Anuphan is a clean geometric Latin + Thai companion that keeps body copy crisp and readable. The contrast is rounded-display against neutral-body, never two similar sans pairs. Both ship full Thai coverage because the brand is Thai-first.

### Hierarchy
- **Display** (Baloo 2 800, clamp 46–80px, 1.02, -0.025em): Hero headline only. Uses `text-wrap: balance`.
- **Headline** (Baloo 2 800, clamp 32–48px, 1.05, -0.025em): Section titles (`.head h2`).
- **Title** (Baloo 2 800, 18–23px, 1.2): Card titles, plan names, feature headings, the wordmark.
- **Body** (Anuphan 400, 16px, 1.5): Paragraphs and descriptions. Lead paragraphs step up to 19px. Cap measure at 65–75ch.
- **Label** (Anuphan 800, 12.5px, +0.14em, uppercase): Section eyebrows and tiny tags only. Sentence case everywhere else.
- **Mono** (JetBrains Mono 500, 13px): Code, prompts, the quiz answer-key letters.

### Named Rules
**The Sentence-Case Rule.** Sentence case everywhere, including buttons and headings. Reserve uppercase for tiny tracked eyebrow labels only. Never ALL-CAPS a sentence.

**The Rounded-Voice Rule.** Headlines, big numbers, and stat values are always Baloo 2. If a number is meant to feel celebratory (XP, streaks, prices), it is display weight 800.

## 4. Elevation

Soft, lifted, faint-violet-tinted depth, never hard black drops, never decorative glassmorphism. Surfaces feel like stickers lifted slightly off the page. Shadows are always tinted toward violet (`rgba(39,16,96,...)` or `rgba(72,31,184,...)`), never neutral gray or black.

The signature move is the **3D key**: interactive controls carry a flat, solid-color offset shadow directly beneath them (like a physical game key), which shrinks when the control is pressed. This is what makes buttons feel tactile.

### Shadow Vocabulary
- **Soft sm → xl** (`0 2px 6px` → `0 28px 60px rgba(39,16,96,.08–.18)`): Ambient lift on cards, chips, floating UI.
- **Glass lift** (`inset 0 1px 0 rgba(255,255,255,.9), 0 22px 46px -16px rgba(72,31,184,.26)`): The pillowy `.glass` card, an inner top highlight plus a deep soft violet drop.
- **Violet key** (`0 6px 0 #481FB8, 0 16px 26px rgba(72,31,184,.42)`): Under the primary button; the `0 6px 0` solid offset is the tactile key.
- **Sun key** (`0 6px 0 #E0A800, ...`): The sunny button's key.
- **Focus glow** (`0 0 0 4px rgba(108,60,245,.22)`): Violet focus ring on interactive elements.

### Named Rules
**The Tactile-Key Rule.** Primary and sunny buttons always carry a solid colored offset shadow (`0 6px 0 <deep>`). On `:hover` it grows and the button lifts (-2px); on `:active` the key shrinks to `0 2px 0` and the button drops (+4px). A button with no key is wrong.

**The Tinted-Shadow Rule.** Every shadow is violet-tinted. A neutral or black shadow reads as a 2014 app, the tint is the brand.

## 5. Components

### Buttons
- **Shape:** Full pill (`999px`). Three sizes: lg 62px, md 50px, sm 44px tall; horizontal padding 20–34px. Font is Baloo 2 800.
- **Primary (Violet):** Vertical violet gradient (`#9173FA → #6C3CF5`), white text, violet key shadow.
- **Sunny:** Yellow gradient (`#FFE066 → #FFD138`), violet-ink text (`#481FB8`), sun key. Used for the upgrade / "Go Pro" call.
- **Ghost:** White fill, hero-deep text, soft `#E0DAEF` key + hairline border. The quiet secondary.
- **Hover / Press:** Hover lifts -2px and brightens slightly; press drops +4px and the key shrinks. Transition uses the bounce easing (`cubic-bezier(0.34,1.56,0.64,1)`).

### Chips / Pills
- **Style:** White pill, hero-ink text, hairline edge, soft inner-top highlight + small violet drop. Used for the hero eyebrow ("15 minutes a day"), tool tags, and meta chips.

### Cards / Containers (`.glass`)
- **Corner Style:** 28px (`--radius-xl`); large panels 40px (`--radius-2xl`).
- **Background:** White-to-near-white vertical gradient with `backdrop-filter: blur(14px)`.
- **Shadow Strategy:** Glass lift (see Elevation), inner top highlight + deep soft violet drop. Never pair a 1px border with a heavy black shadow.
- **Border:** 1px translucent white edge (`rgba(255,255,255,.72)`).
- **Internal Padding:** 22–34px.
- **Tilt variant:** Tool cards add a pointer-driven 3D tilt (`perspective(760px) rotateX/Y`) on hover.

### Quiz Option (signature component)
- **Style:** White, 2px `#E0DAEF` border, 14px radius, a small `0 3px 0` key, a mono letter chip (A/B/C). The interactive teaching primitive.
- **Correct:** Mint border + mint-100 fill + mint key. **Wrong:** Berry border + berry-100 fill + a shake animation, and a heart is greyed out.

### Navigation
- **Style:** Sticky, translucent white (`rgba(255,255,255,.72)`) with `backdrop-filter: blur(16px)`, hairline violet-tinted bottom border, 78px tall.
- **Brand mark:** Riri's `mascot-hello` pose inside a rotated sun-yellow rounded-square badge.
- **Links:** Anuphan 700, body color; hover shifts to hero violet and draws a violet underline that wipes in left-to-right.

### Mascot — Riri (the brand's illustration system)
Ten emotional poses (hello, point, thumbsup, fly, laptop, celebrate, read, sad-sit, sad, ohno). Keep Riri on light backgrounds with breathing room, at ≥96px. Pair the pose to the moment: thumbsup on a correct answer, fly on launch/upgrade, sad/ohno on errors and empty states, read on docs. Never recolor, stretch, or rotate the body; Riri may do a gentle idle bob.

## 6. Do's and Don'ts

### Do:
- **Do** make every button and chip a full pill (`999px`) and give primary/sunny buttons a solid colored key shadow that depresses on press.
- **Do** keep yellow as a surface/accent and write on it in violet ink (`#481FB8`); white text on violet.
- **Do** tint every shadow violet (`rgba(39,16,96,...)`), and keep the darkest value at Ink `#1B1729`.
- **Do** lead emotional, empty, success, and error moments with a Riri pose matched to the feeling.
- **Do** use Baloo 2 for headlines and celebratory numbers, Anuphan for body, JetBrains Mono for code/prompts.
- **Do** write in sentence case, Thai-first, keeping English tech terms ("prompt", "model", "token") in English.
- **Do** keep the bounce easing on playful state transitions, and provide a `prefers-reduced-motion` fallback for every animation.

### Don't:
- **Don't** use pure black `#000` anywhere, including shadows. Cold neutral grays are also forbidden; neutrals are violet-tinted "Cloud".
- **Don't** put yellow text on white, or use Punch orange as a primary button.
- **Don't** ship boxy corners or sharp edges; nothing in this system is un-rounded.
- **Don't** pair a 1px border with a heavy (≥16px blur) drop shadow on the same element (ghost-card tell).
- **Don't** lean on bluish dashboard gradients, noisy textures, or glassmorphism as decoration; blur is for sticky headers and the `.glass` card only.
- **Don't** ALL-CAPS sentences or set body copy in uppercase; reserve caps for tiny tracked eyebrows.
- **Don't** replace Riri with a generic stock illustration, and never recolor or distort the mascot.
