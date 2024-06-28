import { producer } from "./kafkaconfig";

export const produceMessage = async (topic: string, message: any) => {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  await producer.disconnect();
};

export const fetchProductsForOrder = async (orderId: string) => {
  const message = { orderId };
  await produceMessage('order-products-fetch', message);
};

export const fetchProductForOrder = async (orderId: string, productId: string) => {
  const message = { orderId, productId };
  await produceMessage('order-products-fetch', message);
};
