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
            <View style={styles.lock}>
              <View style={styles.lockShackle} />
              <View style={styles.lockBody}>
                <View style={styles.lockKeyhole} />
              </View>
            </View>
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
        onPress={() => router.replace("/login" as never)}
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
  lock: {
    width: 42,
    height: 48,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  lockShackle: {
    width: 25,
    height: 24,
    borderWidth: 5,
    borderColor: Colors.cyan,
    borderBottomWidth: 0,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  lockBody: {
    width: 42,
    height: 29,
    borderRadius: 7,
    backgroundColor: Colors.cyan,
    alignItems: "center",
    justifyContent: "center",
  },
  lockKeyhole: {
    width: 7,
    height: 11,
    borderRadius: 4,
    backgroundColor: Colors.ink,
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
