import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
    Easing,
    cancelAnimation,
    runOnJS,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import Svg, {
    Circle,
    Defs,
    G,
    LinearGradient,
    Path,
    Stop,
} from "react-native-svg";

import { Colors } from "@/constants/colors";

const AnimatedView = Animated.View;
const AnimatedG = Animated.createAnimatedComponent(G);
const WAVEFORM = [0.26, 0.42, 0.68, 0.86, 0.5, 1, 0.62, 0.9, 0.48, 0.3];

export interface AnimatedVoiceShieldLogoProps {
  size?: number;
  autoPlay?: boolean;
  loop?: boolean;
  showWordmark?: boolean;
  onAnimationComplete?: () => void;
}

export function AnimatedVoiceShieldLogo({
  size = 260,
  autoPlay = true,
  loop = false,
  showWordmark = true,
  onAnimationComplete,
}: AnimatedVoiceShieldLogoProps) {
  const iconProgress = useSharedValue(autoPlay ? 0 : 1);
  const aiProgress = useSharedValue(autoPlay ? 0 : 1);
  const wordProgress = useSharedValue(autoPlay ? 0 : 1);
  const orbit = useSharedValue(0);

  useEffect(() => {
    if (!autoPlay) return;

    iconProgress.value = withTiming(1, {
      duration: 720,
      easing: Easing.out(Easing.cubic),
    });
    aiProgress.value = withDelay(
      980,
      withSequence(
        withTiming(1.12, { duration: 220, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 260, easing: Easing.inOut(Easing.quad) }),
      ),
    );
    wordProgress.value = withDelay(
      1780,
      withTiming(
        1,
        { duration: 720, easing: Easing.out(Easing.cubic) },
        (finished) => {
          if (finished && onAnimationComplete && !loop) {
            runOnJS(onAnimationComplete)();
          }
        },
      ),
    );
    orbit.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.linear }),
      loop ? -1 : 1,
      false,
      (finished) => {
        if (finished && loop && onAnimationComplete) {
          runOnJS(onAnimationComplete)();
        }
      },
    );

    return () => {
      cancelAnimation(iconProgress);
      cancelAnimation(aiProgress);
      cancelAnimation(wordProgress);
      cancelAnimation(orbit);
    };
  }, [
    aiProgress,
    autoPlay,
    iconProgress,
    loop,
    onAnimationComplete,
    orbit,
    wordProgress,
  ]);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconProgress.value,
    transform: [{ scale: 0.75 + iconProgress.value * 0.25 }],
  }));
  const orbitStyle = useAnimatedStyle(() => ({
    opacity: 0.25 + iconProgress.value * 0.75,
    transform: [{ rotate: `${orbit.value * 360}deg` }],
  }));
  const aiStyle = useAnimatedStyle(() => ({
    opacity: aiProgress.value,
    transform: [{ scale: aiProgress.value }],
  }));
  const wordStyle = useAnimatedStyle(() => ({
    opacity: wordProgress.value,
    transform: [{ translateY: 12 - wordProgress.value * 12 }],
  }));
  const shieldProps = useAnimatedProps(() => ({ opacity: iconProgress.value }));
  const iconSize = showWordmark ? size * 0.68 : size;
  const stroke = Math.max(2.5, size * 0.014);
  const badgeWidth = Math.max(22, size * 0.146);
  const badgeHeight = Math.max(18, size * 0.108);

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="VoiceShield AI animated logo"
      style={[
        styles.root,
        { width: size, minHeight: showWordmark ? size * 1.2 : size },
      ]}
    >
      <AnimatedView
        style={[
          styles.iconStage,
          { width: iconSize, height: iconSize },
          iconStyle,
        ]}
      >
        <AnimatedView
          style={[
            styles.orbit,
            { width: iconSize, height: iconSize },
            orbitStyle,
          ]}
        >
          <Svg width={iconSize} height={iconSize} viewBox="0 0 200 200">
            <Defs>
              <LinearGradient id="orbitGradient" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={Colors.cyan} stopOpacity="0.9" />
                <Stop
                  offset="0.55"
                  stopColor={Colors.primary}
                  stopOpacity="0.8"
                />
                <Stop offset="1" stopColor={Colors.indigo} stopOpacity="0.2" />
              </LinearGradient>
            </Defs>
            <Circle
              cx="100"
              cy="100"
              r="91"
              fill="none"
              stroke="url(#orbitGradient)"
              strokeWidth={stroke}
              strokeDasharray="82 210"
              strokeLinecap="round"
            />
          </Svg>
        </AnimatedView>

        <Svg width={iconSize} height={iconSize} viewBox="0 0 200 200">
          <Defs>
            <LinearGradient id="shieldGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={Colors.cyan} />
              <Stop offset="0.5" stopColor={Colors.primary} />
              <Stop offset="1" stopColor={Colors.indigo} />
            </LinearGradient>
          </Defs>
          <AnimatedG animatedProps={shieldProps}>
            <Path
              d="M100 12 L168 39 V91 C168 137 139 168 100 187 C61 168 32 137 32 91 V39 Z"
              fill={`${Colors.card}F2`}
              stroke="url(#shieldGradient)"
              strokeWidth={stroke * 2.4}
              strokeLinejoin="round"
            />
            <Path
              d="M100 28 L151 48 V91 C151 126 130 150 100 166 C70 150 49 126 49 91 V48 Z"
              fill="none"
              stroke={`${Colors.cyan}99`}
              strokeWidth={stroke * 0.8}
            />
            <Path
              d="M76 126 C61 115 58 95 66 78 C73 63 88 54 103 52 C94 63 92 76 98 87 C105 101 102 119 89 129 C85 132 80 131 76 126 Z"
              fill={`${Colors.primary}35`}
              stroke={Colors.cyan}
              strokeWidth={stroke}
              strokeLinejoin="round"
            />
          </AnimatedG>
        </Svg>

        <View style={styles.waveform} pointerEvents="none">
          {WAVEFORM.map((height, index) => (
            <WaveBar
              key={index}
              height={height}
              index={index}
              active={iconProgress}
            />
          ))}
        </View>
        <AnimatedView
          style={[
            styles.aiBadge,
            {
              width: badgeWidth,
              height: badgeHeight,
              borderRadius: badgeHeight * 0.3,
            },
            aiStyle,
          ]}
        >
          <Text
            style={[styles.aiText, { fontSize: Math.max(11, size * 0.062) }]}
          >
            AI
          </Text>
        </AnimatedView>
      </AnimatedView>

      {showWordmark ? (
        <AnimatedView
          style={[styles.wordmark, { marginTop: size * 0.045 }, wordStyle]}
        >
          <Text style={[styles.wordVoice, { fontSize: size * 0.115 }]}>
            Voice
          </Text>
          <Text style={[styles.wordShield, { fontSize: size * 0.115 }]}>
            Shield
          </Text>
          <View
            style={[
              styles.wordAiBadge,
              { height: size * 0.13, paddingHorizontal: size * 0.025 },
            ]}
          >
            <Text style={[styles.wordAi, { fontSize: size * 0.06 }]}>AI</Text>
          </View>
        </AnimatedView>
      ) : null}
    </View>
  );
}

function WaveBar({
  height,
  index,
  active,
}: {
  height: number;
  index: number;
  active: SharedValue<number>;
}) {
  const bar = useSharedValue(0);

  useEffect(() => {
    bar.value = withDelay(
      420 + index * 48,
      withRepeat(
        withSequence(
          withTiming(1, {
            duration: 420 + index * 18,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(0, {
            duration: 420 + index * 18,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        false,
      ),
    );
    return () => cancelAnimation(bar);
  }, [bar, index]);

  const style = useAnimatedStyle(() => ({
    height: 8 + height * 30 * (0.72 + bar.value * 0.28) * active.value,
    opacity: 0.3 + active.value * 0.7,
  }));

  return <AnimatedView style={[styles.waveBar, style]} />;
}

const styles = StyleSheet.create({
  root: { alignItems: "center", justifyContent: "center" },
  iconStage: { alignItems: "center", justifyContent: "center" },
  orbit: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  waveform: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  waveBar: {
    width: 2.5,
    minHeight: 7,
    borderRadius: 4,
    backgroundColor: Colors.cyan,
    shadowColor: Colors.cyan,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  aiBadge: {
    position: "absolute",
    right: "8%",
    top: "16%",
    borderWidth: 1,
    borderColor: Colors.cyan,
    backgroundColor: Colors.dark,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.cyan,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  aiText: {
    color: Colors.cyan,
    fontWeight: "900",
    letterSpacing: 1,
  },
  wordmark: { flexDirection: "row", alignItems: "center" },
  wordVoice: { color: Colors.white, fontWeight: "700" },
  wordShield: { color: Colors.cyan, fontWeight: "900" },
  wordAiBadge: {
    marginLeft: 7,
    borderWidth: 1,
    borderColor: Colors.cyan,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  wordAi: { color: Colors.cyan, fontWeight: "900", letterSpacing: 0.5 },
});
