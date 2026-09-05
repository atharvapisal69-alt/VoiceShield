import { useEffect, useState } from "react";
import { Animated, Easing, Platform, StyleSheet, Text, View } from "react-native";

import { Colors, Radius, Spacing } from "@/constants/colors";

const MESSAGES = [
  "Uploading audio securely…",
  "Comparing vocal patterns against synthetic signatures…",
  "Measuring acoustic artifacts…",
  "Calculating risk score…",
];

const BAR_PATTERN = [0.55, 1, 0.72, 0.92, 0.5, 0.84, 0.62, 1];

/**
 * AI analysis loading state with an animated waveform and rotating status.
 */
export function AnalysisLoading({
  fileName,
  isMock = false,
}: {
  fileName?: string;
  isMock?: boolean;
}) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [wave] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const interval = setInterval(
      () => setMessageIndex((i) => (i + 1) % MESSAGES.length),
      1800,
    );

    const pulse = Animated.loop(
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
    pulse.start();
    return () => {
      clearInterval(interval);
      pulse.stop();
    };
  }, [wave]);

  return (
    <View style={styles.wrap}>
      {isMock ? (
        <View style={styles.mockPill}>
          <Text style={styles.mockText}>DEMO MODE</Text>
        </View>
      ) : null}

      <View style={styles.waveRow}>
        {BAR_PATTERN.map((height, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              { height: 26 + height * 34, backgroundColor: Colors.primary },
              {
                transform: [
                  {
                    scaleY: wave.interpolate({
                      inputRange: [0, 1],
                      outputRange:
                        index % 2 === 0 ? [0.6, 1] : [1, 0.6],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      <Text style={styles.title}>Analyzing your voice</Text>
      {fileName ? (
        <Text style={styles.fileName} numberOfLines={1}>
          {fileName}
        </Text>
      ) : null}
      <Text style={styles.message}>{MESSAGES[messageIndex]}</Text>
      <Text style={styles.privacy}>
        Analysis metadata stays private on this device.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", paddingVertical: Spacing.xl },
  mockPill: {
    backgroundColor: `${Colors.mediumRisk}1A`,
    borderColor: `${Colors.mediumRisk}4D`,
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: Spacing.lg,
  },
  mockText: {
    color: Colors.mediumRisk,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  waveRow: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginVertical: Spacing.lg,
  },
  bar: { width: 7, borderRadius: 4 },
  title: { color: Colors.text, fontSize: 22, fontWeight: "900" },
  fileName: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 6,
    maxWidth: 280,
  },
  message: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
    marginTop: Spacing.md,
    textAlign: "center",
  },
  privacy: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: Spacing.md,
    textAlign: "center",
  },
});