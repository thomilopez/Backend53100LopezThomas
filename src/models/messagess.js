import mongoose from "mongoose";
const { Schema } = mongoose
const collection = "messages"
const schema = new Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})
const chatModel = mongoose.model(collection, schema)

export default chatModel