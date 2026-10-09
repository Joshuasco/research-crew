import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "The Research Crew"
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    
    # Primary & Fallback Free LLM Models on OpenRouter
    FREE_MODELS: list[str] = [
        "google/gemma-4-26b-a4b-it:free",
        "nvidia/nemotron-3-super-120b-a12b:free",
        "liquid/lfm-2.5-2.6b:free",
        "google/gemma-4-31b-it:free"
    ]
    
    MAX_REVISION_ITERATIONS: int = 2
    LOG_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "logs"))
    DATA_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

os.makedirs(os.path.join(settings.LOG_DIR, "rejections"), exist_ok=True)
os.makedirs(settings.DATA_DIR, exist_ok=True)
