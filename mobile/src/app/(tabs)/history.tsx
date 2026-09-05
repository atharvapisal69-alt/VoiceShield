import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { HistoryItem } from "@/components/HistoryItem";
import { Button, Screen } from "@/components/shared";
import { Colors, Radius, Spacing } from "@/constants/colors";
import { useAnalysis } from "@/context/AnalysisContext";
import type { HistoryItem as HistoryItemType } from "@/types/call";

type Segment = "analyses" | "calls";

export default function HistoryTab() {
  const { items, removeItem, clearAll } = useAnalysis();
  const [segment, setSegment] = useState<Segment>("analyses");

  const visible = items.filter((item) =>
    segment === "calls" ? item.kind === "call" : item.kind === "analysis",
  );

  const confirmClearAll = () => {
    Alert.alert(
      "Clear all history?",
      "This removes every saved analysis and call report from this device.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: clearAll },
      ],
    );
  };

  const openItem = (item: HistoryItemType) => {
    if (item.kind === "call") {
      router.push({ pathname: "/call-report", params: { id: item.id } } as never);
    } else {
      router.push({ pathname: "/result", params: { id: item.id } } as never);
    }
  };

  return (
    <Screen>
      <Header
        title="History"
        subtitle="Voice analyses and call reports saved privately on this device."
      />

      <View style={styles.segment}>
        <SegmentButton
          label="🎙️ Voice Analyses"
          active={segment === "analyses"}
          onPress={() => setSegment("analyses")}
        />
        <SegmentButton
          label="📞 Call Reports"
          active={segment === "calls"}
          onPress={() => setSegment("calls")}
        />
      </View>

      {visible.length === 0 ? (
        <EmptyState
          icon={segment === "calls" ? "📞" : "🎵"}
          title={
            segment === "calls" ? "No call reports" : "No voice analyses"
          }
          subtitle={
            segment === "calls"
              ? "Completed call protection sessions will appear here."
              : "Run a recording or upload to start building your voice history."
          }
          actionLabel="Analyze a voice"
          onAction={() => router.push("/" as never)}
        />
      ) : (
        <>
          <View style={styles.list}>
            {visible.map((item) => (
              <HistoryItem
                key={item.id}
                item={item}
                onPress={() => openItem(item)}
                onDelete={() => removeItem(item.id)}
              />
            ))}
          </View>
          <Button
            label="Clear All History"
            variant="danger"
            icon="🗑"
            onPress={confirmClearAll}
            style={styles.clearButton}
          />
        </>
      )}
    </Screen>
  );
}

function SegmentButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.segmentButton, active && styles.segmentActive]}
    >
      <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 4,
    marginBottom: Spacing.sm,
  },
  segmentButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: Radius.sm,
  },
  segmentActive: { backgroundColor: Colors.primary },
  segmentLabel: { color: Colors.textMuted, fontSize: 12, fontWeight: "800" },
  segmentLabelActive: { color: Colors.white },
  list: { marginTop: Spacing.xs },
  clearButton: { marginTop: Spacing.lg },
});