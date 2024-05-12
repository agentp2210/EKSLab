import mongoose from "mongoose";

interface InventoryAddrs {
    companyId: string;
    productName: string;
    quanity: number;
}

interface InventoryModel extends mongoose.Model<InventoryDoc> {
  build(attrs: InventoryAddrs): InventoryDoc;
}

interface InventoryDoc extends mongoose.Document {
    companyId: string;
    productName: string;
    quanity: number;
}

const inventorySchema = new mongoose.Schema({
    companyId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quanity: {
        type: Number,
        required: true,
        default: 0
    }
});

inventorySchema.statics.build = (attrs: InventoryAddrs) => {
    return new Inventory(attrs);
}

const Inventory = mongoose.model<InventoryDoc, InventoryModel>('Inventory', inventorySchema);

export { Inventory };