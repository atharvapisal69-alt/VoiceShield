/**
 * Runtime configuration loaded from environment variables.
 */

const rawApiUrl = (process.env.EXPO_PUBLIC_API_URL ?? "").trim();

const rawMockMode = (
  process.env.EXPO_PUBLIC_MOCK_MODE ?? "true"
).trim();

export const CONFIG = {
  API_URL: rawApiUrl.replace(/\/+$/, ""),

  MOCK_MODE: rawMockMode.toLowerCase() !== "false",
} as const;

export const APP_VERSION = "1.0.0";

export const MAX_HISTORY_ITEMS = 50;

export const CALL_TIME_SCALE = 10;

export const SUPPORTED_FORMATS = [
  ".wav",
  ".mp3",
  ".m4a",
  ".opus",
];