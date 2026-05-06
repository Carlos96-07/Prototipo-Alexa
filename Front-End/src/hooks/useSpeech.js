import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook para manejar reconocimiento de voz (STT) y síntesis de voz (TTS)
 * usando la Web Speech API nativa del navegador.
 * 
 * Soporta activación por "wake word" (Alexa / Computadora).
 * Si el usuario dice "Alexa abre youtube", extrae el comando automáticamente.
 */
export function useSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const callbacksRef = useRef({ onCommand: null, onWakeWord: null });

  // Registrar callbacks sin recrear el reconocimiento
  const setCallbacks = useCallback((onCommand, onWakeWord) => {
    callbacksRef.current.onCommand = onCommand;
    callbacksRef.current.onWakeWord = onWakeWord;
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API no soportada en este navegador');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-MX';
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const currentText = (finalTranscript || interimTranscript).trim();
      if (currentText) {
        setTranscript(currentText);
      }

      if (finalTranscript) {
        const lowerText = finalTranscript.toLowerCase().trim();
        const wakeWords = ['alexa', 'computadora'];
        const foundWake = wakeWords.find(w => lowerText.includes(w));

        if (foundWake) {
          // Extraer el comando después del wake word
          const afterWake = lowerText.split(foundWake).slice(1).join('').trim();
          // Limpiar comas, puntos al inicio
          const command = afterWake.replace(/^[,.\s]+/, '').trim();

          // Notificar que se activó
          if (callbacksRef.current.onWakeWord) {
            callbacksRef.current.onWakeWord();
          }

          // Si hay un comando después del wake word, enviarlo directamente
          if (command.length > 2) {
            // Pequeño delay para que la UI muestre el estado "listening" primero
            setTimeout(() => {
              if (callbacksRef.current.onCommand) {
                callbacksRef.current.onCommand(command);
              }
            }, 300);
          }
        } else if (lowerText.length > 0) {
          // No contiene wake word, es un comando directo
          if (callbacksRef.current.onCommand) {
            callbacksRef.current.onCommand(finalTranscript.trim());
          }
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'audio-capture') {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // Reiniciar automáticamente si estaba escuchando
      if (recognitionRef.current && recognitionRef.current._shouldRestart) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // ya estaba iniciado
        }
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current._shouldRestart = false;
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current._shouldRestart = true;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.log('Recognition ya estaba iniciado');
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current._shouldRestart = false;
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const speak = useCallback((text, onEndCallback) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech Synthesis no soportada');
      if (onEndCallback) onEndCallback();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.rate = 1.0;
    utterance.pitch = 1.1;

    // Intentar usar voz de Google si está disponible
    const voices = window.speechSynthesis.getVoices();
    const googleVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('es'));
    if (googleVoice) {
      utterance.voice = googleVoice;
    }

    utterance.onend = () => {
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  return { isListening, transcript, startListening, stopListening, speak, setCallbacks };
}