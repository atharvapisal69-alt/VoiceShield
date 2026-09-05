import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { MAX_HISTORY_ITEMS } from "@/constants/config";
import {
  clearHistory as clearStoredHistory,
  loadHistory,
  persistHistory,
} from "@/services/storage";
import type { HistoryItem } from "@/types/call";

/**
 * Central store for the unified analysis history (voice analyses + call reports).
 * Persists metadata to AsyncStorage via services/storage.ts.
 */

interface AnalysisContextValue {
  items: HistoryItem[];
  ready: boolean;
  addItem: (item: HistoryItem) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  getItem: (id: string) => HistoryItem | undefined;
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(
  undefined,
);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    loadHistory()
      .then((loaded) => {
        if (active) setItems(loaded);
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const addItem = useCallback((item: HistoryItem) => {
    setItems((prev) => {
      const next = [item, ...prev].slice(0, MAX_HISTORY_ITEMS);
      void persistHistory(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      void persistHistory(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    void clearStoredHistory();
  }, []);

  const getItem = useCallback(
    (id: string) => items.find((item) => item.id === id),
    [items],
  );

  const value = useMemo(
    () => ({ items, ready, addItem, removeItem, clearAll, getItem }),
    [items, ready, addItem, removeItem, clearAll, getItem],
  );

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

export { AnalysisContext };

export function useAnalysis(): AnalysisContextValue {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysis must be used within AnalysisProvider");
  return ctx;
}