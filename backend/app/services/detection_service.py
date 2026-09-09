import sys
import subprocess
import uuid
from pathlib import Path


# ==========================================
# PROJECT PATH CONFIGURATION
# ==========================================

CURRENT_FILE = Path(__file__).resolve()

# backend/app/services/detection_service.py
# parents[0] = services
# parents[1] = app
# parents[2] = backend
BACKEND_DIR = CURRENT_FILE.parents[2]

# VoiceShield project root
PROJECT_ROOT = BACKEND_DIR.parent


# Add project root to Python path
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


# ==========================================
# IMPORT AI MODEL
# ==========================================

from ml.app.inference import VoiceShieldDetector


# ==========================================
# DETECTION SERVICE
# ==========================================

class DetectionService:

    # ==========================================
    # INITIALIZE AI MODEL
    # ==========================================

    def __init__(self):

        print("Loading VoiceShield AI model...")

        self.detector = VoiceShieldDetector()

        print("VoiceShield AI model loaded successfully!")


    # ==========================================
    # CONVERT ANY AUDIO FORMAT TO WAV
    # ==========================================

    def convert_to_wav(
        self,
        input_path: Path,
        output_path: Path | None = None
    ) -> Path:

        """
        Convert audio file to WAV format using FFmpeg.

        Supported input examples:
        .m4a
        .mp3
        .opus
        .ogg
        .aac
        .flac
        .wav

        Output:
        Mono WAV
        16000 Hz
        """

        # Ensure Path object
        input_path = Path(input_path)


        # ==========================================
        # GENERATE OUTPUT PATH IF NOT PROVIDED
        # ==========================================

        if output_path is None:

            converted_dir = input_path.parent / "converted"

            converted_dir.mkdir(
                parents=True,
                exist_ok=True
            )

            output_path = (
                converted_dir /
                f"{uuid.uuid4()}.wav"
            )

        else:

            output_path = Path(output_path)

            # Ensure output directory exists
            output_path.parent.mkdir(
                parents=True,
                exist_ok=True
            )


        # ==========================================
        # CHECK INPUT FILE
        # ==========================================

        if not input_path.exists():

            raise FileNotFoundError(
                f"Input audio file not found: {input_path}"
            )


        # ==========================================
        # FFMPEG COMMAND
        # ==========================================

        command = [
            "ffmpeg",

            "-y",

            "-i",
            str(input_path),

            # Convert to mono
            "-ac",
            "1",

            # Convert sample rate to 16kHz
            "-ar",
            "16000",

            # Remove video streams if present
            "-vn",

            # WAV output
            str(output_path),
        ]


        # ==========================================
        # DEBUG LOGS
        # ==========================================

        print("\n========== AUDIO CONVERSION ==========")

        print("Input File:")
        print(input_path)

        print("\nOutput File:")
        print(output_path)

        print("\nRunning FFmpeg...")


        # ==========================================
        # RUN FFMPEG
        # ==========================================

        try:

            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                check=False,
            )

        except FileNotFoundError:

            raise RuntimeError(
                "FFmpeg not found. Please install FFmpeg and add it to PATH."
            )


        # ==========================================
        # HANDLE FFMPEG ERROR
        # ==========================================

        if result.returncode != 0:

            print("\n========== FFMPEG ERROR ==========")

            print(result.stderr)

            raise RuntimeError(
                f"Audio conversion failed.\n{result.stderr}"
            )


        # ==========================================
        # VERIFY OUTPUT FILE
        # ==========================================

        if not output_path.exists():

            raise RuntimeError(
                "FFmpeg completed but WAV file was not created."
            )


        print("\nAudio conversion successful!")

        print("====================================\n")


        return output_path


    # ==========================================
    # ANALYZE AUDIO
    # ==========================================

    def analyze_audio(
        self,
        audio_path: Path
    ):

        audio_path = Path(audio_path)


        print("\n========== VOICESHIELD ANALYSIS ==========")

        print("Original Audio:")
        print(audio_path)


        # ==========================================
        # CONVERT AUDIO TO WAV
        # ==========================================

        print("\nConverting audio to WAV...")


        wav_path = self.convert_to_wav(
            input_path=audio_path
        )


        print("\nConverted WAV:")
        print(wav_path)


        # ==========================================
        # RUN AI MODEL
        # ==========================================

        print("\nRunning VoiceShield AI model...")


        result = self.detector.predict(
            str(wav_path)
        )


        print("\nAI Analysis Result:")
        print(result)

        print("==========================================\n")


        return result


# ==========================================
# GLOBAL DETECTION SERVICE INSTANCE
# ==========================================

detection_service = DetectionService()