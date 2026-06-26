import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Clock, Lock } from 'lucide-react-native';
import { useAuth } from '../../lib/auth';
import { getDocsForTool, isDocLocked, LEVELS, type Doc } from '../../lib/docs';
import { MarkdownView } from '../../components/markdown';
import { Button, Pill } from '../../components/ui';
import { colors, fonts, font, radius, shadow, spacing } from '../../lib/theme';

export default function ToolDocs() {
  const { tool } = useLocalSearchParams<{ tool: string }>();
  const { profile } = useAuth();
  const router = useRouter();
  const { tool: toolName, docs } = getDocsForTool(tool ?? '');
  const [open, setOpen] = useState<string | null>(docs[0]?.slug ?? null);
  const isPro = profile?.plan === 'pro';

  return (
    <>
      <Stack.Screen options={{ title: toolName }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{toolName}</Text>
        <Text style={styles.sub}>{docs.length} บทความ</Text>
        {docs.map((doc: Doc) => {
          const expanded = open === doc.slug;
          const locked = isDocLocked(doc, isPro);
          const lv = LEVELS[doc.level];
          return (
            <View key={doc.slug} style={styles.card}>
              <Pressable
                style={styles.cardHead}
                onPress={() => setOpen(expanded ? null : doc.slug)}
              >
                <View style={styles.flex}>
                  <Text style={styles.docTitle}>{doc.title}</Text>
                  {doc.summary ? (
                    <Text style={styles.docSummary} numberOfLines={2}>
                      {doc.summary}
                    </Text>
                  ) : null}
                  <View style={styles.metaRow}>
                    <Pill text={lv.tag} color={lv.free ? colors.success : colors.primaryInk} tint={lv.free ? colors.mintTint : colors.sunTint} />
                    <View style={styles.readTimeRow}>
                      <Clock size={11} color={colors.textFaint} />
                      <Text style={styles.readTime}>{doc.readTime}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.chevron}>{expanded ? '⌄' : '›'}</Text>
              </Pressable>

              {expanded ? (
                locked ? (
                  <View style={styles.lockBox}>
                    <View style={styles.lockRow}>
                      <Lock size={15} color={colors.primaryInk} />
                      <Text style={styles.lockText}>บทความนี้สำหรับสมาชิก Pro</Text>
                    </View>
                    <Button label="อัปเกรดเป็น Pro" onPress={() => router.push('/upgrade')} />
                  </View>
                ) : (
                  <View style={styles.body}>
                    <MarkdownView>{doc.body}</MarkdownView>
                  </View>
                )
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, gap: spacing.md },
  title: { color: colors.text, fontSize: font.h2, fontFamily: fonts.display },
  sub: { color: colors.textMuted, fontSize: font.small, fontFamily: fonts.bodyMedium, marginTop: -spacing.xs },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, overflow: 'hidden', ...shadow.card },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  flex: { flex: 1, gap: 4 },
  docTitle: { color: colors.text, fontSize: font.body, fontFamily: fonts.title },
  docSummary: { color: colors.textMuted, fontSize: font.small, fontFamily: fonts.bodyRegular, lineHeight: 19 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 2 },
  readTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  readTime: { color: colors.textFaint, fontSize: font.tiny, fontFamily: fonts.bodyMedium },
  lockRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chevron: { color: colors.textFaint, fontSize: 22 },
  lockBox: { padding: spacing.lg, paddingTop: 0, gap: spacing.md },
  lockText: { color: colors.primaryInk, fontSize: font.small, fontFamily: fonts.bodySemibold },
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
});
