import { useEffect } from 'react';
import socket from '../services/socketService';

const useSocket = (onConnect, onDisconnect) => {
  useEffect(() => {
    if (onConnect) socket.on('connect', onConnect);
    if (onDisconnect) socket.on('disconnect', onDisconnect);
    return () => {
      if (onConnect) socket.off('connect', onConnect);
      if (onDisconnect) socket.off('disconnect', onDisconnect);
    };
  }, [onConnect, onDisconnect]);
  return socket;
};

export default useSocket; 