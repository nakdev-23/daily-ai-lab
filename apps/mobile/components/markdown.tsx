import { Linking } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { colors, fonts, font, radius, spacing } from '../lib/theme';

// Brand-themed style map for react-native-markdown-display (light, Anuphan body
// + Baloo 2 headings, dark code blocks).
const mdStyles = {
  body: { color: colors.body, fontSize: font.body + 1, fontFamily: fonts.bodyRegular, lineHeight: 26 },
  heading1: { color: colors.text, fontSize: font.h2, fontFamily: fonts.display, marginTop: spacing.lg, marginBottom: spacing.sm },
  heading2: { color: colors.text, fontSize: font.h3, fontFamily: fonts.display, marginTop: spacing.lg, marginBottom: spacing.xs },
  heading3: { color: colors.text, fontSize: font.body + 1, fontFamily: fonts.title, marginTop: spacing.md, marginBottom: spacing.xs },
  paragraph: { marginTop: 0, marginBottom: spacing.md },
  strong: { color: colors.text, fontFamily: fonts.bodyBold },
  em: { fontStyle: 'italic' as const },
  link: { color: colors.primary, fontFamily: fonts.bodyBold, textDecorationLine: 'underline' as const },
  bullet_list: { marginBottom: spacing.md },
  ordered_list: { marginBottom: spacing.md },
  list_item: { color: colors.body, marginBottom: spacing.xs },
  blockquote: {
    backgroundColor: colors.heroTint,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  code_inline: {
    backgroundColor: colors.heroTint,
    color: colors.primaryInk,
    borderRadius: 6,
    paddingHorizontal: 5,
    fontFamily: 'monospace',
  },
  code_block: {
    backgroundColor: colors.text,
    color: '#E9E3FB',
    borderRadius: radius.md,
    padding: spacing.lg,
    fontFamily: 'monospace',
    marginBottom: spacing.md,
  },
  fence: {
    backgroundColor: colors.text,
    color: '#E9E3FB',
    borderRadius: radius.md,
    padding: spacing.lg,
    fontFamily: 'monospace',
    marginBottom: spacing.md,
  },
  hr: { backgroundColor: colors.border, height: 1, marginVertical: spacing.lg },
  table: { borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, marginBottom: spacing.md, overflow: 'hidden' as const },
  th: { color: colors.text, fontFamily: fonts.bodyBold, padding: spacing.sm },
  td: { color: colors.body, fontFamily: fonts.bodyRegular, padding: spacing.sm, borderColor: colors.border },
  tr: { borderColor: colors.border },
};

export function MarkdownView({ children }: { children: string }) {
  return (
    <Markdown
      style={mdStyles}
      onLinkPress={(url) => {
        Linking.openURL(url);
        return false;
      }}
    >
      {children}
    </Markdown>
  );
}
