import { useState } from "react";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

import { AudioPlayer } from "@/components/AudioPlayer";
import { AudioUploadCard } from "@/components/AudioUploadCard";
import { Header } from "@/components/Header";
import { BackButton, Button, Card, Screen, formatBytes, formatDuration } from "@/components/shared";
import { Colors, Spacing } from "@/constants/colors";
import { pickAudioFile } from "@/services/audioPicker";
import type { AudioFile } from "@/types/analysis";

export default function UploadScreen() {
  const [file, setFile] = useState<AudioFile | null>(null);
  const player = useAudioPlayer(file ? file.uri : null, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);

  const choose = async () => {
    const picked = await pickAudioFile();
    if (picked) setFile(picked);
  };

  const analyze = () => {
    if (!file) return;
    router.push({
      pathname: "/analyze",
      params: {
        uri: file.uri,
        name: file.name,
        mimeType: file.mimeType ?? "",
        source: "upload",
        size: String(file.size ?? ""),
        duration: String(
          status.duration && isFinite(status.duration)
            ? Math.round(status.duration)
            : "",
        ),
      },
    } as never);
  };

  return (
    <Screen>
      <BackButton />
      <Header
        title="Upload Audio"
        subtitle="Analyze an existing audio recording for synthetic voice patterns."
      />

      {!file ? (
        <AudioUploadCard onChoose={() => void choose()} />
      ) : (
        <Card style={styles.selected}>
          <View style={styles.fileIcon}>
            <Text style={styles.fileEmoji}>🎵</Text>
          </View>
          <Text style={styles.fileName} numberOfLines={1}>
            {file.name}
          </Text>

          <View style={styles.metaRow}>
            <Meta
              label="Duration"
              value={
                status.duration && isFinite(status.duration)
                  ? formatDuration(status.duration)
                  : "—"
              }
            />
            <Meta label="File Size" value={formatBytes(file.size)} />
          </View>

          <AudioPlayer uri={file.uri} />

          <Button
            label="Delete"
            variant="secondary"
            icon="🗑"
            onPress={() => setFile(null)}
            style={styles.stretchButton}
          />
          <Button
            label="Analyze Audio"
            icon="🛡️"
            onPress={analyze}
            style={styles.stretchButton}
          />
        </Card>
      )}
    </Screen>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  selected: { marginTop: Spacing.lg },
  fileIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: `${Colors.primary}22`,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  fileEmoji: { fontSize: 26 },
  fileName: { color: Colors.text, fontSize: 17, fontWeight: "900", marginTop: Spacing.sm },
  metaRow: { flexDirection: "row", gap: Spacing.md, marginTop: Spacing.sm },
  metaLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: "700" },
  metaValue: { color: Colors.text, fontSize: 14, fontWeight: "800", marginTop: 3 },
  stretchButton: { alignSelf: "stretch", marginTop: Spacing.sm },
});