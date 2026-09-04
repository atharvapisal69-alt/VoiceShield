class VoiceShieldRiskEngine:
    """
    Converts raw anti-deepfake model predictions into
    meaningful VoiceShield risk analysis results.

    Verified class mapping from the original AntiDeepfake project:
        Class 0 = Fake / Spoofed audio
        Class 1 = Real / Genuine audio
    """

    FAKE_INDEX = 0
    REAL_INDEX = 1

    def analyze_prediction(self, prediction: dict) -> dict:
        probabilities = prediction.get("probabilities")

        if probabilities is None or len(probabilities) != 2:
            raise ValueError(
                "Expected prediction probabilities with exactly 2 classes."
            )

        fake_probability = float(probabilities[self.FAKE_INDEX])
        real_probability = float(probabilities[self.REAL_INDEX])

        # Risk score represents probability of fake/manipulated audio.
        risk_score = fake_probability * 100

        # Confidence represents confidence in the predicted class.
        confidence = max(fake_probability, real_probability) * 100

        if fake_probability >= 0.80:
            label = "HIGH RISK"
            explanation = (
                "The audio shows strong characteristics associated with "
                "synthetic or manipulated speech."
            )

        elif fake_probability >= 0.50:
            label = "MEDIUM RISK"
            explanation = (
                "The audio contains suspicious characteristics and should "
                "be verified before being trusted."
            )

        elif fake_probability >= 0.20:
            label = "LOW-MEDIUM RISK"
            explanation = (
                "Some unusual characteristics were detected, but the audio "
                "is more likely to be genuine."
            )

        else:
            label = "LOW RISK"
            explanation = (
                "The audio is likely to be genuine based on the "
                "anti-deepfake model prediction."
            )

        return {
            "label": label,
            "risk_score": round(risk_score, 2),
            "confidence": round(confidence, 2),
            "fake_probability": round(fake_probability * 100, 2),
            "real_probability": round(real_probability * 100, 2),
            "explanation": explanation,
        }