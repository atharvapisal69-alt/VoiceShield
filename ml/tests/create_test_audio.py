import numpy as np
import soundfile as sf
from pathlib import Path


SAMPLE_RATE = 16000
DURATION = 4  # seconds
FREQUENCY = 440  # Hz


def create_test_audio():
    output_path = (
        Path(__file__).resolve().parent.parent
        / "data"
        / "test.wav"
    )

    # Generate time values
    t = np.linspace(
        0,
        DURATION,
        int(SAMPLE_RATE * DURATION),
        endpoint=False
    )

    # Generate simple sine-wave audio
    audio = 0.2 * np.sin(2 * np.pi * FREQUENCY * t)

    # Save as valid WAV
    sf.write(
        output_path,
        audio.astype(np.float32),
        SAMPLE_RATE
    )

    print("Test audio created successfully!")
    print(f"Path: {output_path}")
    print(f"Sample rate: {SAMPLE_RATE} Hz")
    print(f"Duration: {DURATION} seconds")


if __name__ == "__main__":
    create_test_audio()