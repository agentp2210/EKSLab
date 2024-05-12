import express, { Request, Response } from 'express';
import { Restock } from '../models/restock';

const router = express.Router();

router.post(
    '/api/restock',
    async (req: Request, res: Response) => {

    const { companyId, inventoryId, reorderQuanity } = req.body;

    const restock = Restock.build({ companyId, inventoryId, reorderQuanity });
    await restock.save();

    res.status(201).send(restock);
  }
);

export { router as createRouter }