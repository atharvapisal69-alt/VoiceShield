import * as DocumentPicker from "expo-document-picker";

import type { AudioFile } from "@/types/analysis";
import { SUPPORTED_FORMATS } from "@/constants/config";

export async function pickAudioFile(): Promise<AudioFile | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) {
      return null;
    }

    const asset = result.assets?.[0];

    if (!asset) {
      return null;
    }

    const fileName = asset.name || "audio.opus";

    const extension =
      "." + fileName.split(".").pop()?.toLowerCase();

    if (!SUPPORTED_FORMATS.includes(extension)) {
      throw new Error(
        `Unsupported audio format: ${extension}. Supported formats: ${SUPPORTED_FORMATS.join(", ")}`,
      );
    }

    return {
      uri: asset.uri,
      name: fileName,
      mimeType: asset.mimeType ?? getMimeType(extension),
      size: asset.size,
    };
  } catch (error) {
    console.error("Audio picker error:", error);
    throw error;
  }
}

function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    ".wav": "audio/wav",
    ".mp3": "audio/mpeg",
    ".m4a": "audio/mp4",
    ".ogg": "audio/ogg",
    ".opus": "audio/opus",
  };

  return mimeTypes[extension] ?? "application/octet-stream";
}