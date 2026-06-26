# Expo HAS CHANGED

This app is pinned to **Expo SDK 54** (NOT the newest). Reason: the public Expo Go
app on the stores only supports up to SDK 54, while `create-expo-app@latest` defaults
to a newer pre-release SDK that Expo Go refuses to load. Do not bump the SDK unless
Expo Go's supported version moves up too. React is pinned to 19.1.0 (SDK 54), nested
under apps/mobile so it doesn't collide with the web app's React 19.2.

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.
