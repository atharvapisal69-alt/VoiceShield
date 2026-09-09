import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AnalysisLoading } from "@/components/AnalysisLoading";
import { Icon } from "@/components/Icon";
import { BackButton, Button, Screen } from "@/components/shared";
import { Colors, Spacing } from "@/constants/colors";
import { useAudioAnalysis } from "@/hooks/useAudioAnalysis";
import type { AnalysisSource } from "@/types/analysis";

/**
 * Unified analysis pipeline. Both Record and Upload land here with the same
 * contract, so AI-analysis logic exists exactly once in the app.
 */
export default function AnalyzeScreen() {
  const params = useLocalSearchParams<{
    uri: string;
    name?: string;
    mimeType?: string;
    source?: string;
    duration?: string;
  }>();
  const { state, error, run, isMock } = useAudioAnalysis();
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!params.uri) return;
    const source: AnalysisSource =
      params.source === "recording" ? "recording" : "upload";
    const rawDuration = Number(params.duration);
    const hasDuration = Number.isFinite(rawDuration) && rawDuration > 0;

    void run({
      file: {
        uri: params.uri,
        name: params.name ?? "Audio recording",
        mimeType: params.mimeType,
        duration: hasDuration ? rawDuration : undefined,
      },
      source,
    }).then((item) => {
      if (item) {
        router.replace({
          pathname: "/result",
          params: { id: item.id },
        } as never);
      }
    });
  }, [
    run,
    params.uri,
    params.name,
    params.mimeType,
    params.source,
    params.duration,
    attempt,
  ]);

  if (!params.uri) {
    return (
      <Screen>
        <BackButton />
        <View style={styles.center}>
          <Text style={styles.errorTitle}>No audio provided</Text>
          <Text style={styles.errorCopy}>
            Go back and choose a recording or audio file first.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <BackButton />
      {state === "error" ? (
        <View style={styles.center}>
          <Icon name="faceFrown" size={40} color={Colors.textMuted} />
          <Text style={styles.errorTitle}>Analysis failed</Text>
          <Text style={styles.errorCopy}>{error}</Text>
          <Button
            label="Try Again"
            onPress={() => setAttempt((current) => current + 1)}
            style={styles.retry}
          />
        </View>
      ) : (
        <AnalysisLoading fileName={params.name} isMock={isMock} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  errorEmoji: { fontSize: 40 },
  errorTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginTop: Spacing.sm,
  },
  errorCopy: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 290,
  },
  retry: { alignSelf: "stretch", marginTop: Spacing.md },
});
