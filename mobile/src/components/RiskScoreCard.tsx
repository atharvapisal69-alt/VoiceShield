import { StyleSheet, Text, View } from "react-native";

import { RiskBadge } from "@/components/shared";
import { Colors, Radius, Spacing, riskColor } from "@/constants/colors";
import type { RiskLevel } from "@/types/analysis";

/**
 * Dense metric card for a voice or call analysis:
 * risk badge, confidence, AI-voice probability, genuine-voice probability.
 */
export function RiskScoreCard({
  label,
  riskScore,
  confidence,
  fakeProbability,
  realProbability,
  explanation,
}: {
  label: RiskLevel;
  riskScore: number;
  confidence: number;
  fakeProbability: number;
  realProbability: number;
  explanation?: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>ANALYSIS METRICS</Text>
          <RiskBadge level={label} />
        </View>
        <Text style={[styles.bigScore, { color: riskColor(label) }]}>
          {riskScore.toFixed(1)}%
        </Text>
      </View>

      <Metric
        label="Confidence"
        value={confidence}
        accent={Colors.accent}
      />
      <Metric
        label="AI Voice Probability"
        value={fakeProbability}
        accent={Colors.highRisk}
      />
      <Metric
        label="Genuine Voice Probability"
        value={realProbability}
        accent={Colors.success}
      />

      {explanation ? (
        <View style={styles.explanation}>
          <Text style={styles.explanationLabel}>WHY THIS RESULT</Text>
          <Text style={styles.explanationText}>{explanation}</Text>
        </View>
      ) : null}
    </View>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View style={styles.metric}>
      <View style={styles.metricTop}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{clamped.toFixed(1)}%</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${clamped}%`, backgroundColor: accent },
          ]}
        />
      </View>
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
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  eyebrow: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.6,
    marginBottom: 8,
  },
  bigScore: { fontSize: 34, fontWeight: "900", fontVariant: ["tabular-nums"] },
  metric: { gap: 6 },
  metricTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metricLabel: { color: Colors.textMuted, fontSize: 13, fontWeight: "600" },
  metricValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 3 },
  explanation: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  explanationLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  explanationText: { color: Colors.text, fontSize: 14, lineHeight: 21 },
});