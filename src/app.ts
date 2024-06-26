import express from "express";
import * as dotevnv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import productRouter from "./routes/product.routes";
import { errorHandler } from "./middlewares/errorHandler";
import {produceMessage} from "../kafka/producer";
import {consumeMessages} from "../kafka/consumer";

dotevnv.config();

if (!process.env.PORT) {
  console.log(`No port value specified...`);
}

const PORT = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use(errorHandler);

app.use("/", productRouter);

app.post('/publish', async (req, res) => {
  const { topic, message } = req.body;
  await produceMessage(topic, message);
  res.send('Message published');
});

if (process.env.NODE_ENV !== "test")   {
  app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
    await consumeMessages('example_topic');
  });
}

export default app;
