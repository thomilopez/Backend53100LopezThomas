import productModel from '../persistencia/models/productsDTO.js'
import logger from '../middlewares/logger.js'

export default class ProductManagerNew {
	constructor() {
		logger.info('Trabajando con ProductManager')
	}

	getAll = async (limit) => {
		try {
			const result = await productModel.find().limit(limit)
			return result
		} catch (error) {
			logger.error('Error al obtener todos los productos:', error)
			throw new Error('No se pudieron obtener todos los productos')
		}
	}

	getById = async (id) => {
		try {
			const product = await productModel.findById(id)
			return product
		} catch (error) {
			logger.error('Error al buscar el producto por ID:', error)
			throw new Error('No se pudo encontrar el producto')
		}
	}

	getByBrand = async (brand) => {
		try {
			const result = await productModel.find({ brand: brand })
			return result
		} catch (error) {
			logger.error('Error al buscar productos por marca:', error)
			throw new Error('No se pudieron obtener los productos por marca')
		}
	}

	addProduct = async (productData, user) => {
		// Verificamos si el usuario tiene rol válido
		if (user.rol !== 'premium' && user.rol !== 'admin') {
			throw new Error(
				'Solo los usuarios premium y admin pueden crear productos',
			)
		}
		productData.owner = user.email
		return await productModel.create(productData)
	}

	updateProduct = async (id, productData) => {
		try {
			const result = await productModel.updateOne(
				{ _id: id },
				{ $set: productData },
			)
			return result
		} catch (error) {
			logger.error('Error al actualizar el producto:', error)
			throw new Error('No se pudo actualizar el producto')
		}
	}

	deleteProduct = async (productId, user) => {
		const product = await productModel.findById(productId)
		if (!product) {
			throw new Error('Producto no encontrado')
		}
		if (user.rol !== 'admin' && product.owner !== user.email) {
			throw new Error('No tiene permisos para eliminar este producto')
		}
		return await productModel.findByIdAndDelete(productId)
	}
}
