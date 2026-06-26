# Daily AI Lab — Mobile (Expo)

React Native app built with **Expo SDK 56** + **expo-router**, living in the same
monorepo as the web app and sharing business logic from [`@daily-ai-lab/core`](../../packages/core).
Connects to the **same Supabase backend** as the web app.

## Screens (expo-router file-based)
- `(auth)/login`, `(auth)/register` — email/password auth via Supabase
- `(tabs)/index` — Dashboard (XP/level/streak/hearts, continue learning, quick links)
- `(tabs)/learn` — course catalog (from Supabase `courses`) with progress
- `(tabs)/leaderboard` — `get_leaderboard` RPC, highlights you
- `(tabs)/profile` — stats, plan badge, menu, sign out
- `course/[slug]` — lesson list with sequential unlock + completion ticks
- `lesson/[slug]/[num]` — **lesson player**: theory → quiz → done, completes via
  `complete_lesson` RPC (server owns XP), uses `@daily-ai-lab/core` for levels
- `daily-learn/index` + `daily-learn/[topic]` — daily goal hero + lesson roadmap
- `docs/index` + `docs/[tool]` — AI tool guides (bundled markdown, rendered on-device)
- `paths/index` + `paths/[id]` + `paths-learn/[id]/[step]` — career paths with an
  independent `path:{slug}` progress track (content reused from the underlying course)
- `settings`, `upgrade`, `missions`

Content is bundled offline — regenerate from the web app's content:
- Lessons (219 / 21 courses): `node scripts/gen-content.mjs`
- Docs (349 / 32 tools): `node scripts/gen-docs.mjs`

### Env
Copy the Supabase values into `apps/mobile/.env` (already populated, anon key only):
`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

### Not ported (web-only for now)
Admin panel, Stripe checkout (Upgrade screen deep-links to the web checkout),
Google OAuth (email/password used instead), docs markdown hub, marketing/legal pages.

## Run it (no Android Studio needed to start)

The fastest path — test on your real phone:

1. Install the **Expo Go** app from the Play Store / App Store.
2. From the repo root (or this folder), start the dev server:
   ```bash
   npm run start --workspace @daily-ai-lab/mobile
   # or:  cd apps/mobile && npm run start
   ```
3. Scan the QR code shown in the terminal with Expo Go (Android) or the Camera app (iOS).
   Your phone and computer must be on the **same Wi‑Fi**.

### Other targets
- `npm run android` — opens in an Android emulator *(requires Android Studio + SDK)*.
- `npm run ios` — opens in the iOS Simulator *(requires macOS + Xcode)*.
- `npm run web` — opens in the browser.

## Monorepo notes
- Expo SDK 52+ auto-detects the npm workspace, so [`metro.config.js`](./metro.config.js)
  needs no manual `watchFolders` — it just exposes the customization point.
- Shared logic (XP, streak, hearts, subscription) is imported from `@daily-ai-lab/core`,
  the exact same package the web app uses. Edit it once, both apps update.
- Type-check: `npm run type-check --workspace @daily-ai-lab/mobile`.

## Going to a production build later
You do **not** need to "eject". When you want store builds or custom native modules:
- Cloud builds: `npx eas build` (no local Android/iOS toolchain required), or
- Generate native `android/` + `ios/` folders (the RN-CLI layout): `npx expo prebuild`.
