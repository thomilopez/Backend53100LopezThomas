import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { entorno } from './config/config.js'
import mongoose from 'mongoose'
import { fakerDE as faker } from '@faker-js/faker'
import nodemailer from 'nodemailer'

const JWT_SECRET = entorno.secretJWT

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const createHash = (password) =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => {
	return bcrypt.compareSync(password, user.password)
}
export const generateToken = (user) => {
	return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
		expiresIn: '1h',
	})
}
export const generateUniqueCode = async () => {
	const newObjectId = new mongoose.Types.ObjectId()
	return newObjectId.toString().slice(19)
}

export const generateProduct = () => {
	return {
		title: faker.commerce.productName(),
		price: faker.commerce.price(),
		id: faker.database.mongodbObjectId(),
		department: faker.commerce.department(),
		description: faker.commerce.productDescription(),
	}
}

export const generateMockingProducts = () => {
	const numOfProducts = 100
	const products = []
	for (let i = 0; i < numOfProducts; i++) {
		products.push(generateProduct())
	}
	return products
}

export class CustomError extends Error {
	constructor(name, message, code, description) {
		super(message)
		this.name = name
		this.code = code
		this.description = description
	}

	static createCustomError(name, message, code, description) {
		return new CustomError(name, message, code, description)
	}
}

export const errorTypes = {
	ERROR_INVALID_ARGUMENTS: 400,
	ERROR_DATA: 400,
	ERROR_NOT_FOUND: 404,
	ERROR_UNAUTHORIZED: 401,
	ERROR_FORBIDDEN: 403,
	ERROR_INTERNAL_ERROR: 500,
}

export const errorDictionary = {
	ProductCreationError: 'There was an error creating the product.',
	CartAdditionError: 'There was an error adding the product to the cart.',
	ProductNotFoundError: 'Product not found.',
	InvalidProductQuantityError: 'Invalid product quantity.',
	CartNotFoundError: 'Cart not found.',
}

const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	secure: false,
	port: 587,
	auth: {
		user: entorno.MAIL_USER,
		pass: entorno.MAIL_PASS,
	},
})

export const sendEmail = async (to, subject, html) => {
	const mailOptions = {
		from: entorno.MAIL_USER,
		to,
		subject,
		html,
	}
	return transporter.sendMail(mailOptions)
}

export default __dirname
