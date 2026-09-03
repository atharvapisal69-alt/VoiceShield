import type { AnalysisResult, AudioFile, RiskLabel } from "@/types/analysis";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

function mockAnalysis(): AnalysisResult {
  return {
    label: "LOW RISK",
    risk_score: 0.0006,
    confidence: 0.9994,
    explanation:
      "The audio is likely to be genuine based on the anti-deepfake model prediction.",
  };
}

function normalizedLabel(label: string): RiskLabel {
  const value = label.toUpperCase();
  if (value.includes("HIGH")) return "HIGH RISK";
  if (value.includes("MEDIUM") || value.includes("MODERATE"))
    return "MEDIUM RISK";
  return "LOW RISK";
}

export async function analyzeAudio(
  audioFile: AudioFile,
): Promise<AnalysisResult> {
  if (!API_BASE_URL) {
    await new Promise((resolve) => setTimeout(resolve, 1100));
    return mockAnalysis();
  }

  const formData = new FormData();
  formData.append("audio", {
    uri: audioFile.uri,
    name: audioFile.name,
    type: audioFile.mimeType ?? "audio/m4a",
  } as unknown as Blob);

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error(`Analysis failed (${response.status})`);
  const payload = (await response.json()) as AnalysisResult;
  return { ...payload, label: normalizedLabel(payload.label) };
}
