import AsyncStorage from "@react-native-async-storage/async-storage";

import { MAX_HISTORY_ITEMS } from "@/constants/config";
import type { AnalysisHistoryItem } from "@/types/analysis";
import type { CallReport, HistoryItem } from "@/types/call";

/**
 * Device-local persistence for analysis metadata.
 *
 * Privacy principle: we store analysis results only — never raw audio.
 */

const HISTORY_KEY = "voiceshield.history";

function isCallReport(item: HistoryItem): item is CallReport {
  return item.kind === "call";
}

function normalizeItem(raw: Partial<HistoryItem>): HistoryItem | null {
  if (!raw || typeof raw !== "object" || !raw.id) return null;
  const id: string = raw.id;

  if (raw.kind === "call") {
    return {
      kind: "call",
      id,
      createdAt: raw.createdAt ?? new Date().toISOString(),
      duration: raw.duration ?? 0,
      riskScore: raw.riskScore ?? 0,
      confidence: raw.confidence ?? 0,
      fakeProbability: raw.fakeProbability ?? 0,
      realProbability: raw.realProbability ?? 100,
      explanation: raw.explanation ?? "",
      timeline: raw.timeline ?? [],
      reported: raw.reported,
      reportCategory: raw.reportCategory,
      reportNotes: raw.reportNotes,
    };
  }

  // Legacy entries from the older build lacked `kind` — treat as analysis.
  const legacy = raw as Partial<AnalysisHistoryItem>;
  return {
    kind: "analysis",
    id,
    source: legacy.source ?? "upload",
    fileName: legacy.fileName ?? "Audio recording",
    label: legacy.label ?? "LOW RISK",
    riskScore: legacy.riskScore ?? 0,
    confidence: legacy.confidence ?? 0,
    fakeProbability: legacy.fakeProbability ?? 0,
    realProbability: legacy.realProbability ?? 100,
    explanation: legacy.explanation ?? "",
    duration: legacy.duration,
    createdAt: legacy.createdAt ?? new Date().toISOString(),
  };
}

export async function loadHistory(): Promise<HistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => normalizeItem(item as Partial<HistoryItem>))
      .filter((item): item is HistoryItem => item !== null);
  } catch {
    return [];
  }
}

export async function persistHistory(items: HistoryItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable — fail silently, the app still works in-memory.
  }
}

export async function addHistoryItem(
  item: HistoryItem,
): Promise<HistoryItem[]> {
  const items = await loadHistory();
  const next = [item, ...items].slice(0, MAX_HISTORY_ITEMS);
  await persistHistory(next);
  return next;
}

export async function removeHistoryItem(id: string): Promise<HistoryItem[]> {
  const items = await loadHistory();
  const next = items.filter((item) => item.id !== id);
  await persistHistory(next);
  return next;
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}

export function isCallHistoryItem(item: HistoryItem): item is CallReport {
  return isCallReport(item);
}