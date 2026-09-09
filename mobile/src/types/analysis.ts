export type RiskLabel = "LOW RISK" | "MEDIUM RISK" | "HIGH RISK";

export type RiskLevel = RiskLabel;

export type AnalysisSource = "recording" | "upload";

/** A local audio file/recording ready for analysis. */
export interface AudioFile {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
  duration?: number;
}

/** Domain model for a completed voice analysis. Scores are 0–100. */
export interface AnalysisResult {
  source: AnalysisSource;
  fileName: string;
  label: RiskLevel;
  riskScore: number;
  confidence: number;
  fakeProbability: number;
  realProbability: number;
  explanation: string;
  duration?: number;
}

/** A voice analysis persisted to the local history. */
export interface AnalysisHistoryItem extends AnalysisResult {
  id: string;
  kind: "analysis";
  createdAt: string; // ISO 8601
}

/**
 * Raw response shape emitted by the backend `POST /api/v1/analyze`.
 * The frontend maps this into the domain model.
 */
export interface ApiAnalyzeResponse {
  success?: boolean;
  id?: string;
  label: string;
  risk_score: number;
  confidence: number;
  fake_probability?: number;
  real_probability?: number;
  explanation: string;
}

/**
 * Raw response shape emitted by the backend `POST /api/v1/call/analyze`.
 */
export interface ApiCallAnalyzeResponse {
  success?: boolean;
  call_id?: string;
  result?: {
    label: string;
    risk_score: number;
    confidence: number;
    fake_probability?: number;
    real_probability?: number;
    explanation: string;
  };
}
