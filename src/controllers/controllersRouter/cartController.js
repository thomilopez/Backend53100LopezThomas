import CartManagerNew from '../cartManagerNew.js'
import io from '../../app.js'
import TicketManager from '../ticketManager.js'
import ProductsDAO from '../../persistencia/DAO/productsDAO.js'
import { CustomError, errorTypes } from '../../utils.js'
import logger from '../../middlewares/logger.js'

const ticketManager = new TicketManager()
const cartManager = new CartManagerNew()
const productsDAO = new ProductsDAO()

export const deleteProductFromCart = async (req, res, next) => {
	try {
		const { cid, pid } = req.params
		await cartManager.deleteProduct(cid, pid)
		res.json({ message: 'Producto eliminado del carrito exitosamente.' })
	} catch (error) {
		logger.error(`Error en eliminar producto del carrito: ${error.message}`)
		next(
			CustomError.createCustomError(
				'CartNotFoundError',
				error.message,
				errorTypes.ERROR_NOT_FOUND,
			),
		)
	}
}

export const updateCart = async (req, res, next) => {
	try {
		const { cid } = req.params
		const products = req.body.products
		await cartManager.updateCart(cid, products)
		res.json({ message: 'Carrito actualizado exitosamente.' })
	} catch (error) {
		logger.error(`Error en actualizar el carrito: ${error.message}`)
		next(
			CustomError.createCustomError(
				'CartUpdateError',
				error.message,
				errorTypes.ERROR_DATA,
			),
		)
	}
}

export const getCart = async (req, res) => {
	try {
		const userId = req.user.id
		const cart = await cartManager.getCartByUserId(userId)

		if (!cart) {
			return res.status(404).json({ message: 'Carrito no encontrado' })
		}
		const items = await Promise.all(
			cart.products.map(async (item) => {
				const product = await cartManager.getProductById(item.productId)
				return {
					product: {
						title: product.title,
						price: product.price,
					},
					quantity: item.quantity,
				}
			}),
		)

		res.json({ items })
	} catch (error) {
		res.status(500).json({ error: 'Error al obtener el carrito' })
	}
}

export const updateProductQuantity = async (req, res, next) => {
	try {
		const { cid, pid } = req.params
		const { quantity } = req.body
		if (quantity <= 0) {
			throw CustomError.createCustomError(
				'InvalidProductQuantityError',
				'Quantity must be greater than zero',
				errorTypes.ERROR_INVALID_ARGUMENTS,
			)
		}
		await cartManager.updateProductQuantity(cid, pid, quantity)
		res.json({ message: 'Cantidad de producto actualizada exitosamente.' })
	} catch (error) {
		logger.error(
			`Error en actualizar la cantidad del producto: ${error.message}`,
		)
		next(error)
	}
}

export const deleteAllProducts = async (req, res, next) => {
	try {
		const { cid } = req.params
		await cartManager.deleteAllProducts(cid)
		res.json({
			message: 'Todos los productos del carrito han sido eliminados.',
		})
	} catch (error) {
		logger.error(`Error en eliminar los productos: ${error.message}`)
		next(
			CustomError.createCustomError(
				'CartNotFoundError',
				error.message,
				errorTypes.ERROR_NOT_FOUND,
			),
		)
	}
}

export const createCart = async (req, res, next) => {
	try {
		const userId = req.user._id
		const newCart = await cartManager.createCart(userId)
		io.emit('cartCreated', newCart)
		res.json(newCart)
	} catch (error) {
		logger.error(`Error en crear carrito: ${error.message}`)
		next(
			CustomError.createCustomError(
				'CartCreationError',
				error.message,
				errorTypes.ERROR_INTERNAL_ERROR,
			),
		)
	}
}
export const getCartById = async (req, res, next) => {
	try {
		const cartId = req.params.cid
		const cart = await cartManager.getCartById(cartId)
		if (!cart) {
			throw CustomError.createCustomError(
				'CartNotFoundError',
				'Cart not found',
				errorTypes.ERROR_NOT_FOUND,
			)
		}
		res.json(cart)
	} catch (error) {
		logger.error(`Error en obtener el carrito por ID: ${error.message}`)
		next(error)
	}
}

export const addProductToCart = async (req, res, next) => {
	try {
		const cartId = req.params.cid
		const productId = req.params.pid
		const quantity = req.body.quantity || 1
		const user = req.user
		if (!user) {
			return res.status(401).json({ error: 'Usuario no autenticado' })
		}

		const result = await cartManager.addProductToCart(
			cartId,
			productId,
			quantity,
			user,
		)
		res.json({ message: 'Producto agregado al carrito exitosamente.', result })
	} catch (error) {
		logger.error(`Error en agregar el producto al carrito: ${error.message}`)
		next(
			CustomError.createCustomError(
				'CartAdditionError',
				error.message,
				errorTypes.ERROR_DATA,
			),
		)
	}
}

export const addProductToCartB = async (req, res) => {
	const { id } = req.params
	const { quantity } = req.body
	const userId = req.user._id
	try {
		let cart = await cartManager.getCartByUserId(userId)
		if (!cart) {
			cart = await cartManager.createCart(userId)
		}
		const product = await cartManager.getProductById(id)
		if (!product) {
			return res
				.status(404)
				.json({ status: 'error', message: 'Producto no encontrado' })
		}
		await cartManager.addProductToCartB(cart._id, id, quantity)
		res.json({ status: 'success', message: 'Producto agregado al carrito' })
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: 'Error al agregar el producto al carrito',
		})
	}
}
export const purchaseCart = async (req, res, next) => {
	try {
		const cartId = req.params.cid
		const userId = req.user._id

		const cart = await cartManager.getCartById(cartId)
		if (!cart) {
			throw CustomError.createCustomError(
				'CartNotFoundError',
				'Cart not found',
				errorTypes.ERROR_NOT_FOUND,
			)
		}

		const productsToProcess = []

		// Verificar el stock de los productos en el carrito
		for (const product of cart.products) {
			const productInStock = await productsDAO.getProductById(product.productId)
			if (productInStock.stock >= product.quantity) {
				// Restar la cantidad del producto del stock
				await productsDAO.updateProduct(product.productId, {
					stock: productInStock.stock - product.quantity,
				})
			} else {
				// Agregar el producto a la lista de productos que no se pudieron procesar
				productsToProcess.push(product.productId)
			}
		}

		// Calcular el monto total del ticket
		let totalAmount = 0
		for (const product of cart.products) {
			if (!productsToProcess.includes(product.productId)) {
				const productInStock = await productsDAO.getProductById(
					product.productId,
				)
				totalAmount += product.quantity * productInStock.price
			}
		}

		if (Number.isNaN(totalAmount) || totalAmount <= 0) {
			throw new Error('Invalid total amount for the ticket')
		}

		if (!userId) {
			throw new Error('Purchaser information is missing')
		}

		// Crear el ticket de compra
		const newTicket = await ticketManager.createTicket({
			amount: totalAmount,
			purchaser: userId,
		})

		// Actualizar el carrito con los productos que no se pudieron procesar
		const updatedCart = await cartManager.updateCart(cartId, {
			products: cart.products.filter(
				(product) => !productsToProcess.includes(product.productId),
			),
		})

		res.status(200).json({
			ticket: newTicket,
			unprocessedProducts: productsToProcess,
			cart: updatedCart,
		})
	} catch (error) {
		logger.error(`Error purchasing cart: ${error.message}`)
		next(
			CustomError.createCustomError(
				'PurchaseError',
				error.message,
				errorTypes.ERROR_INTERNAL_ERROR,
			),
		)
	}
}
