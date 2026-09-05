import { Pressable, StyleSheet, Text, View } from "react-native";

import { RiskBadge, formatDateTime, formatDuration } from "@/components/shared";
import { Colors, Radius, Spacing, riskColor } from "@/constants/colors";
import type { HistoryItem as HistoryEntry } from "@/types/call";

/**
 * One row in the history list. Handles both voice analyses and call reports.
 */
export function HistoryItem({
  item,
  onPress,
  onDelete,
}: {
  item: HistoryEntry;
  onPress: () => void;
  onDelete?: () => void;
}) {
  const isCall = item.kind === "call";
  const icon = isCall ? "📞" : item.source === "recording" ? "🎙️" : "🎵";
  const title = isCall ? "VoiceShield Call Report" : item.fileName;
  const score = isCall ? item.riskScore : item.riskScore;
  const badgeLevel =
    item.kind === "analysis"
      ? item.label
      : riskLevelFromScore(item.riskScore);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.icon, { borderColor: riskColor(score) }]}>
        <Text style={styles.iconEmoji}>{icon}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {formatDateTime(item.createdAt)}
          {item.duration ? `  ·  ${formatDuration(item.duration)}` : ""}
        </Text>
      </View>

      <View style={styles.right}>
        <RiskBadge level={badgeLevel} score={score} />
      </View>

      {onDelete ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete item"
          onPress={onDelete}
          hitSlop={12}
          style={({ pressed }) => [styles.delete, pressed && { opacity: 0.5 }]}
        >
          <Text style={styles.deleteText}>🗑</Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

function riskLevelFromScore(score: number): "LOW RISK" | "MEDIUM RISK" | "HIGH RISK" {
  if (score >= 80) return "HIGH RISK";
  if (score >= 50) return "MEDIUM RISK";
  return "LOW RISK";
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSoft,
  },
  pressed: { opacity: 0.7 },
  icon: {
    width: 46,
    height: 46,
    borderRadius: Radius.md,
    backgroundColor: Colors.cardRaised,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: { fontSize: 20 },
  body: { flex: 1, gap: 4 },
  title: { color: Colors.text, fontSize: 14, fontWeight: "800" },
  meta: { color: Colors.textMuted, fontSize: 11, fontWeight: "600" },
  right: {},
  delete: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: { fontSize: 15, color: Colors.highRisk },
});