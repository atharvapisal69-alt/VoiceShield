import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/button";
import { Screen } from "@/components/screen";
import { Colors } from "@/constants/theme";

export default function HomeScreen() {
  const [pulse] = useState(() => new Animated.Value(1));
  const [scan] = useState(() => new Animated.Value(-1));

  useEffect(() => {
    const breathing = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
    );
    const scanning = Animated.loop(
      Animated.timing(scan, {
        toValue: 1,
        duration: 2600,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: Platform.OS !== "web",
      }),
    );
    breathing.start();
    scanning.start();
    return () => {
      breathing.stop();
      scanning.stop();
    };
  }, [pulse, scan]);

  return (
    <Screen>
      <View style={styles.top}>
        <BrandMark />
        <Text style={styles.status}>SECURE AUDIO ANALYSIS</Text>
      </View>
      <View style={styles.hero}>
        <View style={styles.orbitStage}>
          <Animated.View
            style={[
              styles.orbitGlow,
              {
                transform: [{ scale: pulse }],
                opacity: pulse.interpolate({
                  inputRange: [1, 1.08],
                  outputRange: [0.45, 0.8],
                }),
              },
            ]}
          />
          <View style={styles.orbit}>
            <Animated.View
              style={[
                styles.scanBeam,
                {
                  transform: [
                    {
                      translateY: scan.interpolate({
                        inputRange: [-1, 1],
                        outputRange: [-65, 65],
                      }),
                    },
                  ],
                },
              ]}
            />
            <View style={styles.orbitCore}>
              <View style={styles.lock}>
                <View style={styles.lockShackle} />
                <View style={styles.lockBody}>
                  <View style={styles.lockKeyhole} />
                </View>
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.kicker}>WELCOME TO VOICESHIELD</Text>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Hear the signal.</Text>
          <Text style={[styles.title, styles.titleAccent]}>
            Trust the voice.
          </Text>
        </View>
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
  orbitStage: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  orbit: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  orbitGlow: {
    position: "absolute",
    width: 188,
    height: 188,
    borderRadius: 94,
    borderWidth: 8,
    borderColor: Colors.blue,
    shadowColor: Colors.cyan,
    shadowOpacity: 0.8,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  scanBeam: {
    position: "absolute",
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: Colors.cyan,
    opacity: 0.55,
    shadowColor: Colors.cyan,
    shadowOpacity: 1,
    shadowRadius: 8,
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
  titleBlock: { alignItems: "center", gap: 0 },
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
