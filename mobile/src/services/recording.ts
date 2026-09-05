import { RecordingPresets, setAudioModeAsync } from "expo-audio";

/**
 * Thin wrapper around expo-audio recording primitives.
 * The microphone is only ever activated when the user presses Record —
 * there is no background or hidden capture.
 */

export const RECORDING_FILE_NAME = "voice_recording.m4a";

export const RECORDING_PRESET = RecordingPresets.HIGH_QUALITY;

/** Configures the audio session so both recording and playback work. */
export async function prepareAudioModeForRecording(): Promise<void> {
  await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
}

/** Releases the recording session so playback plays through the speaker. */
export async function prepareAudioModeForPlayback(): Promise<void> {
  await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
}