import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { getToolGroups } from '../../lib/docs';
import { ToolLogo } from '../../components/tool-logo';
import { colors, fonts, font, radius, shadow, spacing } from '../../lib/theme';

export default function DocsHub() {
  const router = useRouter();
  const groups = getToolGroups();

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={groups}
      keyExtractor={(g) => g.toolSlug}
      numColumns={2}
      columnWrapperStyle={styles.col}
      ListHeaderComponent={
        <View style={styles.headerWrap}>
          <Text style={styles.title}>คลังความรู้</Text>
          <Text style={styles.sub}>คู่มือเครื่องมือ AI ทุกตัว</Text>
        </View>
      }
      renderItem={({ item }) => {
        const free = item.levels.includes('beginner');
        return (
          <Pressable style={styles.card} onPress={() => router.push(`/docs/${item.toolSlug}`)}>
            <ToolLogo tool={item.tool} size={44} />
            <Text style={styles.toolName} numberOfLines={1}>{item.tool}</Text>
            <Text style={styles.count}>{item.count} บทความ</Text>
            {free ? (
              <View style={styles.freeBadge}><Text style={styles.freeText}>ฟรี</Text></View>
            ) : (
              <View style={styles.lockBadge}><Lock size={12} color={colors.textFaint} /></View>
            )}
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, gap: spacing.md },
  col: { gap: spacing.md },
  headerWrap: { marginBottom: spacing.xs },
  title: { color: colors.text, fontSize: font.h1, fontFamily: fonts.display },
  sub: { color: colors.textMuted, fontSize: font.small, fontFamily: fonts.bodyMedium, marginTop: 2 },
  card: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: 4,
    ...shadow.card,
  },
  toolName: { color: colors.text, fontSize: font.body, fontFamily: fonts.title, marginTop: 11 },
  count: { color: colors.textMuted, fontSize: font.tiny, fontFamily: fonts.bodyMedium },
  freeBadge: { position: 'absolute', top: 13, right: 13, backgroundColor: colors.mintTint, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3 },
  freeText: { color: colors.success, fontSize: 9.5, fontFamily: fonts.bodyBold, letterSpacing: 0.4 },
  lockBadge: { position: 'absolute', top: 13, right: 13 },
});
