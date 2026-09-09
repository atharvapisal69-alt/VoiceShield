import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AnimatedVoiceShieldLogo } from "@/components/AnimatedVoiceShieldLogo";
import { Icon, type IconName } from "@/components/Icon";
import { Button, Screen } from "@/components/shared";
import { Colors, Radius, Spacing } from "@/constants/colors";

export default function GettingStartedScreen() {
  return (
    <Screen style={styles.screen}>
      <View style={styles.brand}>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>AI VOICE SECURITY</Text>
        </View>
        <AnimatedVoiceShieldLogo size={250} autoPlay loop showWordmark />
        <Text style={styles.brandCopy}>
          Intelligent protection for every conversation.
        </Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.kicker}>WELCOME TO VOICESHIELD</Text>
        <Text style={styles.title}>Know the voice before you trust it.</Text>
        <Text style={styles.copy}>
          Detect synthetic voice patterns, review suspicious calls, and keep
          your security history private on your device.
        </Text>
        <View style={styles.featureRow}>
          <Feature icon="waveSquare" label="Voice AI" detail="Smarter checks" />
          <Feature icon="shieldHalved" label="Private" detail="Your data" />
          <Feature icon="bolt" label="Real-time" detail="Live signals" />
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label="Get Started"
          icon="arrowRight"
          onPress={() => router.push("/register" as never)}
        />
        <Button
          label="I already have an account"
          variant="secondary"
          onPress={() => router.push("/login" as never)}
        />
        <Button
          label="Continue as guest"
          variant="ghost"
          compact
          onPress={() => router.replace("/home" as never)}
        />
      </View>
    </Screen>
  );
}

function Feature({
  icon,
  label,
  detail,
}: {
  icon: IconName;
  label: string;
  detail: string;
}) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>
        <Icon name={icon} size={13} color={Colors.cyan} />
      </View>
      <View>
        <Text style={styles.featureLabel}>{label}</Text>
        <Text style={styles.featureDetail}>{detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  brand: { alignItems: "center", paddingTop: Spacing.sm },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: `${Colors.cyan}45`,
    backgroundColor: `${Colors.cyan}0D`,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.cyan,
  },
  statusText: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  brandCopy: { color: Colors.textMuted, fontSize: 12, marginTop: 0 },
  hero: {
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.lg,
  },
  kicker: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  title: {
    color: Colors.text,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "900",
    textAlign: "center",
  },
  copy: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: Spacing.sm,
    maxWidth: 340,
  },
  featureRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: `${Colors.card}B8`,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flex: 1,
    minWidth: 0,
  },
  featureIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${Colors.cyan}14`,
    borderWidth: 1,
    borderColor: `${Colors.cyan}45`,
  },
  featureLabel: { color: Colors.text, fontSize: 10, fontWeight: "900" },
  featureDetail: { color: Colors.textMuted, fontSize: 8, marginTop: 2 },
  actions: { gap: Spacing.sm, marginTop: Spacing.xl },
});
