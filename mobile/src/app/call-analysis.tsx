import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { CallTimeline } from "@/components/CallTimeline";
import { CallWarning } from "@/components/CallWarning";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { LiveRiskIndicator } from "@/components/LiveRiskIndicator";
import {
  BackButton,
  Button,
  Card,
  Screen,
  formatDuration,
} from "@/components/shared";
import { Colors, Radius, Spacing } from "@/constants/colors";
import { CALL_TIME_SCALE } from "@/constants/config";
import { useAnalysis } from "@/context/AnalysisContext";
import { useCallProtection } from "@/context/CallProtectionContext";

/**
 * Active call screen with live (simulated) voice analysis.
 * Risk climbs through LOW → MEDIUM → HIGH and triggers an in-call warning.
 */
export default function CallAnalysisScreen() {
  const { activeCall, startCall, endCall, abandonCall } = useCallProtection();
  const { addItem } = useAnalysis();

  const [dismissed, setDismissed] = useState(false);
  const [now, setNow] = useState(0);
  const mountStartedRef = useRef(false);

  const showWarning = Boolean(activeCall?.warningShown) && !dismissed;

  // Auto-start a demo call the first time the screen renders.
  useEffect(() => {
    if (!activeCall && !mountStartedRef.current) {
      mountStartedRef.current = true;
      startCall();
    }
  }, [activeCall, startCall]);

  // Heartbeat timer for the duration readout.
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Abandon any in-progress call when leaving this screen.
  useEffect(
    () => () => {
      abandonCall();
    },
    [abandonCall],
  );

  if (!activeCall) {
    return (
      <Screen scroll={false}>
        <BackButton />
        <Header title="Active Call" />
        <Text style={styles.starting}>Starting voice analysis…</Text>
      </Screen>
    );
  }

  const elapsedCallSeconds = Math.floor(
    ((now - activeCall.startedAt) / 1000) * CALL_TIME_SCALE,
  );
  const currentRisk = activeCall.currentRisk;
  const timeline = activeCall.points.slice(-8);

  const finishCall = () => {
    const report = endCall();
    if (report) {
      addItem(report);
      router.replace({
        pathname: "/call-report",
        params: { id: report.id },
      } as never);
    } else {
      router.replace("/home" as never);
    }
  };

  const reportAndExit = () => {
    const report = endCall();
    if (report) {
      addItem(report);
      router.replace({
        pathname: "/call-report",
        params: { id: report.id },
      } as never);
    }
  };

  return (
    <Screen>
      <BackButton label="End & Exit" />
      <Header title="Call in Progress" status="VoiceShield Protection" />

      <Card style={styles.callCard}>
        <Icon name="phone" size={38} color={Colors.primary} />
        <Text style={styles.duration}>
          {formatDuration(elapsedCallSeconds)}
        </Text>
        <Text style={styles.durationLabel}>CALL DURATION</Text>
        <View style={styles.analysisRow}>
          <View style={styles.liveDot} />
          <Text style={styles.analysisLabel}>Voice Analysis</Text>
          <Text style={styles.analysisState}>Active</Text>
        </View>
      </Card>

      <View style={styles.gap}>
        <LiveRiskIndicator
          score={currentRisk?.score ?? 8}
          level={currentRisk?.level ?? "LOW RISK"}
          active
        />
      </View>

      {timeline.length > 0 ? (
        <View style={styles.gap}>
          <CallTimeline points={timeline} />
        </View>
      ) : null}

      <View style={styles.actions}>
        <Button
          label="Report Call"
          variant="secondary"
          icon="flag"
          onPress={reportAndExit}
        />
        <Button
          label="End Call"
          variant="danger"
          icon="stop"
          onPress={finishCall}
        />
      </View>

      <CallWarning
        visible={showWarning}
        score={currentRisk?.score ?? 0}
        confidence={Math.min(
          97,
          88 + Math.round((currentRisk?.score ?? 0) / 10),
        )}
        explanation="The analyzed voice contains characteristics that may be associated with synthetic or manipulated speech."
        onReport={reportAndExit}
        onDismiss={() => setDismissed(true)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  starting: {
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: "center",
    marginTop: Spacing.xl,
  },
  callCard: { alignItems: "center", paddingVertical: Spacing.xl },
  callIcon: { fontSize: 38, marginBottom: Spacing.sm },
  duration: {
    color: Colors.text,
    fontSize: 46,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  durationLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.6,
    marginTop: 4,
  },
  analysisRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: Spacing.md,
    backgroundColor: `${Colors.success}14`,
    borderColor: `${Colors.success}3D`,
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    shadowColor: Colors.success,
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  analysisLabel: { color: Colors.text, fontSize: 12, fontWeight: "800" },
  analysisState: { color: Colors.success, fontSize: 12, fontWeight: "900" },
  gap: { marginTop: Spacing.lg },
  actions: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.xl },
});
