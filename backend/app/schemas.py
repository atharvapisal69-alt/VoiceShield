from pydantic import BaseModel


class AnalysisResponse(BaseModel):
    label: str
    risk_score: float
    confidence: float
    explanation: str