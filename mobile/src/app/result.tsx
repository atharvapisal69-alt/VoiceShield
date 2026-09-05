import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { RiskMeter } from "@/components/RiskMeter";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { Button, Card, Screen, formatDateTime, formatDuration, riskColor } from "@/components/shared";
import { Colors, Radius, Spacing } from "@/constants/colors";
import { useAnalysis } from "@/context/AnalysisContext";

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getItem } = useAnalysis();
  const item = id ? getItem(id) : undefined;
  const analysisItem = item && item.kind === "analysis" ? item : null;

  if (!analysisItem) {
    return (
      <Screen>
        <Header title="Analysis Result" />
        <EmptyState
          icon="🔍"
          title="Result not found"
          subtitle="This analysis may have been cleared from history."
          actionLabel="Back to Home"
          onAction={() => router.replace("/home" as never)}
        />
      </Screen>
    );
  }

  const accent = riskColor(analysisItem.riskScore);

  return (
    <Screen>
      <Header title="Voice Analysis Result" />

      <Card style={styles.meterCard}>
        <RiskMeter score={analysisItem.riskScore} />
        <Text style={styles.fileName} numberOfLines={1}>
          {analysisItem.fileName}
        </Text>
        <Text style={styles.fileMeta}>
          {formatDateTime(analysisItem.createdAt)}
          {analysisItem.duration
            ? `  ·  ${formatDuration(analysisItem.duration)}`
            : ""}
        </Text>
      </Card>

      <View style={styles.sourceChip}>
        <Text style={[styles.sourceChipText, { color: accent }]}>
          {analysisItem.source === "recording" ? "🎙️ RECORDING" : "📁 UPLOAD"}
        </Text>
      </View>

      <RiskScoreCard
        label={analysisItem.label}
        riskScore={analysisItem.riskScore}
        confidence={analysisItem.confidence}
        fakeProbability={analysisItem.fakeProbability}
        realProbability={analysisItem.realProbability}
        explanation={analysisItem.explanation}
      />

      <Button
        label="Analyze Another Voice"
        icon="🛡️"
        onPress={() => router.replace("/home" as never)}
        style={styles.primaryButton}
      />
      <Button
        label="View History"
        variant="secondary"
        onPress={() => router.push("/history" as never)}
        style={styles.secondaryButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  meterCard: { alignItems: "center", paddingVertical: Spacing.lg },
  fileName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "800",
    marginTop: Spacing.sm,
    maxWidth: 320,
  },
  fileMeta: { color: Colors.textMuted, fontSize: 12, marginTop: 4 },
  sourceChip: {
    alignSelf: "center",
    backgroundColor: Colors.cardRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginVertical: Spacing.md,
  },
  sourceChipText: { fontSize: 10, fontWeight: "900", letterSpacing: 1.2 },
  primaryButton: { marginTop: Spacing.lg },
  secondaryButton: { marginTop: Spacing.sm },
});