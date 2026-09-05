import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/shared";
import { Colors, Radius, Spacing } from "@/constants/colors";

/**
 * Record-audio entry card shown before the user starts a session.
 */
export function RecordingCard({
  onStart,
  disabled = false,
}: {
  onStart: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <Text style={styles.iconEmoji}>🎙️</Text>
      </View>
      <Text style={styles.title}>Record a Voice</Text>
      <Text style={styles.copy}>
        Record a voice sample and check it for suspicious characteristics.
      </Text>
      <Button
        label="Start Recording"
        icon="🔴"
        variant="danger"
        onPress={onStart}
        disabled={disabled}
        style={styles.button}
      />
      <Text style={styles.hint}>Recording only starts when you tap the button.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.lg,
  },
  icon: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: Colors.cardRaised,
    borderWidth: 1,
    borderColor: Colors.highRisk,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  iconEmoji: { fontSize: 34 },
  title: { color: Colors.text, fontSize: 21, fontWeight: "900" },
  copy: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 280,
  },
  button: { alignSelf: "stretch", marginTop: Spacing.lg },
  hint: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: Spacing.md,
    textAlign: "center",
  },
});