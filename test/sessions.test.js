import request from 'supertest'
import app from '../src/app.js'
import { expect } from 'chai'

describe('Sessions Router', () => {
	describe('GET /current', () => {
		it('should return the current session if authenticated', (done) => {
			request(app)
				.get('/api/sessions/current')
				.set('Authorization', 'Bearer VALID_JWT_TOKEN')
				.expect(200)
				.end((err, res) => {
					if (err) return done(err)
					expect(res.body).to.have.property('first_name')
					expect(res.body).to.have.property('email')
					done()
				})
		})

		it('should return 401 if not authenticated', (done) => {
			request(app).get('/api/sessions/current').expect(401, done)
		})
	})

	describe('POST /register', () => {
		it('should register a user successfully', (done) => {
			request(app)
				.post('/api/sessions/register')
				.send({
					first_name: 'John',
					last_name: 'Doe',
					email: 'john.doe@example.com',
					password: 'password123',
					age: 30,
				})
				.expect(201)
				.expect((res) => {
					expect(res.body).to.have.property('status', 'success')
					expect(res.body).to.have.property('message', 'Usuario registrado')
				})
				.end(done)
		})

		it('should fail to register a user with invalid data', (done) => {
			request(app)
				.post('/api/sessions/register')
				.send({
					first_name: 'John',
					email: 'john.doe@example.com',
					password: 'password123',
				})
				.expect(400)
				.expect((res) => {
					expect(res.body).to.have.property('error', 'Falló')
				})
				.end(done)
		})
	})

	describe('POST /login', () => {
		it('should log in a user successfully', (done) => {
			request(app)
				.post('/api/sessions/login')
				.send({
					email: 'john.doe@example.com',
					password: 'password123',
				})
				.expect(200)
				.expect((res) => {
					expect(res.body).to.have.property('status', 'success')
					expect(res.body).to.have.property('token')
				})
				.end(done)
		})

		it('should fail to log in with incorrect credentials', (done) => {
			request(app)
				.post('/api/sessions/login')
				.send({
					email: 'john.doe@example.com',
					password: 'wrongpassword',
				})
				.expect(400)
				.expect((res) => {
					expect(res.body).to.have.property('error', 'error')
				})
				.end(done)
		})
	})

	describe('POST /restore', () => {
		it('should restore password successfully', (done) => {
			request(app)
				.post('/api/sessions/restore')
				.send({
					email: 'john.doe@example.com',
					password: 'newpassword123',
				})
				.expect(200)
				.expect((res) => {
					expect(res.body).to.have.property('status', 'success')
					expect(res.body).to.have.property('message', 'Contraseña actualizada')
				})
				.end(done)
		})

		it('should fail to restore password with invalid email', (done) => {
			request(app)
				.post('/api/sessions/restore')
				.send({
					email: 'invalid-email',
					password: 'newpassword123',
				})
				.expect(400)
				.expect((res) => {
					expect(res.body).to.have.property('status', 'error')
					expect(res.body).to.have.property(
						'message',
						'Formato de correo electrónico inválido',
					)
				})
				.end(done)
		})
	})

	describe('POST /send-reset-email', () => {
		it('should send reset email successfully', (done) => {
			request(app)
				.post('/api/sessions/send-reset-email')
				.send({ email: 'john.doe@example.com' })
				.expect(200)
				.expect((res) => {
					expect(res.body).to.have.property(
						'message',
						'Correo de restablecimiento enviado',
					)
				})
				.end(done)
		})

		it('should fail to send reset email if user does not exist', (done) => {
			request(app)
				.post('/api/sessions/send-reset-email')
				.send({ email: 'nonexistent@example.com' })
				.expect(400)
				.expect((res) => {
					expect(res.body).to.have.property('error')
				})
				.end(done)
		})
	})

	describe('POST /reset-password', () => {
		it('should reset password successfully', (done) => {
			const token = 'VALID_RESET_TOKEN'

			request(app)
				.post('/api/sessions/reset-password')
				.send({
					token,
					newPassword: 'newpassword123',
				})
				.expect(200)
				.expect((res) => {
					expect(res.body).to.have.property(
						'message',
						'Contraseña restablecida exitosamente',
					)
				})
				.end(done)
		})

		it('should fail to reset password with invalid token', (done) => {
			request(app)
				.post('/api/sessions/reset-password')
				.send({
					token: 'INVALID_TOKEN',
					newPassword: 'newpassword123',
				})
				.expect(500)
				.expect((res) => {
					expect(res.body).to.have.property('error')
				})
				.end(done)
		})
	})
})
