import { Screen } from "@/components/screen";
import { Colors } from "@/constants/theme";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
export default function Upload() {
  const pick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["audio/wav", "audio/mpeg", "audio/mp4", "audio/x-m4a"],
      copyToCacheDirectory: true,
    });
    if (!result.canceled) {
      const file = result.assets[0];
      router.push({
        pathname: "/analyzing",
        params: {
          uri: file.uri,
          name: file.name,
          mimeType: file.mimeType ?? "",
        },
      } as never);
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
        <Pressable style={styles.drop} onPress={pick}>
          <Text style={styles.dropTitle}>Browse files</Text>
          <Text style={styles.hint}>WAV, MP3, or M4A up to 25 MB</Text>
        </Pressable>
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
});
