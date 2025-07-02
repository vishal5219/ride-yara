const socketIo = require('socket.io');

module.exports = (server) => {
  const io = socketIo(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    console.log('A user connected to notification service');
    // Add notification-specific socket logic here
    socket.on('disconnect', () => {
      console.log('User disconnected from notification service');
    });
  });
  return io;
}; 