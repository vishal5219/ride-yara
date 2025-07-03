require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const winston = require('winston');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { body, validationResult, sanitizeBody } = require('express-validator');
const promClient = require('prom-client');

const app = express();
app.use(express.json());
app.use(cors());

// Winston logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Prometheus metrics setup
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();
const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode
    });
  });
  next();
});

// JWT Auth middleware (real implementation)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Input sanitization middleware (example for POST/PUT)
const sanitizeInput = [
  body('*').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Swagger setup
const swaggerDoc = {
  openapi: '3.0.0',
  info: { title: 'API Gateway', version: '1.0.0' },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: { '200': { description: 'OK' } }
      }
    }
  }
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Health check
app.get('/health', (req, res) => res.send('OK'));

// Proxy setup
app.use('/user', createProxyMiddleware({ target: process.env.USER_SERVICE_URL, changeOrigin: true, pathRewrite: { '^/user': '' } }));
app.use('/driver', createProxyMiddleware({ target: process.env.DRIVER_SERVICE_URL, changeOrigin: true, pathRewrite: { '^/driver': '' } }));
app.use('/booking', createProxyMiddleware({ target: process.env.BOOKING_SERVICE_URL, changeOrigin: true, pathRewrite: { '^/booking': '' } }));
app.use('/payment', createProxyMiddleware({ target: process.env.PAYMENT_SERVICE_URL, changeOrigin: true, pathRewrite: { '^/payment': '' } }));
app.use('/notification', createProxyMiddleware({ target: process.env.NOTIFICATION_SERVICE_URL, changeOrigin: true, pathRewrite: { '^/notification': '' } }));

// Example aggregation endpoint
app.get('/aggregate/health', async (req, res) => {
  // Optionally aggregate health from all services
  res.json({ status: 'ok' });
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Protect all routes except /health, /api-docs, /metrics
app.use((req, res, next) => {
  if (["/health", "/api-docs", "/metrics"].some(path => req.path.startsWith(path))) {
    return next();
  }
  authenticateToken(req, res, next);
});

// Example: apply sanitization to all POST/PUT requests
app.use((req, res, next) => {
  if (["POST", "PUT"].includes(req.method)) {
    return sanitizeInput[0](req, res, () => sanitizeInput[1](req, res, next));
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => logger.info(`🚦 API Gateway running on port ${PORT}`)); 