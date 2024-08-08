import ProductManagerNew from '../productManagerNew.js'
import { CustomError, errorTypes } from '../../utils.js'
import logger from '../../middlewares/logger.js'
import productModel from '../../persistencia/models/productsDTO.js'
import { sendEmail } from '../../utils.js'

const productManager = new ProductManagerNew()

export const getProductsPaginated = async (req, res, next) => {
	const { page = 1, limit = 10, sort, query } = req.query
	try {
		const options = {
			page: Number.parseInt(page),
			limit: Number.parseInt(limit),
			sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
		}
		const result = await productModel.paginate({}, options)
		res.json({
			status: 'success',
			payload: result.docs,
			totalPages: result.totalPages,
			prevPage: result.hasPrevPage ? result.prevPage : null,
			nextPage: result.hasNextPage ? result.nextPage : null,
			page: result.page,
			hasPrevPage: result.hasPrevPage,
			hasNextPage: result.hasNextPage,
			prevLink: result.hasPrevPage
				? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${query}`
				: null,
			nextLink: result.hasNextPage
				? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${query}`
				: null,
		})
	} catch (error) {
		logger.error(`Error getting paginated products: ${error.message}`)
		next(
			CustomError.createCustomError(
				'ProductPaginationError',
				'Error al obtener los productos paginados.',
				errorTypes.ERROR_INTERNAL_ERROR,
			),
		)
		res.status(500).json({
			msg: `Error interno del servidor en productController.getProductsPaginated: ${error}`,
		})
	}
}

export const getProducts = async (req, res) => {
	try {
		const products = await productModel.find({})
		res.json({ products })
	} catch (error) {
		console.error('Error al obtener los productos:', error)
		res.status(500).json({
			msg: `Error interno del servidor en productController.getProducts: ${error}`,
		})
	}
}

export const getProductById = async (req, res, next) => {
	try {
		const productId = req.params.pid
		const product = await productManager.getById(productId)
		if (product) {
			res.json(product)
		} else {
			throw CustomError.createCustomError(
				'ProductNotFoundError',
				'Producto no encontrado.',
				errorTypes.ERROR_NOT_FOUND,
			)
		}
	} catch (error) {
		logger.error(`Error getting product by ID: ${error.message}`)
		next(error)
		res.status(500).json({
			msg: `Error interno del servidor en productController.getProductById: ${error}`,
		})
	}
}

export const addProduct = async (req, res, next) => {
	try {
		const newProduct = req.body
		const user = req.user
		await productManager.addProduct(newProduct, user)
		res.json({ message: 'Producto agregado exitosamente.', newProduct })
	} catch (error) {
		logger.error(`Error creating product: ${error.message}`)
		next(
			CustomError.createCustomError(
				'ProductCreationError',
				error.message,
				errorTypes.ERROR_INVALID_ARGUMENTS,
			),
		)
		res.status(500).json({
			msg: `Error interno del servidor en productController.addProduct: ${error}`,
		})
	}
}

export const updateProduct = async (req, res, next) => {
	try {
		const productId = req.params.pid
		const updatedFields = req.body
		await productManager.updateProduct(productId, updatedFields)
		res.json({ message: 'Producto actualizado exitosamente.', updatedFields })
	} catch (error) {
		logger.error(`Error updating product: ${error.message}`)
		next(
			CustomError.createCustomError(
				'ProductUpdateError',
				error.message,
				errorTypes.ERROR_DATA,
			),
		)
		res.status(500).json({
			msg: `Error interno del servidor en productController.updateProduct: ${error}`,
		})
	}
}

export const deleteProduct = async (req, res, next) => {
	try {
		const productId = req.params.pid
		const product = await productManager.getById(productId)

		if (!product) {
			throw CustomError.createCustomError(
				'ProductNotFoundError',
				'Producto no encontrado.',
				errorTypes.ERROR_NOT_FOUND,
			)
		}

		const owner = await userManager.getUserById(product.ownerId)

		if (owner && owner.role === 'premium') {
			const subject = 'Producto eliminado'
			const html = `Hola ${owner.name}, tu producto ${product.name} ha sido eliminado.`
			await sendEmail(owner.email, subject, html)
		}

		await productManager.deleteProduct(productId)
		res.json({ message: 'Producto eliminado exitosamente.' })
	} catch (error) {
		logger.error(`Error deleting product: ${error.message}`)
		next(
			CustomError.createCustomError(
				'ProductDeletionError',
				error.message,
				errorTypes.ERROR_DATA,
			),
		)
		res.status(500).json({
			msg: `Error interno del servidor en productController.deleteProduct: ${error}`,
		})
	}
}
