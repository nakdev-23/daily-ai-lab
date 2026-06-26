import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Compass } from 'lucide-react-native';
import { getCareerPaths, type CareerPath } from '../../lib/data';
import { Loading, Pill } from '../../components/ui';
import { colors, fonts, font, radius, shadow, spacing } from '../../lib/theme';

export default function Paths() {
  const router = useRouter();
  const [paths, setPaths] = useState<CareerPath[] | null>(null);

  const load = useCallback(async () => {
    const all = await getCareerPaths();
    setPaths(all.filter((p) => p.is_published !== false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (!paths) return <Loading label="กำลังโหลดเส้นทาง..." />;

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={paths}
      keyExtractor={(p) => p.id}
      ListHeaderComponent={
        <View>
          <View style={styles.head}>
            <Compass size={24} color={colors.primary} />
            <Text style={styles.title}>เส้นทางอาชีพ</Text>
          </View>
          <Text style={styles.sub}>เรียนเป็นชุดตามเป้าหมายอาชีพ</Text>
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>ยังไม่มีเส้นทางที่เผยแพร่</Text>}
      renderItem={({ item }) => (
        <Pressable style={styles.card} onPress={() => router.push(`/paths/${item.slug}`)}>
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.is_pro ? <Pill text="PRO" color={colors.warn} /> : null}
          </View>
          {item.tag ? <Text style={styles.tag}>{item.tag}</Text> : null}
          <Text style={styles.cardDesc} numberOfLines={3}>
            {item.description}
          </Text>
          <View style={styles.metaRow}>
            {item.weeks ? <Pill text={`${item.weeks} สัปดาห์`} color={colors.accent} /> : null}
            {(item.tools ?? []).slice(0, 3).map((tool) => (
              <Text key={tool} style={styles.toolTag}>
                {tool}
              </Text>
            ))}
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, gap: spacing.md },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { color: colors.text, fontSize: font.h2, fontFamily: fonts.display },
  sub: { color: colors.textMuted, fontSize: font.small, fontFamily: fonts.bodyMedium, marginBottom: spacing.xs },
  empty: { color: colors.textMuted, fontFamily: fonts.bodyMedium, textAlign: 'center', marginTop: spacing.xl },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
    ...shadow.card,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  cardTitle: { color: colors.text, fontSize: font.h3, fontFamily: fonts.title, flex: 1 },
  tag: { color: colors.primary, fontSize: font.tiny, fontFamily: fonts.bodyBold },
  cardDesc: { color: colors.body, fontSize: font.small, fontFamily: fonts.bodyRegular, lineHeight: 20, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs, flexWrap: 'wrap' },
  toolTag: { color: colors.textFaint, fontSize: font.tiny, fontFamily: fonts.bodyMedium },
});
