import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Radius, Spacing } from "@/constants/colors";

const RECOMMENDATIONS = [
  "Verify the caller independently.",
  "Do not share OTPs.",
  "Do not share passwords.",
  "Do not provide banking information.",
  "Do not transfer money based only on the call.",
];

/**
 * In-call high-risk warning overlay. Uses probabilistic language only —
 * it never claims a person is definitely a scammer.
 */
export function CallWarning({
  visible,
  score,
  confidence,
  explanation,
  onReport,
  onDismiss,
}: {
  visible: boolean;
  score: number;
  confidence: number;
  explanation: string;
  onReport?: () => void;
  onDismiss: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.layer}>
        <View style={styles.card}>
          <View style={styles.warningIcon}>
            <Text style={styles.warningEmoji}>⚠️</Text>
          </View>

          <Text style={styles.eyebrow}>VOICESHIELD ALERT</Text>
          <Text style={styles.title}>Suspicious Voice Detected</Text>
          <Text style={[styles.scoreLine, { color: Colors.highRisk }]}>
            HIGH RISK — {score}%
          </Text>
          <Text style={styles.confidence}>
            Confidence: {confidence.toFixed(1)}%
          </Text>

          <Text style={styles.copy}>{explanation}</Text>

          <View style={styles.recommendations}>
            {RECOMMENDATIONS.map((item) => (
              <View key={item} style={styles.recRow}>
                <Text style={styles.recCheck}>✓</Text>
                <Text style={styles.recText}>{item}</Text>
              </View>
            ))}
          </View>

          {showDetails ? (
            <View style={styles.details}>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>Risk score</Text>
                <Text style={styles.detailsValue}>{score}%</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>Model confidence</Text>
                <Text style={styles.detailsValue}>{confidence.toFixed(1)}%</Text>
              </View>
              <Text style={styles.detailsNote}>
                Assessment is based on spectral analysis of the live call and
                updates in real time.
              </Text>
            </View>
          ) : null}

          <View style={styles.buttons}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowDetails((v) => !v)}
              style={({ pressed }) => [
                styles.buttonSecondary,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.buttonSecondaryText}>
                {showDetails ? "Hide Details" : "View Details"}
              </Text>
            </Pressable>
            {onReport ? (
              <Pressable
                accessibilityRole="button"
                onPress={onReport}
                style={({ pressed }) => [styles.buttonOutline, pressed && styles.pressed]}
              >
                <Text style={styles.buttonOutlineText}>Report Call</Text>
              </Pressable>
            ) : null}
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setShowDetails(false);
                onDismiss();
              }}
              style={({ pressed }) => [styles.buttonPrimary, pressed && styles.pressed]}
            >
              <Text style={styles.buttonPrimaryText}>Dismiss</Text>
            </Pressable>
          </View>

          <Text style={styles.disclaimer}>
            This is a probabilistic risk assessment, not proof that the caller
            is a scammer.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  layer: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.highRisk,
    padding: Spacing.lg,
    alignItems: "center",
  },
  warningIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${Colors.highRisk}1F`,
    borderWidth: 1,
    borderColor: Colors.highRisk,
    alignItems: "center",
    justifyContent: "center",
  },
  warningEmoji: { fontSize: 32 },
  eyebrow: {
    color: Colors.highRisk,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.8,
    marginTop: Spacing.md,
  },
  title: { color: Colors.text, fontSize: 23, fontWeight: "900", marginTop: 4 },
  scoreLine: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: Spacing.sm,
  },
  confidence: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  copy: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: Spacing.md,
  },
  recommendations: {
    alignSelf: "stretch",
    marginTop: Spacing.md,
    gap: 8,
  },
  recRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  recCheck: { color: Colors.highRisk, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  recText: { color: Colors.textMuted, fontSize: 13, lineHeight: 20, flex: 1 },
  details: { alignSelf: "stretch", marginTop: Spacing.md, gap: 6 },
  detailsRow: { flexDirection: "row", justifyContent: "space-between" },
  detailsLabel: { color: Colors.textMuted, fontSize: 12, fontWeight: "700" },
  detailsValue: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  detailsNote: {
    color: Colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  buttons: {
    alignSelf: "stretch",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  buttonPrimary: {
    backgroundColor: Colors.highRisk,
    borderRadius: Radius.md,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimaryText: { color: Colors.white, fontSize: 15, fontWeight: "900" },
  buttonSecondary: {
    backgroundColor: Colors.cardRaised,
    borderRadius: Radius.md,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSecondaryText: { color: Colors.text, fontSize: 14, fontWeight: "800" },
  buttonOutline: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonOutlineText: { color: Colors.text, fontSize: 14, fontWeight: "800" },
  pressed: { opacity: 0.8 },
  disclaimer: {
    color: Colors.textMuted,
    fontSize: 10,
    textAlign: "center",
    marginTop: Spacing.md,
    lineHeight: 15,
  },
});