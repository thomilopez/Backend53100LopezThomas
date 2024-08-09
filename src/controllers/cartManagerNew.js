import cartModel from '../persistencia/models/cartsDTO.js'
import productModel from '../persistencia/models/productsDTO.js'
import logger from '../middlewares/logger.js'

export default class CartManagerNew {
	constructor() {
		logger.info('Trabajando con cartManager')
	}
	async updateCart(cartId, updatedData) {
		try {
			const { products } = updatedData
			if (
				!products ||
				!Array.isArray(products) ||
				products.some((p) => !p.productId || !p.quantity)
			) {
				throw new Error('Invalid products data structure')
			}
			const result = await cartModel.findByIdAndUpdate(
				cartId,
				{ products },
				{ new: true, runValidators: true },
			)

			if (!result) {
				throw new Error('Cart not found')
			}

			return result
		} catch (error) {
			logger.error('Error updating cart:', error)
			throw error
		}
	}

	updateProductQuantity = async (cid, pid, quantity) => {
		try {
			const cart = await cartModel.findById(cid)
			if (!cart) {
				throw new Error('Carrito no encontrado')
			}
			if (quantity <= 0) {
				throw new Error('La cantidad debe ser mayor que cero')
			}
			const cartProduct = cart.products.find(
				(item) => item.productId && item.productId.toString() === pid,
			)
			if (!cartProduct) {
				throw new Error('Producto no encontrado en el carrito')
			}
			cartProduct.quantity = quantity
			await cart.save()
			return cart
		} catch (error) {
			logger.error(
				'Error al actualizar la cantidad del producto:',
				error.message,
			)
			throw new Error('No se pudo actualizar la cantidad del producto')
		}
	}

	// Eliminar todos los productos del carrito
	deleteAllProducts = async (cid) => {
		try {
			const cart = await cartModel.findById(cid)
			if (!cart) throw new Error('Carrito no encontrado')
			cart.products = []
			return await cart.save()
		} catch (error) {
			logger.error('Error al eliminar todos los productos del carrito:', error)
			return null
		}
	}

	getCartById = async (id) => {
		try {
			const result = await cartModel.findById(id)
			return result
		} catch (error) {
			logger.error('Error al buscar')
		}
	}

	createCart = async (userId) => {
		try {
			const newCart = new cartModel({ userId, products: [] })
			await newCart.save()

			return newCart
		} catch (error) {
			logger.error('Error al crear el carrito:', error)
			throw new Error('No se pudo crear el carrito')
		}
	}

	async getCartByUserId(userId) {
		try {
			const cart = await cartModel.findOne({ userId })
			return cart
		} catch (error) {
			logger.error('Error al obtener el carrito por userID:', error.message)
			throw new Error('No se pudo obtener el carrito')
		}
	}

	getProductById = async (id) => {
		try {
			const product = await productModel.findById(id)
			if (!product) {
				throw new Error('Producto no encontrado')
			}
			return product
		} catch (error) {
			logger.error('Error al obtener el producto por ID:', error)
			throw new Error('No se pudo encontrar el producto')
		}
	}

	addProductToCartB = async (userId, cartId, productId, quantity) => {
		try {
			const cart = await cartModel.findById(cartId)

			if (!cart) {
				throw new Error('Carrito no encontrado')
			}
			if (cart.userId.toString() !== userId.toString()) {
				throw new Error('El carrito no pertenece a este usuario')
			}

			const productIndex = cart.products.findIndex(
				(p) => p.productId.toString() === productId,
			)
			if (productIndex > -1) {
				cart.products[productIndex].quantity += Number.parseInt(quantity)
			} else {
				cart.products.push({ productId, quantity: Number.parseInt(quantity) })
			}

			return await cart.save()
		} catch (error) {
			logger.error('Error al agregar el producto al carrito:', error)
			throw new Error('No se pudo agregar el producto al carrito')
		}
	}

	addProductToCart = async (cid, pid, quantity, user) => {
		try {
			if (quantity <= 0) {
				throw new Error('La cantidad debe ser mayor que cero')
			}
			const cart = await cartModel.findById(cid)
			if (!cart) {
				throw new Error('Carrito no encontrado')
			}
			const product = await productModel.findById(pid)
			if (!product) {
				throw new Error('Producto no encontrado')
			}
			if (user.rol === 'premium' && product.owner === user.email) {
				throw new Error('No puedes agregar tu propio producto al carrito')
			}
			const cartProduct = cart.products.find(
				(item) => item.productId.toString() === pid,
			)
			if (cartProduct) {
				cartProduct.quantity += quantity
			} else {
				cart.products.push({ productId: pid, quantity })
			}
			await cart.save()
			return cart
		} catch (error) {
			logger.error('Error al agregar producto al carrito:', error.message)
			throw new Error('No se pudo agregar el producto al carrito')
		}
	}

	deleteProduct = async (cid, pid) => {
		try {
			const cart = await cartModel.findById(cid)
			if (!cart) {
				throw new Error('Carrito no encontrado')
			}
			const productIndex = cart.products.findIndex(
				(item) => item.productId && item.productId.toString() === pid,
			)
			if (productIndex === -1) {
				throw new Error('Producto no encontrado en el carrito')
			}
			cart.products.splice(productIndex, 1)
			await cart.save()
			return cart
		} catch (error) {
			logger.error('Error al eliminar producto del carrito:', error.message)
			throw new Error('No se pudo eliminar el producto del carrito')
		}
	}
}
