const socketIo = require('socket.io');
const producer = require('../config/kafka/producer');
const consumer = require('../config/kafka/consumer');
const jwt = require('jsonwebtoken');

module.exports = (server) => {
  const io = socketIo(server, { cors: { origin: '*' } });

  consumer.subscribe({ topic: 'location-events', fromBeginning: false });
  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      if (event.type === 'DRIVER_LOCATION') {
        io.to(`booking_${event.bookingId}`).emit('driverLocation', event);
      } else if (event.type === 'CUSTOMER_LOCATION') {
        io.to(`booking_${event.bookingId}`).emit('customerLocation', event);
      }
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinBooking', ({ bookingId }) => {
      socket.join(`booking_${bookingId}`);
    });

    socket.on('locationUpdate', async (data) => {
      if (!data.bookingId) return;
      if (data.role === 'driver') {
        io.to(`booking_${data.bookingId}`).emit('driverLocation', { lat: data.lat, lng: data.lng });
        await producer.send({
          topic: 'location-events',
          messages: [{ value: JSON.stringify({ type: 'DRIVER_LOCATION', ...data }) }],
        });
      } else if (data.role === 'customer') {
        io.to(`booking_${data.bookingId}`).emit('customerLocation', { lat: data.lat, lng: data.lng });
        await producer.send({
          topic: 'location-events',
          messages: [{ value: JSON.stringify({ type: 'CUSTOMER_LOCATION', ...data }) }],
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from user service');
    });
  });

  return io;
}; 