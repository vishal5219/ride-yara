// Kafka consumer setup
const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID });

module.exports = consumer; 