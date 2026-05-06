from datetime import datetime

class IntentService:
    def __init__(self):
        self.sites = {
            'google': 'https://google.com',
            'youtube': 'https://youtube.com',
            'github': 'https://github.com',
            'netflix': 'https://netflix.com',
            'spotify': 'https://spotify.com',
            'hbo': 'https://hbo.com'
        }

    def process_command(self, text: str) -> dict:
        text = text.lower()
        
        # Reconocimiento de saludo
        if "hola" in text:
            return {"response": "Hola, estoy aquí para ayudarte.", "action": None}
            
        # Reconocimiento de hora
        if "hora" in text:
            time = datetime.now().strftime('%H:%M')
            return {"response": f"Son las {time}", "action": None}
            
        # Abrir sitios
        if "abrir" in text or "ver" in text:
            for site, url in self.sites.items():
                if site in text:
                    return {
                        "response": f"Abriendo {site}",
                        "action": {
                            "type": "open_url",
                            "url": url
                        }
                    }
                    
        # Buscador genérico en Google si se detecta "busca" o "buscar"
        if "busca" in text or "buscar" in text:
            search_query = text.replace("busca", "").replace("buscar", "").strip()
            if search_query:
                return {
                    "response": f"Buscando {search_query} en Google",
                    "action": {
                        "type": "open_url",
                        "url": f"https://www.google.com/search?q={search_query}"
                    }
                }

        # Despedida
        if 'termina' in text or 'terminar' in text or 'adiós' in text:
             return {"response": "Sesión finalizada. Hasta pronto.", "action": {"type": "end_session"}}

        return {"response": "No entendí, por favor repítelo.", "action": None}
