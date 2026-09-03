import sys
import importlib.util
from pathlib import Path


# VoiceShield project root
PROJECT_ROOT = Path(__file__).resolve().parents[3]

# ML application directory
ML_APP_DIR = PROJECT_ROOT / "ml" / "app"


def load_module(module_name: str, file_name: str):
    """
    Load a Python module directly from a file path.
    """

    file_path = ML_APP_DIR / file_name

    spec = importlib.util.spec_from_file_location(
        module_name,
        file_path,
    )

    if spec is None or spec.loader is None:
        raise ImportError(
            f"Could not load ML module: {file_path}"
        )

    module = importlib.util.module_from_spec(spec)

    sys.modules[module_name] = module

    spec.loader.exec_module(module)

    return module


# Load ML modules directly
inference_module = load_module(
    "voiceshield_ml_inference",
    "inference.py",
)

risk_engine_module = load_module(
    "voiceshield_ml_risk_engine",
    "risk_engine.py",
)


VoiceShieldDetector = inference_module.VoiceShieldDetector
VoiceShieldRiskEngine = risk_engine_module.VoiceShieldRiskEngine


class DetectionService:
    def __init__(self):
        print("Loading VoiceShield AI model...")

        self.detector = VoiceShieldDetector()
        self.risk_engine = VoiceShieldRiskEngine()

        print("VoiceShield AI model loaded successfully.")

    def analyze(self, audio_path: str | Path) -> dict:
        """
        Run AI detection and risk analysis.
        """

        prediction = self.detector.predict(audio_path)

        result = self.risk_engine.analyze_prediction(prediction)

        return result


# Singleton instance
detection_service = DetectionService()