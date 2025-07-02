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
const razorpay = require('./config/razorpay');

const paymentRoutes = require('./routes/paymentRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/payments', paymentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => logger.info(`🚀 Payment service running on port ${PORT}`));