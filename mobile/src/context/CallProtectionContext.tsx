import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { CALL_TIME_SCALE } from "@/constants/config";
import {
  confidenceForScore,
  explanationForLevel,
  generateCallId,
  levelAtScore,
  scoreAtCallTime,
} from "@/services/callProtection";
import type { ActiveCall, CallReport } from "@/types/call";

interface CallProtectionContextValue {
  enabled: boolean;
  activeCall: ActiveCall | null;
  enableProtection: () => void;
  disableProtection: () => void;
  startCall: () => void;
  endCall: () => CallReport | null;
  abandonCall: () => void;
}

const CallProtectionContext = createContext<
  CallProtectionContextValue | undefined
>(undefined);

export function CallProtectionProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const activeCallRef = useRef<ActiveCall | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const setCall = useCallback((next: ActiveCall | null) => {
    activeCallRef.current = next;
    setActiveCall(next);
  }, []);

  const enableProtection = useCallback(() => setEnabled(true), []);
  const disableProtection = useCallback(() => setEnabled(false), []);

  const startCall = useCallback(() => {
    clearTimer();
    const now = Date.now();
    const call: ActiveCall = {
      id: generateCallId(),
      startedAt: now,
      points: [],
      currentRisk: null,
      warningShown: false,
    };
    setCall(call);

    timerRef.current = setInterval(() => {
      const prev = activeCallRef.current;
      if (!prev || prev.id !== call.id) return;
      const callSeconds = Math.floor(
        ((Date.now() - prev.startedAt) / 1000) * CALL_TIME_SCALE,
      );
      const score = scoreAtCallTime(callSeconds);
      const level = levelAtScore(score);
      const last = prev.points[prev.points.length - 1];
      const points =
        last && last.score === score
          ? prev.points
          : [...prev.points, { time: callSeconds, score, level }];
      setCall({
        ...prev,
        points,
        currentRisk: { score, level },
        warningShown: prev.warningShown || score >= 80,
      });
    }, 1000);
  }, [clearTimer, setCall]);

  const endCall = useCallback((): CallReport | null => {
    clearTimer();
    const prev = activeCallRef.current;
    setCall(null);
    if (!prev) return null;

    const scores = prev.points.map((point) => point.score);
    const riskScore = scores.length ? Math.max(...scores) : 0;
    const level = levelAtScore(riskScore);
    const duration = prev.points.length
      ? prev.points[prev.points.length - 1].time
      : 0;

    return {
      id: prev.id,
      kind: "call",
      createdAt: new Date().toISOString(),
      duration,
      riskScore,
      confidence: confidenceForScore(riskScore),
      fakeProbability: riskScore,
      realProbability: Math.max(1, 100 - riskScore),
      explanation: explanationForLevel(level),
      timeline: prev.points,
    };
  }, [clearTimer, setCall]);

  const abandonCall = useCallback(() => {
    clearTimer();
    setCall(null);
  }, [clearTimer, setCall]);

  const value = useMemo(
    () => ({
      enabled,
      activeCall,
      enableProtection,
      disableProtection,
      startCall,
      endCall,
      abandonCall,
    }),
    [
      enabled,
      activeCall,
      enableProtection,
      disableProtection,
      startCall,
      endCall,
      abandonCall,
    ],
  );

  return (
    <CallProtectionContext.Provider value={value}>
      {children}
    </CallProtectionContext.Provider>
  );
}

export { CallProtectionContext };

export function useCallProtection(): CallProtectionContextValue {
  const ctx = useContext(CallProtectionContext);
  if (!ctx)
    throw new Error(
      "useCallProtection must be used within CallProtectionProvider",
    );
  return ctx;
}