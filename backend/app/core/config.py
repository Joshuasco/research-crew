import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "The Research Crew"
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    
    # Primary & Fallback Free LLM Models on OpenRouter
    FREE_MODELS: list[str] = [
        "meta-llama/llama-3-8b-instruct:free",
        "mistralai/mistral-7b-instruct:free",
        "google/gemma-2-9b-it:free",
        "qwen/qwen-2-7b-instruct:free"
    ]
    
    MAX_REVISION_ITERATIONS: int = 2
    LOG_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "logs"))
    DATA_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

os.makedirs(os.path.join(settings.LOG_DIR, "rejections"), exist_ok=True)
os.makedirs(settings.DATA_DIR, exist_ok=True)
