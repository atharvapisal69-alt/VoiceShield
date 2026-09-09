import { useEffect, useState } from "react";
import {
    Animated,
    Easing,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

import { Icon } from "@/components/Icon";
import { Colors, riskColor, riskLevelForScore } from "@/constants/colors";

/**
 * Circular risk meter — the signature VoiceShield visualization.
 * The arc and center value are colored by risk level.
 */
export function RiskMeter({
  score,
  size = 216,
  showLabel = true,
}: {
  score: number;
  size?: number;
  showLabel?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, score));
  const level = riskLevelForScore(clamped);
  const color = riskColor(level);

  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  const [pulse] = useState(() => new Animated.Value(0));
  useEffect(() => {
    pulse.setValue(0);
    Animated.timing(pulse, {
      toValue: 1,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [clamped, pulse]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.border}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Animated.View
        style={[styles.center, { transform: [{ scale }] }]}
        pointerEvents="none"
      >
        <Icon name="shieldHalved" size={26} color={color} />
        <Text style={[styles.score, { color }]}>{clamped.toFixed(1)}%</Text>
        <Text style={[styles.label, { color }]}>{showLabel ? level : " "}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  center: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  shield: { fontSize: 26, marginBottom: 4 },
  score: { fontSize: 40, fontWeight: "900", fontVariant: ["tabular-nums"] },
  label: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.4,
    marginTop: 4,
  },
});
