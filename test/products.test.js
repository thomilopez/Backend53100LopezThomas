import { expect } from 'chai'
import * as chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/app.js'
import userModel from '../src/persistencia/models/usersDTO.js'
import jwt from 'jsonwebtoken'
import { entorno } from '../src/config/config.js'

chai.use(chaiHttp)

let adminToken
let userToken

describe('Products API', () => {
	before(async () => {
		// Crear un usuario admin
		const adminUser = new userModel({
			email: 'admin@example.com',
			password: 'password',
			rol: 'admin',
		})
		await adminUser.save()
		adminToken = jwt.sign({ id: adminUser._id }, entorno.JWT_SECRET, {
			expiresIn: '1h',
		})

		// Crear un usuario regular
		const regularUser = new userModel({
			email: 'user@example.com',
			password: 'password',
			rol: 'user',
		})
		await regularUser.save()
		userToken = jwt.sign({ id: regularUser._id }, entorno.JWT_SECRET, {
			expiresIn: '1h',
		})
	})

	describe('GET /api/products', () => {
		it('should get all products', (done) => {
			chai
				.request(app)
				.get('/api/products')
				.end((err, res) => {
					expect(res).to.have.status(200)
					expect(res.body).to.be.an('object')
					expect(res.body.products).to.be.an('array')
					done()
				})
		})
	})

	it('should create a new product as admin', (done) => {
		const newProduct = {
			title: 'Test Product',
			description: 'This is a test product',
			thumbnail: ['http://example.com/image.jpg'],
			category: 'Test Category',
			brand: 'Test Brand',
			code: 'TP123',
			price: 100,
			stock: 10,
			status: true,
			owner: 'admin@example.com',
		}

		chai
			.request(app)
			.post('/api/products')
			.set('Authorization', `Bearer ${adminToken}`)
			.send(newProduct)
			.end((err, res) => {
				expect(res).to.have.status(200)
				expect(res.body).to.have.property('newProduct')
				expect(res.body.newProduct).to.have.property('_id')
				testProductId = res.body.newProduct._id
				done()
			})
	})

	it('should not create a product as regular user', (done) => {
		const newProduct = {
			title: 'Test Product',
			description: 'This is a test product',
			thumbnail: ['http://example.com/image.jpg'],
			category: 'Test Category',
			brand: 'Test Brand',
			code: 'TP123',
			price: 100,
			stock: 10,
			status: true,
			owner: 'user@example.com',
		}

		chai
			.request(app)
			.post('/api/products')
			.set('Authorization', `Bearer ${userToken}`)
			.send(newProduct)
			.end((err, res) => {
				expect(res).to.have.status(403)
				done()
			})
	})

	it('should get all products', (done) => {
		chai
			.request(app)
			.get('/api/products')
			.end((err, res) => {
				expect(res).to.have.status(200)
				expect(res.body).to.have.property('products')
				expect(res.body.products).to.be.an('array')
				done()
			})
	})

	it('should get product by id', (done) => {
		chai
			.request(app)
			.get(`/api/products/${testProductId}`)
			.end((err, res) => {
				expect(res).to.have.status(200)
				expect(res.body).to.have.property('_id').eql(testProductId)
				done()
			})
	})

	it('should update a product as admin', (done) => {
		const updatedFields = {
			price: 150,
			stock: 20,
		}

		chai
			.request(app)
			.patch(`/api/products/${testProductId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.send(updatedFields)
			.end((err, res) => {
				expect(res).to.have.status(200)
				expect(res.body)
					.to.have.property('message')
					.eql('Producto actualizado exitosamente.')
				done()
			})
	})

	it('should delete a product as admin', (done) => {
		chai
			.request(app)
			.delete(`/api/products/${testProductId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.end((err, res) => {
				expect(res).to.have.status(200)
				expect(res.body)
					.to.have.property('message')
					.eql('Producto eliminado exitosamente.')
				done()
			})
	})
})
