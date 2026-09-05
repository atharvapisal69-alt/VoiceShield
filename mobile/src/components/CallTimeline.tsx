import { StyleSheet, Text, View } from "react-native";

import { formatDuration } from "@/components/shared";
import { Colors, Radius, Spacing, riskColor } from "@/constants/colors";
import type { CallRiskPoint } from "@/types/call";

/**
 * Timeline of how risk changed across a call.
 */
export function CallTimeline({ points }: { points: CallRiskPoint[] }) {
  if (points.length === 0) {
    return (
      <Text style={styles.empty}>No risk measurements recorded.</Text>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>RISK TIMELINE</Text>
      {points.map((point, index) => {
        const color = riskColor(point.level);
        return (
          <View key={`${point.time}-${index}`} style={styles.row}>
            <Text style={styles.time}>{formatDuration(point.time)}</Text>
            <Text style={styles.pip}>•</Text>
            <View
              style={[
                styles.levelPill,
                { backgroundColor: `${color}1A`, borderColor: `${color}4D` },
              ]}
            >
              <View style={[styles.levelDot, { backgroundColor: color }]} />
              <Text style={[styles.levelText, { color }]}>
                {point.level}
              </Text>
            </View>
            <Text style={[styles.score, { color }]}>{point.score}%</Text>
          </View>
        );
      })}
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
    gap: Spacing.xs,
  },
  empty: { color: Colors.textMuted, fontSize: 13, textAlign: "center" },
  eyebrow: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.6,
    marginBottom: Spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSoft,
  },
  time: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "700",
    width: 52,
    fontVariant: ["tabular-nums"],
  },
  pip: { color: Colors.textMuted, fontSize: 10 },
  levelPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  levelDot: { width: 6, height: 6, borderRadius: 3 },
  levelText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.4 },
  score: {
    marginLeft: "auto",
    fontSize: 14,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
});