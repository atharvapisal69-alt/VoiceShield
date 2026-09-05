import type { AnalysisHistoryItem, RiskLevel } from "./analysis";

/** A single risk measurement taken during a call. */
export interface CallRiskPoint {
  /** Call-relative timestamp in seconds. */
  time: number;
  score: number;
  level: RiskLevel;
}

/** A completed (or reported) call security report persisted to history. */
export interface CallReport {
  id: string;
  kind: "call";
  createdAt: string; // ISO 8601
  /** Call duration in call-seconds. */
  duration: number;
  riskScore: number;
  confidence: number;
  fakeProbability: number;
  realProbability: number;
  explanation: string;
  timeline: CallRiskPoint[];
  /** True when the user manually submitted a report for this call. */
  reported?: boolean;
  reportCategory?: string;
  reportNotes?: string;
}

/** Any entry in the unified local history. */
export type HistoryItem = AnalysisHistoryItem | CallReport;

/** Live state for the active (demo) call. */
export interface ActiveCall {
  id: string;
  startedAt: number;
  points: CallRiskPoint[];
  currentRisk: { score: number; level: RiskLevel } | null;
  warningShown: boolean;
}

export type ReportCategory =
  | "Suspected AI-generated voice"
  | "Scam attempt"
  | "Impersonation"
  | "Suspicious request"
  | "Other";

export const REPORT_CATEGORIES: ReportCategory[] = [
  "Suspected AI-generated voice",
  "Scam attempt",
  "Impersonation",
  "Suspicious request",
  "Other",
];