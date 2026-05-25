import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import useSocketIO, { ReadyState } from 'react-use-websocket';
import { WebSocketHook } from 'react-use-websocket/dist/lib/types';
import logout, { disconnectSession } from '@/services/http/logout';
import getTokens from '@/services/http/getTokens';
import SEILoading from '@/components/SEILoading';
import { LogoutInfoModal } from '@/Routes/pages/auth';

type WebSocketType = WebSocketHook | null;

const WebSocketContext = createContext<WebSocketType>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactElement }) => {
  const [retryCount, setRetryCount] = useState(0);
  const loading = useRef(true);
  const maxRetries = 30;

  const ws = useSocketIO(process.env.REACT_APP_MS_USERS_WEBSOCKET_URI, {
    onClose: () => {},
    shouldReconnect: () => {
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        return true;
      }
      return false;
    },
    onOpen: () => {
      const { token } = getTokens();
      loading.current = false;

      if (token) {
        ws?.sendJsonMessage({ type: 'auth_session', data: { token } });
        const websocket = ws.getWebSocket();
        if (websocket?.onmessage) websocket.onmessage = disconnectSession;
      }
    },
    onMessage: disconnectSession,
  });

  useEffect(() => {
    if (retryCount >= maxRetries) {
      history.pushState({}, '', `${LogoutInfoModal.path}?type=inactive`);
      logout();
    }
  }, [retryCount]);

  if (!ws || loading.current) return <SEILoading />;

  return <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = (): WebSocketType => {
  const socket = useContext(WebSocketContext);

  if (!socket) {
    throw new Error('useWebSocket deve ser usado dentro de um WebSocketProvider');
  }

  return socket;
};
