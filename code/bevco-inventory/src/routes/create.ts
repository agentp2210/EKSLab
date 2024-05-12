import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Inventory } from '../models/inventory';
import { RequestValidationError } from '../errors/request-validation-errors';

const router = express.Router();

router.post(
    '/api/inventory',
    [
       body('productName')
         .notEmpty()
         .isString()
    ],
    async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array())
        //throw new RequestValidationError(errors.array());
    }

    const { companyId, productName, quanity } = req.body;

    const inventory = Inventory.build({ companyId, productName, quanity });
    await inventory.save();

    res.status(201).send(inventory);
  }
);

router.post(
  '/api/inventory/bulkload',
  async (req: Request, res: Response) => {
  
  const { data } = req.body;

  console.log(data);
  
  for (let inventoryItem of data) {
    let inventory = Inventory.build({ companyId: inventoryItem.companyId, productName: inventoryItem.productName, quanity: inventoryItem.quanity });
    await inventory.save();
  }

  res.status(201).send();
}
);

export { router as createRouter }