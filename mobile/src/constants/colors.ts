import type { RiskLevel } from "@/types/analysis";

/**
 * VoiceShield design system — premium AI cybersecurity palette.
 */
export const Colors = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primaryGlow: "rgba(37, 99, 235, 0.35)",

  dark: "#0F172A",
  card: "#1E293B",
  cardRaised: "#27354A",
  border: "#334155",
  borderSoft: "rgba(148, 163, 184, 0.16)",

  surface: "#F8FAFC",
  text: "#F1F5F9",
  textMuted: "#94A3B8",

  lowRisk: "#22C55E",
  mediumRisk: "#F59E0B",
  highRisk: "#EF4444",

  success: "#22C55E",
  accent: "#38BDF8",
  white: "#FFFFFF",
  black: "#020617",
  overlay: "rgba(2, 6, 23, 0.72)",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  pill: 999,
} as const;

/** Converts an arbitrary label string into a normalized risk level. */
export function toRiskLevel(label: string | null | undefined): RiskLevel {
  const value = (label ?? "").toUpperCase();
  if (value.includes("HIGH")) return "HIGH RISK";
  if (value.includes("MEDIUM") || value.includes("MODERATE"))
    return "MEDIUM RISK";
  return "LOW RISK";
}

/** Maps a 0–100 score to a risk level using VoiceShield thresholds. */
export function riskLevelForScore(score: number): RiskLevel {
  if (score >= 80) return "HIGH RISK";
  if (score >= 50) return "MEDIUM RISK";
  return "LOW RISK";
}

/** Returns the theme color for a score or risk level. */
export function riskColor(score: number | RiskLevel): string {
  const level =
    typeof score === "string" ? score : riskLevelForScore(score);
  if (level === "HIGH RISK") return Colors.highRisk;
  if (level === "MEDIUM RISK") return Colors.mediumRisk;
  return Colors.lowRisk;
}

/** Short label without the RISK suffix. */
export function riskShortName(level: RiskLevel): string {
  return level.replace(" RISK", "");
}