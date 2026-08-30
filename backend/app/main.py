from fastapi import FastAPI

app = FastAPI(
    title="VoiceShield API",
    description="AI-assisted voice scam risk analysis API",
    version="0.1.0",
)


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "ok",
        "service": "voiceshield-api",
    }