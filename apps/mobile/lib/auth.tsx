import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type Role = 'user' | 'admin';
export type Plan = 'free' | 'pro';

export type Profile = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  avatarKey: string | null;
  role: Role;
  plan: Plan;
};

type AuthState = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

/** Mirrors the web app's getProfile(): profiles + subscriptions → resolved plan. */
async function loadProfile(userId: string): Promise<Profile | null> {
  const [{ data: p }, { data: sub }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('subscriptions').select('plan, expires_at').eq('user_id', userId).maybeSingle(),
  ]);

  const active =
    sub?.plan === 'pro' &&
    (!sub.expires_at || new Date(sub.expires_at as string).getTime() > Date.now());
  const role: Role = (p?.role as Role) ?? 'user';
  const plan: Plan = active || role === 'admin' ? 'pro' : 'free';

  return {
    id: userId,
    displayName: (p?.display_name as string) ?? 'นักเรียน',
    avatarUrl: (p?.avatar_url as string) ?? null,
    avatarKey: (p?.avatar_key as string) ?? null,
    role,
    plan,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function hydrate(s: Session | null) {
    setSession(s);
    if (s?.user) {
      try {
        setProfile(await loadProfile(s.user.id));
      } catch {
        setProfile(null);
      }
    } else {
      setProfile(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => hydrate(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      hydrate(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value: AuthState = {
    session,
    profile,
    loading,
    async signIn(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error ? { error: error.message } : {};
    },
    async signUp(email, password, displayName) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      return error ? { error: error.message } : {};
    },
    async signInWithGoogle() {
      // Deep link Supabase redirects back to. In Expo Go this is an exp:// URL;
      // in a standalone build it's dailyailab:// (the app.json scheme).
      // Use the app's custom scheme (dailyailab://) — Supabase honors it. NOTE:
      // in Expo Go the scheme is exp://, which Supabase refuses to redirect to
      // (it silently falls back to the Site URL), so Google sign-in only works
      // in a dev/standalone build. Email/password works everywhere.
      const redirectTo = Linking.createURL('auth-callback');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error) return { error: error.message };
      if (!data?.url) return { error: 'ไม่สามารถเริ่มการเข้าสู่ระบบ Google ได้' };

      // Open Google's consent screen in an in-app browser, then catch the
      // redirect back to our deep link and exchange the code for a session.
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type !== 'success') return { error: 'ยกเลิกการเข้าสู่ระบบ' };

      const code = Linking.parse(result.url).queryParams?.code;
      if (typeof code !== 'string') return { error: 'ไม่พบรหัสยืนยันจาก Google' };

      const { error: exErr } = await supabase.auth.exchangeCodeForSession(code);
      return exErr ? { error: exErr.message } : {};
    },
    async signOut() {
      await supabase.auth.signOut();
    },
    async refreshProfile() {
      if (session?.user) setProfile(await loadProfile(session.user.id));
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
