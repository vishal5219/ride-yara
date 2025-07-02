const socketIo = require('socket.io');
const producer = require('../config/kafka/producer');
const consumer = require('../config/kafka/consumer');
const jwt = require('jsonwebtoken');

module.exports = (server) => {
  const io = socketIo(server, { cors: { origin: '*' } });

  // Kafka consumer for location-events
  consumer.subscribe({ topic: 'location-events', fromBeginning: false });
  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      // Optionally broadcast to relevant rooms
      if (event.type === 'DRIVER_LOCATION') {
        io.to(`booking_${event.bookingId}`).emit('driverLocation', event);
      } else if (event.type === 'CUSTOMER_LOCATION') {
        io.to(`booking_${event.bookingId}`).emit('customerLocation', event);
      }
    },
  });

  io.use((socket, next) => {
    // JWT authentication middleware
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
    // Join room for the current booking (bookingId should be sent by client after connect)
    socket.on('joinBooking', ({ bookingId }) => {
      socket.join(`booking_${bookingId}`);
    });

    // Listen for location updates from client (driver or customer)
    socket.on('locationUpdate', async (data) => {
      // data: { role, lat, lng, bookingId }
      if (!data.bookingId) return;
      // Broadcast to room
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
      // Handle cleanup if needed
    });
  });

  return io;
}; 