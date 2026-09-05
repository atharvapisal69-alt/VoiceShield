import { Platform } from "react-native";

import { CONFIG } from "@/constants/config";
import { toRiskLevel } from "@/constants/colors";
import type {
  ApiAnalyzeResponse,
  ApiCallAnalyzeResponse,
  AudioFile,
} from "@/types/analysis";
import type { ReportCategory } from "@/types/call";

/**
 * All backend communication lives here.
 *
 * Endpoints:
 *   POST /api/v1/analyze        — multipart form with `audio` field
 *   POST /api/v1/call/analyze   — call audio chunk analysis
 *   POST /api/v1/call/report    — user-submitted suspicious call report
 *
 * When EXPO_PUBLIC_MOCK_MODE=true (or no API URL is set) the app never
 * touches the network; deterministic demo results are returned instead.
 */

const { API_URL, MOCK_MODE } = CONFIG;

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function jitter(ms: number): number {
  return ms + Math.round(Math.random() * 1400);
}

function deterministicSeed(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

const EXPLANATIONS: Record<string, string> = {
  HIGH:
    "The analyzed voice contains characteristics that may be associated with synthetic or manipulated speech.",
  MEDIUM:
    "Some characteristics in the analyzed voice are consistent with synthetic processing. We recommend caution before sharing sensitive information.",
  LOW:
    "The analyzed voice shows characteristics consistent with genuine human speech.",
};

function mockResultForFile(file: AudioFile): ApiAnalyzeResponse {
  const key = file.name.toLowerCase();
  const seed = deterministicSeed(file.name);
  let score: number;

  if (/suspicious|scam|fake|fraud|deepfake|ai/.test(key)) {
    score = 84 + (seed % 11); // 84–94 → HIGH RISK
  } else if (key.includes("voice_recording")) {
    score = 50 + (seed % 26); // 50–75 → MEDIUM RISK range
  } else if (/real|genuine|safe|legit/.test(key)) {
    score = 4 + (seed % 20); // 4–23 → LOW RISK
  } else {
    const bucket = seed % 3;
    if (bucket === 0) score = 6 + (seed % 34);
    else if (bucket === 1) score = 52 + (seed % 25);
    else score = 80 + (seed % 15);
  }

  const label = toRiskLevel(
    String(score >= 80 ? "HIGH" : score >= 50 ? "MEDIUM" : "LOW"),
  );
  const confidence = 88 + (seed % 10);
  return {
    success: true,
    label,
    risk_score: score,
    confidence,
    fake_probability: score,
    real_probability: Math.max(1, Math.min(100, 100 - score)),
    explanation: EXPLANATIONS[label],
  };
}

async function buildAudioFormData(
  file: AudioFile,
  field: string,
): Promise<FormData> {
  const formData = new FormData();
  if (Platform.OS === "web") {
    // Web FormData requires a real File/Blob. Document-picker returns a URL.
    const blob = await (await fetch(file.uri)).blob();
    formData.append(field, blob, file.name);
  } else {
    formData.append(
      field,
      {
        uri: file.uri,
        name: file.name,
        type: file.mimeType ?? "audio/m4a",
      } as unknown as Blob,
    );
  }
  return formData;
}

/**
 * Analyzes an audio recording/file and returns the raw backend payload.
 * Falls back to a mock result in mock mode.
 */
export async function analyzeAudio(
  file: AudioFile,
): Promise<ApiAnalyzeResponse> {
  if (MOCK_MODE || !API_URL) {
    await delay(jitter(1500));
    return mockResultForFile(file);
  }

  const formData = await buildAudioFormData(file, "audio");
  const response = await fetch(`${API_URL}/api/v1/analyze`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error(`Analysis failed (${response.status})`);
  const payload = (await response.json()) as ApiAnalyzeResponse;
  return { ...payload, label: toRiskLevel(payload.label) };
}

/**
 * Analyzes a chunk of call audio (used by the supported call-analysis mode).
 */
export async function analyzeCallAudio(
  chunk: { uri?: string; mimeType?: string },
  score?: number,
): Promise<ApiCallAnalyzeResponse> {
  const targetScore =
    score ??
    (8 + deterministicSeed(chunk.uri ?? String(Date.now()))) % 88;

  if (MOCK_MODE || !API_URL) {
    await delay(jitter(700));
    const label = toRiskLevel(
      targetScore >= 80 ? "HIGH" : targetScore >= 50 ? "MEDIUM" : "LOW",
    );
    return {
      success: true,
      call_id: `call_${Date.now().toString(36)}`,
      result: {
        label,
        risk_score: targetScore,
        confidence: Math.min(97, 88 + Math.round(targetScore / 10)),
        fake_probability: targetScore,
        real_probability: Math.max(1, 100 - targetScore),
        explanation: EXPLANATIONS[label],
      },
    };
  }

  const formData = await buildAudioFormData(
    { uri: chunk.uri ?? "", name: "call_chunk.m4a", mimeType: chunk.mimeType },
    "audio",
  );
  const response = await fetch(`${API_URL}/api/v1/call/analyze`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error(`Call analysis failed (${response.status})`);
  return (await response.json()) as ApiCallAnalyzeResponse;
}

/**
 * Submits a user-initiated suspicious-call report. Never automatic.
 */
export async function reportCall(payload: {
  callId: string;
  category: ReportCategory;
  notes?: string;
}): Promise<{ success: boolean }> {
  if (MOCK_MODE || !API_URL) {
    await delay(500);
    return { success: true };
  }
  const response = await fetch(`${API_URL}/api/v1/call/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Report failed (${response.status})`);
  return (await response.json()) as { success: boolean };
}

/** True when the app will call the real backend. */
export function isBackendLive(): boolean {
  return !MOCK_MODE && API_URL.length > 0;
}
