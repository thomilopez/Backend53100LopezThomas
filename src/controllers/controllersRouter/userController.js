import UserManager from '../userManager.js'
import AuthManager from '../authManager.js'
import { CustomError, errorTypes } from '../../utils.js'
import logger from '../../middlewares/logger.js'
import { sendEmail } from '../../utils.js'

const userManager = new UserManager()
const authManager = new AuthManager()

export const getAllUsers = async (req, res) => {
	try {
		const users = await userManager.getAllUsers()
		const publicUsers = users.map((user) => ({
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			rol: user.rol,
			id: user._id,
		}))
		res.status(200).json({ users: publicUsers })
	} catch (error) {
		logger.error(`Error getting all users: ${error.message}`)
		next(
			CustomError.createCustomError(
				'UserRetrievalError',
				error.message,
				errorTypes.ERROR_INTERNAL_ERROR,
			),
		)
		res.status(500).json({
			msg: `Error interno del servidor en userController.getAllUsers: ${error}`,
		})
	}
}
export const deleteInactiveUsers = async (req, res) => {
	const now = new Date()
	const cutoff = new Date(now.getTime() - 30 * 60 * 1000) // 30 minutos para pruebas

	try {
		const users = await userManager.getAllUsers()
		const deletedUsers = users.filter((user) => user.lastLogin < cutoff)

		for (const user of deletedUsers) {
			await userManager.deleteUser(user.id)

			const subject = 'Cuenta eliminada por inactividad'
			const html = `<p>Hola ${user.name},</p><p>Tu cuenta ha sido eliminada por inactividad.</p>`
			await sendEmail(user.email, subject, html)
		}

		res.status(200).json({
			message: 'Usuarios inactivos eliminados exitosamente',
			count: deletedUsers.length,
		})
	} catch (error) {
		logger.error(`Error al eliminar usuarios inactivos: ${error.message}`)
		res
			.status(500)
			.json({ message: 'Error al eliminar usuarios inactivos', error })
	}
	res.status(500).json({
		msg: `Error interno del servidor en userController.deleteInactiveUsers: ${error}`,
	})
}

export const getUserById = async (req, res) => {
	try {
		const { id } = req.params
		const user = await userManager.getUserById(id)
		if (user) {
			res.status(200).json({ user })
		} else {
			res.status(404).json({ error: `Usuario con id: ${id} no encontrado` })
		}
	} catch (error) {
		logger.error(`Error getting user by ID: ${error.message}`)
		res.status(500).json({
			msg: `Error interno del servidor en userController.getUserById: ${error}`,
		})
	}
}

export const createUser = async (req, res) => {
	try {
		const newUser = req.body
		const result = await userManager.createUser(newUser)
		res.status(201).json({ result })
	} catch (error) {
		logger.error(`Error creating user: ${error.message}`)
		res.status(500).json({
			msg: `Error interno del servidor en userController.createUser: ${error}`,
		})
	}
}

export const updateUser = async (req, res) => {
	try {
		const userId = req.params.id
		const userData = req.body
		const updatedUser = await userManager.updateUser(userId, userData)

		if (!updatedUser) {
			return res.status(404).json({
				status: 'error',
				message: 'User not found',
			})
		}

		res.status(200).json({
			status: 'success',
			message: 'User updated successfully',
			user: updatedUser,
		})
	} catch (error) {
		logger.error(`Error al actualizar el usuario ${error}`)
		res.status(500).json({
			msg: `Error interno del servidor en userController.updatedUser: ${error}`,
		})
	}
}

export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params
		if (!id) {
			return res.status(400).json({ error: 'ID de usuario no proporcionado' })
		}
		const deletedUser = await userManager.deleteUser(id)
		if (deletedUser) {
			res.status(200).json({ message: 'Usuario eliminado exitosamente' })
		} else {
			res.status(404).json({ error: 'Usuario no encontrado' })
		}
	} catch (error) {
		logger.error(`Error al eliminar el usuario: ${error}`)
		res.status(500).json({
			msg: `Error interno del servidor en userController.deleteUser: ${error}`,
		})
	}
}

export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await authManager.login({ email, password })
		if (user.token) {
			res
				.cookie('token', user.token, {
					httpOnly: true,
				})
				.send({ status: 'success', message: user.message })
		}
	} catch (error) {
		logger.error(`Error al intentar iniciar sesión ${error}`)
		res.status(500).json({
			msg: `Error interno del servidor en userController.loginUser: ${error}`,
		})
	}
}

export const getCurrentUser = async (req, res) => {
	try {
		const user = await userManager.getUserById(req.user.id)
		const userDTO = {
			id: user._id,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			age: user.age,
			rol: user.rol,
		}
		res.status(200).json(userDTO)
	} catch (error) {
		logger.error(`Error al obtener el usuario actual: ${error}`)
		res.status(500).json({
			msg: `Error interno del servidor en userController.getCurrentUser: ${error}`,
		})
	}
}

export const logoutUser = async (req, res) => {
	try {
		res.clearCookie('token')
		res.cookie('token', '', {
			httpOnly: true,
			expires: new Date(),
		})
		res.status(200).json({ message: 'Se deslogueo correctamente' })
	} catch (error) {
		logger.error(`Error al intentar cerrar sesión ${error}`)
		res.status(500).json({
			msg: `Error interno del servidor en userController.logoutUser: ${error}`,
		})
	}
}

export const changeUserRole = async (req, res) => {
	try {
		const { id } = req.params
		if (!id) {
			return res.status(400).json({ error: 'ID de usuario no proporcionado' })
		}
		const user = await userManager.getUserById(id)
		if (!user) {
			return res.status(404).json({ error: 'Usuario no encontrado' })
		}
		const newRole = user.rol === 'user' ? 'premium' : 'user'
		user.rol = newRole
		await user.save()
		res.status(200).json({ message: `Rol del usuario cambiado a ${newRole}` })
	} catch (error) {
		logger.error(`Error al cambiar el rol del usuario: ${error}`)
		res.status(500).json({
			msg: `Error interno del servidor en userController.changeUserRole: ${error}`,
		})
	}
}

export const uploadDocuments = async (req, res) => {
	try {
		const { id } = req.params
		const user = await userManager.getUserById(id)
		if (!user) {
			return res.status(404).send('Usuario no encontrado')
		}

		// Aplanar los archivos en un solo arreglo
		const filesArray = Object.values(req.files).flat()

		const documents = filesArray.map((file) => ({
			name: file.fieldname,
			reference: `/uploads/${file.filename}`,
		}))

		user.documents.push(...documents)
		await user.save()

		res.send({ status: 'success', message: 'Documentos subidos exitosamente' })
	} catch (error) {
		logger.error(`Error al cargar el documento ${error}`)
		res.status(500).json({
			msg: `Error interno del servidor en userController.uploadDocuments: ${error}`,
		})
	}
}

export const updateToPremium = async (req, res) => {
	try {
		const { id } = req.params
		const user = await userManager.getUserById(id)
		if (!user) {
			return res.status(404).send('Usuario no encontrado')
		}

		const requiredDocs = [
			'Identificación',
			'Comprobante de domicilio',
			'Comprobante de estado de cuenta',
		]
		const uploadedDocs = user.documents.map((doc) => doc.name)

		const hasAllDocuments = requiredDocs.every((doc) =>
			uploadedDocs.includes(doc),
		)

		if (!hasAllDocuments) {
			return res
				.status(400)
				.send(
					'No se han subido todos los documentos necesarios para actualizar a premium',
				)
		}

		user.rol = 'premium'
		await user.save()

		res.send({ status: 'success', message: 'Usuario actualizado a premium' })
	} catch (error) {
		logger.error(`Error al actualizar a premium ${error}`)
		res
			.status(500)
			.json({
				msg: `Error interno del servidor en userController.updateToPremium: ${error}`,
			})
	}
}
