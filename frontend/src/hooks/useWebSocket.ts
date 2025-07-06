import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageBus } from '../services/messageBus';
import { createWebSocketBus, WebSocketBus } from '../services/websocketBus';
import { MessageType, createMessage, type Message } from '../types/messages';

interface UseWebSocketConfig {
  url: string;
  token: string;
  onMessage?: (message: Message) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
}

export const useWebSocket = (config: UseWebSocketConfig) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const messageBusRef = useRef<MessageBus | null>(null);
  const webSocketBusRef = useRef<WebSocketBus | null>(null);

  // Initialize message bus
  useEffect(() => {
    messageBusRef.current = new MessageBus({
      onMessage: (message) => {
        console.log('Received message:', message);
        setMessages(prev => [...prev, message]);
        config.onMessage?.(message);
      },
      onConnect: () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        config.onConnect?.();
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        config.onDisconnect?.();
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
        setError(error);
        config.onError?.(error);
      }
    });

    return () => {
      messageBusRef.current?.clear();
    };
  }, [config.onMessage, config.onConnect, config.onDisconnect, config.onError]);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    if (!messageBusRef.current) return;

    try {
      console.log('Connecting to WebSocket:', config.url);
      setError(null);
      webSocketBusRef.current = createWebSocketBus(
        config.url,
        config.token,
        messageBusRef.current
      );

      await webSocketBusRef.current.connect();
      console.log('WebSocket connection established');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect';
      console.error('WebSocket connection failed:', errorMessage);
      setError(errorMessage);
      config.onError?.(errorMessage);
    }
  }, [config.url, config.token, config.onError]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    webSocketBusRef.current?.disconnect();
    webSocketBusRef.current = null;
    setIsConnected(false);
  }, []);

  // Send message
  const sendMessage = useCallback((type: MessageType, data: Record<string, any> = {}) => {
    if (!webSocketBusRef.current?.getConnected()) {
      throw new Error('WebSocket is not connected');
    }

    const message = createMessage(type, data);
    webSocketBusRef.current.sendMessage(message);
    
    // Add user messages to local state
    if (type === MessageType.USER) {
      setMessages(prev => [...prev, message]);
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    messages,
    error,
    connect,
    disconnect,
    sendMessage,
    clearMessages: () => setMessages([])
  };
};
