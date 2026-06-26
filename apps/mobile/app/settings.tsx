import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../lib/auth';
import { Button, Card, Pill } from '../components/ui';
import { colors, fonts, font, spacing } from '../lib/theme';

const WEB_URL = 'https://daily-ai-lab.vercel.app';

export default function Settings() {
  const { profile, session, signOut } = useAuth();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.section}>บัญชี</Text>
      <Card style={styles.card}>
        <Row label="อีเมล" value={session?.user?.email ?? '-'} />
        <Row label="ชื่อที่ใช้แสดง" value={profile?.displayName ?? '-'} />
        <View style={styles.row}>
          <Text style={styles.label}>แพ็กเกจ</Text>
          <Pill
            text={profile?.plan === 'pro' ? 'Pro' : 'Free'}
            color={profile?.plan === 'pro' ? colors.warn : colors.textMuted}
          />
        </View>
      </Card>

      <Text style={styles.section}>เกี่ยวกับ</Text>
      <Card style={styles.card}>
        <LinkRow label="เปิดเว็บไซต์" onPress={() => Linking.openURL(WEB_URL)} />
        <LinkRow label="นโยบายความเป็นส่วนตัว" onPress={() => Linking.openURL(`${WEB_URL}/privacy`)} />
        <LinkRow label="ข้อกำหนดการใช้งาน" onPress={() => Linking.openURL(`${WEB_URL}/terms`)} />
      </Card>

      <View style={styles.signOut}>
        <Button label="ออกจากระบบ" variant="danger" onPress={signOut} />
      </View>
      <Text style={styles.version}>Daily AI Lab Mobile · v1.0.0</Text>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function LinkRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <View style={styles.row}>
      <Text style={styles.linkLabel} onPress={onPress}>
        {label}
      </Text>
      <Text style={styles.chevron}>›</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, gap: spacing.sm },
  section: { color: colors.textMuted, fontSize: font.small, fontFamily: fonts.bodyBold, letterSpacing: 0.4, marginTop: spacing.md, textTransform: 'uppercase' },
  card: { gap: 0, paddingVertical: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md },
  label: { color: colors.textMuted, fontSize: font.body, fontFamily: fonts.bodyMedium },
  value: { color: colors.text, fontSize: font.body, fontFamily: fonts.bodySemibold, flexShrink: 1, marginLeft: spacing.md },
  linkLabel: { color: colors.primary, fontSize: font.body, fontFamily: fonts.bodySemibold, flex: 1 },
  chevron: { color: colors.textFaint, fontSize: 22 },
  signOut: { marginTop: spacing.lg },
  version: { color: colors.textFaint, fontSize: font.tiny, fontFamily: fonts.bodyMedium, textAlign: 'center', marginTop: spacing.sm },
});
