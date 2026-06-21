import os
from functools import lru_cache

import argostranslate.package
import argostranslate.translate
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel


class TranslateRequest(BaseModel):
    text: str
    source: str = "zh"
    target: str = "en"


class TranslateResponse(BaseModel):
    translatedText: str


app = FastAPI(title="StudioRender Offline Translate Service")


def _has_installed_translation(source: str, target: str) -> bool:
    installed_languages = argostranslate.translate.get_installed_languages()
    source_language = next((language for language in installed_languages if language.code == source), None)
    target_language = next((language for language in installed_languages if language.code == target), None)

    if not source_language or not target_language:
        return False

    try:
        source_language.get_translation(target_language)
        return True
    except Exception:
        return False


@lru_cache(maxsize=4)
def _ensure_translation_package(source: str, target: str) -> None:
    if _has_installed_translation(source, target):
        return

    argostranslate.package.update_package_index()
    available_packages = argostranslate.package.get_available_packages()
    package = next(
        (
            item
            for item in available_packages
            if item.from_code == source and item.to_code == target
        ),
        None,
    )

    if package is None:
        raise RuntimeError(f"No Argos Translate package found for {source} to {target}.")

    argostranslate.package.install_from_path(package.download())


def _check_secret(x_translate_secret: str | None) -> None:
    expected_secret = os.getenv("TRANSLATE_API_SECRET")

    if not expected_secret:
        raise HTTPException(status_code=500, detail="TRANSLATE_API_SECRET is not configured.")

    if x_translate_secret != expected_secret:
        raise HTTPException(status_code=401, detail="Invalid translation service secret.")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/translate", response_model=TranslateResponse)
def translate(
    payload: TranslateRequest,
    x_translate_secret: str | None = Header(default=None),
) -> TranslateResponse:
    _check_secret(x_translate_secret)

    source = payload.source or "zh"
    target = payload.target or "en"

    if source != "zh" or target != "en":
        raise HTTPException(status_code=400, detail="Only zh to en translation is supported.")

    text = payload.text.strip()
    if not text:
        return TranslateResponse(translatedText="")

    try:
        _ensure_translation_package(source, target)
        translated = argostranslate.translate.translate(text, source, target).strip()
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Translation failed: {exc}") from exc

    return TranslateResponse(translatedText=translated)
