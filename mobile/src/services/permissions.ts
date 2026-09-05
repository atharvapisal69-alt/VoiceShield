import * as Audio from "expo-audio";

export interface MicrophonePermissionState {
  granted: boolean;
  canAskAgain: boolean;
  status: string;
}

/**
 * Checks the current microphone permission without prompting.
 */
export async function getMicrophonePermission(): Promise<MicrophonePermissionState> {
  const result = await Audio.getRecordingPermissionsAsync();
  return {
    granted: result.granted,
    canAskAgain: result.canAskAgain,
    status: result.status,
  };
}

/**
 * Requests microphone permission. Microphone is only activated after the
 * user explicitly starts a recording.
 */
export async function requestMicrophonePermission(): Promise<MicrophonePermissionState> {
  const result = await Audio.requestRecordingPermissionsAsync();
  return {
    granted: result.granted,
    canAskAgain: result.canAskAgain,
    status: result.status,
  };
}

export interface CallAudioSupport {
  supported: boolean;
  reason: string;
}

/**
 * Truthful capability report for real-time cellular call audio analysis.
 *
 * Modern Android/iOS operating systems do not expose call audio to ordinary
 * apps. VoiceShield never tries to bypass that restriction — it surfaces
 * this state clearly and offers Record/Upload as safe fallbacks.
 */
export function getCallAudioSupport(): CallAudioSupport {
  return {
    supported: false,
    reason:
      "Real-time cellular call audio analysis is unavailable on this device.",
  };
}