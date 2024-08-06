import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { Schema } from 'mongoose'

const collection = 'Users'

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
	rol: {
		type: String,
		enum: ['admin', 'user', 'premium'],
		default: 'user',
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	documents: [
		{
			name: String,
			reference: String,
		},
	],
	last_connection: Date,
})
schema.plugin(mongoosePaginate)

const userModel = mongoose.model(collection, schema)

export default userModel
