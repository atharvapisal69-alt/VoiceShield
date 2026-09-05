import { useContext } from "react";

import { CallProtectionContext } from "@/context/CallProtectionContext";

/** Convenience hook for the call-protection demo state machine. */
export function useCallProtection() {
  return useContext(CallProtectionContext);
}