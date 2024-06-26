import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [process.env.KAFKA_SERVER as string]
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'group_id' });
