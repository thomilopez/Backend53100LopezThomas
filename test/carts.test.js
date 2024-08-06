import { expect } from 'chai'
import * as chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/app.js'
import mongoose from 'mongoose'
import { before, after, describe, it } from 'mocha'
import CartManagerNew from '../src/controllers/cartManagerNew.js'
import UserModel from '../src/persistencia/models/usersDTO.js'
import ProductModel from '../src/persistencia/models/productsDTO.js'
import CartModel from '../src/persistencia/models/cartsDTO.js'

// Configura Chai para usar chai-http
chai.use(chaiHttp)

describe('Cart API Tests', () => {
	let token
	let userId
	let cartId
	let productId

	before(async () => {
		// Conexión a la base de datos
		await mongoose.connect(
			'mongodb+srv://thomasignaciolopez:Vzj0a0fdqqLm9SsI@cluster0.0p9eir3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
		)

		// Crear un usuario de prueba y obtener el token de autenticación
		const user = new UserModel({
			email: 'test@test.com',
			password: 'password',
			rol: 'user',
		})
		await user.save()
		userId = user._id

		const res = await chai
			.request(app)
			.post('/api/sessions/login')
			.send({ email: 'test@test.com', password: 'password' })
		token = res.body.token

		// Crear un producto de prueba
		const product = new ProductModel({
			title: 'Test Product',
			price: 10,
			stock: 100,
			owner: 'test@test.com',
		})
		await product.save()
		productId = product._id

		// Crear un carrito de prueba
		const cartManager = new CartManagerNew()
		const cart = await cartManager.createCart(userId)
		cartId = cart._id
	})

	after(async () => {
		await UserModel.deleteMany({})
		await ProductModel.deleteMany({})
		await CartModel.deleteMany({})
		await mongoose.connection.close()
	})

	it('should add a product to the cart', async () => {
		const res = await chai
			.request(app)
			.post(`/api/carts/${cartId}/products/${productId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ quantity: 2 })

		expect(res).to.have.status(200)
		expect(res.body).to.have.property(
			'message',
			'Producto agregado al carrito exitosamente.',
		)
		expect(res.body.result).to.have.property('products').with.lengthOf(1)
		expect(res.body.result.products[0])
			.to.have.property('productId')
			.eql(productId.toString())
		expect(res.body.result.products[0]).to.have.property('quantity', 2)
	})

	it('should update the quantity of a product in the cart', async () => {
		const res = await chai
			.request(app)
			.patch(`/api/carts/${cartId}/products/${productId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ quantity: 5 })

		expect(res).to.have.status(200)
		expect(res.body).to.have.property(
			'message',
			'Cantidad de producto actualizada exitosamente.',
		)
	})

	it('should delete a product from the cart', async () => {
		const res = await chai
			.request(app)
			.delete(`/api/carts/${cartId}/products/${productId}`)
			.set('Authorization', `Bearer ${token}`)

		expect(res).to.have.status(200)
		expect(res.body).to.have.property(
			'message',
			'Producto eliminado del carrito exitosamente.',
		)
	})

	it('should get the cart by user id', async () => {
		const res = await chai
			.request(app)
			.get('/api/carts')
			.set('Authorization', `Bearer ${token}`)

		expect(res).to.have.status(200)
		expect(res.body).to.have.property('items').that.is.an('array')
	})

	it('should delete all products from the cart', async () => {
		const res = await chai
			.request(app)
			.delete(`/api/carts/${cartId}`)
			.set('Authorization', `Bearer ${token}`)

		expect(res).to.have.status(200)
		expect(res.body).to.have.property(
			'message',
			'Todos los productos del carrito han sido eliminados.',
		)
	})
})
