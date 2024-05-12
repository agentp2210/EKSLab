import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import { db, port } from './config';
import { createRouter } from './routes/create';
import { readRouter } from './routes/read';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();

app.use(json());
app.use(createRouter);
app.use(readRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

console.log(db);

const startService = async () => {
  try {
    await mongoose.connect(db);
  }
  catch (err) {
    console.log(err);
  }

  app.listen(port, () => {
    console.log(`[server]: Server is running on port: ${port}`);
  });
}

startService();