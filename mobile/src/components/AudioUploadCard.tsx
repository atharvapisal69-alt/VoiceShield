import { StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/Icon";
import { Button } from "@/components/shared";
import { Colors, Radius, Spacing } from "@/constants/colors";
import { SUPPORTED_FORMATS } from "@/constants/config";

/**
 * Upload-audio entry card shown when no file has been selected.
 */
export function AudioUploadCard({
  onChoose,
  formats = SUPPORTED_FORMATS,
}: {
  onChoose: () => void;
  formats?: string[];
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <Icon name="folderOpen" size={34} color={Colors.primary} />
      </View>
      <Text style={styles.title}>Upload Audio</Text>
      <Text style={styles.copy}>
        Select an audio recording for VoiceShield analysis.
      </Text>
      <Button
        label="Choose Audio"
        icon="folderOpen"
        onPress={onChoose}
        style={styles.button}
      />
      <Text style={styles.formats}>{formats.join("  •  ")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    marginTop: Spacing.lg,
  },
  icon: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: Colors.cardRaised,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  iconEmoji: { fontSize: 34 },
  title: { color: Colors.text, fontSize: 21, fontWeight: "900" },
  copy: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 280,
  },
  button: { alignSelf: "stretch", marginTop: Spacing.lg },
  formats: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: Spacing.md,
  },
});
