import express, { Request, Response } from 'express';
import { Restock } from '../models/restock';
import { sendNotification } from '../messaging/notification';

const router = express.Router();

router.put(
    '/api/restock/:id/updatestock',
    async (req: Request, res: Response) => {
      const { id } = req.params;

      const restock = await Restock.findById({ _id: id });

      const newMessage = {
        companyId: restock?.companyId,
        inventoryId: restock?.inventoryId,
        quanity: restock?.reorderQuanity
      }

      sendNotification(newMessage);

      res.status(201).send(restock);
    }
);

export { router as updateRouter }