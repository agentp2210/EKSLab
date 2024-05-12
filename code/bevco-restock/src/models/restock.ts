import mongoose from "mongoose";

interface RestockAddrs {
    companyId: string;
    inventoryId: string;
    reorderQuanity: number;
}

interface RestockModel extends mongoose.Model<RestockDoc> {
  build(attrs: RestockAddrs): RestockDoc;
}

interface RestockDoc extends mongoose.Document {
    companyId: string;
    inventoryId: string;
    reorderQuanity: number;
}

const RestockSchema = new mongoose.Schema({
    companyId: {
        type: String,
        required: true
    },
    inventoryId: {
        type: String,
        required: true
    },
    reorderQuanity: {
        type: Number,
        required: true,
        default: 0
    }
});

RestockSchema.statics.build = (attrs: RestockAddrs) => {
    return new Restock(attrs);
}

const Restock = mongoose.model<RestockDoc, RestockModel>('restock', RestockSchema);

export { Restock };