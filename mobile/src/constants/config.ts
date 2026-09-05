/**
 * Runtime configuration loaded from environment variables.
 *
 * Expo inlines any env var prefixed with EXPO_PUBLIC_ at build time.
 * See `.env` / `.env.example` in the project root.
 */

const rawApiUrl = (process.env.EXPO_PUBLIC_API_URL ?? "").trim();
const rawMockMode = (process.env.EXPO_PUBLIC_MOCK_MODE ?? "true").trim();

export const CONFIG = {
  /** Backend base URL without a trailing slash. Empty when unset. */
  API_URL: rawApiUrl.replace(/\/+$/, ""),

  /** Mock mode drives the entire hackathon demo offline. */
  MOCK_MODE: rawMockMode.toLowerCase() !== "false",
} as const;

export const APP_VERSION = "1.0.0";

/** Maximum number of history entries stored on-device. */
export const MAX_HISTORY_ITEMS = 50;

/** Call-demo mapping: each real second advances the simulated call this many seconds. */
export const CALL_TIME_SCALE = 10;

export const SUPPORTED_FORMATS = [".wav", ".mp3", ".ogg", ".m4a"];