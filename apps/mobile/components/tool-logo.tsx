import { Image, StyleSheet, Text, View } from 'react-native';
import { toolLogo } from '../lib/tool-logos';
import { colors, fonts, radius } from '../lib/theme';

/** A tool's real AI brand logo on a soft tile; falls back to its initial. */
export function ToolLogo({ tool, size = 46 }: { tool?: string | null; size?: number }) {
  const logo = toolLogo(tool ?? undefined);
  return (
    <View style={[styles.tile, { width: size, height: size, borderRadius: size * 0.3 }]}>
      {logo ? (
        <Image source={logo} style={{ width: size * 0.64, height: size * 0.64, resizeMode: 'contain' }} />
      ) : (
        <Text style={[styles.initial, { fontSize: size * 0.42 }]}>
          {(tool?.trim()?.[0] ?? '?').toUpperCase()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  initial: { color: colors.primary, fontFamily: fonts.display },
});
