require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const winston = require('winston');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const { producer, consumer, initKafka } = require('./kafka');
const bookingRoutes = require('./routes/bookingRoutes');
const auth = require('./middlewares/auth');
const { validateBooking, validateUpdate } = require('./middlewares/validate');
const errorHandler = require('./middlewares/errorHandler');
const swaggerSpecs = require('./docs/swagger');

const app = express();
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

// RBAC middleware
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

// Swagger setup
const swaggerDoc = {
  openapi: '3.0.0',
  info: { title: 'Booking Service API', version: '1.0.0' },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: { '200': { description: 'OK' } }
      }
    },
    '/bookings': {
      post: {
        summary: 'Create booking',
        requestBody: { required: true },
        responses: { '200': { description: 'Booking created' } }
      },
      get: {
        summary: 'List bookings',
        responses: { '200': { description: 'List of bookings' } }
      }
    }
  }
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Health check
app.get('/health', (req, res) => res.send('OK'));

// Booking routes
app.post('/api/bookings', auth, validateBooking, bookingRoutes);
app.get('/api/bookings', auth, bookingRoutes);
app.get('/api/bookings/:id', auth, bookingRoutes);
app.put('/api/bookings/:id', auth, validateUpdate, bookingRoutes);

// Error handler
app.use(errorHandler);

(async () => {
  await initKafka();
  await consumer.subscribe({ topic: 'booking-events', fromBeginning: true });
  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logger.info(`Received message: ${message.value.toString()}`);
    },
  });
})();

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`🚀 Booking service running on port ${PORT}`);
});