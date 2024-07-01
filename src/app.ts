import './../instrument.js';
import * as Sentry from "@sentry/node";
import express from "express";
import * as dotevnv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import productRouter from "./routes/product.routes";

dotevnv.config();

if (!process.env.PORT) {
  console.log(`No port value specified...`);
}

const PORT = parseInt(process.env.PORT as string, 10);

const app = express();

Sentry.setupExpressErrorHandler(app);

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use("/", productRouter);

if (process.env.NODE_ENV !== "test")   {
  app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

export default app;
