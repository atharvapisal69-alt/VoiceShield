import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/button";
import { Screen } from "@/components/screen";
import { Colors } from "@/constants/theme";

export default function HomeScreen() {
  return (
    <Screen scroll={false}>
      <View style={styles.top}>
        <BrandMark />
        <Text style={styles.status}>SECURE AUDIO ANALYSIS</Text>
      </View>
      <View style={styles.hero}>
        <View style={styles.orbit}>
          <View style={styles.orbitCore}>
            <Text style={styles.wave}>~~~</Text>
          </View>
        </View>
        <Text style={styles.kicker}>WELCOME TO VOICESHIELD</Text>
        <Text style={styles.title}>
          Hear the signal.{"\n"}
          <Text style={styles.titleAccent}>Trust the voice.</Text>
        </Text>
        <Text style={styles.copy}>
          Detect AI-generated and manipulated voices before they deceive you.
        </Text>
      </View>
      <Button
        label="Get started"
        onPress={() => router.replace("/home" as never)}
      />
      <Text style={styles.footer}>PRIVATE BY DESIGN / BUILT FOR CLARITY</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
  },
  status: {
    color: Colors.muted,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  hero: { flex: 1, justifyContent: "center", alignItems: "center" },
  orbit: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 42,
  },
  orbitCore: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: Colors.panelRaised,
    borderWidth: 1,
    borderColor: Colors.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  wave: {
    color: Colors.cyan,
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: 4,
  },
  kicker: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 14,
  },
  title: {
    color: Colors.text,
    textAlign: "center",
    fontSize: 38,
    lineHeight: 43,
    fontWeight: "800",
  },
  titleAccent: { color: Colors.blue },
  copy: {
    color: Colors.muted,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 310,
    marginTop: 20,
  },
  footer: {
    color: Colors.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
    textAlign: "center",
    marginTop: 18,
    marginBottom: 6,
  },
});
