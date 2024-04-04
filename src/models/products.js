import mongoose from "mongoose";

const { Schema } = mongoose;


const collection = "products"

const schema = new Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: [String],
        required: true
    },
    caterogy: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },


})

const productModel = mongoose.model(collection, schema)

export default productModel