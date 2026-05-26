import { createContext, useContext, useMemo } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const noopSocket = {
  emit() {},
  on() {},
  off() {},
  disconnect() {}
};

export function SocketProvider({ children }) {
  const socket = useMemo(() => {
    if (import.meta.env.VITE_ENABLE_REALTIME !== 'true') {
      return noopSocket;
    }

    return io(import.meta.env.VITE_SOCKET_URL || window.location.origin, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10
    });
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);
