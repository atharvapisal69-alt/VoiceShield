from pathlib import Path

import numpy as np
import onnxruntime as ort
import soundfile as sf
from scipy.signal import resample_poly


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
    def _resample_audio(
        audio: np.ndarray,
        original_sample_rate: int,
    ) -> np.ndarray:
        """
        Resample audio to 16 kHz for the AI model.
        """

        if original_sample_rate == TARGET_SAMPLE_RATE:
            return audio

        gcd = np.gcd(
            original_sample_rate,
            TARGET_SAMPLE_RATE,
        )

        up = TARGET_SAMPLE_RATE // gcd
        down = original_sample_rate // gcd

        return resample_poly(
            audio,
            up,
            down,
        ).astype(np.float32)

    @staticmethod
    def _prepare_audio(
        audio: np.ndarray,
        sample_rate: int,
    ) -> np.ndarray:
        """
        Convert audio into a clean 16 kHz mono waveform.
        """

        # Convert stereo to mono
        if audio.ndim > 1:
            audio = np.mean(audio, axis=1)

        audio = audio.astype(np.float32)

        # Remove NaN / Inf values
        audio = np.nan_to_num(audio)

        # Automatically resample to 16 kHz
        audio = VoiceShieldDetector._resample_audio(
            audio,
            sample_rate,
        )

        return np.ascontiguousarray(
            audio,
            dtype=np.float32,
        )

    @staticmethod
    def _split_into_chunks(
        audio: np.ndarray,
    ) -> list[np.ndarray]:
        """
        Split the complete audio into fixed-size chunks.

        Each chunk contains exactly TARGET_SAMPLES samples.
        The final chunk is padded if necessary.
        """

        chunks = []

        for start in range(
            0,
            len(audio),
            TARGET_SAMPLES,
        ):
            chunk = audio[
                start:start + TARGET_SAMPLES
            ]

            # Pad the final chunk if it is shorter
            if len(chunk) < TARGET_SAMPLES:
                padding = TARGET_SAMPLES - len(chunk)

                chunk = np.pad(
                    chunk,
                    (0, padding),
                )

            chunks.append(
                np.ascontiguousarray(
                    chunk,
                    dtype=np.float32,
                )
            )

        # Handle extremely short or empty audio
        if not chunks:
            chunks.append(
                np.zeros(
                    TARGET_SAMPLES,
                    dtype=np.float32,
                )
            )

        return chunks

    @staticmethod
    def _softmax(
        logits: np.ndarray,
    ) -> np.ndarray:
        logits = logits - np.max(logits)

        exp_logits = np.exp(logits)

        return exp_logits / np.sum(exp_logits)

    def _predict_chunk(
        self,
        chunk: np.ndarray,
    ) -> tuple[np.ndarray, np.ndarray]:
        """
        Run AI inference on one audio chunk.
        """

        # ONNX expects [batch, 64000]
        input_tensor = np.expand_dims(
            chunk,
            axis=0,
        )

        outputs = self.session.run(
            [self.output_name],
            {
                self.input_name: input_tensor
            },
        )

        logits = np.asarray(
            outputs[0][0],
            dtype=np.float32,
        )

        probabilities = self._softmax(
            logits
        )

        return logits, probabilities

    def predict(
        self,
        audio_path: str | Path,
    ) -> dict:

        audio_path = Path(audio_path)

        if not audio_path.exists():
            raise FileNotFoundError(
                f"Audio file not found: {audio_path}"
            )

        # Load complete audio
        audio, sample_rate = sf.read(
            str(audio_path),
            dtype="float32",
        )

        original_duration = (
            len(audio) / sample_rate
        )

        # Prepare audio
        audio = self._prepare_audio(
            audio,
            sample_rate,
        )

        processed_duration = (
            len(audio) / TARGET_SAMPLE_RATE
        )

        # Split complete audio
        chunks = self._split_into_chunks(
            audio
        )

        all_logits = []
        all_probabilities = []

        # Analyze every chunk
        for chunk in chunks:
            logits, probabilities = self._predict_chunk(
                chunk
            )

            all_logits.append(logits)
            all_probabilities.append(probabilities)

        # Combine results from all chunks
        average_logits = np.mean(
            all_logits,
            axis=0,
        )

        average_probabilities = np.mean(
            all_probabilities,
            axis=0,
        )

        return {
            "logits": average_logits.tolist(),
            "probabilities": average_probabilities.tolist(),

            "audio_metadata": {
                "original_sample_rate": sample_rate,
                "model_sample_rate": TARGET_SAMPLE_RATE,
                "original_duration_seconds": round(
                    original_duration,
                    2,
                ),
                "processed_duration_seconds": round(
                    processed_duration,
                    2,
                ),
                "chunks_analyzed": len(chunks),
            },
        }