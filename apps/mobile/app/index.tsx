import { Redirect } from 'expo-router';

// The root layout's navigator handles auth redirects; this just points "/" at
// the app's home so a cold launch lands somewhere deterministic.
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
