import { useState, useEffect, useRef, useCallback } from 'react';

export function useSocket(url, onMessageReceived) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  const connect = useCallback(() => {
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      console.log('WebSocket Conectado');
      setIsConnected(true);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket Desconectado');
      setIsConnected(false);
      // Intentar reconectar después de 3 segundos
      setTimeout(() => {
        connect();
      }, 3000);
    };

    socketRef.current.onerror = (error) => {
      console.error('Error de WebSocket:', error);
      socketRef.current.close();
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessageReceived(data);
    };
  }, [url, onMessageReceived]);

  useEffect(() => {
    connect();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = (text) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ text }));
    } else {
      console.warn('Socket no está conectado');
    }
  };

  return { isConnected, sendMessage };
}