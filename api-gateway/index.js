require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const winston = require('winston');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Winston logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// JWT Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  // Optionally verify token here or pass to downstream
  next();
}

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

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => logger.info(`🚦 API Gateway running on port ${PORT}`)); 