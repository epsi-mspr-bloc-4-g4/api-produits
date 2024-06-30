import { consumer, producer } from "./kafkaconfig";
import { fetchProductsForOrder } from "./producer";

export const consumeMessages = async (topic: string) => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-products-fetch', fromBeginning: true });

  // Connect to the producer once outside of the consumer.run loop
  await producer.connect();

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const { orderId } = JSON.parse(message.value?.toString() || '{}');
      const products = await fetchProductsForOrder(orderId);

      // Now that producer is already connected, we can send messages directly
      await producer.send({
        topic: 'order-products-response',
        messages: [{ value: JSON.stringify({ orderId, products }) }],
      });
    },
  });
};

