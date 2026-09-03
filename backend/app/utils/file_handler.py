import shutil
import uuid
from pathlib import Path

from fastapi import UploadFile


UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"

ALLOWED_EXTENSIONS = {
    ".wav",
    ".mp3",
    ".m4a",
    ".ogg",
    ".flac",
}


def save_uploaded_file(file: UploadFile) -> Path:
    """
    Save an uploaded audio file temporarily.
    """

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    original_name = file.filename or "audio.wav"
    extension = Path(original_name).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(
            f"Unsupported audio format: {extension}. "
            f"Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    unique_name = f"{uuid.uuid4()}{extension}"
    file_path = UPLOAD_DIR / unique_name

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return file_path


def delete_uploaded_file(file_path: Path) -> None:
    """
    Delete temporary uploaded file.
    """

    if file_path.exists():
        file_path.unlink()