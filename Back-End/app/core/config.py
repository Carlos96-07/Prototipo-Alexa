import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Prototipo Alexa Web"
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")

settings = Settings()
