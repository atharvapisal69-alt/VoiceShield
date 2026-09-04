from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil
import uuid

from app.services.detection_service import detection_service


app = FastAPI(
    title="VoiceShield API",
    description="AI-assisted voice scam risk analysis API",
    version="0.2.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "ok",
        "service": "voiceshield-api",
    }


@app.post("/api/v1/analyze")
async def analyze_audio(
    audio: UploadFile = File(...)
):
    """
    Upload an audio file and analyze it for
    potential AI/deepfake voice risk.
    """

    allowed_extensions = {
        ".wav",
        ".mp3",
        ".ogg",
        ".flac",
    }

    file_extension = Path(
        audio.filename
    ).suffix.lower()

    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported audio format. "
                "Please upload WAV, MP3, OGG, or FLAC."
            ),
        )

    # Temporary upload directory
    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)

    # Generate unique filename
    unique_filename = (
        f"{uuid.uuid4()}{file_extension}"
    )

    file_path = upload_dir / unique_filename

    try:
        # Save uploaded audio
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                audio.file,
                buffer,
            )

        # Run AI detection
        result = detection_service.analyze(
            file_path
        )

        return {
            "success": True,
            "filename": audio.filename,
            "result": result,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )

    finally:
        # Remove temporary uploaded file
        if file_path.exists():
            file_path.unlink()