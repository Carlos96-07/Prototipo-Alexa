from datetime import datetime
from urllib.parse import quote_plus

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
        text_lower = text.lower()
        
        # Reconocimiento de saludo
        if "hola" in text_lower:
            return {"response": "Hola, estoy aquí para ayudarte.", "action": None}
            
        # Reconocimiento de hora
        if "hora" in text_lower:
            time = datetime.now().strftime('%H:%M')
            return {"response": f"Son las {time}", "action": None}

        # Buscar en YouTube específicamente
        if "youtube" in text_lower and ("busca" in text_lower or "buscar" in text_lower or "canción" in text_lower or "cancion" in text_lower or "pon" in text_lower or "reproduce" in text_lower or "coloca" in text_lower):
            # Extraer la query quitando palabras clave
            query = text_lower
            for word in ['busca', 'buscar', 'en youtube', 'youtube', 'pon', 'reproduce', 'coloca', 'una', 'un']:
                query = query.replace(word, '')
            query = query.strip()
            if query:
                return {
                    "response": f"Buscando {query} en YouTube",
                    "action": {
                        "type": "open_url",
                        "url": f"https://www.youtube.com/results?search_query={quote_plus(query)}"
                    }
                }

        # Buscar en Spotify
        if "spotify" in text_lower and ("busca" in text_lower or "pon" in text_lower or "reproduce" in text_lower or "coloca" in text_lower or "canción" in text_lower or "cancion" in text_lower):
            query = text_lower
            for word in ['busca', 'buscar', 'en spotify', 'spotify', 'pon', 'reproduce', 'coloca', 'una', 'un']:
                query = query.replace(word, '')
            query = query.strip()
            if query:
                return {
                    "response": f"Buscando {query} en Spotify",
                    "action": {
                        "type": "open_url",
                        "url": f"https://open.spotify.com/search/{quote_plus(query)}"
                    }
                }
            
        # Abrir sitios directamente
        if "abrir" in text_lower or "abre" in text_lower or "ver" in text_lower:
            for site, url in self.sites.items():
                if site in text_lower:
                    return {
                        "response": f"Abriendo {site}",
                        "action": {
                            "type": "open_url",
                            "url": url
                        }
                    }
                    
        # Buscador genérico en Google
        if "busca" in text_lower or "buscar" in text_lower:
            query = text_lower
            for word in ['busca', 'buscar', 'en google', 'google']:
                query = query.replace(word, '')
            query = query.strip()
            if query:
                return {
                    "response": f"Buscando {query} en Google",
                    "action": {
                        "type": "open_url",
                        "url": f"https://www.google.com/search?q={quote_plus(query)}"
                    }
                }

        # Despedida
        if 'termina' in text_lower or 'terminar' in text_lower or 'adiós' in text_lower:
             return {"response": "Sesión finalizada. Hasta pronto.", "action": {"type": "end_session"}}

        return {"response": "No entendí, por favor repítelo.", "action": None}
