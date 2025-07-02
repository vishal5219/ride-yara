require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const winston = require('winston');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const redis = require('redis');
const { producer, consumer, initKafka } = require('./kafka');
const notificationRoutes = require('./routes/notificationRoutes');
const auth = require('./middlewares/auth');
const { validateNotification } = require('./middlewares/validate');
const errorHandler = require('./middlewares/errorHandler');
const swaggerSpecs = require('./docs/swagger');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });
app.use(express.json());
app.use(cors());

// Winston logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// PostgreSQL pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Redis client
const redisClient = redis.createClient({ url: `redis://${process.env.REDIS_HOST}:6379` });
redisClient.connect();

// JWT Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Swagger setup
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Health check
app.get('/health', (req, res) => res.send('OK'));

// Notification routes
app.post('/api/notifications/send', auth, validateNotification, notificationRoutes);
app.get('/api/notifications', auth, notificationRoutes);

// Socket.IO connection
io.on('connection', (socket) => {
  logger.info('Socket.IO client connected');
  socket.on('subscribe', (userId) => {
    socket.join(userId);
  });
});

// Redis pub/sub for notifications
(async () => {
  const sub = redisClient.duplicate();
  await sub.connect();
  await sub.subscribe('notifications', (message) => {
    const { userId, message: msg } = JSON.parse(message);
    io.to(userId).emit('notification', msg);
    logger.info(`Notification delivered to user ${userId}`);
  });
})();

// Kafka consumer
(async () => {
  await initKafka();
  await consumer.subscribe({ topic: 'notification-events', fromBeginning: true });
  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logger.info(`Received message: ${message.value.toString()}`);
    },
  });
})();

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4005;
server.listen(PORT, () => {
  console.log(`🚀 Notification service running on port ${PORT}`);
}); 