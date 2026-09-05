import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import { CallReportCard } from "@/components/CallReportCard";
import { CallTimeline } from "@/components/CallTimeline";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { BackButton, Button, Card, Screen } from "@/components/shared";
import { Colors, Radius, Spacing } from "@/constants/colors";
import { useAnalysis } from "@/context/AnalysisContext";
import { reportCall } from "@/services/api";
import { REPORT_CATEGORIES, type ReportCategory } from "@/types/call";

export default function CallReportScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getItem } = useAnalysis();
  const item = id ? getItem(id) : undefined;
  const callItem = item && item.kind === "call" ? item : undefined;

  const [category, setCategory] = useState<ReportCategory | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (!callItem) {
    return (
      <Screen>
        <BackButton />
        <EmptyState
          icon="📄"
          title="Call report not found"
          subtitle="This report may have been cleared from history."
          actionLabel="Back to Home"
          onAction={() => router.replace("/home" as never)}
        />
      </Screen>
    );
  }

  const submit = async () => {
    if (!category) {
      Alert.alert("Choose a category", "Select a reason before submitting.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      await reportCall({ callId: callItem.id, category, notes: notes.trim() || undefined });
      setSubmitted(true);
    } catch {
      setSubmitError("Report could not be submitted. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <BackButton />
      <Header title="VoiceShield Call Report" />

      <CallReportCard report={callItem} />

      <Text style={styles.sectionLabel}>OVERALL RISK</Text>
      <MetricsCard
        riskScore={callItem.riskScore}
        confidence={callItem.confidence}
        fakeProbability={callItem.fakeProbability}
        realProbability={callItem.realProbability}
        explanation={callItem.explanation}
      />

      <Text style={styles.sectionLabel}>RISK TIMELINE</Text>
      <CallTimeline points={callItem.timeline} />

      <Text style={styles.sectionLabel}>REPORT THIS CALL</Text>
      <Card>
        <Text style={styles.reportTitle}>🚩 Report a suspicious call</Text>
        <Text style={styles.reportCopy}>
          Reports are never sent automatically — they are submitted only when
          you press the button below.
        </Text>

        <Text style={styles.chipLabel}>Category</Text>
        <View style={styles.chips}>
          {REPORT_CATEGORIES.map((option) => {
            const selected = category === option;
            return (
              <Text
                key={option}
                onPress={() => setCategory(option)}
                style={[
                  styles.chip,
                  selected && {
                    borderColor: Colors.primary,
                    backgroundColor: `${Colors.primary}22`,
                    color: Colors.primary,
                  },
                ]}
              >
                {selected ? "✓ " : ""}
                {option}
              </Text>
            );
          })}
        </View>

        <Text style={styles.chipLabel}>Notes (optional)</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="What made this call suspicious?"
          placeholderTextColor={Colors.textMuted}
          multiline
          style={styles.input}
        />

        {submitError ? <Text style={styles.error}>{submitError}</Text> : null}

        {submitted ? (
          <View style={styles.success}>
            <Text style={styles.successText}>✓ Report submitted. Thank you.</Text>
          </View>
        ) : (
          <Button
            label={submitting ? "Submitting…" : "Submit Report"}
            variant="danger"
            icon="🚩"
            onPress={() => void submit()}
            disabled={submitting}
            style={styles.submitButton}
          />
        )}
      </Card>

      <Button
        label="Back to Home"
        variant="secondary"
        onPress={() => router.replace("/home" as never)}
        style={styles.homeButton}
      />
    </Screen>
  );
}

function MetricsCard(props: {
  riskScore: number;
  confidence: number;
  fakeProbability: number;
  realProbability: number;
  explanation: string;
}) {
  const { riskScore, confidence, fakeProbability, realProbability, explanation } = props;
  return (
    <Card style={styles.metrics}>
      <Metric label="Risk Score" value={`${riskScore}%`} accent={Colors.highRisk} />
      <Metric label="Confidence" value={`${confidence}%`} accent={Colors.accent} />
      <Metric label="AI Voice Probability" value={`${fakeProbability}%`} accent={Colors.highRisk} />
      <Metric label="Genuine Voice Probability" value={`${realProbability}%`} accent={Colors.success} />
      <Text style={styles.explanation}>{explanation}</Text>
    </Card>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <View style={styles.metricRow}>
      <View style={[styles.metricDot, { backgroundColor: accent }]} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color: accent }]}>{value}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  metrics: { gap: Spacing.sm },
  metricRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  metricDot: { width: 8, height: 8, borderRadius: 4 },
  metricLabel: { color: Colors.text, fontSize: 13, fontWeight: "700", flex: 1 },
  metricValue: { fontSize: 14, fontWeight: "900", fontVariant: ["tabular-nums"] },
  explanation: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSoft,
    paddingTop: Spacing.sm,
  },
  reportTitle: { color: Colors.text, fontSize: 15, fontWeight: "900" },
  reportCopy: { color: Colors.textMuted, fontSize: 12, lineHeight: 19, marginTop: 4 },
  chipLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    marginTop: Spacing.md,
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    overflow: "hidden",
  },
  input: {
    minHeight: 76,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardRaised,
    color: Colors.text,
    padding: 12,
    marginTop: 4,
    textAlignVertical: "top",
    fontSize: 13,
  },
  error: { color: Colors.highRisk, fontSize: 12, fontWeight: "700", marginTop: Spacing.sm },
  success: {
    backgroundColor: `${Colors.success}1A`,
    borderColor: `${Colors.success}4D`,
    borderWidth: 1,
    borderRadius: Radius.sm,
    padding: 12,
    marginTop: Spacing.sm,
  },
  successText: { color: Colors.success, fontSize: 13, fontWeight: "800" },
  submitButton: { marginTop: Spacing.md },
  homeButton: { marginTop: Spacing.lg },
});