import express from 'express';
import { Inventory } from '../models/inventory';

const router = express.Router();
router.get('/api/inventory/health', async (req, res) => {    
    res.sendStatus(200)
});

router.get('/api/inventory/:id', async (req, res) => {
    const id = req.params.id
    const inventory = await Inventory.findById(id);
    res.send(inventory)
});

router.get('/api/inventory', async (req, res) => {
    const inventory = await Inventory.find({});
    
    res.send(inventory)
});



export { router as readRouter }