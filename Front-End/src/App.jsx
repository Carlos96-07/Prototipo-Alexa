import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import AlexaRing from './components/AlexaRing';
import { useSocket } from './hooks/useSocket';
import { useSpeech } from './hooks/useSpeech';

function App() {
  const [appState, setAppState] = useState('idle'); // idle, listening, processing, speaking
  const [displayText, setDisplayText] = useState('Di "Alexa" o "Computadora" para empezar');
  const [lastCommand, setLastCommand] = useState('');

  // Manejar respuesta del servidor
  const handleServerResponse = useCallback((data) => {
    setAppState('speaking');
    setDisplayText(data.response);
    
    // Ejecutar acción si existe
    if (data.action) {
      if (data.action.type === 'open_url') {
        window.open(data.action.url, '_blank');
      }
      if (data.action.type === 'end_session') {
        setTimeout(() => {
          setAppState('idle');
          setDisplayText('Sesión finalizada. Di "Alexa" para activar.');
        }, 3000);
      }
    }

    // Hablar la respuesta
    speak(data.response, () => {
      // Cuando termina de hablar, vuelve a idle (o vuelve a escuchar si lo deseas)
      setAppState('idle');
      setDisplayText('Di "Alexa" o presiona el botón');
    });
  }, []);

  const { isConnected, sendMessage } = useSocket('ws://localhost:8000/ws', handleServerResponse);

  // Manejar cuando se reconoce la palabra de activación
  const handleWakeWord = useCallback(() => {
    if (appState !== 'listening') {
      setAppState('listening');
      setDisplayText('Escuchando...');
      // Beep opcional aquí
    }
  }, [appState]);

  // Manejar cuando se reconoce un comando
  const handleCommand = useCallback((text) => {
    // Si estábamos escuchando activamente (ya dijimos Alexa)
    if (appState === 'listening') {
      setLastCommand(text);
      setAppState('processing');
      setDisplayText('Procesando...');
      sendMessage(text);
    }
  }, [appState, sendMessage]);

  const { isListening, transcript, startListening, stopListening, speak } = useSpeech(handleCommand, handleWakeWord);

  // Intentar cargar las voces al inicio
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Botón manual para activar/desactivar el micro (por si el navegador bloquea la escucha continua)
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
        {lastCommand && appState !== 'idle' && (
          <p className="user-text">"{lastCommand}"</p>
        )}
        <p className="assistant-text">{appState === 'listening' ? transcript || 'Escuchando...' : displayText}</p>
      </div>

      <button className={`mic-btn ${isListening ? 'active' : ''}`} onClick={toggleListening} title="Encender/Apagar Micrófono">
        <svg viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
        </svg>
      </button>
    </div>
  );
}

export default App;