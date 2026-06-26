import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, fonts, font, radius, shadow, spacing } from '../lib/theme';

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

type ButtonVariant = 'primary' | 'sun' | 'ghost' | 'danger';
const KEY = 5; // tactile 3D-key offset

const FACE: Record<ButtonVariant, { face: string; key: string; text: string; border?: string }> = {
  primary: { face: colors.primary, key: colors.primaryInk, text: '#FFFFFF' },
  sun: { face: colors.sun, key: colors.sunDeep, text: colors.primaryInk },
  ghost: { face: '#FFFFFF', key: '#D8D0EE', text: colors.primaryDark, border: colors.border },
  danger: { face: colors.danger, key: '#C2433C', text: '#FFFFFF' },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const [pressed, setPressed] = useState(false);
  const v = FACE[variant];
  const down = pressed || disabled;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled || loading}
      style={[{ borderRadius: radius.pill, backgroundColor: v.key }, disabled && { opacity: 0.5 }, style]}
    >
      <View
        style={[
          styles.btnFace,
          {
            backgroundColor: v.face,
            marginBottom: down ? 0 : KEY,
            transform: [{ translateY: down ? KEY : 0 }],
            borderWidth: v.border ? 1 : 0,
            borderColor: v.border,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={v.text} />
        ) : (
          <Text style={[styles.btnText, { color: v.text }]}>{label}</Text>
        )}
      </View>
    </Pressable>
  );
}

export function ProgressBar({ pct, color = colors.primary }: { pct: number; color?: string }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, pct))}%`, backgroundColor: color }]} />
    </View>
  );
}

export function Pill({ text, color = colors.primary, tint }: { text: string; color?: string; tint?: string }) {
  return (
    <View style={[styles.pill, tint ? { backgroundColor: tint } : { borderWidth: 1, borderColor: colors.border }]}>
      <Text style={[styles.pillText, { color }]}>{text}</Text>
    </View>
  );
}

export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const initial = (name?.trim()?.[0] ?? '?').toUpperCase();
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size * 0.32 }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.44 }]}>{initial}</Text>
    </View>
  );
}

export function Loading({ label }: { label?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} size="large" />
      {label ? <Text style={styles.loadingText}>{label}</Text> : null}
    </View>
  );
}

export function Stat({ icon, value, label, color }: { icon: React.ReactNode; value: string | number; label: string; color: string }) {
  return (
    <View style={styles.stat}>
      <View style={styles.statIcon}>{icon}</View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  btnFace: {
    minHeight: 50,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    flexDirection: 'row',
  },
  btnText: { fontFamily: fonts.title, fontSize: font.body + 1 },
  track: { height: 12, backgroundColor: '#E9E3F7', borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
  pill: { backgroundColor: '#FFFFFF', borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start' },
  pillText: { fontFamily: fonts.bodyBold, fontSize: font.tiny },
  avatar: { backgroundColor: colors.sun, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.primaryInk, fontFamily: fonts.display },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl, backgroundColor: colors.bg },
  loadingText: { color: colors.textMuted, fontSize: font.small, fontFamily: fonts.bodyMedium },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statIcon: { marginBottom: 2 },
  statValue: { fontSize: font.h2, fontFamily: fonts.display },
  statLabel: { fontSize: font.tiny, color: colors.textMuted, fontFamily: fonts.bodyMedium },
});
