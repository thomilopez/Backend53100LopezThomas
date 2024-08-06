import express from 'express'
import {
	deleteProductFromCart,
	updateCart,
	updateProductQuantity,
	deleteAllProducts,
	createCart,
	getCartById,
	addProductToCart,
	purchaseCart,
	addProductToCartB,
	getCart,
} from '../controllers/controllersRouter/cartController.js'
import AuthorizationMiddleware from '../middlewares/authorizationMiddleware.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const cartsRouter = express.Router()

// Ruta para eliminar un producto del carrito
cartsRouter.delete(
	'/:cid/products/:pid',
	authenticate,
	AuthorizationMiddleware.isUser,
	deleteProductFromCart,
)

// Ruta para actualizar el carrito
cartsRouter.patch(
	'/:cid',
	authenticate,
	AuthorizationMiddleware.isUser,
	updateCart,
)

// Ruta para actualizar la cantidad de un producto en el carrito
cartsRouter.patch(
	'/:cid/products/:pid',
	authenticate,
	AuthorizationMiddleware.isUser,
	updateProductQuantity,
)

// Ruta para eliminar todos los productos del carrito
cartsRouter.delete(
	'/:cid',
	authenticate,
	AuthorizationMiddleware.isUser,
	deleteAllProducts,
)

cartsRouter.get('/', authenticate, AuthorizationMiddleware.isUser, getCart)

// Ruta para crear un nuevo carrito
cartsRouter.post(
	'/new',
	authenticate,
	AuthorizationMiddleware.isUser,
	createCart,
)

// Ruta para obtener un carrito por su ID
cartsRouter.get(
	'/:cid',
	authenticate,
	AuthorizationMiddleware.isUser,
	getCartById,
)

// Ruta para agregar un producto al carrito
cartsRouter.post(
	'/:cid/product/:pid',
	authenticate,
	AuthorizationMiddleware.isUser,
	addProductToCart,
)

// Ruta para agregar un producto al carrito por front
cartsRouter.post(
	'/add/:id',
	authenticate,
	AuthorizationMiddleware.isUser,
	addProductToCartB,
)

cartsRouter.post('/checkout', authenticate, purchaseCart)

cartsRouter.post(
	'/:cid/purchase',
	authenticate,
	AuthorizationMiddleware.isUser,
	purchaseCart,
)

export default cartsRouter
