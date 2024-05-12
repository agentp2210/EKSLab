import mongoose from 'mongoose';
import { db, url, username, password, queue } from './config';
import { Consumer } from './messaging/rabbitmq';
import { Inventory } from './models/inventory';

const consumer = new Consumer(url, username, password, queue);

const handleIncomingNotification = async (msg: string) => {
    try {
      const parsedMessage = JSON.parse(msg);

      const inventory = await Inventory.findById(parsedMessage.inventoryId);
      const newQuanity = inventory?.quanity + parsedMessage.quanity
      await Inventory.findByIdAndUpdate(parsedMessage.inventoryId, { quanity: newQuanity }, { new: true });
    }
    catch(err) {
      console.error(err);
    }
};

const listen = async () => {
    try {
        await mongoose.connect(db);
    }
    catch (err) {
        console.log(err);
    }

    await consumer.init();
    await consumer.consume(handleIncomingNotification)
}

listen();