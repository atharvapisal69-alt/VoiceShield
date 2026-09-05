import { riskLevelForScore } from "@/constants/colors";
import type { CallRiskPoint } from "@/types/call";

/**
 * Mock call-protection engine.
 *
 * Real cellular call audio is restricted by mobile operating systems, so the
 * product demo simulates the same risk progression a real model would emit.
 * The simulated curve is the one used by the hackathon demo:
 *   18% → 44% → 63% → 82% → 91% over a ~4 minute call.
 */

export const CALL_TIME_SCALE = 10; // demo seconds per real second

/** Risk milestones in call-seconds. */
export const MOCK_RISK_CURVE: { time: number; score: number }[] = [
  { time: 35, score: 18 },
  { time: 70, score: 44 },
  { time: 110, score: 63 },
  { time: 150, score: 82 },
  { time: 200, score: 91 },
];

/** Risk score at a given point within the simulated call. */
export function scoreAtCallTime(callSeconds: number): number {
  let score = 8;
  for (const point of MOCK_RISK_CURVE) {
    if (callSeconds >= point.time) score = point.score;
    else break;
  }
  return score;
}

export function levelAtScore(score: number) {
  return riskLevelForScore(score);
}

export function confidenceForScore(score: number): number {
  return Math.min(97, 88 + Math.round(score / 10));
}

export function explanationForLevel(
  level: "LOW RISK" | "MEDIUM RISK" | "HIGH RISK",
): string {
  if (level === "HIGH RISK")
    return "The analyzed voice contains characteristics that may be associated with synthetic or manipulated speech.";
  if (level === "MEDIUM RISK")
    return "The voice showed intermittent characteristics consistent with synthetic processing. We recommend caution.";
  return "The analyzed voice showed characteristics consistent with genuine human speech.";
}

export function generateCallId(): string {
  return `call_${Date.now().toString(36)}${Math.floor(Math.random() * 36).toString(36)}`;
}

export function isHighRiskScore(score: number): boolean {
  return score >= 80;
}

export function buildTimelinePoint(callSeconds: number): CallRiskPoint {
  const score = scoreAtCallTime(callSeconds);
  return {
    time: callSeconds,
    score,
    level: levelAtScore(score),
  };
}