import { Screen } from "@/components/screen";
import { Colors } from "@/constants/theme";
import {
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioRecorder,
    useAudioRecorderState,
} from "expo-audio";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function Record() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder);
  const [error, setError] = useState("");
  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
  }, []);
  const toggle = async () => {
    try {
      if (state.isRecording) {
        await recorder.stop();
        if (recorder.uri)
          router.replace({
            pathname: "/analyzing",
            params: { uri: recorder.uri, name: "VoiceShield recording.m4a" },
          } as never);
      } else {
        const permission = await AudioModule.requestRecordingPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            "Microphone access needed",
            "Enable microphone access to record a voice sample.",
          );
        }
        await recorder.prepareToRecordAsync();
        recorder.record();
      }
    } catch {
      setError("We could not access the microphone. Please try again.");
    }
  };
  const seconds = Math.floor((state.durationMillis ?? 0) / 1000);
  return (
    <Screen scroll={false}>
      <Text style={styles.back} onPress={() => router.back()}>
        Back
      </Text>
      <View style={styles.center}>
        <Text style={styles.kicker}>LIVE CAPTURE</Text>
        <Text style={styles.title}>Record a voice sample</Text>
        <Text style={styles.copy}>
          Speak naturally for a few seconds. Clear audio gives the model more
          signal to work with.
        </Text>
        <View style={[styles.ring, state.isRecording && styles.recordingRing]}>
          <Text style={styles.timer}>
            {state.isRecording
              ? `00:${String(seconds).padStart(2, "0")}`
              : "00:00"}
          </Text>
          <Text style={styles.live}>
            {state.isRecording ? "LISTENING" : "READY"}
          </Text>
        </View>
        <Pressable
          onPress={toggle}
          style={[styles.control, state.isRecording && styles.stop]}
        >
          <Text style={styles.controlText}>
            {state.isRecording ? "Stop recording" : "Start recording"}
          </Text>
        </Pressable>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  back: { color: Colors.muted, marginTop: 14, fontSize: 14 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  kicker: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    color: Colors.text,
    fontSize: 29,
    fontWeight: "800",
    marginTop: 10,
    textAlign: "center",
  },
  copy: {
    color: Colors.muted,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 300,
    marginTop: 14,
  },
  ring: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: 45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.panel,
  },
  recordingRing: { borderColor: Colors.red, backgroundColor: "#241A2A" },
  timer: { color: Colors.text, fontSize: 38, fontWeight: "800" },
  live: {
    color: Colors.muted,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 8,
    fontWeight: "800",
  },
  control: {
    backgroundColor: Colors.blue,
    borderRadius: 18,
    minHeight: 56,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  stop: { backgroundColor: Colors.red },
  controlText: { color: Colors.ink, fontWeight: "800", fontSize: 16 },
  error: { color: Colors.red, textAlign: "center", marginTop: 16 },
});
