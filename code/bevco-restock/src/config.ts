export const port = process.env.PORT || 3000;
export const db = process.env.DATABASE || '';

export const url = process.env.RABBITMQ_URL || 'localhost';
export const username = process.env.RABBITMQ_USER || '';
export const password = process.env.RABBITMQ_PASSWORD || '';
export const queue = process.env.RABBITMQ_INVENTORY_QUEUE || 'IventoryUpdateQueue';