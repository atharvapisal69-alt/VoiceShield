import { useEffect, useState } from "react";
import { Animated, Easing, Platform, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAudioRecorder, useAudioRecorderState } from "expo-audio";

import { AudioPlayer } from "@/components/AudioPlayer";
import { Header } from "@/components/Header";
import { PermissionCard } from "@/components/PermissionCard";
import { RecordingCard } from "@/components/RecordingCard";
import { BackButton, Button, Card, Screen, formatDuration } from "@/components/shared";
import { Colors, Radius, Spacing } from "@/constants/colors";
import {
  RECORDING_FILE_NAME,
  RECORDING_PRESET,
  prepareAudioModeForPlayback,
  prepareAudioModeForRecording,
} from "@/services/recording";
import { requestMicrophonePermission } from "@/services/permissions";

type Phase = "permission" | "idle" | "recording" | "ready";

const WAVE_BARS = [0.5, 1, 0.62, 0.9, 0.44, 0.96, 0.58, 1, 0.48, 0.8];

export default function RecordScreen() {
  const recorder = useAudioRecorder(RECORDING_PRESET);
  const recorderState = useAudioRecorderState(recorder);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const [wave] = useState(() => new Animated.Value(0));

  useEffect(() => {
    void prepareAudioModeForRecording();
    return () => {
      void prepareAudioModeForPlayback();
    };
  }, []);

  useEffect(() => {
    if (phase !== "recording") return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wave, {
          toValue: 1,
          duration: 520,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(wave, {
          toValue: 0,
          duration: 520,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [phase, wave]);

  const start = async () => {
    try {
      const permission = await requestMicrophonePermission();
      if (!permission.granted) {
        setPhase("permission");
        return;
      }
      setError("");
      await recorder.prepareToRecordAsync();
      recorder.record();
      setPhase("recording");
    } catch {
      setError("We could not access the microphone. Please try again.");
    }
  };

  const stop = async () => {
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri) throw new Error("no uri");
      setRecordedDuration(recorderState.durationMillis / 1000);
      setRecordingUri(uri);
      setPhase("ready");
    } catch {
      setError("Recording stopped unexpectedly. Please try again.");
    }
  };

  const reset = () => {
    setRecordingUri(null);
    setRecordedDuration(0);
    setPhase("idle");
    setError("");
  };

  const analyze = () => {
    if (!recordingUri) return;
    router.push({
      pathname: "/analyze",
      params: {
        uri: recordingUri,
        name: RECORDING_FILE_NAME,
        mimeType: "audio/m4a",
        source: "recording",
        duration: String(Math.round(recordedDuration)),
      },
    } as never);
  };
return (
    <Screen>
      <BackButton />
      <Header
        title="Record a Voice"
        subtitle="A clear sample helps the model give a more reliable risk score."
      />

      {phase === "permission" ? (
        <PermissionCard
          icon="🎙️"
          title="Microphone access needed"
          description="VoiceShield uses your microphone only while you are recording."
          granted={false}
          requestLabel="Grant access"
          onRequest={start}
        />
      ) : null}

      {phase === "idle" ? <RecordingCard onStart={() => void start()} /> : null}

      {phase === "recording" ? (
        <Card style={styles.recordingCard}>
          <View style={styles.recPill}>
            <View style={styles.recDot} />
            <Text style={styles.recText}>REC</Text>
          </View>
          <Text style={styles.timer}>
            {formatDuration((recorderState.durationMillis ?? 0) / 1000)}
          </Text>
          <View style={styles.waveRow}>
            {WAVE_BARS.map((height, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.waveBar,
                  {
                    height: 20 + height * 34,
                    transform: [
                      {
                        scaleY: wave.interpolate({
                          inputRange: [0, 1],
                          outputRange:
                            index % 2 === 0 ? [0.55, 1] : [1, 0.55],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.micHint}>
            Listening… speak clearly. Recording is active.
          </Text>
          <Button
            label="Stop Recording"
            variant="danger"
            icon="⏹"
            onPress={() => void stop()}
            style={styles.stopButton}
          />
        </Card>
      ) : null}

      {phase === "ready" && recordingUri ? (
        <Card style={styles.readyCard}>
          <Text style={styles.readyKicker}>✓ AUDIO READY</Text>
          <Text style={styles.readyTitle}>Your recording</Text>
          <Text style={styles.readyFile}>🎵 {RECORDING_FILE_NAME}</Text>
          <Text style={styles.readyMeta}>
            Duration: {formatDuration(recordedDuration)}
          </Text>
          <AudioPlayer uri={recordingUri} />
          <View style={styles.readyRow}>
            <Button label="Delete" variant="secondary" icon="🗑" onPress={reset} style={styles.flexButton} />
            <Button label="Re-record" variant="secondary" icon="🔄" onPress={reset} style={styles.flexButton} />
          </View>
          <Button label="Analyze Audio" icon="🛡️" onPress={analyze} style={styles.stretchButton} />
        </Card>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Screen>
  );
}
const styles = StyleSheet.create({
  recordingCard: { alignItems: "center", paddingVertical: Spacing.xl, marginTop: Spacing.lg },
  recPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: `${Colors.highRisk}1A`,
    borderColor: `${Colors.highRisk}4D`,
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  recDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.highRisk,
    shadowColor: Colors.highRisk,
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  recText: { color: Colors.highRisk, fontSize: 12, fontWeight: "900", letterSpacing: 1.2 },
  timer: {
    color: Colors.text,
    fontSize: 44,
    fontWeight: "900",
    marginTop: Spacing.md,
    fontVariant: ["tabular-nums"],
  },
  waveRow: {
    height: 66,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: Spacing.lg,
  },
  waveBar: { width: 6, borderRadius: 3, backgroundColor: Colors.highRisk },
  micHint: { color: Colors.textMuted, fontSize: 12, marginTop: Spacing.lg },
  stopButton: { alignSelf: "stretch", marginTop: Spacing.lg },
  readyCard: { marginTop: Spacing.lg },
  readyKicker: { color: Colors.success, fontSize: 11, fontWeight: "900", letterSpacing: 1.4 },
  readyTitle: { color: Colors.text, fontSize: 20, fontWeight: "900", marginTop: 4 },
  readyFile: { color: Colors.textMuted, fontSize: 13, marginTop: 8 },
  readyMeta: { color: Colors.textMuted, fontSize: 12, marginTop: 4 },
  readyRow: { flexDirection: "row", gap: Spacing.sm },
  flexButton: { flex: 1 },
  stretchButton: { alignSelf: "stretch", marginTop: Spacing.sm },
  error: { color: Colors.highRisk, textAlign: "center", marginTop: Spacing.lg },
});