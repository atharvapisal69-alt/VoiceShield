import { StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/Icon";
import { RiskBadge, formatDateTime, formatDuration } from "@/components/shared";
import { Colors, Radius, Spacing, riskColor } from "@/constants/colors";
import type { CallReport } from "@/types/call";

/**
 * Summary header for a completed call security report.
 */
export function CallReportCard({ report }: { report: CallReport }) {
  const color = riskColor(report.riskScore);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.icon}>
          <Icon name="phone" size={20} color={Colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>VOICESHIELD CALL REPORT</Text>
          <Text style={styles.title}>Call Security Summary</Text>
        </View>
        <RiskBadge level={riskLevel(report.riskScore)} />
      </View>

      <View style={styles.metaRow}>
        <Meta label="Date & time" value={formatDateTime(report.createdAt)} />
        <Meta label="Call duration" value={formatDuration(report.duration)} />
      </View>

      <View style={[styles.scoreBlock, { borderColor: `${color}55` }]}>
        <Text style={[styles.score, { color }]}>{report.riskScore}%</Text>
        <Text style={[styles.scoreLabel, { color }]}>OVERALL RISK</Text>
      </View>
    </View>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function riskLevel(score: number): "LOW RISK" | "MEDIUM RISK" | "HIGH RISK" {
  if (score >= 80) return "HIGH RISK";
  if (score >= 50) return "MEDIUM RISK";
  return "LOW RISK";
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
  topRow: { flexDirection: "row", alignItems: "center", gap: 12 },
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
  eyebrow: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  title: { color: Colors.text, fontSize: 16, fontWeight: "900", marginTop: 3 },
  metaRow: { flexDirection: "row", gap: Spacing.md, marginTop: Spacing.xs },
  metaLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: "700" },
  metaValue: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 3,
  },
  scoreBlock: {
    borderWidth: 1,
    borderRadius: Radius.md,
    alignItems: "center",
    paddingVertical: Spacing.md,
    marginTop: Spacing.xs,
  },
  score: { fontSize: 34, fontWeight: "900", fontVariant: ["tabular-nums"] },
  scoreLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
    marginTop: 2,
  },
});
