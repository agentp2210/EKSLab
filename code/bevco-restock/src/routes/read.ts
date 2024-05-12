import express, { Request, Response } from 'express';
import { Restock } from '../models/restock';

const router = express.Router();

router.get(
    '/api/restock',
    async (req: Request, res: Response) => {
        const restock = Restock.find({});

        res.send(restock);
  }
);

router.get(
    '/api/restock:id',
    async (req: Request, res: Response) => {
        const id = req.params.id;

        const restock = Restock.findById(id);

    res.send(restock);
  }
);

export { router as readRouter }