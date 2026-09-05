import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";

import { AnimatedVoiceShieldLogo } from "@/components/AnimatedVoiceShieldLogo";
import { Screen } from "@/components/shared";
import { Colors } from "@/constants/colors";

export default function Index() {
  const [completed, setCompleted] = useState(false);

  return (
    <Screen scroll={false} style={styles.screen}>
      <AnimatedVoiceShieldLogo
        size={Math.min(320, 86 * 3.75)}
        autoPlay
        showWordmark
        onAnimationComplete={() => {
          if (completed) return;
          setCompleted(true);
          router.replace("/getting-started" as never);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark,
  },
});
