import express from 'express';
import axios from 'axios';

import { inventoryURL } from '../config';

const router = express.Router();

router.get('/api/inventory/:id', async (req, res) => {
    const id = req.params.id;

    const options = {
        method: 'GET',
        url: `${inventoryURL}/api/inventory/${id}`
    }

    const { data } = await axios.request(options);

    res.send(data)
});

router.get('/api/inventory', async (req, res) => {
    const options = {
        method: 'GET',
        url: `${inventoryURL}/api/inventory`
    }
    
    const { data } = await axios.request(options);

    res.send(data)
});

router.post('/api/inventory', async (req, res) => {
    const { companyId, productName, quanity } = req.body;
    
    const postBody = {
        companyId,
        productName,
        quanity
    }

    const { data } = await axios.post(`${inventoryURL}/api/inventory`, postBody);

    res.send(data)
});

router.post('/api/inventory/bulkload', async (req, res) => {
    const data = req.body;

    console.log(data);

    await axios.post(`${inventoryURL}/api/inventory/bulkload`, data);

    res.status(201).send();
});

router.put('/api/inventory', async (req, res) => {
    const { _id, companyId, productName, quanity } = req.body;

    const putBody = {
        _id,
        companyId,
        productName,
        quanity
    }

    const { data } = await axios.put(`${inventoryURL}/api/inventory`, putBody);

    res.send(data)
});

export { router as inventoryRouter }