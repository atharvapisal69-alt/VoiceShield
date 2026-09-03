import { BrandMark } from "@/components/brand-mark";
import { Screen } from "@/components/screen";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
export default function Profile() {
  return (
    <Screen>
      <Text style={styles.back} onPress={() => router.back()}>
        Back
      </Text>
      <BrandMark />
      <Text style={styles.title}>Your audio safety layer.</Text>
      <Text style={styles.copy}>
        VoiceShield helps you pause and verify when a voice does not sound quite
        right. Analysis is powered by an anti-deepfake model and a
        human-readable risk engine.
      </Text>
      <View style={styles.row}>
        <Text style={styles.key}>MODEL</Text>
        <Text style={styles.value}>Wav2Vec2 anti-deepfake</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.key}>PRIVACY</Text>
        <Text style={styles.value}>Files are sent only for analysis</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.key}>VERSION</Text>
        <Text style={styles.value}>0.1.0 / HACKATHON BUILD</Text>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  back: { color: Colors.muted, marginTop: 12, marginBottom: 42 },
  title: {
    color: Colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    marginTop: 55,
  },
  copy: {
    color: Colors.muted,
    lineHeight: 23,
    fontSize: 15,
    marginTop: 16,
    marginBottom: 36,
  },
  row: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 19,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 18,
  },
  key: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  value: { color: Colors.text, fontSize: 12, textAlign: "right", flex: 1 },
});
