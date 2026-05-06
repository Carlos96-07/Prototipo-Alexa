from app.core.config import settings
from app.services.intent_service import IntentService

class LLMService:
    def __init__(self):
        self.api_key = settings.LLM_API_KEY
        self.fallback_service = IntentService()
        
    def get_response(self, text: str) -> dict:
        """
        Este es un 'placeholder' para un MCP con LLM.
        Si la variable de entorno LLM_API_KEY está configurada, usaría el LLM.
        Si no, hace fallback al intent_service básico.
        """
        if self.api_key:
            # Aquí iría la lógica para enviar a OpenAI, Anthropic, etc.
            # Por ahora simulamos que usamos el modelo si hay key.
            print("Usando LLM con API Key...")
            # Como ejemplo, retornamos la respuesta estructurada desde un LLM ficticio
            # (En la práctica usarías LangChain, OpenAI API, etc. y extraerías la intención)
            # Para fines de prototipo y que siga funcionando, igual usaremos el fallback
            return self.fallback_service.process_command(text)
        else:
            # Fallback a comandos duros (if/else)
            return self.fallback_service.process_command(text)
