import express from 'express';
import { json } from 'body-parser';

import { port } from './config';
import { inventoryRouter } from './routes/inventory';
import { restockRouter } from './routes/restock';

const app = express();
app.use(json());
app.use(inventoryRouter);
app.use(restockRouter);

const startService = async () => {
    app.listen(port, () => {
      console.log(`[server]: Server is running on port: ${port}`);
    });
}
  
startService();