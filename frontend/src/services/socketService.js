import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_GATEWAY_URL, {
  path: '/socket.io',
  auth: {
    token: localStorage.getItem('token')
  },
  transports: ['websocket'],
});

export default socket; 