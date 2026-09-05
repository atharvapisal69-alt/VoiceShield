import * as DocumentPicker from "expo-document-picker";

import type { AudioFile } from "@/types/analysis";

/**
 * Audio file selection via the OS document picker.
 * Only voice/audio formats are offered to the user.
 */

const AUDIO_MIME_TYPES = [
  "audio/*",
  "audio/wav",
  "audio/x-wav",
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/x-m4a",
  "audio/ogg",
  "application/ogg",
];

export async function pickAudioFile(): Promise<AudioFile | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: AUDIO_MIME_TYPES,
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled || result.assets.length === 0) return null;

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      name: asset.name,
      mimeType: asset.mimeType ?? undefined,
      size: asset.size ?? undefined,
    };
  } catch {
    return null;
  }
}