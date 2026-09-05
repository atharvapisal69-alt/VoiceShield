import { router } from "expo-router";
import type { ReactNode } from "react";
import { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    type StyleProp,
    type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimatedVoiceShieldLogo } from "@/components/AnimatedVoiceShieldLogo";
import { Icon, type IconName } from "@/components/Icon";
import { Colors, Radius, Spacing, riskColor } from "@/constants/colors";
import type { RiskLevel } from "@/types/analysis";

export { riskColor }; // re-exported for convenience

/* ------------------------------------------------------------------ */
/* Screen scaffold                                                     */
/* ------------------------------------------------------------------ */

export function Screen({
  children,
  scroll = true,
  style,
}: {
  children: ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const content = <View style={[styles.content, style]}>{children}</View>;
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

export function Card({
  children,
  style,
  padded = true,
  accent,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  accent?: string;
}) {
  return (
    <View
      style={[
        styles.card,
        padded && styles.cardPadded,
        accent ? { borderColor: accent } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Section header                                                      */
/* ------------------------------------------------------------------ */

export function SectionHeader({
  eyebrow,
  title,
  right,
}: {
  eyebrow?: string;
  title: string;
  right?: ReactNode;
}) {
  return (
    <View style={styles.sectionRow}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "success";

const BUTTON_COLORS: Record<
  ButtonVariant,
  { bg: string; label: string; border?: string }
> = {
  primary: { bg: Colors.primary, label: Colors.white },
  secondary: {
    bg: Colors.cardRaised,
    label: Colors.text,
    border: Colors.border,
  },
  danger: { bg: Colors.highRisk, label: Colors.white },
  ghost: { bg: "transparent", label: Colors.textMuted },
  success: { bg: Colors.success, label: Colors.dark },
};

export function Button({
  label,
  onPress,
  variant = "primary",
  icon,
  disabled,
  style,
  compact,
}: {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  const palette = BUTTON_COLORS[variant];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      style={[
        styles.button,
        compact && styles.buttonCompact,
        { backgroundColor: palette.bg },
        palette.border ? { borderWidth: 1, borderColor: palette.border } : null,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={15} color={palette.label} /> : null}
      <Text style={[styles.buttonLabel, { color: palette.label }]}>
        {label}
      </Text>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* Risk badge                                                          */
/* ------------------------------------------------------------------ */

export function RiskBadge({
  level,
  score,
}: {
  level: RiskLevel;
  score?: number;
}) {
  const color = riskColor(level);
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: `${color}1A`, borderColor: `${color}4D` },
      ]}
    >
      <View style={[styles.badgeDot, { backgroundColor: color }]} />
      <Text style={[styles.badgeText, { color }]}>
        {score != null ? `${level} · ${score}%` : level}
      </Text>
    </View>
  );
}
/* ------------------------------------------------------------------ */
/* Brand / back controls                                               */
/* ------------------------------------------------------------------ */

export function ShieldMark({ size = 46 }: { size?: number }) {
  return (
    <AnimatedVoiceShieldLogo size={size * 1.25} autoPlay showWordmark={false} />
  );
}

export function BackButton({ label = "Back" }: { label?: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        router.canGoBack() ? router.back() : router.replace("/home" as never)
      }
      style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.6 }]}
    >
      <Icon name="arrowLeft" size={16} color={Colors.textMuted} />
      <Text style={styles.backLabel}>{label}</Text>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                  */
/* ------------------------------------------------------------------ */

export function formatDuration(totalSeconds?: number): string {
  const s = Math.max(0, Math.floor(totalSeconds ?? 0));
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatDateTime(iso?: string): string {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return "—";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark },
  scroll: { flexGrow: 1 },
  content: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardPadded: { padding: Spacing.lg },
  sectionRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  eyebrow: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.6,
    marginBottom: 4,
  },
  sectionTitle: { color: Colors.text, fontSize: 22, fontWeight: "800" },
  button: {
    minHeight: 52,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  buttonCompact: { minHeight: 44, paddingHorizontal: Spacing.md },
  buttonPressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
  buttonDisabled: { opacity: 0.5 },
  buttonIcon: { fontSize: 16, marginRight: 8 },
  buttonLabel: { fontSize: 15, fontWeight: "800" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    borderWidth: 1,
    gap: 6,
  },
  badgeDot: { width: 8, height: 8, borderRadius: 4 },
  badgeText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6 },
  shield: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingRight: 12,
    gap: 4,
  },
  backChevron: { color: Colors.textMuted, fontSize: 24, lineHeight: 22 },
  backLabel: { color: Colors.textMuted, fontSize: 14, fontWeight: "700" },
});
