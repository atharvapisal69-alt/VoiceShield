import { useEffect, useState } from "react";
import {
    Animated,
    Easing,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Icon } from "@/components/Icon";
import { Colors, Radius, Spacing, riskColor } from "@/constants/colors";
import type { RiskLevel } from "@/types/analysis";

/**
 * Live risk display for an active call: "Voice Analysis — Active" with an
 * animated horizontal meter and the current score.
 */
export function LiveRiskIndicator({
  score,
  level,
  active = true,
}: {
  score: number;
  level: RiskLevel;
  active?: boolean;
}) {
  const [value] = useState(() => new Animated.Value(0));
  const clampedScore = Math.max(0, Math.min(100, score));
  const color = riskColor(level);

  useEffect(() => {
    Animated.timing(value, {
      toValue: clampedScore,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [clampedScore, value]);

  const width = value.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.analysisRow}>
          <Icon name="headphones" size={22} color={Colors.primary} />
          <View>
            <Text style={styles.analysisTitle}>Voice Analysis</Text>
            <View style={styles.activeRow}>
              <View
                style={[
                  styles.liveDot,
                  {
                    backgroundColor: active ? Colors.success : Colors.textMuted,
                  },
                ]}
              />
              <Text
                style={[
                  styles.activeText,
                  { color: active ? Colors.success : Colors.textMuted },
                ]}
              >
                {active ? "Active" : "Standby"}
              </Text>
            </View>
          </View>
        </View>
        <Text style={[styles.score, { color }]}>
          {clampedScore.toFixed(0)}%
        </Text>
      </View>

      <View style={styles.track}>
        <Animated.View
          style={[styles.fill, { width, backgroundColor: color }]}
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.level, { color }]}>{level}</Text>
        <Text style={styles.note}>
          {Platform.OS === "web" ? "Simulated feed" : "Live feed"}
        </Text>
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  analysisRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  analysisIcon: { fontSize: 22 },
  analysisTitle: { color: Colors.text, fontSize: 15, fontWeight: "900" },
  activeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4 },
  activeText: { fontSize: 11, fontWeight: "800" },
  score: { fontSize: 30, fontWeight: "900", fontVariant: ["tabular-nums"] },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 5 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  level: { fontSize: 12, fontWeight: "900", letterSpacing: 1 },
  note: { color: Colors.textMuted, fontSize: 11, fontWeight: "600" },
});
