from pathlib import Path
import sys

ML_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ML_DIR))

from app.inference import VoiceShieldDetector


def main():
    print("=" * 50)
    print("VoiceShield Audio Inference Test")
    print("=" * 50)

    # Change this filename if needed
    audio_path = ML_DIR / "data" / "test.wav"

    if not audio_path.exists():
        print(f"\nAudio file not found: {audio_path}")
        print("\nPlease place a WAV file here:")
        print("ml/data/test.wav")
        return

    try:
        detector = VoiceShieldDetector()

        print(f"\nAnalyzing: {audio_path.name}")

        result = detector.predict(audio_path)

        print("\nRaw Logits:")
        print(result["logits"])

        print("\nProbabilities:")
        print(result["probabilities"])

        print("\nInference completed successfully!")

    except Exception as e:
        print("\nError during inference:")
        print(type(e).__name__)
        print(e)


if __name__ == "__main__":
    main()