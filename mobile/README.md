# VoiceShield — Mobile App

The **React Native / Expo** frontend for **VoiceShield**, an AI-powered voice
scam and deepfake detection application. It provides three analysis modes that
feed a single AI-analysis pipeline: **📞 Call Protection**, **🎙️ Record Voice**
and **📁 Upload Audio**, plus a circular risk meter, call timeline, call
reports, and device-local history.

> ⚠️ **Platform truthfulness:** Modern Android/iOS operating systems restrict
> real-time cellular call audio from ordinary apps. VoiceShield detects this
> and shows *"Real-time cellular call audio analysis is unavailable on this
> device."* — then offers Record/Upload as safe fallbacks. It never bypasses OS
> restrictions, never secretly records calls, and never uploads audio without
> user consent.

## Run locally

```bash
npm install
npx expo start
```

Use Expo Go, an Android emulator, or an iOS simulator. Microphone recording
requires a device or development build with the microphone permission enabled
(`expo-audio` config plugin in `app.json`).

## Configuration (`.env`)

```bash
EXPO_PUBLIC_API_URL=http://192.168.X.X:8000
EXPO_PUBLIC_MOCK_MODE=true
```

- `EXPO_PUBLIC_MOCK_MODE=true` — the app runs fully offline. Audio analyses
  return deterministic demo results, and call protection plays the demo-risk
  progression (18% → 44% → 63% → 82% → 91%) used by the hackathon demo.
- Set `EXPO_PUBLIC_MOCK_MODE=false` and point `EXPO_PUBLIC_API_URL` at the
  backend to connect the real ML model. **The frontend never implements the AI
  model.**

## API contract (implemented in `src/services/api.ts`)

All network calls are centralized in this one service.

| Method | Endpoint                  | Purpose                                   |
| ------ | ------------------------- | ----------------------------------------- |
| POST   | `/api/v1/analyze`         | Multipart `audio` file → analysis result  |
| POST   | `/api/v1/call/analyze`    | Call-audio chunk → risk segment           |
| POST   | `/api/v1/call/report`     | User-submitted suspicious-call report     |

`analyzeAudio` example response mapped by the app:

```json
{
  "label": "HIGH RISK",
  "risk_score": 87.4,
  "confidence": 93.1,
  "fake_probability": 87.4,
  "real_probability": 12.6,
  "explanation": "The analyzed voice contains characteristics that may be associated with synthetic or manipulated speech."
}
```

## Architecture

```text
src/
  app/                 Expo Router screens (root stack + (tabs))
    (tabs)/            home · history · profile
    call-protection    call-protection entry
    call-analysis      active demo call with live risk + warning
    call-report        post-call security report + manual reporting
    record             record voice flow
    upload             audio file upload flow
    analyze            unified AI analysis pipeline (loading state)
    result             circular risk meter + metrics
  components/          all reusable UI (RiskMeter, AudioPlayer, CallWarning, …)
  context/             AnalysisContext (history) · CallProtectionContext (demo call)
  hooks/               useAudioAnalysis · useCallProtection
  services/            api · storage · audioPicker · recording · callProtection · permissions
  constants/           colors · config
  types/               analysis · call
```

## Hackathon demo flow

1. **Upload** → Home → Upload Audio → pick `suspicious_voice.mp3` → preview →
   Analyze → 🔴 HIGH RISK → saved to history.
2. **Record** → Home → Record Voice → start → ~12s → stop → play → Analyze →
   🟡 MEDIUM RISK → saved to history.
3. **Call** → Home → Protect Call → Enable → Start Demo Call → risk climbs
   live → ⚠️ warning at HIGH RISK → End Call → Call Report → saved to history.

## Privacy principles

- User control: analysis only after explicit user action.
- Transparency: recording/analysis state is always visible.
- Minimal storage: only analysis metadata is persisted (AsyncStorage), never
  raw audio.
- Secure communication: use HTTPS for production deployments.
- No hidden recording: the microphone is never activated silently.
- No automatic accusations: results are probabilistic risk assessments.
- No automatic call reports: reporting always requires explicit user action.