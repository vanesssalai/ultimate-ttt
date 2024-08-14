import { io } from 'socket.io-client';
const SOCKET_URL = 'https://ultimate-ttt-wk1e.onrender.com';

export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: true,
});
