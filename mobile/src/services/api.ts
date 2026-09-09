import { CONFIG } from "@/constants/config";
import { toRiskLevel } from "@/constants/colors";

import type {
  ApiAnalyzeResponse,
  ApiCallAnalyzeResponse,
  AudioFile,
} from "@/types/analysis";

import type { ReportCategory } from "@/types/call";


const { API_URL, MOCK_MODE } = CONFIG;


// =====================================================
// MOCK / DEMO HELPERS
// =====================================================

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));


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
    "Some characteristics in the analyzed voice are consistent with synthetic processing. Please remain cautious.",

  LOW:
    "The analyzed voice shows characteristics consistent with genuine human speech.",
};


// =====================================================
// MOCK RESULT
// =====================================================

function mockResultForFile(file: AudioFile): ApiAnalyzeResponse {
  const seed = deterministicSeed(file.name);

  const score = 20 + (seed % 70);

  const label = toRiskLevel(
    score >= 80
      ? "HIGH"
      : score >= 50
      ? "MEDIUM"
      : "LOW"
  );

  return {
    success: true,

    label,

    risk_score: score,

    confidence: 90,

    fake_probability: score,

    real_probability: Math.max(
      0,
      100 - score
    ),

    explanation: EXPLANATIONS[label],
  };
}


// =====================================================
// REAL AUDIO ANALYSIS
// =====================================================

export async function analyzeAudio(
  file: AudioFile,
): Promise<ApiAnalyzeResponse> {
  console.log("========== VOICESHIELD API ==========");
  console.log("API URL:", API_URL);
  console.log("Mock Mode:", MOCK_MODE);
  console.log("Audio URI:", file.uri);
  console.log("Audio Name:", file.name);
  console.log("Audio MIME:", file.mimeType);

  if (MOCK_MODE || !API_URL) {
    console.log("Running MOCK MODE");

    await delay(1200);

    return mockResultForFile(file);
  }

  return new Promise<ApiAnalyzeResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${API_URL}/analyze-audio`);

    xhr.onload = () => {
      console.log("Backend Status:", xhr.status);
      console.log("Backend Response:", xhr.responseText);

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const backendData = JSON.parse(xhr.responseText);

          const analysis = backendData.analysis || backendData;

          const result: ApiAnalyzeResponse = {
            success: true,

            label: toRiskLevel(
              analysis.label ||
                analysis.risk_level ||
                analysis.risk ||
                "LOW",
            ),

            risk_score: Number(
              analysis.risk_score ??
                analysis.fake_probability ??
                analysis.score ??
                0,
            ),

            confidence: Number(
              analysis.confidence ?? 0,
            ),

            fake_probability: Number(
              analysis.fake_probability ??
                analysis.risk_score ??
                analysis.score ??
                0,
            ),

            real_probability: Number(
              analysis.real_probability ??
                100 -
                  Number(
                    analysis.fake_probability ??
                      analysis.risk_score ??
                      analysis.score ??
                      0,
                  ),
            ),

            explanation:
              analysis.explanation ||
              "Voice analysis completed successfully.",
          };

          console.log(
            "VoiceShield Analysis Success:",
            result,
          );

          resolve(result);
        } catch (error) {
          console.error(
            "Response parsing error:",
            error,
          );

          reject(
            new Error(
              "Failed to process backend response.",
            ),
          );
        }
      } else {
        reject(
          new Error(
            `Backend Error (${xhr.status}): ${xhr.responseText}`,
          ),
        );
      }
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "Network request failed. Check backend server and Wi-Fi connection.",
        ),
      );
    };

    const formData = new FormData();

    // React Native native file object
    const fileData: any = {
      uri: file.uri,
      name: file.name || "audio.opus",
      type: file.mimeType || "audio/opus",
    };

    // Backend expects: file
    formData.append("file", fileData);

    console.log(
      "Uploading audio using XMLHttpRequest...",
    );

    xhr.send(formData);
  });
}

// =====================================================
// CALL AUDIO ANALYSIS
// =====================================================

export async function analyzeCallAudio(
  chunk: {
    uri?: string;
    mimeType?: string;
  },

  score?: number

): Promise<ApiCallAnalyzeResponse> {


  const targetScore =
    score ??
    (20 +
      (
        deterministicSeed(
          chunk.uri ??
          String(Date.now())
        ) % 70
      ));


  const label = toRiskLevel(

    targetScore >= 80
      ? "HIGH"
      : targetScore >= 50
      ? "MEDIUM"
      : "LOW"

  );


  // Demo mode for call analysis

  if (MOCK_MODE || !API_URL) {

    await delay(700);

    return {

      success: true,

      call_id:
        `call_${Date.now().toString(36)}`,

      result: {

        label,

        risk_score:
          targetScore,

        confidence:
          90,

        fake_probability:
          targetScore,

        real_probability:
          Math.max(
            0,
            100 - targetScore
          ),

        explanation:
          EXPLANATIONS[label],

      },

    };

  }


  // Real backend implementation can be added later

  return {

    success: true,

    call_id:
      `call_${Date.now().toString(36)}`,

    result: {

      label,

      risk_score:
        targetScore,

      confidence:
        90,

      fake_probability:
        targetScore,

      real_probability:
        Math.max(
          0,
          100 - targetScore
        ),

      explanation:
        EXPLANATIONS[label],

    },

  };

}


// =====================================================
// REPORT SUSPICIOUS CALL
// =====================================================

export async function reportCall(
  payload: {

    callId: string;

    category: ReportCategory;

    notes?: string;

  }

): Promise<{ success: boolean }> {


  if (MOCK_MODE || !API_URL) {

    await delay(500);

    return {
      success: true
    };

  }


  try {

    const response =
      await fetch(
        `${API_URL}/api/v1/call/report`,
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body:
            JSON.stringify(payload),

        }
      );


    if (!response.ok) {

      throw new Error(
        `Report failed (${response.status})`
      );

    }


    return await response.json();

  }

  catch (error) {

    console.error(
      "Call Report Error:",
      error
    );

    throw error;

  }

}


// =====================================================
// BACKEND STATUS
// =====================================================

export function isBackendLive(): boolean {

  return (
    !MOCK_MODE &&
    API_URL.length > 0
  );

}


// =====================================================
// MIME TYPE HELPER
// =====================================================

function getMimeTypeFromFileName(
  fileName?: string
): string {


  const extension =
    fileName
      ?.split(".")
      .pop()
      ?.toLowerCase();


  switch (extension) {

    case "wav":
      return "audio/wav";

    case "mp3":
      return "audio/mpeg";

    case "m4a":
      return "audio/mp4";

    case "ogg":
      return "audio/ogg";

    case "opus":
      return "audio/opus";

    case "aac":
      return "audio/aac";

    case "flac":
      return "audio/flac";

    default:
      return "audio/*";

  }

}