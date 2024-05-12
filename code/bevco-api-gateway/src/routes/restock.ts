import express from 'express';
import axios from 'axios';

import { restockURL } from '../config';

const router = express.Router();

router.get('/api/restock/:id', async (req, res) => {
    const id = req.params.id;

    const options = {
        method: 'GET',
        url: `${restockURL}/api/${id}`
    }

    const { data } = await axios.request(options);

    res.send(data)
});

router.get('/api/restock', async (req, res) => {
    const options = {
        method: 'GET',
        url: `${restockURL}/api`
    }
    
    const { data } = await axios.request(options);

    res.send(data)
});

router.post('/api/restock', async (req, res) => {
    const { companyId, inventoryId, reorderQuanity } = req.body;
    
    const postBody = {
        companyId,
        inventoryId,
        reorderQuanity
    }

    const { data } = await axios.post(`${restockURL}/api/restock`, postBody);

    res.send(data)
});

router.put('/api/restock/:id', async (req, res) => {
    const id = req.params.id;

    const { _id, companyId, inventoryId, reorderQuanity } = req.body;

    const putBody = {
        companyId,
        inventoryId,
        reorderQuanity
    }

    const { data } = await axios.put(`${restockURL}/api/${id}`, putBody);

    res.send(data)
});

router.put('/api/restock/:id/updatestock', async (req, res) => {
    const id = req.params.id;

    const { _id, companyId, inventoryId, reorderQuanity } = req.body;

    const putBody = {
        companyId,
        inventoryId,
        reorderQuanity
    }

    const { data } = await axios.put(`${restockURL}/api/restock/${id}/updatestock`, putBody);

    res.send(data)
});

export { router as restockRouter }