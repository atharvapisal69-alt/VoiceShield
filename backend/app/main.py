from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import shutil
import uuid
from pathlib import Path

from app.services.detection_service import detection_service


# ==========================================
# FASTAPI APP
# ==========================================

app = FastAPI(
    title="VoiceShield API",
    description="AI-assisted voice scam risk analysis API",
    version="1.0.0",
)


# ==========================================
# CORS CONFIGURATION
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# DIRECTORIES
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent

UPLOAD_DIR = BASE_DIR / "uploads"
CONVERTED_DIR = BASE_DIR / "converted_audio"

UPLOAD_DIR.mkdir(exist_ok=True)
CONVERTED_DIR.mkdir(exist_ok=True)


# ==========================================
# ROOT API
# ==========================================

@app.get("/")
def root():
    return {
        "message": "VoiceShield API is running"
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "ai_model": "loaded"
    }


# ==========================================
# AUDIO ANALYSIS API
# ==========================================

@app.post("/analyze-audio")
async def analyze_audio(file: UploadFile = File(...)):

    allowed_extensions = {
        ".wav",
        ".mp3",
        ".m4a",
        ".ogg",
        ".opus",
        ".aac",
        ".flac"
    }

    file_extension = Path(file.filename).suffix.lower()

    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format: {file_extension}"
        )

    unique_id = str(uuid.uuid4())

    original_filename = f"{unique_id}{file_extension}"

    original_path = UPLOAD_DIR / original_filename

    converted_path = CONVERTED_DIR / f"{unique_id}.wav"

    try:

        # ==========================================
        # SAVE ORIGINAL FILE
        # ==========================================

        with open(original_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print("\n========== VOICESHIELD BACKEND ==========")
        print(f"Received file: {file.filename}")
        print(f"Content type: {file.content_type}")
        print(f"Saved original: {original_path}")


        # ==========================================
        # CONVERT AUDIO TO WAV
        # ==========================================

        print("Converting audio to WAV...")

        detection_service.convert_to_wav(
            input_path=original_path,
            output_path=converted_path
        )

        print(f"Converted WAV: {converted_path}")


        # ==========================================
        # RUN AI DETECTION
        # ==========================================

        print("Running VoiceShield AI analysis...")

        result = detection_service.analyze_audio(
            converted_path
        )

        print("Analysis completed successfully!")

        return {
            "success": True,
            "filename": file.filename,
            "analysis": result
        }


    except Exception as e:

        print(f"Analysis error: {str(e)}")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


    finally:

        await file.close()

        # Optional cleanup can be enabled later
        # if original_path.exists():
        #     original_path.unlink()