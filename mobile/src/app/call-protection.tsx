import { useMemo } from "react";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { CallProtectionCard } from "@/components/CallProtectionCard";
import { Header } from "@/components/Header";
import { BackButton, Button, Card, Screen } from "@/components/shared";
import { Colors, Spacing } from "@/constants/colors";
import { useCallProtection } from "@/context/CallProtectionContext";
import { getCallAudioSupport } from "@/services/permissions";

/**
 * Call Protection — entry screen.
 *
 * Real-time cellular call audio is restricted by Android/iOS, so this screen
 * truthfully reports availability and offers the demo call (which uses the
 * same analysis pipeline) plus record/upload fallbacks.
 */
export default function CallProtectionScreen() {
  const { enabled, activeCall, enableProtection, disableProtection, startCall } =
    useCallProtection();
  const support = useMemo(() => getCallAudioSupport(), []);

  const onToggle = () => {
    if (enabled) disableProtection();
    else enableProtection();
  };

  const startDemoCall = () => {
    startCall();
    router.push("/call-analysis" as never);
  };

  return (
    <Screen>
      <BackButton />
      <Header
        title="Call Protection"
        status="🟢 Protection Ready"
      />
      <Text style={styles.copy}>
        VoiceShield can analyze supported call audio and warn you when
        potentially suspicious voice characteristics are detected.
      </Text>

      <View style={styles.cardGap}>
        <CallProtectionCard
          enabled={enabled}
          active={Boolean(activeCall)}
          onToggle={onToggle}
          demoMode={enabled}
          onStartDemo={startDemoCall}
        />
      </View>

      {!support.supported ? (
        <Card style={styles.cardGap} accent={Colors.mediumRisk}>
          <Text style={styles.warningTitle}>⚠️ {support.reason}</Text>
          <Text style={styles.warningCopy}>
            This device cannot safely capture live cellular call audio.
            VoiceShield never bypasses operating-system restrictions. Use the
            supported methods below instead:
          </Text>
          <View style={styles.fallbackRow}>
            <Button
              label="Record Voice"
              icon="🎙️"
              variant="secondary"
              compact
              style={styles.fallbackButton}
              onPress={() => router.push("/record" as never)}
            />
            <Button
              label="Upload Audio"
              icon="📁"
              variant="secondary"
              compact
              style={styles.fallbackButton}
              onPress={() => router.push("/upload" as never)}
            />
          </View>
        </Card>
      ) : null}

      <Card style={styles.cardGap}>
        <Text style={styles.privacyTitle}>Privacy principles</Text>
        {[
          "Analysis runs only after you take an explicit action.",
          "No calls are recorded or uploaded without your consent.",
          "Only analysis metadata is saved on your device.",
          "Risk scores are probabilistic — never a definite scammer claim.",
        ].map((item) => (
          <View key={item} style={styles.privacyRow}>
            <Text style={styles.privacyCheck}>✓</Text>
            <Text style={styles.privacyCopy}>{item}</Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: Spacing.sm,
  },
  cardGap: { marginTop: Spacing.lg },
  warningTitle: { color: Colors.mediumRisk, fontSize: 14, fontWeight: "900" },
  warningCopy: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: Spacing.sm,
  },
  fallbackRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  fallbackButton: { flex: 1 },
  privacyTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: Spacing.sm,
  },
  privacyRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
  privacyCheck: { color: Colors.success, fontSize: 13, fontWeight: "900" },
  privacyCopy: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
});