require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const winston = require('winston');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const { producer, consumer, initKafka } = require('./kafka');
const driverRoutes = require('./routes/driverRoutes');
const auth = require('./middlewares/auth');
const { validateRegister, validateStatus } = require('./middlewares/validate');
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
  info: { title: 'Driver Service API', version: '1.0.0' },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: { '200': { description: 'OK' } }
      }
    },
    '/drivers/register': {
      post: {
        summary: 'Register driver',
        requestBody: { required: true },
        responses: { '200': { description: 'Driver registered' } }
      }
    },
    '/drivers/login': {
      post: {
        summary: 'Login driver',
        requestBody: { required: true },
        responses: { '200': { description: 'JWT token' } }
      }
    }
  }
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Health check
app.get('/health', (req, res) => res.send('OK'));

// Register driver
app.post('/drivers/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const { rows } = await pool.query(
      'INSERT INTO drivers (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hash, 'DRIVER']
    );
    logger.info(`Driver registered: ${email}`);
    // Publish Kafka event
    await producer.send({
      topic: 'driver-events',
      messages: [{ value: JSON.stringify({ type: 'DRIVER_REGISTERED', driver: rows[0] }) }],
    });
    res.json(rows[0]);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login driver
app.post('/drivers/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM drivers WHERE email = $1', [email]);
    const driver = rows[0];
    if (!driver) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, driver.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: driver.id, role: driver.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    logger.info(`Driver logged in: ${email}`);
    res.json({ token });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Example protected route
app.get('/drivers/me', authenticateToken, authorizeRoles('DRIVER'), async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, email, role FROM drivers WHERE id = $1', [req.user.id]);
    res.json(rows[0]);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
});

// Driver routes
app.post('/api/drivers/register', validateRegister, driverRoutes);
app.get('/api/drivers', auth, driverRoutes);
app.get('/api/drivers/:id', auth, driverRoutes);
app.put('/api/drivers/:id/status', auth, validateStatus, driverRoutes);

// Error handler
app.use(errorHandler);

(async () => {
  await initKafka();
  await consumer.subscribe({ topic: 'driver-events', fromBeginning: true });
  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logger.info(`Received message: ${message.value.toString()}`);
    },
  });
})();

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`🚀 Driver service running on port ${PORT}`);
});