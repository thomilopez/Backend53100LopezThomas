import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Schema } from 'mongoose';

const collection = 'Users';

const schema = new mongoose.Schema({
        first_name: {
            type: String,
            required: true,
            index: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        cart: {
            product: {
                type: Schema.Types.ObjectId,
                ref: "product",
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
        rol: {
            type: String,
            enum: ['admin', 'user'],
            default: "user",
        },
})
schema.plugin(mongoosePaginate);

const userModel = mongoose.model(collection,schema);

export default userModel;