import pyttsx3 as voz #Instalar desde el cmd como pip install pyttsx3 y audio pip install PyAudio
import speech_recognition as sr #Instalar desde el cmd python -m pip install SpeechRecognition
import subprocess as sub
from datetime import datetime

# Configuracion de la voz de asistencia de Google
voice = voz.init()
voices= voice.getProperty('voices')
voice.setProperty('voice', voices[0].id)
voice.setProperty('rate', 140)

def say(text):
    voice.say(text)
    voice.runAndWait()

while True:
    recognizer = sr.Recognizer()

# Codigo para activar el Microfono
# Frase de escucha para comunicarnos
    with sr.Microphone() as source:
        print('Escuchando...')
        audio = recognizer.listen(source, phrase_time_limit=3)

    try: #Si entiende lo que decimos entrara a la logica del programa
        comando = recognizer.recognize_google(audio, language='es-MX')
        print(f'Creo que dijiste"{comando}"')

        comando=comando.lower()
        comando=comando.split(' ')

        if 'computador' in comando: #Se puede cambiar el nombre computadora con otro nombre si se quisiera 

            if 'ver' in comando or 'abrir' in comando:
                # Cargamos los sitios que queremos visitar
                sites={
                    'google':'google.com',
                    'youtube': 'youtube.com',
                    'github': 'github.com',
                    'netflix': 'netflix.com',
                    'spotify': 'spotify.com',
                    'hbo': 'hbo.com'
                }

                for i in list(sites.keys()):
                    if i in comando:
                        sub.call(f'start chrome.exe {sites[i]}', shell=True) #Se determina el navegador de busqueda
                        say(f'Abriendo {i}')
                #Esto nos permite ver la Hora con la frase: Computadora que hora es
            elif 'hora' in comando:
                time=datetime.now().strftime('%H:%M')
                say(f'Son las {time}')

            #Frases para terminar la sesion
            if 'termina' in comando or 'terminar' in comando or 'término' in comando or 'terminó' in comando:
                say('Sesion finalizada')
                break

    except: #Esto sirve para cuando el asistente no entiende nos mandara este mensaje
        print('No entendí, por favor repitelo')                 



             
