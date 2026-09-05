import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CallProtectionCard } from "@/components/CallProtectionCard";
import { Header } from "@/components/Header";
import { HistoryItem } from "@/components/HistoryItem";
import { EmptyState } from "@/components/EmptyState";
import { Card, SectionHeader, Screen } from "@/components/shared";
import { Colors, Radius, Spacing } from "@/constants/colors";
import { useAnalysis } from "@/context/AnalysisContext";
import { useCallProtection } from "@/context/CallProtectionContext";
import type { HistoryItem as HistoryItemType } from "@/types/call";

export default function HomeScreen() {
  const { items } = useAnalysis();
  const { enabled, activeCall } = useCallProtection();
  const recent = items.slice(0, 3);

  const openHistoryItem = (item: HistoryItemType) => {
    if (item.kind === "call") {
      router.push({ pathname: "/call-report", params: { id: item.id } } as never);
    } else {
      router.push({ pathname: "/result", params: { id: item.id } } as never);
    }
  };

  return (
    <Screen>
      <Header brand status="Voice Protection Ready" />

      <Card style={styles.mainCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconEmoji}>🛡️</Text>
          </View>
          <Text style={styles.cardTitle}>Analyze a Voice</Text>
          <Text style={styles.cardCopy}>
            Choose how you want VoiceShield to analyze a voice.
          </Text>
        </View>

        <ActionRow
          emoji="📞"
          title="Protect Call"
          hint="Monitor supported calls for suspicious voice characteristics."
          onPress={() => router.push("/call-protection" as never)}
        />
        <ActionRow
          emoji="🎙️"
          title="Record Voice"
          hint="Record a voice sample for analysis."
          onPress={() => router.push("/record" as never)}
        />
        <ActionRow
          emoji="📁"
          title="Upload Audio"
          hint="Analyze an existing audio recording."
          onPress={() => router.push("/upload" as never)}
        />
      </Card>

      <View style={styles.protection}>
        <CallProtectionCard
          enabled={enabled}
          active={Boolean(activeCall)}
          manage={{
            label: enabled ? "Manage Call Protection" : "Enable Call Protection",
            onPress: () => router.push("/call-protection" as never),
          }}
          onToggle={() => router.push("/call-protection" as never)}
        />
      </View>

      <SectionHeader
        eyebrow="YOUR ACTIVITY"
        title="Recent analyses"
        right={
          <Pressable onPress={() => router.push("/history" as never)}>
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        }
      />

      {recent.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No analyses yet"
          subtitle="Run your first voice check to see results here."
        />
      ) : (
        recent.map((item) => (
          <HistoryItem
            key={item.id}
            item={item}
            onPress={() => openHistoryItem(item)}
          />
        ))
      )}
    </Screen>
  );
}

function ActionRow({
  emoji,
  title,
  hint,
  onPress,
}: {
  emoji: string;
  title: string;
  hint: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
    >
      <View style={styles.actionIcon}>
        <Text style={styles.actionEmoji}>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionHint}>{hint}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mainCard: { marginTop: Spacing.sm },
  cardHeader: { alignItems: "center", marginBottom: Spacing.md },
  cardIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: `${Colors.primary}22`,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  cardIconEmoji: { fontSize: 24 },
  cardTitle: { color: Colors.text, fontSize: 19, fontWeight: "900" },
  cardCopy: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSoft,
  },
  actionPressed: { opacity: 0.7 },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.cardRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  actionEmoji: { fontSize: 19 },
  actionTitle: { color: Colors.text, fontSize: 15, fontWeight: "900" },
  actionHint: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  chevron: { color: Colors.textMuted, fontSize: 24 },
  protection: { marginTop: Spacing.lg },
  viewAll: { color: Colors.primary, fontSize: 13, fontWeight: "800" },
});