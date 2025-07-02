const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'booking-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'booking-group' });

async function initKafka() {
  await producer.connect();
  await consumer.connect();
}

module.exports = { producer, consumer, initKafka }; 