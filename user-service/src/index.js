const express = require('express');
const cors = require('cors');
require('dotenv').config();

const logger = require('./config/logger');
const db = require('./config/db');
const redisClient = require('./config/redis');
const producer = require('./config/kafka/producer');
const consumer = require('./config/kafka/consumer');
const topics = require('./config/kafka/topics');
const zookeeper = require('./config/kafka/zookeeper');

const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');

const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');

const promClient = require('prom-client');
const { validationResult } = require('express-validator');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);

const server = new ApolloServer({ typeDefs, resolvers });
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}
startServer();

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

// Global input validation error handler for POST/PUT
app.use((req, res, next) => {
  if (["POST", "PUT"].includes(req.method)) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  }
  next();
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.use(errorHandler);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => logger.info(`🚀 User service running on port ${PORT}`)); 