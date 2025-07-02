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

app.use(errorHandler);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => logger.info(`🚀 User service running on port ${PORT}`)); 