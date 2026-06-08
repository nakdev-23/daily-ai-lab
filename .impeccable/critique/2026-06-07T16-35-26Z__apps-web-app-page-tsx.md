---
target: Daily AI Lab Home (apps/web/app/page.tsx)
total_score: 34
p0_count: 0
p1_count: 0
timestamp: 2026-06-07T16-35-26Z
slug: apps-web-app-page-tsx
---
# Critique: Daily AI Lab — Home (`apps/web/app/page.tsx`)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Quiz feedback (correct/wrong/hearts/XP), nav scroll-elevation, count-up, hover all clear |
| 2 | Match System / Real World | 4 | Plain bilingual copy; XP/streak/heart game metaphors; real tool names |
| 3 | User Control and Freedom | 3 | Quiz "Try again" reset; marquee pauses on hover. No undo needed at this scope |
| 4 | Consistency and Standards | 4 | Tokenized design system, consistent pills/cards/3D keys; faithful to handoff |
| 5 | Error Prevention | 3 | n/a — no destructive inputs on a marketing surface |
| 6 | Recognition Rather Than Recall | 4 | Text nav labels (not icon-only), visible tool names, nothing to memorize |
| 7 | Flexibility and Efficiency | 3 | Keyboard focus rings present; no shortcuts (not needed for landing) |
| 8 | Aesthetic and Minimalist Design | 3 | Brand-intentional density (atmos + orbs + grain + floating cards + marquee + reveals) trends busy |
| 9 | Error Recovery | 3 | Quiz wrong-answer recovers kindly ("ยังไม่ใช่ ลองอีกที"); no hard errors here |
| 10 | Help and Documentation | 3 | The page itself explains the product; "How it works" section; no contextual help needed |
| **Total** | | **34/40** | **Good — solid foundation, address weak areas** |

## Anti-Patterns Verdict

**Does this look AI-generated? No.** This is a distinctive, committed identity: the Riri mascot-led brand, Baloo 2 rounded display, tactile 3D "key" buttons (Duolingo-style), and a sun/hero palette on violet-tinted neutrals. It avoids the saturated reflexes (SaaS-cream, navy-and-gold, generic gradient hero). It reads as a real product with a point of view.

**However**, the page (faithfully ported from the official handoff) does contain several patterns Impeccable explicitly flags. They are brand-sanctioned in DESIGN.md, so they are choices, not accidents — but a critique names them so the call is deliberate:

- **Gradient text** on the hero ("one lab a day" uses `background-clip: text`). This is an Absolute Ban: decorative gradient text, mildly hurts legibility.
- **Per-section emoji eyebrows** (✨ Learn by playing · 🧰 AI tools · 🎯 How it works · 🚀 Career paths · 💜 Pricing). An eyebrow above nearly every section is the "AI grammar" tell.
- **Glassmorphism used broadly** (`.glass` with `backdrop-filter: blur` on tool cards, quiz, paths, plans), beyond the "sticky header + one hero card" the DESIGN.md prescribes.
- **Over-round radii** (cards 28px, panels 40px) — the codex over-round tell. Intentional "pillowy" brand, but worth a conscious eye.
- **feTurbulence grain** texture overlay (very subtle at .035 opacity).

**Deterministic scan**: `detect.mjs` on the markup (`page.tsx`) = 0 findings. On `home.css`: 3 — `bounce-easing` (the `--ease-bounce` token, the brand's signature playful overshoot, sanctioned in DESIGN.md) and 2× `layout-transition` (`transition: width` on the quiz + lab progress bars; tiny 14px bars that animate once on interaction, negligible).

**Visual overlays**: not available — no browser automation in this session. Fallback: source + detector review only.

## Overall Impression

A confident, charming landing that knows exactly what it is. The mascot, the tactile buttons, and the playable quiz are genuine differentiators most learning-app landings don't have. The biggest opportunity is **restraint**: the hero stacks a lot of simultaneous motion and ambient effect (orbs + grain + 3 floating cards + spinning... mascot bob + parallax), and several decorative tells (gradient text, glass everywhere, an eyebrow per section) pile up. Dialing two or three of those back would let the genuinely strong moments (Riri, the quiz, the 3D buttons) breathe.

## What's Working

1. **The playable quiz** is the standout — instant correct/wrong feedback, hearts, XP pop, and Riri cheering. It *shows* the product instead of describing it. This is the page's best 15 seconds.
2. **Tactile 3D buttons** — the solid colored "key" that depresses on press is a real, satisfying signature, consistent across primary/sunny/ghost.
3. **Committed brand identity** — Baloo 2 + sun/hero + Riri is cohesive and memorable; it passes both the first- and second-order category-reflex test.

## Priority Issues

- **[P2] Gradient text on the hero headline.** "one lab a day" uses gradient `background-clip: text`.
  - **Why it matters:** decorative gradient text slightly lowers contrast and is a recognizable tell; the emphasis can be carried by color + weight alone.
  - **Fix:** set the second line to solid `--hero-500` (#6C3CF5); keep the size/weight contrast.
  - **Suggested command:** `$impeccable typeset` (or `quieter`).

- **[P2] Small muted captions fail WCAG AA.** `--muted` #7F779A on white is ~3.9:1; on captions under 14px (tool meta, path meta, fcard sub-labels) that's below the 4.5:1 floor.
  - **Why it matters:** secondary text is genuinely hard to read for low-vision users (persona Sam).
  - **Fix:** use `--cloud-600` #5F5677 (~5.3:1) for sub-14px muted text, or bump those sizes to ≥14px bold.
  - **Suggested command:** `$impeccable colorize` (or `polish`).

- **[P3] An eyebrow on every section.** Five emoji eyebrows in a row read as scaffolding.
  - **Why it matters:** uniform per-section kickers are an AI-grammar tell; varying the cadence makes the page feel authored.
  - **Fix:** keep 1–2 eyebrows where they earn it (e.g., Pricing), drop the rest or replace with a different lead-in.
  - **Suggested command:** `$impeccable quieter`.

- **[P3] Glassmorphism beyond its remit.** `backdrop-filter` blur appears on most card families.
  - **Why it matters:** DESIGN.md says blur is for the sticky header + the hero glass card; broad use dilutes the effect and costs paint.
  - **Fix:** make non-hero cards solid white surfaces; reserve glass for the hero floating cards.
  - **Suggested command:** `$impeccable quieter` (or `optimize` for the paint cost).

- **[P3] Hero ambient density.** Orbs + grain + spot + 3 floating cards + mascot bob + parallax all run at once.
  - **Why it matters:** competes with the headline and CTAs (Aesthetic/Minimalist scored 3).
  - **Fix:** drop the grain or one orb on the hero; let the mascot + headline lead.
  - **Suggested command:** `$impeccable quieter`.

## Persona Red Flags

**Jordan (First-Timer):** Mostly safe — text nav labels, clear primary CTA ("Start learning free"), bilingual copy, and the quiz invites a no-risk try. Minor: "lab" as the unit of learning is brand jargon; it's explained by context but never defined outright.

**Sam (Accessibility):** Focus rings now present (good), images have alt text. Red flag: **muted caption contrast ~3.9:1 fails AA** for sub-14px text. Also the quiz conveys correct/wrong partly via color + a shake — the text feedback ("ถูกต้อง"/"ยังไม่ใช่") backs it up, so it's not color-alone, but verify the green/red states have a non-color cue (they do: ✓ key + copy).

**Casey (Mobile):** Responsive at 980/560, touch targets 44–62px, hero CTAs stack, LCP image eager + below-fold lazy. Red flag: the hero mascot stage (order -1, 440px tall) pushes the headline well down the first mobile screen; consider trimming stage height on small viewports so the value prop leads.

## Minor Observations

- `transition: width` on the quiz/lab progress bars → prefer `transform: scaleX` for GPU-only paint (negligible here, but it's the one real perf nit).
- `bounce-easing` is sanctioned by DESIGN.md as the brand signature; keep it, but it is the one place the brand diverges from the generic "ease-out only" rule — a deliberate, documented exception.
- `/icons/icon-192.png` 404s (referenced by the PWA manifest); add the asset or drop the reference.

## Questions to Consider

- What if the hero dropped two ambient layers so Riri and the headline carried it alone?
- Does "one lab a day" need a gradient, or would solid violet read more confidently?
- Five emoji eyebrows: which one actually earns its place?
