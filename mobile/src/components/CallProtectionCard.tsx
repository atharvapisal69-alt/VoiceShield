import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Radius, Spacing } from "@/constants/colors";

/**
 * Call protection status card: shows whether VoiceShield protection is ready,
 * enabled, or currently monitoring an active call.
 */
export function CallProtectionCard({
  enabled,
  active = false,
  onToggle,
  onStartDemo,
  demoMode = false,
  manage,
}: {
  enabled: boolean;
  active?: boolean;
  onToggle: () => void;
  onStartDemo?: () => void;
  demoMode?: boolean;
  /** When set, renders a management CTA (e.g. "Configure") instead of the toggle. */
  manage?: { label: string; onPress: () => void };
}) {
  const statusLabel = active
    ? "Monitoring active call"
    : enabled
      ? "Protection Ready"
      : "Not enabled";
  const statusColor = active
    ? Colors.accent
    : enabled
      ? Colors.success
      : Colors.textMuted;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.icon}>
          <Text style={styles.iconEmoji}>📞</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Call Protection</Text>
          <View style={styles.statusRow}>
            <View style={[styles.dot, { backgroundColor: statusColor }]} />
            <Text style={[styles.status, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
        </View>
      </View>

      {manage ? (
        <Pressable
          accessibilityRole="button"
          onPress={manage.onPress}
          style={({ pressed }) => [
            styles.toggle,
            { borderColor: Colors.border, backgroundColor: Colors.cardRaised },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.toggleLabel, { color: Colors.text }]}>
            {manage.label}
          </Text>
        </Pressable>
      ) : demoMode && onStartDemo ? (
          <Pressable
            accessibilityRole="button"
            onPress={onStartDemo}
            style={({ pressed }) => [
              styles.demoButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.demoIcon}>🎬</Text>
            <Text style={styles.demoLabel}>Start Demo Call</Text>
          </Pressable>
      ) : (
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.toggle,
            {
              borderColor: enabled ? Colors.border : Colors.primary,
              backgroundColor: enabled ? "transparent" : Colors.primary,
            },
            pressed && styles.pressed,
          ]}
          onPress={onToggle}
        >
          <Text
            style={[
              styles.toggleLabel,
              { color: enabled ? Colors.textMuted : Colors.white },
            ]}
          >
            {enabled ? "Disable Protection" : "Enable Call Protection"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  topRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.cardRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: { fontSize: 20 },
  title: { color: Colors.text, fontSize: 16, fontWeight: "900" },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  status: { fontSize: 12, fontWeight: "700" },
  toggle: {
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
  },
  toggleLabel: { fontSize: 14, fontWeight: "800" },
  demoButton: {
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    flexDirection: "row",
    gap: 8,
  },
  demoIcon: { fontSize: 16 },
  demoLabel: { color: Colors.white, fontSize: 15, fontWeight: "900" },
  pressed: { opacity: 0.8 },
});