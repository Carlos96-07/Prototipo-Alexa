# Prototipo Alexa Web: Asistente Virtual Inteligente

Este proyecto es una evolución moderna de un asistente de voz básico en Python, transformado en una aplicación web interactiva con una arquitectura de microservicios, una interfaz visual inspirada en Alexa y procesamiento de lenguaje natural.

---

## Características Principales

- **Activación por Voz ("Wake Word"):** Responde de manera inteligente al comando "Alexa" o "Computadora" utilizando la **Web Speech API**.
  
- **Interfaz Visual Premium:** Anillo interactivo animado con CSS dinámico que cambia de estado (Inactivo, Escuchando, Procesando, Hablando) con efectos de ondas y resplandor.
  
- **Arquitectura Robusta:** Backend desarrollado con **FastAPI** siguiendo el patrón de diseño "Clean Architecture" para una escalabilidad profesional.
  
- **Acciones Inteligentes:**
  - Búsqueda directa en YouTube y Spotify.
  - Navegación a sitios populares (GitHub, Netflix, HBO).
  - Búsqueda avanzada en Google.
  - Reporte de hora en tiempo real.
    
- **LLM Ready (Placeholder):** Estructura preparada para integrar modelos de lenguaje (OpenAI, Anthropic) mediante un servicio dedicado con manejo de API Keys.
  
- **Comunicación en Tiempo Real:** Uso de **WebSockets** para una interacción fluida y sin latencia entre el cliente y el servidor.

---

## Tecnologías Utilizadas

### Frontend
- **React 19** + **Vite**: Para una interfaz de usuario reactiva y rápida.
- **Web Speech API**: Para reconocimiento (STT) y síntesis de voz (TTS) directamente en el navegador.
- **Vanilla CSS**: Animaciones avanzadas y diseño "Glassmorphism".
- **Zustand**: Gestión de estado (preparado).

### Backend
- **FastAPI**: Framework de alto rendimiento para la API y WebSockets.
- **Python-dotenv**: Manejo seguro de configuraciones y secretos.
- **Uvicorn**: Servidor ASGI para producción.

---

## Instalación y Configuración

### Requisitos Previos
- Node.js (v20.18.0 o superior)
- Python 3.10 o superior

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/Prototipo-Alexa.git
cd Prototipo-Alexa
```

### 2. Configuración del Backend
```bash
cd Back-End
pip install -r requirements.txt
# (Opcional) Crea un archivo .env
# LLM_API_KEY=tu_api_key_aqui
uvicorn app.main:app --reload
```

### 3. Configuración del Frontend
```bash
cd ../Front-End
npm install
npm run dev
```

---

## Cómo usar el Asistente

1. Abre `http://localhost:5173` en tu navegador (recomendado Google Chrome).
2. Otorga permisos para usar el micrófono y de ventana emergente.
3. El anillo estará en modo **Idle** (Azul suave).
4. Di la palabra clave: **"Alexa"** o **"Computadora"**.
5. Cuando el anillo brille en **Cyan**, di tu comando. Ejemplos:
   - *"Busca música relajante en YouTube"*
   - *"Pon a Taylor Swift en Spotify"*
   - *"¿Qué hora es?"*
   - *"Abre GitHub"*
   - *"Busca cómo hacer una tortilla española"*

---

## Estructura del Proyecto

```text
Prototipo-Alexa/
├── Back-End/                # Lógica del Servidor
│   ├── app/
│   │   ├── api/            # Controladores de WebSockets
│   │   ├── core/           # Configuraciones y Variables de Entorno
│   │   ├── services/       # Lógica de Negocio (Intents y LLM)
│   │   └── main.py         # Punto de entrada
│   └── requirements.txt
├── Front-End/               # Aplicación React
│   ├── src/
│   │   ├── components/     # UI Components (AlexaRing)
│   │   ├── hooks/          # Lógica de Voz y Sockets
│   │   ├── App.jsx         # Integración Principal
│   │   └── index.css       # Estilos Globales y Premium
│   └── package.json
└── README.md
```

---

## Objetivo del Proyecto
Este proyecto fue diseñado para demostrar habilidades en:
- Desarrollo Fullstack con tecnologías modernas.
- Implementación de sistemas de voz en tiempo real.
- Diseño de interfaces atractivas y funcionales.
- Prácticas de código limpio y arquitectura escalable.

---

---
*Nota: Este proyecto es un prototipo funcional para portafolio.*
