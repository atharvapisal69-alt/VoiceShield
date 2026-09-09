import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AnimatedVoiceShieldLogo } from "@/components/AnimatedVoiceShieldLogo";
import { CallProtectionCard } from "@/components/CallProtectionCard";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { HistoryItem } from "@/components/HistoryItem";
import { Icon, type IconName } from "@/components/Icon";
import { Button, Card, Screen, SectionHeader } from "@/components/shared";
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
      router.push({
        pathname: "/call-report",
        params: { id: item.id },
      } as never);
    } else {
      router.push({ pathname: "/result", params: { id: item.id } } as never);
    }
  };

  return (
    <Screen>
      <Header brand status="Voice Protection Ready" />

      <Card style={styles.mainCard}>
        <View style={styles.cardHeader}>
          <AnimatedVoiceShieldLogo size={84} autoPlay showWordmark={false} />
          <Text style={styles.cardTitle}>Analyze a Voice</Text>
          <Text style={styles.cardCopy}>
            Choose how you want VoiceShield to analyze a voice.
          </Text>
          <Button
            label="Getting Started"
            icon="arrowRight"
            onPress={() => router.push("/record" as never)}
            style={styles.gettingStarted}
          />
        </View>

        <ActionRow
          icon="phone"
          title="Protect Call"
          hint="Monitor supported calls for suspicious voice characteristics."
          onPress={() => router.push("/call-protection" as never)}
        />
        <ActionRow
          icon="microphone"
          title="Record Voice"
          hint="Record a voice sample for analysis."
          onPress={() => router.push("/record" as never)}
        />
        <ActionRow
          icon="folderOpen"
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
            label: enabled
              ? "Manage Call Protection"
              : "Enable Call Protection",
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
          icon="magnifyingGlass"
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
  icon,
  title,
  hint,
  onPress,
}: {
  icon: IconName;
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
        <Icon name={icon} size={19} color={Colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionHint}>{hint}</Text>
      </View>
      <Icon name="arrowRight" size={18} color={Colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mainCard: { marginTop: Spacing.sm },
  cardHeader: { alignItems: "center", marginBottom: Spacing.md },
  cardTitle: { color: Colors.text, fontSize: 19, fontWeight: "900" },
  cardCopy: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  gettingStarted: {
    alignSelf: "stretch",
    marginTop: Spacing.md,
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
