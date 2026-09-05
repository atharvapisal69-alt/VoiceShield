import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/shared";
import { Colors, Radius, Spacing } from "@/constants/colors";

/**
 * Generic empty state used across History and other zero-data screens.
 */
export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  icon: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <Text style={styles.iconEmoji}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.button} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.lg,
  },
  icon: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: Colors.cardRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  iconEmoji: { fontSize: 28 },
  title: { color: Colors.text, fontSize: 18, fontWeight: "900" },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 6,
    maxWidth: 280,
  },
  button: { alignSelf: "stretch", marginTop: Spacing.lg },
});