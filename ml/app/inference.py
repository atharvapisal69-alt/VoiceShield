from pathlib import Path

import numpy as np
import onnxruntime as ort
import soundfile as sf


MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "models"
    / "wav2vec2-small-antideepfake.onnx"
)

TARGET_SAMPLE_RATE = 16000
TARGET_SAMPLES = 64000


class VoiceShieldDetector:
    def __init__(self, model_path: str | Path = MODEL_PATH):
        self.model_path = Path(model_path)

        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Model not found: {self.model_path}"
            )

        self.session = ort.InferenceSession(
            str(self.model_path),
            providers=["CPUExecutionProvider"],
        )

        self.input_name = self.session.get_inputs()[0].name
        self.output_name = self.session.get_outputs()[0].name

    @staticmethod
    def _prepare_audio(audio: np.ndarray, sample_rate: int) -> np.ndarray:
        # Convert stereo → mono
        if audio.ndim > 1:
            audio = np.mean(audio, axis=1)

        audio = audio.astype(np.float32)

        # Basic sample-rate check for the first implementation.
        if sample_rate != TARGET_SAMPLE_RATE:
            raise ValueError(
                f"Expected {TARGET_SAMPLE_RATE} Hz audio, "
                f"but received {sample_rate} Hz."
            )

        # Remove NaN/Inf values if present.
        audio = np.nan_to_num(audio)

        # Model expects exactly 64000 samples.
        if len(audio) > TARGET_SAMPLES:
            audio = audio[:TARGET_SAMPLES]

        elif len(audio) < TARGET_SAMPLES:
            padding = TARGET_SAMPLES - len(audio)
            audio = np.pad(audio, (0, padding))

        return np.ascontiguousarray(audio, dtype=np.float32)

    @staticmethod
    def _softmax(logits: np.ndarray) -> np.ndarray:
        logits = logits - np.max(logits)
        exp_logits = np.exp(logits)
        return exp_logits / np.sum(exp_logits)

    def predict(self, audio_path: str | Path) -> dict:
        audio_path = Path(audio_path)

        if not audio_path.exists():
            raise FileNotFoundError(
                f"Audio file not found: {audio_path}"
            )

        audio, sample_rate = sf.read(
            str(audio_path),
            dtype="float32",
        )

        audio = self._prepare_audio(audio, sample_rate)

        # ONNX expects [batch, 64000]
        input_tensor = np.expand_dims(audio, axis=0)

        outputs = self.session.run(
            [self.output_name],
            {self.input_name: input_tensor},
        )

        logits = np.asarray(outputs[0][0], dtype=np.float32)

        probabilities = self._softmax(logits)

        return {
            "logits": logits.tolist(),
            "probabilities": probabilities.tolist(),
        }