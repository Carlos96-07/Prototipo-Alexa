import React, { useState, useCallback, useEffect, useRef } from 'react';
import './App.css';
import AlexaRing from './components/AlexaRing';
import { useSocket } from './hooks/useSocket';
import { useSpeech } from './hooks/useSpeech';

function App() {
  const [appState, setAppState] = useState('idle'); // idle, listening, processing, speaking
  const [displayText, setDisplayText] = useState('Di "Alexa" o "Computadora" para empezar');
  const [lastCommand, setLastCommand] = useState('');

  // Ref para evitar closures obsoletas en callbacks asíncronos
  const appStateRef = useRef(appState);
  useEffect(() => {
    appStateRef.current = appState;
  }, [appState]);

  // Inicializar speech (sin callbacks en constructor para evitar closures rotas)
  const { isListening, transcript, startListening, stopListening, speak, setCallbacks } = useSpeech();

  // Manejar respuesta del servidor
  const handleServerResponse = useCallback((data) => {
    console.log('Respuesta del servidor:', data);
    setAppState('speaking');
    setDisplayText(data.response);

    // Ejecutar acción si existe
    if (data.action) {
      if (data.action.type === 'open_url' && data.action.url) {
        // Usar window.open - algunos navegadores lo bloquean como popup
        // Intentamos abrir la URL
        const newWindow = window.open(data.action.url, '_blank');
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          // Si fue bloqueado, crear un link temporal y hacer click programático
          const link = document.createElement('a');
          link.href = data.action.url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
      if (data.action.type === 'end_session') {
        setTimeout(() => {
          setAppState('idle');
          setDisplayText('Sesión finalizada. Di "Alexa" para activar.');
        }, 3000);
        return;
      }
    }

    // Hablar la respuesta usando el ref de speak
    speak(data.response, () => {
      setAppState('idle');
      setDisplayText('Di "Alexa" o "Computadora" para activar');
    });
  }, [speak]);

  const { isConnected, sendMessage } = useSocket('ws://localhost:8000/ws', handleServerResponse);

  // Ref para sendMessage (evitar closure obsoleta)
  const sendMessageRef = useRef(sendMessage);
  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  // Registrar los callbacks con refs actualizados
  useEffect(() => {
    const onWakeWord = () => {
      console.log('Wake word detectado! Estado actual:', appStateRef.current);
      if (appStateRef.current !== 'processing' && appStateRef.current !== 'speaking') {
        setAppState('listening');
        setDisplayText('Escuchando...');
      }
    };

    const onCommand = (text) => {
      const currentState = appStateRef.current;
      console.log('Comando recibido:', text, '| Estado:', currentState);

      // Aceptar comandos en estado listening O idle (para cuando viene todo junto con wake word)
      if (currentState === 'listening' || currentState === 'idle') {
        setLastCommand(text);
        setAppState('processing');
        setDisplayText('Procesando...');
        sendMessageRef.current(text);
      }
    };

    setCallbacks(onCommand, onWakeWord);
  }, [setCallbacks]);

  // Cargar voces del navegador al inicio
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      // Algunos navegadores necesitan este evento
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Botón manual para activar/desactivar el micrófono
  const toggleListening = () => {
    if (isListening) {
      stopListening();
      setAppState('idle');
      setDisplayText('Micrófono apagado');
    } else {
      startListening();
      setAppState('idle');
      setDisplayText('Di "Alexa" para activar');
    }
  };

  return (
    <div className="app-container">
      <div className="controls">
        <div className="status-badge">
          <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
          {isConnected ? 'En Línea' : 'Desconectado'}
        </div>
      </div>

      <AlexaRing state={appState} />

      <div className="transcript-card">
        {lastCommand && (appState === 'processing' || appState === 'speaking') && (
          <p className="user-text">"{lastCommand}"</p>
        )}
        <p className="assistant-text">
          {appState === 'listening' ? (transcript || 'Escuchando...') : displayText}
        </p>
      </div>

      <button
        className={`mic-btn ${isListening ? 'active' : ''}`}
        onClick={toggleListening}
        title="Encender/Apagar Micrófono"
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
        </svg>
      </button>
    </div>
  );
}

export default App;