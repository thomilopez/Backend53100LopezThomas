import userModel from '../../persistencia/models/usersDTO.js'
import { createHash } from '../../utils.js'
import AuthManager from '../authManager.js'
import jwt from 'jsonwebtoken'

const authManager = new AuthManager()

export const getCurrentSession = (req, res) => {
	res.json(req.user)
}

export const registerUser = async (req, res) => {
	req.logger.info('Usuario registrado exitosamente')
	res.status(201).send({ status: 'success', message: 'Usuario registrado' })
}

export const failRegister = async (req, res) => {
	req.logger.error('Error en el registro de usuario')
	res.send({ error: 'Falló' })
}

export const loginUser = async (req, res) => {
	if (!req.user) {
		req.logger.warn('Error en el login del usuario')

		return res.status(400).send('error')
	}

	await userModel.findByIdAndUpdate(req.user._id, {
		last_connection: new Date(),
	})

	req.session.user = {
		first_name: req.user.first_name,
		last_name: req.user.last_name,
		email: req.user.email,
		age: req.user.age,
		rol: req.user.rol,
	}
	const token = jwt.sign({ id: req.user._id }, 'hola', { expiresIn: '1h' })

	res.cookie('token', token, {
		httpOnly: false,
		sameSite: 'Lax',
		secure: false,
		path: '/',
	})

	req.logger.info('Usuario logueado exitosamente')
	res.status(200).send({
		status: 'success',
		user: { id: req.user._id, rol: req.user.rol },
		token,
	})
}

export const failLogin = async (req, res) => {
	req.logger.error('Error en el login de usuario')
	res.send({ error: 'Falló' })
}

export const githubCallback = async (req, res) => {
	await userModel.findByIdAndUpdate(req.user._id, {
		last_connection: new Date(),
	})
	req.session.user = req.user
	req.logger.info('Usuario logueado con GitHub exitosamente')
	res.redirect('/')
}

export const restorePassword = async (req, res) => {
	const { email, password } = req.body
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(email)) {
		req.logger.warn('Formato de correo electrónico inválido')
		return res.status(400).send({
			status: 'error',
			message: 'Formato de correo electrónico inválido',
		})
	}
	const user = await userModel.findOne({ email })
	if (!user) {
		req.logger.error('No se encuentra el usuario')
		return res
			.status(400)
			.send({ status: 'error', message: 'No se encuentra el usuario' })
	}
	const newPass = createHash(password)
	await userModel.updateOne({ _id: user._id }, { $set: { password: newPass } })
	req.logger.info('Contraseña actualizada exitosamente')
	res.send({ status: 'success', message: 'Contraseña actualizada' })
}

export const sendResetEmail = async (req, res) => {
	const { email } = req.body
	try {
		const result = await authManager.sendResetEmail(email)
		res.send({ message: result })
	} catch (error) {
		res
			.status(500)
			.json({
				msg: `Error interno del servidor en sessionController.sendResetEmail: ${error}`,
			})
	}
}

export const resetPassword = async (req, res) => {
	const { token, newPassword } = req.body
	try {
		const result = await authManager.resetPassword(token, newPassword)
		res.send({ message: result })
	} catch (error) {
		res
			.status(500)
			.json({
				msg: `Error interno del servidor en sessionController.resetPassword: ${error} `,
			})
	}
}
