import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../lib/auth';
import { Button } from './ui';
import { Mascot } from './mascot';
import { colors, fonts, font, radius, shadow, spacing } from '../lib/theme';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const insets = useSafeAreaInsets();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const isRegister = mode === 'register';

  async function google() {
    setError(null);
    setInfo(null);
    setGoogleBusy(true);
    const res = await signInWithGoogle();
    setGoogleBusy(false);
    if (res.error) setError(res.error);
  }

  async function submit() {
    setError(null);
    setInfo(null);
    if (!email.trim() || !password) {
      setError('กรอกอีเมลและรหัสผ่านให้ครบ');
      return;
    }
    if (isRegister && !displayName.trim()) {
      setError('กรอกชื่อที่ใช้แสดง');
      return;
    }
    setBusy(true);
    const res = isRegister
      ? await signUp(email.trim(), password, displayName.trim())
      : await signIn(email.trim(), password);
    setBusy(false);
    if (res.error) setError(res.error);
    else if (isRegister) setInfo('สมัครสำเร็จ! ตรวจอีเมลเพื่อยืนยัน แล้วเข้าสู่ระบบได้เลย');
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* violet hero */}
        <View style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}>
          <View style={styles.heroCircle} />
          <View style={styles.heroCircle2} />
          <Mascot pose="wave" size={120} style={styles.heroMascot} />
          <Text style={styles.brand}>Daily AI Lab</Text>
          <Text style={styles.tagline}>เรียน AI วันละนิด เก่งขึ้นทุกวัน</Text>
        </View>

        {/* form sheet */}
        <View style={styles.sheet}>
          <Text style={styles.heading}>{isRegister ? 'สร้างบัญชีใหม่' : 'ยินดีต้อนรับกลับ'}</Text>
          <Text style={styles.subheading}>{isRegister ? 'เริ่มเรียน AI วันละ 15 นาที' : 'เข้าสู่ระบบเพื่อเรียนต่อ'}</Text>

          {isRegister && (
            <Field label="ชื่อที่ใช้แสดง" value={displayName} onChangeText={setDisplayName} placeholder="เช่น น้องเอไอ" autoCapitalize="words" />
          )}
          <Field label="อีเมล" value={email} onChangeText={setEmail} placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" />
          <Field label="รหัสผ่าน" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry autoCapitalize="none" />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {info ? <Text style={styles.info}>{info}</Text> : null}

          <View style={styles.btnWrap}>
            <Button label={isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'} onPress={submit} loading={busy} />
          </View>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>หรือ</Text>
            <View style={styles.line} />
          </View>

          <Pressable style={({ pressed }) => [styles.googleBtn, pressed && { opacity: 0.85 }]} onPress={google} disabled={googleBusy || busy}>
            {googleBusy ? (
              <ActivityIndicator color={colors.body} />
            ) : (
              <>
                <Text style={styles.googleG}>G</Text>
                <Text style={styles.googleText}>{isRegister ? 'สมัครด้วย Google' : 'เข้าสู่ระบบด้วย Google'}</Text>
              </>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{isRegister ? 'มีบัญชีอยู่แล้ว?' : 'ยังไม่มีบัญชี?'} </Text>
            <Link href={isRegister ? '/(auth)/login' : '/(auth)/register'} style={styles.link}>
              {isRegister ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field(props: React.ComponentProps<typeof TextInput> & { label: string }) {
  const { label, ...input } = props;
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput {...input} placeholderTextColor={colors.textFaint} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.primary },
  scroll: { flexGrow: 1, backgroundColor: colors.bg },

  hero: { backgroundColor: colors.primary, alignItems: 'center', paddingBottom: spacing.xxl + spacing.lg, overflow: 'hidden' },
  heroCircle: { position: 'absolute', right: -30, top: 20, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.07)' },
  heroCircle2: { position: 'absolute', left: -24, top: 90, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,212,58,0.12)' },
  heroMascot: { zIndex: 1 },
  brand: { fontFamily: fonts.display, fontSize: font.h1, color: '#FFFFFF', marginTop: spacing.sm },
  tagline: { fontFamily: fonts.bodyMedium, fontSize: font.small, color: 'rgba(255,255,255,0.85)', marginTop: 4 },

  sheet: { flex: 1, backgroundColor: colors.bg, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -spacing.xl, padding: spacing.xl, paddingTop: spacing.xl, gap: spacing.md },
  heading: { fontFamily: fonts.display, fontSize: font.h2, color: colors.text },
  subheading: { fontFamily: fonts.bodyMedium, fontSize: font.small, color: colors.textMuted, marginTop: -spacing.sm },

  field: { gap: 6 },
  fieldLabel: { color: colors.body, fontSize: font.small, fontFamily: fonts.bodySemibold },
  input: { backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, color: colors.text, fontSize: font.body, fontFamily: fonts.bodyMedium, ...shadow.soft },
  error: { color: colors.danger, fontSize: font.small, fontFamily: fonts.bodyMedium },
  info: { color: colors.success, fontSize: font.small, fontFamily: fonts.bodyMedium },
  btnWrap: { marginTop: spacing.sm },

  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: spacing.xs },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textFaint, fontSize: font.small, fontFamily: fonts.bodyMedium },
  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, minHeight: 52, backgroundColor: colors.card, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.border },
  googleG: { color: '#ea4335', fontSize: font.h3, fontFamily: fonts.display },
  googleText: { color: colors.body, fontSize: font.body, fontFamily: fonts.title },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md, paddingBottom: spacing.lg },
  footerText: { color: colors.textMuted, fontSize: font.small, fontFamily: fonts.bodyMedium },
  link: { color: colors.primary, fontSize: font.small, fontFamily: fonts.bodyBold },
});
