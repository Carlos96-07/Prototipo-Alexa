import { useState, useEffect, useRef } from 'react';

export function useSpeech(onCommandRecognized, onWakeWordRecognized) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  
  useEffect(() => {
    // Inicializar Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-MX';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        const currentText = finalTranscript || interimTranscript;
        setTranscript(currentText);

        if (finalTranscript) {
          const lowerText = finalTranscript.toLowerCase();
          // Detectar wake word ("alexa" o "computadora")
          if (lowerText.includes('alexa') || lowerText.includes('computadora')) {
            onWakeWordRecognized();
          } else if (lowerText.trim().length > 0) {
            // Es un comando regular
            onCommandRecognized(finalTranscript);
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setIsListening(false);
        }
      };

      recognitionRef.current.onend = () => {
        // Reiniciar si debe seguir escuchando
        if (isListening && recognitionRef.current) {
          try {
             recognitionRef.current.start();
          } catch (e) {
             console.log("Reiniciando rec...", e);
          }
        }
      };
    } else {
      console.warn('Speech Recognition API no soportada en este navegador');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, onCommandRecognized, onWakeWordRecognized]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.log("Ya estaba iniciado");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const speak = (text, onEndCallback) => {
    if ('speechSynthesis' in window) {
      // Detener cualquier habla anterior
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-MX';
      utterance.rate = 1.0;
      utterance.pitch = 1.1;

      // Seleccionar voz de Google si está disponible
      const voices = window.speechSynthesis.getVoices();
      const googleVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('es'));
      if (googleVoice) {
        utterance.voice = googleVoice;
      }

      utterance.onend = () => {
        if (onEndCallback) onEndCallback();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech Synthesis no soportada');
      if (onEndCallback) onEndCallback();
    }
  };

  return { isListening, transcript, startListening, stopListening, speak };
}