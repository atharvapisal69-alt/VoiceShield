from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class RiskResult:
    label: str
    risk_score: float
    confidence: float
    explanation: str


class VoiceShieldRiskEngine:
    """
    Converts the ML model's probabilities into a meaningful
    VoiceShield risk assessment.

    Model:
        probability[0] = REAL
        probability[1] = FAKE / SYNTHETIC
    """

    def __init__(
        self,
        low_threshold: float = 0.30,
        high_threshold: float = 0.70,
    ):
        self.low_threshold = low_threshold
        self.high_threshold = high_threshold

    def analyze(self, prediction: dict[str, Any]) -> RiskResult:
        probabilities = prediction.get("probabilities")

        if not probabilities or len(probabilities) != 2:
            raise ValueError(
                "Expected exactly two probabilities: "
                "[real_probability, fake_probability]"
            )

        real_probability = float(probabilities[0])
        fake_probability = float(probabilities[1])

        # Fake probability becomes our risk score.
        risk_score = fake_probability

        if risk_score < self.low_threshold:
            label = "LOW RISK"
            explanation = (
                "The audio is likely to be genuine based on the "
                "anti-deepfake model prediction."
            )

        elif risk_score < self.high_threshold:
            label = "MEDIUM RISK"
            explanation = (
                "The audio contains signals that may indicate "
                "synthetic or manipulated speech."
            )

        else:
            label = "HIGH RISK"
            explanation = (
                "The audio shows strong signals associated with "
                "synthetic or manipulated speech."
            )

        confidence = max(real_probability, fake_probability)

        return RiskResult(
            label=label,
            risk_score=round(risk_score, 4),
            confidence=round(confidence, 4),
            explanation=explanation,
        )

    def analyze_prediction(self, prediction: dict[str, Any]) -> dict[str, Any]:
        result = self.analyze(prediction)

        return {
            "label": result.label,
            "risk_score": result.risk_score,
            "confidence": result.confidence,
            "explanation": result.explanation,
        }