const socketIo = require('socket.io');

module.exports = (server) => {
  const io = socketIo(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    console.log('A user connected to payment service');
    // Add payment-specific socket logic here
    socket.on('disconnect', () => {
      console.log('User disconnected from payment service');
    });
  });
  return io;
}; 