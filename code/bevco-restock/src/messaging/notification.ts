import { Sender } from './rabbitmq';
import { url, queue, username, password } from '../config';

export type INotification = {
    companyId: string | undefined;
    inventoryId: string| undefined;
    quanity: number | undefined;
};
  
export const sendNotification = async (notifcation: INotification) => {
    const sender = new Sender(url, username, password, queue);
    await sender.init();
    await sender.sendToQueue("UpdateStock", notifcation);
}