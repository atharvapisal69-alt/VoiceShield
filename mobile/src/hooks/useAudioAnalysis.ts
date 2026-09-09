import { useCallback, useState } from "react";

import { CONFIG } from "@/constants/config";
import { toRiskLevel } from "@/constants/colors";
import { useAnalysis } from "@/context/AnalysisContext";
import { analyzeAudio } from "@/services/api";
import type { AnalysisHistoryItem, AnalysisSource, AudioFile } from "@/types/analysis";

export type AnalysisRunState = "idle" | "loading" | "done" | "error";

export interface RunAnalysisInput {
  file: AudioFile;
  source: AnalysisSource;
}

/**
 * Unified analysis pipeline hook.
 *
 * Recording and upload flow through this single hook — there is no
 * duplicated AI-analysis logic anywhere in the app.
 */
export function useAudioAnalysis() {
  const { addItem } = useAnalysis();
  const [state, setState] = useState<AnalysisRunState>("idle");
  const [error, setError] = useState("");

  const run = useCallback(
    async (input: RunAnalysisInput): Promise<AnalysisHistoryItem | null> => {
      setState("loading");
      setError("");
      try {
        const response = await analyzeAudio(input.file);
        const item: AnalysisHistoryItem = {
          id: `analysis_${Date.now().toString(36)}`,
          kind: "analysis",
          source: input.source,
          fileName: input.file.name,
          label: toRiskLevel(response.label),
          riskScore: Math.round(response.risk_score),
          confidence: Math.round(response.confidence ?? 0),
          fakeProbability: Math.round(
            response.fake_probability ?? response.risk_score,
          ),
          realProbability: Math.round(
            response.real_probability ??
              Math.max(0, 100 - response.risk_score),
          ),
          explanation: response.explanation,
          duration: input.file.duration,
          createdAt: new Date().toISOString(),
        };
        addItem(item);
        setState("done");
        return item;
      } catch (err) {
        setState("error");
        setError(
          err instanceof Error
            ? err.message
            : "Analysis could not be completed. Please try again.",
        );
        return null;
      }
    },
    [addItem],
  );

  return { state, error, run, isMock: CONFIG.MOCK_MODE };
}