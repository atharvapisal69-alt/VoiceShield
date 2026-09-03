import { Screen } from "@/components/screen";
import { Colors } from "@/constants/theme";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
export default function Upload() {
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null,
  );
  const player = useAudioPlayer(file?.uri ?? null);
  const status = useAudioPlayerStatus(player);

  const pick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["audio/wav", "audio/mpeg", "audio/mp4", "audio/x-m4a"],
      copyToCacheDirectory: true,
    });
    if (!result.canceled) {
      const file = result.assets[0];
      setFile(file);
    }
  };
  return (
    <Screen>
      <Text style={styles.back} onPress={() => router.back()}>
        Back
      </Text>
      <View style={styles.center}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>FILE</Text>
        </View>
        <Text style={styles.title}>Choose an audio file</Text>
        <Text style={styles.copy}>
          Select a voice recording from your device to scan for synthetic
          patterns.
        </Text>
        {file ? (
          <View style={styles.selected}>
            <View style={styles.selectedTop}>
              <View style={styles.audioBadge}>
                <Text style={styles.audioBadgeText}>AUDIO</Text>
              </View>
              <Pressable onPress={() => setFile(null)}>
                <Text style={styles.remove}>Remove</Text>
              </Pressable>
            </View>
            <Text style={styles.fileName} numberOfLines={1}>
              {file.name}
            </Text>
            <Text style={styles.hint}>
              {file.size
                ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                : "Audio file ready"}
            </Text>
            <Pressable
              style={styles.preview}
              onPress={() => (status.playing ? player.pause() : player.play())}
            >
              <Text style={styles.previewText}>
                {status.playing ? "Pause preview" : "Play preview"}
              </Text>
            </Pressable>
            <Pressable
              style={styles.analyze}
              onPress={() =>
                router.push({
                  pathname: "/analyzing",
                  params: {
                    uri: file.uri,
                    name: file.name,
                    mimeType: file.mimeType ?? "",
                  },
                } as never)
              }
            >
              <Text style={styles.analyzeText}>Analyze this file</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.drop} onPress={pick}>
            <Text style={styles.dropTitle}>Browse files</Text>
            <Text style={styles.hint}>WAV, MP3, or M4A up to 25 MB</Text>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  back: { color: Colors.muted, marginTop: 14 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  icon: {
    width: 74,
    height: 74,
    borderRadius: 22,
    backgroundColor: Colors.panelRaised,
    borderWidth: 1,
    borderColor: Colors.purple,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  iconText: { color: Colors.purple, fontWeight: "900", fontSize: 11 },
  title: { color: Colors.text, fontSize: 29, fontWeight: "800" },
  copy: {
    color: Colors.muted,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 300,
    marginTop: 14,
  },
  drop: {
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    marginTop: 42,
    backgroundColor: Colors.panel,
  },
  dropTitle: { color: Colors.text, fontWeight: "800", fontSize: 16 },
  hint: { color: Colors.muted, fontSize: 12, marginTop: 8 },
  selected: {
    width: "100%",
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: Colors.cyan,
    borderRadius: 18,
    padding: 20,
    marginTop: 42,
  },
  selectedTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  audioBadge: {
    backgroundColor: Colors.panelRaised,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  audioBadgeText: {
    color: Colors.cyan,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  remove: { color: Colors.red, fontSize: 12, fontWeight: "700" },
  fileName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 20,
  },
  preview: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 18,
  },
  previewText: { color: Colors.text, fontWeight: "700", fontSize: 13 },
  analyze: {
    backgroundColor: Colors.blue,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 13,
    marginTop: 10,
  },
  analyzeText: { color: Colors.ink, fontWeight: "800", fontSize: 13 },
});
