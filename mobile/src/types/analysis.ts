export type RiskLabel = "LOW RISK" | "MEDIUM RISK" | "HIGH RISK";

export type AnalysisResult = {
  label: RiskLabel;
  risk_score: number;
  confidence: number;
  explanation: string;
};

export type AnalysisHistoryItem = AnalysisResult & {
  id: string;
  fileName: string;
  createdAt: string;
};

export type AudioFile = {
  uri: string;
  name: string;
  mimeType?: string;
};
