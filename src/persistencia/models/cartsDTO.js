import mongoose from 'mongoose'

const { Schema } = mongoose

const collection = 'carts'

const schema = new Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users',
		required: true,
	},
	products: [
		{
			productId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'products',
				required: true,
			},

			quantity: {
				type: Number,
				required: true,
			},
		},
	],
})

const cartsModel = mongoose.model(collection, schema)

export default cartsModel
