# Asistente Virtual por Voz en Python

Este proyecto implementa un **asistente virtual por comandos de voz** usando Python. Reconoce instrucciones habladas en español y responde con voz, además de ejecutar acciones como abrir sitios web o decir la hora actual.

---

## Características

- Reconocimiento de voz en español (Google Speech Recognition).
- Respuestas habladas usando `pyttsx3`.
- Abre páginas como YouTube, Google, Netflix, GitHub, Spotify, HBO.
- Informa la hora actual al decir: `"Computador, ¿qué hora es?"`
- Activación personalizada por palabra clave (por defecto: **"computador"**).
- Cierre del asistente con frases como: `"termina"` o `"terminó"`.

---

## Estructura del Código

- `say(text)`: Función para convertir texto en voz.
- `while True`: Bucle principal de escucha.
- `speech_recognition`: Para detectar comandos hablados.
- `subprocess`: Ejecuta comandos del sistema (abrir Chrome).
- `datetime`: Obtener hora actual del sistema.

---

## Requisitos

Instala las siguientes bibliotecas antes de ejecutar:

```bash
pip install pyttsx3
pip install pyaudio
pip install SpeechRecognition

Nota: En algunos sistemas, puede ser necesario instalar PyAudio con wheels:
