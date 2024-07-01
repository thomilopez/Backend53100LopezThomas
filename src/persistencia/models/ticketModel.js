import mongoose from "mongoose";
const { Schema } = mongoose;
const collection = "ticket"

const schema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
});

const ticketModel = mongoose.model(collection, schema);

export default ticketModel;