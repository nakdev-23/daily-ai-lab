import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, X } from 'lucide-react-native';
import { useAuth } from '../lib/auth';
import { Mascot } from '../components/mascot';
import { colors, fonts, font, radius, shadow, spacing } from '../lib/theme';

const WEB_UPGRADE_URL = 'https://ailab.learnnakdev.online/upgrade';

const COMPARE = [
  { label: 'บทเรียนต่อวัน', free: '3', pro: 'ไม่จำกัด' },
  { label: 'หัวใจ', free: '5', pro: '∞' },
  { label: 'คอร์ส Pro', free: '—', pro: true },
  { label: 'เส้นทางอาชีพ', free: '2', pro: 'ทั้งหมด' },
  { label: 'ผลงานเข้าพอร์ต', free: '—', pro: true },
];

export default function Upgrade() {
  const { profile } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isPro = profile?.plan === 'pro';

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* violet header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Pressable style={styles.close} onPress={() => router.back()}>
          <X size={18} color="#FFFFFF" strokeWidth={2.6} />
        </Pressable>
        <View style={styles.headRow}>
          <Mascot pose="fly" size={92} />
          <View style={styles.flex}>
            <Text style={styles.headTitle}>Daily AI Lab Pro</Text>
            <Text style={styles.headSub}>ปลดล็อกทุกอย่าง เรียนได้ไม่มีกั๊ก</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {isPro ? (
          <View style={styles.activeCard}>
            <Check size={20} color={colors.success} strokeWidth={3} />
            <Text style={styles.activeText}>คุณเป็นสมาชิก Pro อยู่แล้ว ขอบคุณที่สนับสนุน!</Text>
          </View>
        ) : (
          <>
            {/* plans */}
            <View style={styles.plans}>
              <View style={styles.plan}>
                <Text style={styles.planName}>รายเดือน</Text>
                <Text style={styles.planPrice}>฿199</Text>
                <Text style={styles.planUnit}>ต่อเดือน</Text>
              </View>
              <View style={[styles.plan, styles.planBest]}>
                <View style={styles.bestBadge}><Text style={styles.bestText}>ประหยัด 38%</Text></View>
                <Text style={[styles.planName, { color: colors.primaryInk }]}>รายปี</Text>
                <Text style={[styles.planPrice, { color: colors.primaryInk }]}>฿123</Text>
                <Text style={styles.planUnit}>ต่อเดือน</Text>
              </View>
            </View>

            {/* compare */}
            <View style={styles.compare}>
              <View style={styles.cmpHead}>
                <Text style={[styles.cmpHeadCell, styles.flex]}>ฟีเจอร์</Text>
                <Text style={[styles.cmpHeadCell, styles.cmpCol]}>Free</Text>
                <Text style={[styles.cmpHeadCell, styles.cmpCol, { color: colors.primary }]}>Pro</Text>
              </View>
              {COMPARE.map((f, i) => (
                <View key={f.label} style={[styles.cmpRow, i > 0 && styles.cmpDivider]}>
                  <Text style={[styles.cmpLabel, styles.flex]}>{f.label}</Text>
                  <Text style={[styles.cmpFree, styles.cmpCol]}>{f.free}</Text>
                  <View style={styles.cmpCol}>
                    {f.pro === true ? (
                      <Check size={16} color={colors.success} strokeWidth={3} />
                    ) : (
                      <Text style={styles.cmpPro}>{f.pro}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>

            <Pressable style={styles.cta} onPress={() => Linking.openURL(WEB_UPGRADE_URL)}>
              <Text style={styles.ctaText}>เริ่มใช้ Pro</Text>
            </Pressable>
            <Text style={styles.note}>ยกเลิกได้ทุกเมื่อ · ชำระเงินผ่านเว็บไซต์อย่างปลอดภัย</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  header: { backgroundColor: colors.primary, paddingHorizontal: 22, paddingBottom: 26, overflow: 'hidden' },
  close: { position: 'absolute', top: 0, right: 18, marginTop: spacing.lg, width: 34, height: 34, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center', zIndex: 3 },
  headRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 14 },
  headTitle: { fontFamily: fonts.display, fontSize: 26, color: '#FFFFFF', letterSpacing: -0.4 },
  headSub: { fontFamily: fonts.bodyMedium, fontSize: font.small, color: 'rgba(255,255,255,0.85)', marginTop: 4 },

  body: { padding: 18, paddingBottom: spacing.xxl },
  activeCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.mintTint, borderRadius: radius.lg, padding: spacing.lg },
  activeText: { flex: 1, color: colors.success, fontSize: font.body, fontFamily: fonts.bodyBold },

  plans: { flexDirection: 'row', gap: 11, marginBottom: 18 },
  plan: { flex: 1, backgroundColor: colors.card, borderWidth: 2, borderColor: colors.border, borderRadius: 18, padding: 15, alignItems: 'center' },
  planBest: { backgroundColor: colors.heroTint, borderColor: colors.primary },
  bestBadge: { position: 'absolute', top: -10, alignSelf: 'center', backgroundColor: colors.sun, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  bestText: { fontFamily: fonts.bodyBold, fontSize: 9.5, color: colors.primaryInk, letterSpacing: 0.4 },
  planName: { fontFamily: fonts.title, fontSize: font.small, color: colors.textMuted },
  planPrice: { fontFamily: fonts.display, fontSize: font.h2, color: colors.text, marginTop: 3 },
  planUnit: { fontFamily: fonts.bodyMedium, fontSize: font.tiny, color: colors.textMuted },

  compare: { backgroundColor: colors.card, borderRadius: radius.lg, overflow: 'hidden', ...shadow.soft },
  cmpHead: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingHorizontal: 14, backgroundColor: colors.bg },
  cmpHeadCell: { fontFamily: fonts.title, fontSize: font.tiny, color: colors.textMuted },
  cmpCol: { width: 60, textAlign: 'center', alignItems: 'center' },
  cmpRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14 },
  cmpDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  cmpLabel: { fontFamily: fonts.bodySemibold, fontSize: font.small, color: colors.body },
  cmpFree: { fontFamily: fonts.bodyMedium, fontSize: font.small, color: colors.textMuted, textAlign: 'center' },
  cmpPro: { fontFamily: fonts.bodyBold, fontSize: font.small, color: colors.primary, textAlign: 'center' },

  cta: { marginTop: 18, backgroundColor: colors.sun, borderRadius: 18, paddingVertical: 16, alignItems: 'center', shadowColor: '#C99A00', shadowOpacity: 1, shadowRadius: 0, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  ctaText: { fontFamily: fonts.display, fontSize: font.h3, color: colors.primaryInk },
  note: { fontFamily: fonts.bodyMedium, fontSize: font.tiny, color: colors.textMuted, textAlign: 'center', marginTop: 10, lineHeight: 18 },
});
