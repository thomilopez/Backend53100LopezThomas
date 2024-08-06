import { createHash } from '../utils.js'
import userModel from '../persistencia/models/usersDTO.js'

export default class UserManager {
	constructor() {
		console.log('Constructor UserManager')
	}

	getAllUsers = async () => {
		try {
			const result = await userModel.find()
			return result
		} catch (error) {
			console.error(`Error al obtener todos los usuarios: ${error}`)
			throw new Error('Error al obtener todos los usuarios')
		}
	}

	getUserById = async (id) => {
		try {
			const user = await userModel.findById(id)
			return user
		} catch (error) {
			console.error(`Error al obtener el usuario por ID: ${error}`)
			throw new Error('Error al obtener el usuario por ID')
		}
	}

	getByEmail = async (email) => {
		try {
			const result = await userModel.findOne({ email })
			return result
		} catch (error) {
			console.error(`Error al obtener el usuario por email: ${error}`)
			throw new Error('Error al obtener el usuario por email')
		}
	}

	createUser = async (userData) => {
		try {
			userData.password = createHash(userData.password)
			const result = await userModel.create(userData)
			return result
		} catch (error) {
			console.error(`Error al crear el usuario: ${error}`)
			throw new Error('Error al crear el usuario')
		}
	}

	updateUser = async (id, userData) => {
		try {
			if (userData.password) {
				userData.password = createHash(userData.password)
			}
			const result = await userModel.updateOne({ _id: id }, { $set: userData })
			return result
		} catch (error) {
			console.error(`Error al actualizar el usuario: ${error}`)
			throw new Error('Error al actualizar el usuario')
		}
	}

	deleteUser = async (id) => {
		try {
			const result = await userModel.deleteOne({ _id: id })
			return result
		} catch (error) {
			console.error(`Error al eliminar el usuario: ${error}`)
			throw new Error('Error al eliminar el usuario')
		}
	}

	// Buscar con carritos incluidos
	getAllUsersWithCart = async () => {
		try {
			const users = await userModel.find().populate('cart.product')
			return users
		} catch (error) {
			console.error(`Error al obtener los usuarios con carrito: ${error}`)
			throw new Error('Error al obtener los usuarios con carrito')
		}
	}

	// Paginación
	getPaginatedUsers = async (page = 1, limit = 10) => {
		try {
			const options = {
				page: Number.parseInt(page),
				limit: Number.parseInt(limit),
			}
			const users = await userModel.paginate({}, options)
			return users
		} catch (error) {
			console.error(`Error al realizar la paginación: ${error}`)
			throw new Error('Error al realizar la paginación')
		}
	}
}
